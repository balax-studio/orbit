import { describe, expect, it } from 'vitest';
import { customerStatusLabel } from '../../src/presentation/customerStatus';

describe('customer status feedback', () => {
  it('shows queue progress and distinct outcomes from customer state', () => {
    expect(customerStatusLabel(undefined)).toBe('Müşteri bekleniyor');
    expect(customerStatusLabel({ phase: 'queued', queueIndex: 0, leaveReason: undefined }))
      .toBe('Müşteri kasada işlem bekliyor');
    expect(customerStatusLabel({ phase: 'queued', queueIndex: 1, leaveReason: undefined }))
      .toBe('Kuyrukta · 2. sırada');
    expect(customerStatusLabel({ phase: 'leaving', queueIndex: null, leaveReason: 'OUT_OF_STOCK' }))
      .toBe('Raf boş · müşteri ürün bulamadan ayrılıyor');
    expect(customerStatusLabel({ phase: 'leaving', queueIndex: null, leaveReason: 'BUDGET_REJECTED' }))
      .toBe('Müşteri bütçesi fiyatı karşılamadı');
    expect(customerStatusLabel({ phase: 'leaving', queueIndex: null, leaveReason: 'PATIENCE_EXHAUSTED' }))
      .toBe('Kuyruk süresi doldu · ürün rafa döndü');
  });

  it('does not announce a completed sale before its durable write finishes', () => {
    const customer = { phase: 'leaving' as const, queueIndex: null, leaveReason: 'PURCHASE_COMPLETED' as const };
    expect(customerStatusLabel(customer, true)).toBe('Satış kaydı bekleniyor');
    expect(customerStatusLabel(customer)).toBe('Satış tamamlandı · müşteri çıkıyor');
  });
});
