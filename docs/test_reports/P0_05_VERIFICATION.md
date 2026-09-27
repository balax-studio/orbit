# P0-05 Doğrulama Raporu: Üç Su Tarifini ve Domates Hasadını Gerçek Girdiyle Çalıştırma

Tarih: 2026-09-27
Görev: P0-05
Durum: Doğrulandı
Test Aracı: Vitest v5.0.2, TypeScript v6.0.2, Oxlint v1.81.0

## 1. Ölçüt Doğrulamaları

### Ölçüt 0: Küçük Şişe, 5 L Bidon ve 19 L Damacana Tariflerinin Ham Su ve İlgili Ambalaj Lotunu Tüketmesi
- **Uygulama:** `src/domain/production/ProductionManager.ts`, `src/domain/inventory/InventoryManager.ts`, `src/content/p0Content.ts`
- **Bulgular:**
  - `station.bottler` istasyonunda katalogda tanımlı üç kanonik su tarifi test edilmiştir:
    - **Küçük Şişe (`recipe.bottle_glass_water_small`):** 1 birim ham su (`item.raw_water`) ve 1 adet küçük şişe (`item.small_bottle`, lot maliyeti 0.20 Kredi) tüketir. 30 tick (3 saniye) sürer. 30. tick tamamlandığında 1 adet `item.glass_water_small` çıktıda oluşturulur ve 0.03 Kredi (300 atom) enerji bedeli ledger hesabından düşülür.
    - **5 L Bidon (`recipe.bottle_jug_5l`):** 10 birim ham su ve 1 adet 5L boş bidon (`item.jug_5l_empty`, lot maliyeti 0.70 Kredi) tüketir. 80 tick (8 saniye) sürer. Tamamlandığında 1 adet `item.water_jug_5l` üretilir ve 0.08 Kredi (800 atom) enerji bedeli düşülür.
    - **19 L Damacana (`recipe.bottle_carboy_19l`):** 38 birim ham su ve 1 adet 19L boş damacana (`item.carboy_19l_empty`, lot maliyeti 2.00 Kredi) tüketir. 180 tick (18 saniye) sürer. Tamamlandığında 1 adet `item.water_carboy_19l` üretilir ve 0.18 Kredi (1800 atom) enerji bedeli düşülür.
  - Eksik girdi (ham su veya ambalaj) durumunda partinin başlamadığı, durumun `NoInput` ve bekleme nedeninin `WAITING_FOR_INPUT` olarak işaretlendiği, `missingInputs` alanında eksik olan girdilerin ve miktarlarının listelendiği doğrulanmıştır.
- **Test:** `tests/unit/p0_production.test.ts` -> "Kabul 1: Üç su tarifinin girdi tüketimi ve ambalaj lotları" (4 test geçti).

### Ölçüt 1: Domates Hasadının Su/Tohum Girdilerini Kullanması; Çıktı Doluysa Girdi ve Ürünün Kaybolmaması
- **Uygulama:** `src/domain/production/ProductionManager.ts`, `src/domain/inventory/InventoryManager.ts`
- **Bulgular:**
  - `source.crop_plot` istasyonunda `recipe.grow_heirloom_tomato` tarifi 2 birim ham su ve 1 adet domates tohumu (`item.tomato_seed`, lot maliyeti 1.00 Kredi) tüketerek 80 tick (8 saniye, 0 E) sonunda 1 salkım taze Ayaş domatesi (`item.heirloom_tomato`) üretir.
  - **T-P0-05b (Çıktı Dolu Korunumu):** Çıktı tamponu (`machineOutput:source.crop_plot`, kapasite 40) doluyken parti tamamlandığında sistem `BlockedOutput` durumuna ve `WAITING_FOR_OUTPUT_SPACE` bekleme nedenine geçer. Parti verisi ve tamamlanan ürün yok edilmez, silinmez veya havaya uçmaz; `remainingTicks = 0` durumunda bekletilir. Çıktı tamponundan yer açıldığı ilk simülasyon tick'inde bekleyen ürün güvenle çıktıya aktarılır, parti temizlenir ve makine `Idle` döner.
  - Başlangıçta çıktı tamponu tamamen doluysa yeni partinin başlatılmadığı, girdilerin tüketilmediği ve `BlockedOutput` korumasının çalıştığı kanıtlanmıştır.
- **Test:** `tests/unit/p0_production.test.ts` -> "Kabul 2: Domates hasadı ve çıktı dolu korunum akışı (T-P0-05b)" (3 test geçti).

### Ölçüt 2: Üretim Süresi, Enerji ve Bekleme Nedeninin Gerçek Domain Durumundan Gösterilmesi
- **Uygulama:** `src/domain/production/ProductionManager.ts`, `src/domain/types.ts`, `src/application/commands.ts`
- **Bulgular:**
  - **T-P0-05 Doğrulaması:** 3 saniyelik küçük su partisinde 29 tick boyunca ürün henüz tamamlanmamış (`remainingTicks` azalır, durum `Running`, `waitReason: 'IN_PRODUCTION'`); 30. tick'te tek küçük su çıktıda belirmiş ve 0.03 Kredi enerji gideri ledger'a işlenmiştir. 31. tick'te mükerrer üretim gerçekleşmemiştir.
  - **T-P0-05c (Su Kaynağı & Debi):** 50 birim haznedeki su 1+10+38+2=51 birimlik taleplere harcandığında 50 birim tüketilmiş, 1 birim eksik kalmıştır. Seviye 1 debi (0.5 birim/sn) ile 20 tick (2 aktif saniye) sonra kaynak tam 1 birim yeni ham su üretmiş ve stok asla negatife düşmemiştir.
  - **T-P0-05d (Debi Yükseltme & İdempotency):** `upgradeWaterSpring` çağrıldığında 80 Kredi (800.000 atom) tek seferde düşülmüş, seviye 2'ye yükselmiş, hazne sınırı 120 birim ve hız 1.0 birim/saniye olmuştur. Aynı transaction kimliğiyle yapılan 2. çağrıda ikinci kesinti yapılmamış (`isDuplicate: true`), yeni hız sonraki tick'ten itibaren tam 10 tick'te 1 birim üretecek şekilde işlemiştir.
  - **T-P0-05e (Açılış Sarfları):** `initializeP0Supplies` ile 50 ham su, 12 küçük şişe, 4 adet 5L bidon, 2 damacana ve 8 tohum tamponlara yüklenmiş; tüm lotların tek fiziksel konumu olduğu ve mükerrer yüklemenin engellendiği doğrulanmıştır.
  - **Bekleme Nedenleri ve Hata Durumları:** `STORAGE_FULL` (hazne dolunca çeşmenin durması), `NoPower` / `WAITING_FOR_POWER` (yetersiz bakiye durumunda enerji gerektiren üretimin durması), `CommandDispatcher` entegrasyonu ile `UPGRADE_WATER_SPRING` ve `SELECT_MACHINE_RECIPE` komutlarının atomik yürütülmesi doğrulanmıştır.
- **Test:** `tests/unit/p0_production.test.ts` -> "Kabul 3: Üretim süresi, enerji ve bekleme nedenleri" (6 test geçti).

## 2. Kalite ve Test Kanıtları
- `npx vitest run`: 57/57 birim test geçti (13 yeni P0-05 üretim testi, 9 P0-04 satış testi, 10 P0-03 transfer testi, 15 core testi, 10 world/input testi).
- `npx oxlint`: 0 uyarı, 0 hata (24 dosyada 116 kuralla temiz).
- `npx tsc -b`: 0 derleme hatası.
- `npm run build`: `tsc -b && vite build` 688 ms'de başarıyla tamamlandı.
