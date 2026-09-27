import { describe, expect, it } from 'vitest';
import { CommandDispatcher } from '../../src/application/commands';
import { ShelfWorkerManager } from '../../src/application/ShelfWorkerManager';
import { InventoryManager } from '../../src/domain/inventory/InventoryManager';
import { EconomyLedger } from '../../src/domain/economy/ledger';
import { SaveService, type SaveStorage } from '../../src/infrastructure/save/SaveService';
import { WorldLayout } from '../../src/presentation/world/WorldLayout';

class Storage implements SaveStorage {
  private files = new Map<string, string>();
  getItem(key: string): string | null { return this.files.get(key) ?? null; }
  setItem(key: string, value: string): void { this.files.set(key, value); }
  removeItem(key: string): void { this.files.delete(key); }
}

function setup(walkable = WorldLayout.isWalkable.bind(WorldLayout)) {
  const storage = new Storage();
  const save = new SaveService(storage, { namespace: 'worker-test', contentVersion: 'p0.1' });
  const inventory = new InventoryManager();
  const ledger = new EconomyLedger(0);
  const source = { kind: 'machineOutput', ownerId: 'station.bottler' } as const;
  const shelf = { kind: 'shelf', ownerId: 'fixture.sales_shelf' } as const;
  const sourcePosition = WorldLayout.FIXTURES.find((fixture) => fixture.id === source.ownerId)!.serviceCell;
  const targetPosition = WorldLayout.FIXTURES.find((fixture) => fixture.id === shelf.ownerId)!.serviceCell;
  inventory.addLot({ id: 'finished-water', itemId: 'item.glass_water_small', quantity: 1,
    qualityScore: 40, unitCostAtoms: 100, sourceId: 'station.bottler', location: source });
  let worker: ShelfWorkerManager;
  const dispatcher = new CommandDispatcher(ledger, inventory, (command) => {
    save.appendTransaction({ transactionId: command.transactionId, type: command.type,
      tick: command.timestampTick, payload: { inventory: inventory.serialize(), worker: worker.serialize() } });
  });
  worker = new ShelfWorkerManager(inventory, dispatcher, walkable,
    WorldLayout.PLAYER_SPAWN, () => WorldLayout.getWalkableBounds());
  const delegate = () => worker.delegate({ source, target: shelf, itemId: 'item.glass_water_small', quantity: 1,
    sourcePosition, targetPosition }, 1);
  return { storage, save, inventory, dispatcher, worker, source, shelf, delegate };
}

async function advance(worker: ShelfWorkerManager, from: number, until: number): Promise<void> {
  for (let tick = from; tick <= until; tick += 1) await worker.step(tick);
}

describe('P0 shelf worker', () => {
  it('reserves the last product before the player and delivers one physical unit', async () => {
    const { inventory, dispatcher, worker, source, shelf, delegate, save } = setup();
    await delegate();
    expect(inventory.getAvailableQuantity(source, 'item.glass_water_small')).toBe(0);
    expect(() => dispatcher.execute({ type: 'TRANSFER_STOCK', transactionId: 'player-race', timestampTick: 1,
      source, target: { kind: 'player', ownerId: 'player.1' }, itemId: 'item.glass_water_small', quantity: 1 }))
      .toThrow('INSUFFICIENT_STOCK');
    await advance(worker, 2, 120);
    expect(worker.serialize().task).toBeNull();
    expect(inventory.getPhysicalQuantity(source, 'item.glass_water_small')).toBe(0);
    expect(inventory.getPhysicalQuantity(shelf, 'item.glass_water_small')).toBe(1);
    expect(inventory.getPhysicalQuantity({ kind: 'worker', ownerId: 'worker.shelf.1' }, 'item.glass_water_small')).toBe(0);
    expect(inventory.getActiveReservations()).toHaveLength(0);
    expect(save.load().sequence).toBe(3);
  });

  it('restores the carried lot and reservation mid route, then finishes without duplication', async () => {
    const { storage, inventory, worker, delegate, shelf } = setup();
    await delegate();
    for (let tick = 2; tick < 90 && worker.serialize().task?.phase !== 'toTarget'; tick += 1) {
      await worker.step(tick);
    }
    expect(worker.serialize().task?.phase).toBe('toTarget');
    const saved = new SaveService<{ inventory: ReturnType<InventoryManager['serialize']>;
      worker: ReturnType<ShelfWorkerManager['serialize']> }>(storage,
      { namespace: 'worker-test', contentVersion: 'p0.1' }).load();
    const restoredInventory = new InventoryManager();
    restoredInventory.restore(saved.payload!.inventory);
    const restoredWorker = new ShelfWorkerManager(restoredInventory,
      new CommandDispatcher(new EconomyLedger(0), restoredInventory), WorldLayout.isWalkable.bind(WorldLayout),
      WorldLayout.PLAYER_SPAWN, () => WorldLayout.getWalkableBounds());
    restoredWorker.restore(saved.payload!.worker);
    expect(restoredInventory.getPhysicalQuantity({ kind: 'worker', ownerId: 'worker.shelf.1' }, 'item.glass_water_small')).toBe(1);
    expect(restoredInventory.getActiveReservations()).toHaveLength(1);
    await advance(restoredWorker, 90, 180);
    expect(restoredInventory.getPhysicalQuantity(shelf, 'item.glass_water_small')).toBe(1);
    expect(restoredInventory.getPhysicalQuantity({ kind: 'worker', ownerId: 'worker.shelf.1' }, 'item.glass_water_small')).toBe(0);
    expect(inventory.getPhysicalQuantity(shelf, 'item.glass_water_small')).toBe(0);
  });

  it('keeps cargo and reservation when the route becomes blocked', async () => {
    let blocked = false;
    const walkable = (x: number, z: number) => !blocked && WorldLayout.isWalkable(x, z);
    const { inventory, worker, delegate } = setup(walkable);
    await delegate();
    for (let tick = 2; tick < 90 && worker.serialize().task?.phase !== 'toTarget'; tick += 1) {
      await worker.step(tick);
    }
    blocked = true;
    await advance(worker, 90, 110);
    expect(worker.serialize().task?.phase).toBe('toTarget');
    expect(worker.serialize().blockedReason).toMatch(/erişilemiyor|Rota kapalı/);
    expect(inventory.getPhysicalQuantity({ kind: 'worker', ownerId: 'worker.shelf.1' }, 'item.glass_water_small')).toBe(1);
    expect(inventory.getActiveReservations()).toHaveLength(1);
    blocked = false;
    await advance(worker, 111, 200);
    expect(worker.serialize().task).toBeNull();
  });
});
