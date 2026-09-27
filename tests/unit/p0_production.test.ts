// Orbit Market - P0 Production & Recipes Unit Tests
// Reference: OYUN_GELISTIRME_DEVIR_DOSYASI.md §26, §58.1, OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md §2-3, TEST_STRATEGY.md T-P0-05/05b/05c/05d/05e

import { describe, it, expect, beforeEach } from 'vitest';
import { InventoryManager } from '../../src/domain/inventory/InventoryManager';
import { EconomyLedger } from '../../src/domain/economy/ledger';
import { ProductionManager } from '../../src/domain/production/ProductionManager';
import { ATOMS_PER_CREDIT } from '../../src/domain/constants';
import type { StockLocation } from '../../src/domain/types';

describe('P0 Production, Water Bottling & Tomato Farming (T-P0-05)', () => {
  let inventory: InventoryManager;
  let ledger: EconomyLedger;
  let production: ProductionManager;

  const springLoc: StockLocation = { kind: 'source', ownerId: 'source.spring_water' };
  const bottlerInputLoc: StockLocation = { kind: 'machineInput', ownerId: 'station.bottler' };
  const bottlerOutputLoc: StockLocation = { kind: 'machineOutput', ownerId: 'station.bottler' };
  const cropInputLoc: StockLocation = { kind: 'machineInput', ownerId: 'source.crop_plot' };
  const cropOutputLoc: StockLocation = { kind: 'machineOutput', ownerId: 'source.crop_plot' };

  beforeEach(() => {
    inventory = new InventoryManager();
    ledger = new EconomyLedger(100 * ATOMS_PER_CREDIT); // 100 Kredi başlangıç
    production = new ProductionManager(inventory, ledger);
  });

  describe('Kabul 1: Üç su tarifinin girdi tüketimi ve ambalaj lotları', () => {
    it('Küçük şişe tarifi (recipe.bottle_glass_water_small): 1 ham su ve 1 küçük şişe tüketir, 30 tick sonra 1 küçük su verir', () => {
      // Setup: Şişeleme giriş tamponuna 5 ham su ve 5 küçük şişe koy
      inventory.addLot({
        id: 'lot_raw_water_5',
        itemId: 'item.raw_water',
        quantity: 5,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: bottlerInputLoc,
      });

      inventory.addLot({
        id: 'lot_bottles_5',
        itemId: 'item.small_bottle',
        quantity: 5,
        qualityScore: 40,
        unitCostAtoms: 2_000, // 0.20 Kredi
        sourceId: 'initial_supplies',
        location: bottlerInputLoc,
      });

      production.selectRecipe('station.bottler', 'recipe.bottle_glass_water_small');

      // Tick 1: Parti başlar, 1 su ve 1 şişe tüketilir
      production.tick(1);
      const bottler = production.getMachine('station.bottler')!;
      expect(bottler.status).toBe('Running');
      expect(bottler.waitReason).toBe('IN_PRODUCTION');
      expect(bottler.batch).not.toBeNull();
      expect(bottler.batch?.remainingTicks).toBe(29);

      expect(inventory.getPhysicalQuantity(bottlerInputLoc, 'item.raw_water')).toBe(4);
      expect(inventory.getPhysicalQuantity(bottlerInputLoc, 'item.small_bottle')).toBe(4);

      // Tick 2..29: Parti devam eder
      for (let t = 2; t < 30; t++) {
        production.tick(t);
        expect(bottler.status).toBe('Running');
        expect(inventory.getPhysicalQuantity(bottlerOutputLoc, 'item.glass_water_small')).toBe(0);
      }

      // Tick 30: 30. tick tamamlanır, tek küçük su çıktıda belirir, 0.03 kredi enerji bedeli düşülür
      const initialBalance = ledger.getBalanceAtoms();
      const res = production.tick(30);
      expect(res.completedBatches.length).toBe(1);
      expect(res.completedBatches[0].outputs[0].itemId).toBe('item.glass_water_small');
      expect(res.completedBatches[0].outputs[0].quantity).toBe(1);
      expect(res.completedBatches[0].energyCostAtoms).toBe(300); // 0.03 Kredi = 300 atom

      expect(inventory.getPhysicalQuantity(bottlerOutputLoc, 'item.glass_water_small')).toBe(1);
      expect(ledger.getBalanceAtoms()).toBe(initialBalance - 300);

      // Tick 31: Sonraki tickte ikinci çıktı oluşmaz
      const res31 = production.tick(31);
      expect(res31.completedBatches.length).toBe(0);
      expect(inventory.getPhysicalQuantity(bottlerOutputLoc, 'item.glass_water_small')).toBe(1);
    });

    it('5 L bidon tarifi (recipe.bottle_jug_5l): 10 ham su ve 1 adet 5L boş bidon tüketir, 80 tick sonra 1 bidon su üretir', () => {
      inventory.addLot({
        id: 'lot_raw_water_20',
        itemId: 'item.raw_water',
        quantity: 20,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: bottlerInputLoc,
      });

      inventory.addLot({
        id: 'lot_jugs_2',
        itemId: 'item.jug_5l_empty',
        quantity: 2,
        qualityScore: 40,
        unitCostAtoms: 7_000, // 0.70 Kredi
        sourceId: 'initial_supplies',
        location: bottlerInputLoc,
      });

      production.selectRecipe('station.bottler', 'recipe.bottle_jug_5l');

      // Tick 1: Başlar, 10 su ve 1 bidon tüketilir
      production.tick(1);
      expect(inventory.getPhysicalQuantity(bottlerInputLoc, 'item.raw_water')).toBe(10);
      expect(inventory.getPhysicalQuantity(bottlerInputLoc, 'item.jug_5l_empty')).toBe(1);

      // Tick 80: Tamamlanır, 0.08 kredi (800 atom) enerji gideri
      const balanceBefore = ledger.getBalanceAtoms();
      for (let t = 2; t <= 80; t++) {
        production.tick(t);
      }

      expect(inventory.getPhysicalQuantity(bottlerOutputLoc, 'item.water_jug_5l')).toBe(1);
      expect(ledger.getBalanceAtoms()).toBe(balanceBefore - 800);
    });

    it('19 L damacana tarifi (recipe.bottle_carboy_19l): 38 ham su ve 1 damacana tüketir, 180 tick sonra 1 damacana su üretir', () => {
      inventory.addLot({
        id: 'lot_raw_water_38',
        itemId: 'item.raw_water',
        quantity: 38,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: bottlerInputLoc,
      });

      inventory.addLot({
        id: 'lot_carboy_1',
        itemId: 'item.carboy_19l_empty',
        quantity: 1,
        qualityScore: 40,
        unitCostAtoms: 20_000, // 2.00 Kredi
        sourceId: 'initial_supplies',
        location: bottlerInputLoc,
      });

      production.selectRecipe('station.bottler', 'recipe.bottle_carboy_19l');

      // Tick 1: Başlar, 38 su ve 1 damacana tüketilir
      production.tick(1);
      expect(inventory.getPhysicalQuantity(bottlerInputLoc, 'item.raw_water')).toBe(0);
      expect(inventory.getPhysicalQuantity(bottlerInputLoc, 'item.carboy_19l_empty')).toBe(0);

      // Tick 180: Tamamlanır, 0.18 kredi (1800 atom) enerji gideri
      const balanceBefore = ledger.getBalanceAtoms();
      for (let t = 2; t <= 180; t++) {
        production.tick(t);
      }

      expect(inventory.getPhysicalQuantity(bottlerOutputLoc, 'item.water_carboy_19l')).toBe(1);
      expect(ledger.getBalanceAtoms()).toBe(balanceBefore - 1800);
    });

    it('Eksik girdi durumunda parti başlamaz ve eksik girdiler listelenir (NoInput / WAITING_FOR_INPUT)', () => {
      // Yalnızca 5 su var, ambalaj hiç yok
      inventory.addLot({
        id: 'lot_water_only',
        itemId: 'item.raw_water',
        quantity: 5,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: bottlerInputLoc,
      });

      production.selectRecipe('station.bottler', 'recipe.bottle_glass_water_small');
      production.tick(1);

      const bottler = production.getMachine('station.bottler')!;
      expect(bottler.status).toBe('NoInput');
      expect(bottler.waitReason).toBe('WAITING_FOR_INPUT');
      expect(bottler.batch).toBeNull();
      expect(bottler.missingInputs).toBeDefined();
      expect(bottler.missingInputs?.some((m) => m.itemId === 'item.small_bottle')).toBe(true);
      expect(inventory.getPhysicalQuantity(bottlerInputLoc, 'item.raw_water')).toBe(5); // Su tüketilmedi
    });
  });

  describe('Kabul 2: Domates hasadı ve çıktı dolu korunum akışı (T-P0-05b)', () => {
    it('Domates hasadı: 2 ham su + 1 tohum tüketir, 80 tick sonra 1 salkım taze domates üretir (0 E)', () => {
      inventory.addLot({
        id: 'lot_crop_water',
        itemId: 'item.raw_water',
        quantity: 2,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: cropInputLoc,
      });

      inventory.addLot({
        id: 'lot_crop_seed',
        itemId: 'item.tomato_seed',
        quantity: 1,
        qualityScore: 40,
        unitCostAtoms: 10_000, // 1.00 Kredi
        sourceId: 'initial_supplies',
        location: cropInputLoc,
      });

      production.selectRecipe('source.crop_plot', 'recipe.grow_heirloom_tomato');

      // Tick 1: Başlar, 2 su ve 1 tohum tüketilir
      production.tick(1);
      const crop = production.getMachine('source.crop_plot')!;
      expect(crop.status).toBe('Running');
      expect(crop.waitReason).toBe('IN_PRODUCTION');
      expect(inventory.getPhysicalQuantity(cropInputLoc, 'item.raw_water')).toBe(0);
      expect(inventory.getPhysicalQuantity(cropInputLoc, 'item.tomato_seed')).toBe(0);

      const balanceBefore = ledger.getBalanceAtoms();
      for (let t = 2; t <= 80; t++) {
        production.tick(t);
      }

      expect(inventory.getPhysicalQuantity(cropOutputLoc, 'item.heirloom_tomato')).toBe(1);
      // Domates yatağı 0 E olduğu için enerji kesintisi olmaz
      expect(ledger.getBalanceAtoms()).toBe(balanceBefore);
    });

    it('T-P0-05b: Çıktı kapasitesi doluyken parti tamamlanırsa BlockedOutput olur, ürün/girdi kaybolmaz, yer açılınca tek sonuç verilir', () => {
      // 1. Setup: Domates yatağı çıktısını kapasite (40) kadar sahte domatesle doldur
      inventory.addLot({
        id: 'lot_fill_crop_output',
        itemId: 'item.heirloom_tomato',
        quantity: 40,
        qualityScore: 40,
        unitCostAtoms: 10_000,
        sourceId: 'mock',
        location: cropOutputLoc,
      });
      expect(inventory.getAvailableCapacity(cropOutputLoc)).toBe(0);

      // 2. Girdileri ekle ve partiyi elle aktif parti olarak oluştur (başlamış parti senaryosu)
      const crop = production.getMachine('source.crop_plot')!;
      crop.batch = {
        id: 'batch_blocked_test',
        recipeId: 'recipe.grow_heirloom_tomato',
        remainingTicks: 1,
        consumedInputs: [
          { lotId: 'l1', itemId: 'item.raw_water', quantity: 2, qualityScore: 40, unitCostAtoms: 0 },
          { lotId: 'l2', itemId: 'item.tomato_seed', quantity: 1, qualityScore: 40, unitCostAtoms: 10_000 },
        ],
      };

      // 3. Tick çalıştır: Süre biter (0) ama çıktı dolu olduğu için BlockedOutput olur
      production.tick(1);
      expect(crop.status).toBe('BlockedOutput');
      expect(crop.waitReason).toBe('WAITING_FOR_OUTPUT_SPACE');
      expect(crop.batch).not.toBeNull(); // Batch kaybolmaz!
      expect(crop.batch?.remainingTicks).toBe(0);
      expect(inventory.getPhysicalQuantity(cropOutputLoc, 'item.heirloom_tomato')).toBe(40); // Fazla ürün basılmadı

      // Birkaç tick daha bekle: Durum korunur
      production.tick(2);
      production.tick(3);
      expect(crop.status).toBe('BlockedOutput');

      // 4. Çıktıdan 5 birim boşalt (örneğin rafa taşındı)
      inventory.consumeStock({
        transactionId: 'shelf_transfer_mock',
        timestampTick: 4,
        location: cropOutputLoc,
        itemId: 'item.heirloom_tomato',
        quantity: 5,
      });
      expect(inventory.getAvailableCapacity(cropOutputLoc)).toBe(5);

      // 5. Bir sonraki tickte ürün tek seferde çıktıya aktarılır ve makine Idle döner
      const res = production.tick(4);
      expect(res.completedBatches.length).toBe(1);
      expect(crop.status).toBe('Idle');
      expect(crop.batch).toBeNull();
      expect(inventory.getPhysicalQuantity(cropOutputLoc, 'item.heirloom_tomato')).toBe(36); // 35 + 1 yeni üretilen
    });

    it('Çıktı kapasitesi başlangıçta tamamen doluysa yeni parti başlatılmaz (BlockedOutput)', () => {
      // Çıktıyı tamamen doldur (şişeleme kapasitesi 20)
      inventory.addLot({
        id: 'lot_fill_bottler_output',
        itemId: 'item.glass_water_small',
        quantity: 20,
        qualityScore: 40,
        unitCostAtoms: 2_000,
        sourceId: 'mock',
        location: bottlerOutputLoc,
      });

      // Girişe girdileri koy
      inventory.addLot({
        id: 'lot_raw_w',
        itemId: 'item.raw_water',
        quantity: 1,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: bottlerInputLoc,
      });
      inventory.addLot({
        id: 'lot_sm_b',
        itemId: 'item.small_bottle',
        quantity: 1,
        qualityScore: 40,
        unitCostAtoms: 2_000,
        sourceId: 'mock',
        location: bottlerInputLoc,
      });

      production.selectRecipe('station.bottler', 'recipe.bottle_glass_water_small');
      production.tick(1);

      const bottler = production.getMachine('station.bottler')!;
      expect(bottler.status).toBe('BlockedOutput');
      expect(bottler.waitReason).toBe('WAITING_FOR_OUTPUT_SPACE');
      expect(bottler.batch).toBeNull();
      expect(inventory.getPhysicalQuantity(bottlerInputLoc, 'item.raw_water')).toBe(1); // Girdi tüketilmedi
    });
  });

  describe('Kabul 3: Üretim süresi, enerji ve bekleme nedenleri (T-P0-05 / T-P0-05c / T-P0-05d / T-P0-05e)', () => {
    it('T-P0-05c: 50 birim su haznesi; 1+10+38+2=51 birim tahsisinde 1 birim eksik kalır; 20 tick (2 sn) sonra 1 yeni birim üretilir, stok eksiye düşmez', () => {
      // 1. Memba çeşmesine 50 birim su koy
      inventory.addLot({
        id: 'lot_spring_50',
        itemId: 'item.raw_water',
        quantity: 50,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: springLoc,
      });

      // 2. 50 birimi farklı istasyonlara tüket (küçük su: 1, 5L bidon: 10, damacana: 38, domates için: 1)
      inventory.consumeStock({
        transactionId: 'alloc_50_units',
        timestampTick: 1,
        location: springLoc,
        itemId: 'item.raw_water',
        quantity: 50,
      });

      expect(inventory.getPhysicalQuantity(springLoc, 'item.raw_water')).toBe(0);

      // Domates için toplam 2 birim gerekiyordu, 1 birim eksik kaldı
      // Memba çeşmesi Seviye 1 debiyle (0.5 birim/sn -> 20 tick'te 1 birim) çalışır
      for (let t = 1; t <= 19; t++) {
        const tickRes = production.tick(t);
        expect(tickRes.producedWater).toBe(0);
        expect(inventory.getPhysicalQuantity(springLoc, 'item.raw_water')).toBe(0);
      }

      // 20. tick'te tam 1 birim üretilir
      const tick20Res = production.tick(20);
      expect(tick20Res.producedWater).toBe(1);
      expect(inventory.getPhysicalQuantity(springLoc, 'item.raw_water')).toBe(1);
    });

    it('T-P0-05d: Debi seviye 1den 2ye yükseltilir; aynı komut iki kez çağrıldığında 80 kredi yalnız bir kez düşer; hız sonraki tickten itibaren geçerlidir', () => {
      const initialBalance = ledger.getBalanceAtoms();
      expect(initialBalance).toBe(100 * ATOMS_PER_CREDIT);

      const spring = production.getMachine('source.spring_water')!;
      expect(spring.level).toBe(1);
      expect(inventory.getCapacity(springLoc)).toBe(80);

      // 1. Çağrı: Yükseltme başarılı
      const upg1 = production.upgradeWaterSpring('source.spring_water', 'tx_upg_spring_1', 1);
      expect(upg1.success).toBe(true);
      expect(upg1.isDuplicate).toBe(false);
      expect(upg1.newLevel).toBe(2);
      expect(spring.level).toBe(2);
      expect(inventory.getCapacity(springLoc)).toBe(120); // 120 hazne kapasitesi
      expect(ledger.getBalanceAtoms()).toBe(initialBalance - 80 * ATOMS_PER_CREDIT);

      // 2. Çağrı (Aynı transactionId): İkinci kesinti yapılmaz (dedup)
      const upg2 = production.upgradeWaterSpring('source.spring_water', 'tx_upg_spring_1', 1);
      expect(upg2.success).toBe(true);
      expect(upg2.isDuplicate).toBe(true);
      expect(ledger.getBalanceAtoms()).toBe(initialBalance - 80 * ATOMS_PER_CREDIT);

      // Seviye 2 hızı: 1.0 birim/saniye -> Her 10 tick'te 1 birim su üretir
      spring.progressTicks = 0;
      for (let t = 1; t <= 9; t++) {
        expect(production.tick(t).producedWater).toBe(0);
      }
      expect(production.tick(10).producedWater).toBe(1);
      expect(inventory.getPhysicalQuantity(springLoc, 'item.raw_water')).toBe(1);
    });

    it('T-P0-05e: initializeP0Supplies açılış lotlarını tamponlara yerleştirir, lotlar tek fiziksel konumdadır ve tekrar çağrı sarfları çiftlemez', () => {
      production.initializeP0Supplies();

      // Açılış sarfları doğrulama
      expect(inventory.getPhysicalQuantity(springLoc, 'item.raw_water')).toBe(50);
      expect(inventory.getPhysicalQuantity(bottlerInputLoc, 'item.small_bottle')).toBe(12);
      expect(inventory.getPhysicalQuantity(bottlerInputLoc, 'item.jug_5l_empty')).toBe(4);
      expect(inventory.getPhysicalQuantity(bottlerInputLoc, 'item.carboy_19l_empty')).toBe(2);
      expect(inventory.getPhysicalQuantity(cropInputLoc, 'item.tomato_seed')).toBe(8);

      // İkinci kez initializeP0Supplies çağrıldığında stoklar artmaz
      production.initializeP0Supplies();
      expect(inventory.getPhysicalQuantity(springLoc, 'item.raw_water')).toBe(50);
      expect(inventory.getPhysicalQuantity(bottlerInputLoc, 'item.small_bottle')).toBe(12);
      expect(inventory.getPhysicalQuantity(cropInputLoc, 'item.tomato_seed')).toBe(8);
    });

    it('Su haznesi dolduğunda çeşme üretimi durur ve STORAGE_FULL durumuna geçer', () => {
      inventory.setCapacity(springLoc, 10);
      inventory.addLot({
        id: 'lot_spring_10',
        itemId: 'item.raw_water',
        quantity: 10,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: springLoc,
      });

      production.tick(1);
      const spring = production.getMachine('source.spring_water')!;
      expect(spring.status).toBe('Idle');
      expect(spring.waitReason).toBe('STORAGE_FULL');
    });

    it('Yetersiz bakiye durumunda enerji gerektiren makine NoPower / WAITING_FOR_POWER durumuna geçer', () => {
      // Bakiyeyi 0'a indir
      const currentBal = ledger.getBalanceAtoms();
      ledger.commitTransaction({
        transactionId: 'drain_cash_test',
        timestampTick: 1,
        type: 'DEBIT',
        amountAtoms: currentBal,
        reason: 'MAINTENANCE',
      });
      expect(ledger.getBalanceAtoms()).toBe(0);

      // Girdileri ekle
      inventory.addLot({
        id: 'lot_w',
        itemId: 'item.raw_water',
        quantity: 1,
        qualityScore: 40,
        unitCostAtoms: 0,
        sourceId: 'source.spring_water',
        location: bottlerInputLoc,
      });
      inventory.addLot({
        id: 'lot_b',
        itemId: 'item.small_bottle',
        quantity: 1,
        qualityScore: 40,
        unitCostAtoms: 2_000,
        sourceId: 'mock',
        location: bottlerInputLoc,
      });

      production.selectRecipe('station.bottler', 'recipe.bottle_glass_water_small');
      production.tick(2);

      const bottler = production.getMachine('station.bottler')!;
      expect(bottler.status).toBe('NoPower');
      expect(bottler.waitReason).toBe('WAITING_FOR_POWER');
      expect(bottler.batch).toBeNull();
    });
  });
});
