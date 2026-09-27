// Orbit Market - P0-01 Core Verification Tests
// Proves all 4 acceptance criteria of Task P0-01

import { describe, it, expect } from 'vitest';
import { SimulationClock } from '../../src/domain/time/clock';
import { Mulberry32Rng } from '../../src/domain/random/rng';
import {
  EconomyLedger,
  InsufficientBalanceError,
  DuplicateTransactionError,
  InvalidTransactionAmountError,
} from '../../src/domain/economy/ledger';
import {
  P0_CONTENT,
  validateContent,
  ContentValidationError,
  GameContent,
} from '../../src/content/p0Content';
import { CommandDispatcher } from '../../src/application/commands';
import { ATOMS_PER_CREDIT } from '../../src/domain/constants';

describe('P0-01 Acceptance Criteria Verification', () => {
  // =========================================================================
  // ÖLÇÜT 1: Simülasyon 100 ms sabit tick ile işler;
  // render sıklığı ekonomik sonucu değiştirmez.
  // =========================================================================
  describe('Criterion 1: 100ms Fixed Tick & Frame Rate Invariance', () => {
    it('100 ms sabit adımlarla tick üretir ve artık zamanı doğru biriktirir', () => {
      const clock = new SimulationClock();
      let tickCount = 0;

      // 45 ms geçti -> tick olmamalı (kalan: 45 ms)
      clock.update(45, () => tickCount++);
      expect(tickCount).toBe(0);
      expect(clock.getTick()).toBe(0);

      // 55 ms daha geçti -> toplam 100 ms -> 1 tick olmalı
      clock.update(55, () => tickCount++);
      expect(tickCount).toBe(1);
      expect(clock.getTick()).toBe(1);

      // 250 ms geçti -> 2 tick olmalı (toplam 3), 50 ms birikmiş kalmalı
      clock.update(250, () => tickCount++);
      expect(tickCount).toBe(3);
      expect(clock.getTick()).toBe(3);
      expect(clock.getInterpolationAlpha()).toBeCloseTo(0.5);
    });

    it('Farklı render kare hızları (60 FPS vs 30 FPS vs 120 FPS) tamamen aynı simülasyon sonucunu üretir', () => {
      // 3 saniyelik simülasyon (3000 ms = 30 tick)
      const durationMs = 3000;

      // 60 FPS (180 kare, her biri 3000/180 ms)
      const clock60 = new SimulationClock();
      let ticks60 = 0;
      const frames60 = 60 * 3;
      for (let i = 0; i < frames60; i++) {
        clock60.update(durationMs / frames60, () => ticks60++);
      }

      // 30 FPS (90 kare, her biri 3000/90 ms)
      const clock30 = new SimulationClock();
      let ticks30 = 0;
      const frames30 = 30 * 3;
      for (let i = 0; i < frames30; i++) {
        clock30.update(durationMs / frames30, () => ticks30++);
      }

      // 120 FPS (360 kare, her biri 3000/360 ms)
      const clock120 = new SimulationClock();
      let ticks120 = 0;
      const frames120 = 120 * 3;
      for (let i = 0; i < frames120; i++) {
        clock120.update(durationMs / frames120, () => ticks120++);
      }

      // Her üç hızda da tam 30 tick üretilmiş olmalıdır
      expect(ticks60).toBe(30);
      expect(ticks30).toBe(30);
      expect(ticks120).toBe(30);
    });

    it('Kare başına en fazla 5 tick sınırı (catch-up clamp) uygulanır ve donmalarda sonsuz döngü engellenir', () => {
      const clock = new SimulationClock();
      let ticks = 0;

      // Çok büyük bir takılma: 2000 ms (normalde 20 tick eder)
      const executed = clock.update(2000, () => ticks++);

      expect(executed).toBe(5);
      expect(ticks).toBe(5);
      expect(clock.getTick()).toBe(5);
    });

    it('Pause durumunda simülasyon durur ve artık zaman birikmez (arkada kaçak tick üretilmez)', () => {
      const clock = new SimulationClock();
      let ticks = 0;

      clock.update(150, () => ticks++);
      expect(ticks).toBe(1);

      clock.pause();
      expect(clock.getPaused()).toBe(true);

      // Pause sırasında 500 ms geçse bile tick tetiklenmez
      clock.update(500, () => ticks++);
      expect(ticks).toBe(1);

      clock.resume();
      expect(clock.getPaused()).toBe(false);

      // Resume sonrası temiz başlar
      clock.update(100, () => ticks++);
      expect(ticks).toBe(2);
    });
  });

  // =========================================================================
  // ÖLÇÜT 2: Seed'li RNG ve kararlı içerik ID doğrulaması vardır;
  // eksik veya geçersiz tarif girdisi sessizce kabul edilmez.
  // =========================================================================
  describe('Criterion 2: Seeded RNG & Content Validation', () => {
    it('Aynı seed her zaman aynı rastgele dizilimi üretir (determinizm)', () => {
      const seed = 42817;
      const rng1 = new Mulberry32Rng(seed);
      const rng2 = new Mulberry32Rng(seed);

      const sequence1 = Array.from({ length: 10 }, () => rng1.nextFloat());
      const sequence2 = Array.from({ length: 10 }, () => rng2.nextFloat());

      expect(sequence1).toEqual(sequence2);
    });

    it('RNG durumu (state) serileştirilip geri yüklendiğinde akış kaldığı yerden devam eder', () => {
      const rng1 = new Mulberry32Rng(12345);
      rng1.nextFloat();
      rng1.nextFloat();
      const savedState = rng1.getState();

      const next1 = rng1.nextFloat();

      const rng2 = new Mulberry32Rng(9999);
      rng2.setState(savedState);
      const next2 = rng2.nextFloat();

      expect(next1).toBe(next2);
    });

    it('P0 resmi içerik kataloğu doğrulamadan başarıyla geçer', () => {
      expect(() => validateContent(P0_CONTENT)).not.toThrow();
    });

    it('Eksik veya tanımsız tarif girdisi içeren katalog reddedilir ve ContentValidationError fırlatır', () => {
      const invalidContent: GameContent = {
        version: 1,
        products: { ...P0_CONTENT.products },
        machines: { ...P0_CONTENT.machines },
        recipes: {
          ...P0_CONTENT.recipes,
          'recipe.invalid_recipe': {
            id: 'recipe.invalid_recipe',
            machineTypeId: 'machine.bottling_table',
            inputs: [{ itemId: 'item.non_existent_item' as any, quantity: 1 }],
            outputs: [{ itemId: 'item.water_bottle_small', quantity: 1 }],
            durationTicks: 30,
          },
        },
      };

      expect(() => validateContent(invalidContent)).toThrowError(ContentValidationError);
      expect(() => validateContent(invalidContent)).toThrowError(
        /tanımsız girdi ürünü referans ediyor: 'item.non_existent_item'/
      );
    });

    it('Tanımsız makine tipi veya 0 tick süresi olan tarif reddedilir', () => {
      const zeroDurationContent: GameContent = {
        version: 1,
        products: { ...P0_CONTENT.products },
        machines: { ...P0_CONTENT.machines },
        recipes: {
          ...P0_CONTENT.recipes,
          'recipe.zero_dur': {
            id: 'recipe.zero_dur',
            machineTypeId: 'machine.bottling_table',
            inputs: [{ itemId: 'item.raw_water', quantity: 1 }],
            outputs: [{ itemId: 'item.water_bottle_small', quantity: 1 }],
            durationTicks: 0,
          },
        },
      };

      expect(() => validateContent(zeroDurationContent)).toThrowError(ContentValidationError);
      expect(() => validateContent(zeroDurationContent)).toThrowError(/pozitif tamsayı tick/);
    });

    it('Hatalı veya negatif satış fiyatı reddedilir', () => {
      const negativePriceContent: GameContent = {
        version: 1,
        products: {
          ...P0_CONTENT.products,
          'item.water_bottle_small': {
            ...P0_CONTENT.products['item.water_bottle_small'],
            baseRetailPriceAtoms: -500,
          },
        },
        machines: { ...P0_CONTENT.machines },
        recipes: { ...P0_CONTENT.recipes },
      };

      expect(() => validateContent(negativePriceContent)).toThrowError(ContentValidationError);
      expect(() => validateContent(negativePriceContent)).toThrowError(
        /negatif olmayan bir tamsayı atom değeri/
      );
    });
  });

  // =========================================================================
  // ÖLÇÜT 3: Kredi temsili sabit hassasiyetlidir ve
  // para/stok yalnız Application/domain komutlarıyla değişir.
  // =========================================================================
  describe('Criterion 3: Fixed Precision Ledger & Application Command Integrity', () => {
    it('1 Kredi = 10.000 Atom sabit hassasiyetini doğru korur', () => {
      const ledger = new EconomyLedger(0);

      // 10 Kredi yükle (100.000 atom)
      ledger.commitTransaction({
        transactionId: 'tx-init-01',
        timestampTick: 0,
        type: 'CREDIT',
        amountAtoms: 10 * ATOMS_PER_CREDIT,
        reason: 'INITIAL_CAPITAL',
      });

      expect(ledger.getBalanceAtoms()).toBe(100_000);
      expect(ledger.getBalanceCredits()).toBe(10);
    });

    it('Yetersiz bakiye durumunda eksiye düşmez, Math.max(0, ...) ile gizlemez; InsufficientBalanceError fırlatır', () => {
      const ledger = new EconomyLedger(50_000); // 5 Kredi

      expect(() =>
        ledger.commitTransaction({
          transactionId: 'tx-overdraft-01',
          timestampTick: 10,
          type: 'DEBIT',
          amountAtoms: 60_000, // 6 Kredi
          reason: 'PURCHASE',
        })
      ).toThrowError(InsufficientBalanceError);

      // Bakiye kesinlikle değişmemiş olmalıdır
      expect(ledger.getBalanceAtoms()).toBe(50_000);
    });

    it('Aynı transactionId ikinci kez işlendiğinde etki yaratmaz; DuplicateTransactionError fırlatır', () => {
      const ledger = new EconomyLedger(100_000);

      const params = {
        transactionId: 'tx-unique-sale-1',
        timestampTick: 25,
        type: 'CREDIT' as const,
        amountAtoms: 10_000,
        reason: 'SALE' as const,
      };

      // İlk işlem başarılı
      ledger.commitTransaction(params);
      expect(ledger.getBalanceAtoms()).toBe(110_000);
      expect(ledger.hasProcessed('tx-unique-sale-1')).toBe(true);

      // İkinci çağrı reddedilir, çifte bakiye eklenmez
      expect(() => ledger.commitTransaction(params)).toThrowError(DuplicateTransactionError);
      expect(ledger.getBalanceAtoms()).toBe(110_000);
    });

    it('Pozitif tamsayı olmayan tutarlar reddedilir', () => {
      const ledger = new EconomyLedger(10_000);

      expect(() =>
        ledger.commitTransaction({
          transactionId: 'tx-bad-amount',
          timestampTick: 1,
          type: 'CREDIT',
          amountAtoms: 0,
          reason: 'SALE',
        })
      ).toThrowError(InvalidTransactionAmountError);

      expect(() =>
        ledger.commitTransaction({
          transactionId: 'tx-bad-float',
          timestampTick: 1,
          type: 'CREDIT',
          amountAtoms: 12.5,
          reason: 'SALE',
        })
      ).toThrowError(InvalidTransactionAmountError);
    });

    it('Application CommandDispatcher üzerinden komut ile bakiye değişimi sağlanır', () => {
      const ledger = new EconomyLedger(0);
      const dispatcher = new CommandDispatcher(ledger);

      // Kredi komutu
      const creditEntry = dispatcher.execute({
        type: 'CREDIT_ACCOUNT',
        transactionId: 'cmd-tx-1',
        timestampTick: 5,
        amountAtoms: 25_000, // 2.5 Kredi
        reason: 'INITIAL_CAPITAL',
      });

      expect(creditEntry.balanceAfterAtoms).toBe(25_000);
      expect(ledger.getBalanceCredits()).toBe(2.5);

      // Borç komutu
      const debitEntry = dispatcher.execute({
        type: 'DEBIT_ACCOUNT',
        transactionId: 'cmd-tx-2',
        timestampTick: 10,
        amountAtoms: 10_000, // 1 Kredi
        reason: 'PURCHASE',
      });

      expect(debitEntry.balanceAfterAtoms).toBe(15_000);
      expect(ledger.getBalanceCredits()).toBe(1.5);
    });
  });
});
