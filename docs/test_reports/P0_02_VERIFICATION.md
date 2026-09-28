# P0-02 Doğrulama Raporu: Tek Oda Dünyası, Dokunmatik Hareket ve Pointer Sahipliği

> Tarihsel rapor. Güncel kamera ve footprint düzeltmeleri için [P0-01–P0-04 denetimine](P0_01_04_AUDIT_2026-09-27.md) bakın; Orvant yeniden inceleme istiyor.

Tarih: 2026-09-27
Görev: P0-02
Durum: Güncel web kontrolleri geçti; Orvant görevi D-044 sonrasında yeniden açıldı ve P0-01 kanıtı beklediği için henüz kabul edilmedi.
Test Aracı: Vitest v5.0.2, TypeScript v6.0.2, Oxlint v1.81.0, Three.js v0.186.1

## Güncel D-044 dünya ölçüleri ve kontroller

- Başlangıç sınırı 100×100 m; P0 satış modülü `R3-C0` 12×12 m (`x23..35,z43..55`), üretim bahçesi 12×16 m (`x7..19,z39..55`).
- Oda modülleri 12×12 m standart ölçüyle başlar; izinli en küçük boyut 8×8 m, değişken kenar adımı 4 m'dir. Açık mahalle/üretim modülleri aynı kimlikli kayıtla eklenir.
- Dünya sınırını aşan yeni modül kaydı zemin ve gezinme sınırını büyütür; eski modül kimlikleri, P0 koordinatları ve kaydedilmiş aktör/raf koordinatları kaymaz. Etkin komşular en az 4 m çift yönlü geçitle bağlanır.
- V1 kayıt koordinatları hem normal açılışta hem güvenilir yedekten kurtarmada oyuncu, görevli rotası/hedefi ve raf hücresi için bir kez 2× dönüştürülür; etkin modül kimlikleri geri yüklenir, para/stok/lot/transaction korunur.
- `npx vitest run tests/unit/p0_world_input.test.ts`: 15/15 geçti. Bu dosyada 8×8 oda, 100 m sınırını aşan alan, açık üretim modülü, komşu oda kapısı, pointer sahipliği ve kamera kontrolleri bulunur.
- Tam `npm test`: 11 dosyada 99/99; `npm run lint`: geçti; `npm run build`: geçti, 46 modül ve 849.99 kB ana JS chunk (500 kB Vite uyarısı).
- `http://127.0.0.1:5173/` yerel ön izlemesinde 12×12 satış odası ve HUD açıldı. `SceneRenderer` eski gölge seçeneğinden `PCFShadowMap`'e alındı; son sayfa yüklemesinde yeni konsol hatası/uyarısı oluşmadı.
- Orvant revizyon 143'te D-044 kabul edildi; P0-02 karara bağlandı ancak `todo/blocked` durumundadır, çünkü önkoşul P0-01'in güncel kanıtı bekleniyor. Bu rapor cihaz veya oyuncu kabulü değildir.

## Tarihsel ilk 6×6 temel doğrulaması

Aşağıdaki ilk uygulama kayıtları D-044 öncesi 6×6 dünyaya aittir; güncel boyutlar olarak okunmamalıdır.

## 1. Tarihsel ölçüt doğrulamaları

### Ölçüt 0: Tek Satış Odası, Bahçe Kaynağı ve Başlangıç Footprint'leri
- **Uygulama:** `src/presentation/world/WorldLayout.ts`, `src/presentation/world/SceneRenderer.ts`
- **Bulgular:**
  - R3-C0 Satış Odası: `x12..17, z22..27` (6×6 metre) kesin pafta koordinatları uygulandı.
  - Güney market kapısı `x14..15, z27` ve dış eşik `x14..15, z28..29` tanımlandı.
  - Batı bahçe geçiş koridoru `x10..12, z24..25` ve bahçe alanı `x4..9, z20..27` tanımlandı.
  - P0 İstasyonları ve mobilyaları: Memba Çeşmesi (`x5..6, z21..22`), Domates Yatağı (`x5..6, z25..26`), Şişeleme Tezgâhı (`x12, z22..23`), Satış Rafı (`x12, z26`), Kasa (`x17, z22`) 3B sahnede fiziksel footprint ve servis hücreleriyle yerleştirildi.
  - `WorldLayout.isWalkable` ile açılmamış odalara (R3-C1 rezervi vb.) ve mobilya içine yürüme kesin olarak engellendi.
- **Test:** `tests/unit/p0_world_input.test.ts` -> "Criterion 1: World Layout & Footprint Validation" (4 test geçti).

### Ölçüt 1: Klavyesiz Dokunmatik Hareket ve Pointer Sahipliği (Pointer Isolation)
- **Uygulama:** `src/presentation/input/InputManager.ts`, `src/App.tsx`
- **Bulgular:**
  - `InputManager.isPointerOverUI` ile `[data-ui="true"]` veya `#hud-layer` elemanları üzerindeki pointerdown hareketleri yakalandı ve 3B sahneye sızması engellendi.
  - Tap-to-move ile zemine tıklanan geçerli hedefe yönelme ve hedef işaretçisi gösterimi uygulandı.
  - Sanal joystick / sürükleme hareketiyle yönlendirme uygulandı.
  - Touchcancel / pointercancel durumunda (sistem kesintisi, el çekme) hareketin güvenle sıfırlandığı ve karakterin takılı kalmadığı kanıtlandı.
- **Test:** `tests/unit/p0_world_input.test.ts` -> "Criterion 2: Pointer Ownership & Touch Controls" (4 test geçti).

### Ölçüt 2: Portre Kamera ve HUD Kompanzasyonu
- **Uygulama:** `src/presentation/camera/PortraitCamera.ts`
- **Bulgular:**
  - Alt HUD'ın karakteri kapatmaması için kamera takip hedefinde Z kompanzasyonu (`+1.8m`) uygulandı.
  - Dar portre ekranlarda (`aspect < 1`, tipik 9:16) sahneyi yanlardan kesmemek için dinamik FOV genişletmesi uygulandı.
  - Kameranın yumuşak takip (lerp) ile oyuncuyu ve seçili P0 hedefini HUD altında bırakmadığı kanıtlandı.
- **Test:** `tests/unit/p0_world_input.test.ts` -> "Criterion 3: Portrait Camera Framing & HUD Offset Compensation" (2 test geçti).

## 2. Derleme ve Kalite Kontrolü
- `npm test`: 25/25 birim test geçti (0 hata).
- `npm run lint`: 0 uyarı, 0 hata (Oxlint 18 dosyada).
- `npm run build`: `tsc -b && vite build` başarıyla tamamlandı (728 ms).

## 3. 2026-09-27 Bağımlılık Yeniden İncelemesi

P0-01'in yeniden doğrulanması sonrası mevcut P0-02 kaynakları güncel girdiye karşı tekrar kontrol edildi: `npm test -- tests/unit/p0_world_input.test.ts` 1 dosyada 10/10 test geçti. P0-06 değişikliklerinden sonraki tam build de başarılıdır; güncel ortak lint/build uyarıları P0-06 raporunda kayıtlıdır. Bu yeniden inceleme cihaz testi değildir.

## 4. 2026-09-27 Capacitor/lifecycle değişikliği sonrası

`src/App.tsx` P0-06 kapsamında kayıt ve Capacitor lifecycle bağlantıları için değişti; P0-02 dünya, input ve kamera sözleşmesi korunuyor. Güncel `npm test -- tests/unit/p0_world_input.test.ts`: 10/10 geçti. `npm run build` başarılı (817.20 kB chunk uyarısı); Android/iOS cihaz testi yapılmadı.
