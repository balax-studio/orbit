import { describe, expect, it } from 'vitest';
import { WORLD_LAYOUT_VERSION, migrateWorldSavePayload } from '../../src/application/worldLayoutMigration';

describe('world layout save migration', () => {
  it('scales saved player, worker route and placement coordinates once while preserving gameplay state', () => {
    const legacy = {
      playerPosition: { x: 14.5, z: 24.5 },
      ledger: { balanceAtoms: 1234 },
      worldModules: { activeModuleIds: ['R3-C0', 'R3-C1'] },
      worker: {
        id: 'worker.shelf.1', position: { x: 13.5, z: 23 }, blockedReason: null,
        task: {
          id: 'restock-1', reservationId: 'restock-1:reserve',
          source: { kind: 'machineOutput', ownerId: 'station.bottler' },
          target: { kind: 'shelf', ownerId: 'fixture.sales_shelf' },
          sourcePosition: { x: 13.5, z: 22.5 }, targetPosition: { x: 13.5, z: 26.3 },
          itemId: 'item.glass_water_small', quantity: 1, phase: 'toSource',
        },
      },
      placement: { shelfCell: { x: 13, z: 26 }, committedTransactions: ['move-1'] },
    };

    const result = migrateWorldSavePayload(legacy);

    expect(result.migrated).toBe(true);
    expect(result.payload).toMatchObject({
      playerPosition: { x: 29, z: 49 },
      ledger: { balanceAtoms: 1234 },
      worldModules: { activeModuleIds: ['R3-C0', 'R3-C1'] },
      placement: { shelfCell: { x: 26, z: 52 }, committedTransactions: ['move-1'] },
      worker: {
        position: { x: 27, z: 46 },
        task: { sourcePosition: { x: 27, z: 45 }, targetPosition: { x: 27, z: 52.6 } },
      },
      worldLayoutVersion: WORLD_LAYOUT_VERSION,
    });
  });

  it('does not migrate an already current save twice', () => {
    const current = { worldLayoutVersion: WORLD_LAYOUT_VERSION, playerPosition: { x: 29, z: 49 } };
    expect(migrateWorldSavePayload(current)).toEqual({ payload: current, migrated: false });
  });

  it('rejects unsupported future layout versions without rewriting coordinates', () => {
    expect(() => migrateWorldSavePayload({ worldLayoutVersion: WORLD_LAYOUT_VERSION + 1,
      playerPosition: { x: 29, z: 49 } })).toThrow('Unsupported world layout version');
  });
});
