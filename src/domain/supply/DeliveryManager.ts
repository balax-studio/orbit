// Orbit Market - Delivery Manager
// Reference: OYUN_GELISTIRME_DEVIR_DOSYASI.md A2 Tedarik Sistemi, KARARLAR.md

import type { EntityId, ItemId, StockLocation } from '../types';
import type { EconomyLedger } from '../economy/ledger';
import type { InventoryManager } from '../inventory/InventoryManager';

export interface DeliveryOrder {
  id: EntityId;
  itemId: ItemId;
  quantity: number;
  totalCostAtoms: number;
  arrivalTick: number;
  status: 'PENDING' | 'DELIVERED';
}

export class DeliveryManager {
  private orders: Map<EntityId, DeliveryOrder> = new Map();
  private orderCounter = 0;
  
  // A2 Mal kabul pedi varsayılan stock lokasyonu
  private deliveryPadLocation: StockLocation = { kind: 'storage', ownerId: 'fixture.delivery_pad' };

  private inventory: InventoryManager;
  private ledger: EconomyLedger;

  constructor(
    inventory: InventoryManager,
    ledger: EconomyLedger
  ) {
    this.inventory = inventory;
    this.ledger = ledger;
    // Delivery pad kapasitesini 500 olarak belirleyelim
    this.inventory.setCapacity(this.deliveryPadLocation, 500);
  }

  /**
   * Oyuncunun yeni bir hammadde siparişi vermesini sağlar.
   */
  public placeOrder(
    itemId: ItemId,
    quantity: number,
    unitCostAtoms: number,
    currentTick: number,
    deliveryDelayTicks: number = 200 // Varsayılan 20 saniye teslimat süresi
  ): DeliveryOrder {
    if (quantity <= 0) {
      throw new Error('Sipariş miktarı sıfırdan büyük olmalıdır.');
    }

    const totalCostAtoms = quantity * unitCostAtoms;
    const currentBalance = this.ledger.getBalanceAtoms();

    if (currentBalance < totalCostAtoms) {
      throw new Error(`Yetersiz bakiye. Gereken: ${totalCostAtoms}, Mevcut: ${currentBalance}`);
    }

    // Parayı çek (Tedarik Gideri)
    this.ledger.commitTransaction({
      transactionId: `order_${currentTick}_${++this.orderCounter}`,
      amountAtoms: totalCostAtoms,
      type: 'DEBIT',
      reason: 'SUPPLY_ORDER',
      timestampTick: currentTick,
    });

    const orderId = `delivery_${this.orderCounter}`;
    const order: DeliveryOrder = {
      id: orderId,
      itemId,
      quantity,
      totalCostAtoms,
      arrivalTick: currentTick + deliveryDelayTicks,
      status: 'PENDING',
    };

    this.orders.set(order.id, order);
    return order;
  }

  /**
   * Her tick çalışarak zamanı gelen siparişleri depoya/pede teslim eder.
   */
  public step(currentTick: number): void {
    for (const order of this.orders.values()) {
      if (order.status === 'PENDING' && currentTick >= order.arrivalTick) {
        // Siparişi teslim et
        this.inventory.addLot({
          id: `lot_${order.id}`,
          itemId: order.itemId,
          quantity: order.quantity,
          qualityScore: 40, // Standart kalite
          unitCostAtoms: Math.round(order.totalCostAtoms / order.quantity),
          sourceId: 'delivery',
          location: this.deliveryPadLocation,
        });
        
        order.status = 'DELIVERED';
      }
    }
  }

  public getPendingOrders(): DeliveryOrder[] {
    return Array.from(this.orders.values()).filter(o => o.status === 'PENDING');
  }

  public serialize(): DeliveryOrder[] {
    return Array.from(this.orders.values()).map(o => ({ ...o }));
  }

  public restore(snapshot: DeliveryOrder[]): void {
    this.orders.clear();
    for (const order of snapshot) {
      this.orders.set(order.id, { ...order });
    }
    const maxId = snapshot.reduce((max, o) => {
      const match = o.id.match(/delivery_(\d+)/);
      if (match) {
        return Math.max(max, parseInt(match[1], 10));
      }
      return max;
    }, 0);
    this.orderCounter = maxId;
  }
}
