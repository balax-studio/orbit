import { describe, expect, it } from 'vitest';
import { DeliveryManager } from '../../src/domain/supply/DeliveryManager';
import { InventoryManager } from '../../src/domain/inventory/InventoryManager';
import { EconomyLedger } from '../../src/domain/economy/ledger';

describe('A2 Delivery System', () => {
  it('deducts funds and adds order to pending', () => {
    const inventory = new InventoryManager();
    const ledger = new EconomyLedger(5000); // 50.00 kredi (5000 atom)
    const deliveryManager = new DeliveryManager(inventory, ledger);

    const order = deliveryManager.placeOrder('item.fodder', 10, 200, 1000, 200);

    expect(order.itemId).toBe('item.fodder');
    expect(order.status).toBe('PENDING');
    expect(order.arrivalTick).toBe(1200);
    
    // 200 * 10 = 2000 atom kesilmiş olmalı
    expect(ledger.getBalanceAtoms()).toBe(3000);
    expect(deliveryManager.getPendingOrders().length).toBe(1);
  });

  it('rejects order if insufficient funds', () => {
    const inventory = new InventoryManager();
    const ledger = new EconomyLedger(1000);
    const deliveryManager = new DeliveryManager(inventory, ledger);

    expect(() => deliveryManager.placeOrder('item.fodder', 10, 200, 1000))
      .toThrow('Yetersiz bakiye');
  });

  it('delivers order when tick reaches arrival tick', () => {
    const inventory = new InventoryManager();
    const ledger = new EconomyLedger(5000);
    const deliveryManager = new DeliveryManager(inventory, ledger);

    deliveryManager.placeOrder('item.fodder', 10, 200, 1000, 20);

    // Başlangıçta depoda yok
    expect(inventory.getPhysicalQuantity({ kind: 'storage', ownerId: 'fixture.delivery_pad' }, 'item.fodder')).toBe(0);

    deliveryManager.step(1010);
    expect(inventory.getPhysicalQuantity({ kind: 'storage', ownerId: 'fixture.delivery_pad' }, 'item.fodder')).toBe(0);
    expect(deliveryManager.getPendingOrders().length).toBe(1);

    // Süre dolduğunda teslim edilir
    deliveryManager.step(1020);
    
    expect(inventory.getPhysicalQuantity({ kind: 'storage', ownerId: 'fixture.delivery_pad' }, 'item.fodder')).toBe(10);
    expect(deliveryManager.getPendingOrders().length).toBe(0);
  });
});
