export interface SaveStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface SaveServiceOptions {
  namespace: string;
  contentVersion: string;
}

export interface SaveTransaction<T> {
  transactionId: string;
  type: string;
  tick: number;
  payload: T;
  event?: unknown;
}

export interface SaveLoadResult<T> {
  payload: T | null;
  sequence: number;
  tick: number;
  transactions: Array<{
    transactionId: string;
    sequence: number;
    type: string;
    tick: number;
    event?: unknown;
  }>;
  recovery: { kind: 'truncated-journal-tail' | 'used-backup' | 'corrupt-snapshot'; detail: string } | null;
}

export interface SaveWriteResult {
  sequence: number;
  duplicate: boolean;
}

interface SaveEnvelope<T> {
  schemaVersion: 1;
  contentVersion: string;
  sequence: number;
  tick: number;
  committedTransactions: Array<{ transactionId: string; sequence: number }>;
  payload: T;
  checksum: string;
}

interface JournalRecord<T> {
  schemaVersion: 1;
  contentVersion: string;
  sequence: number;
  transactionId: string;
  type: string;
  tick: number;
  event?: unknown;
  payload: T;
  checksum: string;
}

interface SnapshotCandidate<T> {
  key: string;
  value: SaveEnvelope<T>;
  priority: number;
}

export class SaveRecoveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SaveRecoveryError';
  }
}

/** Browser adapter for the current Vite prototype. Native builds inject their own private-data adapter. */
export class BrowserLocalStorageAdapter implements SaveStorage {
  getItem(key: string): string | null {
    return window.localStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    window.localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    window.localStorage.removeItem(key);
  }
}

export class SaveService<T> {
  private readonly storage: SaveStorage;
  private readonly options: SaveServiceOptions;
  private readonly snapshotKey: string;
  private readonly backupKey: string;
  private readonly candidateKey: string;
  private readonly journalKey: string;
  private loaded = false;
  private lastSequence = 0;
  private lastTick = 0;
  private journalRaw = '';
  private readonly committed = new Map<string, number>();

  constructor(
    storage: SaveStorage,
    options: SaveServiceOptions
  ) {
    if (!options.namespace.trim() || !options.contentVersion.trim()) {
      throw new Error('Save namespace and content version are required');
    }
    this.snapshotKey = `${options.namespace}.snapshot`;
    this.backupKey = `${options.namespace}.backup`;
    this.candidateKey = `${options.namespace}.candidate`;
    this.journalKey = `${options.namespace}.journal`;
    this.storage = storage;
    this.options = options;
  }

  load(): SaveLoadResult<T> {
    const snapshotRead = this.readSnapshots();
    const journalRead = this.readJournal();
    const candidates = snapshotRead.candidates;
    const base = candidates.sort((a, b) => b.value.sequence - a.value.sequence || b.priority - a.priority)[0];
    const hadStoredState = snapshotRead.hadStoredState || journalRead.records.length > 0 || journalRead.truncatedTail;

    if (!base && snapshotRead.errors.length > 0 && journalRead.records.length === 0) {
      throw new SaveRecoveryError(`No verified save snapshot is available: ${snapshotRead.errors.join('; ')}`);
    }

    const transactionIds = new Map<string, number>();
    if (base) {
      for (const item of base.value.committedTransactions) {
        transactionIds.set(item.transactionId, item.sequence);
      }
    }

    let sequence = base?.value.sequence ?? 0;
    let tick = base?.value.tick ?? 0;
    let payload: T | null = base ? base.value.payload : null;
    for (const record of journalRead.records) {
      const knownSequence = transactionIds.get(record.transactionId);
      if (knownSequence !== undefined && knownSequence !== record.sequence) {
        throw new SaveRecoveryError(`Transaction ID ${record.transactionId} is recorded at conflicting sequences`);
      }
      transactionIds.set(record.transactionId, record.sequence);

      if (record.sequence <= sequence) continue;
      if (record.sequence !== sequence + 1) {
        throw new SaveRecoveryError(`Journal sequence gap after ${sequence}; found ${record.sequence}`);
      }
      sequence = record.sequence;
      tick = record.tick;
      payload = record.payload;
    }

    if (!base && journalRead.records.length > 0 && journalRead.records[0].sequence !== 1) {
      throw new SaveRecoveryError('Journal starts after sequence 1 and no verified snapshot can anchor it');
    }
    if (hadStoredState && payload === null && !journalRead.truncatedTail) {
      throw new SaveRecoveryError('Save data exists but contains no recoverable state');
    }

    this.committed.clear();
    for (const [transactionId, committedSequence] of transactionIds) {
      this.committed.set(transactionId, committedSequence);
    }
    this.lastSequence = sequence;
    this.lastTick = tick;
    this.journalRaw = journalRead.completePrefix;
    this.loaded = true;

    let recovery: SaveLoadResult<T>['recovery'] = null;
    if (journalRead.truncatedTail) {
      recovery = { kind: 'truncated-journal-tail', detail: 'The incomplete final journal record was ignored.' };
    } else if (base && base.key !== this.snapshotKey) {
      recovery = { kind: 'used-backup', detail: 'The primary snapshot was unavailable; a verified backup was loaded.' };
    } else if (snapshotRead.errors.length > 0) {
      recovery = { kind: 'corrupt-snapshot', detail: snapshotRead.errors.join('; ') };
    }

    return {
      payload,
      sequence,
      tick,
      transactions: journalRead.records.map(({ transactionId, sequence, type, tick: recordTick, event }) => ({
        transactionId,
        sequence,
        type,
        tick: recordTick,
        ...(event === undefined ? {} : { event }),
      })),
      recovery,
    };
  }

  appendTransaction(transaction: SaveTransaction<T>): SaveWriteResult {
    this.ensureLoaded();
    const known = this.committed.get(transaction.transactionId);
    if (known !== undefined) return { sequence: known, duplicate: true };

    if (!transaction.transactionId.trim() || !transaction.type.trim()) {
      throw new Error('Transaction ID and type are required');
    }
    this.assertTick(transaction.tick);
    if (transaction.tick < this.lastTick) throw new Error('Transaction tick cannot move backwards');
    const payload = cloneJson(transaction.payload);
    const sequence = this.lastSequence + 1;
    const recordWithoutChecksum = {
      schemaVersion: 1 as const,
      contentVersion: this.options.contentVersion,
      sequence,
      transactionId: transaction.transactionId,
      type: transaction.type,
      tick: transaction.tick,
      ...(transaction.event === undefined ? {} : { event: cloneJson(transaction.event) }),
      payload,
    };
    const record: JournalRecord<T> = {
      ...recordWithoutChecksum,
      checksum: checksum(recordWithoutChecksum),
    };
    const nextRaw = `${this.journalRaw}${JSON.stringify(record)}\n`;
    this.storage.setItem(this.journalKey, nextRaw);
    if (this.storage.getItem(this.journalKey) !== nextRaw) {
      throw new Error('Journal write could not be read back exactly');
    }

    this.journalRaw = nextRaw;
    this.committed.set(transaction.transactionId, sequence);
    this.lastSequence = sequence;
    this.lastTick = transaction.tick;
    return { sequence, duplicate: false };
  }

  checkpoint(input: { tick: number; payload: T }): { sequence: number; compacted: boolean } {
    this.ensureLoaded();
    this.assertTick(input.tick);
    if (input.tick < this.lastTick) throw new Error('Checkpoint tick cannot move backwards');
    const envelopeWithoutChecksum = {
      schemaVersion: 1 as const,
      contentVersion: this.options.contentVersion,
      sequence: this.lastSequence,
      tick: input.tick,
      committedTransactions: Array.from(this.committed, ([transactionId, sequence]) => ({ transactionId, sequence }))
        .sort((a, b) => a.sequence - b.sequence),
      payload: cloneJson(input.payload),
    };
    const envelope: SaveEnvelope<T> = {
      ...envelopeWithoutChecksum,
      checksum: checksum(envelopeWithoutChecksum),
    };
    const serialized = JSON.stringify(envelope);

    this.storage.setItem(this.candidateKey, serialized);
    this.verifySnapshotWrite(this.candidateKey, serialized);
    this.storage.setItem(this.backupKey, serialized);
    this.verifySnapshotWrite(this.backupKey, serialized);
    this.storage.setItem(this.snapshotKey, serialized);
    this.verifySnapshotWrite(this.snapshotKey, serialized);

    let compacted = false;
    try {
      this.storage.removeItem(this.journalKey);
      compacted = this.storage.getItem(this.journalKey) === null;
    } catch {
      compacted = false;
    }
    try {
      this.storage.removeItem(this.candidateKey);
    } catch {
      // Candidate is safe to keep; load validates its checksum before using it.
    }

    this.lastTick = input.tick;
    this.journalRaw = this.storage.getItem(this.journalKey) ?? '';
    return { sequence: this.lastSequence, compacted };
  }

  private ensureLoaded(): void {
    if (!this.loaded) this.load();
  }

  private assertTick(tick: number): void {
    if (!Number.isSafeInteger(tick) || tick < 0) throw new Error(`Invalid simulation tick: ${tick}`);
  }

  private verifySnapshotWrite(key: string, expectedRaw: string): void {
    const raw = this.storage.getItem(key);
    if (raw !== expectedRaw) throw new Error(`Snapshot write verification failed for ${key}`);
    const parsed = this.parseSnapshot(raw, key);
    if (!parsed.value) throw new Error(`Snapshot could not be verified for ${key}`);
  }

  private readSnapshots(): { candidates: SnapshotCandidate<T>[]; errors: string[]; hadStoredState: boolean } {
    const candidates: SnapshotCandidate<T>[] = [];
    const errors: string[] = [];
    const keys = [
      { key: this.snapshotKey, priority: 3 },
      { key: this.backupKey, priority: 2 },
      { key: this.candidateKey, priority: 1 },
    ];
    let hadStoredState = false;
    for (const item of keys) {
      const raw = this.storage.getItem(item.key);
      if (raw === null) continue;
      hadStoredState = true;
      const parsed = this.parseSnapshot(raw, item.key);
      if (parsed.value) candidates.push({ key: item.key, value: parsed.value, priority: item.priority });
      else errors.push(parsed.error ?? `Invalid snapshot at ${item.key}`);
    }
    return { candidates, errors, hadStoredState };
  }

  private parseSnapshot(raw: string, key: string): { value: SaveEnvelope<T> | null; error?: string } {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!isRecord(parsed)) throw new Error('snapshot is not an object');
      if (parsed.schemaVersion !== 1) throw new Error(`unsupported schema version ${String(parsed.schemaVersion)}`);
      if (parsed.contentVersion !== this.options.contentVersion) {
        throw new Error(`content version mismatch: ${String(parsed.contentVersion)}`);
      }
      if (!Number.isSafeInteger(parsed.sequence) || (parsed.sequence as number) < 0) throw new Error('invalid snapshot sequence');
      if (!Number.isSafeInteger(parsed.tick) || (parsed.tick as number) < 0) throw new Error('invalid snapshot tick');
      if (!Array.isArray(parsed.committedTransactions) || !parsed.payload || typeof parsed.checksum !== 'string') {
        throw new Error('snapshot is missing required data');
      }
      const withoutChecksum = { ...parsed } as Record<string, unknown>;
      delete withoutChecksum.checksum;
      if (checksum(withoutChecksum) !== parsed.checksum) throw new Error('snapshot checksum mismatch');
      const seen = new Set<string>();
      for (const item of parsed.committedTransactions) {
        if (!isRecord(item) || typeof item.transactionId !== 'string' || !Number.isSafeInteger(item.sequence)) {
          throw new Error('invalid committed transaction index');
        }
        if (seen.has(item.transactionId)) throw new Error('duplicate transaction ID in snapshot');
        if ((item.sequence as number) < 1 || (item.sequence as number) > (parsed.sequence as number)) {
          throw new Error('committed transaction sequence is outside snapshot range');
        }
        seen.add(item.transactionId);
      }
      return { value: parsed as unknown as SaveEnvelope<T> };
    } catch (error) {
      return { value: null, error: `${key}: ${error instanceof Error ? error.message : String(error)}` };
    }
  }

  private readJournal(): { records: JournalRecord<T>[]; completePrefix: string; truncatedTail: boolean } {
    const raw = this.storage.getItem(this.journalKey) ?? '';
    if (!raw) return { records: [], completePrefix: '', truncatedTail: false };
    const lines = raw.split('\n');
    const hasTrailingNewline = raw.endsWith('\n');
    const recordLines = hasTrailingNewline ? lines.slice(0, -1) : lines;
    const records: JournalRecord<T>[] = [];
    let completePrefix = '';
    let truncatedTail = false;

    for (let index = 0; index < recordLines.length; index += 1) {
      const line = recordLines[index];
      if (!line) throw new SaveRecoveryError(`Journal contains an empty record at line ${index + 1}`);
      let parsed: unknown;
      try {
        parsed = JSON.parse(line);
      } catch (error) {
        const isUnterminatedTail = index === recordLines.length - 1 && !hasTrailingNewline;
        if (isUnterminatedTail) {
          truncatedTail = true;
          break;
        }
        throw new SaveRecoveryError(`Journal record ${index + 1} is malformed: ${error instanceof Error ? error.message : String(error)}`);
      }
      const record = this.parseJournalRecord(parsed, index + 1);
      records.push(record);
      completePrefix += `${line}\n`;
    }
    return { records, completePrefix, truncatedTail };
  }

  private parseJournalRecord(value: unknown, line: number): JournalRecord<T> {
    if (!isRecord(value)) throw new SaveRecoveryError(`Journal record ${line} is not an object`);
    if (value.schemaVersion !== 1 || value.contentVersion !== this.options.contentVersion) {
      throw new SaveRecoveryError(`Journal record ${line} has an unsupported version`);
    }
    if (!Number.isSafeInteger(value.sequence) || (value.sequence as number) < 1) {
      throw new SaveRecoveryError(`Journal record ${line} has an invalid sequence`);
    }
    if (!Number.isSafeInteger(value.tick) || (value.tick as number) < 0) {
      throw new SaveRecoveryError(`Journal record ${line} has an invalid tick`);
    }
    if (typeof value.transactionId !== 'string' || !value.transactionId.trim() || typeof value.type !== 'string' || !value.type.trim()) {
      throw new SaveRecoveryError(`Journal record ${line} is missing its transaction identity`);
    }
    if (!('payload' in value) || typeof value.checksum !== 'string') {
      throw new SaveRecoveryError(`Journal record ${line} is missing its payload or checksum`);
    }
    const withoutChecksum = { ...value } as Record<string, unknown>;
    delete withoutChecksum.checksum;
    if (checksum(withoutChecksum) !== value.checksum) throw new SaveRecoveryError(`Journal record ${line} checksum mismatch`);
    return value as unknown as JournalRecord<T>;
  }
}

function cloneJson<T>(value: T): T {
  const json = JSON.stringify(value);
  if (json === undefined) throw new Error('Save payload is not JSON serializable');
  return JSON.parse(json) as T;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function checksum(value: unknown): string {
  const bytes = new TextEncoder().encode(canonicalStringify(value));
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, '0');
}

function canonicalStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    const result = JSON.stringify(value);
    if (result === undefined) throw new Error('Value is not JSON serializable');
    return result;
  }
  if (Array.isArray(value)) return `[${value.map((item) => canonicalStringify(item)).join(',')}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalStringify(record[key])}`).join(',')}}`;
}
