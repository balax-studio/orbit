# P0-02 Doğrulama Raporu: Tek Oda Dünyası, Dokunmatik Hareket ve Pointer Sahipliği

> Tarihsel rapor. Güncel kamera ve footprint düzeltmeleri için [P0-01–P0-04 denetimine](P0_01_04_AUDIT_2026-09-27.md) bakın; Orvant yeniden inceleme istiyor.

Tarih: 2026-09-27
Görev: P0-02
Durum: Doğrulandı
Test Aracı: Vitest v5.0.2, TypeScript v6.0.2, Oxlint v1.81.0, Three.js v0.186.1

## 1. Ölçüt Doğrulamaları

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
