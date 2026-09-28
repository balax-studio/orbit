import type { CustomerManager } from '../domain/customer/CustomerManager';
import type { EconomyLedger } from '../domain/economy/ledger';
import type { InventoryManager } from '../domain/inventory/InventoryManager';

export function runDurableCustomerTick<T>(
  tick: number,
  customers: CustomerManager,
  inventory: InventoryManager,
  ledger: EconomyLedger,
  capturePayload: () => T,
  append: (transaction: { transactionId: string; type: string; tick: number; payload: T }) => Promise<unknown>,
): Promise<void> | null {
  const customersBefore = customers.serialize();
  const inventoryBefore = inventory.serialize();
  const ledgerBefore = ledger.serialize();
  try {
    customers.maybeSpawnP0Customer();
    customers.maybeSpawnA2Customer();
    customers.step(tick);
    const changed = inventory.serialize().committedTransactions.length !== inventoryBefore.committedTransactions.length ||
      ledger.serialize().sequenceCounter !== ledgerBefore.sequenceCounter;
    if (!changed) return null;
    const transaction = { transactionId: `customer-tick:${tick}`, type: 'CUSTOMER_TICK', tick,
      payload: capturePayload() };
    return Promise.resolve().then(() => append(transaction)).then(() => undefined).catch((error) => {
      ledger.restore(ledgerBefore);
      inventory.restore(inventoryBefore);
      customers.restore(customersBefore);
      customers.clearTransientSalesAfterRollback();
      throw error;
    });
  } catch (error) {
    ledger.restore(ledgerBefore);
    inventory.restore(inventoryBefore);
    customers.restore(customersBefore);
    customers.clearTransientSalesAfterRollback();
    throw error;
  }
}
