# RPG, İlerleme ve Bölümler (AI Geliştirici Paketi)

Bu dosya, oyun içi bölümlerin, RPG yeteneklerinin ve karakter statülerinin kod içinde nasıl uygulanacağına dair somut veri yapılarıdır.

## 1. Oyun İlerleme Tablosu (Chapter Progression)
Zustand'daki `checkProgression()` aksiyonu şu kurallarla çalışır:

```typescript
export interface ChapterCondition {
  chapterId: number;
  requiredSales: number;
  requiredReputation?: number;
  requiredAP?: number;
  unlockedFeatures: string[];
}

export const CHAPTERS: ChapterCondition[] = [
  { chapterId: 1, requiredSales: 0, unlockedFeatures: ['basic_transport', 'shelf', 'register'] },
  { chapterId: 2, requiredSales: 25, unlockedFeatures: ['hire_staff', 'storage_room', 'tier2_recipes'] },
  { chapterId: 3, requiredSales: 85, unlockedFeatures: ['modules', 'energy_management', 'quality_system'] },
  { chapterId: 4, requiredSales: 205, unlockedFeatures: ['tier3_recipes', 'regional_contracts'] },
  { chapterId: 5, requiredSales: 400, requiredReputation: 40, unlockedFeatures: ['final_projects'] }
];
```
*Not: Satış sayıları oyun boyunca kümülatiftir (sıfırlanmaz).*

## 2. RPG Uzmanlıkları (Skill Tree Uygulaması)
Yetenek ağacı bir Dictionary (Record) olarak koda yansır.
```typescript
export type SkillId = 'trader_bulk' | 'engineer_speed' | 'community_train';

export const SKILL_EFFECTS: Record<SkillId, { type: string, value: number }> = {
  'trader_bulk': { type: 'MULTI_SELL_CHANCE', value: 0.2 }, // %20 ihtimalle toplu satış
  'engineer_speed': { type: 'MACHINE_SPEED_MULT', value: 1.15 }, // Makineler %15 hızlı
  'community_train': { type: 'TRAINING_COST_MULT', value: 0.8 } // Eğitim maliyeti -%20
};
```

## 3. Personel Çalışma Mekaniği (Simülasyon Detayları)
- **Yorgunluk (Fatigue):** 0 ile 100 arasındadır. 4 dakika çalışma = 240 saniye. 
  - `fatigue_rate = 100 / 240 = 0.41 per saniye`
  - Yorgunluk %80'i geçince karakter kırmızıya (alert red) döner ve otomatik mola alanına gider.
- **Hız Modifikatörü:** Personelin hızı yorgunluğuna göre kısıtlanır.
  - `currentSpeed = baseSpeed * Math.max(0.75, (1 - (fatigue / 100)))`

## 4. Kısıtlamalar (AI İçin Kırmızı Çizgiler)
- Personel sayı sınırı **maksimum 20'dir**. Array length kontrolü zorunludur.
- Araştırma puanı (AP) maksimum sınırı 20'dir. Fazlası kazanılamaz.
- Başlangıçta (Bölüm 1) **Sadece Raf Görevlisi** (Restocker) kiralanabilir. Diğer meslekler Bölüm 2 ve sonrasında açılmalıdır.
