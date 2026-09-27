import { describe, expect, it } from 'vitest';
import { CommandDispatcher } from '../../src/application/commands';
import { EconomyLedger } from '../../src/domain/economy/ledger';
import { LifecycleCoordinator } from '../../src/app/lifecycle/LifecycleCoordinator';
import { InventoryManager } from '../../src/domain/inventory/InventoryManager';
import { ProductionManager } from '../../src/domain/production/ProductionManager';
import { SimulationClock } from '../../src/domain/time/clock';
import { SaveRecoveryError, SaveService, type SaveStorage } from '../../src/infrastructure/save/SaveService';

class MemorySaveStorage implements SaveStorage {
  private readonly values = new Map<string, string>();
  failNextWrite = false;
  partialNextWrite = false;

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    if (this.failNextWrite) {
      this.failNextWrite = false;
      throw new Error('disk full');
    }
    if (this.partialNextWrite) {
      this.partialNextWrite = false;
      this.values.set(key, value.slice(0, -8));
      return;
    }
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

describe('P0-06 durable save and lifecycle', () => {
  it('restores the latest complete transaction and does not journal a duplicate ID twice', () => {
    const storage = new MemorySaveStorage();
    const save = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' });

    save.checkpoint({ tick: 0, payload: { balanceAtoms: 100, stock: 2 } });
    expect(
      save.appendTransaction({
        transactionId: 'sale-1',
        type: 'COMPLETE_SALE',
        tick: 1,
        event: { result: { amountAtoms: 25 } },
        payload: { balanceAtoms: 125, stock: 1 },
      })
    ).toMatchObject({ sequence: 1, duplicate: false });
    expect(
      save.appendTransaction({
        transactionId: 'sale-1',
        type: 'COMPLETE_SALE',
        tick: 1,
        payload: { balanceAtoms: 150, stock: 0 },
      })
    ).toMatchObject({ sequence: 1, duplicate: true });

    const restored = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' }).load();
    expect(restored.payload).toEqual({ balanceAtoms: 125, stock: 1 });
    expect(restored.sequence).toBe(1);
    expect(restored.transactions[0]?.event).toEqual({ result: { amountAtoms: 25 } });
  });

  it('keeps the last complete journal record and reports a torn final record', () => {
    const storage = new MemorySaveStorage();
    const save = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' });
    save.appendTransaction({
      transactionId: 'transfer-1',
      type: 'TRANSFER_STOCK',
      tick: 4,
      payload: { source: 2, target: 3 },
    });
    const journalKey = 'p0.journal';
    storage.setItem(journalKey, `${storage.getItem(journalKey)}{"sequence":2`);

    const restored = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' }).load();
    expect(restored.payload).toEqual({ source: 2, target: 3 });
    expect(restored.recovery?.kind).toBe('truncated-journal-tail');
  });

  it('loads a verified backup when the primary snapshot checksum is damaged', () => {
    const storage = new MemorySaveStorage();
    const options = { namespace: 'p0', contentVersion: 'p0.1' };
    const save = new SaveService(storage, options);
    save.checkpoint({ tick: 12, payload: { balanceAtoms: 500 } });
    storage.setItem('p0.snapshot', '{"schemaVersion":1}');

    const restored = new SaveService(storage, options).load();
    expect(restored.payload).toEqual({ balanceAtoms: 500 });
    expect(restored.sequence).toBe(0);
    expect(restored.recovery?.kind).toBe('used-backup');
  });

  it('never turns two invalid snapshots into a fresh empty save', () => {
    const storage = new MemorySaveStorage();
    const options = { namespace: 'p0', contentVersion: 'p0.1' };
    new SaveService(storage, options).checkpoint({ tick: 0, payload: { balanceAtoms: 500 } });
    storage.setItem('p0.snapshot', '{broken');
    storage.setItem('p0.backup', '{broken');

    expect(() => new SaveService(storage, options).load()).toThrow(SaveRecoveryError);
  });

  it('compacts journal only after both checkpoint copies verify', () => {
    const storage = new MemorySaveStorage();
    const options = { namespace: 'p0', contentVersion: 'p0.1' };
    const save = new SaveService(storage, options);
    save.checkpoint({ tick: 0, payload: { balanceAtoms: 500 } });
    save.appendTransaction({
      transactionId: 'credit-1',
      type: 'CREDIT_ACCOUNT',
      tick: 2,
      payload: { balanceAtoms: 700 },
    });
    expect(storage.getItem('p0.journal')).not.toBeNull();

    expect(save.checkpoint({ tick: 3, payload: { balanceAtoms: 700 } })).toEqual({ sequence: 1, compacted: true });
    expect(storage.getItem('p0.journal')).toBeNull();
    const restored = new SaveService(storage, options).load();
    expect(restored.payload).toEqual({ balanceAtoms: 700 });
    expect(restored.sequence).toBe(1);
  });

  it('restores a transfer and suppresses its repeated transaction after reload', () => {
    const storage = new MemorySaveStorage();
    const save = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' });
    const ledger = new EconomyLedger(0);
    const inventory = new InventoryManager();
    const source = { kind: 'source', ownerId: 'source.spring_water' } as const;
    const shelf = { kind: 'shelf', ownerId: 'shelf.front' } as const;
    inventory.addLot({
      id: 'water-lot',
      itemId: 'item.raw_water',
      quantity: 2,
      qualityScore: 40,
      unitCostAtoms: 0,
      sourceId: 'source.spring_water',
      location: source,
    });
    let durableWrites = 0;
    const persist = (command: { transactionId: string; type: string; timestampTick: number }) => {
      durableWrites += 1;
      save.appendTransaction({
        transactionId: command.transactionId,
        type: command.type,
        tick: command.timestampTick,
        payload: { ledger: ledger.serialize(), inventory: inventory.serialize() },
      });
    };
    const command = {
      type: 'TRANSFER_STOCK' as const,
      transactionId: 'transfer-once',
      timestampTick: 4,
      source,
      target: shelf,
      itemId: 'item.raw_water' as const,
      quantity: 1,
    };
    new CommandDispatcher(ledger, inventory, persist).execute(command);
    const stored = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' }).load();
    const payload = stored.payload as {
      ledger: ReturnType<EconomyLedger['serialize']>;
      inventory: ReturnType<InventoryManager['serialize']>;
    };
    const restoredLedger = new EconomyLedger(0);
    const restoredInventory = new InventoryManager();
    restoredLedger.restore(payload.ledger);
    restoredInventory.restore(payload.inventory);
    const restoredResult = new CommandDispatcher(restoredLedger, restoredInventory, persist).execute(command);

    expect('isDuplicate' in restoredResult && restoredResult.isDuplicate).toBe(true);
    expect(restoredInventory.getPhysicalQuantity(source, 'item.raw_water')).toBe(1);
    expect(restoredInventory.getPhysicalQuantity(shelf, 'item.raw_water')).toBe(1);
    expect(durableWrites).toBe(1);
    expect(stored.sequence).toBe(1);
  });

  it('rebuilds the duplicate-sale result from the durable ledger after reload', () => {
    const storage = new MemorySaveStorage();
    const save = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' });
    const ledger = new EconomyLedger(1_000_000);
    const inventory = new InventoryManager();
    const shelf = { kind: 'shelf', ownerId: 'shelf.front' } as const;
    const customer = { kind: 'customer', ownerId: 'customer.1' } as const;
    inventory.addLot({
      id: 'water-lot',
      itemId: 'item.glass_water_small',
      quantity: 1,
      qualityScore: 40,
      unitCostAtoms: 5_000,
      sourceId: 'station.bottler',
      location: shelf,
    });
    let durableWrites = 0;
    const persist = (command: { transactionId: string; type: string; timestampTick: number }) => {
      durableWrites += 1;
      save.appendTransaction({
        transactionId: command.transactionId,
        type: command.type,
        tick: command.timestampTick,
        payload: { ledger: ledger.serialize(), inventory: inventory.serialize() },
      });
    };
    const command = {
      type: 'COMPLETE_SALE' as const,
      transactionId: 'sale-once',
      timestampTick: 5,
      customerId: 'customer.1',
      shelfLocation: shelf,
      customerLocation: customer,
      itemId: 'item.glass_water_small' as const,
      quantity: 1,
      unitPriceAtoms: 15_000,
    };
    const completedSale = new CommandDispatcher(ledger, inventory, persist).execute(command);
    expect('success' in completedSale && completedSale.success).toBe(true);
    const stored = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' }).load();
    const payload = stored.payload as {
      ledger: ReturnType<EconomyLedger['serialize']>;
      inventory: ReturnType<InventoryManager['serialize']>;
    };
    const restoredLedger = new EconomyLedger(0);
    const restoredInventory = new InventoryManager();
    restoredLedger.restore(payload.ledger);
    restoredInventory.restore(payload.inventory);
    const duplicate = new CommandDispatcher(restoredLedger, restoredInventory, persist).execute(command);

    expect('isDuplicate' in duplicate && duplicate.isDuplicate).toBe(true);
    expect(restoredLedger.getBalanceAtoms()).toBe(1_015_000);
    expect(restoredInventory.getPhysicalQuantity(shelf, 'item.glass_water_small')).toBe(0);
    expect(durableWrites).toBe(1);
    expect(stored.sequence).toBe(1);
  });

  it('does not apply or acknowledge a sale when the journal write fails before writing', () => {
    const storage = new MemorySaveStorage();
    const save = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' });
    const ledger = new EconomyLedger(1_000_000);
    const inventory = new InventoryManager();
    const shelf = { kind: 'shelf', ownerId: 'shelf.front' } as const;
    const customer = { kind: 'customer', ownerId: 'customer.1' } as const;
    inventory.addLot({
      id: 'water-lot',
      itemId: 'item.glass_water_small',
      quantity: 1,
      qualityScore: 40,
      unitCostAtoms: 5_000,
      sourceId: 'station.bottler',
      location: shelf,
    });
    const dispatcher = new CommandDispatcher(ledger, inventory, (command, result) => {
      save.appendTransaction({
        transactionId: command.transactionId,
        type: command.type,
        tick: command.timestampTick,
        event: { command, result },
        payload: { ledger: ledger.serialize(), inventory: inventory.serialize() },
      });
    });
    storage.failNextWrite = true;

    expect(() =>
      dispatcher.execute({
        type: 'COMPLETE_SALE',
        transactionId: 'sale-before-write',
        timestampTick: 5,
        customerId: 'customer.1',
        shelfLocation: shelf,
        customerLocation: customer,
        itemId: 'item.glass_water_small',
        quantity: 1,
        unitPriceAtoms: 15_000,
      })
    ).toThrow('disk full');
    expect(ledger.getBalanceAtoms()).toBe(1_000_000);
    expect(inventory.getPhysicalQuantity(shelf, 'item.glass_water_small')).toBe(1);
    expect(new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' }).load().payload).toBeNull();
  });

  it('does not apply or acknowledge a sale when only a torn journal record is written', () => {
    const storage = new MemorySaveStorage();
    const save = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' });
    const ledger = new EconomyLedger(1_000_000);
    const inventory = new InventoryManager();
    const shelf = { kind: 'shelf', ownerId: 'shelf.front' } as const;
    const customer = { kind: 'customer', ownerId: 'customer.1' } as const;
    inventory.addLot({
      id: 'water-lot',
      itemId: 'item.glass_water_small',
      quantity: 1,
      qualityScore: 40,
      unitCostAtoms: 5_000,
      sourceId: 'station.bottler',
      location: shelf,
    });
    const dispatcher = new CommandDispatcher(ledger, inventory, (command, result) => {
      save.appendTransaction({
        transactionId: command.transactionId,
        type: command.type,
        tick: command.timestampTick,
        event: { command, result },
        payload: { ledger: ledger.serialize(), inventory: inventory.serialize() },
      });
    });
    storage.partialNextWrite = true;

    expect(() =>
      dispatcher.execute({
        type: 'COMPLETE_SALE',
        transactionId: 'sale-during-write',
        timestampTick: 5,
        customerId: 'customer.1',
        shelfLocation: shelf,
        customerLocation: customer,
        itemId: 'item.glass_water_small',
        quantity: 1,
        unitPriceAtoms: 15_000,
      })
    ).toThrow('read back exactly');
    expect(ledger.getBalanceAtoms()).toBe(1_000_000);
    expect(inventory.getPhysicalQuantity(shelf, 'item.glass_water_small')).toBe(1);
    const recovered = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' }).load();
    expect(recovered.payload).toBeNull();
    expect(recovered.recovery?.kind).toBe('truncated-journal-tail');
  });

  it('does not expose a successful command when the durable journal write fails', () => {
    const storage = new MemorySaveStorage();
    const save = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' });
    const ledger = new EconomyLedger(0);
    const dispatcher = new CommandDispatcher(ledger, undefined, (command) => {
      save.appendTransaction({
        transactionId: command.transactionId,
        type: command.type,
        tick: command.timestampTick,
        payload: { ledger: ledger.serialize() },
      });
    });
    storage.failNextWrite = true;

    expect(() =>
      dispatcher.execute({
        type: 'CREDIT_ACCOUNT',
        transactionId: 'credit-1',
        timestampTick: 1,
        amountAtoms: 20_000,
        reason: 'SALE',
      })
    ).toThrow('disk full');
    expect(ledger.getBalanceAtoms()).toBe(0);
    expect(ledger.getEntries()).toHaveLength(0);
  });

  it('persists a completed production source result and restores it without duplicating stock', () => {
    const storage = new MemorySaveStorage();
    const save = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' });
    const ledger = new EconomyLedger(1_000_000);
    const inventory = new InventoryManager();
    let production: ProductionManager;
    production = new ProductionManager(inventory, ledger, [], (commit) => {
      save.appendTransaction({
        transactionId: commit.transactionId,
        type: commit.type,
        tick: commit.tick,
        event: commit,
        payload: {
          ledger: ledger.serialize(),
          inventory: inventory.serialize(),
          production: production.serialize(),
        },
      });
    });

    for (let tick = 1; tick <= 20; tick += 1) production.tick(tick);
    const stored = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' }).load();
    expect(stored.sequence).toBe(1);

    const restoredLedger = new EconomyLedger(0);
    const restoredInventory = new InventoryManager();
    const restoredProduction = new ProductionManager(restoredInventory, restoredLedger);
    const payload = stored.payload as {
      ledger: ReturnType<EconomyLedger['serialize']>;
      inventory: ReturnType<InventoryManager['serialize']>;
      production: ReturnType<ProductionManager['serialize']>;
    };
    restoredLedger.restore(payload.ledger);
    restoredInventory.restore(payload.inventory);
    restoredProduction.restore(payload.production);

    const spring = { kind: 'source', ownerId: 'source.spring_water' } as const;
    expect(restoredInventory.getPhysicalQuantity(spring, 'item.raw_water')).toBe(1);
    for (let tick = 21; tick <= 39; tick += 1) restoredProduction.tick(tick);
    expect(restoredInventory.getPhysicalQuantity(spring, 'item.raw_water')).toBe(1);
    restoredProduction.tick(40);
    expect(restoredInventory.getPhysicalQuantity(spring, 'item.raw_water')).toBe(2);
  });

  it('journals a finished recipe with its energy debit and output as one restored result', () => {
    const storage = new MemorySaveStorage();
    const save = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' });
    const ledger = new EconomyLedger(1_000_000);
    const inventory = new InventoryManager();
    const input = { kind: 'machineInput', ownerId: 'station.bottler' } as const;
    const output = { kind: 'machineOutput', ownerId: 'station.bottler' } as const;
    inventory.setCapacity(input, 40);
    inventory.setCapacity(output, 20);
    inventory.addLot({
      id: 'raw-water',
      itemId: 'item.raw_water',
      quantity: 1,
      qualityScore: 40,
      unitCostAtoms: 0,
      sourceId: 'source.spring_water',
      location: input,
    });
    inventory.addLot({
      id: 'small-bottle',
      itemId: 'item.small_bottle',
      quantity: 1,
      qualityScore: 40,
      unitCostAtoms: 2_000,
      sourceId: 'initial_supplies',
      location: input,
    });
    const machine = {
      id: 'station.bottler',
      typeId: 'station.bottler' as const,
      gridPosition: { x: 12, z: 22 },
      direction: 0 as const,
      level: 1,
      selectedRecipeId: 'recipe.bottle_glass_water_small' as const,
      status: 'Idle' as const,
      batch: null,
      energyCostAtoms: 300,
    };
    let production: ProductionManager;
    production = new ProductionManager(inventory, ledger, [machine], (commit) => {
      save.appendTransaction({
        transactionId: commit.transactionId,
        type: commit.type,
        tick: commit.tick,
        event: commit,
        payload: {
          ledger: ledger.serialize(),
          inventory: inventory.serialize(),
          production: production.serialize(),
        },
      });
    });
    production.selectRecipe('station.bottler', 'recipe.bottle_glass_water_small');
    for (let tick = 1; tick <= 30; tick += 1) production.tick(tick);

    const stored = new SaveService(storage, { namespace: 'p0', contentVersion: 'p0.1' }).load();
    expect(stored.sequence).toBe(2);
    const payload = stored.payload as {
      ledger: ReturnType<EconomyLedger['serialize']>;
      inventory: ReturnType<InventoryManager['serialize']>;
      production: ReturnType<ProductionManager['serialize']>;
    };
    const restoredLedger = new EconomyLedger(0);
    const restoredInventory = new InventoryManager();
    restoredLedger.restore(payload.ledger);
    restoredInventory.restore(payload.inventory);
    const restoredProduction = new ProductionManager(restoredInventory, restoredLedger, [machine]);
    restoredProduction.restore(payload.production);
    restoredProduction.tick(31);

    expect(restoredInventory.getPhysicalQuantity(output, 'item.glass_water_small')).toBe(1);
    expect(restoredLedger.getBalanceAtoms()).toBe(999_700);
    expect(restoredProduction.getMachine('station.bottler')?.batch).toBeNull();
  });

  it('rolls back an output mutation when production cannot append its durable record', () => {
    const ledger = new EconomyLedger(1_000_000);
    const inventory = new InventoryManager();
    const production = new ProductionManager(inventory, ledger, [], () => {
      throw new Error('journal unavailable');
    });

    for (let tick = 1; tick < 20; tick += 1) production.tick(tick);
    expect(() => production.tick(20)).toThrow('journal unavailable');
    expect(
      inventory.getPhysicalQuantity({ kind: 'source', ownerId: 'source.spring_water' }, 'item.raw_water')
    ).toBe(0);
    expect(production.getMachine('source.spring_water')?.progressTicks).toBe(19);
  });

  it('pauses once across duplicate background signals and resumes only after every pause reason clears', () => {
    const clock = new SimulationClock();
    const checkpoints: number[] = [];
    const lifecycle = new LifecycleCoordinator(clock, () => checkpoints.push(clock.getTick()));

    clock.update(60, () => undefined);
    lifecycle.setPlatformActive('visibility', false);
    lifecycle.setPlatformActive('pagehide', false);
    lifecycle.setPlatformActive('visibility', false);
    expect(checkpoints).toHaveLength(1);
    expect(clock.update(5_000, () => undefined)).toBe(0);

    lifecycle.setPlatformActive('pageshow', true);
    expect(clock.getPaused()).toBe(true);
    lifecycle.setPlatformActive('visibility', true);
    lifecycle.setPlatformActive('pagehide', true);
    expect(clock.getPaused()).toBe(false);

    lifecycle.setUiPaused(true);
    lifecycle.setPlatformActive('visibility', false);
    lifecycle.setPlatformActive('visibility', true);
    expect(clock.getPaused()).toBe(true);
    lifecycle.setUiPaused(false);
    expect(clock.getPaused()).toBe(false);
  });

  it('stops the rest of a catch-up frame when a tick callback pauses the clock', () => {
    const clock = new SimulationClock();
    const ticks: number[] = [];

    const executed = clock.update(500, (tick) => {
      ticks.push(tick);
      if (tick === 1) clock.pause();
    });

    expect(executed).toBe(1);
    expect(ticks).toEqual([1]);
  });

  it('does not resume the simulation after a lifecycle checkpoint error', () => {
    const clock = new SimulationClock();
    const lifecycle = new LifecycleCoordinator(clock, () => {
      throw new Error('storage unavailable');
    });

    lifecycle.setPlatformActive('visibility', false);
    lifecycle.setPlatformActive('visibility', true);

    expect(lifecycle.isSaveBlocked()).toBe(true);
    expect(clock.getPaused()).toBe(true);
    expect(clock.update(2_000, () => undefined)).toBe(0);
  });
});
