# Fazlara göre doğrulama ve kabul

Kaynak: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §20, §35, §44, §49, §54, §58, §60.8, §63. Bu belge test planıdır; geçilmiş sonuç değildir. Mevcut package.json'da test script'i yoktur. Saf TypeScript testleri için Vitest kurulumu bir P0 uygulama seçimidir; mevcutmuş gibi komut verilmez.

## Doğrulama katmanları

Domain birim testleri enjekte saat/RNG ile; Application entegrasyonu gerçek işlem/kayıt akışıyla; browser testleri giriş/DOM/asset/lifecycle ile; cihaz testleri gerçek Capacitor Android/iOS build'leriyle yapılır. Unit ortamında WebGL taklidi gerçek GPU/ısı testi yerine geçmez. Ekonomi/transfer/kayıt hatasında önce hatayı üreten regresyon senaryosu hazırlanır. Sabit yüzde kapsama yerine kritik değişmezler ve hata yolları kanıtlanır; hedefli test geçince gerekçesiz tekrar yapılmaz.

## P0 — zorunlu senaryolar

[KARARLAR.md](KARARLAR.md) D-007–D-016 için kabul kanıtı: render FPS'i değişirken aynı 100 ms tick sonucu; pause/resume'da sıfır çevrimdışı gelir; son makineyi satma veya erişimsiz bırakma reddi; dolu çıktı ve taşınan yükle save/load; yarım log/dolu diskten kayıpsız kurtarma; UI pointer'ın dünyaya sızmaması; context-loss sonrası aynı Domain durumuna dönüş. Beş tick/frame ve render bütçesi düşük/orta cihazda ölçülür.

D-017–D-020 için ek kontrol: 6×6 m odada 2×2 yetiştirici ve 1×2 paketleyici servis/yürüme açıklığı; portre telefon/tablette aynı eylemin görünmesi; bir satışta tek `+12 kredi` geri bildirimi; durma nedeni ve eksik kredi mesajı; ilk öğretim müşterisinin normal RNG sayımına çift eklenmemesi; 40 saniye sabrın yalnız aktif kuyruk tick'lerinde azalması; P0 snapshot tipindeki her lotun tek konumu, makine partisinin tek çıktı üretmesi ve R3F/React render sayısının 10 Hz Domain tick'ine gereksiz bağlanmaması.

D-021–D-026 için hedefli kanıt: 500 mantıksal entity'de aktif kimlik indeksinin güncellenmesi ve kararlı tick sırası; 1 kredi/10.000 atom yuvarlama, `Number.MAX_SAFE_INTEGER` sınırı ve save round-trip; ağır frame'de en çok 5 tick ve çevrimdışı sıfır telafi; aynı seed/komutlarda aynı ekonomik sonuç; pointer etkileşiminde raycast maliyeti ile `renderer.info` draw-call ölçümü; WebGL context kaybında aynı Domain'e dönüş; kritik günlük yazımı sırasında kill ve son doğrulanmış snapshot'tan kurtarma; büyük snapshot JSON serileştirme p95 süresi; 10 eşzamanlı makine bitişinde ses/CPU; gerçek `npm run build`/`npm run lint` sonuçları ve seçilen paket yöneticisinin tek lockfile'ı. Bunlar yapılmış test iddiası değildir.

- [ ] Yetersiz stok/bakiye, dolu hedef, yinelenen komut ve iptal: stok/para korunur, rezervasyon sızmaz.
- [ ] İki makineli üretim, raf/kasa satışı ve görevliye devir: ürün ve kredi yalnız bir kez değişir.
- [ ] Farklı render hızları aynı aktif simülasyonda aynı ekonomi sonucunu verir; catch-up sınırlıdır.
- [ ] Snapshot/günlük: çift işlem, yarım son satır, bozuk checksum, dolu disk, kesilen yazım ve yedek kurtarma.
- [ ] 20 arka plan/dönüş; farklı kritik işlem noktalarında zorla sonlandırma: durable işlem kaybolmaz/çoğalmaz.
- [ ] Touchcancel, UI dokunuşunun raycast'e sızmaması, inşa iptali/erişimi, portre safe-area, zoom ve Android geri.
- [ ] WebGL2 yokluğu ve context-loss: anlaşılır hata veya güvenli sahne kurtarma; kayıt korunur.
- [ ] Yerel paket uçak modunda açılır; P0 gereksiz OS izni istemez.
- [ ] Android ve iPhone ayrı build/cihaz kanıtı; P0 en az 10 dk cihaz testi.
- [ ] İki yerleşim karşılaştırması ve beş dış oyuncu; PLAN.md P0 eşikleri.

## A2 — dikey dilim

- [ ] Üç ürün tarif/lot maliyeti, sipariş/teslim, tek tedarikçi, fiyat bütçe tepkisi ve tek ikame.
- [ ] Mola koltuğu/rota rezervasyonu, güvenli görev bırakma ve koltuk yokken kilitlenmeme.
- [ ] Beş öğretim görevi ve 20–30 dk toplam oynanışın kesintilerle tamamlanması.
- [ ] En az iki küçük ekran, iki Android performans sınıfı ve bir iOS cihazı; ≥20 dk ısı testi.

## A3 — sistem entegrasyonu

- [ ] Lot/slot ayrımı, kalite miktar ağırlığı, sabit hassasiyet, güç önceliği, servis ve kontrat çifte tahsis engeli.
- [ ] Vardiya/mola, ücretin tek tahsili, oda etkileri, araştırma/XP/itibar tekil ödülleri.
- [ ] Üretici/tüccar/karma yol aynı ilerlemeyi geçer; nakit/stock daralması elle kurtarılabilir.
- [ ] Olay sınırları ve kapalı olay modunda kriz erişimi; 20 dk crash/context-loss/performans profili.

## A4 — final ve monetizasyon sandbox

- [ ] 24 ürünün tarif/erişim bağımlılığı, üç kriz yolu, üç final ve kısmi teslim/ikame limitleri.
- [ ] Final 60 müşteri/80 ihtiyaç planı, aynı seed, bekleme/boşluk ölçümleri ve kesinti sonrası kalan süre.
- [ ] Başarısız sınav teslim/yatırımı silmez; proje ödülü yalnız bir kez verilir.
- [ ] Reklam success/failed/cancelled/unavailable; 24 saatte en çok 3 başarılı ödül, başarılar arası 20 dk; ücretsiz kozmetik görev alternatifi.
- [ ] Reklam/ödeme + arama + dönüş birleşiminde çift ödül ve erken resume yoktur.
- [ ] İki mağazada ayrı sandbox: pending, iptal, bağlantı kaybı, parental approval, restore, refund/revoke; acknowledgment/finishing ve hak idempotency.
- [ ] Gizlilik tercihi öncesi reklam yüklenmez; takip izni reddi oyunu/ödül hakkını cezalandırmaz.
- [ ] Otomatik end-card kapatılabilir; ek tıklama/indirme zorunlu yaratıcı gösterilmez. Ağ bunu denetletmiyorsa reklam kapalı kalır.
- [ ] Reklam yalnız Destekle panelinde uygunluk çözüldükten sonra hazırlanır; 5 sn timeout/no-fill ödül ve kotayı değiştirmez; düşük cihaz FPS/bellek/ısı profili alınır.
- [ ] S2S denemesi rastgele `attemptId` ile doğrulanır; tekrarlı/geç callback tek hak verir; kalıcı oyuncu UUID'si veya ödül envanteri sunucuda kurulmaz.
- [ ] Temiz kurulumda reklam kozmetiği otomatik restore olmaz, ücretsiz görevle yeniden kazanılır; mağaza kozmetiği aynı platform hesabından restore edilir.
- [ ] Çevrimdışı refund sırasında temel oyun açık kalır; sonraki bağlantıda hak geri alınır ve varsayılan görünüm seçilir.
- [ ] Yaşı/güvenli reklam uygunluğu bilinmeyen durumda reklam isteği atılmaz; hedef kitle beyanı ve gerekiyorsa nötr yaş akışı cihazda doğrulanır.
- [ ] Her reklam kozmetiğinin ücretsiz görevi tipik 3–8 dakikalık oturumda tamamlanabilir; üç saatlik grind playtestte reddedilir.
- [ ] Veri silme talebi ve yerel tam sıfırlama ayrı akışlardır; kısa ömürlü S2S kayıtları için silme/saklama kanıtı vardır.

## A5 — cihaz bütçeleri ve yayın

| Ölçüm | Başlangıç hedefi / kanıt |
|---|---|
| FPS | 30 sabit; uygun cihazda isteğe bağlı 60; ≥20 dk termal test |
| Simülasyon | 10 Hz, adım p95 ≤6 ms |
| Draw call | Düşük profil ≤150; renderer.info + mobil profiler |
| Geometri | Görünen ≤150 bin üçgen, ≤25 animasyonlu karakter |
| Bellek | JS+GPU hedef ≤600 MB; native/SDK tepe ayrıca |
| Çözünürlük | Düşük iç kısa kenar 640–720 px; DPR düşük ≤1,25, üst ≤1,5 |
| Soğuk açılış | Yerel paket ≤10 sn hipotezi |
| Boyut | İlk kurulu web içeriği ≤150 MB; sıkıştırılmış ilk indirme ≤200 MB, kurulu temel içerik ≤500 MB ayrı ölçümler |

Bu bütçeler desteklenen cihaz garantisi değildir. 60 müşterilik mantıksal yük, reklam bellek tepesi, pil/ısı ve dinamik render kalitesi ekonomi etkisi ölçülür. Emulator FPS'i cihaz kanıtı değildir. Paket boyutuna SDK etkisi ayrıca yazılır.

Kayıt sürüm göçü, TR/EN metin/erişilebilirlik, lisanslar, release URL/secret/source-map ve inspector kontrolü, privacy manifest/Data safety/yaş beyanı doğrulanır. APK, AAB, Xcode archive, TestFlight ve imzalı cihaz build'i ayrı sonuçlardır. Yayın yetkisi test başarısından türetilmez.

## Rapor şablonu

Her koşul: test ID/faz, build/commit/içerik sürümü, platform/OS/WebView/cihaz, giriş verisi/seed, adımlar, beklenen/gerçek sonuç, ölçüm/log yolu ve durum (geçti/kaldı/çalıştırılmadı/engelli). Test yoksa boş başarı kutusu yerine engel ve sonraki iş yazılır. Belge revizyonunda yalnız Markdown kapsamı, yerel bağlantılar, kaynak uyumu ve anayasanın değişmediği doğrulanır; oyun testleri yapılmış sayılmaz.

## Tekrarlanabilir P0 fixture ve test kimlikleri

Aşağıdaki başlangıç değerleri TEST VERİSİDİR; yeni oyun başlangıcı veya denge kuralı değildir. Her senaryoda temiz state, sabit seed, enjekte saat ve bağımsız kayıt alanı kullanılır. Test gerçek sonucu ölçer; production fonksiyonunun sonucunu aynı fonksiyonla yeniden hesaplayıp karşılaştırmaz.

| ID | Kurulum / eylem | Beklenen sonuç |
|---|---|---|
| T-P0-01 | 100 adet 100 ms tick; render ritmini değiştir | 10.000 ms aktif saat ve aynı ekonomik state; background eklenmez |
| T-P0-02 | UI'da pointerdown, canvas'a sürükle, pointerup; joystick touchcancel | Dünya komutu 0; hareket vektörü nötr |
| T-P0-03 | Kaynak 5 küp, hedefte 2 boş kapasite; 2 taşı, aynı ID'yi tekrarla | Kaynak 3, hedef +2; ikinci komut etkisiz |
| T-P0-03b | 5 küpten 6 taşı veya 2 boş yere 3 bırak | State/ledger/rezervasyon değişmez |
| T-P0-04 | 100 kredi, 1 küplük sepet, kilitli fiyat 12; satış callback 3 kez | 112 kredi, 1 satış, ürün bir kez çıkar |
| T-P0-05 | Paketleyicide 2 yosun, çıktı boş; standart 8 sn parti | 79 tick henüz tamam değil; 80. tick tek küp; sonraki tick ikinci çıktı yok |
| T-P0-05b | Çıktı kapasitesi dolu | Ürün/girdi kaybolmaz; seçilen parti rezervasyon politikasıyla OutputBlocked veya başlamama; çıktı boşalınca tek sonuç |
| T-P0-06 | Aynı satışın öncesi/yazım ortası/yazım sonrası crash | Tam durable kayıt yoksa satış yok; tam kayıt varsa bir satış, çift etki yok |
| T-P0-07 | Oyuncu ve görevli son 1 ürünü aynı anda ister | Tek rezervasyon kazanır; toplam taşınan 1 |
| T-P0-08 | Geçersiz footprint/onay; geçerli önizleme/iptal | Para/yerleşim değişmez; gerekçe görünür |
| T-P0-09 | Yerel build, uçak modu, 20 background döngüsü, iki platform | Oynanabilir P0; durable işlem korunur; platform raporları ayrı |

P0 üretim örneği güç yeterli, aşınma/kalite yükseltmesi yok ve tick sırası sabit varsayar. Başlangıç girdisinin tüketim anı seçilen teknik politikaya bağlıdır; test aynı girdinin iki kere tüketilmediğini ve toplam dengeyi ayrıca doğrular.

## Kayıt hata enjeksiyon matrisi

| Kesinti noktası | Kurtarma beklentisi |
|---|---|
| Günlük yazımından önce | Eski state; başarı bildirilmemiş |
| Günlük son satırının ortası | Tam önceki sequence; yarım satır uygulanmaz |
| Günlük tamam, UI sonucu yayınlanmadan | İşlem yüklemede bir kez görünür |
| Snapshot adayı yarım | Son doğrulanmış snapshot + günlük |
| Yeni snapshot doğrulandı, eski günlük duruyor | Snapshot sequence'ine kadarki işlemler tekrar uygulanmaz |
| Günlük ortası bozuk / sequence boşluğu | Kurtarma/hata; sessiz atlama veya para uydurma yok |
| Yeni şema/eski uygulama | Uyumsuzluk mesajı; orijinal kayıt korunur |
| Disk dolu | Kalıcı başarı yok; kontrolsüz yeni oyun oluşturulmaz |

“Yazma başarılı” fake adaptör testi yalnız mantıksal protokolü kanıtlar. Gerçek cihaz dosya kalıcılığı, process kill ve WebView yeniden başlatma ayrıca sınanır. Test logunda hassas receipt veya kullanıcı verisi bulunmaz.

## A2–A4 sayısal ve sınır fixture'ları

- T-A2-01: ECONOMY_AND_MACHINES.md 160/144/96/48/64/−16 maliyet örneği; alış ve satışta gider iki kez düşülmez.
- T-A2-02: adil fiyatta tüm profiller P≈0,880797; bütçe altındaki ürüne 0/1 garantili kabul uydurulmaz; aynı ihtiyaç eşiği ikamede korunur.
- T-A2-03: mola 60/80/15 sınırları; koltuk dolu, rota kesik, tek görevli ve kesinti durumları.
- T-A3-01: 95/90/80 kalite →90,5; gerçek 0 uzmanlık 40 fallback olmaz; miktar ağırlığı test edilir.
- T-A3-02: W79→80 yalnız sonraki partiyi etkiler; W100 mevcut parti biter, yeni başlamaz; servis kesintisi tekrar bedel almaz.
- T-A3-03: üç ilerleme yolu; iki kez oynatılan bölüm olayı tek AP/XP ödülü; gerçek gece yarısı oyun gününü sıfırlamaz.
- T-A4-01: 150 küplük dalgada 30 kraker ikamesi kabul, 31'incisi limit aşımı; aynı lot tekrar teslim edilemez.
- T-A4-02: 63/80 ihtiyaç başarısız, 64/80 diğer şartlara bağlı; medyan 25 sınırı geçerli, üstü normal modda başarısız; kuyruk terk 6 geçerli, 7 başarısız.
- T-A4-03: 10 sn aynı anda boş gıda/su →10 sn birleşik boşluk; pause bu süreyi artırmaz.
- T-A4-04: MONETIZATION_AND_PRIVACY.md tekrar callback, pending, restore, offline ve izin senaryoları.

Fixture'ların tamamı henüz plan durumundadır. Gerçek sonuç alanı uygulama/test koşusunda doldurulur; burada test geçişi iddiası yoktur.

## Kanıt dosyası minimum içeriği

Test ID, komut ve exit code, beklenen/gerçek sonuç, seed/config, commit/build/içerik sürümü, tarih, ölçüm süresi ve log/artifact yolu. Cihaz testi ayrıca model/OS/WebView, termal başlangıç, güç durumu ve profiler yöntemini içerir. p95 için örnek sayısı/pencere; FPS için ortalama yanında düşüş/ısınma; bellek için JS/GPU/native ayrımı raporlanır. Ölçülemeyen birleşik bellek değeri toplanmış gibi yazılmaz. Beş oyuncu denemesinde yardımlar, ilk satış zamanı ve oyuncunun yerleşim açıklaması ayrı tutulur.
