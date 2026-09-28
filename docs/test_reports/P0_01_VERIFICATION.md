# P0-01 Doğrulama Raporu: Sabit Simülasyon Saati, Seed ve İçerik Doğrulayıcı Temeli

## Birleşik kayıt üzerinde güncel yeniden inceleme — 2026-09-28

Orvant revizyon 147'de P0-01 güncel girdilerle yeniden başlatıldı. `npm test -- tests/unit/p0_core.test.ts` 16/16 geçti. Tam `npm test` 12 dosyada 112/112, `npm run lint` ve `npm run build` geçti. Build ana JavaScript paketi 853,06 kB için 500 kB uyarısı verdi. Kaynak incelemesinde `SimulationClock` 100 ms sabit tick, pause ve kare başına beş tick sınırını; `Mulberry32Rng` seed ve state geri yüklemesini; `p0Content` tarif/kimlik doğrulamasını; ledger ve `CommandDispatcher` sabit atom ile komut sınırını koruyor. Bunlar bileşen ve web build kanıtıdır; oynanabilir akış ya da cihaz kabulü değildir.

> Tarihsel rapor. Güncel kod ve kanıt durumu için [P0-01–P0-04 denetimine](P0_01_04_AUDIT_2026-09-27.md) bakın; Orvant yeniden inceleme istiyor.

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
  1. `npm test -- tests/unit/p0_core.test.ts`: 15/15 test geçti.
  2. `npm run build`: `tsc -b && vite build` başarıyla tamamlandı; genel 817.20 kB chunk uyarısı var.
  3. `npm run lint`: çıkış kodu 0; App'te `react(set-state-in-effect)` uyarısı var.

## 2. 2026-09-27 Yeniden İnceleme: P0-06 ortak dosya değişikliklerinden sonra

P0-06 çalışması `clock.ts` ve `ledger.ts` dosyalarını değiştirdiği için önceki Orvant kanıtı yeniden incelendi. Güncel kaynaklarla `npm test -- tests/unit/p0_core.test.ts` çalıştırıldı: 1 dosya, 15/15 test geçti. Ayrıca tam paket 72/72 test geçti ve `npm run build` başarılı oldu.

Güncel lint sonucu `npm run lint`: çıkış kodu 0; `src/App.tsx:148` başlangıç kayıt eşitlemesinde bir `react(set-state-in-effect)` uyarısı var. Build çıktısında 817.20 kB küçültülmüş JS chunk için 500 kB üstü uyarı var. Önceki bölümdeki 72 test ve 786.98 kB build daha eski P0-06 doğrulamasına aittir.

## 3. 2026-09-27 Capacitor hazırlığından sonra package kanıtı yeniden doğrulandı

`package.json`/`package-lock.json` Capacitor 8 runtime/platform/plugin paketleriyle güncellendi. P0-01'in simülasyon, RNG, ekonomi ve içerik kaynakları değişmedi; scriptlerin gerçek manifest ve lockfile ile çalıştığı tekrar kontrol edildi.

- `npm test -- tests/unit/p0_core.test.ts`: 15/15 geçti.
- `npm test`: 7 dosya, 75/75 geçti.
- `npm run build`: başarılı (`tsc -b && vite build`), 817.20 kB chunk uyarısı.
- `npm run lint`: çıkış kodu 0, `src/App.tsx:148` için React uyarısı.
- `npm audit --audit-level=moderate`: 0 açık bulgu; `@capacitor/cli` 8.4.3'e pinlendi.
