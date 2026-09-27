import {
  SaveService,
  type SaveLoadResult,
  type SaveServiceOptions,
  type SaveStorage,
  type SaveTransaction,
  type SaveWriteResult,
} from './SaveService';
import type { AsyncSaveStorage } from './CapacitorFilesystemSaveStorage';

const SUFFIXES = ['snapshot', 'backup', 'candidate', 'journal'] as const;

/** Serializes native save operations and verifies each completed filesystem write. */
export class AsyncSaveService<T> {
  private queue: Promise<void> = Promise.resolve();
  private readonly storage: AsyncSaveStorage;
  private readonly options: SaveServiceOptions;

  constructor(
    storage: AsyncSaveStorage,
    options: SaveServiceOptions
  ) {
    this.storage = storage;
    this.options = options;
  }

  load(): Promise<SaveLoadResult<T>> {
    return this.enqueue(async () => (await this.readState()).service.load());
  }

  appendTransaction(transaction: SaveTransaction<T>): Promise<SaveWriteResult> {
    return this.enqueue(async () => {
      const { service, memory } = await this.readState();
      const loaded = service.load();
      if (loaded.recovery) {
        throw new Error(`Save requires recovery before another transaction: ${loaded.recovery.detail}`);
      }
      const key = this.key('journal');
      const prior = memory.getItem(key) ?? '';
      const result = service.appendTransaction(transaction);
      if (result.duplicate) return result;
      const next = memory.getItem(key);
      if (!next?.startsWith(prior)) throw new Error('Journal prefix changed unexpectedly');
      await this.storage.appendItem(key, next.slice(prior.length));
      await this.verify(key, next);
      return result;
    });
  }

  checkpoint(input: { tick: number; payload: T }): Promise<{ sequence: number; compacted: boolean }> {
    return this.enqueue(async () => {
      const { service, memory } = await this.readState();
      service.load();
      const result = service.checkpoint(input);
      const expected = memory.getItem(this.key('snapshot'));
      if (!expected) throw new Error('Checkpoint did not produce a snapshot');
      for (const suffix of ['candidate', 'backup', 'snapshot'] as const) {
        const key = this.key(suffix);
        await this.storage.setItem(key, expected);
        await this.verify(key, expected);
      }
      let compacted = false;
      try {
        await this.storage.removeItem(this.key('journal'));
        compacted = (await this.storage.getItem(this.key('journal'))) === null;
      } catch {
        // A verified snapshot safely covers the retained journal.
      }
      try {
        await this.storage.removeItem(this.key('candidate'));
      } catch {
        // A verified candidate can be retained for recovery.
      }
      return { sequence: result.sequence, compacted };
    });
  }

  private async readState(): Promise<{ service: SaveService<T>; memory: MemorySaveStorage }> {
    const memory = new MemorySaveStorage();
    for (const suffix of SUFFIXES) {
      const key = this.key(suffix);
      const value = await this.storage.getItem(key);
      if (value !== null) memory.setItem(key, value);
    }
    return { service: new SaveService<T>(memory, this.options), memory };
  }

  private async verify(key: string, expected: string): Promise<void> {
    if ((await this.storage.getItem(key)) !== expected) {
      throw new Error(`Native save write verification failed for ${key}`);
    }
  }

  private key(suffix: (typeof SUFFIXES)[number]): string {
    return `${this.options.namespace}.${suffix}`;
  }

  private enqueue<R>(operation: () => Promise<R>): Promise<R> {
    const result = this.queue.then(operation, operation);
    this.queue = result.then(() => undefined, () => undefined);
    return result;
  }
}

class MemorySaveStorage implements SaveStorage {
  private readonly data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }
}
