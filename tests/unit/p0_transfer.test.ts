// Orbit Market - P0-03 Transfer & Reservation Safety Tests
// Reference: OYUN_GELISTIRME_DEVIR_DOSYASI.md §26, §58.1, §60, TEST_STRATEGY.md T-P0-03/03b

import { describe, expect, it, beforeEach } from 'vitest';
import { InventoryManager } from '../../src/domain/inventory/InventoryManager';
import { EconomyLedger } from '../../src/domain/economy/ledger';
import { CommandDispatcher } from '../../src/application/commands';
import type { StockLocation, StockLot } from '../../src/domain/types';

describe('P0-03: Ürün Transferi, Kapasite ve Rezervasyon Koruması', () => {
  let inventory: InventoryManager;
  let ledger: EconomyLedger;
  let dispatcher: CommandDispatcher;

  const sourceLoc: StockLocation = { kind: 'source', ownerId: 'source.spring_water' };
  const shelfLoc: StockLocation = { kind: 'shelf', ownerId: 'fixture.sales_shelf' };
  const playerLoc: StockLocation = { kind: 'player', ownerId: 'player_1' };
  const workerLoc: StockLocation = { kind: 'worker', ownerId: 'worker_1' };
  const bottlerInputLoc: StockLocation = { kind: 'machineInput', ownerId: 'station.bottler' };

  beforeEach(() => {
    inventory = new InventoryManager();
    ledger = new EconomyLedger();
    dispatcher = new CommandDispatcher(ledger, inventory);
  });

  it('aynı lot kimliğini ve ayrılmış hedef kapasitesini ezmeden reddeder', () => {
    const lot: StockLot = {
      id: 'lot-unique', itemId: 'item.raw_water', quantity: 2,
      qualityScore: 40, unitCostAtoms: 0, sourceId: 'source.spring_water', location: sourceLoc,
    };
    inventory.addLot(lot);
    expect(() => inventory.addLot({ ...lot, quantity: 1, location: shelfLoc })).toThrow('Lot ID zaten kullanımda');
    expect(inventory.getPhysicalQuantity(sourceLoc, lot.itemId)).toBe(2);

    inventory.setCapacity(shelfLoc, 2);
    inventory.createReservation({ id: 'res-capacity', ownerId: 'player_1',
      source: sourceLoc, target: shelfLoc, itemId: lot.itemId, quantity: 2, currentTick: 0 });
    expect(() => inventory.addLot({ ...lot, id: 'lot-extra', quantity: 1, location: shelfLoc }))
      .toThrow('Kapasite aşıldı');
    expect(inventory.getPhysicalQuantity(shelfLoc)).toBe(0);
  });

  it('kapasiteyi fiziksel stok ve aktif giriş rezervasyonlarının altına indirmez', () => {
    inventory.addLot({ id: 'capacity-existing', itemId: 'item.raw_water', quantity: 1,
      qualityScore: 40, unitCostAtoms: 0, sourceId: 'fixture.sales_shelf', location: shelfLoc });
    inventory.addLot({ id: 'capacity-source', itemId: 'item.raw_water', quantity: 1,
      qualityScore: 40, unitCostAtoms: 0, sourceId: 'source.spring_water', location: sourceLoc });
    inventory.setCapacity(shelfLoc, 2);
    inventory.createReservation({ id: 'capacity-reservation', ownerId: 'player_1',
      source: sourceLoc, target: shelfLoc, itemId: 'item.raw_water', quantity: 1, currentTick: 1 });

    expect(() => inventory.setCapacity(shelfLoc, 1)).toThrow('Kapasite mevcut stok ve rezervasyonların altına düşürülemez');
    expect(inventory.getCapacity(shelfLoc)).toBe(2);
    expect(inventory.getAvailableCapacity(shelfLoc)).toBe(0);

    inventory.transferStock({ transactionId: 'capacity-reserved-transfer', timestampTick: 2,
      source: sourceLoc, target: shelfLoc, itemId: 'item.raw_water', quantity: 1,
      reservationId: 'capacity-reservation' });
    expect(inventory.getPhysicalQuantity(shelfLoc, 'item.raw_water')).toBe(2);
    expect(inventory.getPhysicalQuantity(sourceLoc, 'item.raw_water')).toBe(0);
    expect(inventory.getAvailableCapacity(shelfLoc)).toBe(0);
  });

  it('işlem ve rezervasyon kimliğini farklı içerikle yeniden kullanmayı reddeder', () => {
    inventory.addLot({ id: 'identity-source', itemId: 'item.raw_water', quantity: 3,
      qualityScore: 40, unitCostAtoms: 0, sourceId: 'source.spring_water', location: sourceLoc });
    inventory.createReservation({ id: 'identity-reservation', ownerId: 'player_1',
      source: sourceLoc, target: shelfLoc, itemId: 'item.raw_water', quantity: 1, currentTick: 1 });
    expect(() => inventory.createReservation({ id: 'identity-reservation', ownerId: 'worker_1',
      source: sourceLoc, target: shelfLoc, itemId: 'item.raw_water', quantity: 1, currentTick: 1 }))
      .toThrow('Rezervasyon ID zaten kullanımda');

    inventory.transferStock({ transactionId: 'identity-transfer', timestampTick: 2,
      source: sourceLoc, target: playerLoc, itemId: 'item.raw_water', quantity: 1 });
    expect(() => inventory.transferStock({ transactionId: 'identity-transfer', timestampTick: 3,
      source: sourceLoc, target: workerLoc, itemId: 'item.raw_water', quantity: 1 }))
      .toThrow('farklı transfer');
    expect(() => inventory.consumeStock({ transactionId: 'identity-transfer', timestampTick: 3,
      location: playerLoc, itemId: 'item.raw_water', quantity: 1 })).toThrow('farklı envanter işlemi');
    expect(inventory.getPhysicalQuantity(playerLoc, 'item.raw_water')).toBe(1);
  });

  it('lot kimliğine bağlı rezervasyonda başka lotu tüketmez veya ayırmaz', () => {
    const first: StockLot = { id: 'reserved-first', itemId: 'item.raw_water', quantity: 1,
      qualityScore: 40, unitCostAtoms: 0, sourceId: 'source.spring_water', location: sourceLoc };
    inventory.addLot(first);
    inventory.addLot({ ...first, id: 'free-second' });
    expect(() => inventory.createReservation({ id: 'missing-lot', ownerId: 'player_1',
      source: sourceLoc, target: playerLoc, itemId: first.itemId, quantity: 1,
      lotId: 'does-not-exist', currentTick: 1 })).toThrow('seçilen lot');

    inventory.createReservation({ id: 'specific-lot', ownerId: 'player_1',
      source: sourceLoc, target: playerLoc, itemId: first.itemId, quantity: 1,
      lotId: first.id, currentTick: 1 });
    const freeTransfer = inventory.transferStock({ transactionId: 'take-free', timestampTick: 2,
      source: sourceLoc, target: workerLoc, itemId: first.itemId, quantity: 1 });
    expect(freeTransfer.transferredLots).toEqual([{ lotId: 'free-second', quantity: 1 }]);
    expect(inventory.getLot(first.id)?.quantity).toBe(1);

    const reservedTransfer = inventory.transferStock({ transactionId: 'take-reserved', timestampTick: 3,
      source: sourceLoc, target: playerLoc, itemId: first.itemId, quantity: 1,
      reservationId: 'specific-lot' });
    expect(reservedTransfer.transferredLots).toEqual([{ lotId: 'reserved-first', quantity: 1 }]);
  });

  describe('T-P0-03: Başarılı transfer ve işlem idempotency (dedup)', () => {
    it('Kaynak 5 ham su, hedef 2 boş kapasite; 2 birim taşınır ve aynı komut ID ile tekrarlandığında yan etki oluşmaz', () => {
      // 1. Setup: Kaynakta 5 ham su, rafta 2 boş kapasite
      const initialLot: StockLot = {
        id: 'lot_water_5',
        itemId: 'item.raw_water',
        quantity: 5,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: sourceLoc,
      };
      inventory.addLot(initialLot);
      inventory.setCapacity(shelfLoc, 2);

      expect(inventory.getPhysicalQuantity(sourceLoc, 'item.raw_water')).toBe(5);
      expect(inventory.getAvailableCapacity(shelfLoc)).toBe(2);

      // 2. Transfer: 2 birim taşı
      const txId = 'tx_transfer_001';
      const result1 = inventory.transferStock({
        transactionId: txId,
        timestampTick: 10,
        source: sourceLoc,
        target: shelfLoc,
        itemId: 'item.raw_water',
        quantity: 2,
      });

      expect(result1.success).toBe(true);
      expect(result1.isDuplicate).toBe(false);
      expect(result1.quantity).toBe(2);

      // Kaynak 3, hedef 2 olmalı
      expect(inventory.getPhysicalQuantity(sourceLoc, 'item.raw_water')).toBe(3);
      expect(inventory.getPhysicalQuantity(shelfLoc, 'item.raw_water')).toBe(2);
      expect(inventory.getAvailableCapacity(shelfLoc)).toBe(0);

      // 3. Tekrar: Aynı transactionId ile komut yinelenir
      const result2 = inventory.transferStock({
        transactionId: txId,
        timestampTick: 11,
        source: sourceLoc,
        target: shelfLoc,
        itemId: 'item.raw_water',
        quantity: 2,
      });

      expect(result2.success).toBe(true);
      expect(result2.isDuplicate).toBe(true);

      // Stoklar kesinlikle değişmemelidir (kaynak 3, hedef 2 kalmalı)
      expect(inventory.getPhysicalQuantity(sourceLoc, 'item.raw_water')).toBe(3);
      expect(inventory.getPhysicalQuantity(shelfLoc, 'item.raw_water')).toBe(2);
    });
  });

  describe('T-P0-03b: Yetersiz stok veya kapasite aşımında red ve state değişmezliği', () => {
    it('5 ham sudan 6 taşımak istendiğinde INSUFFICIENT_STOCK ile reddedilir ve state değişmez', () => {
      inventory.addLot({
        id: 'lot_water_5b',
        itemId: 'item.raw_water',
        quantity: 5,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: sourceLoc,
      });
      inventory.setCapacity(shelfLoc, 10);

      expect(() => {
        inventory.transferStock({
          transactionId: 'tx_fail_stock',
          timestampTick: 20,
          source: sourceLoc,
          target: shelfLoc,
          itemId: 'item.raw_water',
          quantity: 6,
        });
      }).toThrow(/INSUFFICIENT_STOCK/);

      expect(inventory.getPhysicalQuantity(sourceLoc, 'item.raw_water')).toBe(5);
      expect(inventory.getPhysicalQuantity(shelfLoc, 'item.raw_water')).toBe(0);
    });

    it('2 boş kapasitesi olan yere 3 birim bırakılmak istendiğinde EXCEEDS_CAPACITY ile reddedilir ve state değişmez', () => {
      inventory.addLot({
        id: 'lot_water_5c',
        itemId: 'item.raw_water',
        quantity: 5,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: sourceLoc,
      });
      inventory.setCapacity(shelfLoc, 2);

      expect(() => {
        inventory.transferStock({
          transactionId: 'tx_fail_cap',
          timestampTick: 25,
          source: sourceLoc,
          target: shelfLoc,
          itemId: 'item.raw_water',
          quantity: 3,
        });
      }).toThrow(/EXCEEDS_CAPACITY/);

      expect(inventory.getPhysicalQuantity(sourceLoc, 'item.raw_water')).toBe(5);
      expect(inventory.getPhysicalQuantity(shelfLoc, 'item.raw_water')).toBe(0);
    });
  });

  describe('Rezervasyon ve İptal Güvenliği', () => {
    it('Rezervasyon yapıldığında kaynak stok ve hedef kapasite kilitlenir; ikinci talep yetersiz kalırsa reddedilir', () => {
      inventory.addLot({
        id: 'lot_res_test',
        itemId: 'item.raw_water',
        quantity: 5,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: sourceLoc,
      });
      inventory.setCapacity(shelfLoc, 3);

      // Rezervasyon 1: 3 birim ayır
      const res1 = inventory.createReservation({
        id: 'res_001',
        ownerId: 'worker_1',
        source: sourceLoc,
        target: shelfLoc,
        itemId: 'item.raw_water',
        quantity: 3,
        currentTick: 30,
      });

      expect(res1.status).toBe('ACTIVE');
      expect(inventory.getReservedOutgoing(sourceLoc, 'item.raw_water')).toBe(3);
      expect(inventory.getAvailableQuantity(sourceLoc, 'item.raw_water')).toBe(2);
      expect(inventory.getAvailableCapacity(shelfLoc)).toBe(0);

      // Rezervasyon 2: Kalan 2 birim serbest olsa da hedef kapasite dolu olduğu için reddedilir
      expect(() => {
        inventory.createReservation({
          id: 'res_002',
          ownerId: 'player_1',
          source: sourceLoc,
          target: shelfLoc,
          itemId: 'item.raw_water',
          quantity: 2,
          currentTick: 31,
        });
      }).toThrow(/EXCEEDS_CAPACITY/);
    });

    it('Rezervasyon iptal edildiğinde kilitlenen stok ve kapasite geri açılır; ürün kaybolmaz veya çoğalmaz', () => {
      inventory.addLot({
        id: 'lot_cancel_test',
        itemId: 'item.raw_water',
        quantity: 4,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: sourceLoc,
      });
      inventory.setCapacity(shelfLoc, 4);

      inventory.createReservation({
        id: 'res_to_cancel',
        ownerId: 'worker_1',
        source: sourceLoc,
        target: shelfLoc,
        itemId: 'item.raw_water',
        quantity: 3,
        currentTick: 40,
      });

      expect(inventory.getAvailableQuantity(sourceLoc, 'item.raw_water')).toBe(1);
      expect(inventory.getAvailableCapacity(shelfLoc)).toBe(1);

      // İptal et
      const cancelled = inventory.cancelReservation('res_to_cancel');
      expect(cancelled).toBe(true);

      // Kaynak stok ve hedef kapasite tamamen serbest olmalı
      expect(inventory.getAvailableQuantity(sourceLoc, 'item.raw_water')).toBe(4);
      expect(inventory.getAvailableCapacity(shelfLoc)).toBe(4);
      expect(inventory.getPhysicalQuantity(sourceLoc, 'item.raw_water')).toBe(4);
      expect(inventory.getPhysicalQuantity(shelfLoc, 'item.raw_water')).toBe(0);
    });

    it('Rezervasyonlu transfer tamamlandığında rezervasyon FULFILLED olur ve stok taşınır', () => {
      inventory.addLot({
        id: 'lot_fulfill_test',
        itemId: 'item.raw_water',
        quantity: 10,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: sourceLoc,
      });
      inventory.setCapacity(shelfLoc, 10);

      const res = inventory.createReservation({
        id: 'res_fulfill',
        ownerId: 'worker_1',
        source: sourceLoc,
        target: shelfLoc,
        itemId: 'item.raw_water',
        quantity: 4,
        currentTick: 50,
      });

      const tx = inventory.transferStock({
        transactionId: 'tx_fulfilled_res',
        timestampTick: 55,
        source: sourceLoc,
        target: shelfLoc,
        itemId: 'item.raw_water',
        quantity: 4,
        reservationId: 'res_fulfill',
      });

      expect(tx.success).toBe(true);
      expect(res.status).toBe('FULFILLED');
      expect(inventory.getPhysicalQuantity(sourceLoc, 'item.raw_water')).toBe(6);
      expect(inventory.getPhysicalQuantity(shelfLoc, 'item.raw_water')).toBe(4);
      expect(inventory.getReservedOutgoing(sourceLoc)).toBe(0);
      expect(inventory.getReservedIncoming(shelfLoc)).toBe(0);
    });
  });

  describe('Taşıyıcı (Player / Worker) Döngüsü ve Kesinti Koruması', () => {
    it('Oyuncu kaynaktan taşır ve tezgâha bırakır; toplam ürün miktarı korunur', () => {
      // Başlangıç: Kaynakta 50 su (P0 başlangıcı)
      inventory.addLot({
        id: 'lot_init_water',
        itemId: 'item.raw_water',
        quantity: 50,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: sourceLoc,
      });

      // 1. Adım: Kaynaktan oyuncuya 5 birim al (oyuncu kapasitesi 5)
      inventory.transferStock({
        transactionId: 'tx_pickup_1',
        timestampTick: 60,
        source: sourceLoc,
        target: playerLoc,
        itemId: 'item.raw_water',
        quantity: 5,
      });

      expect(inventory.getPhysicalQuantity(sourceLoc, 'item.raw_water')).toBe(45);
      expect(inventory.getPhysicalQuantity(playerLoc, 'item.raw_water')).toBe(5);

      // Oyuncu kapasitesi doluyken daha fazla alamaz
      expect(() => {
        inventory.transferStock({
          transactionId: 'tx_pickup_overflow',
          timestampTick: 61,
          source: sourceLoc,
          target: playerLoc,
          itemId: 'item.raw_water',
          quantity: 1,
        });
      }).toThrow(/EXCEEDS_CAPACITY/);

      // 2. Adım: Oyuncudan şişeleme tezgâhı girdisine 5 birim aktar
      inventory.transferStock({
        transactionId: 'tx_drop_bottler',
        timestampTick: 65,
        source: playerLoc,
        target: bottlerInputLoc,
        itemId: 'item.raw_water',
        quantity: 5,
      });

      expect(inventory.getPhysicalQuantity(playerLoc, 'item.raw_water')).toBe(0);
      expect(inventory.getPhysicalQuantity(bottlerInputLoc, 'item.raw_water')).toBe(5);

      // Toplam su 50 korunmalı (45 kaynak + 5 bottler input)
      const totalSystemWater =
        inventory.getPhysicalQuantity(sourceLoc, 'item.raw_water') +
        inventory.getPhysicalQuantity(playerLoc, 'item.raw_water') +
        inventory.getPhysicalQuantity(bottlerInputLoc, 'item.raw_water');
      expect(totalSystemWater).toBe(50);
    });

    it('Görevli yük taşırken rota kesildiğinde ürün görevli envanterinde güvenle kalır, silinmez veya kaybolmaz', () => {
      inventory.addLot({
        id: 'lot_worker_source',
        itemId: 'item.raw_water',
        quantity: 10,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: sourceLoc,
      });

      // Görevli 3 birim yük aldı
      inventory.transferStock({
        transactionId: 'tx_worker_pickup',
        timestampTick: 70,
        source: sourceLoc,
        target: workerLoc,
        itemId: 'item.raw_water',
        quantity: 3,
      });

      // Rafta rezerve hedef vardı
      inventory.createReservation({
        id: 'res_worker_shelf',
        ownerId: 'worker_1',
        source: workerLoc,
        target: shelfLoc,
        itemId: 'item.raw_water',
        quantity: 3,
        currentTick: 71,
      });

      // Rota kesildi: hedef rezervasyonu iptal edildi
      inventory.cancelReservation('res_worker_shelf');

      // Ürün görevlinin elinde kalmaya devam eder, silinmez!
      expect(inventory.getPhysicalQuantity(workerLoc, 'item.raw_water')).toBe(3);
      expect(inventory.getLotsAt(workerLoc).length).toBe(1);
      expect(inventory.getAvailableCapacity(shelfLoc)).toBe(inventory.getCapacity(shelfLoc));
    });
  });

  describe('CommandDispatcher Entegrasyonu', () => {
    it('TRANSFER_STOCK, RESERVE_STOCK ve CANCEL_RESERVATION komutları dispatcher üzerinden tek arayüzle yürütülür', () => {
      inventory.addLot({
        id: 'lot_cmd_test',
        itemId: 'item.raw_water',
        quantity: 10,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: sourceLoc,
      });

      // 1. RESERVE_STOCK komutu
      const resResult = dispatcher.execute({
        type: 'RESERVE_STOCK',
        transactionId: 'tx_cmd_res',
        timestampTick: 100,
        reservationId: 'res_cmd_001',
        ownerId: 'player_1',
        source: sourceLoc,
        target: shelfLoc,
        itemId: 'item.raw_water',
        quantity: 3,
      });
      expect('status' in resResult && resResult.status === 'ACTIVE').toBe(true);

      // 2. TRANSFER_STOCK komutu
      const transferResult = dispatcher.execute({
        type: 'TRANSFER_STOCK',
        transactionId: 'tx_cmd_transfer',
        timestampTick: 102,
        source: sourceLoc,
        target: shelfLoc,
        itemId: 'item.raw_water',
        quantity: 3,
        reservationId: 'res_cmd_001',
      });
      expect('success' in transferResult && transferResult.success === true).toBe(true);

      // 3. CANCEL_RESERVATION komutu
      const cancelResult = dispatcher.execute({
        type: 'CANCEL_RESERVATION',
        transactionId: 'tx_cmd_cancel',
        timestampTick: 105,
        reservationId: 'res_cmd_001', // zaten fulfilled olduğu için cancelled: false döner
      });
      expect('cancelled' in cancelResult && cancelResult.cancelled === false).toBe(true);
    });
  });

  describe('Snapshot ve Restore Kalıcılığı', () => {
    it('State serialize edilip yeni bir InventoryManager örneğine yüklendiğinde tüm lot, rezervasyon ve dedup kayıtları korunur', () => {
      inventory.addLot({
        id: 'lot_snap_1',
        itemId: 'item.raw_water',
        quantity: 15,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: sourceLoc,
      });
      inventory.setCapacity(shelfLoc, 25);

      // Transfer yap
      inventory.transferStock({
        transactionId: 'tx_snap_transfer',
        timestampTick: 200,
        source: sourceLoc,
        target: shelfLoc,
        itemId: 'item.raw_water',
        quantity: 5,
      });

      // Aktif rezervasyon yap
      inventory.createReservation({
        id: 'res_snap_active',
        ownerId: 'worker_1',
        source: sourceLoc,
        target: shelfLoc,
        itemId: 'item.raw_water',
        quantity: 3,
        currentTick: 201,
      });

      // Snapshot al
      const snapshot = inventory.serialize();

      // Yeni InventoryManager'a restore et
      const restoredInventory = new InventoryManager();
      restoredInventory.restore(snapshot);

      expect(restoredInventory.getPhysicalQuantity(sourceLoc, 'item.raw_water')).toBe(10);
      expect(restoredInventory.getPhysicalQuantity(shelfLoc, 'item.raw_water')).toBe(5);
      expect(restoredInventory.getCapacity(shelfLoc)).toBe(25);
      expect(restoredInventory.getReservedOutgoing(sourceLoc, 'item.raw_water')).toBe(3);
      expect(restoredInventory.getReservedIncoming(shelfLoc)).toBe(3);

      // Deduplication kalıcılığı: önceden işlenen tx_snap_transfer yinelenemez
      const dupResult = restoredInventory.transferStock({
        transactionId: 'tx_snap_transfer',
        timestampTick: 205,
        source: sourceLoc,
        target: shelfLoc,
        itemId: 'item.raw_water',
        quantity: 5,
      });
      expect(dupResult.isDuplicate).toBe(true);
      expect(restoredInventory.getPhysicalQuantity(sourceLoc, 'item.raw_water')).toBe(10);
      expect(restoredInventory.getPhysicalQuantity(shelfLoc, 'item.raw_water')).toBe(5);
    });
  });
});
