import { describe, expect, it, vi } from 'vitest';
import { CommandDispatcher } from '../../src/application/commands';
import { runDurableCustomerTick } from '../../src/application/DurableCustomerTick';
import { CustomerManager } from '../../src/domain/customer/CustomerManager';
import { EconomyLedger } from '../../src/domain/economy/ledger';
import { InventoryManager } from '../../src/domain/inventory/InventoryManager';

function setup() {
  const inventory = new InventoryManager();
  const ledger = new EconomyLedger(0);
  inventory.addLot({ id: 'small-water', itemId: 'item.glass_water_small', quantity: 1,
    qualityScore: 40, unitCostAtoms: 0, sourceId: 'test',
    location: { kind: 'shelf', ownerId: 'fixture.sales_shelf' } });
  const customers = new CustomerManager(inventory, ledger, new CommandDispatcher(ledger, inventory), 1, {
    shelfServicePos: { x: 0, z: 0 }, checkoutServicePos: { x: 0, z: 0 },
    checkoutQueueWaitPos: { x: 0, z: 0 }, entrancePos: { x: 0, z: 0 },
  });
  vi.spyOn((customers as any).rng, 'nextInt').mockReturnValue(0);
  vi.spyOn((customers as any).rng, 'nextFloat').mockReturnValue(0);
  const capture = () => ({ inventory: inventory.serialize(), ledger: ledger.serialize(), customers: customers.serialize() });
  return { inventory, ledger, customers, capture };
}

describe('durable P0 customer tick', () => {
  it('logs shelf pickup and a single sale with the matching customer state', async () => {
    const { inventory, ledger, customers, capture } = setup();
    const journal: ReturnType<typeof capture>[] = [];
    const append = async (transaction: { payload: ReturnType<typeof capture> }) => { journal.push(transaction.payload); };
    await runDurableCustomerTick(1, customers, inventory, ledger, capture, append);
    expect(journal).toHaveLength(1);
    expect(journal[0].customers.customers[0].basketLotId).not.toBeNull();
    runDurableCustomerTick(2, customers, inventory, ledger, capture, append);
    await runDurableCustomerTick(3, customers, inventory, ledger, capture, append);
    expect(journal).toHaveLength(2);
    expect(journal[1].customers.completedSales).toHaveLength(1);
    expect(ledger.getBalanceAtoms()).toBe(15_000);
    expect(inventory.getPhysicalQuantity({ kind: 'shelf', ownerId: 'fixture.sales_shelf' })).toBe(0);
  });

  it('rolls back a failed sale write and can retry without a duplicate credit', async () => {
    const { inventory, ledger, customers, capture } = setup();
    const append = async () => {};
    await runDurableCustomerTick(1, customers, inventory, ledger, capture, append);
    runDurableCustomerTick(2, customers, inventory, ledger, capture, append);
    await expect(runDurableCustomerTick(3, customers, inventory, ledger, capture,
      async () => { throw new Error('disk full'); })).rejects.toThrow('disk full');
    expect(ledger.getBalanceAtoms()).toBe(0);
    expect(customers.getCompletedSales()).toHaveLength(0);
    await runDurableCustomerTick(3, customers, inventory, ledger, capture, append);
    expect(ledger.getBalanceAtoms()).toBe(15_000);
    expect(customers.getCompletedSales()).toHaveLength(1);
  });
});
