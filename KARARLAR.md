# Orbit Market — karar günlüğü

Tarih: 26 Eylül 2026 · Durum: Etkin teknik/ürün kararları · Kaynak önceliği: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) sürüm 3.0. Bu kayıt ana kaynakta eksik kalan veya yan belgelerde çelişen noktaları uygulanabilir hale getirir. Anayasanın açıkça sabitlediği değerleri değiştirmez. Yeni kanıt gelirse ilgili karar yeni tarih/revizyonla değiştirilir; geçmiş kayıt silinmez.

## D-001 — Temel üretim zincirinin satışı

**Karar:** Kaydedilmiş mevcut yerleşimde oyuncunun temel satılabilir ürünü kendi başına üretebildiği son çalışır makine zincirinin son zorunlu makinesi satılamaz. Kasa, başlangıç teslim dolabı ve bu zincirin son makinesi satıştan korunur. Oyuncu yedek veya artık makineyi satabilir; satılabilir zincirin son makinesini depoya kaldırmak serbesttir, yeniden kurulduğu sürece üretim imkânı korunur. Uyarı tek başına yeterli koruma değildir.

**Gerekçe:** §11 kurtarılabilir oyun durumu ister. §40.3 ikinci el satış geliri verir; §48.4 yardım görevi ancak nakit <20 iken açılır ve 40 kredi verir. Bu yardım, 80–90 kredilik satış geliriyle kalan makine/hat yatırımını yapmış oyuncuya erişilemez hale gelebilir.

**Uygulama kuralı:** Satış işlemi önizleme ve commit anında, mevcut inventory/üretim/tedarik kurallarıyla çalışan en az bir satılabilir temel yol kaldığını doğrular. Çalışan son makineyse satış reddedilir ve neden gösterilir. Ücretsiz başlangıç eşyası da makine geri alımından doğan para exploit'ine yol açmamalıdır. Temel zincir kaybolmuş eski kayıtlar varsa para eşiğine bağlı olmayan, sınırlı bir kurtarma yolu gerekir; bu karar normalde böyle kayıt oluşturulmamasını hedefler.

**Doğrulama beklentisi:** Ürün stoku=0 ve tek yetiştirici veya paketleyici eldeyken satış reddi; yedek makine satılabilir; son makine depoya kaldırılıp tekrar kurulabilir; kayıt/yükleme korumayı bozmaz.

## D-002 — Yeni kayıt su lotunun kimliği

**Karar:** §46.2 başlangıç paketindeki 20 su `item.water` ara ürün lotudur; `item.drinking_water` şişelenmiş nihai ürün değildir. Başlangıç suyu ve spor 0 maliyetli bağış lotları olarak yazılır; sonradan üretim/tedarikle edinilen lotlar gerçek maliyet taşır.

**Gerekçe:** §26.2 biyoyetiştirici yosun tarifi `1 su + 1 spor` ister; P0/A2 yetiştiriciye bağlı üretim bu girdiyi tüketir. §26.3 `drinking_water` ayrı, şişelenebilir ve satılabilir nihai üründür. Başlangıçtaki 20 adedi nihai ürün saymak ücretsiz satış stoğu yaratır ve ara tarif girdisi eksikliğini gizler.

**Uygulama kuralı:** Başlangıç SaveDTO/content fixture'ında ID açıkça yazılır; görünen ad “Ara su” veya başka ayırt edici yerelleştirme kullanır. Envanter, satış, kalite ve maliyet kayıtları ID'yi kullanır; metin adıyla ürün eşleştirme yapılmaz. Mevcut kayıt göçü yokken bu yeni kayıt kararı tek başına eski kayıt şeması iddiası yaratmaz.

## D-003 — P0 prototip tedarik dolabı

**Karar:** §58.1'deki tek prototip kaynak noktası, P0'da seçili yosun tarifinin iki girdisini de — 20 su ve 8 spor başlangıç lotu dâhil gerektiğinde — açıkça etiketlenmiş prototip dolabından sağlayabilir. “Bir kaynak girdisi” ifadesi tek tedarik noktası/etkileşimi anlamına gelir; tarifte tek SKU şartı değildir. Yosun tarifi 1 su + 1 spor, çıktı 4 yosun; küp tarifi 2 yosun →1 küp olarak korunur.

**Gerekçe:** §26.2 ve §26.3 tarif sözleşmelerini, §58.1 ve §63.3 ise tek oda/iki makine oynanış kanıtını belirler. P0 tam hammadde tedarik ekonomisi veya üçüncü makineyi test etmez. Tarif oranını değiştirerek iki hedefi uzlaştırmak ekonomi doğrulamasını bozardı.

**A2 tedarik kararı:** Tek tedarikçi olarak Yerel Kooperatif kullanılır. §33.2'de kooperatif su, gıda ve biyolojik girdiler sağlar. Biyolojik girdilerin tohum/spor SKU kapsamı ürün kataloğunda aynı tedarikçiyle doğrulanır; sipariş minimumu, kota ve kapasite kuralları korunur. Katalogda olmayan girdi gizlice bedelsiz eklenmez.

## D-004 — A2 ürün ve makine kapsamı

**Karar (kaynakla çözüldü):** A2 üç satılabilir ürün `nutrient_cube`, `drinking_water`, `nebula_drink`; üç oynanabilir makine Biyoyetiştirici, Paketleyici, Şişeleyici'dir. Anayasa §30'da belirtilmiş seçim yeniden açık soru değildir. A2 başlangıçta oyuncu yetiştirici/paketleyiciyi satın alır; şişeleyici ve tarif erişimi kendi bölüm/ekonomi koşulunda açılır. Su giriş kaynağı olarak hazırdır; Eritici A3'e kadar şart değildir.

**Gerekçe:** Anayasa §30 önceki iki makine sınırını açıkça üçe yükseltir. Nebula'nın ara meyve girdisi biyoyetiştiricide üretilir; ürünün en erken Bölüm 2 erişimi korunur. Üç ürünü yeni kayıtta birden açık göstermek Chapter 1/2 kilidini atlar.

**Açık alt ayrıntı:** A2 yerel kooperatifinden meyve tohumu/spor siparişinin SKU, kota ve gerçek başlangıç bakiyesi §26/§33 tablolarına uygun bağlanmalıdır. Yeni ürün veya dördüncü makine eklenmez.

## D-005 — Dokuz çekirdek yetenek düğümünün bedeli

**Karar:** §47.1'de uygulanması istenen dokuz çekirdek düğümün her biri 1 beceri puanı bedelindedir. Her dalda ikinci düğüm ilkini, üçüncü düğüm ikincisini gerektirir. Manuel temel eylemler yetenek kilidine alınmaz. Oyuncu henüz kazanmadığı puanla düğüm açamaz.

**Gerekçe:** Anayasa her dalın ilk düğümü için 1 puan ve sıralı önkoşul verir, ikinci/üçüncü bedellerini belirtmez. Tekdüze 1 puan, prototip/A3 için en az yeni ekonomi varsayımıdır. Dokuz düğümün toplamı 9 puandır. Tam 30 düğüm/19 puan hedefi değişmez; kalan 21 düğümün bedel ve önkoşulları A4 tasarım kararı olmaya devam eder.

**Doğrulama beklentisi:** Önkoşulsuz ikinci/üçüncü açma reddedilir; puan düşümü tek işlemdir; yeniden dağıtım bonus/kontrat/AP/XP üretmez; bölüm veya final XP şartı olmaz.

## D-006 — Çalışan adaylarının trait kategorileri

**Karar:** Aday üretimi birbirinden ayrı havuz kullanır:

| Aday alanı | Başlangıç havuzu ve kural |
|---|---|
| Rol | Anayasa §27.1'deki 8 rol; bölüm erişimi korunur |
| Köken | §27.2'deki 6 yerleşim geçmişi; rol erişimini kilitlemez |
| Olumlu özellik | §27.3'ün olumlu davranışları: Düzenli, Çevik, Güçlü taşıyıcı, Titiz, Pratik, Arabulucu, Eğitici, Çok yönlü. Farklı iki özellik seçilir. |
| Tercih | Ayrı preference alanı. §27.3 “İçe dönük çalışma tercihi” ve köken tablosundaki tercih/metinler trait slotuna değil bu alana aittir. |
| Geliştirilebilir eksiklik | Mevcut tanımlı weakness `Yeni başlayan`: ana beceri 15–25, ücret −%15; eğitimle giderilir. Olumlu özellik havuzundan çekilmez. |

İlk sürümde yeni weakness türü uydurulmaz. Adayların tamamında yalnız tanımlı weakness havuzu bulunuyorsa “Yeni başlayan” görünür ve eğitimle giderilebilir olarak sunulur. Daha fazla weakness, ağırlık ve özellik çelişki çifti ancak açık içerik tasarımıyla eklenir. Şu an kaynakta çelişki çiftleri listelenmediği için gizli/varsayılan bir deny-list yoktur. 48 rol×köken birleşimi ayrı model veya 48 özel trait kombinasyonu gerektirmez.

**Gerekçe:** §27.3 her adaya iki olumlu özellik, bir tercih ve bir geliştirilebilir eksiklik verir; tablonun son iki satırı olumlu özellik değildir. Ayrık alanlar yanlış bonus/ücret uygulamasını önler.

## Uygulama sırası ve değişiklik yönetimi

1. D-001 satış işlemi/ekonomi ve kurtarma senaryosundan önce.
2. D-002 yeni kayıt fixture'ı ve D-003 P0 prototip dolabı kurulurken.
3. D-004 A2 ürün/tarif verisi girilirken.
4. D-005 yetenek verisi ve UI'si A3'te uygulanırken.
5. D-006 aday şeması ve işe alım üretimi A3/A4'te uygulanırken.

Bu kararlar belgelenmiş ürün/uygulama kararlarıdır; henüz kodlanmış veya test edilmiş özellikler değildir. Yeni kanıt veya kullanıcı yönlendirmesi gelirse bu dosyada yeni karar/revizyon kaydı oluşturulur ve bağlı plan/katalog güncellenir.

## D-007 — Simülasyon ve zaman: ek sorular 1–10

Kaynak: anayasa §60.2–60.4, §61.3, §63.1. My Mini Mart'ın görünen kısa taşıma–raf doldurma–satış–genişleme döngüsü, akıcı ve anlaşılır geri bildirim için örnektir; aşağıdaki sayılar o oyuna atfedilmez. Bunlar Orbit Market uygulama kararlarıdır.

1. Mantık 10 Hz (100 ms) çalışır; kamera ve aktör görselleri son iki doğrulanmış durum arasında render anında interpolasyon yapar. Ekonomik işlem interpolasyona bağlı değildir; teleport/yüklemede yumuşatma sıfırlanır.
2. Arka plana geçişte tick, üretim, sabır, ücret ve oyun saati durur. Pause sinyalleri tek koordinatörde birleştirilir.
3. Dönüşte çevrimdışı ilerleme ve arka plan süresi kadar tick telafisi yoktur. Kayıtlı aktif durumdan kullanıcı devamı beklenir.
4. Foreground render gecikmesinde bir frame en fazla 5 sabit tick işler; kalan borç ölçülür ve oyun saati yavaşlar. Tick atlayıp ekonomik zamanı ilerletme veya sınırsız telafi yapılmaz. Bu 5 sınırı cihaz profiliyle test edilmesi gereken teknik karardır.
5. Müşteri gelişleri içerik tablosundaki talep ve kapıya uygunlukla, kayıtlı müşteri RNG akışından türetilir; sabit 15 saniye kuralı veya her frame yeni zar yoktur. P0 tek müşterili akışın ritmi ayrıca ayarlanır.
6. Tarif süresi tamsayı tick olarak tutulur; örneğin 3 saniye = 30 aktif tick. Değişken delta-time tarif süresini etkilemez.
7. Pause menüsü vardır. UI/platform/inşa duraklatmasında üretim zamanlayıcısı dahil bütün simülasyon saatleri dondurulur.
8. Çevrimdışı ilerleme olmadığı için çevrimdışı RNG ortalaması da yoktur.
9. Oyun günü aktif simülasyonda 900 saniyedir; cihaz saatinden bağımsız oyun günü/saati saklanır.
10. Simülasyon RNG durumu ve alt akışları save içinde sürümlü saklanır. Yeniden açma aynı olayı tekrar çekmez; kozmetik RNG ekonomik RNG'yi ilerletmez.

## D-008 — Kayıt, günlük ve hata kurtarma: ek sorular 11–20

Kaynak: anayasa §60.3; [DOMAIN_MODEL.md](DOMAIN_MODEL.md), [TEST_STRATEGY.md](TEST_STRATEGY.md). Dosya API'sinin atomik yeniden adlandırma garantisi platform adaptöründe doğrulanır; bu taslak doğrulanmamış bir Capacitor garantisi sayılmaz.

11. Kritik işlemler append-only günlüğe yazılır. Her 30 aktif saniyelik checkpoint'te snapshot fırsatı vardır; günlük ancak yeni snapshot ve yedek doğrulanınca küçültülür. “500 işlem” zorunlu eşik değildir; boyut ve süre cihazda ölçülür.
12. Yeni kayıt geçici dosyaya yazılır, okunup checksum/sequence doğrulanır, sonra etkin manifest değiştirilir. Son iyi snapshot ve önceki manifest korunur. Adaptör atomik değişimi desteklemiyorsa çift yuvalı manifest ve doğrulama kullanılır.
13. Snapshot, işlem günlüğü ve manifest mantıksal olarak ayrı kalıcı dosyalardır. Snapshot kapsadığı son sequence'ı taşır; yarım günlük kaydı yüklenmez.
14. Kritik para/stok işlemi durable onayını bekler; bunlar 30 saniyeye ertelenmez. Hareket/kozmetik durum için en çok 30 aktif saniyelik checkpoint kullanılır; her saniye tam JSON yazılmaz. Gecikme/IO eşiği cihazda ölçülür.
15. Ekonomik sıralama için artan sequence ve aktif tick kullanılır; cihaz duvar saati güvenilir ekonomi kaynağı değildir. Gerçek 24 saat reklam sınırı ayrı güvenilir zaman politikası gerektirir.
16. Save zarfında schemaVersion/contentVersion vardır. Sürüm göçleri saf, sıralı v1→v2 adaptörleriyle ve değişmeyen eski örnek kayıtlarla test edilerek eklenir.
17. Olmayan makineyi satan log girdisi sessizce uygulanmaz ve uygulama çöktürülmez: o replay zinciri geçersiz işaretlenir, son doğrulanmış snapshot/yedekten kurtarma ekranı açılır; kayıp işlem açıkça bildirilir.
18. Kayıt bekliyorsa kısa “Kaydediliyor”, tamamlanınca “Kaydedildi”, hata halinde kalıcı uyarı gösterilir. Kritik işlem onaylanmadan başarı animasyonu verilmez; sık tekrarlayan kayıt bildirimi oyuncuyu bölmez.
19. P0 yerel kayıt yapılandırılmış düz veri olarak tutulur. Base64 şifreleme değildir; gizli/ödeme yetkisi bu kayıttan türetilmez. Bulut kaydı P0 kapsamı değildir.
20. Depolama doluysa kalıcı değişiklikler ve yeni oyun ilerlemesi güvenli biçimde durur; oyuncu mevcut durumu görüp yer açma/yeniden deneme/kurtarma seçeneklerine erişir. Sessizce kayıtsız devam ettirilmez.

## D-009 — Sahne, kamera ve render: ek sorular 21–30

Kaynak: anayasa §60.1/60.4, §62.2–62.3, §63.1; [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md). Kesin performans bütçeleri cihaz ölçümüyle kabul edilir.

21. P0 kamera ortografiktir; 45° yatay grid dönüşü ve 30–35° aşağı eğim korunur. Perspektif FOV oyuna yeni ölçek algısı getirmez.
22. Pan sınırı mağazanın erişilebilir yerleşim alanı ve görünür güvenli çerçevedir; kamera oda dışına kayıp boş dünya göstermez. Tablet geniş görünümünde sınır yeniden hesaplanır.
23. Ortografik pinch, kamera zoom değerini değiştirir; FOV/Z uzaklığıyla perspektif hilesi yapılmaz. Minimum/maksimum okunabilir ürün ve etkileşim ölçümünden çıkarılır.
24. Duvar/makine oyuncu veya seçili iş aktörünü kapatırsa yalnız örten parçalar soluklaşır veya karakter silueti belirir. Etki kamera/yerleşim değişince kalkar; seçili aktörün konumu kaybolmaz.
25. Anayasa §63.1 düşük profil için **≤150 draw call, ≤150 bin görünür üçgen, ≤25 animasyonlu karakter ve JS+GPU ≤600 MB** başlangıç hedefi verir. Bunlar cihazda ölçülecek bütçelerdir; instancing, atlas ve görünmeyen animasyon azaltımı kullanılır. Ölçülmemiş başarı iddia edilmez.
26. Düz renk/faset materyal, hafif çevre ışığı ve blob/baked gölge varsayılandır; her nesneye gerçek zamanlı dinamik gölge verilmez.
27. Gerekli seçili gölge açılırsa çözünürlük cihaz profiline göre azaltılır veya gölge kapatılır; 512×512 evrensel zorunluluk değildir. Düşük profilde blob gölge yeterlidir.
28. Mobilde sürekli hover raycast yoktur. Dünya seçimi pointerdown ve gerekirse aktif sürükleme hareketi sırasında sınırlandırılmış hit testiyle yapılır; pointermove ile tüm dünya taranmaz.
29. UI alanı dünya hit testinden önce tüketilir. Dünyada görünür/en yakın uyumlu etkileşim hedefi, ardından derinlik ve kararlı instance ID eşitlik sırası kullanılır; çakışmada seçici panel gösterilir. Gizli/yerdeki nesne makine komutunu çalmaz.
30. Varsayılan 30 FPS, isteğe bağlı 60 FPS ve dinamik render ölçeği anayasa sınırıdır. §63.1 DPR hedefi düşük cihazda **en çok 1,25**, üst profilde **en çok 1,5**; anti-aliasing bu bütçeye göre seçilir. Çözünürlük düşmesi hitbox/ekonomiyi değiştirmez.

## D-010 — Dokunma, HUD ve öğretim: ek sorular 31–40

Kaynak: anayasa §60.1, §62.1, §63.3; [CONTROLS_AND_UX.md](CONTROLS_AND_UX.md).

31. Envanter ve yönetim ekranı sabit DOM panel/sayfasıdır; serbest sürüklenebilir pencere yoktur. Aynı anda bir ana yönetim sayfası açık kalır.
32. Makine detay/üretim menüsü DOM panelidir. Dünyada yalnız küçük, okunabilir durum işareti/ankraj görünür.
33. UI'da başlayan pointer up/cancel'a kadar UI'ya aittir; canvas'a geçse bile dünya komutu üretmez. Tersi de aynı pointer içinde sahip değiştirmez.
34. P0 tek etkin hedef için kısa dünya işaretçisi veya hedef vurgusu kullanır; sürekli ok yağmuru yoktur. Öğretim metni atlanabilir, tamamlanma gerçek eylemle olur.
35. Lisanslı/paketlenmiş tutarlı font ve sistem fallback'i kullanılır; yükleme başarısızlığında düğme/metin taşması test edilir. Font lisansı asset kartında kayıtlıdır.
36. Portre telefon ve portre tablet desteklenir. Landscape zorunlu hedef değildir; safe area ve oran değişiminde HUD yeniden düzenlenir.
37. Hafif haptic destekleyen cihazda isteğe bağlıdır; ayardan kapatılır ve web/uyumsuz cihazda sessizce görsel geri bildirim kullanılır. Kritik bilgi yalnız titreşimle iletilmez.
38. Uzun basış isteğe bağlı hızlı seçim olabilir; taşıma/inşa/iptal için görünür tek dokunuş eşdeğeri vardır. Yıkım ve satış ayrı onay ister.
39. Makine ilerlemesi mantık süresinden türetilen DOM/CSS veya billboard durum göstergesidir; her tick texture yeniden üretimi yoktur. Panelde kalan süre metinle de görünür.
40. Tek etkin dünya etkileşim pointer'ı vardır; iki parmak yalnız izin verilen kamera pan/zoom'a ayrılır. Üçüncü parmak yeni satış/üretim komutu oluşturmaz; joystick, UI ve kamera sahipliği ayrıdır.

## D-011 — Envanter, kaynak ve atık: ek sorular 41–50

Kaynak: anayasa §17–18, §26, §33–34, §48.1; [DOMAIN_MODEL.md](DOMAIN_MODEL.md).

41. Mantıkta her elma mesh/ID değildir; item ID + adet + kalite + maliyet/kaynak lotu ve fiziksel slot/reservation tutulur. Görsel yığın temsilidir; farklı kalite/maliyet lotu muhasebede kaybolmaz.
42. Kaynak/dolap/depo/raf/makine/taşıyıcı fiziksel konum ve kapasiteye sahiptir. Her yerden erişilen görünmez ortak havuz yoktur. P0 prototip dolabı ayrı özel kaynak noktasıdır.
43. Taşıma hedefi doluysa işlem başlamaz veya ayrılmış miktar kapasite kadar açıkça onaylanır; fazlalık kaynağında kalır. Kapasite aşımında gizli zemine düşürme yoktur.
44. Üretilen nihai ürün makine çıkışında bekleyebilir, sonra uyumlu depo/rafa taşınır. Raf zorunlu satış konumudur; depo stoku doğrudan kasada satılmış sayılmaz.
45. İptal edilen transferde eşya kaynakta veya taşıyıcının yükünde kalır; otomatik yere atılmaz. Oyuncunun açık atık eylemi varsa işaretli atık noktasına kayıtlı lot konur, rastgele despawn yoktur.
46. P0 tek SKU için arama/sıralama gerekli değildir; A2 çoklu stok panelinde aile/konum filtresi ve ad sırası vardır. Değer sırası ancak muhasebe değeri açık gösteriliyorsa eklenir.
47. P0 etiketli dolap prototip için kontrollü girdi sağlar. A2 gerçek tedarikçi, kota, fiyat, teslim ve depo kapasitesi kullanır; sınırsız ücretsiz hammadde kaynağı oyuna taşınmaz.
48. P0 lot kaydı kalite alanını taşıyabilir ama tek başlangıç kalitesiyle işler; A3 kalite farkları ayrı lot olarak açılır. Ürün ID'si kalite etiketiyle değiştirilmez.
49. Ayrı, sınırsız gelir sağlayan “çöp kutusu” mekaniği eklenmez. Atık/elden çıkarma açık onay, kayıp maliyet ve muhasebe hareketiyle uygulanır; son kurtarılabilir temel zinciri yok edemez.
50. Satış/elden çıkarma fiziksel stoktan atomik düşer; istatistikte işlem/lot özeti kalır. Sonsuza dek bireysel eşya nesnesi saklanmaz.

## D-012 — Para ve fiyat geri bildirimi: ek sorular 51–60

Kaynak: anayasa §34, §37, §38, §40.3, §48.4; [ECONOMY_AND_MACHINES.md](ECONOMY_AND_MACHINES.md).

51. Para sabit hassasiyetli tamsayı atom veya eşdeğer kesin decimal sözleşmesiyle tutulur; gösterim iki ondalıktır. `float` toplamı ledger kaynağı olamaz; atom ölçeği/yuvarlama tek kayıtlı teknik sözleşmeyle doğrulanır.
52. Gerçek satış tamamlandığında bakiye hemen HUD'da güncellenir; toplamak gereken bozuk para düşmez. Küçük para animasyonu yalnız tamamlanmış işlem geri bildirimidir.
53. P0 referans fiyat sabittir. A2 fiyat kararı ve müşteri fiyat tepkisi açılır; arka arkaya satış kendi kendine gizli fiyat değişimi yaratmaz.
54. Yetersiz para düğmesi pasif görünür ve “X kredi eksik” nedenini erişilebilir biçimde gösterir. Boşa basınca kırmızı ceza animasyonu veya yanlış satın alma yoktur.
55. Makine satışı tam iade değildir. §40.3'teki aşınma ve duruma bağlı ikinci el formülü uygulanır; D-001'in son temel zincir koruması önce kontrol edilir.
56. Yetersiz bakiye işlemi atomik reddedilir; `Math.max(0,bakiye)` ile eksik tutar gizlenmez. Negatif kredi durumu oluşamaz.
57. A2/A3 personeli oyun günü ücreti alır; §48.4'te gün başı ayrılır, karşılanmazsa vardiya askıya alınır. P0 tek görevli gösterimi tam ücret ekonomisi değildir.
58. P0 bahşiş yoktur. Kaynakta tanımlanmayan bahşiş gelirini sonraki faza kendiliğinden eklemeyiz.
59. P0 HUD krediyi ve satış sonucunu gösterir; A2 gün sonu ekonomi özeti gelir/gider/kayıp satış/kuyruk/darboğazı ayırır. P0 tam muhasebe panosu gerekmez.
60. HUD büyük tutarı yer kazanmak için kısaltabilir, ancak dokunulan fiş/detayda tam tutar ve para birimi gösterilir. Kritik onay ekranında kısaltılmış tutar tek bilgi değildir.

## D-013 — Müşteri hareketi ve sabır: ek sorular 61–70

Kaynak: anayasa §18, §38–39, §42, §60.2; [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md).

61. P0 dolu grid üzerinde basit A* kullanır; engel içinden geçen waypoint yoktur. Yerleşim değişince etkilenen yol yenilenir; bulunamazsa müşteri güvenle çıkar ve neden kaydedilir.
62. Kasa kuyruğu mantıksal sıraya ve ayrı bekleme hücrelerine sahiptir; müşteriler üst üste binmez. Kuyruk alanı inşa erişimi doğrulamasına dahildir.
63. Sabır bitince gerçek satış olmadan “kuyrukta vazgeçti” kaydı oluşur; aktör çıkışa yürür. Çıkış animasyonu ekonomiyi geciktirmez; kapı geçici kapalıysa güvenli görsel kaldırma yapılır.
64. Müşteri ihtiyaç/sepeti girişte kayıtlı RNG ile belirlenir; raf yoksa boş stok/kayıp satış veya tanımlı ikame işler. Yalnız raftakini isteyecek şekilde talep yeniden yazılmaz.
65. P0 aynı anda bir müşteri davranışını kanıtlar. A2 eşzamanlı mantıksal cap cihaz ve kuyruk ölçümüyle content/config'e yazılır; “10” anayasa sayısı değildir. Nihai 60 müşteri stres/sınav gereği mantıksal kapasiteyi keyfi düşük cap ile atlamaz.
66. Sipariş bekleyen müşteri kasayı kilitlemez; kendi kuyruğu/uygun bekleme hücresi kullanılır. Satın alma rezervasyonu beklerken başka müşterinin sıra atlaması önlenir.
67. Sabır kritik eşiğe gelince yakın aktörde okunur küçük işaret ve erişilebilir metin görünür; bütün müşterilere sürekli büyük baş üstü bar konmaz. Detay paneli tam kalan nedeni gösterir.
68. P0 sabırsızlık yalnız kayıp satış/kuyruk ölçümüdür. Daha sonraki tanımlı itibar etkisi kaynak tablosuna uyar; gizli kalıcı ceza eklenmez.
69. P0 geometri placeholder'ı ve basit yürüyüş/yük pozu yeterlidir; karakterler duruma göre hareket eder, zeminde kayan hareketsiz küp kabul edilmez. Son sanat cihaz performansıyla aşamalı gelir.
70. Giriş/çıkış kapısı yerleşim verisinde kararlı servis hücresi olarak tanımlanır; koordinat sahne ölçüsü seçildiğinde kaydedilir. Spawn, çıkış ve rota aynı kapı tanımını kullanır.

## D-014 — Oyuncu ve çalışan işi: ek sorular 71–80

Kaynak: anayasa §18, §27–28, §46.2; [CONTROLS_AND_UX.md](CONTROLS_AND_UX.md), [RPG_AND_PROGRESSION.md](RPG_AND_PROGRESSION.md).

71. P0 görevlisi önce boş rafın mevcut müşteri ihtiyacını ve bozulabilecek çıkışı ele alır, sonra girdi/uzun vadeli ikmal işine geçer; yol mesafesi aynı öncelikte bağ kırar. Kontrat/A3 rezervasyon sırası §41.3'e uyar. Her tick sınırsız görev yeniden üretimi yoktur.
72. Oyuncu ve çalışan aynı lot için mevcut rezervasyonu paylaşamaz: önce başarıyla rezervasyon alan işlemi sürdürür; diğeri `reserved/stale` sonucu alıp görevi yeniden planlar. Görsel dokunuş tek başına mülkiyet vermez.
73. P0 oyuncunun odada fiziksel karakteri ve sınırlı taşıma kapasitesi vardır. Kamera tanrı eliyle anlık stok teleportu sağlamaz.
74. İşsiz çalışan erişilebilir iş istasyonunu kapatmayacak tanımlı bekleme hücresine gider; uygun hücre yoksa güvenli mevcut hücrede durur. Görsel idle hareketi ekonomik iş üretmez.
75. Oyuncu/çalışan hızı sabit “çalışan daha yavaş” cezalı kuralına bağlanmaz. P0 hareket/eylem süreleri aynı simülasyon sözleşmesine uyar, görev otomasyonunun değeri rotayla ve yükle ölçülür; A3 beceri/yorgunluk hız sınırları uygulanır.
76. P0 tam yorgunluk ve mola döngüsü yoktur. A2 bir çalışan ve mola öğretimi, A3 tam yorgunluk modeli açılır.
77. Taşıyan çalışanın yolu değişirse yük elinde kalır; rota yenilenir veya güvenli uyumlu depoya devredilir. İnşa onayı servis/kapı/rota erişimini önceden kontrol eder; yük yere kaybolmaz.
78. P0 çalışan XP/level artışı yoktur; SaveDTO aktör kimliği/görev/yükü taşır. Eğitim/beceri/kapasite alanları A3 içerik sözleşmesiyle eklenir, P0'da sahte bonus yoktur.
79. Oyuncu görevi panelden iptal/devir edebilir; çalışan güvenli bırakma noktasında işi bırakır, rezervasyonlar ve taşıdığı yük atomik çözülür. Ürün havada silinmez.
80. İlk sürüm toplam çalışan sınırı 20 (§27.1); P0 tek görevli, A2 bir çalışan kapsamındadır. Odaya sığan eşzamanlı görsel sayı performans/rota ölçümüne bağlıdır, kayıtlı çalışan silinmez.

## D-015 — Makine, parti ve yerleştirme: ek sorular 81–90

Kaynak: anayasa §26, §40, §47.3; [ECONOMY_AND_MACHINES.md](ECONOMY_AND_MACHINES.md).

81. Girdi, güç ve çıkış yeri hazırsa makine insan başında beklemeden çalışır. İnsan girdi/çıktı taşıma, servis ve ilerideki uzmanlık için gerekir; her aktif tick'te poz zorunlu değildir.
82. Makine giriş/çıkış buffer kapasitesi içerik verisinden okunur; dolu çıkışta parti bekler. P0 otomatik sonsuz beşli kuyruk eklemez; A3 seviye III ikinci tarif kuyruğu paralel üretim değildir.
83. Başlamamış iş iptalinde ayrılan girdi/güç serbest kalır. Başlamış partiyi iptal etme normal hızlı eylem değildir; duraklat/taşı koşullarında kalan süre ve tüketilmiş girdi korunur. Gerçek imha varsa açık kayıp işlemidir.
84. P0/A2 hazır çıktı alınmayınca yanmaz veya gizli bozulmaz, makine çıkışında bekler. A3 açık raf ömrü kategorisi uygulanır; yeni “overcook” cezası eklenmez.
85. P0 makine verisi seviye I içerir; yükseltme davranışı A3/A4 kaynak tablosundan açılır. Hız ×2/kapasite ×3 uydurulmaz; yürüyen parti yükseltmeyle çift çıktı üretmez.
86. Makine state'i `Running/Blocked/NoInput/NoPower/Ready` gibi görsel/ses işaretlerine yansır; düşük cihaz profilinde partikül düşer, metin/ikon sürer. Efekt üretim commit'ini tetiklemez.
87. P0 biyoyetiştirici tarifi zaten iki girdi kullanır: su + spor. Mimari input listesini baştan destekler; tek girdili arayüzle kısıtlanmaz.
88. P0 aşınma/servis davranışı açılmaz; A3 W=0–100 kalıcı durum ve §40 servis koşulları eklenir. Yeni save sürümü göçü olmadan varsayılan saha sessizce değişmez.
89. Makine footprint'i ve servis hücresi grid üzerindedir; serbest x,z yerleşim yoktur. 1×1/2×2 tanımlar content'ten gelir.
90. Yer değiştirirken aynı instance ID, lotlar, mevcut parti, kalan tick, aşınma ve enerji durumu korunur. Taşınma sırasında işlem durur; hedef erişim/çakışma doğrulanmazsa eski yerinde kalır. Makineyi kaldırmak üretim/stoğu sıfırlamaz.

## D-016 — Kilitlenme, kesinti ve cihaz köşeleri: ek sorular 91–100

Kaynak: anayasa §11, §48.4, §60.3–60.4; D-001. Kurtarma oyuncunun geçmiş ekonomik sonucunu gizlice sıfırlamaz.

91. Müşteri sonsuza kadar imkânsız ürünü beklemez: girişte belirlenmiş sabır ve tanımlı ikame geçerlidir; süre bitince kayıp satış nedeni kaydedilip çıkar. Son temel makine satışı D-001 ile ayrıca engellenir.
92. Save çalışanı ve taşıdığı lotu, kaynak/hedef rezervasyonunu ve rota hedefini kaydeder. Yüklemede lot çalışanın yükünde kalır; geçerli rotaya yeniden yol bulunur veya güvenli depo devri yapılır. Kaynakta kopya oluşturulmaz.
93. Çevrimdışı üretim/ödül olmadığı için cihaz saatini ileri almak bunları üretmez. Çevrimiçi reklam gerçek süre sınırı ayrıca güvenilir zaman/adaptör doğrulaması gerektirir; tek oyunculu temel akış sunucuya bağlanmaz.
94. Yerleştirme önizlemesi her makine için en az bir servis hücresi, oyuncu/çalışan erişimi ve kapı–raf–kasa yolunu doğrular. Duvara sıfır yerleştirme servis hücresini kapatıyorsa reddedilir.
95. Korunan üretim zinciri “envanterde var” diye çalışır sayılmaz: rota, servis, güç, erişilebilir girdi ve satılabilir çıkış kontrol edilir. Sıkışma varsa ücretsiz yer değiştirme/son geçerli yerleşime geri alma sağlanır; D-001'in satış/elden çıkarma koruması bütün kayıp yollarında uygulanır.
96. Çevrimdışı ilerleme olmadığı için kapalıyken parti bitmez. Kapanmadan önce bitmiş, çıkışı dolu parti makinede `Ready/BlockedOutput` halinde kalır ve yer açılınca alınır; çıktı çoğalmaz.
97. Müşteri sabrı yalnız aktif tick'te azalır. Bir saat kapalı kaldıktan sonra aynı müşteri/kuyruk ve kalan süre kayıttan sürer; final sınavı kapanışla kolaylaşmaz.
98. Portre telefon/tablette viewport ve safe-area yeniden hesaplanır; oyun dünyasının geometrisi esnetilmez. Görünür alan/kamera ölçeği uyarlanır, HUD breakpoint değiştirir; siyah bant varsayılan çözüm değildir.
99. Çöpe atma/satış/transfer tek transaction ID ile durable commit edilir; pause aynı işlemi tekrar başlatmaz. Commit öncesi kaynak yerinde kalır, sonrası log replay idempotenttir. Yarım yazım son doğrulanmış duruma döner ve kayıp açıkça bildirilir.
100. Domain/SaveDTO canvas'tan bağımsızdır. WebGL context loss'ta simülasyon güvenli duraklar, renderer ve sahne aynı state'ten yeniden kurulur; başarılamazsa kayıt korunarak hata/kurtarma ekranı açılır. UI error boundary tek başına GPU kaybı çözümü sayılmaz.

Bu kararların oyuncu psikolojisi açısından ortak sınırı: kısa eylem–anında anlaşılır sonuç, görünür darboğaz, affedilebilir yanlış dokunuş, maliyetli eylemde açık onay ve ilerlemeyi beklemeye zorlamayan duraklatma. My Mini Mart'ın mağaza sayfası çiftçilik/üretim, raflama, çalışan ve genişleme döngüsünü tanımlar; **Orbit Market'e özgü sayısal kurallar ve teknik mimari bu belgedeki ürün kararlarıdır**, rakip oyunun doğrulanmış iç parametreleri değildir. Kaynak: [My Mini Mart resmî ürün sayfası](https://mwm.ai/apps/my-mini-mart/1592004814), [App Store açıklaması](https://apps.apple.com/us/app/my-mini-mart/id1592004814).

### Oyuncu deneyimi için karar filtresi

| İlke | Karşılığı | Yanlış uygulama işareti |
|---|---|---|
| Eylem–sonuç bağı | Taşıma, üretim, raflama ve satış aynı sahnede görünür; kredi yalnız gerçek satışta artar. | Para animasyonu satış commit'inden önce oynar veya stok görünmeden kasaya geçer. |
| Anlaşılır hedef ve yeterlik | Her kısa oturumda tek etkin hedef, bir sonraki erişilebilir adım ve durma nedeni gösterilir. | Oyuncu hangi makinenin neden beklediğini veya neyi geliştireceğini bulamaz. |
| Tercih hakkı | Elle çalışma ve güvenli otomasyon, uygun maliyet/rota bilgisiyle seçilir; uzun basış, titreşim ve çevrimiçi özellikler isteğe bağlıdır. | İlerlemek için tek jest, reklam veya gerçek zaman bekleme zorunlu olur. |
| Adil kayıp ve güven | Yanlış dokunuşlar onay/iptalle geri alınır; soft-lock önlenir; bozuk kayıt açık kurtarma ekranıyla çözülür. | Satış/çöp eylemi gizli stok kaybı veya kurtarılamaz ilerleme yaratır. |
| Ölçülü bilişsel yük | Tek ana panel, yakın aktörde ihtiyaç işareti, seyrek bildirim ve açık neden metni kullanılır. | Ekran aynı anda çok sayıda bar, ok ve kayıt bildirimiyle kaplanır. |
| Rahat tempo | Çevrimdışı ceza, gizli sabır kaybı ve günlük giriş serisi yoktur. | Oyuncu oyunu kapattığı için stok, müşteri veya hikâye ilerlemesi kaybeder. |

Bu filtre P0 dış oyuncu denemesinde ölçülür: oyuncu ilk üretim–raf–satış zincirini açıklayabilmeli, hata mesajından bir sonraki eylemi bulabilmeli ve kesintiden sonra neden stok/kredi değişmediğini anlayabilmelidir. Test başarısı varsayılmaz; sonuç [TEST_STRATEGY.md](TEST_STRATEGY.md) kanıt kartına yazılır.

## D-017 — A. Görsel sanat ve 3B dünya

| Soru | Cevap | Dayanak/durum |
|---|---|---|
| A.1 | Mat düz renkli, az fasetli **low-poly kübik/voxel esintili** habitat. Küp ve prizma siluetleri kullanılır; Minecraft dokusu, gerçekçi PBR ve cel-shaded anime hedef değildir. | Anayasa §62.2; [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md) §2. |
| A.2 | Başlangıç satış odası **6×6 hücre**; bağlantı koridoru en az 2 hücre geniştir. P0 tek oda bununla başlar; sonraki modüller ayrı eklenir. | Anayasa §9. |
| A.3 | **1 grid hücresi = 1 metre = Three.js dünyasında 1 yatay birim** uygulama kararıdır. P0 Biyoyetiştirici 2×2, Paketleyici 1×2 footprint kullanır; kasa, raf ve dolap kendi içerik tanımından okunur. Müşteri bir yürüme hücresini geçici kullanır, makine gibi kalıcı 1×1 yerleşim nesnesi değildir. | §9/§26.4 footprint; metre→Three.js birimi eşlemesi teknik karar. |
| A.4 | Hafif ambient/hemisphere ve bir yön ışığıyla mat renkler; blob veya baked gölge varsayılan. Her makine/aktör için gerçek zamanlı gölge yoktur. Düşük cihazda görsel kalite azalırken oyun kuralı aynı kalır. | §62.2/§63.1. |
| A.5 | Ortografik kamera, yatay düzlemde 45° çapraz, aşağıya 30–35°; P0 başlangıç kararı **32°**. 6×6 oda için hedef `(3,0,3)`, başlangıç kamera pozu yaklaşık **`(11,7.07,11)`** (`d=8`, yükseklik `√2·8·tan(32°)`). Ortografik görüş yüksekliği safe-area ve ekran oranına göre hesaplanır; cihaz değişince dünya ölçeği/koordinatı değişmez. | §62.3 açıyı sabitler; bu poz ve responsive görüş hacmi uygulama kararı. |
| A.6 | P0 iki parmakla sınırlı pan ve pinch zoom, “karaktere dön” kontrolü vardır; serbest orbit yoktur. 90° inşa döndürmesi nesneyi döndürür, kamerayı değil. | §60.1/§62.3; [CONTROLS_AND_UX.md](CONTROLS_AND_UX.md). |

P0 gerçek cihaz kontrolü: 6×6 odanın ana eylemi HUD altında kalmamalı; 2×2 yetiştiricinin servis hücresi ile 1×2 paketleyicinin girdi/çıktı ve yürüme yolu yerleştirme önizlemesinde doğrulanmalıdır. Kamera `d`/zoom sınırı bu kontrolle kayda alınır, kaynakta verilmemiş sabit sayı uydurulmaz.

## D-018 — B. UI, hareket ve yerleştirme

| Soru | Cevap | Dayanak/durum |
|---|---|---|
| B.1 | Telefon ve tablette **portre** düzeni. Telefon 9:16–9:21 aralığı ve portre tablet için responsive kırılımlar; landscape zorunlu oyun düzeni değildir. | §60.1/§62.3. |
| B.2 | DOM/CSS **Neo-Brutalist** UI: kâğıt `#F4F0E6`, mürekkep `#171717`, sarı `#FFE156`, cyan `#35D9E6`, sert 2–3 px kontur ve blur'suz gölge. Dünya daha düşük doygunlukta kalır. React/Tailwind paketleri mevcut olsa da bu görünüm bir framework zorunluluğu değildir. | §62.1–62.2. |
| B.3 | Safe-area dışında başlangıç yerleşimi: **üst ~%12** kredi/görev/duraklat; **orta ~%65** 3B dünya; **alt ~%18** solda/sağda ele göre hareket çubuğu, en çok üç bağlamsal eylem ve inşa erişimi. Sabit piksel `(x,y)` yoktur; telefon/tablet breakpoint ve metin ölçeğiyle hesaplanır. | §60.1/§62.3. |
| B.4 | Oyuncu fiziksel karakteri joystick veya dokun-git ile taşır; istasyonda uyumlu hedef belirlendikten ve **0,3 sn** sabit kaldıktan sonra güvenli al/bırak yapılır. Makineye yalnız dokunmak ürün teleport etmez. Sürükleme inşa/yerleştirme önizlemesinin hareketidir; üretim tarifinin başlaması girdi/güç/çıkış koşuluna bağlıdır. | §60.1; [CONTROLS_AND_UX.md](CONTROLS_AND_UX.md). |
| B.5 | Makine: İnşa → içerik kartı/bedel → grid önizlemesi → tutamaçla sürükle/döndür → footprint/servis/kapı/kasa/rota/güç/bedel kontrolü → ayrı onay veya iptal. İnşa sırasında simülasyon durur; onay tek atomik komuttur. **Çalışan grid'e makine gibi konmaz**: işe alma, görev/rota ve vardiya ataması personel panelindedir; A2 erişimi korunur. | §9/§27/§60.1; D-016. |

## D-019 — C ve D. Geri bildirim ve oyun matematiği

| Soru | Cevap | Dayanak/durum |
|---|---|---|
| C.1 | `CompleteSale` durable commit'inden sonra HUD kredisi güncellenir; kasada kısa `+12 kredi` metni, tek gruplanmış kasa sesi ve isteğe bağlı hafif titreşim görünür. Aynı transaction için bir kez; bekleyen/başarısız satışta para efekti yoktur. Az hareket ayarında uçan animasyon yerine sabit metin kullanılır. | §62.1/§60.3; görsel ayrıntı uygulama kararı. |
| C.2 | Makinede küçük 2B DOM/billboard dolum göstergesi ve panelde kalan aktif saniye vardır. Gövde/ışık duruma göre kısa hareket eder; sürekli pahalı duman şart değildir. `NoInput`, `NoPower`, `BlockedOutput`, `Running`, `Ready` ikon ve metinle ayrılır. Üç saniyelik iş 30 tick'tir; görsel çubuk işi bitirmez. | §26/§62.2; D-007/D-015. |
| C.3 | Para/erişim yokken satın alma düğmesi pasif görünür, yanında **“X kredi eksik”** veya somut sebep okunur. Stale durum onay anında tekrar denetlenir; kısa bildirim ve ilgili alan etiketi gösterilir. Yalnız kırmızı titreşim veya sessiz pasif düğme kullanılmaz. | §60.1; D-012. |
| D.1 | P0 öğretim müşterisi ilk raflı satışı gösterecek tanımlı tetikle çıkar; sonrası P0 ritmi **56 ziyaret / 900 aktif saniye** tabanıyla seed'li geliş sürecini sınar: her 100 ms tick'te `p=56/9000` (yaklaşık 0,00622), uygun kapı/kapasite varsa müşteri RNG'siyle karar. Bu **ortalama** 16,1 sn aralıktır, tam zaman garantisi değildir. Öğretim gelişini normal RNG ziyareti olarak iki kez sayma. A2+ taban ziyaret sayıları bölüm tablosundan; küresel olay etkisi yalnız geliş oranına, aile etkisi sepet ağırlığına uygulanır. Fiyat tepkisi talepte ayrıca hesaplanır. | §37.3/§44; P0 RNG uygulama kararı. |
| D.2 | P0 tek örnek müşteri için **40 aktif simülasyon saniyesi** kuyruk sabrı kararı; geri sayım yalnız kasadaki beklemede işler, yürüyüşte/uygulama kapalıyken işlemez. A2 üç profil için anayasadaki **40/55/30 sn** değerleri geçerlidir; rahatlık ayarı kaynak sınırlarına uyar. P0 değeri dış oyuncu denemesiyle ayarlanabilir. | §38.1; P0 profil eşlemesi uygulama kararı. |
| D.3 | P0'da dinamik fiyat yoktur: Standart besin küpü **12 kredi** (§26.3/§37). Fiyatı art arda satış veya oyuncu nakdi değiştirmez. A2 raf fiyatı seçimi ve müşteri fiyat tepkisi ayrı açılır. | §26.3/§38; D-012. |

### Psikolojik oyun ilkesi ve ölçüm

İlk satışın sonucunu geciktirmeden göstermek eylem–sonuç bağını kurar; makinenin neden durduğunu metinle açıklamak oyuncunun bir sonraki adımı seçmesini sağlar. Öğretim müşterisi gerçek stok/kasa kurallarını geçmeden satış yaratmaz. P0 testinde oyuncuya “Bu makine neden durdu?”, “Kredi ne zaman geldi?” ve “Şimdi ne yaparsın?” soruları sorulur; yanlış cevaplar metin/akış düzeltmesi gerektirir, oyuncu hatası diye kapatılmaz.

## D-020 — E. Tipli veri ve render aboneliği

**E.1/E.2:** P0 için tam ve tekil `Machine`, `Product`/ürün tanımı, `Customer`, `Worker`, lot, oyuncu ve snapshot kök sözleşmesi [DOMAIN_MODEL.md](DOMAIN_MODEL.md) “P0 somut TypeScript veri şeması” bölümündedir. Oradaki alanlar yeni uygulama kararıdır; depoda hâlihazırda derlenen arayüzler değildir. Tarif/makine statik içerik verisi instance durumundan ayrı tutulur; eksik durum alanı ad hoc Zustand/mesh prop'una eklenmez.

**E.3:** Oyun mantığı 10 Hz, render varsayılan 30 FPS/isteğe bağlı 60 FPS'tir. React/R3F/Zustand kullanılırsa Domain sabit tick üretir; Zustand seçicileri yalnız panelde görünen değer ve olayları yayınlar, sahnenin bütün component ağacı her tick yeniden render edilmez. R3F `useFrame` son iki mantıksal pozu interpolasyonla çizer; satış/üretim yalnız Domain commit'inden gelir. Bu paketler mevcut `package.json` bağımlılıklarıdır, anayasanın zorunlu mimarisi değildir; doğrudan Three.js ve DOM/CSS de aynı ayrımı sağlamalıdır. `Tailwind` varlığı da tasarım token'larını değiştirmez.

## D-021 — Kimlik tabanlı durum ve para hassasiyeti

**Normalizasyon:** Çalışan Domain durumunda makine, müşteri, personel ve lotlar kimlikle erişilen `Map<EntityId, Entity>` veya eşdeğer `Record` indeksinde tutulur. İlgili alt sistemin aktif kimlik kümesi ve olay kuyruğu vardır; her 100 ms tick'te bütün varlık dizilerini taramak zorunlu değildir. Hash tablosunda erişim ortalama O(1)'dir; 500 öğelik bir dizinin kendisi performans hatası kanıtı değildir. Sıralama gerektiğinde kimlik/sequence sıralı görünüm üretilir. İndeks, rezervasyon ve alt kümeler aynı transaction'da güncellenir; yeniden yüklemede yeniden kurulur. **Snapshot'taki diziler korunur** ([DOMAIN_MODEL.md](DOMAIN_MODEL.md)); JSON'a `Map` nesnesi doğrudan yazılmaz. Render/Zustand aboneleri tek entity veya küçük seçici sonuçlarını okur.

**Para:** §37'nin en az dört ondalık hassasiyet şartına uygun olarak **1 kredi = 10.000 atom**, güvenli tamsayı `number` ledger kararıdır. 50 kredi = `500000` atom; “5000 kuruş” iki ondalıkta kalır. Her işlemde `Number.isSafeInteger`/taşma ve negatif bakiye kontrol edilir. Girdi maliyeti/enerji kesirleri ara hesapta tam rasyonel veya decimal tutulur; ledger sınırında **en yakın atoma, tam yarımda sıfırdan uzağa** yuvarlanır. Ekran iki ondalık gösterir; işlemin kalıcı sonucu atomdur. `BigInt` P0 gereği değildir; JSON serileştirme ve plugin sınırlarında ek protokol ister. Güvenli tamsayı sınırına yaklaşma ölçülürse sürümlü decimal-string/BigInt göçü tasarlanır; gizli overflow olmaz.

## D-022 — Tick sınırı ve deterministik bağımlılıklar

**Ölüm sarmalı:** D-007/4'teki **frame başına en çok 5 aktif tick** kararı geçerlidir. Limit dolunca işlenmeyen gerçek süre oyunun tick sayısına eklenmez; görüntüde gecikme/slowdown ölçülür. Arka plan süresi hiç accumulator'a girmez. “3 tick ve gerisi oyunda ilerlemiş sayılsın” işlemi makine, sabır ve ücreti birbirinden ayırır; uygulanmaz. Başlangıç sınırı düşük cihazda p95 tick ≤6 ms ve 20 dk ısı/lag testiyle değerlendirilebilir.

**Determinizm:** Simülasyon fonksiyonu açık `tick`, sürümlü RNG akışları ve içerik tanımlarını girdi olarak alır; `Math.random()` ve `Date.now()` Domain içinde yoktur. Rastgelelik müşteri/ekonomi/kozmetik akışlarında ayrı tutulur; seed ve sayaç/durum snapshot'a yazılır. Platform monotonic saati yalnız foreground accumulator'ı besler. Aynı başlangıç snapshot'ı + aynı sıralı komutlar + aynı içerik sürümü → aynı ledger/stok ve olay sırası kabulüdür. “%100 kesin test” her cihaz davranışına garanti değildir; deterministik Domain testini mümkün kılar.

## D-023 — Mobil 3B etkileşim, bağlam kaybı ve raf görünümü

**Raycast:** R3F'de yalnız `onClick` eklemek otomatik olarak her render karesinde raycast yaptığı anlamına gelmez; [R3F olay belgeleri](https://r3f.docs.pmnd.rs/api/events) raycast'in varsayılan olarak kullanıcı etkileşiminde çalıştığını belirtir. P0'da UI pointer'ı ayrılır, basit zemin/grid düzlemi inşa hücresini çözer, seçilebilir birkaç nesne basit hit proxy ile pointerdown'da test edilir. Sürekli `onPointerMove` ile bütün sahneyi tarama. `three-mesh-bvh` ancak cihaz profilinde hit-test darboğazı kanıtlanırsa değerlendirilir; eklenti şart değildir.

**Context loss:** WebGL context loss, React render hatasıyla aynı olay değildir. Canvas/renderer kaybında simülasyon güvenli duraklatılır; WebGL `contextlost/contextrestored` ve kullanılan renderer yaşam döngüsü adaptörüyle yalnız sunum kaynakları yenilenir. Domain, kalıcı kayıt ve işlem kimlikleri yaşamaya devam eder. DOM kurtarma ekranı Canvas dışında kalır. React Error Boundary ayrıca React ağacının hatalarını yakalar; tek başına GPU kaybını çözmüş sayılmaz. Yeniden yaratma başarısızsa son doğrulanmış kayda dönme seçeneği gösterilir.

**Instancing:** Raf stokları mantıksal adetlerden temsilî yığın olarak çizilir; 100 elma = 100 ayrı mesh gerekmez. Tekrarlanan görünür geometri için Three.js `InstancedMesh` veya varsa Drei `Instances` kullanılabilir. Kullanılacak API mevcut sürümde doğrulanır; seçim gerçek `renderer.info.render.calls`, üçgen, bellek ve seçilebilirlik ölçümüyle yapılır. §63.1 düşük cihaz hedefi ≤150 draw call'dır, garanti edilmiş sabit limit değildir.

## D-024 — Kalıcı yazım ve uygulama arka planı

**Serileştirme:** P0 formatı sürümlü JSON snapshot + ayrı append-only işlemdir. Zustand store/mesh/callback bütünü doğrudan `JSON.stringify` edilmez; yalnız [DOMAIN_MODEL.md](DOMAIN_MODEL.md) DTO'su alınır. **2 MB** örneği mevcut kayıt boyutu kanıtı değildir. Snapshot boyutu ve serileştirme p95 süresi cihazda ölçülür; ana thread duraklaması bütçeyi aşıyorsa tutarlı snapshot kopyası Web Worker'da serileştirilir. İşçi–ana thread kopya maliyeti de ölçülür. MessagePack/sıkıştırma P0 varsayılanı değildir; günlük/backup/göç okunabilirliğine etkisi doğrulanmadan eklenmez.

**Öncelik ve lifecycle:** Para/stok gibi kritik işlem **oyuncuya başarılı gösterilmeden önce** tek yazıcı günlüğünde kalıcı onay alır; pause anına ertelenmez. Foreground'da 30 aktif saniyelik checkpoint tutulur. [Capacitor App `appStateChange`](https://capacitorjs.com/docs/apis/app) içindeki `isActive=false`, `pause` ve web visibility sinyalleri tek `LifecycleCoordinator` tarafından idempotent biçimde birleştirilir: yeni tick/komut alımını durdur → varsa sıradaki tam kritik yazımı bitirmeyi dene → son tutarlı sequence için checkpoint iste → platformun durdurabileceğini kabul et. OS'nin “2–3 saniye” garanti verdiği varsayılmaz. Snapshot aday/manifest/yedek doğrulanmadan eski sağlam kayıt silinmez; yarım son günlük kaydı replay edilmez. Asenkron Filesystem Promise'i atomik rename veya fiziksel flush garantisi sayılmaz; platform adaptörü ve kill testleriyle doğrulanır.

## D-025 — Ses eşzamanlılığı

Bir tick'te biten 10 makine mantıksal olarak 10 ayrı bitiştir; oyuncuya 10 yüksek sesli “ding” gerekmez. Yakın/öncelikli makine tamamlanmasını grupla: **aynı ses varyantından en çok 2 eşzamanlı oynatma**, toplam oyun efektlerinde başlangıç **8 ses** sınırı; fazlalık kuyruğa yığılmadan birleştirilir veya atlanır. Aynı sesin 100 ms içinde tekrar tetiklenmesi tek geri bildirime indirilebilir. Ana ses yolunda makul kazanç/headroom ve ihtiyaç varsa Web Audio `DynamicsCompressorNode` kullanılır; limiter güvenli ses seviyesini tek başına garanti etmez. [Web Audio tanımı](https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode) ve §62/UX ses kapatma/az hareket kuralları izlenir. Bu sayılar ses tasarımı başlangıcıdır; gerçek telefon hoparlöründe cızırtı, anlaşılabilirlik ve gecikme ölçülür.

## D-026 — Kod kapısı ve paket yöneticisi

**Lint/format:** Depoda şu an `npm run build` (`tsc -b`), `npm run lint` (`oxlint`), `tsconfig.app.json` içinde `noUnusedLocals` ve `noUnusedParameters` vardır. ESLint ve Prettier kurulmuş değildir. P0 kodu başlamadan TypeScript `strict`/`noImplicitAny` ve mevcut linter'da desteklenen açık `any` yasağı hedeflenir; eklenen kodda gerekçesiz `any` kullanılmaz. Format tek araç ve tek config ile sabitlenir, fakat sırf “daha katı” etiketi için ikinci linter veya tüm depoda anlamsız biçim diff'i eklenmez. Gerçek CI kapısı yalnız çalıştırılıp geçen build/lint/test komutlarıdır; henüz CI dosyası veya çalışan test komutu varmış gibi raporlanmaz.

**Paket yöneticisi:** Depodaki gerçek kilit `package-lock.json`; bu revizyonda **npm + `npm ci`** geçerlidir. pnpm kesin karar değildir. Geçiş ancak kurulum süresi, disk alanı, Capacitor/CI uyumu ve ekibin araçları ölçülüp tek lockfile'a kontrollü göç yapılırsa düşünülür. Farklı yöneticilerin lockfile'larını beraber güncelleme; yalnız “node_modules şişkinliği” iddiasıyla yöneticiyi değiştirme.

## D-027 — Reklam yaratıcıları ve end-card

Anayasa §51.1'deki “zorunlu ek end-card etkileşimi veya indirme şartı” şu şekilde uygulanır: görüntülenebilen, SDK'nın kendi akışında otomatik gelen ve kapatılabilir pasif kart tek başına reddetme sebebi değildir; ödül almak için kartla ek dokunma, mağazaya gitme, indirme veya açma zorunluluğu kabul edilmez. Ürün/SDK seçimi yapılırken bu akış sağlayıcı testinde doğrulanır. Uygun envanter veya politika garantisi yoksa o reklam gösterilmez; boş gösterim ve sıfır reklam geliri kabul edilir. Kullanıcı istemeden reklamveren sayfasına yönlendirme yoktur.

Bu kural seçilen reklam ağı, arabulucu veya yaratıcı ayarının gerçek yeteneklerine göre A4 sağlayıcı kapısında doğrulanır. “End-card kapat” seçeneği tüm ağlarda varmış gibi kodlanmaz. Sağlayıcı koşulu uyumsuzsa başka sağlayıcı seçilir ya da reklam özelliği kapalı kalır.

## D-028 — Reklam gelirinin birim ekonomisi

`Gelir = ücretlendirilen gösterim / 1000 × gerçekleşen eCPM`; teklif, gösterim, tamamlanma ve ücretlendirilen gösterim farklı sayımlardır. Kullanıcının verdiği **0,50–1 USD eCPM doğrulanmış pazar verisi değildir**. Bu varsayım doğru olsa, doluluk %100 olsa ve günde üçü de ücretlendirilen gösterim sayılsa dahi günlük örnek değer **0,0015–0,003 USD/aktif kullanıcı** olur; bunun net mi brüt mü olduğu eCPM raporunun tanımına bağlıdır. Gerçek net tutar sağlayıcı kesintisi, no-fill, ülke/cihaz karışımı ve ücretlendirme kuralıyla değişir.

Bu sınır varsayımıyla reklamı sunucu iş modelinin gelir garantisi saymıyoruz. Reklam doğrulaması için yalnızca maliyeti ölçülmüş küçük S2S/serverless endpoint ve sınırlı saklama uygundur; ayrılmış sürekli oyun backend'i/oyuncu hesabı reklam geliriyle gerekçelendirilemez. Sağlayıcı sandbox'ı, gerçek ücretlendirilen gösterim raporu ve aylık net gelir–altyapı/operasyon maliyeti modeli pozitif ve kabul edilebilir değilse gerçek reklam yayınlanmaz. Temel oyun adsiz ve offline çalışmaya devam eder.

## D-029 — Reklam yükleme ve performans etkisi

Uygulama açılışında ve oyun döngüsü sırasında reklam videosu indirilmez/ön yüklenmez. Kullanıcı Destekle ekranını açıp reklamı açıkça etkinleştirdikten ve gizlilik/yaş uygunluğu çözüldükten sonra, sağlayıcı destekliyorsa reklam orada asenkron hazırlanabilir. Oyun simülasyonu reklam önizleme/oynatımında duraklatılır; ekran uygulama yüklenirken kullanılabilir kalır, iptal ve “reklam hazır değil” seçeneği görünür. Beş saniyede hazır olmazsa teklif iptal/no-fill olur; ödül ve sıklık kotası tüketilmez, tekrar tekrar otomatik istek yapılmaz. 5 saniye ürün UX kararıdır, ağ performans garantisi değildir.

İndirme ve reklam gösterimi network/native SDK sorumluluğudur; bunların hiç CPU/GPU etkisi olmaz varsayılmaz. A4 düşük cihaz testinde foreground FPS, bellek ve ısı ölçülür; ölçüm kötüleşirse ön yükleme kapatılır veya reklam sağlayıcısı elenir. Reklam çağrısı ana oyun tick'ini bekletmez ya da değiştirmez.

## D-030 — Ödüllü kozmetik saklama ve veri silme

Oyun hesabı ve oyunlar arası cloud save oluşturulmaz. Doğrulanmış reklam ödülü, satın alınmamış kozmetik hakları gibi, mevcut cihazın yerel save'inde tutulur. Uygulama verisi silinir/uygulama kaldırılırsa reklamla kazanılmış kozmetik **yeni cihaza veya temiz kuruluma otomatik taşınmaz**; bu durum reklam başlamadan ve gizlilik açıklamasında söylenir. Kullanıcı aynı cihazdaki save'ini yedekten geri yüklerse yerel hak da dönebilir. Yeni kurulumda aynı kozmetik ücretsiz yaratıcı görevle yeniden kazanılabilir. IAP hakları bu yerel listeye bağlı değildir ve D-031 uyarınca mağazadan restore edilir.

S2S doğrulama kullanılırsa her denemeye tahmin edilmesi güç, rastgele ve hesapla ilişkilendirilmeyen `attemptId` verilir. Backend yalnız sağlayıcı callback'ini doğrular, tekrar işlenmeyi önleyen completion kaydını kısa süre tutar ve hak veya kozmetik envanteri barındırmaz. Ham IP, reklam kimliği veya kalıcı UUID saklama varsayılan değildir. Gerçek SDK zorunlu kıldığı veri varsa yayın öncesi envanter, amaç, alıcı ve saklama süresi açıklanır; veri azaltma mümkün değilse o SDK/ödüllü reklam seçilmez. Callback dedup saklama süresi sağlayıcı ve hukuk kontrolüyle belirlenir; gereksiz süresiz kayıt yoktur.

“Verilerimi sil” veri/gizlilik ekranında bulunur ve yerel kayıt sıfırlamayla karıştırılmaz. Talep akışı varsa doğrulanabilir attempt kayıtları/kimlik ilişkileri backend'den silinir; ilgili cihaz erişilebiliyorsa yerel reklam ödülleri ve save de kullanıcıya açık tam silme seçeneğiyle temizlenir. Mağaza işlemleri hukuki/mali kayıt istisnaları ayrı değerlendirilerek saklanabilir; IAP sahipliği Apple/Google hesabında kalır ve restore edilebilir. Hesap açılışı eklenirse mağaza kurallarına göre uygulama içinden hesap silmeyi başlatma akışı ayrıca gerekir. GDPR silme hakkının istisnaları ve süreçleri yayın bölgesi hukuk incelemesinde doğrulanır.

## D-031 — IAP iadesi ve çevrimdışı kozmetik

Satın alınan kalıcı kozmetik Apple/Google mağaza işlemiyle doğrulanır ve aynı mağaza hesabından Restore ile yeniden kurulur. Apple refund/revocation ve Google revoke sinyali/işlemi çevrimiçi olduğunda işlenir. Oyun her açılışta veya X günde bir internete bağlanmayı zorunlu tutmaz.

İnternet yokken son bilinen doğrulanmış kozmetik yerel cihazda görünmeye devam edebilir; iade ile geri alma sunucuya/cihaza ulaşana kadar bu tutarsızlık teknik olarak mümkündür. İlk sonraki bağlantıda/restore'da mağaza durumu yenilenir ve geri alınmış hak kapatılır; ücretsiz varsayılan görünüm kalır. Bu çevrimdışı pencere yalnız kozmetiktir, oyun gücü/rekabet avantajı veya ekonomi sağlamaz. DRM kilidi, hesabı cezalandırma veya temel oyunu kapatma yoktur. Mağazanın doğrulanmış durumu yoksa yeni satın alma/restore “bekliyor/bağlantı gerekli” der; sahte onay verilmez.

## D-032 — Yaş uygunluğu ve çocuk gizliliği

Uygulama açılışında sırf reklam kullanmak için devasa doğum tarihi/yaş ekranı gösterilmez. Mağaza hedef yaş grubu ve içerik derecesi oyunun gerçek içeriği/pazarlaması temelinde doğru beyan edilir. “Çocuklara yönelik değil” demek, içeriğin fiili hedef kitle değerlendirmesini geçersiz kılmaz.

Reklam SDK'sı yüklemeden önce seçilen ülke/mağaza politikası ve sağlayıcının çocuk/unknown-age akışı değerlendirilir. Genel kitle için yaş bilgisi toplanmaması tek başına COPPA ihlali anlamına gelmez; çocuklara yöneltilmiş veya mixed-audience hizmetlerde ek yükümlülükler doğabilir. Google Play hedef kitlesinde çocuk yaş grubu varsa Families şartları ve çocuk/yaşı bilinmeyen kullanıcı reklamları için uygun reklam SDK'sı gerekir; mixed audience için nötr yaş ekranı gerekebilir. Yaş ve güvenli reklam uygunluğu çözülemeyen istekler reklam alamaz; daha güvenli çocuk uyumlu envanter sağlayıcıda yoksa reklam kapalı kalır. Yaş ekranı gerekiyorsa ilk açılışı kesen genel duvar yerine reklam/ilgili veri işlevine girmeden önce nötr, varsayılanı yönlendirmeyen ekran olarak ve hukuki/politika onayıyla tasarlanır.

## D-033 — Ücretsiz görev ve reklam zaman/değer dengesi

Her reklam kozmetiğinin bir ücretsiz yaratıcı görev karşılığı anayasa §51.1 şartıdır. Görev tek oturumda tamamlanabilir, görünür ve normal oyun hedefiyle anlamlı olmalıdır; tekrarlı kaynak öğütme veya **saatler süren grind** olamaz. Başlangıç kabul sınırı tipik 3–8 dakikalık bir oturumdur; içerik playtestinde süre/algılanan çaba ölçülür. Reklam 30 saniyelik SDK tahmini diye garanti edilmez; reklam hazır değilse veya daha uzunsa ücretsiz yol değişmez.

Görev ve reklam süreleri saniye saniye eşitlenmez: reklam oyuncunun zamanını/iznini değiş tokuş eder, görev oynanış ve ilerleme sunar. Kozmetiği istemeyen oyuncu hiçbirini yapmak zorunda değildir; reklam yolu görevi oyundan kaldırmaz veya oyun ilerlemesini yavaşlatmaz. Ücretsiz görev her kozmetik için aynı erişim koşulunu ve hakkı verir; zaman sınırlı seri, görev tekrar cezası, reklamı öne iten sahte grind eklenmez. Üç saat süren görev testte çıkarsa o görev reddedilir veya yeniden tasarlanır.

Bu kararların resmî politika dayanakları ve sınırları: [FTC COPPA SSS](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions), [Google Play hedef kitle/yaş ekranı](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en), [AdMob Families gereksinimleri](https://support.google.com/admob/answer/6223431?hl=en), [Apple uygulama hesabı silme](https://developer.apple.com/support/offering-account-deletion-in-your-app), [StoreKit satın alma restore](https://developer.apple.com/documentation/storekit/restoring-purchased-products), [Apple refund notifications](https://developer.apple.com/documentation/storekit/handling-refund-notifications), [GDPR veri sahibi hakları — Avrupa Komisyonu](https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en). Bunlar ürün kararı ve kaynak özetidir; yayın öncesi ülke/mevzuat ve sağlayıcı yapılandırması ayrıca doğrulanır.

## D-034 — Klavye ve 3B sahne boyutu

Metin alanı açıldığında dünya geometrisi veya Canvas CSS ile dikey olarak ezilmez; kamera en-boy oranı her zaman gerçek çizim tamponuna göre hesaplanır. P0 temel akış klavyesizdir. İsimlendirme/arama gibi metin girişi ayrı DOM panelinde açılır, oyun duraklar ve panel görünür klavye alanının üstüne taşınır. iOS native kabuğunda klavye eklentisi kullanılıyorsa `KeyboardResize.None` (`resize: 'none'`) seçilir; bu ayar yalnız iOS'tadır. Android WebView için aynı API varmış gibi davranılmaz: native klavye olayı ve `visualViewport` ölçüsüyle panel konumu güncellenir, Canvas'ın sabit oyun alanı boyutu korunur. Klavye kapanınca panel/odak geri gelir; gerçek ekran dönmesi veya pencere boyutu değişiminde Canvas ve ortografik görüş hacmi normal biçimde yeniden hesaplanır. [Capacitor Keyboard](https://capacitorjs.com/docs/apis/keyboard), [VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport).

## D-035 — WebGL context kaybı ve sahne kurtarma

Canvas üzerinde `webglcontextlost` ve `webglcontextrestored` dinlenir; GPU kaybı React Error Boundary'ye bırakılmaz. Kayıpta render durur, simülasyona ayrı `render-recovery` duraklatma nedeni eklenir ve Canvas dışındaki DOM kurtarma ekranı görünür. Restore olursa renderer, texture, render target, geometri ve materyal kaynakları yönetilen asset kayıtlarından yeniden oluşturulur veya ilgili adaptör tarafından yeniden yüklenir; eski GPU handle'ları yeniden kullanılmaz. Aynı Domain durumu ve kamera/hedef seçimiyle sahne açılır; başarılı bir kare sonrası yalnız `render-recovery` nedeni kaldırılır. Restore başarısız veya tekrarlıysa yalnız Canvas yeniden kurulur; Domain/save sıfırlanmaz, kullanıcıya son sağlam kayda dönme/yeniden dene sunulur. R3F kullanılıyorsa onun yaşam döngüsü bu protokole bağlanır; otomatik kurtarma varsayılmaz. [MDN WebGL context lost](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event), [Three.js WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html).

## D-036 — Derleme hedefi ve destek tabanı

Anayasa §60.10'un başlangıç destek hipotezi Android 10+/ARM64 ve iOS 16+'dır; iOS 14 destek sözü verilmez. P0 üretim build'i `esnext`e bırakılmaz. Başlangıç sözdizimi hedefi `es2020` olarak açıkça sabitlenir; hedef iOS 16 ve Android 10 gerçek WebView cihazlarında açılış, WebGL2 ve bağımlılık API'leri ayrıca test edilir. `build.target` sözdizimini dönüştürür; eksik tarayıcı API'sini polyfill etmez ve eski cihaz garantisi sağlamaz. Vite 8'in varsayılan `baseline-widely-available` hedefi iOS 16.4'e kadar çıkabildiği için sadece varsayılana dayanılmaz. Gerçek cihaz açılmıyorsa destek matrisi veya hedef/polyfill kararı ölçülerek güncellenir; `es2015`e körlemesine inilmez. [Vite build.target](https://vite.dev/config/build-options), [Vite browser support](https://vite.dev/guide/).

## D-037 — Ses belleği ve ilk çalma

Splash Screen tüm sesleri `ArrayBuffer` olarak indirip decode etmez. Yükleme ekranı yalnız küçük, ilk oturumda sık kullanılan efektleri hazırlar; kalan sesler ihtiyaç anında asenkron yüklenir ve ölçülen bellek sınırına göre önbellekte tutulur/çıkarılır. Ses başarısız veya henüz hazır değilse görsel geri bildirim sürer, oyun tick'i beklemez. `AudioContext` kullanıcı etkileşimi gerektiriyorsa ilk açık sesli jestte `resume()` edilir; splash sırasında sesin kesin çalacağı varsayılmaz. Decode edilmiş `AudioBuffer` ve sıkıştırılmış kaynakların ayrı RAM maliyeti cihazda ölçülür; D-025 eşzamanlılık sınırı korunur. [MDN Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices).

## D-038 — 6×6 oda rotası

Anayasa §9'daki dolu grid için basit A* uygulanır. Manhattan mesafesi yalnız dört yönlü hareketin A* sezgiseli/öncelik ölçüsüdür; tek başına engel etrafında geçerli rota üretmez. 6×6 oda için P0'da harici `pathfinding.js` bağımlılığı eklenmez. Rota spawn/hedef veya işgal haritası değiştiğinde hesaplanır, aynı harita sürümünde önbellekten alınır; her 100 ms tick'te tüm müşteriler için A* koşturulmaz. Hareketli müşterilerde her hücreyi küresel engel gibi işlemek yerine hedefte kuyruk/rezervasyon ve kısa yerel bekleme uygulanır; kilitlenme testi yapılır. Rota yoksa duvardan geçiş yerine güvenli çıkış/yeniden hedefleme kullanılır.

## D-039 — Safe-area tokenları

Neo-Brutalist DOM arayüzünde `env(safe-area-inset-top/right/bottom/left)` ortak CSS tokenlarında bir kez tanımlanır; HUD ve alt paneller bu tokenları kendi düzenleriyle birleştirir. Sabit `40px` boşluk ve Tailwind Safe-Area plugin'i P0 varsayılanı değildir. `viewport-fit=cover` ve native sistem çubuğu davranışı gerçek iPhone/Android cihazda doğrulanır; desteklenmeyen ortamda `env(..., 0px)` güvenli varsayılanı kullanılır. Panelin klavyeyle yer değiştirmesi safe-area hesabından ayrı tutulur. [MDN viewport](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport).
