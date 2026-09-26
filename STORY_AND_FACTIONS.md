# Hikaye, Etkinlikler ve Fraksiyonlar (AI Geliştirici Paketi)

Bu dosya, dünya olayları (Events) simülasyonunu ve Fraksiyon (İtibar) entegrasyonunu kodlayacak ajan için kesin veri yapılarıdır.

## 1. Etkinlik (Event) JSON Mimarisi
Dünya olayları, `EventSystem` tarafından şu yapıya göre işletilir:

```typescript
export type EventModifierTarget = 'demand' | 'cost' | 'power' | 'customer_spawn';

export interface GameEvent {
  id: string; // Örn: 'colony_festival'
  name: string;
  durationHours: number; // Oyun saati
  modifiers: {
    target: EventModifierTarget;
    category?: ItemCategory; // Sadece belirli eşyaları etkilemesi için
    multiplier: number; // 1.25 = %25 artış
  }[];
  cooldownDays: number;
}

export const EVENTS: GameEvent[] = [
  {
    id: 'colony_festival',
    name: 'Koloni Festivali',
    durationHours: 24,
    modifiers: [
      { target: 'demand', multiplier: 1.25 } // İçecek ve dekor talebinde artış (ek mantıkla sınırlandırılır)
    ],
    cooldownDays: 7
  },
  {
    id: 'demand_slump',
    name: 'Yerel Durgunluk',
    durationHours: 48,
    modifiers: [
      { target: 'customer_spawn', multiplier: 0.8 } // Geliş hızı -%20
    ],
    cooldownDays: 5
  }
];
```

## 2. Etkinlik Seçim ve Sınırlama Mantığı (Event Manager)
Event sistemi `useGameLoop` içerisinde her yeni oyun gününde (veya belli saatte) kontrol edilir.
- Bir olumsuz olayın bitiminden itibaren en az **2 oyun günü** geçmeden yeni olumsuz olay tetiklenemez.
- Olay Çarpanları Sınırı (Clamp): 
  - Talep Çarpanı `EventDemandFactor` sınırları: `Min: 0.65, Max: 1.40`
  - Maliyet Çarpanı `EventCostFactor` sınırları: `Min: 0.85, Max: 1.35`
- Asla iki olay üst üste binerek (stacking) matematiği bozamaz. Yukarıdaki sınırlar (`Math.min` ve `Math.max`) uygulanır.

## 3. Fraksiyon İtibar Veri Yapısı (Factions)
```typescript
export interface FactionReputation {
  factionId: 'community' | 'researchers' | 'traders';
  score: number; // 0-100 arası
}

// İtibar Kazanım Sabitleri:
const REP_REWARD_NORMAL_CONTRACT = +2;
const REP_REWARD_CRISIS = +10;
```
Oyuncunun UI ekranında bu fraksiyonlara ait üç farklı ilerleme çubuğu bulunur. Puanlar 100'ü geçemez (Clamp edilir). Bölüm 5'e geçiş için en az bir fraksiyonda `score >= 40` olma şartı aranır.

## 4. Kısıtlamalar (AI İçin Kırmızı Çizgiler)
- Hiçbir olay oyuncunun mevcut parasını (kredi) doğrudan kasadan çalarak azaltamaz.
- Hiçbir olay oyuncunun depolarını (inventory) rastgele silemez. Olaylar sadece üretim hızlarını, müşteri taleplerini veya satın alım maliyetlerini (Modifiers) değiştirebilir.
