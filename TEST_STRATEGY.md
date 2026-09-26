# Fazlara göre doğrulama ve kabul

Kaynak: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §20, §35, §44, §49, §54, §58, §60.8, §63. Bu belge test planıdır; geçilmiş sonuç değildir. Mevcut package.json'da test script'i yoktur. Saf TypeScript testleri için Vitest kurulumu bir P0 uygulama seçimidir; mevcutmuş gibi komut verilmez.

## Doğrulama katmanları

Domain birim testleri enjekte saat/RNG ile; Application entegrasyonu gerçek işlem/kayıt akışıyla; browser testleri giriş/DOM/asset/lifecycle ile; cihaz testleri gerçek Capacitor Android/iOS build'leriyle yapılır. Unit ortamında WebGL taklidi gerçek GPU/ısı testi yerine geçmez. Ekonomi/transfer/kayıt hatasında önce hatayı üreten regresyon senaryosu hazırlanır. Sabit yüzde kapsama yerine kritik değişmezler ve hata yolları kanıtlanır; hedefli test geçince gerekçesiz tekrar yapılmaz.

## P0 — zorunlu senaryolar

[KARARLAR.md](KARARLAR.md) D-007–D-016 için kabul kanıtı: render FPS'i değişirken aynı 100 ms tick sonucu; pause/resume'da sıfır çevrimdışı gelir; son makineyi satma veya erişimsiz bırakma reddi; dolu çıktı ve taşınan yükle save/load; yarım log/dolu diskten kayıpsız kurtarma; UI pointer'ın dünyaya sızmaması; context-loss sonrası aynı Domain durumuna dönüş. Beş tick/frame ve render bütçesi düşük/orta cihazda ölçülür.

D-017–D-020 için ek kontrol: 6×6 m odada şişeleme tezgâhı ve domates yatağının servis/yürüme açıklığı; portre telefon/tablette aynı eylemin görünmesi; satışta gerçek tutarın tek geri bildirimi; durma nedeni ve eksik kredi mesajı; ilk öğretim müşterisinin normal RNG sayımına çift eklenmemesi; 40 saniye sabrın yalnız aktif kuyruk tick'lerinde azalması; P0 snapshot tipindeki her lotun tek konumu, makine partisinin tek çıktı üretmesi ve R3F/React render sayısının 10 Hz Domain tick'ine gereksiz bağlanmaması.

D-021–D-026 için hedefli kanıt: 500 mantıksal entity'de aktif kimlik indeksinin güncellenmesi ve kararlı tick sırası; 1 kredi/10.000 atom yuvarlama, `Number.MAX_SAFE_INTEGER` sınırı ve save round-trip; ağır frame'de en çok 5 tick ve çevrimdışı sıfır telafi; aynı seed/komutlarda aynı ekonomik sonuç; pointer etkileşiminde raycast maliyeti ile `renderer.info` draw-call ölçümü; WebGL context kaybında aynı Domain'e dönüş; kritik günlük yazımı sırasında kill ve son doğrulanmış snapshot'tan kurtarma; büyük snapshot JSON serileştirme p95 süresi; 10 eşzamanlı makine bitişinde ses/CPU; gerçek `npm run build`/`npm run lint` sonuçları ve seçilen paket yöneticisinin tek lockfile'ı. Bunlar yapılmış test iddiası değildir.

- [ ] Yetersiz stok/bakiye, dolu hedef, yinelenen komut ve iptal: stok/para korunur, rezervasyon sızmaz.
- [ ] İki makineli üretim, raf/kasa satışı ve görevliye devir: ürün ve kredi yalnız bir kez değişir.
- [ ] Farklı render hızları aynı aktif simülasyonda aynı ekonomi sonucunu verir; catch-up sınırlıdır.
- [ ] Snapshot/günlük: çift işlem, yarım son satır, bozuk checksum, dolu disk, kesilen yazım ve yedek kurtarma.
- [ ] 20 arka plan/dönüş; farklı kritik işlem noktalarında zorla sonlandırma: durable işlem kaybolmaz/çoğalmaz.
- [ ] Touchcancel, UI dokunuşunun raycast'e sızmaması, inşa iptali/erişimi, portre safe-area, zoom ve Android geri.
- [ ] WebGL2 yokluğu ve context-loss: anlaşılır hata veya güvenli sahne kurtarma; kayıt korunur.
- [ ] iOS/Android klavyesi açılıp kapanırken Canvas oranı ve kamera bozulmaz; metin alanı klavye üstünde, safe-area içinde kalır.
- [ ] `webglcontextlost/restored` zorla tetiklenir; texture/renderer yenilenir, aynı Domain/save korunur; başarısız kurtarmada DOM hata ekranı kalır.
- [ ] Üretim `es2020` build'i iOS 16 taban cihazda ve Android 10 WebView'de açılır; yalnız TypeScript/Vite build başarısı uyumluluk kanıtı sayılmaz.
- [ ] İlk kullanıcı jesti öncesi/sonrası ses, sessiz fallback ve decode bellek tepesi ölçülür; splash bütün sesleri yüklemez.
- [ ] 6×6 engelli rota A* ile bulunur; yerleşim değişmeden her tick yeniden hesaplanmaz; müşteri kuyruğu kilitlenmez.
- [ ] Çentik, alt jest alanı, tablet ve klavye durumunda ortak safe-area tokenları görsel olarak kontrol edilir.
- [ ] Yerel paket uçak modunda açılır; P0 gereksiz OS izni istemez.
- [ ] Android ve iPhone ayrı build/cihaz kanıtı; P0 en az 10 dk cihaz testi.
- [ ] İki yerleşim karşılaştırması ve beş dış oyuncu; PLAN.md P0 eşikleri.

## A2 — dikey dilim

- [ ] Üç ürün tarif/lot maliyeti, sipariş/teslim, tek tedarikçi, fiyat bütçe tepkisi ve tek ikame.
- [ ] Mola koltuğu/rota rezervasyonu, güvenli görev bırakma ve koltuk yokken kilitlenmeme.
- [ ] Beş öğretim görevi ve 20–30 dk toplam oynanışın kesintilerle tamamlanması.
- [ ] En az iki küçük ekran, iki Android performans sınıfı ve bir iOS cihazı; ≥20 dk ısı testi.

## A3 — sistem entegrasyonu

- [ ] Kaliteye uyarlanmış referansa göre 1,00×/0,80×/1,50× fiyat ve özel fiyat aynı seed/kapasitede kabul, ortalama kuyruk ve kayıp satışla karşılaştırılır; indirimde +%50 hedefin gerçekleşmesi veya sapması raporlanır, ek spawn/ikinci kabul zarı yoktur; pahalı ret stok/para/itibar değiştirmez ve sepet fiyatı korunur.
- [ ] Raf SKU kilidi oyuncu ile görevli transferinde aynı sonucu verir; dolu rafta uyumsuz kilit değişimi ve kesintiden dönüş lot/rezervasyon kaybetmez.
- [ ] Uygun `item.aged_cheese` stoklu günlerde seed ile %20 olay olasılığı ve en çok bir olay; stoksuz/olay kapalı günlerde sıfır olay; akü SKU'su olmadan seçilemez. Ürün alındıktan çıkışa en az 12 aktif saniye vardır. Yakalama, dolu hedef, kaçış, yinelenen komut ve save/load'da lot yalnız bir konumdadır.
- [ ] Kooperatif 100→100 ve Konsorsiyum 300→315 kredi teklifleri, %5 ücretin yalnız bir kez eklenmesi, aynı anda tek borç, sıfır cirolu gün, nakit sınırı, %10 brüt satış cirosu kesintisi, gün sonu tekrar çağrısı ve yardım görevi doğrulanır; sabit vade/gecikme cezası oluşmaz.
- [ ] Lot/slot ayrımı, kalite miktar ağırlığı, sabit hassasiyet, güç önceliği, servis ve kontrat çifte tahsis engeli.
- [ ] Vardiya/mola, ücretin tek tahsili, oda etkileri, araştırma/XP/itibar tekil ödülleri.
- [ ] Üretici/tüccar/karma yol aynı ilerlemeyi geçer; nakit/stock daralması elle kurtarılabilir.
- [ ] Olay sınırları ve kapalı olay modunda kriz erişimi; 20 dk crash/context-loss/performans profili.

## A4 — final ve monetizasyon sandbox

- [ ] Tier 1–4 ürünlerin tarif/erişim bağımlılığı, üç kriz yolu, üç final, kısmi teslim ve yanlış SKU'nun finalde reddi.
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

Aşağıda açıkça "fixture" denen para veya stok değerleri yalnız TEST VERİSİDİR. Su birimi, 3/8/18 saniyelik tarifler, 1/10/38 ham su miktarları ve seviye 1 debi ise §26 başlangıç denge değerleridir. Her senaryoda temiz state, sabit seed, enjekte saat ve bağımsız kayıt alanı kullanılır. Test gerçek sonucu ölçer; production fonksiyonunun sonucunu aynı fonksiyonla yeniden hesaplayıp karşılaştırmaz.

| ID | Kurulum / eylem | Beklenen sonuç |
|---|---|---|
| T-P0-01 | 100 adet 100 ms tick; render ritmini değiştir | 10.000 ms aktif saat ve aynı ekonomik state; background eklenmez |
| T-P0-02 | UI'da pointerdown, canvas'a sürükle, pointerup; joystick touchcancel | Dünya komutu 0; hareket vektörü nötr |
| T-P0-03 | Kaynak 5 ham su, hedefte 2 boş kapasite; 2 taşı, aynı ID'yi tekrarla | Kaynak 3, hedef +2; ikinci komut etkisiz |
| T-P0-03b | 5 ham sudan 6 taşı veya 2 boş yere 3 bırak | State/ledger/rezervasyon değişmez |
| T-P0-04 | 100 kredi fixture bakiyesi, 1 küçük su, katalog fiyatı 1,50; satış callback 3 kez | 101,50 kredi, 1 satış, ürün bir kez çıkar |
| T-P0-05 | Şişeleme tezgâhında 1 ham su ve 1 küçük şişe, çıktı boş; 3 sn parti | 29 tick henüz tamam değil; 30. tick tek küçük su, 0,03 kredi enerji gideri; sonraki tick ikinci çıktı yok |
| T-P0-05c | 50 birim su haznesi, seviye 1; küçük/5 L/damacana/domates için sırasıyla 1/10/38/2 birim ayır | Toplam 51 birim gerekir; 2 aktif saniyede 1 yeni birim gelir, stok negatif olmaz |
| T-P0-05d | Debi seviye 1'den 2'ye yükseltilir; aynı komut iki kez çağrılır | 80 kredi yalnız bir kez düşer, 120 birim hazne sınırı ve 1 birim/sn hız sonraki tick'ten itibaren geçerlidir; geçmiş zaman doldurulmaz |
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

## A–E belge adayları için kabul senaryoları — KAYNAK §64

Bunlar gelecekteki A4 uygulama testleridir; henüz çalıştırılmadı. Her test, ilgili aday ancak A3 önkoşulu ve içerik ID'si tamamlanınca açılır.

| ID | Beklenen senaryo |
|---|---|
| T-AE-01 | VIP isteği teslim edilince tek stok/itibar/ödül işlemi; aynı event/transaction tekrarında ikinci etki yok, süre yalnız aktif tick'te ilerler. |
| T-AE-02 | Hijyen sarfı tek lot tüketir; sarf yokken ücretsiz temizlik mümkün, kötü koku temel satış yolunu kilitlemez. |
| T-AE-03 | Mahalle Bülteni puanı gerçek kuyruk/satış nedenine bağlanır; save/load sonrası aynı olay ikinci kez puan üretmez, boş veri sahte kullanıcı yorumuna dönüşmez. |
| T-AE-04 | Teşhir için 3× hız hipotezi uygun gerçek talep altında ölçülür; boş raf, bütçesiz sepet veya ziyaret tavanında ek satış yoktur. |
| T-AE-05 | Tier 4 pazarlık reddinde lot/kredi aynı kalır; kabulde tek ledger satışı olur, aynı komut tekrarı ikinci gelir yaratmaz. |
| T-AE-06 | Trend ve 60 aktif saniyelik vardiya dalgası seed/save dönüşünde aynı olay ve müşteri sırasını sürdürür; arka plan süresi ilerlemez. |
| T-AE-07 | Dekor cazibesi §32 tavanında kalır; ücretli görünüm/ücretsiz görünüm ekonomik olarak aynıdır. |
| T-AE-08 | %15–20 bonus ve sıcaklık +%25 hipotezleri lot/maliyet/fiyat fixture'ıyla korunur; ilk 3 aktif dakika geçince yalnız normal fiyat uygulanır, ürün kaybolmaz. |
| T-AE-09 | Hedef bitince sonraki erişilebilir hedef HUD'da görünür; görev kabulü, stok harcaması, reklam veya para işlemi otomatik olmaz. Kayıt/çıkış her durumda çalışır. |
| T-AE-10 | Ses kapalı, az hareket, büyük metin ve ekran okuyucuda VIP/trend/teşhir/temizlik nedeni anlaşılır; UI pointer'ı dünya komutuna sızmaz. |
| T-AE-11 | Düşük profilde müşteri/teşhir/dekor birlikte §63 draw call, üçgen, karakter ve DPR bütçesinde ölçülür; aşım olursa kozmetik yoğunluk düşürülür, simülasyon sonucu değişmez. |

Oyuncu denemesinde devam isteği, hedef anlama, durma/kayıt kolaylığı ve oturum süresi ayrı raporlanır. Nörokimyasal veya “alfa transı” sonucu gözlem formundan çıkarılmaz.
