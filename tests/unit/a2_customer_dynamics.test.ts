import { describe, expect, it } from 'vitest';
import { CustomerManager } from '../../src/domain/customer/CustomerManager';
import { InventoryManager } from '../../src/domain/inventory/InventoryManager';
import { EconomyLedger } from '../../src/domain/economy/ledger';
import { CommandDispatcher } from '../../src/application/commands';

describe('A2 Customer Dynamics & Patience Testing', () => {
  const setup = () => {
    const inventory = new InventoryManager();
    const ledger = new EconomyLedger(500000);
    const dispatcher = new CommandDispatcher(ledger, inventory);
    const cm = new CustomerManager(inventory, ledger, dispatcher, 1234, {
      shelfServicePos: { x: 5, z: 5 },
      checkoutServicePos: { x: 6, z: 6 },
      checkoutQueueWaitPos: { x: 7, z: 7 },
      entrancePos: { x: 0, z: 0 },
      basePatienceTicks: 400,
    });
    return { inventory, ledger, dispatcher, cm };
  };

  it('assigns correct patience and budget according to profile', () => {
    const { cm } = setup();

    const mahalleli = cm.spawnCustomer({ profileId: 'mahalleli', requestedItemId: 'item.glass_water_small' });
    expect(mahalleli.patienceRemainingTicks).toBe(400);
    expect(mahalleli.budgetAtoms).toBe(300_000);

    const arastirmaci = cm.spawnCustomer({ profileId: 'arastirmaci', requestedItemId: 'item.glass_water_small' });
    expect(arastirmaci.patienceRemainingTicks).toBe(600);
    expect(arastirmaci.budgetAtoms).toBe(600_000);

    const isci = cm.spawnCustomer({ profileId: 'isci', requestedItemId: 'item.glass_water_small' });
    expect(isci.patienceRemainingTicks).toBe(200);
    expect(isci.budgetAtoms).toBe(150_000);
  });

  it('rejects purchase if customer budget is lower than retail price (e.g. expensive A2 item)', () => {
    const { cm, inventory } = setup();
    
    // Rafta 1 adet A2 Tereyağı (item.farm_butter - 120_000 Atom) var
    inventory.setCapacity({ kind: 'shelf', ownerId: 'fixture.sales_shelf' }, 10);
    inventory.addLot({
      id: 'lot_butter_1',
      itemId: 'item.farm_butter',
      quantity: 1,
      qualityScore: 100,
      unitCostAtoms: 50_000,
      sourceId: 'src',
      location: { kind: 'shelf', ownerId: 'fixture.sales_shelf' }
    });

    // Müşterinin bütçesini bilerek 100_000 yapalım (120_000 den az)
    const poorCustomer = cm.spawnCustomer({ 
      profileId: 'mahalleli', 
      requestedItemId: 'item.farm_butter',
      budgetAtoms: 100_000 
    });

    const canPick = cm.inspectAndPickFromShelf(poorCustomer.id, 100);
    expect(canPick).toBe(false);
    expect(poorCustomer.phase).toBe('leaving');
    expect(poorCustomer.leaveReason).toBe('BUDGET_REJECTED');

    const lostSales = cm.getLostSales();
    expect(lostSales.length).toBe(1);
    expect(lostSales[0].reason).toBe('BUDGET_REJECTED');
  });

  it('exhausts patience if customer waits too long in queue or shelf', () => {
    const { cm } = setup();

    // İşçi (patience: 200 ticks = 20 sn)
    const isci = cm.spawnCustomer({ 
      profileId: 'isci', 
      requestedItemId: 'item.glass_water_small' 
    });

    isci.phase = 'queued'; // Sırada beklet
    
    // 100 tick geçsin
    for (let i = 0; i < 100; i++) cm.step(i); 
    
    expect(cm.getCustomer(isci.id)?.phase).toBe('queued');
    
    // Toplam 201 tick geçsin, sabrı tükenmeli!
    for (let i = 100; i <= 201; i++) cm.step(i);

    // Müşteri ya 'leaving' phase'inde olmalı ya da yürüyüp silinmiş olmalı.
    // En güvenli kontrol, lostSales listesinde 'PATIENCE_EXHAUSTED' kaydı bulunması.
    const lostSales = cm.getLostSales();
    const exhaustedSale = lostSales.find(s => s.customerId === isci.id && s.reason === 'PATIENCE_EXHAUSTED');
    expect(exhaustedSale).toBeDefined();
  });
});
