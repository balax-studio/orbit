import { describe, expect, it, vi } from 'vitest';
import {
  CapacitorFilesystemSaveStorage,
  type CapacitorFilesystemOperations,
} from '../../src/infrastructure/save/CapacitorFilesystemSaveStorage';

function createFilesystem() {
  const files = new Map<string, string>();
  const filesystem: CapacitorFilesystemOperations = {
    readFile: vi.fn(async ({ path }) => {
      const data = files.get(path);
      if (data === undefined) throw new Error(`File at '${path}' does not exist.`);
      return { data };
    }),
    writeFile: vi.fn(async ({ path, data }) => {
      files.set(path, typeof data === 'string' ? data : await data.text());
      return { uri: `data://${path}` };
    }),
    appendFile: vi.fn(async ({ path, data }) => {
      const current = files.get(path);
      if (current === undefined) throw new Error(`File at '${path}' does not exist.`);
      files.set(path, `${current}${data}`);
    }),
    deleteFile: vi.fn(async ({ path }) => {
      if (!files.delete(path)) throw new Error(`File at '${path}' does not exist.`);
    }),
  };
  return { files, filesystem };
}

describe('CapacitorFilesystemSaveStorage', () => {
  it('writes, appends, reads back and removes app-private UTF-8 files', async () => {
    const { files, filesystem } = createFilesystem();
    const storage = new CapacitorFilesystemSaveStorage(filesystem);

    await storage.setItem('orbit.snapshot', '{"sequence":1}');
    await storage.appendItem('orbit.journal', '{"sequence":1}\n');
    await storage.appendItem('orbit.journal', '{"sequence":2}\n');

    expect(await storage.getItem('orbit.snapshot')).toBe('{"sequence":1}');
    expect(await storage.getItem('orbit.journal')).toBe('{"sequence":1}\n{"sequence":2}\n');
    expect([...files.keys()]).toEqual([
      'orbit-market/saves/orbit.snapshot.json',
      'orbit-market/saves/orbit.journal.json',
    ]);

    await storage.removeItem('orbit.snapshot');
    expect(await storage.getItem('orbit.snapshot')).toBeNull();
  });

  it('treats only a missing file as empty and surfaces other filesystem failures', async () => {
    const { filesystem } = createFilesystem();
    const storage = new CapacitorFilesystemSaveStorage(filesystem);
    expect(await storage.getItem('missing')).toBeNull();

    vi.mocked(filesystem.readFile).mockRejectedValueOnce(new Error('Permission denied'));
    await expect(storage.getItem('blocked')).rejects.toThrow('Permission denied');
  });

  it('rejects keys that can escape the private save directory', async () => {
    const { filesystem } = createFilesystem();
    const storage = new CapacitorFilesystemSaveStorage(filesystem);
    await expect(storage.getItem('../outside')).rejects.toThrow('Save storage keys');
  });
});
