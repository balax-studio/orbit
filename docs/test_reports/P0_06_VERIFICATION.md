# P0-06 Doğrulama Raporu: Snapshot, Kritik İşlem Günlüğü ve Lifecycle

## 28 Eylül 2026 — yeniden inceleme ve üretim hata yolu

- `runDurableProductionTick` artık üretim tick'i veya günlük payload'ı hazırlanırken senkron hata çıkarsa ledger, envanter ve üretim snapshot'larını geri alıyor. Asenkron günlük yazım hatasında var olan rollback korunuyor.
- `npm test -- tests/unit/p0_save.test.ts tests/unit/async_save_service.test.ts tests/unit/capacitor_filesystem_save_storage.test.ts tests/unit/lifecycle.test.ts`: 3 bulunan dosyada 27/27 geçti. `lifecycle.test.ts` adlı dosya yok; bu filtre yeni test çalıştırmadı.
- `npm run build`: geçti. Ana JS paketi 879,09 kB; Vite boyut uyarısı verdi. `git diff --check`: hata yok, mevcut satır sonu uyarıları var.
- Bu kontroller dosya ve uygulama düzeyindedir. Android/iOS arka plan kesintisi ve dış oyuncu kabulü P0-09 kapsamında hâlâ açık.

Tarih: 2026-09-27
Görev: P0-06
Durum: D-044 save göçü sonrası yeniden incelemede; Orvant P0-06 `todo/blocked` (P0-01 kaynak kanıtı bekleniyor). Gerçek cihaz kabulü P0-09 kapsamında açık
Test araçları: Vitest 5.0.2, TypeScript 6.0.2, Oxlint 1.81.0

## D-044 sonrası ek doğrulama — koordinat göçü

- `src/application/worldLayoutMigration.ts`: V1 save'de oyuncu, görevli konumu/kaynak/hedefi ve raf koordinatı bir kez 2× ölçeklenir; bakiye, stok, lotlar, işlem kimlikleri ve `worldModules.activeModuleIds` korunur. V2 save yeniden ölçeklenmez; bilinmeyen gelecek sürüm reddedilir.
- `src/App.tsx`: Aynı göç normal açılışta ve güvenilir yedekten kurtarmada state geri yüklenmeden önce çalışır; yeni sürüm checkpoint'i yazılır.
- `npx vitest run tests/unit/world_layout_migration.test.ts`: 3/3 geçti. Güncel tam `npm test`: 11 dosya, 99/99; `npm run lint` ve `npm run build` geçti. Build ana JS chunk'ı 849.99 kB; Vite 500 kB üstü uyarısı veriyor.
- Orvant revizyon 145'te D-044 kabul edildi. Eski P0-06 kabul kaydı, App save yolu ve anayasa girdisi değiştiği için yeniden açıldı; P0-01 kaynak kanıtı yenilenene kadar P0-06 `todo/blocked`. Bu kontrol gerçek cihaz veya P0-09 oyuncu kabulü değildir.

## Önceki P0-06 davranışı (D-044 öncesi)

- `src/infrastructure/save/SaveService.ts`: sürümlü snapshot, yedek ve append-only JSONL günlük; sequence/checksum ve transaction ID ile yinelenen işlemi eleme; yazım sonrası geri okuma; bozuk ana/yedek kayıt için görünür hata; tamamlanmamış son günlük satırını kurtarma; doğrulanmış checkpoint sonrası günlük daraltma.
- `src/app/lifecycle/LifecycleCoordinator.ts` ve `src/domain/time/clock.ts`: birden çok pause nedenini birleştirme, yinelenen platform/UI arka plan sinyalini tek checkpoint'e indirme ve pause aynı render frame'inde gelirse kalan tick'leri durdurma.
- `src/App.tsx`: ledger, envanter, üretim makineleri, tick ve oyuncu konumunu aynı payload'da tutma; CommandDispatcher'ı canlı InventoryManager ve SaveService'e bağlama; üretim tick'lerini çalıştırıp kritik üretim sonuçlarını aynı günlüğe yazma; arka plan duraklatma sinyalleri, kayıt hatasında simülasyonu kilitleme ve görünür yeniden dene/son iyi kaydı kurtar kontrolleri. Önceki ledger-only kayıtlar açılışta yeni envanter/üretim başlangıç durumuyla doğrulanmış checkpoint'e yükseltilir; snapshot'lardan yalnız birinin bulunması görünür kurtarma hatası üretir.
- `src/application/commands.ts` ve `src/domain/production/ProductionManager.ts`: kayıt yazımı başarısız olduğunda ekonomik/inventory durumunu geri alma ve işlem sonuçlarını commit gözlemcisine verme kancaları. `executeAsync` native yazım doğrulanmadan komut sonucunu döndürmez.
- `src/application/DurableProductionTick.ts`: aynı tick'te doğan kritik üretim sonuçlarını tek günlük kaydında birleştirir; yazım reddedilirse ledger/envanter/üretim durumunu geri alır.
- Capacitor 8 `App` plugin'i native `appStateChange`/`pause`/`resume` olaylarını tek LifecycleCoordinator'a bağlar. `capacitor.config.ts` ile Android/iOS proje kabukları üretildi ve `npx cap sync` başarılı oldu; yapılandırma kimliği `com.orbitmarket.prototype` şimdilik prototip kimliğidir.
- `src/infrastructure/save/CapacitorFilesystemSaveStorage.ts`: app-private `Directory.Data` üzerinde UTF-8 okuma/yazma/append/silme işlemleri, anahtar yolu doğrulama ve seri yazma kuyruğu.
- `src/infrastructure/save/AsyncSaveService.ts`: Filesystem Promise işlemlerini sıraya alıp mevcut SaveService doğrulamasıyla günlük ve snapshot yazımını geri okur. App native ortamda bu servisi kullanır; bekleyen yazımda yeni komut/tick ilerlemez, hata görünür kurtarma durumuna geçer.

## Önceki kontroller (D-044 öncesi)

- `npm test -- tests/unit/p0_save.test.ts`: 16/16 geçti.
- `npm test -- tests/unit/capacitor_filesystem_save_storage.test.ts`: 3/3 geçti; iki hedefli dosya birlikte 19/19 geçti.
- `npm test -- tests/unit/async_save_service.test.ts`: 7/7 geçti; geri okuma, yeniden yükleme, tekrar işlem, checkpoint, native satış/transfer, üretim ve yazım hatasında geri alma kapsandı.
- `npm run build`: başarılı (`tsc -b && vite build`). Vite, küçültülmüş 823.40 kB JS chunk için 500 kB üstü uyarısı verdi.
- `npx cap sync`: Android ve iOS plugin eşitlemesi başarılı; App ve Filesystem bulundu.
- `npm run lint`: çıkış kodu 0, uyarı yok.
- `npm audit --audit-level=moderate`: Capacitor CLI 8.4.3'e sabitleme sonrası 0 açık bulgu.
- `npm test`: 8 test dosyası, 82/82 geçti.
- `git diff --check`: hata yok; Git mevcut dosyalar için LF/CRLF dönüşüm uyarıları verdi.

## Önceki ölçüt incelemesi ve açık boşluklar

1. **Satış/üretim/transfer durable olarak bir kez:** **Kod ve bileşen düzeyinde doğrulandı.** App'in native CommandDispatcher yolu `executeAsync` ile Filesystem günlüğünün okunarak doğrulanmasını bekler; `runDurableProductionTick` aynı tick'in kritik sonuçlarını tek kayda bağlar. Hata durumunda bellek etkisi geri alınır, simülasyon bloklanır, yeniden yükleme günlüğü uzlaştırır. Hedefli test gerçek satış/transfer komutlarını ve üretim sonucunu asenkron storage üzerinden yeniden yükleyip yinelenen etkisizliği doğruladı. Oyuncu müşteri/transfer etkileşimi henüz App'e bağlanmadı; bu P0 oynanış/cihaz kabulünde ayrıca gösterilmelidir.
2. **Yarım/bozuk kayıt için görünür kurtarma:** **Bileşen düzeyinde doğrulandı.** Testler yırtık son satırı, bozuk snapshot/yedeği, son iyi kayıt adayını ve kurtarma bulunmadığında hata vermeyi kapsıyor. App kurtarma durumunu gösterip sessiz boş kayda geçmiyor. Browser UI için E2E/cihaz doğrulaması yapılmadı.
3. **Background sırasında ilerlememe ve dönüşte çift tick/işlem olmaması:** **Bileşen düzeyinde doğrulandı.** Lifecycle testleri yinelenen pause sinyalleri, pause nedenleri, kayıt hatası ve aynı frame'de tick kesilmesini kapsıyor. Platform adaptörü ve gerçek Android/iOS lifecycle testi yapılmadı.

Capacitor native projeleri Windows'ta üretildi ve sync edildi, ancak Android build ortamı bulunmuyor (`java` ve Android SDK kurulu değil); iOS build için Xcode/macOS gerekir. Gerçek cihaz kesinti testi yapılmadı; Filesystem Promise çözülmesi `fsync` veya atomik yazım garantisi olarak yorumlanmaz. Bu bölüm D-044 öncesi P0-06 kod/bileşen ölçütlerinin önceki doğrulamasıdır; yeni save göçü kanıtı üstte yer alır. Gerçek cihaz, kesinti ve yardım almadan oyuncu döngüsü P0-09 kabulünde ayrıca kanıt gerektirir.
