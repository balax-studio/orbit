# P0-01 Doğrulama Raporu: Sabit Simülasyon Saati, Seed ve İçerik Doğrulayıcı Temeli

Tarih: 2026-09-27
Görev: P0-01
Durum: Doğrulandı
Test Aracı: Vitest v5.0.2, TypeScript v6.0.2, Oxlint v1.81.0

## 1. Ölçüt Doğrulamaları

### Ölçüt 0: 100 ms Sabit Simülasyon Saati ve Render Sıklığı Bağımsızlığı
- **Uygulama:** `src/domain/time/clock.ts` (`SimulationClock`)
- **Bulgular:**
  - 100 ms sabit adımlarla tick işletimi doğrulandı.
  - 60 FPS (180 kare), 30 FPS (90 kare) ve 120 FPS (360 kare) ile 3 saniyelik simülasyonda her üç render sıklığında tam olarak 30 tick üretildi.
  - Mikro floating point sapmaları için 1e-5 epsilon toleransı uygulandı.
  - Frame başına azami 5 tick catch-up sınırı (MAX_TICKS_PER_FRAME) test edildi; donmalarda sonsuz döngü engellendi.
  - Pause durumunda simülasyonun durduğu, arka planda kaçak tick üretilmediği ve resume sonrası temiz başladığı doğrulandı.
- **Test:** `tests/unit/p0_core.test.ts` -> "Criterion 1: 100ms Fixed Tick & Frame Rate Invariance" (4 test geçti).

### Ölçüt 1: Seed'li RNG ve Kararlı İçerik ID Doğrulaması
- **Uygulama:** `src/domain/random/rng.ts` (`Mulberry32Rng`), `src/content/p0Content.ts` (`validateContent`)
- **Bulgular:**
  - Aynı seed ile başlatılan Mulberry32Rng serilerinin özdeş rastgele dizilim ürettiği doğrulandı.
  - PRNG durumunun (state) serileştirilip geri yüklendiğinde deterministik akışı tam olarak koruduğu kanıtlandı.
  - P0 ürünleri (9 SKU: ham su, boş şişeler, 3 su boyutu, domates tohumu, taze domates), 3 makine (çeşme, şişeleme tezgâhı, domates yatağı) ve 5 tarif eksiksiz tanımlandı.
  - Tanımsız girdi, tanımsız makine tipi, 0 tick süresi veya negatif satış fiyatı içeren geçersiz içeriklerin `ContentValidationError` ile reddedildiği doğrulandı.
- **Test:** `tests/unit/p0_core.test.ts` -> "Criterion 2: Seeded RNG & Content Validation" (6 test geçti).

### Ölçüt 2: Sabit Hassasiyetli Kredi Temsili ve Komut Bütünlüğü
- **Uygulama:** `src/domain/economy/ledger.ts` (`EconomyLedger`), `src/application/commands.ts` (`CommandDispatcher`)
- **Bulgular:**
  - 1 Kredi = 10.000 Atom tamsayı temsili doğrulandı; kayan noktalı yuvarlama hataları engellendi.
  - Yetersiz bakiye durumunda `InsufficientBalanceError` fırlatıldığı ve bakiyenin korunarak `Math.max(0, ...)` ile gizlenmediği kanıtlandı.
  - Aynı `transactionId` ikinci kez işlendiğinde `DuplicateTransactionError` fırlatıldığı ve çifte bakiye/satış etkisi oluşmadığı (idempotency) doğrulandı.
  - Bakiye değişimlerinin sadece Application CommandDispatcher üzerinden tipli komutlarla gerçekleştirildiği kanıtlandı.
- **Test:** `tests/unit/p0_core.test.ts` -> "Criterion 3: Fixed Precision Ledger & Application Command Integrity" (5 test geçti).

### Ölçüt 3: Gerçek package.json ve Kilit Dosyasına Göre Hedefli Kontrol
- **Komutlar ve Çıktılar:**
  1. `npm test`: 15/15 test geçti (0 hata).
  2. `npm run lint`: 0 uyarı, 0 hata (Oxlint).
  3. `npm run build`: `tsc -b && vite build` başarıyla tamamlandı (0 hata).
