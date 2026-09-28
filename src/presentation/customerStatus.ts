import type { Customer } from '../domain/types';

type CustomerStatusState = Pick<Customer, 'phase' | 'queueIndex' | 'leaveReason'>;

export function customerStatusLabel(
  customer: CustomerStatusState | undefined,
  saleWritePending = false,
): string {
  if (!customer) return 'Müşteri bekleniyor';

  if (customer.phase === 'entering' || customer.phase === 'toShelf') return 'Müşteri rafı inceliyor';
  if (customer.phase === 'toCheckout') return 'Müşteri kasaya gidiyor';
  if (customer.phase === 'queued') {
    return customer.queueIndex === 0
      ? 'Müşteri kasada işlem bekliyor'
      : `Kuyrukta · ${((customer.queueIndex ?? 0) + 1)}. sırada`;
  }

  if (customer.leaveReason === 'PURCHASE_COMPLETED') {
    return saleWritePending ? 'Satış kaydı bekleniyor' : 'Satış tamamlandı · müşteri çıkıyor';
  }
  if (customer.leaveReason === 'OUT_OF_STOCK') return 'Raf boş · müşteri ürün bulamadan ayrılıyor';
  if (customer.leaveReason === 'BUDGET_REJECTED') return 'Müşteri bütçesi fiyatı karşılamadı';
  if (customer.leaveReason === 'PRICE_REJECTED') return 'Müşteri fiyatı reddetti';
  if (customer.leaveReason === 'PATIENCE_EXHAUSTED') return 'Kuyruk süresi doldu · ürün rafa döndü';
  if (customer.leaveReason === 'PATH_BLOCKED') return 'Müşteri yolu kapalı · ayrılıyor';
  return 'Müşteri ayrılıyor';
}
