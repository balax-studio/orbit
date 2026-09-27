// Orbit Market - P0-04 Sales, Customer Queue & Ledger Integration Tests
// Reference: OYUN_GELISTIRME_DEVIR_DOSYASI.md §7, §26.1, §38, KARARLAR.md D-019, MVP_IMPLEMENTATION_GUIDE.md T-P0-04

import { beforeEach, describe, expect, it } from 'vitest';
import { CommandDispatcher } from '../../src/application/commands';
import { CustomerManager } from '../../src/domain/customer/CustomerManager';
import { EconomyLedger } from '../../src/domain/economy/ledger';
import { InventoryManager } from '../../src/domain/inventory/InventoryManager';
import type { StockLocation, StockLot } from '../../src/domain/types';
import { WorldLayout } from '../../src/presentation/world/WorldLayout';

describe('P0-04: Tek Müşteri, Raf, Kuyruk ve Satış Ledger Akışı', () => {
  let inventory: InventoryManager;
  let ledger: EconomyLedger;
  let dispatcher: CommandDispatcher;
  let customerManager: CustomerManager;

  const shelfLoc: StockLocation = { kind: 'shelf', ownerId: 'fixture.sales_shelf' };
  const checkoutLoc: StockLocation = { kind: 'checkout', ownerId: 'fixture.checkout' };
  const customerConfig = () => ({
    shelfLocation: shelfLoc,
    checkoutLocation: checkoutLoc,
    shelfServicePos: WorldLayout.FIXTURES.find((fixture) => fixture.id === 'fixture.sales_shelf')!.serviceCell,
    checkoutServicePos: WorldLayout.FIXTURES.find((fixture) => fixture.id === 'fixture.checkout')!.serviceCell,
    checkoutQueueWaitPos: { x: 32, z: 46 },
    entrancePos: { x: 29, z: 58 },
  });

  beforeEach(() => {
    inventory = new InventoryManager();
    // Başlangıç sermayesi: 100 Kredi = 1.000.000 atom (§26.1)
    ledger = new EconomyLedger(1_000_000);
    dispatcher = new CommandDispatcher(ledger, inventory);
    customerManager = new CustomerManager(inventory, ledger, dispatcher, 12345, customerConfig());

    // Raf kapasitesi: 20 adet
    inventory.setCapacity(shelfLoc, 20);
  });

  describe('T-P0-04a: Gerçek raf stoku ve kayıtlı fiyat ile atomik satış', () => {
    it('100 kredi nakit + 1 küçük su (1.50 kredi) raftan satıldığında bakiye tam 101.50 kredi olur ve stok 1 azalır', () => {
      // 1. Setup: Rafta 1 adet küçük şişe su (15.000 atom = 1.50 Kredi)
      const waterLot: StockLot = {
        id: 'lot_water_small_1',
        itemId: 'item.glass_water_small',
        quantity: 1,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'station.bottler',
        location: shelfLoc,
      };
      inventory.addLot(waterLot);

      expect(inventory.getPhysicalQuantity(shelfLoc, 'item.glass_water_small')).toBe(1);
      expect(ledger.getBalanceCredits()).toBe(100.0);
      expect(ledger.getBalanceAtoms()).toBe(1_000_000);

      // 2. Müşteri spawn ve raftan ürün seçimi
      const customer = customerManager.spawnCustomer({
        requestedItemId: 'item.glass_water_small',
        budgetAtoms: 300_000, // 30 Kredi bütçe
      });

      const picked = customerManager.inspectAndPickFromShelf(customer.id, 10);
      expect(picked).toBe(true);
      expect(customer.phase).toBe('toCheckout');
      expect(customer.lockedPriceAtoms).toBe(15_000); // 1.50 Kredi kilitlendi
      expect(customer.basketLotId).toBeDefined();

      // Raftaki stok 0'a düşmüş olmalı, ürün müşterinin sepetinde
      expect(inventory.getPhysicalQuantity(shelfLoc, 'item.glass_water_small')).toBe(0);
      const customerLoc: StockLocation = { kind: 'customer', ownerId: customer.id };
      expect(inventory.getPhysicalQuantity(customerLoc, 'item.glass_water_small')).toBe(1);

      // 3. Kuyruğa girme
      customerManager.joinQueue(customer.id);
      expect(customer.phase).toBe('queued');
      expect(customer.queueIndex).toBe(0);

      // 4. Kasa ödemesi (tek atomik transaction)
      const saleResult = customerManager.checkoutCustomer(customer.id, 20);

      expect(saleResult.success).toBe(true);
      expect(saleResult.isDuplicate).toBe(false);
      expect(saleResult.amountAtoms).toBe(15_000);
      expect(saleResult.balanceAfterAtoms).toBe(1_015_000);

      // Bakiye ve stok doğrulaması
      expect(ledger.getBalanceCredits()).toBe(101.5);
      expect(ledger.getBalanceAtoms()).toBe(1_015_000);
      expect(inventory.getPhysicalQuantity(customerLoc, 'item.glass_water_small')).toBe(0);
      expect(inventory.getPhysicalQuantity(shelfLoc, 'item.glass_water_small')).toBe(0);
      expect(customer.phase).toBe('leaving');
      expect(customer.leaveReason).toBe('PURCHASE_COMPLETED');
    });

    it('Domates (4.00 kredi = 40.000 atom) satıldığında bakiye 100.00 -> 104.00 kredi olur', () => {
      const tomatoLot: StockLot = {
        id: 'lot_tomato_1',
        itemId: 'item.heirloom_tomato',
        quantity: 2,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.crop_plot',
        location: shelfLoc,
      };
      inventory.addLot(tomatoLot);

      const customer = customerManager.spawnCustomer({
        requestedItemId: 'item.heirloom_tomato',
        budgetAtoms: 500_000,
      });

      customerManager.inspectAndPickFromShelf(customer.id, 5);
      customerManager.joinQueue(customer.id);
      const saleResult = customerManager.checkoutCustomer(customer.id, 15);

      expect(saleResult.amountAtoms).toBe(40_000);
      expect(ledger.getBalanceCredits()).toBe(104.0);
      expect(ledger.getBalanceAtoms()).toBe(1_040_000);
      // Rafta 1 domates kalmalı
      expect(inventory.getPhysicalQuantity(shelfLoc, 'item.heirloom_tomato')).toBe(1);
    });
  });

  describe('T-P0-04b: İşlem tekilliği ve dedup (idempotency)', () => {
    it('Aynı transactionId ile 3 kez çağrıldığında 2. ve 3. çağrılar bakiye ve stoku ikinci kez değiştirmez', () => {
      const waterLot: StockLot = {
        id: 'lot_water_dedup_1',
        itemId: 'item.glass_water_small',
        quantity: 1,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'station.bottler',
        location: shelfLoc,
      };
      inventory.addLot(waterLot);

      const customer = customerManager.spawnCustomer({
        requestedItemId: 'item.glass_water_small',
      });
      customerManager.inspectAndPickFromShelf(customer.id, 10);
      customerManager.joinQueue(customer.id);

      const fixedTxId = 'tx_sale_unique_1001';

      // 1. Çağrı: Gerçek satış
      const result1 = customerManager.checkoutCustomer(customer.id, 20, fixedTxId);
      expect(result1.success).toBe(true);
      expect(result1.isDuplicate).toBe(false);
      expect(result1.amountAtoms).toBe(15_000);
      expect(ledger.getBalanceAtoms()).toBe(1_015_000);

      // 2. Çağrı: Aynı transaction ID ile tekrar
      const customerLoc: StockLocation = { kind: 'customer', ownerId: customer.id };
      const result2 = dispatcher.execute({
        type: 'COMPLETE_SALE',
        transactionId: fixedTxId,
        timestampTick: 21,
        customerId: customer.id,
        shelfLocation: shelfLoc,
        customerLocation: customerLoc,
        itemId: 'item.glass_water_small',
        quantity: 1,
        unitPriceAtoms: 15_000,
      });

      expect('isDuplicate' in result2 && result2.isDuplicate).toBe(true);
      expect(ledger.getBalanceAtoms()).toBe(1_015_000); // 0 artış!

      // 3. Çağrı: Üçüncü tekrar
      const result3 = dispatcher.execute({
        type: 'COMPLETE_SALE',
        transactionId: fixedTxId,
        timestampTick: 22,
        customerId: customer.id,
        shelfLocation: shelfLoc,
        customerLocation: customerLoc,
        itemId: 'item.glass_water_small',
        quantity: 1,
        unitPriceAtoms: 15_000,
      });

      expect('isDuplicate' in result3 && result3.isDuplicate).toBe(true);
      expect(ledger.getBalanceAtoms()).toBe(1_015_000); // Hâlâ tam 1.015.000 atom
      expect(ledger.getEntries().filter((h) => h.reason === 'SALE').length).toBe(1); // Tek transaction kaydı
    });
  });

  describe('T-P0-04c: Kayıp satış nedenlerinin açık ayrımı', () => {
    it('Boş raf (OUT_OF_STOCK): Stok olmadığında müşteri ayrılır, kayıp satış kaydedilir ve bakiye değişmez', () => {
      // Rafta hiç stok yok
      expect(inventory.getPhysicalQuantity(shelfLoc, 'item.glass_water_small')).toBe(0);

      const customer = customerManager.spawnCustomer({
        requestedItemId: 'item.glass_water_small',
      });

      const picked = customerManager.inspectAndPickFromShelf(customer.id, 10);
      expect(picked).toBe(false);
      expect(customer.phase).toBe('leaving');
      expect(customer.leaveReason).toBe('OUT_OF_STOCK');

      // Kayıp satış kaydı kontrolü
      const lostSales = customerManager.getLostSales();
      expect(lostSales.length).toBe(1);
      expect(lostSales[0].reason).toBe('OUT_OF_STOCK');
      expect(lostSales[0].customerId).toBe(customer.id);
      expect(lostSales[0].itemId).toBe('item.glass_water_small');

      // Bakiye değişmemeli
      expect(ledger.getBalanceAtoms()).toBe(1_000_000);
    });

    it('Yetersiz bütçe (BUDGET_REJECTED): Müşteri bütçesi fiyattan düşükse ürün rafta kalır ve ayrılır', () => {
      const waterLot: StockLot = {
        id: 'lot_water_budget_1',
        itemId: 'item.glass_water_small',
        quantity: 1,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'station.bottler',
        location: shelfLoc,
      };
      inventory.addLot(waterLot);

      // Fiyat 15.000 atom, müşterinin bütçesi 10.000 atom
      const customer = customerManager.spawnCustomer({
        requestedItemId: 'item.glass_water_small',
        budgetAtoms: 10_000,
      });

      const picked = customerManager.inspectAndPickFromShelf(customer.id, 10);
      expect(picked).toBe(false);
      expect(customer.phase).toBe('leaving');
      expect(customer.leaveReason).toBe('BUDGET_REJECTED');

      // Ürün rafta kalmalı (satılmadı, sepete alınmadı)
      expect(inventory.getPhysicalQuantity(shelfLoc, 'item.glass_water_small')).toBe(1);

      // Kayıp satış kaydı
      const lostSales = customerManager.getLostSales();
      expect(lostSales.length).toBe(1);
      expect(lostSales[0].reason).toBe('BUDGET_REJECTED');
      expect(ledger.getBalanceAtoms()).toBe(1_000_000);
    });

    it('Kuyruk sabrı tükenmesi (PATIENCE_EXHAUSTED): 40 saniye (400 tick) aşılınca sepet ürünü rafa iade edilir', () => {
      const waterLot: StockLot = {
        id: 'lot_water_patience_1',
        itemId: 'item.glass_water_small',
        quantity: 1,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'station.bottler',
        location: shelfLoc,
      };
      inventory.addLot(waterLot);

      const customer = customerManager.spawnCustomer({
        requestedItemId: 'item.glass_water_small',
        patienceTicks: 400,
      });

      // Müşteri raftan ürünü alır
      customerManager.inspectAndPickFromShelf(customer.id, 10);
      expect(inventory.getPhysicalQuantity(shelfLoc, 'item.glass_water_small')).toBe(0);

      // Kuyruğa girer
      customerManager.joinQueue(customer.id);
      expect(customer.phase).toBe('queued');

      // Sabır süresi aşımı tetiklenir
      customerManager.handlePatienceTimeout(customer.id, 410);

      expect(customer.phase).toBe('leaving');
      expect(customer.leaveReason).toBe('PATIENCE_EXHAUSTED');

      // ÜRÜN RAFA GERİ DÖNMÜŞ OLMALI (stok korunumu)
      expect(inventory.getPhysicalQuantity(shelfLoc, 'item.glass_water_small')).toBe(1);

      // Kayıp satış kaydı
      const lostSales = customerManager.getLostSales();
      expect(lostSales.length).toBe(1);
      expect(lostSales[0].reason).toBe('PATIENCE_EXHAUSTED');
      expect(ledger.getBalanceAtoms()).toBe(1_000_000);
    });
  });

  describe('T-P0-04d: Çoklu müşteri kuyruğu ve ilerleme', () => {
    it('İki müşteri kuyruktayken öndeki çıktığında arkadaki müşteri servis noktasına ilerler', () => {
      const waterLot: StockLot = {
        id: 'lot_water_multi_2',
        itemId: 'item.glass_water_small',
        quantity: 2,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'station.bottler',
        location: shelfLoc,
      };
      inventory.addLot(waterLot);

      const c1 = customerManager.spawnCustomer({ id: 'cust_1' });
      const c2 = customerManager.spawnCustomer({ id: 'cust_2' });

      customerManager.inspectAndPickFromShelf(c1.id, 5);
      customerManager.inspectAndPickFromShelf(c2.id, 6);

      customerManager.joinQueue(c1.id);
      customerManager.joinQueue(c2.id);

      expect(c1.queueIndex).toBe(0);
      expect(c1.position.x).toBe(customerManager.checkoutServicePos.x);
      expect(c1.position.z).toBe(customerManager.checkoutServicePos.z);

      expect(c2.queueIndex).toBe(1);
      expect(c2.position.x).toBe(customerManager.checkoutQueueWaitPos.x);
      expect(c2.position.z).toBe(customerManager.checkoutQueueWaitPos.z);

      // c1 ödeme yapar ve ayrılır
      customerManager.checkoutCustomer(c1.id, 10);
      expect(c1.phase).toBe('leaving');

      // c2 otomatik olarak sıranın başına (queueIndex = 0) geçer
      expect(c2.queueIndex).toBe(0);
      expect(c2.position.x).toBe(customerManager.checkoutServicePos.x);
      expect(c2.position.z).toBe(customerManager.checkoutServicePos.z);

      // c2 de ödeme yapar
      customerManager.checkoutCustomer(c2.id, 15);
      expect(c2.phase).toBe('leaving');
      expect(ledger.getBalanceCredits()).toBe(103.0); // 100 + 1.50 + 1.50 = 103.00
    });
  });

  describe('T-P0-04e: Adım bazlı simülasyon döngüsü (Autonomous Step)', () => {
    it('step() döngüsü müşteriyi rafa, kasaya ve çıkışa taşır ve satışı tamamlar', () => {
      const waterLot: StockLot = {
        id: 'lot_water_sim_1',
        itemId: 'item.glass_water_small',
        quantity: 1,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'station.bottler',
        location: shelfLoc,
      };
      inventory.addLot(waterLot);

      const customer = customerManager.spawnCustomer({
        requestedItemId: 'item.glass_water_small',
        startPos: customerManager.shelfServicePos, // Doğrudan raf servis hücresinde başlasın
      });

      // 1. Tick: Raftan ürünü almalı ve toCheckout'a geçmeli
      customerManager.step(1);
      expect(customer.phase).toBe('toCheckout');
      expect(customer.basketLotId).toBeDefined();

      // Müşteriyi kasa servisine koyalım ve step çalıştıralım
      customer.position = { ...customerManager.checkoutServicePos };
      customerManager.step(2);
      expect(customer.phase).toBe('queued');
      expect(customer.queueIndex).toBe(0);

      // 3. Tick: Servis noktasındaki müşteri ödemeyi tamamlamalı ve leaving'e geçmeli
      customerManager.step(3);
      expect(customer.phase).toBe('leaving');
      expect(customer.leaveReason).toBe('PURCHASE_COMPLETED');
      expect(ledger.getBalanceCredits()).toBe(101.5);
    });
  });

  describe('T-P0-04f: Durum serileştirme ve kurtarma (Serialization & Restore)', () => {
    it('Müşteri ve satış verileri durum kaybı olmadan serileştirilir ve geri yüklenir', () => {
      customerManager.spawnCustomer({ id: 'c_save_1' });
      const serialized = customerManager.serialize();

      expect(serialized.customers.length).toBe(1);
      expect(serialized.customers[0].id).toBe('c_save_1');

      const newManager = new CustomerManager(inventory, ledger, dispatcher, 999, customerConfig());
      newManager.restore(serialized);

      expect(newManager.getAllCustomers().length).toBe(1);
      expect(newManager.getCustomer('c_save_1')).toBeDefined();
      expect(newManager.getCustomer('c_save_1')?.id).toBe('c_save_1');
    });
  });
});
