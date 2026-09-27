import {
  Directory,
  Encoding,
  Filesystem,
  type FilesystemPlugin,
} from '@capacitor/filesystem';

export interface AsyncSaveStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  appendItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export type CapacitorFilesystemOperations = Pick<FilesystemPlugin, 'readFile' | 'writeFile' | 'appendFile' | 'deleteFile'>;

/** App-private filesystem adapter. Promise completion is not an fsync guarantee. */
export class CapacitorFilesystemSaveStorage implements AsyncSaveStorage {
  private readonly filesystem: CapacitorFilesystemOperations;
  private readonly directory: Directory;
  private readonly rootPath: string;
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(
    filesystem: CapacitorFilesystemOperations = Filesystem,
    options: { directory?: Directory; rootPath?: string } = {}
  ) {
    this.filesystem = filesystem;
    this.directory = options.directory ?? Directory.Data;
    this.rootPath = normalizeRootPath(options.rootPath ?? 'orbit-market/saves');
  }

  async getItem(key: string): Promise<string | null> {
    const path = this.pathFor(key);
    try {
      const result = await this.filesystem.readFile({
        path,
        directory: this.directory,
        encoding: Encoding.UTF8,
      });
      return typeof result.data === 'string' ? result.data : result.data.text();
    } catch (error) {
      if (isMissingFileError(error)) return null;
      throw error;
    }
  }

  setItem(key: string, value: string): Promise<void> {
    const path = this.pathFor(key);
    return this.enqueueWrite(async () => {
      await this.filesystem.writeFile({
        path,
        directory: this.directory,
        data: value,
        encoding: Encoding.UTF8,
        recursive: true,
      });
    });
  }

  appendItem(key: string, value: string): Promise<void> {
    const path = this.pathFor(key);
    return this.enqueueWrite(async () => {
      const existing = await this.getItem(key);
      if (existing === null) {
        await this.filesystem.writeFile({
          path,
          directory: this.directory,
          data: value,
          encoding: Encoding.UTF8,
          recursive: true,
        });
        return;
      }
      await this.filesystem.appendFile({
        path,
        directory: this.directory,
        data: value,
        encoding: Encoding.UTF8,
      });
    });
  }

  removeItem(key: string): Promise<void> {
    const path = this.pathFor(key);
    return this.enqueueWrite(async () => {
      if ((await this.getItem(key)) === null) return;
      await this.filesystem.deleteFile({ path, directory: this.directory });
    });
  }

  private pathFor(key: string): string {
    if (!/^[a-zA-Z0-9._-]+$/.test(key) || key === '.' || key === '..') {
      throw new Error('Save storage keys may contain only letters, numbers, dot, dash, and underscore');
    }
    return `${this.rootPath}/${key}.json`;
  }

  private enqueueWrite<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.writeQueue.then(operation, operation);
    this.writeQueue = result.then(() => undefined, () => undefined);
    return result;
  }
}

function normalizeRootPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0 || segments.some((segment) => segment === '.' || segment === '..')) {
    throw new Error('Filesystem save root path is invalid');
  }
  return segments.join('/');
}

function isMissingFileError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return /file.+does not exist|file does not exist/i.test(error.message);
}
