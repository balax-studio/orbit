import type { Customer } from '../domain/types';

type CustomerStatusState = Pick<Customer, 'phase' | 'queueIndex' | 'leaveReason' | 'profileId' | 'patienceRemainingTicks'>;

const PROFILE_NAMES: Record<string, string> = {
  mahalleli: 'Mahalleli',
  arastirmaci: 'Araştırmacı',
  isci: 'Yerleşim Çalışanı',
  worker_profile: 'Standart'
};

export function customerStatusLabel(
  customer: CustomerStatusState | undefined,
  saleWritePending = false,
): string {
  if (!customer) return 'Müşteri bekleniyor';

  const profileName = PROFILE_NAMES[customer.profileId] || 'Müşteri';
  const patienceSec = Math.max(0, Math.floor((customer.patienceRemainingTicks ?? 0) / 10));
  const prefix = `${profileName.toUpperCase()} (Sabır: ${patienceSec}s):`;

  if (customer.phase === 'entering' || customer.phase === 'toShelf') return `${prefix} Rafı inceliyor`;
  if (customer.phase === 'toCheckout') return `${prefix} Kasaya gidiyor`;
  if (customer.phase === 'queued') {
    return customer.queueIndex === 0
      ? `${prefix} Kasada işlem bekliyor`
      : `${prefix} Kuyrukta · ${((customer.queueIndex ?? 0) + 1)}. sırada`;
  }

  if (customer.leaveReason === 'PURCHASE_COMPLETED') {
    return saleWritePending ? `${prefix} Satış kaydı bekleniyor` : `${prefix} Satış tamamlandı, çıkıyor`;
  }
  if (customer.leaveReason === 'OUT_OF_STOCK') return `${prefix} Raf boş, ürün bulamadı`;
  if (customer.leaveReason === 'BUDGET_REJECTED') return `${prefix} Bütçesi fiyatı karşılamadı`;
  if (customer.leaveReason === 'PRICE_REJECTED') return `${prefix} Fiyatı reddetti`;
  if (customer.leaveReason === 'PATIENCE_EXHAUSTED') return `${prefix} Beklemekten sıkıldı, çıktı`;
  if (customer.leaveReason === 'PATH_BLOCKED') return `${prefix} Yolu kapalı, ayrılıyor`;
  return `${prefix} Ayrılıyor`;
}
