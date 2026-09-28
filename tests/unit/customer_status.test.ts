import { describe, expect, it } from 'vitest';
import { customerStatusLabel } from '../../src/presentation/customerStatus';

describe('customer status feedback', () => {
  it('shows queue progress and distinct outcomes from customer state', () => {
    expect(customerStatusLabel(undefined)).toBe('Müşteri bekleniyor');
    expect(customerStatusLabel({ phase: 'queued', queueIndex: 0, leaveReason: undefined, profileId: 'worker_profile', patienceRemainingTicks: 0 }))
      .toBe('STANDART (Sabır: 0s): Kasada işlem bekliyor');
    expect(customerStatusLabel({ phase: 'queued', queueIndex: 1, leaveReason: undefined, profileId: 'worker_profile', patienceRemainingTicks: 0 }))
      .toBe('STANDART (Sabır: 0s): Kuyrukta · 2. sırada');
    expect(customerStatusLabel({ phase: 'leaving', queueIndex: null, leaveReason: 'OUT_OF_STOCK', profileId: 'worker_profile', patienceRemainingTicks: 0 }))
      .toBe('STANDART (Sabır: 0s): Raf boş, ürün bulamadı');
    expect(customerStatusLabel({ phase: 'leaving', queueIndex: null, leaveReason: 'BUDGET_REJECTED', profileId: 'worker_profile', patienceRemainingTicks: 0 }))
      .toBe('STANDART (Sabır: 0s): Bütçesi fiyatı karşılamadı');
    expect(customerStatusLabel({ phase: 'leaving', queueIndex: null, leaveReason: 'PATIENCE_EXHAUSTED', profileId: 'worker_profile', patienceRemainingTicks: 0 }))
      .toBe('STANDART (Sabır: 0s): Beklemekten sıkıldı, çıktı');
  });

  it('does not announce a completed sale before its durable write finishes', () => {
    const customer = { phase: 'leaving' as const, queueIndex: null, leaveReason: 'PURCHASE_COMPLETED' as const, profileId: 'worker_profile', patienceRemainingTicks: 0 };
    expect(customerStatusLabel(customer, true)).toBe('STANDART (Sabır: 0s): Satış kaydı bekleniyor');
    expect(customerStatusLabel(customer)).toBe('STANDART (Sabır: 0s): Satış tamamlandı, çıkıyor');
  });
});
