# Ekonomi ve Matematiksel Modeller (AI Geliştirici Paketi)

Bu dosya, Orbit Market'in kesin matematik formüllerini içerir. AI ajanları tüm ekonomik işlemleri buradaki JS/TS formüllerine göre uygulamak zorundadır.

## 1. Ürün Kataloğu JSON Formatı (Veritabanı Sabitleri)
`content/items.json` formatı şu şekilde kodlanmalıdır:
```json
[
  { "id": "water", "name": "İçme suyu", "type": "Final", "cost": 1.06, "price": 5.00 },
  { "id": "nutrient_cube", "name": "Besin küpü", "type": "Final", "cost": 4.00, "price": 12.00 },
  { "id": "expedition_ration", "name": "Sefer öğünü", "type": "Final", "cost": 10.97, "price": 40.00 }
]
```
*(Geri kalan ürünler OYUN_GELISTIRME_DEVIR_DOSYASI.md Bölüm 37'den birebir çekilmelidir.)*

## 2. Kalite Skoru Formülü (TypeScript Uygulaması)
Kalite skoru bir ürün işlendiğinde hesaplanır.

```typescript
function calculateQuality(
  inputQualities: number[], // Giren ürünlerin 0-100 arası kaliteleri
  calibrationScore: number, // Makinenin o anki kalibrasyonu (0-100)
  staffSkill: number // O anki operatörün yeteneği (0-100). Personel yoksa 40.
): QualityTier {
  
  const avgInput = inputQualities.reduce((a, b) => a + b, 0) / (inputQualities.length || 1);
  const operatorSkill = staffSkill > 0 ? staffSkill : 40;
  
  let rawScore = (0.5 * avgInput) + (0.3 * calibrationScore) + (0.2 * operatorSkill);
  rawScore = Math.max(0, Math.min(100, rawScore)); // Clamp 0-100
  
  if (rawScore >= 85) return 'Özel';
  if (rawScore >= 60) return 'Nitelikli';
  return 'Standard';
}
```

## 3. Fiyat Çarpanı Formülü
Satış işlemi sırasında müşteriden alınacak ücretin hesaplanması:
```typescript
function getFinalPrice(basePrice: number, quality: QualityTier): number {
  switch(quality) {
    case 'Özel': return basePrice * 1.30;
    case 'Nitelikli': return basePrice * 1.15;
    case 'Standard': 
    default: return basePrice * 1.00;
  }
}
```

## 4. Makine Üretim Döngüsü Formülü
Simülasyonda 1 makinenin üreteceği sürenin hesaplanması:
```typescript
// Makine Seviyesi II ise %15 hız bonusu uygulanır.
function getProcessingTime(baseTimeMs: number, machineLevel: number): number {
  if (machineLevel === 2 || machineLevel === 3) {
    return baseTimeMs * 0.85; 
  }
  return baseTimeMs;
}
```

## 5. Kısıtlamalar (AI İçin)
- Müşterilerin bütçeleri vardır. Müşteri bütçesi `Nitelikli` veya `Özel` ürünü almaya yetmiyorsa, rafta bu ürünler olsa bile alım yapmazlar veya `Standard` olana yönelirler.
- Fiyatlar dinamik olarak oyuncu nakdine göre **değiştirilemez**. Sabittir.
