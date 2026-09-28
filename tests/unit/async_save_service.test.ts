import { describe, expect, it } from 'vitest';
import { AsyncSaveService } from '../../src/infrastructure/save/AsyncSaveService';
import type { AsyncSaveStorage } from '../../src/infrastructure/save/CapacitorFilesystemSaveStorage';
import { CommandDispatcher } from '../../src/application/commands';
import { runDurableProductionTick } from '../../src/application/DurableProductionTick';
import { EconomyLedger } from '../../src/domain/economy/ledger';
import { InventoryManager } from '../../src/domain/inventory/InventoryManager';
import { ProductionManager } from '../../src/domain/production/ProductionManager';

class Storage implements AsyncSaveStorage {
  readonly files = new Map<string, string>();
  failReadback = false;
  failAppend = false;

  async getItem(key: string): Promise<string | null> {
    if (this.failReadback && key.endsWith('.journal')) return null;
    return this.files.get(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.files.set(key, value);
  }

  async appendItem(key: string, value: string): Promise<void> {
    if (this.failAppend) throw new Error('disk full');
    this.files.set(key, (this.files.get(key) ?? '') + value);
  }

  async removeItem(key: string): Promise<void> {
    this.files.delete(key);
  }
}

const options = { namespace: 'async-test', contentVersion: 'p0.1' };

describe('AsyncSaveService', () => {
  it('awaits append readback, survives reload, and deduplicates transaction IDs', async () => {
    const storage = new Storage();
    const save = new AsyncSaveService(storage, options);
    expect((await save.load()).payload).toBeNull();
    expect(await save.appendTransaction({ transactionId: 'sale-1', type: 'SALE', tick: 1, payload: { balance: 5 } }))
      .toEqual({ sequence: 1, duplicate: false });
    expect(await new AsyncSaveService(storage, options).load()).toMatchObject({
      payload: { balance: 5 }, sequence: 1,
    });
    expect(await save.appendTransaction({ transactionId: 'sale-1', type: 'SALE', tick: 2, payload: { balance: 99 } }))
      .toEqual({ sequence: 1, duplicate: true });
    expect((await save.load()).payload).toEqual({ balance: 5 });
  });

  it('compacts only after verified snapshots and retains a loadable state', async () => {
    const storage = new Storage();
    const save = new AsyncSaveService(storage, options);
    await save.appendTransaction({ transactionId: 'transfer-1', type: 'TRANSFER', tick: 1, payload: { stock: 2 } });
    expect(await save.checkpoint({ tick: 2, payload: { stock: 2 } })).toEqual({ sequence: 1, compacted: true });
    expect(storage.files.has('async-test.journal')).toBe(false);
    expect((await new AsyncSaveService(storage, options).load()).payload).toEqual({ stock: 2 });
  });

  it('does not confirm an append when its readback fails', async () => {
    const storage = new Storage();
    const save = new AsyncSaveService(storage, options);
    storage.failReadback = true;
    await expect(save.appendTransaction({ transactionId: 'sale-1', type: 'SALE', tick: 1, payload: { balance: 5 } }))
      .rejects.toThrow('verification failed');
    storage.failReadback = false;
    expect((await new AsyncSaveService(storage, options).load()).payload).toEqual({ balance: 5 });
  });

  it('waits for a durable transfer and sale, then reloads each only once', async () => {
    const storage = new Storage();
    const save = new AsyncSaveService(storage, options);
    const ledger = new EconomyLedger(0);
    const inventory = new InventoryManager();
    const source = { kind: 'source', ownerId: 'source.spring_water' } as const;
    const shelf = { kind: 'shelf', ownerId: 'shelf.front' } as const;
    const customer = { kind: 'customer', ownerId: 'customer.1' } as const;
    inventory.addLot({ id: 'water-lot', itemId: 'item.raw_water', quantity: 1, qualityScore: 40,
      unitCostAtoms: 0, sourceId: 'source.spring_water', location: source });
    const dispatcher = new CommandDispatcher(ledger, inventory, undefined, async (command) => {
      await save.appendTransaction({ transactionId: command.transactionId, type: command.type,
        tick: command.timestampTick, payload: { ledger: ledger.serialize(), inventory: inventory.serialize() } });
    });
    await dispatcher.executeAsync({ type: 'TRANSFER_STOCK', transactionId: 'transfer-1', timestampTick: 1,
      source, target: shelf, itemId: 'item.raw_water', quantity: 1 });
    expect(inventory.getPhysicalQuantity(shelf, 'item.raw_water')).toBe(1);
    inventory.transferStock({ transactionId: 'basket-1', timestampTick: 2,
      source: shelf, target: customer, itemId: 'item.raw_water', quantity: 1 });
    const sale = { type: 'COMPLETE_SALE' as const, transactionId: 'sale-1', timestampTick: 2,
      customerId: 'customer.1', shelfLocation: shelf, customerLocation: customer,
      itemId: 'item.raw_water' as const, quantity: 1, unitPriceAtoms: 10_000 };
    await dispatcher.executeAsync(sale);
    const loaded = await new AsyncSaveService(storage, options).load();
    expect(loaded.sequence).toBe(2);
    expect(loaded.payload?.ledger).toEqual(ledger.serialize());
    expect(loaded.payload?.inventory).toEqual(inventory.serialize());
    expect((await dispatcher.executeAsync(sale) as { isDuplicate: boolean }).isDuplicate).toBe(true);
    expect((await save.load()).sequence).toBe(2);
  });

  it('rolls back an async command after storage rejects its append', async () => {
    const storage = new Storage();
    storage.failAppend = true;
    const save = new AsyncSaveService(storage, options);
    const ledger = new EconomyLedger(0);
    const dispatcher = new CommandDispatcher(ledger, undefined, undefined, async (command) => {
      await save.appendTransaction({ transactionId: command.transactionId, type: command.type,
        tick: command.timestampTick, payload: { ledger: ledger.serialize() } });
    });
    await expect(dispatcher.executeAsync({ type: 'CREDIT_ACCOUNT', transactionId: 'credit-1',
      timestampTick: 1, amountAtoms: 10_000, reason: 'SALE' })).rejects.toThrow('disk full');
    expect(ledger.getBalanceAtoms()).toBe(0);
    expect((await save.load()).payload).toBeNull();
  });

  it('journals a critical production tick and replays it without another water unit', async () => {
    const storage = new Storage();
    const save = new AsyncSaveService(storage, options);
    const ledger = new EconomyLedger(1_000_000);
    const inventory = new InventoryManager();
    const production = new ProductionManager(inventory, ledger);
    const capture = () => ({ ledger: ledger.serialize(), inventory: inventory.serialize(), production: production.serialize() });
    for (let tick = 1; tick < 20; tick += 1) {
      expect(runDurableProductionTick(tick, production, inventory, ledger, capture,
        (transaction) => save.appendTransaction(transaction))).toBeNull();
    }
    await runDurableProductionTick(20, production, inventory, ledger, capture,
      (transaction) => save.appendTransaction(transaction));
    const loaded = await new AsyncSaveService(storage, options).load();
    expect(loaded.sequence).toBe(1);
    const restoredLedger = new EconomyLedger(0);
    const restoredInventory = new InventoryManager();
    const restoredProduction = new ProductionManager(restoredInventory, restoredLedger);
    restoredLedger.restore(loaded.payload!.ledger);
    restoredInventory.restore(loaded.payload!.inventory);
    restoredProduction.restore(loaded.payload!.production);
    expect(restoredInventory.getPhysicalQuantity({ kind: 'source', ownerId: 'source.spring_water' }, 'item.raw_water')).toBe(1);
    expect(runDurableProductionTick(20, restoredProduction, restoredInventory, restoredLedger,
      () => ({ ledger: restoredLedger.serialize(), inventory: restoredInventory.serialize(), production: restoredProduction.serialize() }),
      (transaction) => save.appendTransaction(transaction))).toBeNull();
    expect(restoredInventory.getPhysicalQuantity({ kind: 'source', ownerId: 'source.spring_water' }, 'item.raw_water')).toBe(1);
  });

  it('rolls back production state when the native journal append fails', async () => {
    const storage = new Storage();
    storage.failAppend = true;
    const save = new AsyncSaveService(storage, options);
    const ledger = new EconomyLedger(1_000_000);
    const inventory = new InventoryManager();
    const production = new ProductionManager(inventory, ledger);
    const capture = () => ({ ledger: ledger.serialize(), inventory: inventory.serialize(), production: production.serialize() });
    for (let tick = 1; tick < 20; tick += 1) production.tick(tick);
    const before = capture();
    await expect(runDurableProductionTick(20, production, inventory, ledger, capture,
      (transaction) => save.appendTransaction(transaction))).rejects.toThrow('disk full');
    expect(capture()).toEqual(before);
  });
});
