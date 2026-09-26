# Teknik mimari

Kaynak: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §16–18, §59, §61, §63 ve §60.3. Hedef TypeScript + Three.js + Vite + Capacitor; ilk arayüz DOM/CSS. React, R3F, Zustand ve Tailwind zorunlu değildir. Depoda beyan edilmiş olmaları kullanım kararı veya çalışan oyun kanıtı değildir.

## P0 — katmanlar

| Yol | Sorumluluk |
|---|---|
| `src/domain/{economy,inventory,production,staff,customers,quests}` | Saf iş kuralları; DOM, Three.js, Capacitor import etmez |
| `src/application/{commands,queries,simulation}` | İşlemler, sorgular, simülasyon orkestrasyonu |
| `src/infrastructure/{save,clock,random,native-store,ads}` | Kalıcılık, enjekte saat/RNG, platform adaptörleri |
| `src/presentation/{world,camera,picking,ui,input,audio}` | Three.js sahnesi ve DOM etkileşimi |
| `src/app/{bootstrap,router,lifecycle}` | Başlatma, ekran ve LifecycleCoordinator |
| `src/content/{items,recipes,machines,events,staff,quests}` | Sürümlü tanımlar ve kararlı ID'ler |
| `src/styles/{tokens,components,safe-area}` | Ortak görsel token ve mobil alanlar |
| `public/{models,textures,fonts,audio}` | Yerel paketlenen varlıklar |
| `tests/{unit,integration,device}`, `docs/{decisions,balance,playtests}` | Kanıt ve karar kayıtları |
| `android/`, `ios/` | Capacitor tarafından üretilen platform projeleri |

Bunlar hedef dizinlerdir; bu belge onları oluşturmaz. UI → Application → Domain; renderer Application sorgularını okur. Native SDK'lar port/adaptör sınırında kalır. Tek EconomyLedger ve SimulationClock vardır.

## P0 — zaman ve render

Yapıştırılan zaman/simülasyon sorularının bire bir uygulama cevapları [KARARLAR.md](KARARLAR.md) D-007'dedir: 100 ms mantık adımı, render interpolasyonu, arka planda tam durma, çevrimdışı ilerleme olmaması ve sınırlı foreground tick borcu. Beş tick/frame sınırı teknik başlangıç kararıdır; cihaz kanıtıyla doğrulanır.

E.3 uygulama sözleşmesi [KARARLAR.md](KARARLAR.md) D-020'dedir: varsa Zustand/React seçicileri panel verisini yayınlar; R3F `useFrame` iki mantıksal pozu çizer. 10 Hz Domain state'ini bütün React/R3F bileşen ağacına zorla yeniden render ettirme. Tam P0 kayıt tipi [DOMAIN_MODEL.md](DOMAIN_MODEL.md) içindedir.

- Domain 100 ms sabit adımla (10 Hz), renderer `renderer.setAnimationLoop()` ile çalışır. Animasyon enterpolasyonu iş kurallarını değiştirmez.
- Birikimli süre ve sınırlı catch-up adımları kullanılır; borç ölçülür. Kontrolsüz döngü veya kare başına tek adım atıp kalan zamanı sessizce atma yoktur. Aşımda simülasyon ve oyun saati birlikte yavaşlayabilir.
- Oyun günü 900 aktif simülasyon saniyesidir. Enjekte saat ve seed'li RNG kullanılır; Domain'de `Date.now()`/`Math.random()` yoktur.
- Mantıksal konum, rota, envanter ve müşteri durumu renderer'a ait değildir. Görsel mesh/enterpolasyon ayrıdır; sahne yeniden kurulunca ekonomi devam eder.

## P0 — kayıt ve yaşam döngüsü

Kayıt dosyası, yedek, günlük küçültme, görünür kayıt durumu, dolu disk ve göç kararları [KARARLAR.md](KARARLAR.md) D-008'dedir. Kritik para/stok işlemi kaydı bekler; 30 aktif saniyelik checkpoint bu garantinin yerine geçmez.

Capacitor Filesystem adaptörüyle uygulamanın kalıcı özel alanına versioned JSON snapshot + append-only işlem günlüğü yazılır. Web geliştirme adaptörü aynı sözleşmeyi sağlar; tek localStorage JSON yazımı dayanıklı mobil kayıt yerine geçmez.

Günlük transactionId/sequence/checksum taşır; snapshot son kapsadığı sequence'i tutar. Kritik stok/para değişimi dayanıklı yazım onayından önce tamamlandı gösterilmez. Tek yazıcı, 30 aktif saniyede checkpoint, doğrulanmış yedek ve göç zinciri gerekir. Yükleme tam işlemleri bir kez oynatır, yarım son kaydı reddeder. Günlük ancak snapshot ve yedek doğrulandıktan sonra küçültülür. Bozuk/yeni sürümlü kayıt veya dolu disk sessiz sıfırlama üretmez.

LifecycleCoordinator visibility ve native sinyalleri birleştirir. UI/platform duraklatmaları çakışabilir; birinin kapanması diğerini kaldırmaz. Arka planda render/simülasyon durur. Dönüş foreground + kullanıcı devamı gerektirir. Kapanış callback'inin gelmesi garanti değildir.

## P0–A2 — paketleme

Sürümleri kurulum gününde doğrula ve package-lock.json ile kilitle. Capacitor `appId` kararlı, `webDir: dist`; kimlik seçimi karar kaydında tutulur. Android ve iOS native projeleri ilk gün hedefidir. Build → cap sync → platform cihaz derlemesi akışı doğrulanır. Asset yolları yerel bundle'da çalışır; release içinde localhost, remote server/development URL veya secret kalmaz. iOS macOS/Xcode ister; engel kaydı platform kabulünü açık tutar.

## A3–A5 — ölçek ve dış hizmetler

Değişim tabanlı görevler, rota önbelleği, yol arama bütçesi, nesne havuzu ve instancing kullanılır. Stok adedi kadar mesh üretilmez. Context-loss kurtarması mantıksal dünyayı korur. Reklam/IAP A4 sandbox adaptörüdür; UI SDK çağırmaz. Hak kaydı ekonomi kaydından ayrıdır; aynı mağaza hesabında restore desteklenir, platformlar arası bulut aktarımı vaat edilmez.

Kabul ve sayısal bütçeler [TEST_STRATEGY.md](TEST_STRATEGY.md) içindedir.

## P0 teknik karar taslağı — yürütme sırası

Aşağıdaki sıralama KARAR'dır; anayasanın tek saat/atomik işlem şartının uygulanabilir önerisidir. Bir tick için komut kabulü, görev/rezervasyon çözümü, hareket/istasyon erişimi, üretim, müşteri/kasa ve ilerleme olayları kararlı sırada işlenir. Aynı tick içindeki eşit öncelikte entity ID/sequence gibi kararlı bağlayıcı kullanılır; DOM sırası veya Map'e rastgele eklenme sonucu belirlemez. Faz eklenince sıra açıkça güncellenir.

Render gerçek kare süresini toplayabilir; yalnız sabit 100 ms adımları Domain'e verir. D-007/D-022 uygulama kararı frame başına en fazla 5 tick'tir; bu sınır cihazda doğrulanır. Sınır yüzünden işlenmeyen süreyi oyun gününe eklemek yasaktır. Resume anında eski arka plan delta'sı temizlenir; kapalı süre üretim/ücret/kuyruk olarak hesaplanmaz. Görsel enterpolasyon gelecekte gerçekleşmiş satış oluşturamaz.

Çalışan state kimlik indeksleri ve aktif alt kümelerle erişilir; snapshot'ın dizi biçimi bundan bağımsızdır ([KARARLAR.md](KARARLAR.md) D-021). Domain saati ve sürümlü RNG akışları enjekte edilir (D-022). P0 raycast/context-loss/instancing tercihleri D-023; ses eşzamanlılığı D-025'tedir.

## Dayanıklı kayıt protokolü — referans akış

KAYNAK: §60.3. Uygulama, kullanılan dosya API'sinin atomiklik/dayanıklılık garantilerini cihazda doğrulamalıdır; Filesystem yazım Promise'inin fiziksel disk flush garantisi olduğu varsayılmaz.

Serileştirme, tek yazıcı ve `appStateChange`/visibility birleşiminin somut sırası [KARARLAR.md](KARARLAR.md) D-024'tedir. Kritik işlem yazımı pause callback'ine bırakılmaz; snapshot asenkronluğunda önceki doğrulanmış kayıt korunur.

1. Tek yazıcı komutu doğrular ve değişiklik adayını hazırlar; doğrulama başarısızsa mevcut state korunur.
2. İşlem kimliği, sequence, payload ve checksum içeren tam günlük kaydını kalıcı adaptöre gönderir. Arayüz o işlem için bekleyen durumu gösterir.
3. Kalıcı başarıdan sonra aday state ve UI sonucu yayınlanır. Domain uygulaması başarısız olursa yeni ekonomik komut durdurulur ve kayıttan kurtarma yapılır; günlüğe yazılmış işlem unutulmaz.
4. Checkpoint tutarlı bir sequence üzerinden hazırlanır. Yeni snapshot ayrı aday olarak yazılır, okunup doğrulanır; önceki doğrulanmış sürüm korunur.
5. Aktif snapshot seçimi ve yedek güvenliği doğrulanmadan günlük temizlenmez. Rename/replace atomikliği belirsizse iki slot ve doğrulanan sequence seçimi gibi adaptör stratejisi ayrıca kararlaştırılır.
6. Açılışta schema/içerik uyumu ve checksum doğrulanır; geçerli snapshot sonrası günlük işlemleri sırayla, bir kez uygulanır. Ortadaki bozuk kayıt “yarım son satır” kabul edilmez; kurtarma ekranına gider.

Crash noktaları: yazımdan önce, yarım günlük, tam günlük/UI öncesi, snapshot yazarken, aktif snapshot değişirken, günlük küçültürken. Her biri TEST_STRATEGY.md fixture'ıyla sınanır. Snapshot'ın kapsadığı işlem kimlikleri checkpoint sonrası yinelenen komutu da yakalayacak kalıcı dedup bilgisine ihtiyaç duyar; yalnız RAM Set'i yeterli değildir.

Depolama yetersizliğinde başarısız ekonomi işlemi tekrarlanabilir bekleme/hata olarak gösterilir; tamamlandı denmez. Bozuk ana kayıtta yedek kullanılabilirliği ve kaybedilebilecek ilerleme açıklanır; otomatik boş kayıtla üzerine yazılmaz. Yeni şema eski uygulamayla açılmaz. Göç orijinal doğrulanmış kopya korunarak uygulanır.

## Lifecycle çakışma tablosu

| Durum | Sonuç |
|---|---|
| İnşa açıkken background | Her iki pause nedeni korunur; checkpoint istenir |
| Foreground sinyali, inşa hâlâ açık | Renderer güvenle hazırlanabilir; simülasyon başlamaz |
| Reklam kapanışı, uygulama background | Reklam nedeni çözülse bile platform nedeni sürer |
| Kullanıcı devamı, kayıt kurtarma bekliyor | Simülasyon başlamaz; kurtarma tamamlanmalı |
| Yinelenen focus/visibility | Tek geçiş; ikinci kayıt/ödül/resume oluşturmaz |
| OS habersiz sonlandırdı | Son durable ekonomik işlem geri yüklenir; hareket checkpoint'e dönebilir |

## Sahne kaynaklarının ömrü

Kamera, render maliyeti, raycast ve context-loss sonrası sahne kurma kararları [KARARLAR.md](KARARLAR.md) D-009/D-016'ya bağlıdır. Render durumu kaybedilse de Domain ve son doğrulanmış save korunur.

Mobil ayrıntılar [KARARLAR.md](KARARLAR.md) D-034–D-039'da sabittir: iOS klavyesinde Canvas boyutu korunur, Android'de panel `visualViewport` ile taşınır; context kaybında GPU kaynakları yeniden kurulur; P0 üretim sözdizimi hedefi `es2020` ve destek hipotezi iOS 16+/Android 10+'dır. Kısa sesler sınırlı önbelleğe alınır; 6×6 rotası olayla tetiklenen grid A*'tır; safe-area ortak CSS tokenlarıyla uygulanır. Bunlar henüz kodlanmış veya cihazda doğrulanmış özellikler değildir.

Renderer dünya state'inden yeniden kurulabilir. Sahne kaldırılırken sahip olunan geometry/material/texture, event listener ve animasyon kaynakları bırakılır; paylaşılan kaynaklar son kullanıcı bitmeden dispose edilmez. Context restored olayında eski GPU handle'ları çalışır varsayılmaz. Tekrar giriş testinde renderer.info değerlerinin sürekli büyümesi sızıntı işaretidir; kaç geçiş ve yük kullanıldığı raporlanır. Bu teknik test cihaz bellek ölçümünün yerine geçmez.
