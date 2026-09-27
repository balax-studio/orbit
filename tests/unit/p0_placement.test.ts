import { describe, expect, it } from 'vitest';
import { PlacementService } from '../../src/application/PlacementService';
import { SaveService, type SaveStorage } from '../../src/infrastructure/save/SaveService';
import { EconomyLedger } from '../../src/domain/economy/ledger';
import { InventoryManager } from '../../src/domain/inventory/InventoryManager';
import { CommandDispatcher } from '../../src/application/commands';
import { ShelfWorkerManager } from '../../src/application/ShelfWorkerManager';
import { SimulationClock } from '../../src/domain/time/clock';
import { LifecycleCoordinator } from '../../src/app/lifecycle/LifecycleCoordinator';
import { WorldLayout } from '../../src/presentation/world/WorldLayout';

class Storage implements SaveStorage {
  private readonly data = new Map<string, string>();
  getItem(key: string): string | null { return this.data.get(key) ?? null; }
  setItem(key: string, value: string): void { this.data.set(key, value); }
  removeItem(key: string): void { this.data.delete(key); }
}

describe('P0 shelf placement', () => {
  it('keeps the default layout and rejects footprint, door, service and actor conflicts', () => {
    const placement = new PlacementService();
    expect(placement.preview({ x: 24, z: 52 })).toEqual({ valid: true, reasons: [], shelfCell: { x: 24, z: 52 } });
    expect(placement.preview({ x: 35, z: 52 }).reasons).toContain('Raf satış odası sınırını aşıyor');
    expect(placement.preview({ x: 24, z: 45 }).reasons.some((reason) => reason.includes('footprint'))).toBe(true);
    expect(placement.preview({ x: 28, z: 55 }).reasons.some((reason) => reason.includes('koridor'))).toBe(true);
    expect(placement.preview({ x: 26, z: 52 }, [{ x: 26.4, z: 52.1 }]).reasons
      .some((reason) => reason.includes('engelin içinde'))).toBe(true);
  });

  it('previews without mutation, then confirms a valid relocation once', async () => {
    const placement = new PlacementService();
    const before = placement.serialize();
    const candidate = { x: 26, z: 52 };
    expect(placement.preview(candidate)).toMatchObject({ valid: true });
    expect(placement.serialize()).toEqual(before);
    let writes = 0;
    expect(await placement.moveShelf({ transactionId: 'move-1', cell: candidate }, async () => { writes += 1; }))
      .toEqual({ duplicate: false });
    expect(placement.serialize().shelfCell).toEqual(candidate);
    expect(await placement.moveShelf({ transactionId: 'move-1', cell: candidate }, async () => { writes += 1; }))
      .toEqual({ duplicate: true });
    expect(writes).toBe(1);
    const restored = new PlacementService();
    restored.restore(placement.serialize());
    expect(restored.getFixtures().find((fixture) => fixture.id === 'fixture.sales_shelf')?.serviceCell)
      .toEqual({ x: 29, z: 52.6 });
  });

  it('rolls back a failed durable commit and never changes cash or inventory', async () => {
    const placement = new PlacementService();
    const ledger = new EconomyLedger(100_000);
    const inventory = new InventoryManager();
    const before = placement.serialize();
    const beforeLedger = ledger.serialize();
    const beforeInventory = inventory.serialize();
    await expect(placement.moveShelf({ transactionId: 'move-failed', cell: { x: 26, z: 52 } },
      async () => { throw new Error('disk full'); })).rejects.toThrow('disk full');
    expect(placement.serialize()).toEqual(before);
    await expect(placement.moveShelf({ transactionId: 'invalid', cell: { x: 28, z: 55 } },
      async () => { throw new Error('must not write'); })).rejects.toThrow('koridor');
    expect(placement.serialize()).toEqual(before);
    expect(ledger.serialize()).toEqual(beforeLedger);
    expect(inventory.serialize()).toEqual(beforeInventory);
  });

  it('replays the confirmed position after load while preserving stock identities', async () => {
    const storage = new Storage();
    const save = new SaveService<{ placement: ReturnType<PlacementService['serialize']> }>(storage,
      { namespace: 'placement-test', contentVersion: 'p0.1' });
    const placement = new PlacementService();
    await placement.moveShelf({ transactionId: 'move-shelf-1', cell: { x: 26, z: 52 } }, async (transactionId) => {
      save.appendTransaction({ transactionId, type: 'MOVE_SHELF', tick: 1,
        payload: { placement: placement.serialize() } });
    });
    const loaded = new SaveService<{ placement: ReturnType<PlacementService['serialize']> }>(storage,
      { namespace: 'placement-test', contentVersion: 'p0.1' }).load();
    const restored = new PlacementService();
    restored.restore(loaded.payload!.placement);
    expect(restored.serialize()).toEqual(placement.serialize());
    expect(loaded.sequence).toBe(1);
  });

  it('compares two valid layouts with the same worker, stock and active tick budget', async () => {
    const measure = async (cell: { x: number; z: number }) => {
      const placement = new PlacementService();
      await placement.moveShelf({ transactionId: 'layout', cell }, async () => {});
      const inventory = new InventoryManager();
      const source = { kind: 'machineOutput', ownerId: 'station.bottler' } as const;
      const shelf = { kind: 'shelf', ownerId: 'fixture.sales_shelf' } as const;
      inventory.addLot({ id: 'same-lot', itemId: 'item.glass_water_small', quantity: 1,
        qualityScore: 40, unitCostAtoms: 100, sourceId: 'station.bottler', location: source });
      const dispatcher = new CommandDispatcher(new EconomyLedger(100_000), inventory);
      const worker = new ShelfWorkerManager(inventory, dispatcher, (x, z) => placement.isWalkable(x, z),
        WorldLayout.PLAYER_SPAWN, () => WorldLayout.getWalkableBounds());
      const fixtures = placement.getFixtures();
      await worker.delegate({ source, target: shelf, itemId: 'item.glass_water_small', quantity: 1,
        sourcePosition: fixtures.find((fixture) => fixture.id === source.ownerId)!.serviceCell,
        targetPosition: fixtures.find((fixture) => fixture.id === shelf.ownerId)!.serviceCell }, 1);
      for (let tick = 2; tick <= 150; tick += 1) {
        await worker.step(tick);
        if (inventory.getPhysicalQuantity(shelf, 'item.glass_water_small') === 1) return tick;
      }
      throw new Error('Shelf did not receive the product within the equal active tick budget');
    };
    const defaultTicks = await measure({ x: 24, z: 52 });
    const movedTicks = await measure({ x: 26, z: 52 });
    expect(defaultTicks).toBeGreaterThan(1);
    expect(movedTicks).toBeGreaterThan(1);
    expect(defaultTicks).not.toBe(movedTicks);
  });

  it('pauses active simulation during preview and cancels without a state change', () => {
    const placement = new PlacementService();
    const clock = new SimulationClock();
    const lifecycle = new LifecycleCoordinator(clock, () => undefined);
    const before = placement.serialize();
    expect(clock.update(100, () => undefined)).toBe(1);
    lifecycle.setUiPaused(true);
    expect(placement.preview({ x: 26, z: 52 }).valid).toBe(true);
    expect(clock.update(5_000, () => undefined)).toBe(0);
    expect(placement.serialize()).toEqual(before);
    lifecycle.setUiPaused(false);
    expect(clock.update(100, () => undefined)).toBe(1);
  });
});
