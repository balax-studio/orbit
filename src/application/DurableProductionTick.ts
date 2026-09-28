import { EconomyLedger } from '../domain/economy/ledger';
import { InventoryManager } from '../domain/inventory/InventoryManager';
import { ProductionManager } from '../domain/production/ProductionManager';
import type { SaveTransaction } from '../infrastructure/save/SaveService';

/** Returns a pending commit only when a tick creates an economic transition. */
export function runDurableProductionTick<T>(
  tick: number,
  production: ProductionManager,
  inventory: InventoryManager,
  ledger: EconomyLedger,
  capturePayload: () => T,
  append: (transaction: SaveTransaction<T>) => Promise<unknown>
): Promise<void> | null {
  const beforeLedger = ledger.serialize();
  const beforeInventory = inventory.serialize();
  const beforeProduction = production.serialize();
  const rollback = () => {
    ledger.restore(beforeLedger);
    inventory.restore(beforeInventory);
    production.restore(beforeProduction);
  };
  try {
    production.tick(tick);
    const afterProduction = production.serialize();
    const newTransactions = afterProduction.committedTransactions.slice(beforeProduction.committedTransactions.length);
    if (newTransactions.length === 0) return null;

    const transaction: SaveTransaction<T> = {
      transactionId: `production:tick:${tick}`,
      type: 'PRODUCTION_TICK',
      tick,
      event: { transactions: newTransactions },
      payload: capturePayload(),
    };
    return Promise.resolve().then(() => append(transaction)).then(() => undefined, (error: unknown) => {
      rollback();
      throw error;
    });
  } catch (error) {
    rollback();
    throw error;
  }
}
