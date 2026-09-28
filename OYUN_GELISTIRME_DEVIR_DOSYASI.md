# PROJECT ORBIT MARKET — Sıfırdan geliştirme ve ajan devir dosyası

Sürüm: 3.0 — Three.js + Capacitor — 26 Eylül 2026
Durum: Uygulanabilir tasarım başlangıcı; henüz geliştirilmiş veya test edilmiş oyun değildir.
Güncel tasarım sözleşmesi: Yayın hedefi iOS ve Android'dir. Three.js/TypeScript ile web oyunu oluşturulur ve Capacitor ile yerel uygulama olarak paketlenir. Önce kısa özet ve bölüm 61–63 platform, görsel ve prototip sözleşmesini oku. Önceki Unity, PC ve Steam teknik hedefleri geçersizdir. Belgede anlatılanlar şartnamedir; çalışan uygulama iddiası değildir.
Çalışma adı: Orbit Market. Yayın öncesinde isim ve marka uygunluğu ayrıca araştırılmalıdır.

## Hızlı başlangıç özeti — ajan için ilk okuma

**Kanca:** Bahçendeki su kaynağından başlayarak içecek, tarım ve yerel gıda ürünleri üret; raflarını doldur ve çalışanlara devrettiğin işleri giderek daha akıllı bir markete dönüştür. Üretim darboğazı raftaki müşteri ihtiyacına kadar görünür.

**Hedef oyuncu:** Telefonda 3–8 dakikalık oturumlarda marketini geliştiren, istediğinde 15–20 dakika planlama yapan oyuncu. Düzenleme ve hafif otomasyon derinliği kısa oturumlara bölünür. Varsayılan dikey telefon ekranı ve tek başparmakla temel işletme; inşa ve gelişmiş yönetim gerektiğinde iki elle kullanılır. Bu bir pazar hipotezidir, doğrulanmış segment iddiası değildir.

**Platform/teknik:** TypeScript ve Three.js ile gerçek 3B web oyunu; Capacitor ile iOS/Android uygulama kabukları. Dikey izometrik kübik dünya ve dokunmatik kontroller. Simülasyon ve kayıt yerel, çekirdek oyun çevrimdışı çalışır. Capacitor platform projeleri Android Studio ve Xcode araçlarıyla derlenir.

**Döngü:** 20–60 sn: taşı → üret → rafla → sat. 3–8 dakikada bir küçük düzenleme, satış hedefi veya teslimat tamamla. Büyük hat ve final hedeflerini kalıcı alt adımlarla birkaç oturuma böl. Uygulama arka plana giderse güvenle duraklat; geri dönüşte kayıttan devam et. Otomasyon sonrası oyuncu kontrat, kalite ve yerleşime odaklanır.

**Kontroller:** Alt bölgede yüzen başparmak çubuğuyla hareket; işaretli istasyonda durunca güvenli al/bırak; alternatif erişilebilir dokun-git modu. İnşa düğmesi, seç-sürükle-bırak, döndür ve onay kontrolleri. İnşa modu duraklatır; eşya erişimi ve maliyeti onaydan önce gösterilir. Klavye yalnız editör/debug yardımcısıdır.

**Kazanma/kaybetme:** Tam sürümde seçilen topluluk finalinin sevkiyatlarını ve hizmet sınavını bitirmek kazanmadır. Düşük gelir, geciken kontrat ve personel sorunu yerel başarısızlıktır; kayıt silen game-over yoktur. Ücretsiz elle çalışma ve yardım göreviyle toparlanılır. İlk prototipte final yok; başarı ölçütü kaydedilebilir üretim-satış döngüsüdür.

**İlk prototip:** Bir oda, bahçe su kaynağı, şişeleme tezgâhı, domates yatağı, üç su ürünü ve taze domates, raf, kasa, tek müşteri davranışı, stok/para kaydı ve bir raf görevlisi. Bir plan değişikliği yürüyüşü veya boş rafı ölçülebilir biçimde iyileştirmelidir. RPG, reklam, gerçek ödeme, tam personel ihtiyaçları ve final ilk prototipte yoktur. Kesin aşamalar bölüm 58'de.

**İş modeli:** Ücretsiz ana oyun; App Store/Google Play üzerinden kozmetik satın alma ve açıkça seçilen kozmetik ödüllü reklam. Zorunlu reklam ve oyun gücü satışı yoktur. Reklam ve gerçek ödeme yalnız bağlantı olduğunda çalışır; temel ekonomi reklamsız dengelenir.

**Görsel yön:** Neo-Brutalist yüksek kontrastlı arayüz ve geometrik low-poly mahalle marketi. Arayüz kalın koyu konturlar, sert gölgeler ve düz renk blokları kullanır; oyun sahnesi üç boyutlu ve modülerdir.

**En büyük riskler:** Fiziksel taşımanın angaryaya dönüşmesi; tasarım kapsamının üretim kapasitesini aşması; çok sayıda göstergenin okunamaması. İlk doğrulama bunları hedefler. Bu kısa özet uygulama girişidir; ayrıntılı bölümlerin tamamını sırayla kodlamak görev değildir.

## 1. Devralan ajana görev

Bu dosyayı ürün tasarımı, teknik mimari ve geliştirme sıralaması için ana kaynak kabul et. Amaç; üçüncü şahıs karakterle işletilen, üretim zincirleriyle beslenen, modüler olarak genişletilen ve derin RPG ilerlemesi sunan özgün bir market yönetim oyunu geliştirmektir.

Önce mevcut depoyu ve AGENTS.md dosyalarını incele. Mevcut teknoloji varsa koru; boş projede aşağıdaki varsayılanları uygula. Önce oynanabilir dikey dilimi tamamla, sonra kapsamı büyüt. Belirsiz, geri alınabilir seçimleri karar günlüğüne kaydederek ilerlet; yalnızca bütçe, platform veya ürün kapsamını maddi biçimde değiştiren kararları kullanıcıya sor. Bu belgeyi okuduktan sonra yalnızca plan üretip durma: proje kurulumu, ilk oynanabilir döngü ve doğrulamayla başla.

Her teslimde çalışan yapıyı, çalıştırma talimatını, değişen dosyaları, test sonucunu ve kalan somut sorunları bildir. Yapılmayan testleri geçmiş gibi gösterme. Tasarım değerlerini kod içine dağınık sabitleme; veri dosyalarında tut.

## 2. Vizyon ve referansların anlamı

**Tek cümle:** Renkli bir mahallede küçük dükkânının raflarını elle doldurarak başla; bahçedeki sudan tarıma, işlenmiş gıdaya ve yerel ürünlere uzanan üretim ağını yönet.

Kullanıcının “MyMiniMarkt” ifadesi burada My Mini Mart benzeri elle taşıma, raf doldurma, müşteri ve kasa döngüsünün referansı olarak yorumlanmıştır; belirli oyunun birebir özellik listesi iddia edilmez. “Game Dev Tycoon tarzı” ifadesi, okunaklı işletme gelişimi ve personel yönetimiyle birlikte kullanıcının özellikle istediği genişletilebilir mağaza yerleşimi olarak uygulanır. “Zerigrhenitktten” ifadesi belirsizdir; bu belgede başlangıçtan oyun sonuna kadar tüm ilerleme olarak yorumlanmıştır.

Referanslardan alınacak ilkeler:

| Kaynak | Esin | Özgün uygulama |
|---|---|---|
| My Mini Mart benzeri döngü | Kolay anlaşılır fiziksel işler, raf-kasa akışı | Bahçe, üretim uzmanlığı ve müşteri toplulukları |
| Supermarket Simulator | Raf, fiyat, kasa ve stok yönetimi | Kısa mobil oturumlarda üretim ile raf kararını birleştirme |
| Game Dev Tycoon | Küçük işletmeden büyük kuruma gelişme hissi | Genişletilebilir odalar, görevli çalışanlar, işletme uzmanlıkları |
| RPG sistemleri | Yapı seçimi, itibar, görevler, karakter gelişimi | Tüccar, üretici ve topluluk lideri kimlikleri |

Hiçbir referansın logosunu, arayüzünü, karakterini, özgün modelini veya sesini kopyalama. İlk sürümde çok oyunculu ve açık dünya yoktur.

## 3. Varsayılan ürün kapsamı

- Motor/uygulama: TypeScript, Three.js/WebGL 2, Vite ve Capacitor. Sürümler kilit dosyasında sabitlenir. HTML/CSS arayüz, Three.js oyun sahnesinden ayrı katmanda tutulur.
- Platform: iOS/iPadOS ve Android; App Store ve Google Play. Telefon öncelikli dokunmatik tasarım, tabletlerde uyarlanabilir yerleşim. Masaüstü yayın kapsam dışıdır.
- Kamera: Dikey ekranda ortografik veya düşük perspektifli izometrik 3B. Oyun sırasında otomatik takip; inşada pan/zoom ve 90 derece döndürme. Serbest kamera hareketi karakter kontrolüyle çakışmaz.
- Oyun: Tek oyunculu, çevrimdışı, duraklatılabilir. Temel oyun internet ve hesap gerektirmez; isteğe bağlı kozmetik satın alma ve hak geri yükleme platform bağlantısı gerektirir.
- Gelir modeli: Ücretsiz temel oyun ve ana hikâye; doğrudan kozmetik satışı ve platform uygunsa oyuncunun başlattığı isteğe bağlı kozmetik ödüllü reklam. Tarif, personel gücü, üretim kapasitesi, bölüm ve final satılmaz. Bölüm 25 ödeme, bölüm 50–54 reklam/UX şartnamesidir. İlk prototipte gerçek ödeme/reklam yerine test sağlayıcısı kullanılır.
- Hedef deneyim: 3–8 dakikalık kısa oturumda anlamlı adım, isteğe bağlı 15–20 dakikalık yönetim oturumu; toplam 12–18 saatlik ana ilerleme test hipotezi olarak korunur. İçerik kısa oturumlara bölünür, gerçek zaman beklemesiyle uzatılmaz.
- Ton: Neo-Brutalist grafik dilinde enerjik, yüksek kontrastlı kübik mahalle marketi; kıtlık, emek, şirket baskısı ve topluluk sorumluluğu hikâyede işlenir.
- Öncelik sırası: Döngünün keyfi → okunabilirlik → kayıt güvenilirliği → üretim ve ekonomi → RPG derinliği → içerik miktarı.

## 4. Tasarım sütunları

1. **Her ürünün anlaşılır bir hikâyesi vardır.** Kaynak, işlem, ambalaj, taşıma ve raf ilişkisi görülebilir.
2. **Otomasyon oyuncunun rolünü değiştirir.** Aynı tuşa daha uzun basmak yerine yeni kararlar açılır.
3. **Yerleşim oynanıştır.** Yürüyüş mesafesi, servis alanı, enerji ve stok düzeni önemlidir.
4. **RPG seçimleri işletmenin biçimini değiştirir.** Üç uzmanlık yalnızca yüzde bonusu değildir.
5. **Başarısızlık toparlanabilir.** Oyuncu bekleyerek veya ödeme yaparak kurtulmak zorunda bırakılmaz.

## 5. Çekirdek döngü ve kontroller

20–60 saniyelik döngü: Kaynağı al → makineyi besle → ürünü taşı → rafı doldur → müşteriye hizmet et → gelir ve geri bildirim al.

3–8 dakikalık döngü: Darboğazın nedenini gör → uygun tek yerleşim/atama veya stok kararını ver → kaynağın makineden rafa, oradan müşteriye geçtiğini izle → küçük teslim veya satış hedefini tamamla. Uzun üretim ve kontrat birden fazla oturumda devam edebilir. Bu görünür neden–eylem–sonuç yönünün faz ve sınırları §67'dedir.

Uzun döngü: Bölge ihtiyacını öğren → üretim dalında uzmanlaş → topluluk/şirket kararını ver → yeni alan aç → final sözleşmesini tamamla.

Varsayılan kontroller: Alt güvenli alanda yüzen sanal çubuk, bağlamsal al/bırak, görev kartına dokunma, inşa ve duraklatma düğmeleri. Satın alma, satış, ücret, yıkım ve tarif değişimi yalnız alanda durmakla tetiklenmez; açık düğme/onay gerekir. Hareket ve UI ayrı dokunma sahipliği kullanır. Sağ/sol el seçeneği, basılı tutma yerine tek dokunuş seçeneği ve isteğe bağlı titreşim bulunur. Ayrıntı bölüm 60'tadır.

Taşıma başlangıçta 6 yığın birimiyle sınırlıdır; yükseltmeler 8/10/12 olur. Büyük eşya ayrı taşıma gerektirebilir. Yakın etkileşim hedefi vurgulanır; oyuncu ne alacağını işlemden önce görür. Basılı tutma ve tek basış seçenekleri sunulur.

## 6. İlk 20 dakika

| Süre | Oyuncunun yaptığı | Öğrendiği | Somut ödül |
|---|---|---|---|
| 0–2 dk | Dükkâna girer, üç ürün taşır | Hareket ve etkileşim | İlk raf hazır |
| 2–5 dk | İki müşteriye satış yapar | Raf ve kasa | İlk gelir |
| 5–8 dk | Kaynak suyunu şişeler ve domates toplar | Üretim ile raf paylaşımı | Kendi ürünü |
| 8–12 dk | Rafı taşır, koridor açar | Modüler düzen | Daha kısa servis yolu |
| 12–16 dk | Stok/rota darboğazını inceler | Bir düzen kararının sonucu | Gerekçesi görülen iyileşme |
| 16–20 dk | İlk raf görevlisini atar | Temel otomasyon ve devir | Oyuncuya serbest zaman |

Öğretim kısa bağlamsal görevlerle yapılır. Hızlı oyuncu atlayabilir; yardım günlüğünden tekrar okuyabilir. Süreler zorunlu zamanlayıcı değildir. Beceri seçimi P0 öğretimi değildir; §58.1 uyarınca A3 RPG kapsamındadır.

## 7. Market ve müşteriler

Müşteri durumları: Spawn → Browse → SeekShelf → PickItem → Queue → Pay → Leave. Alternatifler: MissingStock, PathBlocked, Abandon. Her başarısız durumun görünür bir sebebi bulunur.

- Müşteri sepeti ihtiyaç profili, gelir düzeyi, yerel olaylar ve ürün bulunabilirliğine göre oluşur.
- Başlangıçta çalışanlar, araştırmacılar ve kuryeler olmak üzere üç profil vardır.
- Sabır yalnızca kısa kuyruk animasyonu değildir: açık göstergesi, erişilebilir ayarı ve dengeli toparlanma davranışı vardır.
- Kasa satışı atomik işlemdir: stok rezervasyonu, ödeme ve gelir kaydı tek transaction kimliğiyle tamamlanır.
- Fiyatlar oyuncu tarafından önerilen aralıkta değiştirilebilir; pahalı fiyat talebi etkiler, tek başına kalıcı itibar cezası vermez (§38.3–38.4). Etki arayüzde açıklanır.
- Raflar ürün filtresi, minimum stok hedefi ve çalışan önceliği taşır.
- Boş raf müşteri memnuniyetini etkiler; tek eksik ürün tüm işletmeyi çökertmez.
- Gün sonu ekranı gelir, gider, kayıp satış, kuyruk süresi ve ana darboğazı gösterir.

## 8. Kaynak ve üretim sistemi

Her tarif girdiler, süre, enerji, çıktı, yan ürün, istasyon tipi ve kilit koşulu içerir. İlk sürümde sıvılar da standart paket/yığın olarak temsil edilir; ayrı akışkan simülasyonu yoktur.

| Dal | Örnek zincir | Satılan ürün | Temel karar |
|---|---|---|---|
| Gıda | Ham su → domates yetiştirme → püre → salça | Taze domates / köy salçası | Doğrudan sat veya işle |
| İçecek | Su + meyve → karışım → şişeleme | Meyve içeceği | Talep dalgalanması |
| Temizlik | Mineral + biyoyağ → karıştırma → paketleme | Temizleyici | Yan ürün değerlendirme |
| Fırın | Siyez → un → hamur → pişirme | Köy somunu | Unu sat veya ekmeğe işle |
| Tekstil | Lif → kumaş → dikiş | Termal eldiven | Uzman çalışan |
| Zanaat | Göl sazlığı → hasır örme | Hasır sepet | Sat veya ileri üründe kullan |

Makine durumları: Idle, WaitingInput, Running, OutputBlocked, NoPower, Paused. Oyuncu her durumu renk ve ikonla ayırt eder; renk tek bilgi kanalı değildir.

İş başlangıcında girdiler makinenin iş kaydına alınır. İş bitiminde çıktı tamponuna aktarılır. Çıkış doluysa ürün kaybolmaz. İptal iade politikasını önceden gösterir. Kayıt, devam eden işin girdilerini ve kalan süresini korur. Elektrik kesilince süre durur; girdiler tüketilmeye devam etmez.

Kalite üç seviyedir: Standart, Nitelikli, Özel. Kalite deterministik olarak girdi kalitesi, makine kalibrasyonu ve çalışan uzmanlığıyla hesaplanır. Gizli kalite zarları ilk sürümde yoktur.

## 9. Modüler yerleşim

Varsayılan oda, dış alan, kapı, yol, ağaç ve fazlı genişleme koordinatları [DUNYA_YERLESIM_PLANI.md](DUNYA_YERLESIM_PLANI.md) teknik paftasındadır. Pafta aşağıdaki erişim ve oyuncunun izinli modül taşıma kurallarını değiştirmez; açık ürün bedeli veya yeni ekonomi sistemi yaratmaz.

- 1 m hücreli 100×100 başlangıç dünya ızgarası; standart oda/üretim modülü 12×12 hücre, en küçük kapalı oda 8×8, değişken boyut adımı ve bağlantı koridoru en az 4 hücre genişliğindedir. Açık mahalleler/dış üretim bölgeleri de aynı tak-çalıştır modül kaydını kullanır. Yeni modül sınırı aşınca zemin ve gezinme sınırı büyür; mevcut modül koordinatları ve kimlikleri sabit kalır.
- Modüller: Market, depo, sera, işleme, atölye, personel alanı, enerji ve topluluk alanı.
- Ekipman boyutları 1×1, 1×2, 2×2 ve 2×3; servis erişim hücreleri tanım verisinde bulunur.
- İnşa modu simülasyonu duraklatır. Yerleştirme önizlemesi fiyatı, çakışmayı, kapı ve servis erişimini gösterir.
- Modüller taşınabilir, döndürülebilir ve saklanabilir. İç eşya, envanter ve bağlantılar kalıcı kimliklerle korunur.
- Bir taşıma işlemi önce doğrulanır, sonra tek komut olarak uygulanır. Geçersiz hareketin yarısı sahneye uygulanmaz.
- Son girişin kapanması, kasa erişiminin yok olması ve çalışanların kapalı hücreye sıkışması engellenir.
- İlk dilimde bağlantı otomatik komşulukla; sonraki aşamada okunaklı enerji ve lojistik portlarıyla kurulur.
- Geri al/yeniden yap inşa oturumu için desteklenir. Satılmış veya tüketilmiş envanter geçmişe dönük çoğaltılamaz.

Teknik yaklaşım: Izgara işgal haritası + erişilebilirlik grafiği; yerleşim değişiminde yalnızca etkilenen bölge güncellenir. İlk dilimde basit ızgara A* yeterlidir. Ajan sayısı artınca rota önbelleği ve kuyruk rezervasyonları eklenir.

## 10. RPG derinliği

### Karakter uzmanlıkları

| Dal | Başlangıç becerisi | Orta oyun seçimi | Ustalık davranışı |
|---|---|---|---|
| Tüccar | Müşteri ihtiyacını okuma | Paket satış veya sadakat hizmeti | Toplu sipariş müzakeresi |
| Mühendis | Makine kalibrasyonu | Verim veya esnek tarif | Bir hattı farklı ürüne hızlı dönüştürme |
| Toplulukçu | Yerel ihtiyaç analizi | Çalışan eğitimi veya sosyal projeler | Bölgesel ortak üretim sözleşmesi |

Hedef: 20 karakter seviyesi; her dalda 10 düğüm, toplam 30 beceri. Oyuncu tüm düğümleri aynı kayıtta açamaz, fakat makul oyun içi bedelle yeniden dağıtabilir. İlk dilimde her dal için yalnızca 2 beceri uygulanır.

XP yalnızca satış sayısından gelmez: yeni tarif, ilk otomasyon, görev, hizmet kalitesi ve keşif de verir. Tek eylemi tekrar ederek sonsuz XP üretmek azalan getiriyle sınırlandırılır; normal satış geliri kesilmez.

### Ekipman ve çalışanlar

Ekipman yuvaları: taşıma takımı, analiz aracı, üretim aparatı. Ekipmanlar davranış farkı yaratır: büyük yük ama düşük hız; hızlı analiz ama sınırlı alan; esnek üretim ama daha fazla enerji. Rastgele yüzlerce anlamsız eşya yoktur.

Çalışan özellikleri: lojistik, üretim, hizmet; ayrıca bir güçlü yön ve bir tercih. Çalışanlar görev öncelikleriyle yönetilir. Ücret, mola, eğitim ve çalışma ortamı memnuniyeti etkiler. Tek bir göstergeyi yükseltmek bütün sorunları çözmez. İşten çıkarma veya atama değişimi görev rezervasyonlarını güvenli biçimde bırakır.

### İtibar ve anlatı

Üç topluluk: Yerleşim Kooperatifi, Araştırma Birliği, Ticaret Konsorsiyumu. İtibar yeni sözleşme ve diyalog seçenekleri açar. Bir tarafa yaklaşmak diğer bütün içerikleri sessizce kilitlemez; sonuçlar seçim ekranında anlaşılır biçimde belirtilir.

Görev yapısı: İhtiyaç → iki veya daha fazla çözüm → ekonomik ve ilişkisel sonuç → ileride hatırlanan değişim. Örnek: Su kıtlığında içecek kârını artırmak, suyu temel ihtiyaç için ayırmak veya geri kazanım hattı kurmak. Her yolun gerçek maliyeti ve uygulanabilir sonucu vardır.

## 11. Ekonomi ve denge başlangıç değerleri

Tek para birimi kredi; araştırma puanı satın alınamaz. Oyun günü 900 aktif saniyedir. Başlangıçta 100 kredi nakit, kasa, raf, seviye 1 memba çeşmesi, şişeleme tezgâhı ve domates yatağı vardır. Ham su birimi, debi, açılış sarfı ve ilk değişken maliyetler §26 ve içerik kataloğunda tanımlıdır. Bu sayılar başlangıç denge hipotezidir; oyuncu testinde ölçülür. Eski besin küpü başlangıç fiyatı/maliyeti/üretim süresi geçerli değildir.

Katkı payı = satış fiyatı − lot girdileri − enerji/ambalaj sarfı. Net sonuç = toplam katkı − ücretler − sabit giderler. Talep, fiyat ve stok etkileri bölüm 38'in tek sayma kuralına uyar. Nakit tükenince ücretsiz yardım ve elle çalışılan temel üretim yolu korunur; reklam veya gerçek para gerekmez.

## 12. Psikoloji, bağlılık ve karanlık tema

İstenen psikolojik derinlik; beklenti, ustalık, sahiplenme, merak ve ahlaki gerilim üzerinden kurulur. Oyuncuyu aldatıp para veya zaman harcamaya zorlayan dark pattern uygulama talimatları bu kapsamda değildir.

| Psikolojik ilke | Uygulanacak mekanik | Oyuncu kontrolü |
|---|---|---|
| Yetkinlik | Gittikçe daha karmaşık ama okunaklı hatlar | Zorluk seçenekleri ve açık neden-sonuç |
| Özerklik | Üç uzmanlık ve alternatif görev çözümleri | Yeniden dağıtım, geri alınabilir yerleşim |
| Sahiplenme | Kişiselleştirilen dükkân ve çalışan hikâyeleri | Dekorasyon oynanışı zorunlu kılmaz |
| Beklenti | Görünür araştırma ve sipariş ilerlemesi | Kesin koşullar, sahte sayaç yok |
| Merak | Yeni ürünlerin ve mahallenin keşfi | İçerik kaçırma cezası yok |
| Sosyal bağ | Hatırlanan seçimler ve NPC ilişkileri | Gerçek insan baskısını taklit eden bildirim yok |
| Akış | İş yükünden stratejiye geçiş | Duraklatma ve tempo ayarı |

Uygulanmayacaklar: Sahte kıtlık, sıfırlanan indirim sayacı, gizli ücret, ücretli rastgele ödül, kayıp korkusuyla günlük seri cezası, yanıltıcı buton, gizli kişiselleştirilmiş fiyat, oyuncunun hassasiyetine göre harcama baskısı, zorunlu reklam ve çıkışı zorlaştırma.

Karanlık yön anlatıda yaşayabilir: Konsorsiyum NPC'si sömürücü bir anlaşma önerir; koşulları oyuncuya açık gösterilir; oyuncu reddedebilir ve alternatif ilerleme yolu bulunur. Oyun bu davranışın topluluk sonuçlarını işler. Bu, gerçek oyuncuya uygulanan aldatıcı bir satış sistemi değildir.

Oturum biterken güvenli kayıt ve tamamlanan hedef özeti gösterilir. Çevrimdışı kalmak stok çürümesine, para kaybına veya ilişki cezasına yol açmaz. İşletme kapanmış olarak devam eder.

## 13. Başlangıçtan finale ilerleme

| Bölüm | Süre hedefi | Ana sistem | Çıkış koşulu |
|---|---|---|---|
| 1 — İlk Tezgâh | 0–1 saat | Taşıma, raf, kasa, temel üretim | İlk düzenli sipariş |
| 2 — Küçük İşletme | 1–3 saat | Çalışan, depo, iki üretim dalı | Sürdürülebilir üç oyun günü |
| 3 — Üretim Mahallesi | 3–6 saat | Modüller, enerji, kalite | Üç toplulukla tanışma |
| 4 — Bölgesel Ağ | 6–10 saat | İleri tarif, uzmanlık, kontratlar | Bölgesel krize çözüm |
| 5 — Son Büyük Sipariş | 10–15 saat | Çok ürünlü kapasite ve itibar kararı | Final projesinin teslimi |
| 6 — Yeni Düzen | 12–18 saat | Seçimlerin sonucu | Sonuç sahnesi ve serbest oyun |

Final projesi, seçime göre kooperatif merkezi, yerel araştırma merkezi veya ticaret merkezi olur. Üçü de aynı içerik temeli üstünde farklı görev koşulları ve sonuçlar kullanır. Finalde gerçek zamanlı baskı yoktur; oyuncu hazır olunca teslim aşamasını başlatır. Serbest oyunda tarif ustalığı ve yerleşim iyileştirmesi sürer; ana hikâye sonsuza uzatılmaz.

## 14. Görsel ve ses yönü — Neo-Brutalist UI, kübik low-poly dünya

Arayüz, oyun sahnesinden ayrı HTML/CSS katmanıdır. Neo-Brutalist görsel dil: kömür siyahı 2–3 px kontur, 3–5 px blur'suz sert gölge, 6–10 px köşe yarıçapı, düz renk alanları ve açıkça bölümlenmiş grid. Kartlarda kart içinde kart yığını yoktur. Ana panel açık kâğıt; koyu alanlar sınırlı. Renk token'ları: mürekkep `#171717`, kâğıt `#F4F0E6`, sinyal sarısı `#FFE156`, elektrik cyan `#35D9E6`, canlı yeşil `#A7EB52`, vurgu pembe `#FC4F8B`. Ton eşlemesi renkleri yıkayıp kontrastı düşürmemelidir. Hata/başarı yalnız renkle anlatılmaz; etiket, ikon ve şekil de kullanılır.

Başlıklar ve kredi sayaçları kalın geometrik sans; teknik sayılar tabular/monospace. Kısa eylem etiketleri büyük harf olabilir, uzun açıklama normal cümle düzeninde kalır. Buton dokunulunca 2 px aşağı iner, sert gölgesi kısalır; titreşim açılabilir ve kapatılabilir. Hareket azaltma ayarı bu animi devre dışı bırakır. Dokunsal üslup bilgi hiyerarşisini ezmez; parıltı, sürekli titreşim, gradient, aşırı dönen sticker, emoji ikon ve otomatik kamera sarsıntısı yoktur.

Dünya, Three.js ile low-poly kübik geometri kullanır: modüler küp mağazalar, prizmatik makineler, blok bitkiler ve katmanlı küçük bahçe parselleri. Siluetler küplerden okunur, yüzeylerde az sayıda üçgen faset kullanılır. Dünya tonları UI vurgu renklerinden daha düşük doygunlukta kalır; UI'nın siyah kontur ve parlak renkleri oyun sahnesinden ayrışır. Kare kare düz grid çizgileri yalnız placement önizlemesinde görünür.

Her item ID'si tek, güçlü siluetle tanınır. Makine portları girdi/işlem/çıktı yönünü geometrik biçimde anlatır. Üretim aşaması basit hareketli parçayla gösterilir; GPU'yu yoran parça sayacı, sürekli parçacık, gerçek zamanlı çoklu gölge yoktur. Raf stoğu mantıksal adet kadar mesh üretmez; instancing ve temsilî yığın kullanılır.

Dikey kamerada oyuncu/işlem noktası merkez alt bölgede, üst HUD ve alt hareket bölgesiyle çakışmaz. Kamera oda duvarını göstermek için küçük bölümünü gizleyebilir; müşteri ve raflar kritik aksiyonu kapatmaz. Yakın detay ve uzaktaki işletme görünümü aynı geometri LOD kurallarını kullanır. Renk körlüğü, metin ölçeği, azaltılmış hareket ve yüksek kontrast ayrı ayarlanabilir.

Ses: düşük yoğunluklu modüler synth ortamı, üretim tamamlandığında kısa ve farklı sesler, gruplanmış kasa geri bildirimi. Kısa mobil oturumlarda her hareket ses üretmez. Müzik, dünya, UI, titreşim ayrı kapatılabilir. Mobil karanlık tema seçimi HUD renk token'larını uyumlu biçimde değiştirir; dünya sanat yönünü değiştirmez.

## 15. Ekranlar ve arayüz

Ana menü: Devam, Yeni Oyun, Kayıtlar, Ayarlar, Çıkış. HUD: kredi, saat, eldeki yük, etkin görev, önemli darboğaz. İnşa ekranı: kategori, maliyet, kapladığı alan, servis alanı. Üretim ekranı: tarif, girdi, çıktı, süre ve durma nedeni. Personel ekranı: görev, öncelik, eğitim, ücret. RPG ekranı: beceriler, itibar ve görev günlüğü. Gün sonu raporu: beş temel ölçüm ve bir iyileştirme önerisi.

Kritik hatalar yalnız toast ile bildirilmez; ilgili nesnede kalıcı durum bulunur. Bütün işlemler dokunmayla tamamlanabilir; hover, sağ tık veya klavye gerektirmez. Menü açıkken dokunuş dünyaya geçmez. Telefonlarda alt sayfalar, tabletlerde yan panel kullanılır.

## 16. Teknik mimari

Bağımlılık yönü: TypeScript Application → saf Domain; UI → Application komutları; Three.js Presentation → Application sorguları; Infrastructure, kayıt/mağaza/zaman portlarını uygular. Domain Three.js, DOM veya Capacitor nesnesine bağımlı olmaz. Bootstrap modülleri bağlar. UI mantığı ve render döngüsü ekonomik kuralları sahiplenmez. Aşırı soyutlamadan kaçın; ikinci gerçek uygulama gereği çıkmadan genel framework kurma.

Önerilen dizinler:

```text
src/
  domain/{economy,inventory,production,progression,placement}
  application/{commands,queries,simulation}
  infrastructure/{save,content,audio,capacitor}
  presentation/{world,ui,input}
  content/{items,recipes,machines,quests,skills}
  app/{bootstrap,routes}
public/{assets,audio,fonts}
tests/{unit,integration,device}
docs/{decisions,balance,playtests}
android/  # Capacitor üretir, native ayar gerektiğinde düzenlenir
ios/      # Capacitor üretir; macOS/Xcode hattında açılır
```

Ana servisler: InventoryService, ProductionSystem, EconomyLedger, CustomerSystem, WorkerTaskScheduler, PlacementService, ProgressionService, QuestService, SaveService. Aralarındaki değişimler komutlarla; UI güncellemeleri tipli olaylarla bildirilir. Her sistemin her sisteme eriştiği global singleton ağı kurulmaz.

Simülasyon başlangıçta 10 Hz mantık adımıyla yürür; görsel hareket frame bazında yumuşatılır. Tüm süreler simülasyon saatine bağlıdır. Pause, zaman ölçeği ve kayıt yükleme aynı saat kaynağını kullanır. Rastlantı için seed saklanır.

Temel değişmezler: envanter negatif olamaz; transfer toplam stoğu korur; satış iki kez gelir yazamaz; iptal edilmiş iş çıktı veremez; aynı hücreyi iki katı nesne işgal edemez; geçersiz kayıt mevcut sağlam kaydı silemez.

## 17. Veri sözleşmeleri

Kalıcı içerik kimlikleri insan tarafından okunabilen ve yayın sonrası değiştirilmeyen string değerlerdir. Çalışma zamanı nesneleri GUID taşır. JSON/TypeScript veri tanımları içerik kaynağıdır; kayıt dosyası Three.js mesh, DOM veya scene referansı saklamaz.

```json
{
  "id": "recipe.glass_water_small",
  "stationType": "bottler",
  "inputs": [{"itemId": "item.raw_water", "quantity": 1}],
  "outputs": [{"itemId": "item.glass_water_small", "quantity": 1}],
  "durationSeconds": 3,
  "powerRequired": 1,
  "unlockId": "chapter.start"
}
```

Ek veri tipleri: ItemDefinition(id, stackSize, basePrice, category); MachineDefinition(id, footprint, ports, buffers); SkillDefinition(id, prerequisites, effectIds); QuestDefinition(id, steps, conditions, rewards); CustomerProfile(id, needs, budgetRange, patience); ModuleDefinition(id, cells, entrances).

İçerik doğrulaması eksik kimliği, döngüsel beceri önkoşulunu, negatif maliyeti, sıfır süreli sınırsız çıktıyı ve erişilemeyen kilit koşulunu build öncesinde raporlar.

## 18. Kayıt ve dayanıklılık

Kayıt üst bilgisi: schemaVersion, buildVersion, timestamp, worldSeed, simulationTime. İçerik: oyuncu, para defteri özeti, stoklar, aktif üretim işleri, yerleşim, çalışanlar, görevler, itibar ve açılan içerik. Müşteri durumları ilk dilimde tam kaydedilir veya yükleme sırasında güvenli şekilde iptal edilir; rezervasyon iadesi açıkça test edilir.

Önce geçici dosyaya yaz, doğrula, sonra atomik değiştirme uygula; önceki sağlam kaydı yedek tut. Üç dönen otomatik kayıt + manuel yuvalar. Yüklemede sürüm göçü ve içerik eksikliği kontrol edilir. Bozuk kayıtta kullanıcıya yedek önerilir; sessizce yeni oyun başlatılmaz.

Mobil otomatik kayıt: değişiklik varsa en geç 30 aktif saniyede checkpoint; satın alma/kontrat/final gibi kritik oyun işlemleri dayanıklı günlüğe yazılır; pause/focus kaybında yeni snapshot istenir. Uygulama kapanış callback'inin çalışacağı varsayılmaz. Disk hatası görünürdür; başarılı kayıt bildirimi verilmez. İşlem günlüğü ve snapshot tek transaction sırasıyla bölüm 60'a göre uzlaştırılır.

## 19. Uygulama aşamaları ve çıkış ölçütleri

### A0 — Temel iskelet

Motor sürümünü sabitle, Git ve ignore dosyalarını oluştur, sahneleri kur, input ve kamera ekle, çalıştırma README'si yaz. Çıkış: Temiz checkout'tan proje açılır ve oyuncu test odasında hareket eder.

### A1 — Çekirdek prototip

Taşıma, envanter, bir raf, bir kasa, müşteri akışı ve kredi defteri. Çıkış: Oyuncu on satış tamamlar; hiçbir stok veya para çoğalmaz; boş raf ve dolu kuyruk toparlanır.

### A2 — Oynanabilir dikey dilim

Güncel kapsam bölüm 58'deki A2 satırıdır: su ve yerel gıda döngüsü birkaç kısa oturuma bölünür, toplam 20–30 dakika test edilir. Kesintisiz oynama zorunluluğu yoktur; arka plan ve süreç sonlandırma testlerinden sonra kayıt tutarlı kalır. Önceki altı beceri hedefi A3'e ertelenmiştir.

### A3 — Sistem derinliği

Enerji, kalite, personel öncelikleri, modül taşıma, itibar ve görev dalları. Çıkış: İki farklı işletme düzeni aynı hedefi farklı avantajlarla tamamlar; tek baskın yapı belirlenirse dengeleme yapılır.

### A4 — İçerik ve final

Hedef kapsam: Tier 1–4 yerel ürün ağacı, gerekli istasyonlar, 30 beceri, 25 görev ve 3 sonuç yolu. Ürün/istasyon sayısı eski 24/12 kotasına zorlanmaz; önce P0 ürünleriyle ekonomi doğrulanır. Çıkış: Yeni oyundan sonuç ekranına debug hilesi olmadan gidilir.

### A5 — Yayın adayı

Performans, erişilebilirlik, ses/görsel tutarlılık, kayıt göçleri, lisans kontrolü ve paketleme. Çıkış: Kritik/ağır açık hata yok; aşağıdaki uçtan uca senaryolar geçer; sürüm notları ve bilinen sınırlamalar hazırdır.

Takvim ekip kapasitesi bilinmediği için kesinleştirilmez. A2 sonrası gerçek üretim hızına göre tahmin yapılır. İlk dikey dilim doğrulanmadan bütün içerik veya final sanat üretimine girilmez.

## 20. Doğrulama planı

- Birim: Envanter transferinde korunma, maliyet hesabı, atomik satış, üretim duraklatma, önkoşul açılması, görev ödülünün tek verilmesi.
- Entegrasyon: Kaynak → makine → depo → raf → satış; çalışan iptali; dolu çıktı tamponu; enerji kesintisi; yerleşim doğrulama.
- Kayıt: Üretimin ortasında kaydet/yükle; satın alma sonrası yükle; eski şema göçü; bozuk dosya; disk yazma hatası; yedekten dönüş.
- Uçtan uca: Yeni oyun → ilk satış → ilk makine → ilk çalışan → modül taşıma → kayıt/yükleme → bölüm geçişi.
- Ekonomi: Sabit seed ile düşük/orta/yüksek talep senaryoları; geri dönüşsüz iflas, ücretsiz üretim döngüsü ve sınırsız al-sat kazancı arama.
- Kullanılabilirlik: En az beş dış oyuncuyla ilk 20 dakika; ilk satış süresi, açıklanamayan duraksamalar, yanlış etkileşimler ve keyif geri bildirimi.

Performans hedefi: Bölüm 56 ve 60'taki gerçek mobil cihazlarda sürdürülebilir 30 FPS; üst sınıfta isteğe bağlı 60 FPS. Nihai stres sahnesi 60 müşteri, 20 çalışan, 100 makine ve 1.000 mantıksal yığın içerir; ekranda görünen avatar/ürün sayısı LOD ve görünürlükle sınırlanır. Ekran dışı görünüm azaltılırken ekonomi ve görev sonuçları değişmez. CPU/GPU, bellek, pil/ısı ve kayıt süreleri cihaz üzerinde ölçülür.

Analitik varsayılan olarak yereldir ve dışarı gönderilmez. Geliştirici raporları ürün akışı, tıkanma süresi ve görev tamamlama gibi oyun ölçümleri kullanır; hassas psikolojik profilleme yapmaz.

## 21. Başlıca riskler ve kapsam kontrolü

| Risk | Önlem |
|---|---|
| Üretimin market döngüsünü gölgelemesi | Her yeni hattı müşteri ihtiyacıyla bağla |
| Erken oyunun angaryaya dönüşmesi | İlk çalışanı erken aç, taşıma süresini ölç |
| RPG'nin yüzdelik bonus yığını olması | Her dalda davranış değiştiren beceri zorunlu |
| Modül taşımanın kayıt/rota bozması | Ön doğrulama, kalıcı kimlik, atomik komut |
| Ekonominin tek üründe çözülmesi | Kapasite, talep ve yan ürün kararları |
| İçerik şişmesi | Önce A2, sonra veriyle yeni içerik |
| Sanat kapsamının ekibi aşması | Ortak kit, sınırlı palet, yeniden kullanılabilir parçalar |
| Kötü final temposu | Son görev gereksinimlerini erken göster; ani grind ekleme |

Kapsam kesme sırası: Kozmetik çeşit → yan görev sayısı → ürün sayısı → ileri lojistik. Kayıt güvenliği, çekirdek döngü, ulaşılabilir final ve erişilebilir temel kontroller kesilmez.

## 22. Devralan ajanın ilk somut iş listesi

1. Depoyu incele; mevcut işin üzerine yazmadan teknoloji ve başlangıç durumunu raporla.
2. Boş projede varsayılan motor sürümünü doğrula; motor yoksa kurulu olduğunu varsayma ve çalıştırılabilirlik engelini belirt.
3. Karar günlüğü ve README oluştur; veri kimliği, birim ve saat kurallarını kaydet.
4. Inventory, Economy ve Production domain modellerini küçük hedefli testlerle yaz.
5. Bootstrap ve Market sahnelerinde kamera, oyuncu ve etkileşim kur.
6. Bir raf, kasa ve müşteriyle ilk gerçek satışı tamamla.
7. Memba çeşmesi, şişeleme ve domates yatağından satışa yolu bağla.
8. Kaydet/yükle ve yerleşim doğrulamasını ekle.
9. A2 kapsamını tamamla; hedefli testleri çalıştır ve oynanabilir build üret.
10. Test bulgularına göre dengeyi düzelt; A3'e ancak A2 çıkış ölçütleri karşılandığında geç.

## 23. Bitmiş ürün teslimi

Teslim paketi: Kaynak proje ve kilitli bağımlılıklar; Android test APK'sı/dağıtım AAB'si; iOS Xcode projesi ve yetkili imzalama ortamında archive/TestFlight yapısı; dokunmatik kontrol kılavuzu, lisanslar, denge tabloları, kayıt göçleri, cihaz test raporu ve sürüm notları. İmzalanmamış proje, yüklenebilir iOS uygulaması olarak sunulmaz.

**Tamamlanmış sayılma koşulu:** Oyuncu yeni oyundan başlayıp üretim, market, modüler yerleşim ve RPG seçimlerini kullanarak en az bir finale ulaşabilir; kaydını güvenle sürdürebilir; diğer final yollarının koşullarını anlayabilir; yayın paketi geliştirme ortamı olmadan açılır.

## 24. Başka ajana gönderilecek kısa görev metni

Sürüm 2.0 devir sırası: Hızlı başlangıç özeti → bölüm 60 mobil sözleşmesi → bölüm 55–59 bağlam/kapsam → ilgili sistem. İlk prototip P0, sonra A2; ikisi de cihaz üzerinde sınanır. Oyun iOS ve Android için ücretsizdir; işlevsel nesneler yalnız oyun içi kredilerle edinilir.

> Bu dosyayı ana tasarım ve uygulama şartnamesi olarak kullan. Önce mevcut depoyu ve AGENTS.md dosyalarını incele. Yeni projede Three.js/TypeScript/Vite ve Capacitor'ı kullan; iOS ile Android'i hedefle. Önce P0 dokunmatik dikey prototipini bitir, sonra bölüm 63'teki A2/A3 aşamalarına geç. My Mini Mart benzeri fiziksel market döngüsü, yerel su ve tarım ürünlerine dayalı özgün üretim, Neo-Brutalist UI ve kübik low-poly dünyayı birleştir. Capacitor build'lerini iki platformda doğrula. Yalnızca plan üretme; kodu, cihaz build'ini ve hedefli kontrolleri teslim et. Çalıştırılmayan build'i/testi tamamlandı gibi sunma. Kullanılabilir iOS Mac/Xcode hattı yoksa somut engeli kaydet, Android/web işini sürdür. Küçük geri alınabilir kararları kaydet; maddi kapsam değişikliklerini belirt.

## 25. Ücretsiz oyun ve ayrıntılı monetizasyon algoritması

### 25.1 Ücretsiz erişim ve satılabilir içerik

Oyuncu bütün üretim araçlarına, personel arketiplerine, becerilere, etkinliklere ve üç finale ödeme yapmadan erişebilir. Ücretli kozmetiklerin ücretsiz alternatifleri bulunur. Ücretli ürün stat, taşıma kapasitesi, raf kapasitesi, çalışma hızı, müşteri talebi, itibar veya görev erişimi değiştiremez.

| SKU ailesi | İçerik | Örnek başlangıç fiyatı* |
|---|---|---:|
| Küçük görünüm | Bir kıyafet veya araç görünümü | 2,99 USD |
| Dekor seti | 6 uyumlu dekor görünümü | 4,99 USD |
| Mağaza teması | Duvar, zemin, tabela ve kasa görünümü | 7,99 USD |
| Destekçi paketi | 2 kıyafet, tema ve dijital sanat kitapçığı | 11,99 USD |

*Bunlar pazar araştırması yapılmış fiyatlar değil, tasarım varsayımlarıdır. Yayın platformu, bölge ve maliyet analizi sonrası belirlenir. Kullanıcı yerel para birimindeki gerçek toplam fiyatı ödeme öncesinde görür. Sanal premium para, para paketi artığı, loot box, enerji satışı, ücretli can ve ücretli kriz çözümü yoktur.

Ücretli tema aynı ücretsiz nesnenin görünümüdür; farklı çarpışma alanı, depolama kapasitesi veya okunabilirlik avantajı vermez. Kozmetik olmayan dekor etkileri ücretsiz nesne tanımına aittir.

### 25.2 Katalog gösterim algoritması

Mağaza yalnız oyuncu açtığında gösterilir. İflas, kriz, başarısız görev veya çalışan ayrılığı satın alma teklifi tetiklemez. Katalog kalıcıdır; dönen vitrin ürünleri erişimden kaldırmaz. Oyuncu satın alma menüsünü tamamen gizleyebilir.

```text
buildCatalog(platform, locale, ownedEntitlements, selectedCategory):
    items = publishedCatalog.filter(platformSupported AND regionAvailable)
    items = items.filter(selectedCategory OR allCategories)
    markOwnedItems(items, ownedEntitlements)
    prices = platform.fetchLocalizedPrices(items.skuIds)
    if prices unavailable:
        return readOnlyPreview(items, reason="Fiyat bilgisi alınamadı")
    return stableSort(items, categoryOrder, skuId) + prices
```

Fiyat veya ürün sırası oyuncunun harcama geçmişi, duygusal durumu, kaybettiği para, günlük oynama süresi veya kriz zorluğuna göre değiştirilmez. Arama, fiyat sıralama ve sahip olunanları gizleme kontrolleri oyuncuya aittir. Sahip olunan SKU tekrar satın alınamaz; örtüşen paketlerde ilk sürüm satın almayı kapatır ve çakışan içerikleri listeler.

### 25.3 Ödeme ve hak teslimi

Durum makinesi: Idle → PlatformCheckout → PendingVerification → Granted; alternatifler Cancelled, Failed, Refunded. İstemcinin başarı ekranı tek başına hak kanıtı değildir.

```text
purchase(sku):
    ensureNotOwned(sku)
    quote = platform.getCurrentLocalizedQuote(sku)
    displayContentsAndTotal(quote)
    receipt = platform.checkout(sku)  // kullanıcı platformda onaylar
    result = entitlementBackend.verifyWithPlatform(receipt)
    if result.valid:
        atomic:
            insertUnique(result.transactionId)
            grantEntitlement(result.accountId, sku)
        refreshSignedEntitlementCache()
    else:
        showPendingOrFailureWithoutGranting()
```

Tekrarlanan callback aynı transactionId ile ikinci teslim oluşturmaz. Bağlantı koparsa işlem kimliğiyle durum sorgulanır; otomatik yeniden ödeme başlatılmaz. İade/iptal bildirimi doğrulanır, ilgili kozmetik hakkı geri alınır; kayıt veya oyun içi eşyalar silinmez. Kullanılan görünüm ücretsiz varsayılana döner. Çevrimdışı kullanım son doğrulanmış hak önbelleğiyle sürer; doğrulama yalnız isteğe bağlı çevrimiçi işlemleri etkiler. Temel kayıt dosyası değişikliği ödeme hakkı vermez.

Bu sistem için küçük bir hak doğrulama servisi veya platformun güvenilir eşdeğeri gerekir. Gizli anahtarlar istemciye gömülmez. Test sağlayıcısı A2'de, gerçek platform adaptörü ve doğrulama servisi A5'te uygulanır. Platform seçilince güncel resmi ödeme ve yayın şartları ayrıca doğrulanır; bu belge onların yerine geçmez.

### 25.4 Ekonomik sürdürülebilirlik hesabı

Mağaza ekonomisi gerçek para ekonomisinden tamamen ayrıdır. Gerçek para oyun içi krediye çevrilemez.

```text
aylık_brüt = aktif_oyuncu × satın_alan_oranı × alıcı_başına_sipariş × ortalama_sipariş
aylık_katkı = raporlanan_net_platform_ödemesi − sunucu − destek − içerik_üretimi
başa_baş_aktif_oyuncu = sabit_aylık_maliyet / oyuncu_başına_beklenen_net_katkı
```

Örnek varsayım: 10.000 aktif oyuncu × %2 alıcı × 1,2 sipariş × 5 USD = 1.200 USD aylık brüt; bu kâr veya gelir garantisi değildir. İadeler, vergiler ve platform kesintileri platform raporları üzerinden ayrı muhasebeleştirilir. Payda sıfır veya negatifse başa baş hesabı geçersizdir.

Ölçümler: Mağaza açılma sayısı, gönüllü satın alma dönüşümü, ödeme hatası, iade, kozmetik kullanım ve destek talebi. Oyun zorluğu alıcı oranını artırmak için ayarlanmaz. Harcama artarken iade veya şikâyet artıyorsa sonuç başarı sayılmaz. Satış telemetrisi temel oyunun çevrimdışı işleyişinden ayrılır; gereksiz kişisel veri toplanmaz.

## 26. Yerel ürün ve üretim sözleşmesi

Bu bölümün güncel ürün kaynağı [yerel ürün ağacıdır](OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md). Eski buz→su, spor→yosun→besin küpü ve cevher→ileri teknoloji zincirleri kaldırılmıştır. Katalogdaki Tier 1–4 aileleri, ürün kimlikleri, kaynakları ve istasyon ilişkileri bu bölümün ürün kapsamıdır. Katalogdaki fiyat, ham maliyet, süre, güç ve arazi bedelleri **denge hipotezidir**; çalışan ekonomi veya doğrulanmış kârlılık değildir.

### 26.1 Su ve ilk satış

Yeni kayıtta oyuncunun bahçesinde `source.spring_water` bulunur. Kaynak aktif simülasyon zamanı boyunca `item.raw_water` üretir; arka planda üretim, geçmişe dönük doldurma veya yükseltme anında bedelsiz stok yoktur. **1 ham su birimi = 0,5 litre**. Debi ve hazne seviyeleri aşağıdadır; yükseltme komutu bedeli bir kez düşürür, yeni hız bir sonraki 100 ms tick'ten itibaren işler. Kaynak başlangıç lotunun edinim maliyeti sıfırdır; şişelemede ambalaj ve enerji, tarımda tohum maliyeti ayrıca yazılır. Su, şişeleme ve sulama arasında aynı stoktan ayrılır. Eksi stok veya rezerve suyun ikinci kez harcanması reddedilir.

| Kaynak seviyesi | Ham su / aktif saniye | Hazne sınırı | Bu seviyeye yükseltme bedeli |
|---|---:|---:|---:|
| 1 (başlangıç) | 0,5 | 80 birim | Dahil |
| 2 | 1 | 120 birim | 80 kredi |
| 3 | 1,5 | 160 birim | 160 kredi |
| 4 | 2 | 220 birim | 320 kredi |
| 5 | 3 | 300 birim | 640 kredi |

Kesirli üretim tamsayı stokta görünmez; kaynak birikim sayacında atomik 100 ms ilerleme tutulur ve yalnız tamamlanan tam birimler hazneye girer. Hazne dolunca üretim durur; boşalınca yeni tick'lerde sürer. Kaynak kalitesi başlangıçta Standart 40'tır; kalite yükseltmesi bu debi yükseltmesinin ücretsiz yan etkisi değildir.

`station.bottler` üç ilk raf ürününü üretir: `item.glass_water_small` (1 ham su = 0,5 L), `item.water_jug_5l` (10 ham su = 5 L), `item.water_carboy_19l` (38 ham su = 19 L). Parti süreleri sırasıyla 3/8/18 aktif saniyedir; tezgâh 1 E kullanır. Her parti bir uygun ambalaj sarfı tüketir. Ambalaj türleri ve bedelleri katalogda tanımlıdır. Tüm ürünler tek kimlikli girdi rezervasyonu, çıktı kapasitesi ve kalıcı ledger kaydıyla işlenir.

**Yeni kayıt/P0 başlangıcı:** 100 kredi nakit, kaynak haznesinde 50 birim ham su, 12 küçük şişe, 4 adet 5 L bidon, 2 damacana ambalajı ve 8 domates tohumu. Kasa, bir raf, memba çeşmesi, şişeleme tezgâhı ve bir domates yatağı kurulu gelir; bunları ilk kez satın alma zorunluluğu yoktur. Başlangıç sarf lotları gerçek edinim maliyeti taşır ve nakit başlangıç değeriyle karıştırılmaz. Son temel su satış hattı ve su kaynağı elden çıkarılarak oyun kilitlenemez. Kaynak haznesi 50 birim ve seviye 1 debiyle küçük su 3 saniyelik partide çıkar; bir küçük su, bir 5 L su, bir damacana ve bir domates için toplam 51 birim gerekir, eksik 1 birim ilk 2 aktif saniyede üretilir. Bu, raflama/yürüme/müşteri beklemesi hariç üretim alt sınırıdır; 3–8 dakikalık oyuncu döngüsü cihaz testinde ölçülür.

### 26.2 Tarım, işleme ve genişleme

Ham su bostan ve tarlaya gider. Domates, salatalık, biber, siyez, ayçiçeği, mısır ve pamuk hasadı doğrudan satılabilir veya sonraki tarifte kullanılabilir. Ana zincir domates → katalogdaki `item.tomato_puree` → köy salçasıdır. Göl, mera, zeytinlik/bağ ve geniş tarla katalogdaki açılır alanlardır. Tier 3 değirmen, fırın, şarküteri ve dokuma; Tier 4 birleşik gıda ve zanaat ürünleridir. Tier 5 yoktur.

Çay yaprağı, kahve çekirdeği, maya, ceviz, sirke, baharat ve ambalajın edinim yolu katalogdaki girdi tablosundadır. Her nihai ürünün girdileri ham kaynağa veya görünür tedarike kadar izlenir; döngü, ücretsiz girdi ve iki kez kullanılan lot içerik doğrulamasında reddedilir. Aynı satılabilir ürünün ileri tarifte kullanımı üretim/raf rezervasyonuyla yönetilir. Bir girdi için yerel hasat sayıları tanımlanmamışsa ücretli tedarik yolu çalışır; yerel üretim tuşu açık görünmez.

### 26.3 Faz ve ekonomi sınırı

P0: memba çeşmesi, şişeleme tezgâhı, üç su boyutu, domates yatağı, raf ve kasa. Bu dört ürünün satış ve stok korunumu gösterilir. A2: ilk gıda işleme, kümes/mandıra ve basit içecekler. A3: göl, mera, bağ/zeytinlik, tarla ve Tier 3 işleme. A4: Tier 4 birleşik ürünler, üç finalin yeni katalogla dengelenmesi ve tam referans doğrulaması. Ürün sayısı eski 24 SKU hedefinden türetilmez.

Birim maliyet = tüketilen lot maliyeti + gerçek sarf ve enerji, bölü çıktı adedi. Personel ve kira günlük sabit gider olarak ayrı kalır. Katalogdaki aritmetik fiyat farkı net kâr değildir. Lot, kalite, kaydetme ve idempotent işlem kuralları §34, §48 ve §60'a uyar.

## 27. Personel rolleri, yerel tipler ve farklı özellikler

“Yerel personel” oyun evrenindeki yerleşim kökeni olarak tanımlanır. Gerçek etnik köken veya milliyet performans kalıbı olarak kullanılmaz. Her rol her yerleşimde bulunabilir; yerel geçmiş ek bir uzmanlık sağlar, mesleğe erişimi kilitlemez.

### 27.1 Meslekler

| Rol | Görev | Ana beceri | Başlangıç günlük ücret | Başarı ölçümü |
|---|---|---|---:|---|
| Raf görevlisi | Raf ikmali ve stok kontrolü | Lojistik | 60 | Boş raf süresi |
| Kasiyer | Tahsilat ve kuyruk düzeni | Hizmet | 65 | Ortalama bekleme |
| Taşıyıcı | Kaynak, makine ve depo transferi | Lojistik | 65 | Başarılı teslim/dk |
| Üretim operatörü | Tarif kuyruğu ve kalibrasyon | Üretim | 80 | Etkin üretim süresi |
| Teknisyen | Bakım ve enerji arızası | Teknik | 90 | Arıza çözüm süresi |
| Yetiştirici | Biyolojik üretim | Biyoloji | 75 | Kaynak verimi |
| Satın alma sorumlusu | Tedarik ve sipariş planı | Ticaret | 95 | Stokta bağlı kredi |
| Vardiya yöneticisi | Öncelik ve mola planı | Liderlik | 110 | Görevlerin dengeli dağılımı |

İlk çalışan raf görevlisidir; diğer roller bölüm 2–4 arasında açılır. İlk sürümde çalışan sayısı 20 ile sınırlıdır. İşe alım ekranında ücret, beceri, tercih, vardiya, görünür özellikler ve başlangıç rolü açıkça gösterilir.

### 27.2 Yerleşim kökenleri

| Yerel tip | Geçmiş | Kazanılmış özellik | Tercih / gelişim alanı |
|---|---|---|---|
| Merkez Mağaza | Yoğun hizmet bölgesi | Kuyruk işlerinde +%8 hız | Düzenli vardiya tercih eder |
| Soğuk Depo | Soğuk depo ve sevkiyat | Kaynak transferinde +1 yük | Hizmet eğitimiyle hızlı gelişir |
| Sera Kuşağı | Tarım yerleşimi | Biyotariflerde +5 kalite puanı | Teknik eğitim ister |
| Atölye Bölgesi | Endüstriyel bakım bölgesi | Onarım süresinde −%8 | Sessiz mola alanı tercih eder |
| Kervan İskelesi | Ticaret ve dağıtım | Teslim planlamada +%8 hız | Değişken görevleri sever |
| Akademi Yerleşimi | Araştırma kampüsü | Eğitim XP'sinde +%10 | Uzman görev tercih eder |

Bu özellikler biyolojik değil geçmiş deneyimdir; başka kökenden çalışan aynı yeteneği eğitimle edinebilir. Tercih karşılanmayınca doğrudan beceri düşüşü verilmez; uzun vadeli memnuniyet hesabına sınırlı katkı yapar.

Her meslek için altı yerel varyant kullanılabilir: örneğin Soğuk Depo kasiyeri yük avantajını taşıma görevindeyken kullanır, kasa hızına otomatik avantaj almaz. Böylece rol × köken = 48 işe alım arketipi; benzersiz sanat üretimi gerektirmeden veriyle çeşitlilik sağlanır.

### 27.3 Bireysel özellikler

Her aday: 1 meslek, 1 yerel geçmiş, 2 olumlu özellik, 1 çalışma tercihi, 1 geliştirilebilir eksiklik taşır. Çelişen özellik çiftleri oluşturulmaz; oyuncu özellikleri işe alımdan önce görür.

| Özellik | Etki | Sınır / bedel |
|---|---|---|
| Düzenli | Stok sayımı +%12 hızlı | Diğer işlere etki etmez |
| Çevik | Yürüme +%8 | Taşıma kapasitesi değişmez |
| Güçlü taşıyıcı | +2 yük | Ücret beklentisi +%5 |
| Titiz | Üretim kalite skoru +5 | İşlem süresi +%5 |
| Pratik | İşlem süresi −%6 | Kalite bonusu yok |
| Arabulucu | Takım anlaşmazlığının çözüm süresi −%20 | Vardiyada en yüksek tek etki uygulanır |
| Eğitici | Eşleştirilen acemiye +%10 eğitim XP | Aynı anda bir öğrenci |
| Çok yönlü | İkinci rolde beceri cezası yarıya iner | Birincil uzmanlık bonusu yok |
| İçe dönük çalışma tercihi | Tek istasyonda memnuniyet +3 | Kasa görevi yasak değildir |
| Yeni başlayan | Ana beceri 15–25 | Ücret −%15; eğitimle giderilir |

Performans çarpanları sınırsız çarpılmaz. Toplam hız bonusu −%25 ile +%30 arasında sınırlandırılır. Kalite ayrı hesaptır. Ücret beklentisi ve eğitim maliyeti satış kataloğuyla dengelenir.

### 27.4 Örnek personel kadrosu

| Ad | Rol / köken | Beceri | Özellikler | Kişisel olay hattı |
|---|---|---:|---|---|
| Ada | Raf görevlisi / Merkez | Lojistik 35 | Düzenli, çevik | İlk ekip liderliği |
| Bora | Kasiyer / Kervan | Hizmet 40 | Arabulucu, çok yönlü | Yerel pazar organizasyonu |
| Mira | Operatör / Akademi | Üretim 45 | Titiz, eğitici | Yeni tarif geliştirme |
| Ekin | Yetiştirici / Sera | Biyoloji 45 | Düzenli, titiz | Kuraklık dayanışması |
| Demir | Teknisyen / Atölye | Teknik 50 | Pratik, eğitici | Çırak yetiştirme |
| Nil | Taşıyıcı / Soğuk Depo | Lojistik 40 | Güçlü taşıyıcı, çevik | Soğuk depo iyileştirmesi |
| Aras | Satın alma / Kervan | Ticaret 45 | Pratik, arabulucu | Alternatif tedarikçi |
| Selin | Yönetici / Merkez | Liderlik 50 | Eğitici, düzenli | Adil vardiya anlaşması |

Bunlar başlangıç içerik örnekleridir, ücretli karakterler değildir. Her birinin tercih ve gelişim alanı üretim verisinde ayrıca atanır; hazır isimler rastgele adaylarla birlikte kullanılabilir.

### 27.5 Çalışma ve memnuniyet modeli

Beceriler 0–100, memnuniyet 0–100, yorgunluk 0–100. Etkin görev süresiyle yorgunluk artar; 4 dakika çalışmaya yaklaşık 1 dakika mola başlangıç hedefidir. Mola temel ihtiyaçtır ve oyuncu tarafından tamamen kapatılamaz; çalışanlar sırayla dinlenir.

```text
gunlukMemnuniyetDegisimi = clamp(
    ucretUyumu + molaUyumu + ortam + tercihUyumu + olaySonucu,
    -8, +6)
etkinHiz = temelHiz × clamp(1 + beceriBonusu + ozellikBonusu - yorgunlukCezasi, 0.75, 1.30)
```

Memnuniyet iki gün 30 altında kalırsa görüşme isteği, daha sonra düzelmezse önceden bildirilen ayrılma süreci oluşur. Çalışan stok veya para çalmaz. Ayrılırken rezervasyonlarını bırakır ve işi güvenli kuyruğa döner. Eğitim günlük zaman ve kredi kullanır; yeni yetenek gerçek çalışma deneyimiyle kazanılır.

## 28. Personel olayları

| Olay | Tetik / önkoşul | Seçenekler | Sonuç ve toparlanma |
|---|---|---|---|
| İlk gün heyecanı | Yeni işe alım | Mentor ata / kısa oryantasyon | 1 gün eğitim bonusu |
| Görev anlaşmazlığı | İki çalışan aynı öncelikte uzun süre bekler | İş alanını ayır / yönetici görüşmesi | Rota ve görev öncelikleri düzelir |
| Eğitim talebi | Beceri 40, en az 3 gün çalışma | Eğitim bütçesi / sonraki gün planı | Yeni uzmanlık; reddetmek kalıcı kilit yaratmaz |
| Fazla yük uyarısı | İki vardiya yüksek yorgunluk | Ek çalışan / görev azalt / mola düzenle | Geçici verim düşüşü çözülebilir |
| Aile izni | Bölüm 3 sonrası, önceden bildirim | İzin ve geçici atama / vardiya değişimi | 1 günlük yokluk; ücretli kriz çözümü yok |
| İyileştirme önerisi | Uzman çalışan, sık darboğaz | Deneme bütçesi / sonraya al | Uygunsa kalibrasyon planı açılır |
| Ücret görüşmesi | Terfi veya uzun süre ücret uyumsuzluğu | Zam / eğitimli yeni rol / açık erteleme | Beklenti ve memnuniyet değişir |
| Takım başarısı | Üç gün hedef hizmet kalitesi | Ortak kutlama / mola ödülü | Küçük geçici memnuniyet artışı |
| İş güvenliği uyarısı | Servis yolu sıkışık veya bakım gecikmiş | Hattı durdur / teknik kontrol | Sorunlu makine kapanır, kalıcı yaralanma sistemi yok |
| Ayrılma kararı | Uzun süre çözümsüz düşük memnuniyet | Sorunu gider / düzenli devir | Önceden bildirilen personel kaybı |

Aynı çalışanda eşzamanlı en fazla bir karar olayı. Küresel olarak iki aktif personel kararı sınırı vardır. Kişisel olaylar çalışma dışı gerçek zamanda ilerlemez. Karar beklerken oyun duraklatılabilir. Reddedilen bir teklif tekrar tekrar aynı gün çıkmaz; minimum üç oyun günü cooldown kullanılır.

## 29. Dünya etkinlikleri ve ekonomiyi daraltan olaylar

### 29.1 Etkinlik kataloğu

| ID / olay | Ön haber | Süre | Ekonomik etki | Oyuncunun karşı hamlesi |
|---|---|---|---|---|
| colony_festival / Mahalle festivali | 1 gün | 1 gün | İçecek/dekor talebi +%25; diğerleri değişmez | Stok ve vardiya hazırlığı |
| research_visit / Araştırma ziyareti | 1 gün | 1 gün | Enerji ürünleri +%20 talep | Kontrat, enerji ürün hattı |
| harvest_surplus / Bol hasat | 0,5 gün | 2 gün | Meyve/lif tedarik maliyeti −%15 | Stok sınırına göre toplu alım |
| training_fair / Meslek fuarı | 1 gün | 1 gün | Eğitim maliyeti −%20 | Vardiyalı eğitim |
| demand_slump / Yerel durgunluk | 1 gün | 2 gün | Tüm müşteri gelişleri −%20; lüks talep ek −%10 | Temel ihtiyaçlara ağırlık |
| freight_delay / Nakliye gecikmesi | 0,5 gün | 1 gün | Yeni sipariş teslim süresi +%50 | Alternatif yerel tedarik |
| mineral_shortage / Mineral kıtlığı | 1 gün | 2 gün | Yeni mineral alımı +%25 maliyet | Tarif karması ve rezerv |
| grid_maintenance / Şebeke bakımı | 1 gün | 0,5 gün | Kullanılabilir dış güç −%25 | Öncelikli makine listesi |
| competitor_sale / Rakip kampanya | 0,5 gün | 1 gün | Bir ürün ailesinde talep −%15 | Kalite, çeşitlilik, makul fiyat |
| shop_repair / Mağaza onarımı | 1 gün | 1 gün | Müşteri gelişleri −%15; temizlik talebi +%20 | Temizlik hattına dönüş |
| heat_wave / Sıcaklık dalgası | 1 gün | 1 gün | İçecek talebi +%20; biyohat süresi +%15 | Ön üretim ve kapasite planı |
| budget_freeze / Kurumsal bütçe durması | 1 gün | 2 gün | Yeni kurumsal kontratlar durur | Perakende ve kooperatif işleri |

Mevcut ödenmiş kontrat veya alacak geriye dönük iptal edilmez. Tedarik fiyatı değişikliği zaten onaylanmış siparişe uygulanmaz. Etkinlik bitişinde kaynak tanımları eski değerine yazılarak düzeltilmez; süreli modifier kaldırılır. Böylece diğer aktif etkiler korunur.

### 29.2 Olay seçme algoritması

Olay yöneticisi gerçek para harcamasını veya mağaza davranışını okuyamaz. Zorluk ayarı, bölüm, simülasyon günü, açık sistemler ve olay geçmişi kullanılır.

```text
her oyun gunu basinda:
    if chapter < 2 OR tutorialActive: olumsuzOlaySecme
    if daysSinceLastNegativeEnd < 2: olumsuzOlaySecme
    candidates = events.filter(unlocked AND prerequisitesMet AND cooldownExpired)
    candidates -= mutuallyExclusiveWith(activeAndScheduledEvents)
    if cashRunwayDays < 1 OR recoveryMode: candidates -= negativeEvents
    if rollingFiveDayNegativeCount >= 2: candidates -= negativeEvents
    if activeOrScheduledNegativeCount >= 1: candidates -= negativeEvents
    selected = seededWeightedChoice(candidates + noEvent)
    schedule(selected, warningTime, duration)
```

Başlangıç ağırlıkları: olay yok 50, olumlu 20, karma 15, olumsuz 15. Bunlar kategori ağırlığıdır; önce kategori, sonra uygun olay seçilir. Boş kategori ağırlığı olay yok seçeneğine aktarılır. Aynı olayın tekrar aralığı en az 7 oyun günüdür. Seed, planlanmış olaylar, cooldown ve geçmiş kayıt dosyasına yazılır; yüklemek sonucu yeniden zar atmaz.

Nakit dayanma süresi = kullanılabilir kredi / max(son üç günlük ortalama zorunlu gider, 1). Kullanılabilir kredi açık satın alma rezervasyonlarını çıkarır. Bu ölçüm tahmindir; oyuncuya açıklanır. Toparlanma modu yeni olumsuz olayları durdurur, mevcut olayı gizlice değiştirip sonuçları manipüle etmez.

### 29.3 Ekonomik etki sınırları

Bir boyuttaki olay yüzdeleri toplanıp clamp edilir; sınırsız çarpılmaz. Etkinlik kaynaklı toplam talep çarpanı 0,65–1,40; maliyet çarpanı 0,85–1,35; güç kapasitesi 0,70–1,20 aralığındadır. Ürün ihtiyacı, fiyat esnekliği ve kalite etkileri ayrı hesaplanır; olayın sebebi raporda ayrıştırılır.

```text
eventDemandFactor = clamp(1 + sum(activeDemandModifiers), 0.65, 1.40)
effectiveDemand = baseDemand × priceResponse × reputationResponse × eventDemandFactor
eventCostFactor = clamp(1 + sum(activeCostModifiers), 0.85, 1.35)
newPurchaseCost = baseSupplierCost × eventCostFactor
```

Talep formülü beklenen istek adedidir; kesin satış değildir. Ürün bulunabilirliği talebi yok etmez, karşılanamayan talep olarak raporlanır. Müşteri oluşumu ve sepet bileşimi aynı olaya iki kere çarpılmaz: küresel geliş etkisi spawn oranına, aile etkisi normalize edilen sepet tercih ağırlıklarına uygulanır.

Yeni su ve tarım ürünleri için olaylı/olaysız kâr karşılaştırması lot maliyeti ve gerçek sarf tanımlandıktan sonra hesaplanır. Yönetici normalde iki olumsuz olayı birlikte başlatmaz. Krizlerin amacı kârı azaltıp düzen değiştirmek; oyuncuyu gerçek para harcamaya zorlamak değildir.

### 29.4 Oyuncuya sunum ve zorluk

Olay kartı: Başlangıç, bitiş, etkilenen ürün/sistem, açık yüzde, tahmini maliyet ve iki karşı hamle. Ekonomi raporu temel performans ile olay etkisini ayrı gösterir. Zorluklar: Rahat'ta olumsuz etkiler yarı güçte; Standart'ta tablo; Zorlu'da aynı etki tavanlarıyla daha kısa hazırlık süresi. Oyuncu hikâye kaybetmeden ekonomi olaylarını kapatabilir.

Olay sonunda kısa sonuç: Kaybedilen tahmini satış, kullanılan alternatif üretim ve toparlanma önerisi. Büyük kârı elinden almak için açıklanmayan dinamik ceza veya otomatik iflas yoktur.

## 30. Yeni sistemlerin uygulama sırası ve kabul testleri

1. Tier 1–4 yerel ürün kataloğunu tamamla; ID, tedarik, tarif grafiği ve maliyet doğrulayıcısını kur.
2. P0 su kaynağı, üç şişelenmiş su boyutu ve taze domates satışını kanıtlar; A2 ilk işlenmiş gıda, kümes/mandıra ve sıcak içecek hatlarını açar.
3. P0'da tek raf görevlisine iş devri kanıtlanır; A2'de temel mola/personel, A3'te vardiya ve tanımlı rol derinliği, A4'te tam rol/olay içeriği açılır (§58.1).
4. A3'te sınırlı olaylar ve EventDirector, A4'te tam olay kataloğu açılır (§58.1).
5. Görünüm içeriği oyunun zorunlu üretim yolundan ayrıdır; A4'te kozmetik ödeme/reklam sandbox doğrulanır, A5'te seçilen platform ödemesi yayın kapısından geçer (§58.1). Gerçek sağlayıcı hazır değilse oyun ücretsiz yayımlanabilir; sahte çalışan ödeme butonu yayımlanmaz.

Ek veri tanımları: StaffDefinition, StaffOriginDefinition, StaffTraitDefinition, StaffEventDefinition, WorldEventDefinition, EconomyModifier, CosmeticSkuDefinition, EntitlementRecord. Oyun simülasyonu ödeme katmanından referans alamaz; kozmetik uygulayıcı yalnız görünüm verisi okur.

Kabul testleri:

- Aynı ödeme callback'i üç kez gelse yalnız bir hak verilir; bağlantı kesintisi ikinci ödeme açmaz.
- İade sonrası görünüm varsayılana döner; üretim, para ve kayıt korunur.
- Ödeme yapmayan kayıt bütün tarifleri, personel tiplerini ve finalleri açabilir.
- Her nihai ürünün ham kaynağa kadar geçerli yolu vardır; döngü, eksik araç ve imkânsız girdi bulunmaz.
- Üretim, taşıma iptali ve personel ayrılığı stok çoğaltmaz; hedef rezervasyonları bırakılır.
- Rol × köken kombinasyonları oluşturulabilir; çelişen bireysel özellikler reddedilir.
- EventDirector ilk bölümde, toparlanma sırasında veya aktif olumsuz olay varken yeni olumsuz olay üretmez.
- Olay başlamadan ve bittikten sonra kayıt/yükle, modifier'ın iki kez uygulanmasına veya kalıcı kalmasına yol açmaz.
- Nakliye gecikmesi mevcut onaylı fiyatı değiştirmez; talep etkisi spawn ve sepette iki kez sayılmaz.
- Sabit seed ile 30 oyun günü simülasyonunda normal, düşük satış ve kıtlık senaryoları raporlanır; kredi/ürün hareketleri mutabık kalır.

Bu ek tasarım şartnamesidir. Fiyatlar, oranlar, süreler ve gelir beklentileri henüz oyuncu testiyle doğrulanmamıştır; uygulayan ajan bunları ölçerek karar günlüğünde günceller.

## 31. Personel enerjisi, yorgunluğu ve dinlenmesi

Game Dev Tycoon referansı burada çalışanların zaman içinde yorulması ve iş ortamının önem kazanması yönünde bir tasarım esinidir; o oyunun birebir algoritması iddia edilmez. Yeni sistem bölüm 27.5'in ayrıntılı uygulamasıdır.

### 31.1 Durumlar ve sayısal model

Personel durumları: OffShift → Available → Working → FinishingSafeStep → WalkingToRest → Resting → Returning. Alternatifler WaitingForStation, Training, OnLeave. Yorgunluk `F` 0–100'dür; arayüzde enerji `100−F` gösterilir. İkisi ayrı kaydedilmez. Memnuniyet uzun vadeli, yorgunluk kısa vadeli ölçüdür.

Tüm süreler çalışan simülasyonun saniyesidir: duraklatma ve çevrimdışı süre etkilemez. 1 oyun günü = 900 simülasyon saniyesi. Normal işte yorgunluk artışı `0,25/sn` olduğundan 0'dan 60'a yaklaşık 4 dakikada ulaşılır. Rahat ortamda 60'tan 15'e yaklaşık 1 dakikada dönülmesi hedeflenir.

```text
workFatigueRate = 0.25 × roleLoad × environmentLoad
roleLoad: kasa/raf=1.00, taşıma=1.15, üretim=1.05, eğitim=0.70
environmentLoad = clamp(1 + noisePenalty + crowdPenalty - ergonomicRelief, 0.85, 1.25)
F = clamp(F + workFatigueRate × dt, 0, 100)
fatigueSpeedPenalty = clamp((F - 40) / 200, 0, 0.25)
restRecoveryPerSecond = 0.55 + 0.004 × roomComfort  // comfort: 0–100
```

Diğer roller varsayılan 1,00 yük kullanır. Gürültü ve kalabalık cezaları ayrı ayrı 0–0,15; ergonomi indirimi 0–0,15'tir. Bölüm 27'nin toplam hız sınırı geçerlidir; yeni hız çarpanları zincirleme eklenmez. Yorgunluk gizli ürün kaybı, rastgele stok silme veya ödeme hatası üretmez.

### 31.2 Mola kuralları ve güvenli görev bırakma

- F ≥60: Mola talebi oluşur. Uygun koltuk ve rota rezerve edilir; ekip sırayla çıkar.
- F ≥80: Yeni iş alınmaz; mevcut iş en geç 10 saniyelik güvenli adımda bırakılır, mola ertelenemez.
- F ≤15: Normal mola tamamlanır. Kullanıcı iş yükünü azaltarak daha erken mola başlatabilir.
- Dinlenme alanına yürümek küçük yük sayılır: +0,05/sn. Koltuk beklerken güvenli alanda ayakta dinlenme −0,25/sn sağlar; koltuk yokluğu sonsuz kilit yaratmaz.
- Vardiya dışında yorgunluk −1/sn azalır. Oyun kapalıyken gerçek saate göre hesap yapılmaz.
- Molalar ücretlidir. Günlük ücret aynı simülasyon günü içinde vardiya değiştirerek tekrar tekrar tahsil edilmez veya iptal edilmez.

Kasiyer başlamış satış transaction'ını tamamlar; taşıyıcı yükünü rezerve hedefe veya güvenli ara depoya bırakır. Operatör makineyi durdurmak zorunda değildir: otomatik çalışan mevcut parti devam eder, insan gerektiren sonraki işlem bekler. Stok ve hedef rezervasyonları görev devrinde atomik aktarılır.

Mola planlayıcı kritik roller için en az bir görevli bırakmayı dener; zorunlu dinlenmeyi engellemez. Tek kasiyer dinlenirse oyuncu kasaya geçebilir veya müşteriler bilgilendirilmiş kuyrukta bekler. Sistem oyuncudan onay bekleyerek çalışanı süresiz yoramaz.

### 31.3 Vardiya ve izin

Başlangıçta tek vardiya, bölüm 3'te günün 0–450 ve 450–900 saniyelik iki zaman aralığı açılır. Bir personel bir günde en fazla 720 saniye görevde planlanır; bunun içindeki molalar korunur. Tam gün sözleşmesi atanmış vardiya içinde sabit günlük ücret, yarım gün sözleşmesi %60 ücret kullanır. Maliyeti atama ekranında gösterilir.

İzin gününde personel görev almaz; izin ücretli/ücretsiz durumu olayda açıkça yazılır. Planlayıcı aynı personeli eğitim, izin ve vardiyaya çakıştırmaz. Gün sınırı olay ve ücret işlemleri benzersiz gün kimliğiyle yalnız bir kez yürür.

### 31.4 Personel arayüzü

Çalışan kartında enerji, memnuniyet, mevcut iş, sıradaki mola, mola yeri ve yorgunluk sebepleri görünür. Personel ekranında zaman çizelgesi, dinlenme koltuğu ihtiyacı ve rol boşluğu uyarısı bulunur. Öneri örneği: “Üç çalışan aynı anda mola eşiğine geliyor; birini şimdi dinlendir veya bir koltuk ekle.”

## 32. Ek odalar, mimari alanlar ve işlevsel dekorasyon

### 32.1 Odalar

Oda türü duvar, kapı, geçerli zemin alanı ve gerekli eşyalardan hesaplanır. Bütün oda ve üretim alanları aynı taşınabilir modül sistemini kullanır. Standart modül 12×12, en küçük kapalı oda 8×8'dir; bu sınırın altındaki dar oda tasarlanmaz. Değişken oda kenarları en az 8 m ve 4 m artışlıdır; modül kaydı geldiğinde harita sınırı otomatik genişler ve var olan koordinatlar korunur. Mahalle ve dış üretim bölgeleri açık yüzeyli modül olarak aynı sisteme takılır. Fiyat oda türü kabuğudur; büyüyen alan nedeniyle otomatik çarpılmaz ve eşya maliyeti ayrı görünür.

| Oda | En küçük alan | Gerekli donanım | Kabuk bedeli | İşlev |
|---|---|---|---:|---|
| Satış alanı | 12×12 | Kasa ve raf | İlk oda ücretsiz | Müşteri alışverişi |
| Kuru depo | 8×8 | Depo rafı | 160 | Girdi ve ürün saklama |
| Personel dinlenme odası | 8×8 | En az 2 koltuk | 180 | Hızlı yorgunluk giderme |
| Soyunma/hazırlık odası | 8×8 | Dolap | 140 | Vardiya başlangıç hazırlığını 10'dan 5 sn'ye indirir |
| Eğitim odası | 8×8 | Eğitim masası | 240 | Aynı anda 2 kişiye eğitim |
| Yönetim odası | 8×8 | Planlama terminali | 280 | Vardiya ve sipariş politikaları |
| Bakım atölyesi | 8×8 | Bakım tezgâhı | 220 | Teknisyenin planlı bakım işi |
| Soğuk depo | 8×8 | Soğutucu raf ve enerji | 300 | Hassas ürünlerin ömrünü uzatır |
| Mal kabul alanı | 8×8 | Teslim portu, kontrol masası | 200 | Dış sipariş teslim alma |
| Müşteri dinlenme köşesi | 8×8 | Oturma ve yönlendirme | 160 | Bekleme konforu |

Sera, işleme, enerji ve topluluk alanları önceki modül kataloğunda kalır. A4'teki eski “8 modül tipi” üst sınırı kaldırılmıştır: bu ekle toplam 14 işlevsel oda türü hedeflenir; atölye ve bakım atölyesi aynı türdür. İlk prototip bunların tümünü içermez.

Müşteri dinlenme köşesinin işlevsel 8×8 asgari alanı A4'te marketin batı-önündeki ayrı, cam cepheli pavyonla sağlanır; yeri ve yaya bağlantısı [yerleşim paftası §13](DUNYA_YERLESIM_PLANI.md) içindedir. Satış odasındaki eski 2×2 şişeleme nişi taşınmadan sonra boş nefes alanı olarak kalır; 160 kredilik oda, koltuk kapasitesi veya konfor etkisi sayılmaz. Standart 12×12 odalar tablodaki 8×8 **asgari** alan koşulunu sağlar; kabuk bedelleri oda türü başınadır ve alanla çarpılmaz. Oda kabuğu bedeli donanımı kapsamaz.

### 32.2 Dekor ve donanım etkileri

| Nesne | Oyun içi fiyat | Etki | Üst sınır |
|---|---:|---|---|
| Dinlenme koltuğu | 35 | Bir dinlenme slotu | Gerçek yerleşim ve yol erişimi |
| Kanepe | 70 | İki dinlenme slotu | Koltuk başına ayrı rezervasyon |
| Bitki | 20 | Oda konforuna +8 | İlk 2 tam, sonraki 2 yarım, sonrası 0 |
| Aydınlatma paneli | 25 | Aydınlatma alt skoruna +15 | Alt skor 100 |
| Akustik panel | 40 | Gürültü alt skoruna +15 | Alt skor 100 |
| Ergonomik çalışma tezgâhı | 80 | İlgili istasyonda yorgunluk yükü −0,10 | İstasyonda bir tane |
| Su sebili | 45 | Dinlenme olanakları alt skoruna +15 | Oda başına bir etkin sebil |
| Sanat/dekor paneli | 30 | Estetik alt skoruna +10 | İlk 3 tam, sonrası 0 |
| Yönlendirme tabelası | 25 | İlgili kuyrukta sabır +%5 | Toplam +%10 |
| Planlama panosu | 50 | Aktif yöneticiyle görev değiştirme süresi −%5 | İşletme başına bir etki |

Gerçek parayla alınan görünüm bu sayıları değiştiremez. Bir nesnenin kozmetik varyantı aynı işlevsel tanıma bağlıdır. Birbirinin içine dekor yığmak, duvar arkasına erişilemeyen koltuk koymak veya kopya nesne spam'i avantaj sağlamaz.

### 32.3 Oda etkisi hesaplama

`comfort = 0,30×seating + 0,20×lighting + 0,20×quietness + 0,15×amenities + 0,15×aesthetics`; her alt skor 0–100. Seating, beklenen eşzamanlı mola ihtiyacına göre erişilebilir slot oranıdır; yeterli slotta 100 olur. Çalışan sadece kullandığı dinlenme odasının skorunu alır.

Çalışma odasındaki ergonomi ve gürültü yorgunluk hızını, dinlenme odası konforu iyileşme hızını etkiler. Ortalama çalışma ortamı günlük memnuniyete en fazla −2/+2 katkı yapar. Dekor doğrudan üretim çıktısı veya müşteri sayısı yaratmaz. Müşteri alanında yalnız görünür konfor ve bekleme toleransı etkilenir.

Bir oda taşındığında erişim, güç, rezervasyon ve etkiler yeniden hesaplanır. Etki her karede tüm nesneler taranarak değil, yerleşim değişiklikleri sonrası önbellekle hesaplanır. Oda önizlemesi “+8 konfor, +1 mola koltuğu, +7 hücre yürüyüş” gibi gerçek değişimi gösterir.

## 33. Depo, lot takibi ve dışarıdan ürün satın alma

Önceki belgede depo ve tedarik vardı; burada bağımsız ve oynanabilir bir ticaret sistemi olarak tamamlanır. Oyuncu kendi ürettiğini, dışarıdan aldığı ürünü veya ikisinin karışımını satabilir. Satın alınan ürünün kalite ve kökeni görünürdür; kendi üretimi gibi etiketlenmez.

### 33.1 Depo kapasitesi ve bölgeler

Depo rafı 60 kredi, 1×2 hücre, 8 slot; her slot tek SKU ve aynı kalite kademesi için `stackSize` sınırını kullanır. İlk dilimde stackSize=10, raf en fazla 80 birim tutar. Farklı lotlar aynı fiziksel slotu paylaşabilir; miktar, gerçek kalite skoru, maliyet ve yaş bilgileri alt lot kayıtlarında ayrı korunur. Böylece sekiz tek ürünlük parti 80 birimlik rafı doldurmaz. Soğutucu raf 140 kredi, 6 slot, 1 E güç; mal kabul tamponu 12 slot. Tampon raf satışı veya üretim için kullanılmaz, kabulü tamamlanan ürün depoya transfer edilir.

Depo bölgeleri: ham madde, ara ürün, satılabilir ürün, soğuk ürün, mal kabul. Her bölge SKU/kategori filtresi, minimum-maksimum stok ve çıkış önceliği taşır. Oyuncu satışa ayrılan payı ve üretime ayrılan payı belirler; ayrılmış stok iki yerde sayılmaz.

Lot kaydı: `lotId, itemId, quantity, quality, source, receivedAt, ageSeconds, accumulatedAge, unitAcquisitionCost`. `source` kendi üretimi veya supplierId olur. Son kullanma, şartlar uygunsa kalan raf ömründen türetilir. Ürün tanımı raf ömrü içermezse bozulmaz.

### 33.2 Tedarikçi tipleri

| Tedarikçi | Ürün | Teslim süresi | Minimum parti | Fiyat ve risk |
|---|---|---|---:|---|
| Yerel kooperatif | Ambalaj, tohum, yerel gıda ve açık tarif girdileri | 0,25 gün | 5 | Normal toptan fiyat, sınırlı günlük kapasite |
| Bölgesel toptancı | Tier 1–4 kataloğunun açılmış satılabilir ürünleri | 0,75 gün | 10 | Hacim indirimi, taşıma bedeli |
| Mevsimlik kervan | Seçili tekstil ve dekor | 1 gün | 5 | Takvimi ve fiyatı önceden görünür |

İndirim başlangıcı: 10–19 birim %0, 20–39 %4, 40+ %7. Tedarikçi kotası ve depo kapasitesi sınırsız arbitrajı önler. Aynı siparişi bölerek indirim çoğaltılamaz. Dış ürünler bölüm kilitlerini atlatmaz; aynı ürünün normal açılma koşulu geçerlidir.

### 33.3 Sipariş yaşam döngüsü

Draft → Quoted → Confirmed → InTransit → Arrived → Inspecting → Accepted; alternatifler Cancelled, AwaitingSpace, Rejected, Refunded. Teklif fiyatı ve geçerlilik süresi açıkça yazılır. Confirmed anında kredi tek işlemle düşer, ürün mülkiyeti kabulde geçer. Ürünler yoldayken satış veya üretime kullanılamaz.

Onayda tahmini slotlar rezerve edilir. Rezerve raf satılamaz; sipariş başka geçerli kapasiteye aktarılabilir. İptal: yola çıkmadan tam iade, yola çıktıktan sonra ürün bedeli iadesi fakat önceden gösterilen taşıma gideri geri verilmez. Teslimatı platform ödeme sistemi değil oyun içi ledger yürütür.

Boş yer kalmazsa sevkiyat AwaitingSpace olur: mal kaybolmaz, NPC kamyonu yolda sonsuz kuyruk oluşturmaz. Oyuncu yer açar, başka bölge seçer veya açık maliyetli iade yapar. İlk sürümde bekleme/depolama cezası yoktur; yeni otomatik siparişler kapasite doluyken durur. Kabul öncesi soğuk zincir tedarikçi sorumluluğundadır.

Kabul sırasında miktar ve kalite teklifle karşılaştırılır. Temel sürümde rastgele eksik teslimat yoktur. İleride sözleşme uyuşmazlığı eklenirse açık olay olarak uygulanır; stok ve para sessizce eksiltilmez.

**A2 geçici teslim pedi:** A2'nin tek yerel kooperatif öğretimi için `R3-C2` açık hava pedinde siparişin `Arrived → Inspecting → Accepted/AwaitingSpace` adımları aynı Application komutu ve §33.3 ledger/lot kurallarıyla yürür. Ped ücretsizdir, **oda/depo değildir**, 12 slotluk mal kabul tamponu veya ilave stok kapasitesi vermez; ürün ancak önceden rezerve edilmiş geçerli depo/raf alanına kabul edilip fiziksel aktarım tamamlanınca kullanılabilir. Yer yoksa sipariş `AwaitingSpace` kalır ve pedde tek temsilî kasa görünür; ikinci kabul için bedava ikinci yer açılmaz. Ücretli 8×8 asgari mal kabul odası (200 kredi kabuk + teslim portu/kontrol masası) kurulduğunda §33.1'in 12 slot tamponu ve tam oda işlevi açılır. Pedden odaya geçiş aynı bekleyen sipariş/lot kimliğini korur; daha önce kabul edilmiş stok yeniden eklenmez.

### 33.4 Üret veya satın al kararı

Karşılaştırma paneli aynı kalitede iki seçeneği gösterir: yerel üretimin değişken maliyeti, makine/işgücü kapasite ihtiyacı, hazır olma süresi; dış alımın ürün + taşıma maliyeti, teslim süresi ve depo ihtiyacı. Sabit giderler karara ikinci kez eklenmez. Üretimin makine kapasitesini başka üründen alması fırsat maliyeti olarak ayrı gösterilir.

Üretim ile dış alım katkısı yeni su/gıda ürünlerinin gerçek lot, ambalaj ve nakliye maliyetiyle karşılaştırılır. İstasyon doluyken dış alım daha düşük marjla ihtiyacı karşılayabilir; eski küp rakamları kullanılmaz.

## 34. Depolayıp uygun zamanda satma ve ticaret stratejisi

### 34.1 Planlı stok tutma

Oyuncu festival öncesi içecek veya dekor alabilir, stokta tutabilir ve hedef tarihte raflara açabilir. Talep ve fiyat takvimi yalnız ilan edilmiş olaylar ve geçmiş veriyi gösterir; gelecek kesin fiyatı bildirilmez. Kâr garanti edilmez.

Satış politikaları: Hemen satış, tarih geldiğinde serbest bırak, hedef marj sağlanınca serbest bırak, minimum güvenlik stoğunu tut. Koşullar raf ikmaline izin verir; ürünü kendiliğinden satmaz. Satış için müşteri, açık raf ve kasa gerekir. Temel ihtiyaç stoğunu yanlışlıkla kilitleyen politika uyarılır.

```text
availableForSale = physicalStock - productionReserved - contractReserved - safetyStock
eligibleLot = releaseTimeReached AND expectedMargin >= minimumMargin
if nearingExpiry AND playerEnabledClearance:
    applyConfiguredClearancePriceFloor()
transferToShelf(min(eligibleQuantity, shelfFreeCapacity))
```

Marj koşulu kullanılmıyorsa kontrol atlanır. Son kullanma yaklaşınca otomatik indirim varsayılan kapalıdır; açıldığında fiyat tabanı ve zararına satış izni oyuncu tarafından seçilir.

### 34.2 Yeniden sipariş algoritması

`inventoryPosition = sellableOnHand + confirmedInbound − committedOutgoing`. SellableOnHand ham fiziksel miktardır, henüz rezervasyon düşülmemiştir; committedOutgoing yalnız bu stoktan karşılanacak üretim ve kontrat taahhütlerini içerir. Raf transferi stok konumu değiştirdiği için ayrıca talep sayılmaz.

```text
reorderPoint = forecastDailyDemand × leadTimeDays + safetyStock
target = forecastDailyDemand × (leadTimeDays + reviewPeriodDays) + safetyStock
if inventoryPosition < reorderPoint:
    qty = target - inventoryPosition
    qty = min(qty, supplierQuota, feasibleStorageQuantity, affordableQuantity)
    roundDownToSupplierPack(qty)
    if qty >= supplierMinimum AND cashAfterOrder >= operatingReserve:
        createIdempotentPurchaseOrder()
```

Tahmin son üç günün karşılanmış ve karşılanamamış talebini kullanır; yalnız satışa bakarak boş rafın talebi düşürdüğü sanılmaz. İlan edilen olay etkisi satış geçmişinden ayrıştırılarak bir kez uygulanır. Otomatik satın alma varsayılan kapalıdır; açıldığında günlük kredi bütçesi, tedarikçi ve SKU sınırı zorunludur. Minimum parti karşılanmıyorsa sipariş açılmaz; uyarı verilir.

### 34.3 Raf ömrü ve stok eritme

A2'de bozulma yoktur. A3'te isteğe bağlı raf ömrü açılır. Taze hasat, açık gıda ve paketli içecek için süreler yeni ürün verisiyle belirlenir; dokuma ürünleri bozulmaz. Raf ömrü üretim/kabul anında başlar; satın alma teklifinde teslimde kalan ömür belirtilir. Tanımsız raf ömrü sıfır varsayılamaz.

Soğukta biyolojik ve gıda ürünlerinin yaşlanması normalin %50'sidir. Ürünü depolar arasında taşımak yaşını sıfırlamaz. Elektrik yoksa yaşlanma normal hıza döner; geçmiş ömür bir anda kaybolmaz. İlk %10 kalan ömürde uyarı; sıfırda ürün satılamaz ve atık kaydı oluşturulur. Atığı kaldırmak oyuncu işi veya lojistik görevidir; ücretsiz kurtarma mekanizmasını engellemez.

FEFO: Önce son kullanması yakın olan lot çıkar; ömürsüz ürünlerde FIFO. Satışa çıkmış ürünün kalan ömrü görünürdür. İndirim, geri dönüşüm veya bağış seçenekleri sunulur; ilk sürümde geri dönüşüm sadece ürünü kaldırır, sonsuz kaynak döngüsü yaratmaz. Bağışın itibar ödülü günlük sınırlıdır; bozulmuş ürün bağışlanamaz.

### 34.4 Para ve stok muhasebesi

Bölüm 26'nın hareketli ağırlıklı ortalama değeri SKU seviyesinde rapor olarak korunur; satışların kesin maliyeti lot maliyetidir. Depoya alım nakit çıkışıdır; kâr/zararda ürün maliyeti satışta veya firede tanınır. Böylece aynı mal hem alımda hem satışta gider sayılmaz.

Örnek: 20 ürünü birim 7 + toplam 20 taşıma bedeliyle almak 160 kredi nakit çıkışı ve birim 8 lot maliyeti üretir. 12 ürünü 12'den satmak 144 gelir, 96 satılan mal maliyeti ve sabit gider öncesi 48 kâr yaratır. Kalan stok 8×8=64 kredidir; dönem nakit farkı −16'dır. Panel “kâr var ama nakit stokta bağlı” durumunu açıklar.

Raporlar: nakit akışı, gerçekleşmiş brüt kâr, stok değeri, elde bekleme günü, stokta yokluk, fire, depo doluluğu ve gelecek sipariş yükü. Satılmamış stok değer artışı gerçekleşmiş gelir sayılmaz.

## 35. Bütünleşik uygulama, kayıt ve doğrulama

### 35.1 Birlikte çalışan döngü

Festival haberi → talep tahmini → üret/satın al kararı → nakit ve depo rezervasyonu → sevkiyat kabulü → lot saklama → personel vardiya/mola planı → hedef tarihte raf ikmali → satış → lot maliyeti ve kâr raporu. Dinlenme odasının uzaklığı taşıma zamanını, depo düzeni görev yükünü, dekor çalışma koşullarını etkiler. Böylece sistemler ayrı mini oyunlar olarak kalmaz.

### 35.2 Mimari ve kayıt ekleri

Yeni sorumluluklar: StaffNeedsSystem, BreakScheduler, RoomEffectResolver, WarehouseService, ProcurementService, SalesPolicyService. WorkerTaskScheduler görev atar; BreakScheduler dinlenme uygunluğunu sağlar. Tek bir servis yorgunluk değerini yazar. InventoryService fiziksel miktarın tek kaynağıdır; WarehouseService ayrı stok kopyası tutmaz.

Kayda ekle: personel durumu/yorgunluğu/vardiyası; koltuk ve görev rezervasyon kimlikleri; oda tanımları; lot ve yaşlanma birikimi; sipariş ve teslim zamanı; satış politikaları; otomatik alım bütçesi; gün işlem kimlikleri. Yükleme sonrası oda skorları ve rotalar yeniden türetilir. Geçersiz rezervasyon güvenli biçimde bırakılır; ürün yalnız tanımlı gerçek konumunda kalır.

Eski kayıtta lot yoksa mevcut miktar için bir geçiş lotu oluştur; eski kayıt maliyetini kullan, bilinmiyorsa “tahmini” işaretle. Raf ömrü göç anında başlar; eski kayıt yükler yüklemez stok bozulmaz. Personel yorgunluğu yoksa 0; ücretin ödendiği gün bilinmiyorsa kullanıcıya borç yazmak yerine göç gününü tamamlanmış say.

### 35.3 Güncel aşama kapsamı

- A2: P0'ın su ve domates döngüsüne ilk işlenmiş gıda, kümes/mandıra, tek kuru depo rafı, tek yerel tedarikçi, manuel satın alma, lot maliyeti, iki koltuklu dinlenme köşesi ve temel yorgunluk eklenir. İlk tedarik öğretimi açık bedelli ambalaj veya tohum üzerindedir. Vardiya otomasyonu ve bozulma yoktur.
- A3: Tam oda etkileri, vardiyalar, soğuk depo, opsiyonel raf ömrü, otomatik sipariş ve satış politikaları; ekonomik olaylarla entegrasyon.
- A4: Tam tedarikçi ve oda kataloğu, personel anlatıları, festival ticareti ve final kontratları.
- A5: Kayıt göçleri, erişilebilirlik, yoğun stok/ajan performansı, ticaret istismarları ve ödeme ayrımı doğrulaması.

### 35.4 Kabul testleri

1. Dört dakika standart çalışan personel yaklaşık 60 yorgunluğa ulaşır; konfor 50 odada 60'tan 15'e 60 saniyede döner. Bekleme/yürüme süreleri ayrıca ölçülür.
2. Koltuk yokken personel sonsuz beklemez; zorunlu mola çalışır. Oda taşınırken dinlenen çalışan ve rezervasyonu güvenle yeniden yönlenir.
3. Aynı dekoru yüz kez yerleştirmek tanımlı etki sınırını aşmaz; ücretli görünüm aynı sonucu verir.
4. Vardiya değişimi ücreti atlatmaz; mola/izin/eğitim aynı personeli çakışan görevlere atamaz.
5. Aynı sipariş onayı iki kez gelirse kredi bir kez düşer; teslim tekrarı stok çoğaltmaz.
6. Dolu depo teslimatı kaybetmez; sipariş iptalinde iade ve kapasite rezervasyonu bir kez çözülür.
7. Festival için tutulan stok açılış tarihinden önce rafa gitmez; açılınca müşteri olmadan otomatik gelir yazılmaz.
8. Soğuk depo değişimi ürün yaşını sıfırlamaz; oyun kapalıyken yaşlanma ve yorgunluk ilerlemez.
9. Otomatik sipariş nakit tamponunu, günlük bütçeyi ve gerçek slot kapasitesini aşmaz; raf transferini ek talep saymaz.
10. 160 kredi alım/144 kredi satış örneğinde nakit −16, brüt kâr 48 ve kalan stok 64 çıkar.
11. Üretim, dinlenme, sevkiyat ve olay aynı anda sürerken kaydet/yükle sonrasında stok ve ledger mutabık kalır.

## 36. Eksikler ve geliştirme önerileri raporu

Bu rapor tasarım incelemesidir; uygulama veya oyun testi bulgusu değildir. Belge kapsamlıdır fakat henüz oynanabilir oyunda doğrulanmış mekanik bulunmamaktadır. “P0” geliştirmeden önce/ilk dilimde, “P1” ana oyun tamamlanmadan, “P2” çekirdek doğrulandıktan sonra ele alınır.

Sürüm 1.3 durum notu: Bu rapordaki ekonomi tablosu, fiyat tepkileri, ürün ikamesi, bakım, final hedefleri, kontrat dengesi ve işletme haritası eksikleri bölüm 37–43 ile tasarım düzeyinde karşılanmıştır. Uygulama, 30 günlük simülasyon ve dış oyuncu testleri hâlâ beklemektedir. Aşağıdaki P0/P1/P2 etiketleri eski **risk önceliğidir**, §58.1 geliştirme fazı değildir; somut teslimin fazı son sütunda belirtilir. Güncel kabul planı bölüm 44'tür.

| Risk önceliği | Eksik veya risk | Öneri / somut teslim | Doğrulama ve faz |
|---|---|---|---|
| P0 | Sistem sayısı ilk deneyimi ağırlaştırabilir | P0 ilk 3–8 dakikada taşıma, su/domates üretimi, raf ve satışla başlar; mola ve dış alım öğretimi A2'ye kalır | Dış oyuncu yardımsız ilk döngüyü bitirir; P0 |
| P0 | Ham madde fiyatları ve talep bütçeleri tam tanımlı değil | P0 §26 açılış lotları/sabit fiyat; A2'de kaynak alış fiyatı, üç müşteri bütçesi ve günlük hacimle denge tablosu | Gerçek lot maliyeti ve katkı A2'de hesaplanır |
| P0 | Kredi kazanma, günlük ücret ve 900 sn gün ölçeği birlikte test edilmedi | P0 ilk satış/para korunumu; A2'de en az 30 günlük sabit seed ekonomi simülasyonu | Üretim ve dış alım işletmesi A2'de ölçülür |
| P0 | Çok sayıda rezervasyon stok kilitleyebilir | P0 birleşik rezervasyon defteri ve görev kiraları; mola/oda taşıma A2+ sınamasına eklenir | P0 transfer/iptal/kayıt, A2+ mola/oda geçişinde sızıntı yok |
| P0 | Kâr ve nakit kolay karışabilir | P0 ledger doğru kalsın; A2 lot maliyeti, nakit akışı ve gelir tablosu ayrı sunulsun | Bölüm 34 örneği A2'de otomatik testten geçer |
| P1 | Müşteri fiyat esnekliği sadece soyut | Üç profil için bütçe, ikame ürün ve kalite tercih eğrisi tanımla | En pahalı fiyat her koşulda en iyi strateji olmaz |
| P1 | Üretim mi dış alım mı seçimi tek doğruya dönüşebilir | Tarif kapasitesi, tedarik kotası ve kontratları birlikte dengele | İki işletme modeli de en az bir bölümde güçlü olur |
| P1 | Bakım atölyesinin işi yeterince ayrıntılı değil | Makine çalışma saati, önleyici bakım ve açık arıza eşiği ekle | Bakım ihmalinde açıklanabilir duruş, stok kaybı yok |
| P1 | Yangın/temizlik gibi ek ihtiyaçlar angarya yaratabilir | Önce temizlik yalnız ortam skoru; ayrı temizlik mesleğini test sonucuna bırak | Yeni iş anlamlı karar yaratıyor mu ölç |
| P1 | Final hedeflerinin kesin miktarları yok | Üç final için ürün listesi, kapasite hedefi ve alternatif teslim tarifleri | Hiçbir seçim geri dönüşsüz final kilidi yaratmaz |
| P1 | İşletme büyürken oyuncunun fiziksel rolü belirsiz | Orta oyunda kontrat, kalite ve alan planlama görevleri ekle | Otomasyon sonrası oyuncunun anlamlı kararları sürer |
| P1 | Oda ve dekor maliyetlerinin geri dönüşü bilinmiyor | Yürüyüş, mola ve üretim kazancını açıklayan karşılaştırmalı rapor | Dekor zorunlu vergi veya sınırsız güç kaynağı olmaz |
| P1 | Birden çok panel öğrenme yükünü artırır | Tek işletme özeti, açıklamalı durum ikonları ve kademeli panel açılması | Oyuncu zararının sebebini 30 sn içinde bulur |
| P2 | Ürünler yalnız tarif/fiyat farkıyla kalabilir | Aynı ailede marka, ambalaj ve müşteri segmenti seçimi | Görsel fark ve gerçek tercih ödünleşimi oluşur |
| P2 | Personel ilişkileri sayısal kalabilir | Uyumlu mentor çiftleri ve kısa ortak görevler | Tek zorunlu “en iyi takım” oluşmaz |
| P2 | Uzun oyun için bölgesel çeşit sınırlı | Ana oyun sonrası ikinci mahalle senaryosu | Yeni içerik aynı grind'ı tekrar etmez |
| P2 | Son oyun hedefleri sınırsız para biriktirmeye dönebilir | İsteğe bağlı hizmet kalitesi, sıfır fire ve verimli düzen mücadeleleri | Farklı uzmanlıklar farklı hedeflerde parlar |

### 36.1 Eklenmesi en değerli üç mekanik

1. **Ürün ikamesi:** Müşteri aradığı içeceği bulamayınca bütçesine uygun başka içecek alabilir; raf çeşitliliği ve stok yönetimi değer kazanır. P1 müşteri modeli içinde uygulanmalı.
2. **Toplu sipariş ve perakende dengesi:** Güvenilir düşük marjlı kontrat ile daha yüksek marjlı belirsiz raf satışı arasında karar. Üretim/depo rezervasyon sistemini kullanmalı; yeni para birimi gerektirmemeli.
3. **Operasyon inceleme modu:** Yürüyüş yoğunluğu, boş raf, yorgun personel, dolu tampon ve bağlı nakdi tek haritada gösteren filtreler. Sorunu yalnız cezalandırmak yerine oyuncunun çözmesini sağlar.

### 36.2 Şimdilik eklenmemesi önerilenler

Çok oyunculu, açık dünya, gerçek zamanlı çevrimdışı kayıp, gelişmiş sıvı fiziği, hisse senedi piyasası ve onlarca ek ihtiyaç çubuğu ilk sürüm hedefini büyütür. Çekirdek market–üretim–personel–depo döngüsü test edilmeden bu alanlara girilmemelidir. Yeni mekanik ekleme ölçütü: Mevcut kararı derinleştirmesi, açık geri bildirim vermesi ve oyuncunun iş yüküne değmesi.

## 37. Yerel ürün ekonomisini yeniden dengeleme

Eski buz, yosun, besin küpü ve ileri teknoloji SKU maliyet tablosu yeni §26 ile geçersizdir. [Yerel ürün ağacındaki](OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md) fiyat ve maliyet sütunları yalnız hipotezdir. Önce ham su debisi, ambalaj maliyeti, tarla verimi, makine sarfı ve tedarik bedeli tamamlanır. Sonra her tarifi lot bazında yeniden hesaplayan doğrulayıcı fiyat, katkı, darboğaz ve kurtarma raporu üretir. Bu hesap çalışmadan eski 4 kredi küp maliyeti veya eski günlük kâr senaryoları hedef alınmaz.

## 38. Müşteri fiyat tepkisi ve bütçe modeli

### 38.1 Profiller

| Profil | Geliş payı | Ziyaret bütçesi | Fiyat duyarlılığı ε | Kalite değer katsayısı α | Kuyruk sabrı |
|---|---:|---:|---:|---:|---:|
| Yerleşim çalışanı | %50 | 20–45 | 6 | 0,50 | 40 sn |
| Araştırmacı | %25 | 40–90 | 4 | 1,00 | 55 sn |
| Kurye/gezgin | %25 | 25–65 | 5 | 0,70 | 30 sn |

Bütçe ziyaret başında seed ile aralıktan seçilir. Bölüm 1 aralıkları ×0,75; bölüm 2 ×0,90; diğerleri ×1. Bütçe raf fiyatına göre artmaz. Her başarılı seçim kalan bütçeden düşer; bütçeyi aşan ürün aday değildir.

### 38.2 Kabul denklemi

Kalite primi Standart 0, Nitelikli 0,15, Özel 0,30. Algılanan adil fiyat `fairPrice=baseRetail×(1+α×qualityPremium)`; fiyat oranı `r=shelfPrice/fairPrice`. Kabul olasılığı `P=1/(1+exp(-(2−ε×(r−1))))`.

| Fiyat/adil fiyat | Çalışan | Araştırmacı | Kurye |
|---|---:|---:|---:|
| 0,80 | %96,1 | %94,3 | %95,3 |
| 1,00 | %88,1 | %88,1 | %88,1 |
| 1,20 | %69,0 | %76,9 | %73,1 |
| 1,50 | %26,9 | %50,0 | %37,8 |
| 2,00 | %1,8 | %11,9 | %4,7 |

Oranlar stok ve bütçe filtresini geçen tek ihtiyacın olasılığıdır; bütün mağazanın dönüşüm oranı değildir. Her ihtiyaç için bir kabul eşiği çekilir; ikamelerde aynı eşik kullanılır. Reddedilen aynı ürünü tekrar tekrar sunmak şansı artırmaz.

Fiyat alanı 0,01–3×kalite uyarlanmış referans aralığındadır. Maliyet altı satışa izin vardır fakat zarar uyarısı gösterilir. Sepete alınan fiyat kilitlenir; oyuncu sonradan fiyat artırınca mevcut sepet pahalanmaz. Sepet rezervasyonu iptal edilirse ürün geri stoklama görevine döner.

### 38.3 Etkilerin iki kez sayılmasını engelleme

İtibar ziyaret hızına en fazla ±%10 etki eder; kabul denklemine tekrar girmez. Olayın küresel geliş etkisi spawn'a, kategori etkisi normalize ihtiyaç ağırlıklarına uygulanır. Bölüm 29'daki soyut priceResponse artık müşteri kabul denklemiyle gerçekleştirilir, ikinci talep çarpanı değildir.

Kayıp satış sebepleri ayrı tutulur: stok yok, bütçe yetmedi, fiyat reddedildi, uygun ikame yok, kuyrukta vazgeçildi. Pahalı fiyat tek başına kalıcı itibar cezası vermez; düşük hacim-yüksek marj stratejisi mümkündür. Ürün fiyatını oynatmanın etkisi panelde tahmin aralığıyla gösterilir, kesin satış sözü verilmez.

### 38.4 Fiyat etiketi ve serbest esnaf fiyatı (A3)

Oyuncu raf üstündeki küçük tabelaya dokunarak DOM fiyat panelini açar. Panel seçili SKU, mevcut fiyat, referans/adil fiyat, varsa birim maliyet ve beklenen talep etkisini gösterir. Piyasa, İndirimli/Sürüm ve Pahalı/Kazık seçenekleri kaliteye uyarlanmış referans fiyatın sırasıyla **1,00× / 0,80× / 1,50×** katını seçer. Bunlar Orbit'in A3 başlangıç denge hipotezleridir, benzer oyunlardan alınmış sayılar veya doğrulanmış denge değildir. Oyuncu §38.2 aralığında ayrıca fiyat girebilir; mevcut kabul denklemi korunur. Değişiklik yalnız sonraki müşteri seçimlerini etkiler; sepete alınan fiyat kilitli kalır. Geçersiz değer veya değişmiş raf durumu onayda reddedilir.

Piyasa fiyatı mevcut akışı korur. İndirimli/Sürüm fiyatında, aynı taban ziyaret ve kapasite koşullarında ilgili rafın **ortalama kuyruk uzunluğu hedefi +%50**'dir; her anda tam %50 artış garantisi değildir. Mevcut bütçe/kabul denklemi ve ziyaret sınırları geçerlidir; ek spawn veya ikinci kabul zarı uygulanmaz. Hedef gerçekleşmezse fiili kuyruk ve kayıp satış görünür. Pahalı/Kazık fiyatı §38.2 testinde reddedilen müşteriyi rafta baş sallama ve “Bu salça çok pahalı komşu!” sözüyle çıkışa yönlendirir; metin SKU'ya uyarlanır. Stok/para değişmez, pahalı fiyat tek başına itibar cezası vermez. Az hareket ve sessiz ayarlarda neden metinle görünür.

### 38.5 Raf ürünü kilidi ve mahalle aşırma olayı (A3)

Raf tek SKU'ya kilitlenebilir: “Bu raf sadece 0,5 L Su içindir”. Oyuncu ve görevli transferi aynı filtreden geçer; uyumsuz lot hedefe bırakılamaz. Dolu rafın kilidi mevcut ürünle uyumsuz kimliğe sessizce çevrilmez; önce güvenli boşaltma istenir. Kilidi kaldırmak stok/rezervasyon silmez. Etiket gerçek atanmış SKU'yu gösterir.

Seed'li ve sınırlı aşırma olayında şüpheli müşteri uygun satılabilir üründen **rezerve edilmemiş** bir lotu alıp kapıya gider. A3 başlangıç hedefi katalogdaki `item.aged_cheese` peyniridir. Akü, içerik kataloğunda SKU kimliği ve üretim/tedarik yolu tanımlanana kadar uygun hedef değildir. Olaylar açık ve uygun stok mevcutsa her oyun gününde seed ile **%20 olay olasılığı** değerlendirilir; günde en çok bir olay başlar. Ürün alındıktan kapıdan çıkışa kadar **en az 12 aktif saniye** yakalama fırsatı tanınır; rota daha kısaysa çıkış bu süre dolana kadar bekler. Raf adedi azalması ve şüphelinin taşıdığı lot tek kalıcı işlemle kaydedilir. Oyuncu veya erişebilen bakkal çırağı şüpheliye dokunup kapıdan önce yakalarsa “Hop hemşerim nereye!” geri bildirimiyle aynı lot raf/depo kapasitesine iade edilir. Yer yoksa lot yakalayanda veya güvenli bekleme konumunda kalır; çoğalmaz. Kapıdan çıkış kayıp stoktur, satış/ciro değildir. Yakalanamayan olay temel üretim yolunu kalıcı kilitlemez. Olay kapalıysa doğmaz. Olasılık ve süre A3 başlangıç denge hipotezleridir; oyuncu testinde ayarlanır.

### 38.6 Mahalle veresiyesi ve banka kredisi (A3)

Yerleşim Kooperatifi sandığı ve Ticaret Konsorsiyumu bankası yalnız **oyun içi kredi** verir; gerçek para, reklam veya mağaza harcamasıyla bağlantılı değildir. A3 erişimi açıldığında iki teklif de görünür: Kooperatif **100 kredi anapara, sıfır faiz/ücret, toplam 100 kredi**; Konsorsiyum **300 kredi anapara, bir defalık %5 (15 kredi) ücret, toplam 315 kredi** geri ödeme. Sabit gün vadesi, gecikme cezası ve işleyen faiz yoktur. Aynı anda en çok **bir etkin borç** bulunur; sonraki çekim ancak bakiye sıfırlandıktan sonra açılır. Teklif anaparayı, toplam geri ödemeyi, ücreti, etkin bakiyeyi ve beklenen kesintiyi onaydan önce gösterir. Çekim anaparası ile yükümlülük tek transaction'da kaydedilir. Tutar ve ücretler A3 başlangıç denge hipotezidir; gerçek oynanış ölçümüyle ayarlanır.

Her oyun günü sonunda, o gün tahsil edilen **brüt satış cirosunun %10'u**, kalan borç ve eldeki nakitten küçük olan tutar kadar kesilir. Satış yoksa kesinti sıfırdır; gün sonu aynı kimlikle ikinci kez çalışınca ikinci ödeme oluşmaz. Borç çekimi, yardım, iade, kontrat geliri ve aşırma kaybı satış cirosu değildir. Kesinti negatif bakiye, gizli gecikme cezası veya bileşik borç yaratmaz. Gün sonu raporu brüt ciro, kesinti ve kalan borcu ayrı gösterir. Borç §48.4 ücretsiz yardım ve elle çalışma yolunu kapatmaz.

## 39. Ürün ikamesi ve ihtiyaçların karşılanması

Ürünler needTags ve substitutionGroup içerir. Aynı ailede olmak tek başına ikame hakkı vermez. İlk A2 ikamesi, müşterinin ihtiyacı ve ürünün fiziksel boyutu uygunsa küçük su ile 5 L su arasında açık oranla tanımlanır; 19 L damacana otomatik küçük su ikamesi değildir. İkame oranı, bütçe etkisi ve SKU erişimi katalogda tanımlanmadan devreye alınmaz.

İlk ürün yoksa veya reddedilmişse uygun alternatif aynı önceden çekilmiş kabul eşiğiyle değerlendirilir; yeni bağımsız şans yaratılmaz. En fazla iki alternatif gösterilir. Bir alternatif alınca ilk ihtiyaç kapanır; aynı ihtiyaç ikinci satış oluşturmaz. Kontrat ikamesi kendi sözleşmesinden gelir; bu sürümde final teslimi ikamesizdir.

## 40. Bakım, aşınma ve planlı duruş

### 40.1 Aşınma

Makine aşınması W=0–100. Yalnız Running durumunda artar; yeni istasyonların aktif dakika başına aşınma değerleri içerik verisinde belirlenir. Duraklama, elektrik kesintisi, çıktı bekleme ve çevrimdışı süre artış yaratmaz. Taşıma, görünüm veya yükseltme mevcut aşınmayı sıfırlamaz.

| Aşınma | Durum | Etki |
|---|---|---|
| 0–59 | Sağlıklı | Normal çalışma |
| 60–79 | Bakım yaklaşıyor | Kalan aktif dakika tahmini |
| 80–99 | Bakım gerekli | Yeni partilerin süresi +%10 |
| 100 | Güvenli duruş | Mevcut parti biter; yeni parti başlamaz |

Rastgele patlama, kalıcı makine kaybı veya girdi silinmesi yoktur. Başlamış partinin süresi sonradan değişmez. W=100 mevcut parti toleransı bir kereliktir; kuyruğa yeni iş eklemek duruşu atlatmaz.

### 40.2 Servis yöntemleri

| İş | Süre | Bedel | Sonuç |
|---|---:|---:|---|
| Planlı servis | 30 sn | 8 kredi | W=10 |
| Duruştan onarım | 60 sn | 14 kredi | W=20 |
| Acil elle toparlama | 90 sn oyuncu emeği | 0 | W=70; yalnız durmuş makinede |

Bedel soyut servis sarfıdır; satılabilir Bakım seti veya Enerji bakım kiti değildir. Böylece bozuk makineyi onarmak için aynı makinede malzeme üretme kilidi oluşmaz. Elle toparlama parasız oyuncuya çıkış verir; oyuncu zamanı ve kısa bakım aralığı maliyetini taşır.

Teknisyen becerisi süreyi en fazla %20 azaltır, malzeme maliyetini azaltmaz. Atölye teknisyen planlamasını açar; oyuncu önceden elle servis yapabilir. İlk oyun günü makineler görünür eğitim korumasıyla aşınmaz.

### 40.3 Planlayıcı ve muhasebe

W≥60 ve önümüzdeki 120 sn talep mevcut stokla karşılanıyorsa bakım önerilir. Aynı ürünün bütün makineleri otomatik olarak birlikte servise alınmaz. Servis komutu makineyi ve teknisyeni rezerve eder; maliyet fiili başlangıçta bir kez ödenir. Başlamadan iptal serbesttir; başladıktan sonra kesilirse ilerleme korunur ve tekrar ödeme alınmaz.

Makine satışı servis rezervasyonunu bırakır. İkinci el bedeli `basePrice×0,5×(1−0,5×W/100)`; başlangıç ücretsiz makineleri nakit üretmesin diye satışa kapalı, depoya kaldırılabilir olur. Ücretli yükseltmenin iade payı ayrıca %50 üst sınırını geçmez. Sat-al döngüsü servis maliyetinden ucuz bir yenileme yolu oluşturmamalı; test edilir.

Bakım nakit gideri günlük raporda ayrıdır. Üretim katkı tablosuna dağıtılan tahmini bakım payı açıklama içindir, ikinci gider değildir. Aşınma aktif süreye bağlı olduğundan boş makine günlük bakım vergisi üretmez.

## 41. Toplu sipariş ve perakende dengesi

### 41.1 Kontrat şartları

Kontrat: alıcı, SKU/alternatif, kalite tabanı, miktar, birim fiyat, teslim süresi, kısmi teslim ve iptal koşulu. Normal fiyat `baseRetail×qualityFactor×0,82`; teklif anında sabitlenir. Oyuncunun raf fiyatı ve sonradan yaşanan olay teklifi değiştirmez. Kontrat için kaliteFactor 1/1,15/1,30'dur.

Bölüm 2: 10–20 birim/2 gün; bölüm 3: 30–60 birim/3 gün; bölüm 4: 60–100 birim/4 gün. Aynı anda iki kontrat; aynı SKU'nun toplam kontrat adedi son üç günün ortalama günlük perakende ihtiyacının iki katını aşmaz. Veri yoksa bölüm talep tahmini kullanılır. Günlük teklif listesi seed ile kaydedilir; reddetmek veya yüklemek yeni sınırsız teklif üretmez.

Avans/depozito ilk sürümde yoktur. Kabul edilen ürün miktarı kadar ödeme yapılır; birer birim kısmi teslim mümkündür. Süre yalnız simülasyonla akar. Zaman aşımı teslim edilmemiş bölümü kapatır ve ilgili toplulukta en fazla −3 itibar verir; borç veya geçmiş teslimi geri alma yoktur. Süre dolmadan bir defa +1 gün uzatma, kalan bölüm fiyatında %5 indirimle alınabilir. Koşullar kabulden önce görünür.

### 41.2 Fırsat maliyeti

Yeni ürün ağacında kontrat/perakende karşılaştırması gerçek lot maliyeti, ambalaj/sarf, makine zamanı ve beklenen raf talebiyle hesaplanır. Eski küp örneği geçerli değildir. Karar paneli serbest stok, girdi nakdi, darboğaz süresi ve vazgeçilebilecek perakende katkısını gösterir. Aynı makine iki projeye tam kapasite yazılamaz; tahmin hata aralığı içerir.

### 41.3 Tahsis ve rezervasyon

Varsayılan sıra: müşteri sepeti → teslimine bir günden az kalan kontrat → bir günlük temel ihtiyaç güvenlik stoğu → diğer raf hedefleri → uzun vadeli işler. Önerilen kapasite dağılımı %70 perakende/%30 kontrat, fakat zorunlu değildir. Oyuncu tamamen kontrat işletmesi kurabilir; final hizmet sınavı koşullarını ayrıca karşılamalıdır.

Fiziksel stok rezervasyonu mevcut miktarı aşamaz; gelecek üretim taahhüdü ayrı tutulur. Final stoğu kullanıcı açıkça ayırmadıkça otomatik çekilmez. Teslim komutu lotları ve kalan sözleşme adedini atomik azaltır, tek işlem kimliğiyle ödeme yazar. Uzatma, kısmi teslim ve rezervasyon kayıtla korunur.

## 42. Üç finalin yerel ürün ağacına uyarlanması

Kooperatif, yerel araştırma ve bölgesel ticaret yolları; dört kısmi sevkiyat dalgası, stok rezervasyonu, tekil yatırım ve hizmet sınavı yapısını korur. Eski teknoloji ürünü teslim listeleri geçersizdir. Yeni hedefler yalnız §26 kataloğunda erişilebilir ürünlerden seçilir:

| Proje | Dört dalganın toplam teslimi | Her dalganın satırları | Tekil yatırım |
|---|---|---|---:|
| Kooperatif merkezi | 40 küçük su + 20 adet 5 L su + 40 domates + 20 köy somunu | 10 + 5 + 10 + 5 | 300 kredi |
| Yerel araştırma merkezi | 20 damacana + 20 zeytinyağı + 20 tütsülenmiş alabalık + 20 balmumlu branda | Her birinden 5 | 400 kredi |
| Bölgesel ticaret merkezi | 40 üzüm pekmezi + 20 pastırma + 20 yün şal + 20 kahvaltı tepsisi | 10 + 5 + 5 + 5 | 600 kredi |

Her hedef SKU katalogdaki tam kimliğiyle kaydedilir. Standart kalite yeterlidir; üretim veya açık bedelli dış alım kabul edilir. Hazırlığın süre sınırı yoktur; kısmi teslim tek lotu iki kez kullanmaz ve başarısız hizmet sınavı teslimi silmez. Bu adet ve yatırımlar denge hipotezidir, oyuncu testi başarısı değildir. İlk prototipin 3–8 dakikalık döngüsüyle final sevkiyat süresi karıştırılmaz.

İtibar kurtarması: İtibarı 40 altında kalan her topluluk için günde bir kez 10 küçük su veya 5 taze domates teslimi, lotun belgeli maliyetini geri öder ve +2 itibar verir; kâr üretmez. Perakende ikamesi final teslimine uygulanmaz; bu üç projenin teslim satırlarında ikame yoktur. Böylece aynı lotun iki hedefe sayılması veya su boyutlarının bedelsiz dönüşümü engellenir.

## 43. Darboğazları gösteren işletme haritası

### 43.1 Operasyon katmanları

Dünya üstü görünüm; renk yanında ikon, desen, sayı ve açıklama. Telefonlarda tek ana katman ve alt detay kartı; tabletlerde isteğe bağlı ikinci karşılaştırma katmanı. Dokunarak seçilir, hover gerekmez. Son 5 simülasyon dakikası ve son tam gün pencereleri sunulur.

| Katman | Ölçüm | İlk uyarı eşiği | Müdahale |
|---|---|---|---|
| Raf | İstek varken boş geçen süre oranı | >%15 | İkmal, üretim, dış alım |
| Üretim | Running/InputWait/OutputBlocked/NoPower zaman payı | Bir bekleme türü >%20 | Nedene bağlı çözüm |
| Rota | Hücre geçişleri ve trafik bekleme süresi | >30 sn/5 dk | Koridoru veya depoyu değiştir |
| Personel | Yorgunluk, mola yolculuğu, görev bekleme | F≥80 veya mola yolu >20 sn | Mola yeri/atama |
| Depo | Kullanılan+rezerve slot / toplam | >%85 | Sipariş azalt, yer aç |
| Kasa | Medyan, p90 bekleme ve terk sayısı | p90>40 sn | Kasiyer/kasa kapasitesi |
| Nakit | Lot maliyeti ve stok yaşı | 3 gün satılmayan yüksek değer | Satış aç, alımı azalt |
| Bakım | W ve kalan aktif süre | W≥60 | Planlı servis |

Slot metriğinde fiziksel kullanılan slotla aynı slotun rezervasyonu iki kez sayılmaz; dolu ve boş-rezerve slotların birleşimi alınır. Eşikler teşhis içindir, ceza tetiklemez. Veri azsa “yetersiz örnek” gösterilir. Pause sırasında pencere ilerlemez.

### 43.2 Kök neden ve öneri

Örnek: içecek rafı boş → şişeleyici OutputBlocked %42 → depo dolu → satışı kapalı dekor 240 kredi bağlı. İlk öneri stok serbest bırakma/depo boşaltma olmalıdır, yeni şişeleyici değil.

Her teşhis kanıt, ölçüm penceresi, etkilenen nesne, olası müdahale, maliyet, tahmini etki ve güven seviyesi taşır. Birbirine bağlı makinelerde aynı kök neden tek alarm olur. En fazla üç öncelikli öneri: güvenli duruş → karşılanamayan gerçek talep → takılı rezervasyon → bağlı sermaye → verim. Talep yokken Idle makine hata sayılmaz.

Kanıt grafiği gerçek bekleme nedenlerinden kurulur, yalnız korelasyondan kesin neden çıkarılmaz. Öneri güveni düşükse “kontrol et” şeklindedir. Harita otomatik alım yapmaz veya personel çıkarmaz. Yerleşim değişikliği önizlemesi maliyet, çakışma ve tahmini yol farkını gösterir.

### 43.3 Ölçüm maliyeti

Olay tabanlı sayaç ve saniyelik örnekleme; son beş dakika halka tampon. Hücre düzeyinde ayrıntılı rota kaydı yalnız operasyon görünümü açıkken tutulur. Her kare tüm stok/ajan taraması yoktur. Günlük özet kaydedilir; geçici detay yüklemeden sonra yeniden birikir ve bu açıklanır.

Önce/sonra eşit uzunluklu pencereler karşılaştırılır. Talep, olay veya fiyat değişmişse etki karşılaştırmasının güveni düşürülür. Oyuncuya yanlış nedensellik sunulmaz.

## 44. Uygulama ve doğrulama planı — sürüm 1.3

A2: Maliyet kataloğu, üç profil, temel fiyat kabulü, bir ikame grubu ve boş raf/üretim katmanı. A3: Bakım, kontratlar, tahsis ve ayrıntılı teşhis. A4: Tüm katalog ve üç final. A5: Kayıt göçü, yoğun yük ve ekonomik istismar denetimi. Gerçek para sistemi bu simülasyon verilerini fiyat baskısı için kullanamaz.

Veri tipleri: EconomyBalanceDefinition, CustomerNeedDefinition, SubstitutionRule, MaintenanceState, ContractDefinition, FinalProjectDefinition, DiagnosticEvidence. Müşteri, olay ve tedarik ayrı kaydedilmiş RNG akışları kullanır; UI açmak RNG ilerletmez. Final ilerlemesi satır ve dalga kimliğiyle; bakım ilerlemesi makine GUID'iyle kaydedilir.

### 44.1 Hedefli kabul kontrolleri

1. Tier 1–4 tariflerinde eksik kaynak, negatif miktar, döngü, istasyonsuz işlem ve ücretsiz ambalaj yoktur. Eski 31 tarif/24 ürün maliyet testi geçersizdir.
2. Aynı ham su lotu şişeleme ve sulamada iki kez kullanılamaz; debi yükseltmesi geçmiş zamanı doldurmaz.
3. Küçük/5 L/19 L su girdi oranları 1/4/12'dir; litre karşılığı ayrıca tanımlanır.
4. Aynı SKU'yu çok rafa koymak yeni kabul denemesi sağlamaz; sepet bütçesi aşılmaz.
5. Servis ortasında kayıt tekrar gider yaratmaz; acil toparlama stok çoğaltmaz.
6. Kontrat ve final teslimi idempotenttir; başarısız hizmet sınavı teslimleri silmez.
7. OutputBlocked/depo dolu durumda teşhis yanlış makine alımı önermez.

### 44.2 Denge deney matrisi ve kalan belirsizlik

30 oyun günü × en az 10 seed × dört işletme politikası: üretim, dış alım, karma, kontrat ağırlıklı. Normal, durgunluk ve mineral kıtlığı senaryoları; 0,8/1,0/1,2/1,5 referans fiyatları. Personel molası ve bakım açık kalır.

Ölçümler: net sonuç, en düşük nakit, karşılanan talep, aile payları, stokta bağlı kredi, bekleme nedenleri, toparlanma süresi ve final hazırlık günü. Tek politika her koşulda baskınsa fiyatla örtmek yerine kapasite, talep ve tedarik farkları yeniden incelenir. Üç finalin toplam emek/maliyetinin benzer bantta olması hedeflenir; tam eşitlik değil farklı uzmanlık gereksinimi amaçlanır.

Bu sürümde yalnız tarif maliyetleri, örnek fiyat olasılıkları ve belge yapısı hesapla kontrol edilmiştir. Oyun simülasyonu, bakım entegrasyonu, 10.000 müşteri deneyi ve oynanabilir final testleri henüz çalıştırılmamıştır. Ekonomi tablosu artık tanımlıdır; asıl kalan iş uygulama ve gerçek oyuncu doğrulamasıdır.

## 45. Oyun tasarımı değerlendirmesi ve sistemlerin ortak amacı

### 45.1 Tasarım kararı

Oyunun asıl kimliği **oyuncunun içinde çalıştığı bir üretici-market işletmesi**dir. Üretim, ticaret, personel ve RPG bu kimliğin farklı çözüm yollarıdır. Hiçbiri ayrı bir zorunlu mini oyun hâline gelmemelidir. Tasarımın güçlü yanı fiziksel işten stratejik yönetime geçiş; başlıca riski ise çok sayıda göstergenin oyuncuya birbirinden kopuk iş listeleri vermesidir.

Her mekanik şu zincire bağlanır: görünür müşteri/yerleşim ihtiyacı → oyuncunun tercihi → fiziksel veya ekonomik sonuç → anlaşılır geri bildirim → yeni seçenek. Sadece süre uzatan, yeni karar yaratmayan gereksinim kapsamdan çıkarılır.

| Sistem | Aldığı girdi | Ürettiği sonuç | Bağlandığı diğer sistem |
|---|---|---|---|
| Müşteri ihtiyacı | Profil, bütçe, aile talebi | Karşılanan/kayıp ihtiyaç | Raf, fiyat, ikame, tedarik tahmini |
| Üretim | Kaynak, güç, makine süresi | Lot, kalite, maliyet, aşınma | Depo, personel, satış ve bakım |
| Dış alım | Kredi, kapasite, teslim süresi | Alternatif ürün stoğu | Üretim açığını kapatma, kontrat |
| Personel | İş kuyruğu, ücret, mola, eğitim | İşin devralınması | Oyuncuya planlama zamanı |
| Odalar/dekor | Alan ve kredi | Yol, kapasite, konfor | Personel ve üretim hizmet süresi |
| RPG | Yeni deneyim ve uzmanlık seçimi | Alternatif çözüm eylemleri | Ticaret, üretim ve takım yönetimi |
| İtibar | Kontrat, topluluk görevi, hikâye kararı | İlişki ve proje erişimi | Final seçimi ve diyalog |
| Olay | Ön haber ve açık ekonomik değişim | Geçici plan değişikliği | Stok, vardiya ve ürün karması |
| İşletme haritası | Gerçek işlem ölçümleri | Kanıtlı sorun/çözüm önerisi | Bir sonraki oyuncu kararı |
| Final | İşletme birikimi ve tercih | Mahallede görünür değişim | Serbest oyun ve başarı hedefi |

### 45.2 Oyuncunun rolü ve oturum ritmi

Başlangıçta oyuncu taşır ve satar; bölüm 2'de bir işi personele devreder; bölüm 3'te en az iki farklı iş devredildiğinde artık hat kurma, kalite, sipariş ve yerleşim seçer. İleride elle çalışma zorunlu tekrar değil, kriz anında destek veya seçilmiş oyun tarzıdır. Elle kasa işletmek otomatik kasadan gizli daha fazla gelir sağlamaz.

Bir oyun günü 900 aktif simülasyon saniyesi olarak korunur fakat tek oturumda bitirme zorunluluğu yoktur. Mobil ritim: 15 sn geri dönüş özeti → 2–5 dk işletme → bir küçük düzenleme/teslim → kalıcı kayıt. Gün birkaç oturuma bölünebilir. Arka plan ve yönetim/inşa modunda süre durur; gün sonu hesapları gün kimliğiyle bir kez yazılır. Sadece mobil oldu diye üretim/ücret sürelerini topluca kısaltıp ekonomiyi bozma.

Mağaza her günün tamamında açık olabilir; tek personelin 720 sn çalışma sınırı tüm mağazanın kapanması değildir. Vardiya dışındaki 180 sn oyuncu çalışabilir, başka personel görevi devralabilir veya mağaza kontrollü kapanır. “Yeni müşteri alma” anahtarı mevcut müşterileri güvenle çıkarır; kapanışta üretim ve bakım oyuncunun seçimine göre devam eder. Kapalı geçirilen süre normal satış fırsatını azaltır, gizli itibar cezası doğurmaz. Final sınavında saati veya ihtiyaçları silmez; eksik karşılanan talepler kaydedilir.

## 46. İlerleme, araştırma ve hikâyenin birbirine bağlanması

### 46.1 Kaynakların farklı işleri

Kredi fiziksel kapasite satın alır. Karakter XP'si oyuncunun uzmanlığını ilerletir. Araştırma puanı (AP) teknik seçenekleri açar. İtibar ilişkiyi ve final yolunu temsil eder. Aynı yükseltme için dördünün birden istenmesi yasaktır; temel içerik en fazla bölüm erişimi + kredi/AP koşulu taşır. Hiçbir temel üretim dalı belirli karakter becerisini zorunlu kılmaz.

### 46.2 Bölüm geçişleri ve erişim

Başlangıçta 100 kredi nakit, kasa, raf, seviye 1 memba çeşmesi, şişeleme tezgâhı ve domates yatağı vardır. Kaynak haznesi 50 ham su birimi; açılış sarfı 12 küçük şişe, 4 adet 5 L bidon, 2 damacana ambalajı ve 8 domates tohumudur (§26.1). İlk satış hedefi üç şişelenmiş su boyutu ve taze domatestir. Eski küp/su/spor bağış lotu ve yetiştirici/paketleyici satın alma yolu geçerli değildir. Bunlar üretim kodunda sürümlü içerik değerleri olur; oyuncu testiyle dengesi ayrıca ölçülür.

Bölüm 1 su ve taze sebze; bölüm 2 ilk işlenmiş gıda, mandıra ve sıcak içecek; bölüm 3 göl, mera, bağ, zeytinlik ve işleme; bölüm 4 Tier 4 birleşik ürünlerdir. Aşama kilidi ile oyun bölümü ayrı tutulur. Bölüm 1→2: toplam 20 gerçek satış, en az 5 kendi şişelenmiş su satışı ve bir taze domates satışı. Bölüm 2→3: iki aileden toplam 60 gerçek satış, bir sevkiyat kabulü ve bir çalışan molası. Bölüm 3→4: üç aileden toplam 120 gerçek satış, bir normal kontrat ve bir servis. Bölüm 4→5: bölgesel krizin bir çözümü ve 12 farklı SKU satışı. Bölüm 5→6: bir final projesi ve hizmet sınavı. Sayaçlar kayıtta birikir; aynı satış iki kez sayılmaz. İlk 20 satış, 56 ziyaretçi/900 aktif saniye P0 tabanıyla yaklaşık 5–6 aktif dakikalık bir hedeftir; gerçek müşteri davranışı ve stok kaybı nedeniyle süre garantisi değildir.

### 46.3 Araştırma kazanımı ve harcaması

Araştırma puanı (AP) harcama, tekil ödül ve idempotent kayıt kuralları korunur. Temel su/domates ücretsiz; ilk işlenmiş gıda, mandıra/içecek ve zanaat temel paketleri ayrı ayrı 2 AP; bu üç alanın ileri Tier 3–4 paketi ayrı ayrı 2 AP'dir: toplam 12 AP. Bölüm 1→2, 2→3 ve 3→4 ödülleri sırasıyla 3/4/5 AP verir. Böylece ana ilerleme için gereken 12 AP yalnız bölüm ödülleriyle kazanılabilir; yanlış harcama sırası kalıcı kilit yaratmaz. İlk 10 gerçek satıştan gelen aile başına tekil +1 AP ve günde ilk normal kontrat +1 AP, katalog seçeneklerini hızlandırır fakat 12 AP zorunlu hesabına eklenmez. Temel su ve domates satışı araştırma kilidine alınmaz; paketlerin kesin SKU listesi §26 kataloğunda tutulur.

### 46.4 Bölgesel kriz: zorunlu görev, isteğe bağlı ekonomik baskı

Bölüm 4'te “Yerleşim Tedarik Açığı” görevi başlar. Normal olaylar kapalı olsa da görev vardır; bu ayarda yalnız ekonomik eksi çarpanlar uygulanmaz. Süre sınırı ve kaybedilen oyun sonu yoktur.

Üç yol korunur: üretici 8 küçük su + 4 taze domatesi kendi üretip teslim eder; tüccar açık bedelli dış tedarikten 12 küçük su kabul edip teslim eder; toplulukçu 4 adet 5 L su + 4 taze domates teslimiyle aynı oyun gününde iki farklı çalışanın kesintisiz molasını birleştirir. Her yol +10 ilgili topluluk itibarı ve aynı ana hikâye ilerlemesini verir. Mallar parça parça teslim edilebilir. Seçenekler önce gösterilir, teslim başlamadan değiştirilebilir; teslim başladıktan sonra dal seçimi netleşir. Bu miktarlar tek kısa oturumda üretilebilirlik için başlangıç hipotezidir; oyuncu testi garantisi değildir.

İtibar başlangıçta her topluluk için 20; normal kontrat tamamlamak +2, kişisel/topluluk görevleri açıkça +3–5, kriz +10. 40 eşiği normal oynayışla yaklaşır; bölüm 42 kurtarma görevi ana ilerleme yerine son çare olur. İtibar 0–100'e sınırlandırılır.

## 47. RPG, kalite, enerji ve ekipman bağlantıları

### 47.1 XP ve uzmanlık

Seviye 1 başlangıçtır; sonraki seviyenin XP bedeli `100+25×(mevcutSeviye−1)`, en fazla seviye 20. Her seviye atlama 1 beceri puanı: toplam 19. İlk farklı SKU satışı 20 XP, her gün ilk 20 gerçek satış 2'şer XP, sonraki satışlar 0 XP fakat normal gelir; ilk kontrat 50, sonraki kontrat 20; ilk otomasyon/servis/sevkiyat öğretimi 30'ar; bölüm geçişi 100 XP. XP geçiş kapısı değildir, oyuncu düşük seviyede de finale ulaşabilir.

Her dalın 10 düğümü üç temel eylem ve yedi ileri varyanttan oluşur. Bu sürüm yalnız aşağıdaki 9 davranış düğümünü uygulama şartı yapar; kalan 21 düğüm A4 içerik backlog'udur, adı belirsiz bonuslarla otomatik doldurulmaz. 19 puan/30 düğüm hedefi tam ağaç tamamlanınca geçerlidir; A2/A3'te kullanılmayan puanlar saklanır.

| Dal | Düğüm | Davranış | Bedel/sınır |
|---|---|---|---|
| Tüccar | Alternatif teklif | Normal kontratta önceden tanımlı bir alternatif ürün seç | Adet/değer değişimi teklif önizlemesinde |
| Tüccar | Birleşik sevkiyat | Aynı tedarikçinin iki siparişini tek taşıma ücretine birleştir | Geç teslimat tarihi ve toplam 40 birim sınırı |
| Tüccar | Teslim takvimi | Bir kontratı iki planlı tarihe böl | Toplam ödül artmaz; rezervasyon sürer |
| Mühendis | Kalibrasyon profili | Standart/özenli üretim modu | Özenli +10 kalibrasyon, süre +%15 |
| Mühendis | Hat dönüşümü | Farklı tarif için güvenli kuyruk şablonu kaydet | Girdi/çıktı uyumluluğu kontrol edilir |
| Mühendis | Servis penceresi | Bir hat için toplu planlı bakım penceresi | Tüm hattı aynı anda durdurmaz |
| Toplulukçu | Mentor eşleme | Deneyimli çalışanı bir acemiyle eşleştir | Mentor aktif iş hızı −%5, öğrenci XP +%15 |
| Toplulukçu | Esnek devir | Çalışanın ikinci rolüne mola öncesi görev devri | İkinci rol eğitimi gerekli |
| Toplulukçu | Ortak ihtiyaç panosu | İki topluluğun mevcut tekliflerini tek planda birleştir | Ödül/ürün taahhüdü iki kez sayılmaz |

Her dalın ilk düğümü 1 puan; ikinci ilkini, üçüncü ikinciyi ister. Manuel olarak yapılabilen temel işlemler beceri arkasında kilitlenmez; düğümler toplu yönetim ve alternatif iş akışı sağlar. Yeniden dağıtma ilk kez ücretsiz, sonra 100 kredi; açık kontrat kazanımlarını geri almaz ve yeni bonus üretmez. Artık uygun olmayan otomasyon profili güvenle manuel moda döner.

### 47.2 Kaliteye ulaşılabilir yol

Ham kaynak kalite skoru Standart 40, Nitelikli 70, Özel 95; alış bedeli çarpanı 1/1,25/1,60. Nitelikli kaynak bölüm 3, Özel kaynak bölüm 4'te aynı tedarikçide açılır. Yüksek kaliteli kaynak zorunlu değil, sınırlı yüksek bütçeli talebi hedefleyen seçimdir. Normal nihai toptan ürünler 40/70/95 skoruyla ve 1/1,15/1,30 fiyat çarpanıyla sunulur; üst kalite günlük SKU kotasının en fazla %25'idir.

Makine kalibrasyonu seviye I=40, II=70, III=90. Mühendisin özenli modu +10, en fazla 100; bu nedenle Özel kalite yalnız bu sınıfa bağlı değildir: girdi95 + makine90 + uzmanlık80 →90,5 ve Özel kalite. Becerisiz otomasyonda girdi40 + makine40 + personelsiz40 →40 ve Standart. Birden çok aşamada gerçek skor lot boyunca korunur; kademe etiketi yeni 95 skoruna dönüşmez. Titiz özelliği son skora +5 ekler, sonuç100 sınırını aşmaz.

Personel becerisi 60 aktif görev saniyesi başına +1, eğitim odasında 120 sn ve 20 krediyle +3; günlük toplam gelişim en fazla +8 puan. Günlük ücret artışı yalnız bildirilen terfi/sözleşme kararıyla olur. Kalite uzmanlığı ilgili üretim becerisidir; kasiyer hizmeti yanlışlıkla makineye kalite vermez.

### 47.3 Güç kapasitesi ve öncelik

Başlangıç bağlantısı 8 E; ek enerji modülü 200 kredi ve +8 E, 2×2 hücre, bölüm 3'te açılır. Temel öğretim makineleri 1+2+1=4 E, yani başlangıç sistemi yeterlidir. Kullanım bedeli bölüm 26'daki E×saniye×0,01; kapasite satın almak bu bedeli kaldırmaz. Modül sayısı harita alanıyla sınırlıdır.

Güç dağıtımı varsayılan soğuk depo → aktif parti → öncelikli yeni parti → diğer makineler. Bir işi başlatmadan gerekli E ayrılır. Kesintide düşük öncelikli işler kalan süreyi koruyarak durur; aynı öncelikte eski iş önce gelir. Oyuncu önceliği değiştirir, güç yetersizliği haritada açıklanır. Şebeke olayı mevcut dış kapasiteyi değiştirir, doğrudan stok silmez.

### 47.4 Ekipman alanının sınırı

Taşıma takımı 6→8→10→12 birim; yükseltme bedelleri 80/160/300 kredi. 12'lik ağır modda hareket −%8, kullanıcı önceki hafif modu seçebilir. Analiz aracı işletme haritasını açan ücretsiz görev ödülüdür; temel teşhis ücretli ekipman gerektirmez. Üretim aparatı kalibrasyon profili için görsel araçtır, bağımsız üst üste bonus katmanı değildir. Böylece ekipman, beceri, dekor ve kalite aynı avantajı dört kez çarpmaz.

## 48. Stok, tempo ve başarısızlık yollarının bütünleştirilmesi

### 48.1 Fiziksel slot ile ekonomik lot ayrımı

Slot doluluğu SKU/kalite için gerçek adet üzerinden; FEFO, fiyat ve maliyet alt lot üzerinden çalışır. Aynı fiziksel slotta eski ve yeni ürün olması eski ürünün ömrünü yenilemez. Rezervasyon SKU toplamına değil lot alt miktarına bağlanır. Sekiz birimlik sekiz ayrı üretim lotu 64 adet eder ve stackSize10 ile yedi slot kullanır; sekiz tek ürünlük lot bir slot kullanır.

Dış alım kapasite önizlemesi mevcut uyumlu yığınların boş alanını kullanır; yalnız lot sayısını saymaz. Nihai partilerde farklı kaliteli çıktılar ayrı yığın sınıfı olur. FEFO geri kalan lotların maliyetini değiştirmez. Bölüm 33'te slot tanımı doğrudan bu modele düzeltilmiştir.

### 48.2 Tedarik kotaları ve teslimat zamanı

Günlük nihai SKU kotası bölüm 2'de 20, bölüm 3'te 40, bölüm 4+'ta 80 birim; tedarikçinin gün toplamı sırasıyla 80/160/320. Ham kaynaklar SKU başına 200/gün; özel kalite bunun %25'i. Yenilenebilir, sınırsız bedelsiz kaynak değil, ertesi gün yeniden tedarik edilebilen kaynak demektir. Kota onayda ayrılır, yola çıkmadan iptal edilirse serbest kalır; yoldaki iade aynı gün kotayı yenilemez.

Bir gün=900 sn; çeyrek gün=225 sn. Sipariş ekranı tahmini gün+saniye zamanını gösterir. Aynı SKU'yu farklı tedarikçiden almak ayrı kotalarla mümkündür; toplam taşıma, kredi ve depo sınırları korunur. Bölüm kilidi atlanmaz. Son oyun dış alım yolu birkaç güne yayılarak tamamlanabilir; tek tedarik gününde final stoğunun tamamı beklenmez.

### 48.3 Final için aşamalı teslim ve güvenli saklama

Her dalga bir hedef grubudur, tek seferde bütün malları depoya yığma koşulu değildir. Kısmi ürün teslimi anında proje kabulüne aktarılır, normal stoktan çıkar ve daha sonra bozulmaz. Dalga tüm satırları tamamlanınca kapanır. Teslim edilmiş ürün satılamaz veya geri çekilemez; işlem önizlenir. Bir sonraki dalga önceki dalga kapandıktan sonra açılır.

Final teslimleri müşteri satışı sayılmaz; 12 SKU ve AP eşiği finalle geriye dönük doldurulamaz. Sınavın bütçe/olası kabul planı bölüm 42'de düzeltilmiştir. Üç finalin ilgili aileleri zaten açık olmalı; değilse pano gereken araştırmayı doğrudan gösterir, belirsiz “hazır değilsin” mesajı vermez.

### 48.4 İflas ve personel ücreti bağlantısı

Kredi hiçbir işlemde negatif olamaz. Gün başı planlanan personel ücreti ayrılır; karşılanamayan vardiya başlamaz ve sözleşme askıya alınır, çalışan kaydı silinmez. Oyuncu gün bitmeden ödeme açığını ve etkilenen vardiyayı görür. Askı memnuniyet sorunu yaratabilir fakat yeni borç üretmez. Oyuncu kendi başına çalışmaya dönebilir.

Nakit 20'nin altındayken ve toplam satılabilir/gelecek stok değeri 100'ün altındayken ücretsiz “Yerel yardım teslimi” açılır: 60 sn fiziksel taşıma görevi, 40 kredi; günde en fazla iki kez. Görev malları kişisel stoğa alınamaz. Başlangıç teslim dolabı ve kasa kalıcı olarak satılamaz. Bu, bölüm 11'deki kurtarma yolunun kesin uygulamasıdır; büyük stok sahibi oyuncuya sürekli ücretsiz sermaye aktarılmaz.

Ödenemeyen oda altyapı gideri borç biriktirmek yerine ilgili ek odanın yeni görevlerini askıya alır; stok ve insanlar güvenli biçimde erişilebilir kalır, dinlenme tamamen kapatılmaz. Oda yeniden etkinleştiğinde geçmiş günlerin ücreti üst üste kesilmez. Temel kasa, teslim dolabı ve 8 E bağlantı çalışır; otomasyon çökerse çekirdek elle döngü devam eder.

### 48.5 Hikâye sonuçlarının dünyada karşılığı

Kriz seçimi ve final yalnız metin ekranı değildir: kooperatifte ortak pano ve dayanışma diyalogları; araştırmada ürün kabul masası ve ziyaretçi konuşmaları; ticarette bölgesel sevkiyat tabelası ve tüccar diyalogları açılır. Ücretsiz görsel değişimler ve üç kısa NPC sahnesi aynı temel mekân kitini kullanır. Final sonrası kalıcı sınırsız para bonusu verilmez; oyun ekonomisi korunur.

## 49. Tasarım incelemesi sonucu ve kalan iş

### 49.1 Bulunan ve belgede bağlanan açıklar

| Bulgu | Tasarım etkisi | Düzeltme |
|---|---|---|
| AP kaynağı/harcaması belirsiz | Araştırma ve bölüm kilidi riski | Bölüm 46: 12 AP yerel paket, kesin kazanım ve kurtarma |
| Bölüm süreleri vardı, geçiş şartları eksikti | Ajan farklı ilerleme sistemleri kurabilirdi | Birikimli ölçülebilir geçiş tablosu |
| İlk üretim kaynakları belirsiz | Yeni oyunda makine kurup çalıştıramama | Kesin başlangıç paketi ve kredi yeterliliği |
| Lot=slot varsayımı | Depo az ürünle doluyor | Fiziksel yığın ve alt lot ayrımı |
| Üst kaliteye giden kaynak yolu yok | Kalite uzmanlığı işlevsiz kalabiliyordu | Kaynak skoru, kalibrasyon, beceri bağlantısı |
| Güç tüketimi var, kapasite edinimi yok | İleri üretim açılmayabilirdi | 8 E başlangıç ve genişletme |
| RPG çoğunlukla vaat düzeyinde | Ana işletmeden kopuk ağaç riski | Dokuz davranış düğümü, XP ve iş akışı |
| Olay kapatma ile hikâye krizi karışıyordu | Final açılamayabilirdi | Zorunlu hikâye görevi/isteğe bağlı baskı ayrımı |
| Rastgele kabul ve sepet bütçeleri | Hazır işletme sınavı kötü şansla kaybedebilirdi | Dengeli sabit eşik seti ve toplam sepet kontrolü |
| Final miktarları depo ömrüyle çatışıyordu | Gereksiz stok yığma/bozulma | Kalıcı proje kabulü ve küçük parça teslim |
| Ücret ve iflas kuralları eksikti | Negatif kredi veya çıkışsız işletme | Vardiya rezervi, askı ve sınırlı yardım görevi |
| Referans süreler zorunlu gibi okunabilirdi | Oyunu uzatmak için grind riski | Süreler hedef; geçişler eylem ve karar temelli |

### 49.2 Hâlâ uygulanması/test edilmesi gerekenler

Tasarım bağlantıları artık açık; oynanışın iyi hissettirdiği henüz kanıtlanmış değildir. Öncelikli ölçümler: 100 kredi ve açılış sarfının rahatlığı, su debisinin darboğaz etkisi, son oyun kaynak/taşıma yükü, kaliteye yatırımın karşılığı, araştırma hızının tempo ile uyumu ve üç finalin gerçek tamamlanma süresi. Bunlar yeni sistem ekleyerek değil dikey dilim ve simülasyonla çözülmelidir.

İçerik backlog'u: kalan 21 beceri düğümü, 25 görevin tam diyalog/metinleri, personel olaylarının sahneleri ve finaldeki dokuz kısa NPC sahnesi. Bu belgede tamamlanmış gibi sunulmaz. Temel mekaniklere yeni bağımlılık eklemeden mevcut şablonlarla doldurulmalıdır.

### 49.3 Bağlantı kabul senaryoları

1. Temiz kayıt: başlangıç paketiyle satın alma → üretim → 20 satış → bölüm 2; dış para veya debug gerekmez.
2. Araştırma erişimi: temel ilerlemede 12 AP kazanılabilir; kilitli tarif kendi açılması için gerekli tek ödülü içermez.
3. Lot testi: sekiz tek ürünlük parti bir slot; eski ürün aynı slotta yeniden tazelenmez; rezervasyon ve maliyet korunur.
4. Kalite testi: 95/90/80 girdileri 90,5 kalite verir; hiçbir karakter dalı Özel kalite için zorunlu değildir.
5. Olaylar kapalıyken kriz görevi ve bütün finaller yine tamamlanabilir.
6. Her final planında 80 toplam ihtiyaç, 60 ziyaretçi, toplam bütçesi geçerli sepetler, adil fiyatta en az 64 kabul ve her ailede en az 15 kabul vardır.
7. Sıfır kredi/düşük stokta yardım → temel üretim → ücretli vardiyaya dönüş mümkündür; personel silinmez ve borç kartopu oluşmaz.
8. Saf üretici, karma işletme ve dış alım ağırlıklı tüccar aynı hikâye kapılarını geçebilir; ilk öğretimde kendi üretilen şişelenmiş su satışı gerekir.

Son tasarım yönü: yeni özellik sayısını artırmadan **ihtiyaç → kapasite → çalışan/yerleşim → ürün → satış → uzmanlık → topluluk sonucu** zincirini oynanabilir hâle getir. Bir ek mekanik bu zincirde anlamlı seçim yaratmıyorsa ilk sürüme alınmamalıdır.

## 50. Monetizasyon ve reklamların mevcut sisteme yerleşimi

### 50.1 Kapsam ve ürün kararı

Bu ek, aldatıcı dark pattern veya psikolojik bağımlılığı artırma hedefi yerine açık fiyatlandırma, gönüllü reklam ve oyuncunun seçtiği hedeflere geri dönmesini kolaylaştıran bağlılık tasarımı kullanır. Temel oyun reklam izlenmeden, çevrimdışı ve para harcanmadan tamamlanabilir. Bölüm 12'deki sınırlar korunur; ekonomik kriz, yorgunluk, bakım, depo veya final baskısı gelir teklifine çevrilmez.

Hedef platformlar iOS ve Android'dir. Bölüm 51 gönüllü kozmetik ödüllü reklam için aktif tasarım kapsamıdır; A5'te doğrulanmış mobil SDK ve test kimlikleriyle entegre edilir. Reklam izleme reddi temel oyunu engellemez. Platform gizliliği, reklam yaratıcıları ve satın alma akışları bölüm 60'taki ayrı mobil adaptörlerle ele alınır.

### 50.2 Reklam türleri

| Tür | Karar | Nerede/nasıl | Oyuncuya etkisi |
|---|---|---|---|
| Ödüllü video | Koşullu olarak uygulanır | Kullanıcının açtığı Destekle panelinde ayrı başlatma düğmesi | Önceden seçilmiş bir kozmetik açar |
| Ödüllü interstitial | Uygulanmaz | Normal oyun geçişlerine sokulmaz | Geçiş için reklam gerekmez |
| Zorunlu interstitial | Uygulanmaz | Gün sonu, bölüm geçişi ve kayıt sonrası yok | Akış bölünmez |
| Banner | İlk sürümde yok | HUD, kasa ve inşa panelinde yok | Oyun okunabilirliği korunur |
| Sponsorlu dünya panosu | İleri sürümde isteğe bağlı | Açık “Sponsorlu” etiketi; kapatılabilir dekor yüzeyi | İşlev ve NPC davranışı değiştirmez |
| Marka temalı kozmetik seti | İçerik anlaşması olursa | Normal katalogda sponsor etiketi | Aynı çarpışma alanı ve sıfır stat farkı |
| Çapraz tanıtım kartı | Yalnız Destekle panelinde | Açık dış bağlantı, otomatik açılmaz | Oyun dışında gezinme isteğe bağlı |

Sponsorlu panolar temel görünümde kurgusal evren reklamı gösterir. Gerçek reklam kapatılınca aynı alan estetik olarak boşalmaz; evren görseline döner. Oyun içi tüccar kontratı, gerçek sponsor siparişi gibi gösterilmez.

### 50.3 Monetizasyon temas noktaları

| Mevcut ekran | Kullanıcının başlattığı temas | Gösterilecek bilgi | Gösterilmeyecek teklif |
|---|---|---|---|
| Dekorasyon kataloğu | Kozmetik sekmesine geçiş | Yerel fiyat, sahiplik, önizleme, işlevsiz görünüm açıklaması | Daha yüksek konfor satışı |
| Personel görünümü | Kıyafet önizleme | Kıyafet kapsamı ve ücretsiz alternatif | Daha hızlı/az yorulan çalışan |
| Mağaza teması | Tema kataloğunu açma | Bütün içerikler ve gerçek toplam fiyat | Kasa/raf kapasitesi satışı |
| Ana menü | Destekle panelini açma | Kozmetik paket veya gönüllü video | Otomatik teklif modalı |
| Fotoğraf modu | İsteğe bağlı görünüm sekmesi | Çerçeve veya renk paleti | Görseli dışa aktarmak için ödeme |
| Kriz/iflas/bakım/final | Hiçbiri | Yalnız oyun içi çözüm yolları | Krediler, kurtarma, süre uzatma veya reklam |

Mağaza bildirim rozeti yalnız gerçekten yeni katalog ürünü için, kullanıcı etkinleştirmişse görünür. Kozmetik sahip olmamak eksik görev veya tamamlanmamış oyun yüzdesi sayılmaz. Temel oyun koleksiyonu ve isteğe bağlı kozmetik koleksiyonu ayrı gösterilir.

## 51. Ödüllü reklam algoritması ve gelir hesabı

### 51.1 Teklif ve ödül

Oyuncu önce belirli ödülü seçer, sonra reklam başlatır. Örnek: bir tabela deseni veya bir kıyafet renk paleti. Bir tamamlanmış reklam bir seçilmiş kozmetik verir; parça biriktirme, şanslı sandık ve art arda reklam gerektiren kademe yoktur. Havuz başlangıçta 12 küçük kozmetik; tamamı oyun içi ücretsiz görünüm görevlerinden de kazanılabilir. Ücretli SKU'larla ödül havuzu örtüşmez.

Ücretsiz eşdeğer görev bir oturumda tamamlanabilecek açık bir yaratıcı hedeftir: bir oda yerleşimini kaydet veya fotoğraf modu kompozisyonunu kaydet. Her kozmetik belirli tek seferlik hedefe bağlanır; aynı eylemi tekrar ederek sınırsız ödül üretmez. Oyuncu reklamı kapatırsa bu yol aynı maliyet ve koşulla sürer.

Video yalnız oyun duraklatılabiliyorsa başlar; aktif final sınavında sunulmaz. Oyun saati, kontrat, bozulma, müşteri kuyruğu ve çalışan yorgunluğu durur. Sağlayıcı önceden azami süreyi bildirmiyorsa teklif gösterilmez; hedef kabul sınırı 30 saniyedir, gerçek sağlayıcı doğrulanmadan bu süre vaat edilmez. Zorunlu ek end-card etkileşimi veya indirme şartı olan yaratıcılar kabul edilmez.

### 51.2 Sıklık ve uygunluk

Tasarım üst sınırı gerçek kayan 24 saatte 3 başarılı reklam, iki başarılı izleme arasında en az 20 gerçek dakika. Bu süreler ödül sayfasına geri çağıran sayaç olarak gösterilmez. Limitte “Daha sonra kullanabilirsin; ücretsiz görev yolu açık” yazılır. Reklam izleme hedefi, günlük seri veya tamamlama bonusu yoktur.

```text
canOfferRewardedAd(context):
    require explicitSupportPanelOpen AND userEnabledAds
    require providerSupported AND verifiedCreativeMetadata
    require simulationCanPause AND NOT finalTrialActive
    require NOT adInProgress AND availableUnownedReward
    require successfulViewsInRolling24h < 3
    require timeSinceLastSuccess >= 20 minutes
    require requiredPrivacyChoicesResolved
    return eligible
```

Reklam varsayılan kapalıdır. Destekle ekranında açıklamayla etkinleştirilebilir ve ayardan geri kapatılabilir. Yaş/gizlilik uygunluğu belirlenemiyorsa kişiselleştirilmiş reklam kullanılmaz; güvenli sunum sağlanamıyorsa reklam kapatılır. Bu metin platform veya ülke mevzuatının yerine geçmez; seçilen sağlayıcının gereksinimleri yayın aşamasında doğrulanır.

Uygunluk denetimi SKU kârı, nakit açığı, memnuniyetsiz personel, mağlubiyet, harcama geçmişi veya psikolojik profil okumaz. Kozmetik önerileri sadece kullanıcının seçtiği kategoriyle filtrelenir.

### 51.3 Durum makinesi ve hata davranışı

Ready → UserConfirmed → Loading → Playing → AwaitingVerification → Granted. Yan durumlar NoFill, Cancelled, Failed, Pending. Otomatik yeniden oynatma veya başka reklamla otomatik değiştirme yoktur.

Reklam başlarken attemptId ve seçilmiş rewardId kaydedilir. Sağlayıcı imzalı doğrulaması veya eşdeğer güvenilir sunucu olayı olmadan istemci callback'i hak vermez. Doğrulanmış completionId üzerinde benzersiz kısıtla ödül yalnız bir kez yazılır. Başarısız/yüklenmeyen reklam sıklık kotasını tüketmez. Yarıda kapatma ödül vermez; başlangıç ekranı bunu açıkça söyler ve kapatma normal oyuna hemen döner.

Tamamlanmış reklamın doğrulaması gecikirse “Ödül bekleniyor” kaydı tutulur, tekrar izleme istenmez. Yeniden bağlantıda durum çözülür. Oyuncu bu sırada aynı kozmetiği ücretsiz görevden kazandıysa tamamlanmış hak başka bir sahip olunmayan reklam kozmetiğini seçme hakkına dönüşür; para veya stat ödülüne dönüşmez. Ödül havuzu tamamen bittiyse teklif baştan sunulmaz.

Çevrimdışıyken reklam bileşeni devre dışıdır; oyuna devam edilir. Reklam zamanı oyun günü değildir. Gerçek zaman damgası yalnız sıklık/gizlilik operasyonları içindir, simülasyon saatini ilerletmez.

### 51.4 Birleşik gelir modeli

```text
reklam_net_gelir_tahmini = geçerli_gösterim / 1000 × net_eCPM
toplam_katkı = platform_net_kozmetik_ödemesi + reklam_net_ödemesi
                + sponsor_net_ödemesi − işletme_maliyetleri
```

Örnek varsayım: 10.000 aylık aktif kullanıcı × %10 gönüllü reklam katılımı × ayda 4 geçerli gösterim =4.000 gösterim. Varsayımsal net eCPM 5 USD ise 20 USD reklam geliri. Bu pazar verisi veya garanti değildir; düşük reklam sıklığının gelir sınırını görünür kılar. Sürdürülebilirlik için zorunlu reklamla oynanışı bozmak yerine içerik maliyeti ve kozmetik teklifinin değeri değerlendirilir.

Başlatma, tamamlama ve faturalandırılan gösterim farklı ölçümlerdir. Sağlayıcı sadece tamamlananları faturalandırmıyorsa gelir tamamlanma sayısından hesaplanmaz. Muhasebede gerçek net ödeme raporu esas alınır; gross eCPM'den kesintiler iki kere düşülmez.

## 52. Zeigarnik, geri dönüş ve alışkanlık UX'i

### 52.1 Bilimsel iddianın sınırı

Zeigarnik adı burada tamamlanmamış hedefleri anlaşılır biçimde saklama fikrine referanstır; kanıtlanmış bir “bağımlılık algoritması” değildir. Zeigarnik (hatırlama) ile Ovsiankina (yeniden başlama eğilimi) aynı kavram değildir. Ghibellini ve Meier'in 2025 meta-analizinin yayımlanan özeti, tamamlanmamış görevler için genel bir hatırlama üstünlüğü bulmadığını, yeniden başlama eğilimi bulduğunu bildirir. Bu sonuç oyunda bağımlılık veya belirli retention artışı kanıtlamaz. Kaynak: [Interruption, recall and resumption](https://www.nature.com/articles/s41599-025-05000-w).

Bu oyunda uygulanacak hipotez: oyuncu seçtiği hedefin nerede kaldığını ve sonraki küçük adımı kolay görürse geri döndüğünde daha az zihinsel yük yaşar. Test sorusu “daha uzun oynadı mı?” kadar “bırakmak ve geri dönmek kolay mıydı?”dır.

### 52.2 Hedef, eylem, sonuç ve kapanış

| Aşama | Mevcut sisteme uygulanışı | UX ayrıntısı |
|---|---|---|
| Hedef seçimi | Oyuncu en fazla 3 hedef sabitler | Öneri otomatik görev kabulü değildir |
| Başlangıç | “Bu oturumda ne yapmak istersin?” isteğe bağlı kart | Son hedef, küçük hedef, serbest oyun |
| Eylem | Bir üretim hattı, kontrat veya oda düzeni | Sonraki adım ve gerçek gereksinim |
| Geri bildirim | Gerçek stok/teslim/kalite ilerlemesi | Sahte hızlanan çubuk ve şişirilmiş yüzde yok |
| Tamamlama | Kazanç + dünyadaki değişim | Kısa, geçilebilir, düşük hareket seçeneği |
| Kapanış | Kaydet; tamamlananı ve kalanı göster | Tek eylemle çık, yeni görev zorlaması yok |
| Geri dönüş | Son kaydın 3 satırlık özeti | “Geçen sefer: depo açıldı; sıradaki adım: 10 su” |

**27 Eylül 2026 ürün revizyonu:** Önceki kural “bir görevi bitirince yenisi otomatik etkinleşmez” idi. Artık tamamlanan hedefin ardından erişilebilir bir sonraki küçük hedef otomatik **önerilir** ve HUD'da etkin hedef olarak gösterilir; ücret, stok tahsisi veya görev kabulü oyuncu komutu olmadan gerçekleşmez. Bir üretim döngüsü bitmeden başka gerçek döngüler hazır olabilir; tamamlanmış işi sırf yarım bırakmak için geciktirme yoktur. Önceki “Şimdilik bitir” ile eşit ağırlık kuralı kaldırılır: devam eylemi ana akışta görünür, kaydet/çıkış her an erişilebilir kalır. Çıkışta kayıp ödül, son şans teklifi veya gerçek zaman baskısı gösterilmez.

### 52.3 Mevcut sistemlere uygulama

- **Üretim:** Tarif kartında girdi/çıktı ve eksik miktar; sonraki oturuma hat planı kaydedilir. Makine tamamlandı bildirimi yalnız açık oyunda, toplu ve kapatılabilir.
- **Personel:** Kişisel olaylar bir sonraki bölüm için merak bırakabilir; her sahne kendi küçük sonucunu verir. “Beni yalnız bıraktın” tarzı gerçek oyuncuyu suçlayan geri dönüş metni yoktur.
- **Kontrat:** İlerleme 12/20 gibi gerçek değer; süre yalnız oyun saatinde işler. Oyundan çıkmak süreyi tüketmez.
- **Final:** Dört dalga görünür alt hedef; her teslim oturumu kapanabilir. Henüz teslim edilmeyen malları kaybedeceğin tehdidiyle reklam veya ödeme sunulmaz.
- **Dekor:** Önce/sonra görüntüsü ve kaydedilmiş düzenler sahiplenmeyi destekler. Ücretli dekor sahip olmamak oda puanını düşürmez.
- **İşletme haritası:** Bir sorunu çözdükten sonra ölçülen değişim görünür. Sonraki gerçek darboğaz varsa sıradaki hedefe bağlanır; yalnız akışı sürdürmek için yapay sorun üretilmez.

### 52.4 İlerleme koleksiyonları ve geri dönüş

Ürün ustalık albümü 24 temel SKU'yu gösterir. İlk gerçek satış, 10 satış ve ilk Nitelikli üretim ayrı sabit rozetlerdir; rastgele ödül yoktur. Ücretli kozmetikler bu albümün yüzde hesabına girmez. Tamamlamak ana finale zorunlu değildir.

Günlük giriş serisi yerine **birikimli oturum günlüğü**: oyuncunun tamamladığı 5/10/20 anlamlı hedef kaydedilir, ara verince sıfırlanmaz. Aynı hedef tekrar çift sayılmaz. Takvim ödülü, seri kurtarma ücreti veya hafta sonunda kaybolan içerik yoktur. İsteğe bağlı mevsimlik senaryolar içerik arşivinde oynanabilir kalır.

Bildirimler ilk sürümde yalnız oyun içidir. Dış push/e-posta ayrı kapsamdır; bu belge bildirim gönderme yetkisi vermez. Oyuncu belirlediği 30/60/90 dakikalık süre için yerel mola hatırlatması açabilir; bu oturum uzatma hedefi değildir.

## 53. Psikolojik tasarım matrisi ve kullanılmayacak dark pattern karşılıkları

| İlke veya risk | Oyundaki uygulanabilir karşılık | Sınır |
|---|---|---|
| Yetkinlik | Darboğazı çözme, kaliteyi yükseltme, ustalık rozeti | Gizli zorluk artışıyla ilerleme geri alınmaz |
| Özerklik | Üretici/tüccar/karma işletme, hedef seçimi | Tek doğru ücretli çözüm yok |
| Sahiplenme | Düzen, isim, görünüm ve önce/sonra arşivi | Harcanan emek çıkış tehdidine dönüştürülmez |
| Hedefe yaklaşma | Gerçek teslim sayısı ve alt aşamalar | Sahte %90 dolu çubuk yok |
| Merak | Ürün ve NPC hikâyesi ile erişilebilir sonraki hedefin sürekli görünmesi | Gerçek içerik ve erişim koşulu olmadan sahte hedef gösterilmez |
| Sosyal ilişki | NPC'nin yapılan seçimi hatırlaması | Gerçek zamanlı terk etme suçlaması yok |
| Çeşitlilik | Seed'li dünya olayları ve farklı siparişler | Ödüllü reklam ve para harcama rastgele kazanca bağlanmaz |
| Kayıp korkusu | İşletme kararlarının açık oyun içi maliyeti | Giriş yapmama cezası, sahte kıtlık yok |
| Batık maliyet | İlerleme kaydını ve yeniden düzenlemeyi koruma | “Bu kadar oynadın, bırakamazsın” mesajı yok |
| Sosyal kanıt | Gerçek NPC hizmet tepkileri | Uydurma oyuncu satın alma bildirimleri yok |
| Değişken ödül | Kozmetik ve görev ödülleri önceden belli | Loot box, near-miss ve jackpot animasyonu yok |
| Varsayılan seçim | Reklam kapalı, net tercih kontrolü | Önceden işaretli satın alma/abonelik yok |

Bu tablo kullanıcı tercihiyle sürekli hedef ve kesintisiz akış yönüne revize edilmiş tasarım haritasıdır. Önceki “sonsuz cliffhanger yok” ve otomatik hedef göstermeme sınırları yukarıda değişmiştir. Kullanıcıların psikolojik hassasiyetleri çıkarımlanmaz; depresyon, yalnızlık, borç veya dürtüsellik tahminleri gelir sistemine veri olamaz.

## 54. Entegrasyon, ölçüm ve kabul koşulları

### 54.1 Sistem ayrımı

AdOfferService yalnız kullanıcı tercihi, platform uygunluğu, zaman sınırı ve kozmetik sahipliğini okur. EconomyService, StaffNeedsSystem, EventDirector ve FinalProjectService reklam gelirine veya izleme sıklığına göre parametre değiştiremez. RewardEntitlementService mevcut hak altyapısını completionId ile genişletir. SessionJournalService hedef durumu ve son güvenli kaydı saklar; görev kabul etmez.

Yeni veri: AdPlacementDefinition, AdAttempt, RewardGrant, CreativePolicy, SessionBookmark, GoalPin. Önce test sağlayıcısıyla no-fill, iptal, gecikme, mükerrer callback ve kapanış senaryoları uygulanır. Gerçek reklam entegrasyonu A5'te ve platform doğrulamasından sonra; A2'ye yeni bağımlılık getirmez.

### 54.2 Başarı ölçümleri

Ana ölçüler: hedef tamamlama, sonraki adımı anlayabilme, döngüler arası devam oranı, oturum süresi, memnuniyet, çıkış/kayıt başarısı ve geri dönüşte hatırlama kolaylığı. D1/D7 retention ve gelir tanımları ekipçe sabitlenip yardımcı ölçüm olarak kullanılır. Önceki “oturum süresini tek başına büyütmek başarı değildir” sınırı revize edilmiştir: uzun ve kesintisiz oynama tasarım hedefidir, ancak kayıt kaybı veya oyuncunun durmakta zorlandığı geri bildirimi ayrıca raporlanır. Temel oyun telemetrisi kullanıcı onayı olmadan dışarı gönderilmez; ödeme/reklamın gerekli işlem kayıtları ayrı açıklanır.

Reklam ölçüleri: açık tercih oranı, no-fill, hatalı kapatma, reward pending, destek şikâyeti, gerçek net gelir. Mağaza ölçüleri: satın alma öncesi içerik anlaşılması, iade ve memnuniyet. Satın alma/reklam reddi daha agresif yeni teklif üretmez.

UX deneyleri okunabilirlik, hedef özeti, navigasyon ve gerçek döngülerin örtüşmesi üzerinde yapılır. Reklam sınırları, kapatma görünürlüğü, kişisel zorluk veya hassasiyet hedefleme A/B değişkeni değildir. Test oyuncusu “bırakmakta baskı hissettim” diyorsa bunun nedeni ve oturum süresi birlikte raporlanır; özellikle kayıt/çıkış kusuru düzeltilir.

### 54.3 Kabul testleri

1. Reklamlar tamamen kapalı ve internet yokken yeni oyundan üç finale giden bütün mekanikler çalışır.
2. Video boyunca 900 saniyelik oyun günü, kontrat süresi ve raf ömrü ilerlemez; dönüşte çift simülasyon adımı atılmaz.
3. Aynı completionId üç kez geldiğinde tek kozmetik; doğrulama gecikince ikinci izleme istenmez.
4. No-fill ve iptal oyunu kilitlemez; başarılı gösterim kotası yanlış azalmaz. Ödül havuzu doluyken reklam sunulmaz.
5. İflas, servis ihtiyacı, düşük enerji, personel molası ve final başarısızlığı reklam veya ödeme teklifini tetiklemez.
6. Ücretli/izlenerek alınmış görünüm ile ücretsiz görünüm aynı ekonomi, çarpışma ve personel sonucunu verir.
7. Oyuncu bir ay sonra dönünce giriş serisi, stok ve itibar kaybı yoktur; özet kayıtlı gerçek durumu gösterir.
8. Hedef tamamlanınca erişilebilir sonraki hedef HUD'da otomatik görünür, fakat stok/para harcayan görev kabul edilmez ve reklam açılmaz; çıkış bir kayıt ve tek onay akışıyla mümkündür.
9. Dokunma ve desteklenen erişilebilirlik odağı kapatma/devam seçeneklerine erişir; hareket azaltma ödül animasyonunu da kapsar. Mobil ekran okuyucu desteği Capacitor içindeki DOM arayüzde cihazda doğrulanır.
10. Reklam/katalog ayarını değiştirmek müşteri bütçesini, olay seed'ini, fiyatları veya final koşullarını değiştirmez.

Tasarım sonucu: Gelir noktaları kişiselleştirme isteğine; geri dönüş UX'i hatırlama kolaylığına, ustalığa ve dünyanın değişmesine bağlanmıştır. Sürekli hedef ve akıcı ritmin uzun oturuma etkisi henüz ölçülmemiştir. Gerçek reklam sağlayıcısı, ekonomik sonuç ve retention etkileri henüz uygulanmış veya doğrulanmış değildir.

## 55. Dört katmanlı bağlam denetimi

İnceleme tarihi: 26 Eylül 2026. Bu sürüm yeni oynanış sistemleri eklemekten çok projenin geliştirmeye başlayacağı sınırları sabitler. Belgenin büyüklüğü tek başına hazırlık göstergesi değildir; bilinmeyenler görünür kalmalıdır.

| Katman | Önceden bulunan | Eksik/dağınık kalan | Bu sürümde çözüm |
|---|---|---|---|
| Tasarım | Döngüler, kamera, sistemler, final | Tek bakışta okunabilen ürün özeti | Baştaki kısa GDD ve net kanca |
| Teknik | Motor ailesi, katmanlar, kayıt | Referans makine, render/veri bütçesi, sürüm kilidi | Bölüm 56 teknik sözleşme |
| Pazar/oyuncu | Referans isimleri, ücretsiz model | Mobil persona, kısa oturum ve kanal uyumu | Bölüm 57 ve 60 iOS/Android kararları |
| İş akışı | Dizinler ve aşamalar | A2 kapsamının her ekte büyümesi, ajan kuralları | Bölüm 58 tek kapsam ve bölüm 59 kural şablonu |

Karar etiketleri: **Sabit** kullanıcı talebi veya kabul edilmiş ürün yönü; **Varsayılan** geri alınabilir uygulama seçimi; **Hipotez** test edilecek sayı/oyuncu beklentisi; **Açık** eksik dış bilgi. Her yeni karar bu etiketlerden biriyle kaydedilir. Bilinmeyen ekip bütçesi, kurulu motor veya pazar talebi varmış gibi davranılmaz.

## 56. Teknik bağlam ve ölçülebilir bütçeler — arşiv notu

Bu bölümün eski Unity/render bütçeleri sürüm 3.0 için geçersizdir. Güncel teknik sözleşme bölüm 61, güncel performans hedefleri bölüm 63'tedir.

### 56.1 Motor ve araç sözleşmesi — eski bölüm, 61'e taşındı

Unity varsayımı sürüm 3.0'da kaldırılmıştır. Three.js/Capacitor araçları, build koşulları ve mimari için bölüm 61'e; low-poly kuralı için bölüm 62'ye bak.

### 56.2 Referans donanım ve başlangıç bütçeleri

Önerilen test profilleri: düşük/orta Android için Snapdragon 680 sınıfı 4 GB cihaz; orta cihaz için Snapdragon 778G sınıfı 6 GB; iOS tabanı için iPhone SE 2020/A13 sınıfı cihaz; ayrıca güncel iPhone ve bir iPad. Bunlar test hedefidir, ölçülmüş minimum gereksinim değildir. Destek tabanı başlangıç hipotezi Android 10+/ARM64 ve iOS 16+; mağazanın güncel hedef SDK zorunluluğu bundan ayrı doğrulanır. Cihaz bulunmadan emülatör sonucu fiziksel cihaz performansı sayılmaz.

| Ölçüm | İlk hedef/bütçe | Ölçüm koşulu |
|---|---|---|
| Görüntü | Dikey; düşük profilde iç çözünürlük kısa kenar ≈720, 30 FPS | UI cihaz çözünürlüğünde; üst profilde isteğe bağlı 60 FPS |
| Frame süresi | 30 FPS profilde CPU/GPU p95 ≤33,3 ms | 20 dk ısı dengesi sonrası gerçek cihaz |
| Simülasyon | 10 Hz adımda p95 ≤6 ms | İşler frame'lere yayılır; arka plan catch-up yapılmaz |
| Draw call | Düşük profilde hedef ≤150 | Renderer ölçümü ve fiziksel cihaz profiler'ı |
| Görünür üçgen | Düşük profilde hedef ≤150 bin | Yoğun görünüm; tablet zoom-out da test edilir |
| Bellek | Resident hedef ≤750 MB, reklam açılış tepesi ayrıca ölçülür | İşletim sistemi ölçümleri cihaz bazında yorumlanır |
| Asset | NPC LOD0 ≤2 bin, makine ≤4 bin üçgen | Uzakta düşük LOD, dekor collider'ı sınırlı |
| Dokular | Çoğu 256–1024, atlas ≤2048 | Hedef cihaza uygun sıkıştırma, mipmap |
| Işık | Baked/emissive; düşük profilde blob gölge | Eşya başına gerçek zaman ışık yok |
| Kayıt | Ana thread görünür takılması ≤50 ms; toplam hedef ≤1 sn | Snapshot alma ve disk yazımı ayrı ölçülür |
| İlk açılış | Hedef ≤10 sn, kayıt dönüşü ≤3 sn | Fiziksel cihaz, mağaza benzeri release build |

Bütçeler test hipotezidir. CPU/GPU süreleri toplanmaz; draw sayısı tek başına başarı ölçüsü değildir. Nihai yük 60 müşteri/20 çalışan/100 makine/1.000 mantıksal yığındır; düşük profilde aynı anda en fazla yaklaşık 25 tam animasyonlu avatar çizilir. Ekran dışı ajanlar mantıksal görev/rota süresini korur. Gerekirse kalite azaltılır; telefon modeline göre daha az müşteri veya daha az gelir verilmez. Isınmayla bozulma, pil tüketimi ve bellek uyarıları ayrı test edilir.

### 56.3 Veri, kayıt ve çevrimiçi sınırlar

Tek doğruluk kaynağı yerel simülasyondur; envanter, ledger, lotlar, görevler, NPC durumu ve RNG yerel versioned JSON snapshot'ta saklanır. Boyut/performans ölçülmeden SQLite veya başka kayıt sistemi eklenmez. Dünya saatiyle gerçek saat ayrı tiplerde temsil edilir. Reklam/ödeme zamanı oyunu ilerletemez; offline gelir yoktur.

Bulut kayıt ilk prototip dışında. İleride platform bulutu yalnız kapalı snapshot dosyasını senkronlar; iki farklı kaydın ekonomisi otomatik birleştirilmez. Çakışmada zaman, oynama süresi ve dünya kimliği gösterilip kullanıcıya seçim sunulur. Kayıt öncesi son sağlam yedek korunur.

Gerçek çevrimiçi alan yalnız isteğe bağlı kozmetik hak doğrulamasıdır. Temel kaydın değişmesi gerçek ödeme hakkı yaratmaz. Loglarda platform token'ı, makbuzun gizli verisi veya kişisel bilgi bulunmaz. Build varsayılanı analytics kapalı, mock ödeme, reklam sağlayıcısı yoktur.

## 57. Oyuncu, rakip ve dağıtım bağlamı

### 57.1 Hedef oyuncu hipotezleri

Birincil: telefonda 3–8 dakikada küçük işletme hedefi tamamlamak isteyen, fiziksel market döngüsünden daha derin üretime geçebilen oyuncu. İkincil: telefonda/tablette 15–20 dakika dekor ve planlama yapan oyuncu. Oturum çağrı veya uygulama değişimiyle kesilebilir; bu davranış hata veya ceza sebebi değildir. Oyun küçük çocuklara yönelik reklam deneyimi olarak konumlandırılmaz; gerçek içerik ve hedef kitleye uygun derecelendirme ayrıca yapılır.

Testte iki grubun her birinden en az 3 kişi; ilk 5 kişilik testte öğrenme sorunları, ardından iki segmentte 6 kişilik karşılaştırma. Küçük örnek pazarı temsil etmez. Sorular: “Bu oyunda neyi farklı buldun?”, “Hangi iş keyifli, hangisi angarya?”, “Otomasyondan sonra ne yapmak istedin?”, “Geri geldiğinde nerede kaldığını anlayabildin mi?”

### 57.2 Referans ve ayrışma matrisi

| Referans | Kaynaktan doğrulanan temel alan | Bizim tasarım çıkarımımız | Alınmayacak kapsam |
|---|---|---|---|
| Supermarket Simulator | Raf, fiyat, kasa, personel ve yerleşim | Fiziksel döngüyü kısa tut; stok/fiyat nedenini göster | Şehirde araç sürme ve mağaza dışı açık dünya |
| My Mini Mart | Elle taşıma, üretim ve raf doldurma | İlk satış döngüsünü kısa ve okunabilir tut | Birebir mağaza, karakter veya arayüz kopyası |
| Game Dev Tycoon | İşletme simülasyonu referansı | Küçükten büyüğe ilerlemeyi az sayıda okunabilir kararla sun | Oyun geliştirme teması veya aynı arayüz |

Kaynaklar: [Supermarket Simulator resmi Steam alanı](https://steamcommunity.com/app/2670630), [Game Dev Tycoon mağazası](https://store.steampowered.com/app/239820/Game_Dev_Tycoon/). Buradaki ayrışma bir tasarım tercihidir; pazarda bu birleşimin hiç olmadığı iddiası değildir. My Mini Mart ilk dokunsal döngü referansı olarak kalır; bu taramada mobil yorumları incelenmemiştir.

### 57.3 Yorumlardan sınırlı fakat somut sinyaller

26 Eylül 2026'da erişilen [Supermarket Simulator Steam yorum sayfasındaki](https://steamcommunity.com/app/2670630/reviews/?browsefilter=toprated) beş örnek incelendi: 8 Mart 2024 kasa girişi; 11 Nisan 2024 tarihli ve 2026'ya güncellenmiş stok/personel yorumu; 16 Mart 2024 tarihli arayüz yorumu; 18 Mayıs 2024 düşük stok uyarısı isteği; 17 Nisan 2024 birlikte oynama isteği. Bunlar seçilmiş yararlı yorumlardır; rastgele örneklem, güncel hata listesi veya oyuncu çoğunluğu görüşü değildir. Sonraki güncellemeler eski taleplerin bir bölümünü karşılamış olabilir.

Ürün kararlarımız: stok görünürlüğü ve neden günlüğünü A2'ye al; dolu depoda personelin elindeki yükle kilitlenmesini test et; tuş ve metin boyutu seçeneklerini erken kur; yerleşimde grid kullan. Çok oyunculu talebi görülse de mevcut kapsamı genişletmez. Bu sinyaller türün büyüklüğünü, satış potansiyelini veya reklam kabulünü kanıtlamaz.

### 57.4 Mobil mağazalar ve monetizasyon — eski Unity dönemi

Güncel web tabanlı app ve mağaza uyumu için bölüm 61'e bak. iOS web-kabuk oyunu özgün ve kalıcı eğlence işlevi sunmalıdır; etkileşimli Three.js simülasyonu ürünün kendisidir. Mağaza politikası ve ödeme yolları yayın öncesi yeniden doğrulanır.

Gerçek sponsor anlaşması mevcut değildir. Reklam ağı veya arabuluculuk sağlayıcısı henüz seçilmemiştir. iOS ve Android'de aynı ekonomik ödül, sıklık sınırı ve ücretsiz alternatif korunur; reklam bulunamadığı bölgede oyuncu geride kalmaz. SDK maliyeti ve mağaza kabulü doğrulanmış gibi sunulmaz.

### 57.5 Pazar doğrulamasının açık kalan kısmı

Pazar büyüklüğü, kullanıcı edinme maliyeti, dönüşüm ve net kozmetik geliri bilinmiyor. Rakip yorumlarının varlığı satış tahmini değildir. İlk oynanabilir yapı sonrası 60–90 saniyelik gerçek oynanış videosu ve ücretsiz demo ile kancanın anlaşılması test edilir. “Geri gelmek isterim” beyanı, gerçek tekrar oynama ve ödeme davranışıyla aynı sayılmaz. Tam üretim bütçesi, geri bildirim görülmeden gelir beklentisine dayanarak büyütülmez.

## 58. Kapsam kilidi ve ilk yedi çalışma günü

### 58.1 Tek aşama tablosu

Buradaki P0 adı oynanış prototipidir; eski raporlardaki P0 öncelik etiketiyle karıştırılmamalıdır. Önceki bölümlerin A2'ye eklediği özellikler aşağıdaki tabloya göre yeniden sınıflandırılmıştır.

| Aşama | Zorunlu kapsam | Bu aşamada olmayacaklar | Çıkış kanıtı |
|---|---|---|---|
| P0 — çekirdek kanıt | Dikey dokunmatik tek oda, su kaynağı/şişeleme/domates yatağı, dört satış ürünü, raf/kasa, tek müşteri, grid, envanter/para, tek raf görevlisi, kayıt/yükleme | RPG, odalar, mola, dış alım, bakım, kontrat, hikâye, kozmetik satış, reklam | Telefonda 3–8 dk döngü, işi devretme, arka plan/dönüş, görünür yerleşim etkisi |
| A2 — dikey dilim | İlk işlenmiş gıda, kümes/mandıra ve sıcak içecek hatları, tek depo rafı, tek tedarikçi, 2 koltuklu mola köşesi, 3 müşteri profili, basit fiyat tepkisi, bir ikame, 2 teşhis katmanı, 5 öğretim görevi | 30 beceri, 8 personel rolü, tam oda kataloğu, bozulma, ileri bakım, olay kataloğu, final, gerçek ödeme | 20–30 dk oynanış, stok/para korunumu ve iki farklı yerleşim |
| A3 — derinlik | Bakım, kontrat, vardiya, oda etkileri, kalite, araştırma, 9 çekirdek RPG düğümü, sınırlı olaylar; §38.4–38.6 fiyat tabelası, raf kilidi, aşırma ve oyun içi borç | Tam içerik, son sanat ve monetizasyon SDK'ları | Üretim/ticaret/karma yolun aynı ilerlemeyi geçmesi; yeni stok/borç akışında korunum |
| A4 — tam oyun | Tier 1–4 kataloğu, ileri görevler, 3 final, kalan gerekli içerik | Yeni platform ve multiplayer | Baştan finale oynanabilir build |
| A5 — yayın adayı | Performans, erişilebilirlik, lisans, kayıt göçü, seçilen platform ödemesi | Yeni temel mekanik | Paketlenmiş build ve doğrulanmış yayın kontrolü |

P0, tam oyunun ekonomi dengesi değildir: su kaynağı ve ambalaj sarfı prototip değerlerle ilk döngüyü sınar. A2'de gerçek başlangıç paketi ve maliyetler kullanılır. P0 kayıtları geliştirme verisidir, yayın kaydı uyumluluğu vaat edilmez.

### 58.2 Yedi çalışma günü planı

Ekip ve günlük kapasite bilinmediği için bu bir zaman kutusu önerisidir, teslim tarihi garantisi değildir. Kurulu araç eksikse önce engel kaydedilir; kalan iş gün sayısına zorla sıkıştırılmaz.

| Gün | İş | Gün sonunda görülebilir sonuç |
|---|---|---|
| 1 | Ortam/sürüm, kısa özet, grid, kamera ve girdi | Hareket eden karakter, yerleştirilen raf |
| 2 | Envanter transferi, taşıma ve raf | Ürün kaybolmadan al/bırak |
| 3 | Müşteri, kasa ve atomik satış | İlk gerçek satış ve doğru kredi |
| 4 | Su kaynağı/şişeleme ve tıkanma nedeni | Kaynaktan satışa çalışan yol |
| 5 | Tek personel görevi, kayıt/yükleme | Raf işini devret ve kaldığın yerden sürdür |
| 6 | Yerleşim karşılaştırması, hedefli test ve build | Kısa/uzun yol farkı ölçülür |
| 7 | En az 5 dış oyuncu denemesi ve hata düzeltme | Devam/düzelt/durdur kararı ve kısa rapor |

Karar eşikleri başlangıç hipotezidir: en az 4/5 oyuncu yardım almadan ilk satışı 5 dk içinde yapar; en az 3/5 bir yerleşim iyileştirmesinin nedenini açıklar; aynı kritik stok/para hatası iki oyuncuda tekrarlanmaz. Keyif için açık uçlu görüşme alınır; küçük örnek yüzdeleri pazar doğrulaması sayılmaz. Başarısız eşik yeni özellik ekleyerek örtülmez.

### 58.3 Kapsam değişikliği kuralı

Her yeni özellik için oyuncu sorunu, mevcut sistemle çözülüp çözülemeyeceği, en küçük uygulanış, bakım/test yükü ve hangi aşamaya girdiği yazılır. A2'ye yeni özellik alınacaksa eşdeğer yük çıkarılır veya süre/bütçe etkisi kullanıcıya sunulur. Görsel parlatma ilk satış döngüsünü geciktirmemelidir. Bağlam hazırlığı varsayılan 1–2 çalışma günüyle sınırlıdır; araştırma gelişmeyi süresiz ertelemez.

## 59. Ajan iş akışı ve PROJECT_RULES.md şablonu

### 59.1 Depoya taşınacak kurallar

Bu tek devir dosyasındaki aşağıdaki metin, gerçek oyun deposu açıldığında `PROJECT_RULES.md` olarak kopyalanır. Bu çıktı klasörü oyun deposu değildir; şu anda motor veya kaynak proje kurulmuş sayılmaz. Kurallar teknik varsayımları sabitler, kullanıcının talimatlarının yerine geçmez.

```markdown
# Orbit Market — Project Rules

- Önce AGENTS.md, bu kurallar, kısa ürün özeti ve geçerli aşama tablosunu oku.
- Yeni boş projede TypeScript + Three.js + Vite + Capacitor varsayılır; Node, npm, Android Studio ve Xcode hattını doğrula. `package-lock.json` ile sürümleri kilitle. Var olan çalışan projede kullanıcı yönlendirmesi olmadan motor değiştirme.
- Aktif aşama P0'dır; P0 bitmeden A2 kapsamını uygulama. Ayrıntılı GDD bütün özellikleri aynı anda yapma emri değildir.
- Saf TypeScript Domain; Application domain'i kullanır; Three.js Presentation application sorgular; UI komut yollar; Capacitor yalnız yerel kabuk ve plugin sınırıdır. Domain DOM/Three.js/Capacitor'a bağımlı olmaz.
- Bir stok kaynağı, bir simülasyon saati, tipli komut/olay ve benzersiz işlem kimliği kullan. Aynı veriyi UI ve servislerde ayrı ayrı değiştirme.
- Simülasyonda `Date.now()`, `Math.random()`, DOM sırasına bağlı kayıt ve kontrolsüz singleton ağı kullanma. Enjekte simülasyon saati, seed'li rastgelelik ve versioned save DTO kullan.
- Para kayan noktayla tutulmaz; sabit hassasiyet/decimal politikası tek yerde tanımlanır. Tarihsel lot maliyeti fiyat değişince yeniden yazılmaz.
- İçerik sürümlü JSON/TypeScript tanımlarıdır; çalışan scene/mesh referanslarını kaydetme. Kalıcı içerik ID'sini keyfi yeniden adlandırma.
- Gereksiz paket, framework, servis veya yeniden yazım ekleme. Yeni bağımlılığın gerekçesini ve lisansını kaydet.
- Klasörler: src/{domain,application,infrastructure,presentation,content,app}; tests/{unit,integration,device}; docs/{decisions,balance,playtests}.
- PascalCase tip/metot, camelCase yerel değişken kullan. Ekibin mevcut biçimini koru; tek sorumluluklu küçük değişiklik yap.
- Ekonomi, transfer, satış ve kayıt değişikliklerinde hedefli test çalıştır. UI parlatması için gereksiz test altyapısı kurma.
- Commit edilecekler: TypeScript/kaynak, `package-lock.json`, Capacitor config ve gerekli native proje ayarları. node_modules, build/cache, signing key, token ve mağaza secret'ı ekleme.
- iOS ve Android ilk günden build hedefidir. Dikey dokunmatik arayüz ve arka plan kayıt davranışını gerçek cihazda doğrula. Temel oyun çevrimdışı; ödeme/reklam prototipte mock, üretimde ayrı mobil adaptörlerdir.
- Çalışmayan editör/build/test için engeli belirt. Dosya üretmiş olmak oynanabilirlik kanıtı değildir.
- Her teslimde çalıştırma komutu veya editör adımı, build konumu, test sonucu ve kalan riskleri bildir. Kullanıcı onayı olmadan yayınlama veya gerçek ödeme etkinleştirme.
```

### 59.2 Karar günlüğü ve doğrulama dosyaları

Depoda tutulacak küçük dosyalar: `README.md` açılış/build; `Docs/Decisions/DECISIONS.md` tarih, karar, gerekçe, alternatif ve durum; `Docs/Balance/baseline.json` sürümlü ekonomik değerler; `Docs/Playtests/` gözlem notları; `THIRD_PARTY_NOTICES.md` asset/paket lisansları. GDD değerleri veri dosyasına geçirilince her değişiklikte ikisi birlikte güncellenir; kod sabitleri üçüncü bağımsız fiyat kaynağı olamaz.

Her build kimliği editör/paket sürümü, commit ve içerik sürümü içerir. Hedefli testler geçince aynı değişikliği sebepsiz tekrar test etme; daha geniş test kapsamını yeni risk veya hata gerekçelendirmelidir. Nihai performans editördeki FPS ekran görüntüsüyle değil paketlenmiş build ölçümüyle raporlanır.

### 59.3 Açık kararlar ve bunların engellediği aşama

| Açık bilgi | Şimdilik kullanılacak varsayım | Ne zaman zorunlu? |
|---|---|---|
| Ekip sayısı ve haftalık kapasite | Tek geliştirici odaklı küçük prototip | Kesin takvim/bütçe taahhüdünden önce |
| Geliştirme ortamı | Node LTS, Three.js, Capacitor; Android Studio, Xcode hattı | Cihaz build'lerinden önce |
| Asset/ses bütçesi | Lisanslı placeholder, özgün low-poly kübik kit | Son sanat üretimine geçmeden |
| Yayın hesapları ve imzalama | App Store + Google Play hedefi kesin; hesap/anahtar ve macOS hattı açık | İmzalı test dağıtımı/yayın öncesi |
| İlk yayın dilleri | Türkçe ve İngilizce için localization anahtarları; prototip metni Türkçe | Son metin, font ve QA öncesi |
| Gerçek pazar talebi ve kozmetik dönüşümü | Doğrulanmamış hipotez | Tam içerik yatırımını büyütmeden |

Bu bilgiler ilk hareket/üretim prototipini engellemez. Ajan hepsini başta sorarak çalışmayı durdurmaz; bağımlı aşamaya geldiğinde eksik bilgiyi ister. Mevcut ortamda kaynak proje kurulmuş değildir; yalnız devir belgesi güncellenmiştir.

## 61. Three.js + Capacitor teknik sözleşmesi

### 61.1 Katmanlar ve araçlar

| Katman | Teknoloji | Sahip olduğu iş |
|---|---|---|
| Mobil kabuk | Capacitor, iOS/Android native proje | WebView, lifecycle, safe area, native plugin köprüsü |
| Arayüz | HTML + CSS + TypeScript, DOM | HUD, menüler, kartlar, erişilebilir gerçek metin ve dokunma |
| 3B dünya | Three.js `WebGLRenderer` / WebGL 2 | Izometrik kübik çevre, karakter, makine, raf ve etkileşim raycast'i |
| İş kuralları | Saf TypeScript Domain/Application | Para, envanter, üretim, çalışan, müşteri, görev ve olay |
| Kalıcılık | Capacitor Filesystem adaptörü + versioned JSON | Snapshot, işlem günlüğü, sürüm göçü ve kurtarma |
| Dağıtım | Vite web bundle → Capacitor Android/iOS | Asset paketleme, test build'i, mağaza çıktısı |

Resmî Capacitor kılavuzu mevcut web projesini yerel kabuk içinde çalıştırır; Three.js renderer WebGL 2 ister. Sürümler `package-lock.json`'da kilitlenir; Three.js ile Capacitor sürümünü kurulum tarihinde uyumluluk matrisinden doğrula. Prototipte tercih edilen minimum: Node LTS, Vite, TypeScript, Three.js ve `@capacitor/core/cli/android/ios`; UI için framework şart değildir, ilk sürüm DOM/CSS kullanır. React/başka framework ancak etkileşim karmaşıklığı gösterdiğinde eklenir. [Capacitor](https://capacitorjs.com/docs), [Three.js WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html).

Bağımlılık yönü: `ui → application → domain`; `three-presentation → application queries`; `capacitor adapters → infrastructure ports`. Domain simülasyonu `window`, DOM, WebGL, Capacitor veya native plugin import etmez. UI/renderer aynı Application komutlarını çağırır. Tek EconomyLedger ve tek `SimulationClock` bulunur.

### 61.2 Repo sözleşmesi

```text
package.json
package-lock.json
capacitor.config.ts
index.html
src/
  app/{bootstrap,router,lifecycle}
  domain/{economy,inventory,production,staff,customers,quests}
  application/{commands,queries,simulation}
  infrastructure/{save,clock,random,native-store,ads}
  presentation/{world,camera,picking,ui,input,audio}
  content/{items,recipes,machines,events,staff,quests}
  styles/{tokens,components,safe-area}
public/{models,textures,fonts,audio}
tests/{unit,integration,device}
docs/{decisions,balance,playtests}
android/ ios/
```

`capacitor.config.ts`: appId/appName kararlı; `webDir: dist`; path strategy Vite sürümüyle doğrulanmış; server URL/development açıkları release config'e girmez. Yerel platform klasörleri Capacitor tarafından üretilir; özel plist/manifest değişimi dokümante edilir. `npx cap sync` üretilen web asset'lerini iki native projeye senkronlar. Native klasörde elle yapılmış kritik ayar yeniden üretimde kaybolmayacak biçimde config/plugin ile yönetilir.

Önerilen açılış komutları: `npm ci`, `npm run dev`, `npm run build`, `npx cap add android`, `npx cap add ios`, `npx cap sync`, ardından Android Studio/Xcode'da gerçek cihaz build'i. Bunlar şablon komutlardır; projeyi kuran ajan seçtiği paket sürümüne göre README'de doğrulanmış talimatları yazar. Bu belge henüz package.json üretmez.

### 61.3 Three.js sahne kuralları

Bir Three.js Scene, tek perspektif/ortografik kamera kontrolcüsü, tek renderer ve tek `setAnimationLoop()` sahibi vardır. Kullanıcıya izometrik hissi veren orthographic camera tercih edilir; pan/zoom sınırlanır. UI görünürken kamera raycast'i etkileşim almaz. Resize, safe area ve orientation değişimi bir `ViewportService` üzerinden çözülür.

Oyun simülasyonu fixed-step 10 Hz; renderer frame loop'u yalnız çizim yapar. `renderer.setAnimationLoop()` mobil WebGL bağlamıyla uyumlu animasyon döngüsüdür. Render FPS düşmesi mantıkta ürün/para atlatmaz. Cihaz geri kaldığında sınırlı accumulator adımları ve görünür gecikme raporu vardır; sınırsız catch-up yok. Arka plana geçişte döngü durur.

Tekrarlanan ürün görselleri `InstancedMesh` ve paylaşılan geometry/material kullanır. Geometri yeniden kullanılabilir modül havuzundan gelir. Sahne kapatılırken texture, geometry, material ve render target dispose edilir; context-loss/restore olayı ele alınır. Ekran dışı çalışanlar world mesh olmadan Domain'de ilerleyebilir. UI text CanvasTexture olarak rasterize edilmez; DOM'da kalır.

Build içerikleri uygulamayla gelir ve offline açılır; kaynak `.glb` dosyaları gerektiğinde glTF yükleyiciyle optimize edilmiş boyutta paketlenir. İlk P0'da GLB şart değildir: procedurally generated basic geometry ve `InstancedMesh` ile başlanır. `public` asset ID'leri manifest ile içerik ID'lerine bağlanır, native platform path varsayımı yapılmaz.

### 61.4 Yerel plugin sınırı

Capacitor plugin'leri yalnız gerçek cihaz özellikleri için kullanılır: App lifecycle, güvenli dosya depolama, mağaza ödeme adaptörü, uygun ödüllü reklam sağlayıcısı, isteğe bağlı titreşim. Three.js ve Domain bunları doğrudan çağıramaz. Web preview için aynı portların mock implementasyonu vardır. Plugin eklemek dependency ve gizlilik/mağaza beyanı incelemesi gerektirir; reklam/ödeme plugin'i P0/P1'de yoktur.

Ödeme ve reklam için daha önce tanımlanmış idempotency/reward kuralları korunur. Reklam tamamlanma callback'i native'den doğrulanır; yalnız JS olayına dayanarak kozmetik verilmez. Uygulama mağazası SDK'sı güncel App Store/Play politikasına göre seçilir. Bu mimari App Store onayını garanti etmez; Apple özgün uygulama işlevi ister. Ürün tam bir etkileşimli 3B işletme oyunu olacak, yalnız uzaktaki web sayfası kabuğu olmayacaktır. [Apple minimum functionality](https://developer.apple.com/app-store/review/guidelines/).

## 62. Neo-Brutalist UI ve low-poly kübik dünya sanat sözleşmesi

### 62.1 Arayüz token'ları ve bileşenler

| Token | Değer | Kullanım |
|---|---|---|
| `ink` | `#171717` | Kontur, başlık ve birincil metin |
| `paper` | `#F4F0E6` | Ana zemin ve panel |
| `sun` | `#FFE156` | Birincil eylem ve kredi vurgusu |
| `cyan` | `#35D9E6` | Bilgi ve üretim |
| `lime` | `#A7EB52` | Tamamlandı/uygun durum |
| `pink` | `#FC4F8B` | İkaz ve seçili hikâye vurgusu |
| `white` | `#FFFFFF` | Yüksek kontrastlı yüzey |

Kontur 2–3 CSS px; buton sert gölgesi 3–4 px x/y, panel 4–5 px; blur=0; köşeler 6–10 px. Düz renk blokları, gradient yok. Başlıklar 800–900 ağırlık, finansal sayılarda tabular rakam; uzun metinler normal cümle düzeninde. İkonlar SVG, net ve kalın stroke; emoji yok.

Butona dokununca içerik 2 CSS px aşağı iner, gölge 1 px'e küçülür. Titreşim hafif ve kullanıcı tercihiyle kapanabilir. Ağır tekrarlı vibration yok. Renk yanında metin/ikon/doku kullanılır; kırmızı-yeşil tek fark değildir. Yüksek kontrast modu neon vurgu yüzeyinde siyah metin kullanır. Ekran okuyucu için semantik DOM etiketleri ve odak sırası sağlanır.

Neo-Brutalizm oyun HUD'sunda ölçülü kullanılır: konturlar ağırlıklı olarak menü/kart/butonlarda, 3B dünyada siyah çizgiyle her küpü çevreleyen pahalı post-process outline yoktur. Böylece görsel fikir mobil GPU'ya yük bindirmez.

### 62.2 Dünyanın geometri dili

Bir dünya hücresi 1 oyun birimi. Ana yapı küp/prizma, karakter baş-gövde okunur blok siluet, raf modüler basamak, makine en fazla 3–5 büyük parçalı siluettir. Low-poly, her piksel voxel olmak demek değildir: ana form blok, vurgu yüzeyleri düşük sayıda faset kullanır. Dünya yerleşimi mağaza, bahçe ve bağlantı yollarından oluşur; sınırsız arazi üretimi yoktur.

Ana dünya malzemeleri mat ve en fazla 2–3 düz renk/faset varyantlıdır. Tek vertex-color atlas materyali veya küçük atlas, materyal değişimini azaltır. Çizgi efekti gerekirse düşük seviyeli vertex normal genişletme veya seçili nesnede ince CSS/mesh kontur kullanılır; bütün sahnede ekran uzayı outline zorunlu değildir. Yumuşak gölge yerine blob/baked gölge. Hafif renkli çevre ışığı ve unlit/UI uyumlu ton; bloom varsayılan kapalı.

Dünya renk yönü: koyu mürekkep renkli raf metali, kırık beyaz mağaza duvarı, doygun cyan makineler, sarı etkileşimli/oyuncu seçili parçalar, pembe ikazlı fakat güvenli hikâye nesneleri. UI ve world paleti ortak token'lar taşır ama iki katmanda aynı anda bütün aksan renkleri kullanılmaz. Seçim outline'ı yüksek kontrastlı ve ayarlanabilirdir.

Dış çevrenin hayvan, bitki, otopark, araç ve yol bakım kapsamı §65'te tanımlanır; bu çevre mevcut mağaza/bahçe yerleşimini tamamlar.

Oda ve dış dünya yüzeylerinin malzeme/ışık/yaşam ritmi için [DUNYA_YERLESIM_PLANI.md](DUNYA_YERLESIM_PLANI.md) §8 sanat paftası uygulanır. Bu paftadaki dünya tonları yukarıdaki UI tokenlarını değiştirmez; §63 mobil bütçesini ve §62.3 kamera sınırını aşmaz.

### 62.3 Kamera ve kompozisyon

Portrait kompozisyonunda oynanabilir yerleşim ekranın orta %65'inde; üst %12'de kredi/görev; alt %18'de hareket/eylem kontrolü. Bunlar safe-area hariç başlangıç oranlarıdır; küçük iPhone/Android'de prototip testiyle düzenlenir. Karakter veya ana makine HUD altında saklanmaz. Kamera 30–35° aşağı eğim ve 45° yatay grid dönüşüyle gerçek izometrik algı oluşturur; 90° inşa döndürmesi nesne içindir, kamera için değil. Tablet daha geniş sahne gösterir, UI konumunu breakpoint ile değiştirir.

Dokunulabilir ürün/çalışan bilgisi HTML panelde açılır; 3B canvas metinle yarışmaz. İnşa grid'i yalnız build modunda belirir. Placement preview yeşil/sarı/kırmızı düz durum rengi, kontur ve kısa etiket verir. Kritik etkileşim sahne derinliğiyle belirsizleşirse yakınlık önceliği + raycast + UI seçimiyle tek hedef çözülür.

### 62.4 Sanat üretim bütçesi

P0: 12–15 tekrarlanabilir primitive mesh parçası, tek karakter placeholder, su kaynağı/şişeleme/domates yatağı, 1 raf ve 3 UI paneli. A2: açılan üretim/satış istasyonlarının siluetleri ve yerel ürün simgeleri. Aynı modüler parçadan renk değişimi yapılabilir; her içerik için ayrı model üretimi gerekmez. İlk sürüm açılış ekranı oyunu gizleyen sinematik video değildir; oynanabilir 3B dünya açılır.

## 63. Three.js + Capacitor MVP ve mobil doğrulama planı

### 63.1 Teknoloji ve donanım bütçesi

| Ölçüm | Başlangıç hedefi | Ölçüm yöntemi |
|---|---|---|
| Grafik | WebGL 2; düşük profilde iç render kısa kenar 640–720 px | Gerçek Capacitor WebView cihazı |
| Kare hızı | 30 FPS sabit hedef, uygun cihazda opsiyonel 60 | 20 dakika termal ısı testi |
| Pixel ratio | Düşük cihazda en çok 1.25; üstte en çok 1.5 | İç çözünürlük scale dinamik; DPR sınırsız takip edilmez |
| Simülasyon | 10 Hz; adım bütçesi ≤6 ms p95 | WebView profiler ve sabit yoğunluk sahnesi |
| Draw calls | Düşük profilde ≤150 hedef | `renderer.info.render.calls`, mobil profiler ile karşılaştır |
| Bellek | JS+GPU toplam hedef ≤600 MB; platform tepesi ayrıca ölçülür | Android/iOS araçları; WebGL context kaybı izle |
| Mesh | Ekranda ≤150 bin üçgen, ≤25 animasyonlu karakter | Renderer bilgisi ve sahne stres testi |
| Açılış | ≤10 sn ilk soğuk açılış hipotezi | Paketli yerel build; sıcak cache ayrıca raporlanır |
| Bundle | İlk kurulu web içeriği ≤150 MB hipotezi | Sıkıştırılmış store paketi ve kurulu boyut ayrı |
| Pil/ısı | 20 dk testte stabil simülasyon; cihazın termal uyarısına ulaşmama hedefi | En az düşük ve orta seviye gerçek cihaz |

Hardware hedefleri karşılaştırma bütçesidir, desteklenen cihaz garantisi değildir. Three.js `WebGLRenderer` güncel olarak WebGL 2 tabanlıdır; WebGL 2 açılmıyorsa dürüst hata/fallback ekranı gösterilir. Satış veya görev hesabı renderer FPS'ine bağlanmaz.

### 63.2 Aşama güncellemesi

| Aşama | Web oyun işi | Mobil paket işi | Başarı kanıtı |
|---|---|---|---|
| P0 | Vite/TS, Three.js scene, kübik zemin, dokunmatik kamera/karakter, bahçe su kaynağı/şişeleme/domates, dört satış ürünü, müşteri/raf/kasa, local save | Capacitor init; aynı gün Android ve iOS native proje üretimi | Telefonda 3–8 dk oynanabilir; interruption sonrası kayıt sürer |
| A2 | İlk işlenmiş gıda ve mandıra/içecek, depolama, bir çalışan, temel ekonomi HUD | Android test APK + Xcode'da gerçek iOS cihaz build'i | İki platformda işlev paritesi ve UI safe-area |
| A3 | Personel/mola, bakım, sözleşme, kalite, room layout | Native lifecycle/save adapter ve gerçek cihaz profiling | 20 dk ısı/pil testi; crash ve context-loss recovery |
| A4 | Bütün ürün/görev/final içeriği | Reklam/IAP provider sandbox'ı, satın alma restore | Store testflight/internal-test akışı; mağaza beyanları |
| A5 | Son denge ve erişilebilirlik | Signed iOS archive/TestFlight ve Android AAB, store metadata | Apple/Google inceleme paketleri ve test raporu |

iOS native build için macOS/Xcode erişimi gerekir. Geliştirici ortamı bunu sağlamıyorsa Android/WEB preview geliştirmesi ilerleyebilir fakat iOS doğrulaması tamamlandı denmez. Capacitor'ın web çalıştırması uygulamanın App Store onayı garantisi değildir; oyun gerçek, yerel paket içinde sunulan oynanabilir Three.js deneyimidir. Apple'ın minimum functionality kuralı incelenir.

### 63.3 İlk oynanabilir ekran

Uygulama açıldığında önce bir web landing sayfası değil, kübik yerleşimin çalışan oyun sahnesi görünür. Canvas ekranın ana alanı; DOM tabanlı Neo-Brutalist HUD üst/alt safe-area içinde. P0 prototip hedefi: karakter spawn → yüzen kontrol veya dokun-git → kaynak alma → makineye bırakma → ürün raflama → bir müşterinin satın alması → kredinin değişmesi. Bu zincirin her adımında UI/DOM ve Domain tek bir transaction kimliği kullanır.

P0'dan çıkarılanlar: gerçek reklam/IAP, native plugin dışında cihaz özelliği, tam NPC/kontrat kataloğu, bütün Neo-Brutalist animasyon ayrıntısı ve son sanat. Önce üç platform build'i değildir: web preview yanında gerçek bir Android ve gerçek bir iOS Capacitor build'i hedeflenir; salt simulator performans kanıtı olmaz.

### 63.4 Build ve Capacitor kuralları

Vite `base` ve asset URL'leri Capacitor'un local bundle path'inde çalışacak biçimde ayarlanır. Absolute root path, remote URL veya `localhost` production bundle'a gömülmez. `npx cap sync` sonrasında Android Studio/Xcode projeleri açılıp bundle id, app name, signing ve privacy açıklamaları eklenir. `CAPACITOR_SERVER_URL` sadece geliştirme konfigürasyonunda olabilir; release config'de açık remote server kalmaz.

Native plugin sayısını düşük tut. Başlangıçta lifecycle, güvenli dosya ve titreşim plugin ihtiyacını platform API'si ve Capacitor resmi pluginleriyle çöz. Tek bir React Native webview veya plugin SDK yüzlerce megabayt ekliyorsa boyut bütçesi yeniden değerlendirilir. Reklam/IAP entegrasyonu provider araştırması, store kuralları ve sandbox testinden önce yoktur.

### 63.5 Kabul testleri ve teknik riskler

1. Three.js sahnesi `renderer.setAnimationLoop()` kullanır; arka plana geçince animasyon ve oyun simülasyonu durur.
2. WebGL2 context-loss simüle edilir; uygulama sahneyi güvenle yeniler veya yerel, anlaşılır hata ekranına gelir. Kaydedilmiş ekonomi kaybolmaz.
3. `renderer.info` ile sahne draw calls ve üçgen sayısı P0/A2 yüklerinde ölçülür; rakam tahmin diye sunulmaz.
4. DPR 3 olan telefonda GPU canvas limitsiz 3× çözünürlüğe çıkarılmaz; çözünürlük scale termal yükte düşebilir.
5. `npm run build` asset pathlerini doğrular; `npx cap sync` sonrası app internet kapalıyken açılır.
6. Gerçek Android telefon ve iPhone'da portre layout, safe areas, touchcancel, iki parmak zoom ve OS geri/uygulama dönüşü çalışır.
7. Native izin istemi veya reklam/ödeme yokken P0 hiçbir gereksiz OS permission açmaz.
8. UI butonuna basmak Three.js raycaster'ı tetiklemez; seçilen nesne UI overlay altında kalmaz.
9. Yüksek kontur ve sert gölge sistemi low-spec telefonlarda UI compositing'i aşırı yavaşlatırsa CSS katmanları azaltılır; görsel yönü korunarak etki sadeleştirilir.
10. Her platformda debug WebView inspector kapatılır, release kaynak haritası/gizli URL/secret kontrol edilir.

Three.js WebGL tabanı, Capacitor yerel kabuk ve Neo-Brutalist/low-poly sanat kararı bu belgeyle sabitlenmiştir. Gerçek cihaz performansı, WebGL2 cihaz uyumluluğu, mağaza kabulü ve ödeme/reklam plugin uyumu henüz test edilmemiştir. Ajan, bunları çalıştırılmış build ve cihaz kanıtı olmadan tamamlandı diye raporlamaz.

## 60. Mobil ürün sözleşmesi — önceki Unity tasarımı

Dokunmatik tasarım niyeti geçerlidir; Unity ve IL2CPP build adımları bölüm 61–63'teki Three.js/Capacitor yaklaşımıyla değiştirilmiştir.

Bu bölüm kullanıcı tarafından düzeltilen platform kararını bütün sisteme uygular. İki platform da ilk sürüm hedefidir; Android'de bitirip iOS'u sonradan düşünme yaklaşımı kullanılmaz. Önceki Steam bağlantıları yalnız rakip araştırma kaynaklarıdır, yayın planı değildir.

### 60.1 Ekran yönü, dokunma ve kamera

Varsayılan ürün kararı **portrait/dikey telefon**dur. 9:16–9:21 telefon oranları ve portrait tablet için uyarlanır. İnşa derinliği korunur; yatay zorunluluk eklenmez. Tablet görünümü daha geniş yan detay alanı kullanabilir; yeni oyun kuralları üretmez. Yatay yön desteği ilk sürüm dışında, kullanıcı testinin gerekçelendireceği sonraki karardır.

HUD üstünde kredi, duraklat ve tek etkin görev; altta hareket alanı ve en fazla üç ana eylem. Gelişmiş ekonomi tabloları küçük masaüstü tabloları olarak küçültülmez: SKU satırları kartlaşır, detay dokununca açılır. Aynı anda yalnız bir ana yönetim sayfası görünür. Safe area, çentik, home indicator ve Android gezinme alanları hesaba katılır.

Dokunma hedefi tasarım tabanı: iOS'ta en az 44 mantıksal pt, Android'de 48 dp eşdeğeri; CSS pikseli/viewport gerçek cihazda doğrulanır. Canvas'taki seçim alanı görünür arayüz düğmelerinden ayrı hit target alabilir. Metin ölçeği, yüksek kontrast, titreşim/ses kapatma ve azaltılmış hareket seçenekleri bulunur. Uzun basış hiçbir kritik eylemin tek erişim yolu değildir.

Karakter hareketi için yüzen çubuk varsayılan; dokun-git erişilebilir alternatiftir. Bir istasyon yakınında durunca işlem hedefi vurgulanır; 0,3 sn sabit kalmadan otomatik transfer başlamaz. Transfer yalnız daha önce belirlenmiş uyumlu raf/makine hedefinde olur. Yoldan geçerken para harcama, işçi alma, tarif değiştirme veya ürün satma yoktur. Oyuncu/personel aynı ürüne uzanırsa mevcut rezervasyon kazanır; ürün sıçramaz.

İnşa: nesneye dokun → sürükleme tutamacı → ızgara önizlemesi → döndür → onay/iptal. İki parmak pan/zoom, hareket çubuğu devre dışıyken çalışır. Yanlış dokunuşla modül satılmaz; satma ayrı eylemdir. 90 derece kamera dönüş düğmeleri seçilebilir. Tek aktif pointer sahibi ile dünya ve UI aynı dokunuşu işlemez.

### 60.2 Kısa oturum ve öğretim revizyonu

**27 Eylül 2026 kapsam değişikliği:** Önceki sözleşme kısa oturumu ve hedef bitiminde durmayı öne çıkarıyordu. Yeni ürün yönü, bir döngünün tamamlanmasıyla erişilebilir sonraki hedefi ve diğer hazır işleri kesintisiz göstermeyi amaçlar; oyuncu isterse aynı oturumda sürdürür. Aşağıdaki 3–5 dakikalık öğretim basamakları artık zorunlu oturum sonu değildir. Kayıt/çıkış ve arka plan güvenliği sürer; dış bildirim, çevrimdışı üretim ve giriş cezası eklenmez.

Önceki 20 dakikalık öğretim aynı oturuma zorlanmaz. İlk 60 saniye hareket/taşıma; 1–3 dakika ilk satış; 3–5 dakika kendi üretim partisi; sonraki oturumda raf düzeni ve personel; sonraki oturumda depo/tedarik. Metin 1–2 kısa cümlelik kartlar hâlindedir ve atlanabilir. TutorialState kayıtla korunur.

900 saniyelik oyun günü, üretim tarif süreleri ve ekonomi tabloları korunur. Üç dakikalık oturum günün bir bölümünü oynatır; gerçek dünyada bekleme gerekmez. Kontrat ve final sınavı kesinti sonrası kalan aktif süreden devam eder. Arka plana atıp geri gelmek sınav müşteri seed'ini veya kötü sonucu yeniden seçmez.

Finalin bir günlük hizmet sınavı birkaç oturuma bölünebilir. Müşteri sepetleri, kabul eşikleri, kuyruk beklemeleri ve ölçüm toplamları kaydedilir; uygulama kapalıyken süre ilerlemez. Kapanışta müşterileri ücretsiz boşaltıp sınavı kolaylaştırma istismarı engellenir. Bildirim zorunluluğu, offline kayıp ve enerji/can bekleme sistemi eklenmez.

### 60.3 Uygulama yaşam döngüsü ve kayıt güvenliği

Durumlar: ForegroundRunning → PausedByUI / PausedByPlatform → CheckpointRequested → Background. Dönüşte ResumeReady → kullanıcı devamı → ForegroundRunning. Reklam, ödeme penceresi, gelen arama ve ekran kilidi platform duraklatmasıdır. SDK kapanış callback'i tek başına simülasyonu başlatamaz; uygulamanın gerçekten foreground olması da gerekir.

Web visibility ve Capacitor pause/focus sinyalleri yinelenebilir. Tek LifecycleCoordinator bunları birleştirir; iki kayıt, iki ödül veya iki resume üretmez. OS süreci haber vermeden sonlandırabilir; yalnız shutdown callback'ine güvenilmez. 30 aktif saniyelik checkpoint ve kritik işlem günlüğü bu yüzden gerekir.

Kalıcı günlük append-only, transactionId/sequence/checksum içerir. Kritik para/envanter değişiminin durable kaydı onaylanmadan oyuncuya tamamlandı gösterilmez. Snapshot son kapsadığı sequence değerini taşır. Yüklemede snapshot sonrasındaki tam kayıtlar bir kez uygulanır, yarım son satır reddedilir; ekonomik işlem yarım uygulanmaz. Günlük küçültme ancak yeni snapshot ve yedek doğrulanınca yapılır. Sıradan hareket için en fazla checkpoint aralığı kadar konum geri dönüşü kabul edilebilir; doğrulanmış satın alma/final teslimi için değildir.

SaveService aynı anda tek yazıcı kullanır; temel kayıt uygulamanın kalıcı özel veri alanındadır, cache değildir. Depolama yetersizliği sessizce yeni kayıt oluşturmaz. Satın alma hakları cihaz kaydından ayrı geri yüklenir. İlk sürümde iOS↔Android bulut kayıt/kozmetik aktarımı vaat edilmez; aynı mağaza hesabında hak geri yükleme desteklenir. Hesapsız yerel kayıt silinince kurtarılamayabileceği ayarlarda açıkça yazılır.

### 60.4 Mobil performans, pil ve indirme

30 FPS varsayılan; 60 FPS kullanıcı tercihi ve cihaz performansına bağlıdır. Termal baskıda render ölçeği, gölge, parçacık ve animasyon ayrıntısı kademeli düşürülebilir; tarif süresi, müşteri talebi ve ekonomi değişmez. Yavaş cihazda simülasyon adımı sınırı aşıldığında borçlu adımlar görünür ölçülür; sınırsız catch-up döngüsü yaratılmaz, simülasyon oyun saatiyle birlikte yavaşlayabilir. Frame süresine bağlı üretim avantajı olmaz.

Ekrandaki her stok birimi ayrı Three.js Mesh değildir; rafta temsilî görsel yığın, mantıkta tam adet kullanılır. Instanced geometry, atlas ve havuzlanmış animasyonlar kullanılır. Tick başına tüm dünyayı taramak yerine değişim tabanlı görevler, sınırlı yol arama bütçesi ve rota önbelleği uygulanır.

İlk indirmenin sıkıştırılmış hedefi ≤200 MB, kurulu temel içerik ≤500 MB; mağaza limiti iddiası değil ürün bütçesidir. Reklam SDK'sı dahil boyut ayrıca raporlanır. Temel oyun ilk açılışta zorunlu ek indirmeye ihtiyaç duymaz. P0 gerçek cihazda en az 10 dakika; A2 ve son sürüm en az 20 dakika ısı testi görür. Aşırı pil tüketimi emülatörle değerlendirilemez.

### 60.5 Ödeme, reklam ve gizlilik adaptörleri

Kozmetikler kalıcı/non-consumable ürünlerdir. Apple IAP ve Google Play Billing için ortak domain arayüzü, ayrı Capacitor native plugin/adaptörleri kullanılır; plugin seçimi bakım durumu ve Capacitor uyumu doğrulanınca yapılır. `Pending`, kullanıcı iptali, parental approval, bağlantı kaybı, refund/revoke ve restore ayrı durumdur. Android purchase acknowledgment ve Apple transaction finishing mağaza adaptörü gereksinimine göre yapılır; hak kaydı idempotent tutulur. Web oyun katmanı SDK'yı doğrudan çağırmaz.

Geliştirme sandbox/test kullanıcıları ve test reklam kimlikleriyle yapılır. Üretim API anahtarları kaynak depoya yazılmaz. Gerçek ödeme onayı mağazanın yerel ekranında gerçekleşir. Fiyat para birimi ve yerelleştirilmiş toplamıyla gösterilir. Bölgesel alternatif ödeme/harici ödeme bağlantısı ilk sürümde yoktur. [Apple inceleme kuralları](https://developer.apple.com/app-store/review/guidelines/), [Google Play politika kaynağı](https://support.google.com/googleplay/android-developer/answer/16329168?hl=en).

Reklamlar kullanıcı başlatmalı kozmetik ödüllüdür. Bölüm 51 sınırları korunur: 24 saatte en fazla 3 başarı, iki başarı arasında 20 dakika; istemeyen kullanıcı için ücretsiz görev yolu. Reklam yüklemek bile gerekli gizlilik tercihlerinden önce yapılmaz. İzleme izni reddi oyun veya ödül hakkını cezalandırmaz. iOS'ta ATT, reklam izleme onayından farklıdır: uygulamalar arası takip yapılacaksa gerekli sistem izni ve sağlayıcı davranışı uygulanır; takip yoksa sırf reklam var diye gereksiz izin istenmez. [Apple App Tracking Transparency](https://developer.apple.com/documentation/apptrackingtransparency).

App Store gizlilik beyanı, kullanılan SDK'ların privacy manifest/required-reason API gereksinimleri, Google Play Data safety ve reklam beyanları gerçek veri akışıyla eşleşmelidir; kopya metinle doldurulmaz. OS/SDK/mağaza hedef sürümleri yayın tarihinde yeniden doğrulanır. Bunlar yayın garantisi değildir. Hedef yaş grubu seçilmeden çocuklara yönelik reklam profili oluşturulmaz.

### 60.6 Build ve dağıtım hattı

- Android: Capacitor Android projesi, Android Studio ve uyumlu SDK/JDK; test APK'sı ve Play AAB'si. Keystore güvenli tutulur; WebView GPU/texture gerçek cihazda doğrulanır.
- iOS: Capacitor iOS projesi → macOS/Xcode archive → TestFlight. Bundle ID, takım ve provisioning Xcode'da ayarlanır. Mac/Xcode hattı yoksa iOS build engeli kaydedilir; Android başarısı iOS başarısı sayılmaz.
- P0'nun ilk haftasında her iki platforma en az bir cihaz build'i hedeflenir. İmzalama hesabı bulunmaması editör geliştirmesini durdurmaz ama iOS kabulünü tamamlamaz.
- A5'te App Store Connect ve Play Console test kanalları, mağaza görselleri, privacy/support bağlantıları, yaş/içerik beyanı ve gerçek cihaz raporları hazırlanır. Yayın yüklemesi ayrıca yetkilendirilir; belge güncellemesi yayın yetkisi değildir.

### 60.7 Mobil pazar bağlamı

My Mini Mart mobil ana etkileşim referansıdır; [Google Play sayfası](https://play.google.com/store/apps/details?id=com.KisekiGames.smart&hl=en) reklam ve uygulama içi satın alma içerdiğini belirtir. Bu, bizim gelir oranımızı veya oyuncuların reklama toleransını doğrulamaz. Önceki Steam yorumları yalnız genel yönetim UX sinyalidir, mobil pazar kanıtı değildir.

Yeni test segmentleri: telefonda tek elle 3–5 dakika deneyen oyuncu ve telefonda/tablette 15 dakika planlama yapan oyuncu. İlk testte en az iki küçük ekran, iki Android performans sınıfı ve bir iOS cihazı bulunmalı. Ölçümler ilk anlamlı eylem süresi, yanlış dokunuş, başparmağın kritik bilgiyi kapatması, metin okunabilirliği, arka plan sonrası doğru devam ve ısıdır. Uzun masaüstü oturum metrikleri tek başına kullanılmaz.

### 60.8 Mobil kabul testleri

1. P0 klavye/fare olmadan telefonda oynanır; güvenli alan dışında kritik kontrol bulunmaz.
2. 20 kez arka plan/geri dönüş ve farklı işlem anlarında zorla sonlandırma stok/para çoğaltmaz; kritik günlüğe yazılmış işlem kaybolmaz.
3. Finalin ortasında ekran kilitleme müşterileri veya bekleme sayaçlarını sıfırlamaz; aynı seed ve kalan süre devam eder.
4. Reklam/ödeme penceresi + gelen arama + geri dönüş birleşiminde çift ödül ve erken resume oluşmaz.
5. Uçak modunda çekirdek oyun sürer; reklam/mağaza unavailable durumunu gösterir, sonsuz spinner yoktur.
6. Sağ/sol el, dokun-git, metin büyütme ve az hareket seçenekleriyle temel görev tamamlanır.
7. Düşük sınıf cihazda 20 dk ısı testi, 60 müşteri mantıksal yükü ve reklam açılış bellek tepesi ölçülür; render kalitesi ekonomi sonucunu değiştirmez.
8. Sandbox satın alma, pending, cancel, restore ve refund iki platformda ayrı doğrulanır.
9. Android sistem geri eylemi önce açık paneli kapatır; yanlışlıkla uygulamadan atmaz. iOS için zorunlu “uygulamayı kapat” düğmesi tasarlanmaz; otomatik kayıt ve ana menü yeterlidir.
10. Mağaza APK/AAB/Xcode çıktıları ve imzalı cihaz build'leri birbirinden ayrılarak raporlanır. Gerçek cihaz yoksa test tamamlandı denmez.

Revizyon sonucu: Üretim, personel, depo, RPG ve üç final korunmuştur; bunların erişimi dokunmatik, kısa oturum, mobil performans ve güvenli kesinti üzerine yeniden kurulmuştur. Oyun kodu, mağaza hesabı, SDK entegrasyonu veya cihaz build'i bu belge düzenlemesi sırasında yapılmamıştır.

## 64. Market ritmi ve yeni aday mekanikler — 27 Eylül 2026

Bu bölüm A–E önerilerini fazlı **ürün adayı** olarak kaydeder; §58.1 P0 kapsamını genişletmez. Aşağıdaki sayılar oyuncu/cihaz ölçümü değil başlangıç denge hipotezidir. Her mekanik gerçek Domain durumunu ve Application komutunu kullanır; görsel, ses veya dokunma efekti para/stok üretmez. Her ekonomik işlem tek transaction kimliğiyle kalıcı onay alır. Yeni çarpanlar §27, §32, §37–38 ve olay sınırlarıyla birlikte hesaplanır; aynı etki iki kere uygulanmaz.

| Aday / ilk değerlendirme fazı | Oyuncu kararı ve ekonomik bağ | Görünür sonuç, başarısızlık ve sınır |
|---|---|---|
| VIP teftişi / A3 olay altyapısından sonra A4 | Kooperatif başkanı veya Baş Mühendis'in önceden görünen ürün/hizmet isteğini karşıla ya da geç; ödül/itibar olay tanımında açık olur. | Süre yalnız aktif oyun zamanıdır; eksik teslim açıkça sonuçlanır, stok yalnız gerçek teslimde düşer. Aynı ziyaret kayıt dönüşünde ikinci ödül vermez. |
| Hijyen ve koku / A3 oda sistemi sonrası A4 | Somut ve seyrek kirlenme olayını gör; ücretsiz temizle veya uygun Şifahane sabun/kolonyası lotunu kullan. Sarf kullanımı tek stok işlemidir. | Sürekli temizlik sayacı/angaryası oluşturmaz. Hijyen hizmet deneyimini etkiler; gizli satış çarpanı değildir. Sarf yoksa ücretsiz temizlik yolu açık kalır, raf veya temel zincir kilitlenmez. |
| Mahalle Bülteni / A3 teşhis sonrası A4 | Gerçek satış, kuyruk ve hizmet olayının nedenini → seçilen müdahaleyi → gözlenen sonucu oku. | Tek kaynak mevcut olay ve teşhis kaydıdır; bağımsız puan/itibar döngüsü, sahte sosyal kullanıcı veya ayrı ledger kurulmaz. Olumsuz sonuçta yapılabilir adım görünür. |
| Günün Hasadı teşhiri / A3 fiyat-raf sistemi sonrası A4 | Tek uygun SKU'yu vurgu tezgâhına ata veya kaldır. Başlangıç hipotezi normal satış hızına **+%200**, yani 3× hedefidir. | Gerçek stok, müşteri talebi, bütçe, kuyruk ve mevcut fiyat sınırları geçerlidir; stok yoksa satış yoktur. Teşhir talebi ve olay çarpanı üst üste gizlice katlanmaz; hız mevcut müşteri gelişini aşamaz. |
| Esnaf pazarlığı / A4 | Yalnız katalogda uygunluğu tanımlanan Tier 4 zanaat ürünü için isteğe bağlı teklif seç; Tier 5 açılmaz. | Başlangıç kâr hedefi +%20–30 hipotezidir; kabul edilmeyen teklifte lot korunur. Kabul, mevcut fiyat/zarar uyarısı ve satış ledger'ından geçer; mini oyun ikinci para kaynağı değildir. |
| Sabah haberi ve trend / A3 sınırlı olaylardan sonra A4 | Ön habere göre stok, fiyat veya vardiya planla. | Olay mevcut EventDirector takvimi ve sınırını kullanır. Başlangıçtaki “balık iki katı” yalnız örnektir; katalog/§37–38 fiyat sınırı doğrulanmadan bağlayıcı olmaz. Olay kapalıysa trend de doğmaz. |
| Vardiya değişimi dalgası / A3 vardiya sistemi sonrası A4 | Ön haberle raf ve personeli hazırla veya müşteri alımını yönet. Başlangıç penceresi 60 **aktif** saniyedir. | Mevcut müşteri kapasitesi ve kuyruk/sabır kuralları sürer; onlarca yeni aktör zorunlu değildir. Kayıt/arka plan dönüşünde pencere aynı tick'ten devam eder, tekrar müşteri çekilmez. |
| Dekor cazibesi / A3 oda sistemi sonrası A4 | Ücretsiz işlevsel saksı, kilim, fener veya tabela yerleştir; cazibe alt skorunu gör. | §32 oda/dekor üst sınırı içinde hesaplanır; mevcut estetik etkisi ikinci kez sayılmaz. Ücretli görünüm aynı işlevsel nesneden daha fazla cazibe veya zengin müşteri hakkı vermez. |

**Birleşik sunum:** VIP isteği, sabah trendi ve vardiya dalgası ayrı zorunlu açılır pencere/ödev listesi oluşturmaz. A3 olay altyapısı doğrulandıktan sonra A4'te değerlendirilecek tek Mahalle Gündemi kartı en yakın gerçek olayın ön bilgisini, oyuncunun isteğe bağlı tek hazırlık kararını ve sonucu gösterir. EventDirector, kapasite, cooldown, kayıt ve olayları kapatma seçeneği korunur. Kart hiçbir görevi kendiliğinden kabul etmez; bir olay bitince ekonomik işlem veya yeni olay otomatik çalışmaz.

**Deneyim yönü:** P0 al–taşı–rafla–sat döngüsü deterministik ve okunur kalır. Uyumlu istasyondaki 0,3 saniyelik bekleme mevcut §60.1/D-018 etkileşim süresidir; suyun üretim veya transfer süresini 0,3 saniyeye indirmez. Taşıma yükü ancak mevcut ekipman/hız kuralına göre yavaşlatır; yeni evrensel −%10 ceza yoktur. Alma, taşıma ve koyma için üç aşamalı ses/hareket ritmi A4 sanat adayıdır: hafif haptik isteğe bağlı, ses kapatılabilir, D-025 eşzamanlı ses sınırı geçerlidir. Tam ekran panel yerine bağlama uygun küçük DOM paneli tercih edilir; kayıt hatası, erişilebilirlik ve kritik onay ekranları gerektiğinde tam görünür kalır.

**İlerleme ve görsel sahiplenme:** Göl ve sonraki gerçek alanlar kilit gerekçesiyle siluet olarak görülebilir; sahte açılma vaadi yoktur. Tamamlanan hedef ardından bir sonraki erişilebilir hedef gösterilir; bir hedefin zorunlu olarak iki yeni kilit doğurması gerekmez. Seçilen dükkân adı yerel kayıt ve güvenli metin sınırlarıyla tabela/NPC hitabında kullanılabilir. Makine yükseltmelerinin paslı demir→pirinç veya tahta→oymalı taş görünümü, gerçek yükseltme durumundan türetilir. Ham→işlenmiş→ileri ürünlerde mat/koyu, temiz/açık ve sıcak/altın renk evreleri sanat yönüdür; lot kalite/fiyatını renk efekti belirlemez. Bloom ve yeni mesh yükü §63 bütçesini aşamaz.

**Sürpriz ve fırsat hipotezleri:** Seed'li ekonomik RNG'de hasat/av için %15–20 küçük bonus sıklığı bir deney değeridir; tanımlı girdi, ürün ID'si, lot ve kayıt sürümü olmadan uygulanmaz. Nadir inci katalogdaki gerçek üründür; rastgele ödülün yerine kozmetik sandık veya ücretli çekiliş konmaz. Sıcak ekmeğin ilk 3 aktif dakikada rafa konmasına +%25 kâr önerisi fiyat, maliyet ve raf lotu korunumu doğrulanınca test edilir; süre geçince ürün yalnız normal fiyata döner. Bu bonuslar VIP, trend, teşhir, kalite ve dekor ile gizli çarpım zinciri oluşturmaz. 50→150→300→500 kredi mikro hedefleri ve “her üç dakikada zafer” ifadesi bağlayıcı ekonomi değeri değildir; §26/katalog maliyetleri değiştirilmeden hedef sunumu denenir.

**Bilimsel iddia sınırı:** Dopamin ödül tahmin hatası öğrenmeyle ilişkili bir modeldir; belirli bir Orbit eyleminin “dopamin patlaması”, kalıcı alışkanlık veya zorunlu sıkılma yarattığı sonucu çıkarılamaz ([Schultz](https://www.nature.com/articles/nrn.2015.26)). Özerklik, yetkinlik ve ait olma tasarım gerekçesidir ([Self-Determination Theory](https://selfdeterminationtheory.org/topics/application-basic-psychological-needs/)). Schüll'ün “machine zone” kavramı kumar bağlamında incelenmiştir; burada oyuncu durumu veya 8–12 Hz alfa dalgası ölçülmüş değildir ([kitap bölümü](https://assets.press.princeton.edu/chapters/i9156.pdf)). Freud, Lacan, Han ve Jung göndermeleri anlatı/sanat metaforudur; klinik ya da nörolojik etkinlik kanıtı değildir.

## 65. Yaşayan dış çevre, otopark ve yol bakımı — 27 Eylül 2026

**Kapsam:** Kullanıcının yaşayan dünya talebiyle A4 çevre içeriği olarak eklenmiştir. §58.1 P0 → A2 → A3 → A4 → A5 sırası korunur; P0'nun tek oda ve temel üretim kanıtına yeni sistem eklemez. §62'nin kübik low-poly dili ve §63'ün toplam cihaz bütçesi geçerlidir. Aşağıdaki davranışlar tasarım sözleşmesidir; üretilmiş asset, çalışan kod veya oyuncu/cihaz kanıtı değildir.

### 65.1 Yerleşim ve doğal çevre

Marketin önünde kaldırım, açık yaya girişi, otopark ve bağlantı yolu bulunur. Bahçe kenarında ağaçlar, çalılar, ot/çiçek kümeleri, küçük taşlar ve seyrek kayalar yerleşime çeşitlilik verir. Bank, çöp kutusu, bisiklet parkı, yol lambası ve alçak çit çevreyi tamamlayan sanat seçimleridir. Teslim alanı ve müşteri girişi ayrı okunur; dekor kapı, kasa, servis hücresi ve temel üretim rotasını kapatmaz. Dünya mevcut işletme çevresinde kalır; sınırsız arazi veya uzak bölge seyahati eklenmez.

Ağaç ve taşlar bu kapsamda peyzajdır; kendiliğinden odun/maden kaynağı veya hasat edilebilir nesne sayılmaz. Bitki salınımı, yaprak hareketi ve renk/siluet çeşitleri görseldir; yeni mevsim, hava veya ürün verimi kuralı oluşturmaz.

### 65.2 Hayvanlar ve çevrede yaşam

Kedi, köpek ve koyun dünyada görünür. Kediler sakin kenarlarda dolaşır, gerinir ve uyur; köpekler kısa gezinme, çevreyi izleme ve dinlenme davranışları gösterir. Koyunlar bahçe yanındaki çevrili yeşil alanda otlanır ve küçük gruplar halinde yer değiştirir. Seyrek kuş konması/uçuşu isteğe bağlı sanat ayrıntısıdır. Davranışlar tek uzun tekrar yerine bekleme ve kısa hareketlerle çeşitlenir.

Hayvanlar bu çevre kapsamıyla müşteri, çalışan veya üretim makinesi olmaz; koyun görünmesi süt/yün stoku yaratmaz. Besleme, sahiplenme veya hayvancılık ekonomisi ayrıca tanımlanmadıkça satın alma/ödül eylemi gösterilmez. Hayvan rotaları mağaza iş akışından ve araç yolundan ayrılır; çarpılma, saldırı veya oyuncuya zorunlu müdahale olayı eklenmez. Yakındaki hayvan ana makine seçimini çalmaz.

### 65.3 Market önü otoparkı ve araçlar

Araç akışı yaklaşma → uygun park yerini ayırma → park etme → bekleme → çıkış yolunu kullanma → sahne dışına ayrılmadır. Görünür yer sayısıyla doluluk tutarlı olur; aynı park yeri iki araca verilmez, ayrılan aracın yeri serbest kalır. Park doluysa yeni ortam aracı güvenli biçimde geçip gider; girişte sınırsız kuyruk oluşmaz. Yaya geçişi ve teslimat erişimi açık tutulur.

Başlangıç araç sanatı küçük otomobil ve van gibi birkaç tekrar kullanılabilir siluettir. Oyuncunun araç kullanması bu kapsamda yoktur. Ortam araçları müşteri spawn'ı, talep, satış veya park geliri üretmez. Gerçek müşteri araçla temsil edilecekse aynı ziyaret kimliğiyle eşlenir; araçtan inme ikinci müşteri yaratmaz, park doluluğu mevcut talebi azaltmaz. Gerçek teslimatla eşlenen van yalnız kayıtlı teslim durumunu gösterir; araç animasyonu ürün kabulü veya stok aktarımı yapmaz.

### 65.4 Zamanla aşınan yol ve dönemsel tadilat

Yol görsel olarak bakımlı → kullanılmış → aşınmış → bakımda → yenilenmiş evrelerinden geçer. Çizgilerin solması, hafif lastik izleri, çatlak ve yama katmanları aşınmayı gösterir. Dönemsel bakımda sınırlı bir yol parçasında koni, bariyer, bakım ekibi ve küçük servis aracı görünür; tamamlanınca ekip ayrılır, yeni kaplama/yama ve çizgiler kalır. Her seferinde bütün yolun aynı anda eskimesi veya kapanması gerekmez.

Aşınma ve bakım evresi yalnız aktif simülasyon zamanıyla ilerler; cihazın gerçek saati ve arka planda geçen süre uygulanmaz. Yol kesiminin kimliği, evresi, birikmiş aktif süresi ve devam eden bakım olayı kayıtta korunur; yüklemede yol bedelsiz sıfırlanmaz veya bakım baştan başlamaz. Kalıcı durum Domain'de tutulur, sahne yalnız görünümünü üretir. Görsel varyasyon için ekonomi RNG'sinden ayrı seed kullanılır.

Şantiye yerleşimi market girişi, yaya geçişi, teslim ve araç çıkışını açık bırakacak şekilde seçilir. Erişimi koruyamayan kesimde bakım başlatılmaz; sahte engelle oyuncu kilitlenmez. Bu kapsamda aşınma satış cezası, araç hasarı, teslim gecikmesi veya zorunlu tamir borcu doğurmaz. Gelecekte işletme etkisi istenirse ayrı kaynak/ekonomi ve kurtarma kuralları gerekir.

### 65.5 Sunum, kayıt ve kabul sınırları

Hayvanlar, araçlar ve ekipler mevcut sahne bütçesini paylaşır; her yeni sınıfa ayrı 25 karakter hakkı verilmez. Statik bitki/taşlar tekrar kullanılabilir mesh/atlas ile, kalabalık çevre düşük profilde azaltılmış yoğunlukla sunulur. Görsel azaltma kayıtlı yol evresini veya gerçek müşteri/teslimat sonucunu değiştirmez. Sesler seyrek ve kapatılabilir, az harekette bitki salınımı ve ikincil animasyonlar sadeleşir.

Yol evresi ve bakım ilerlemesi kalıcıdır; salt dekoratif hayvan/araç pozları güvenli başlangıç noktalarından yeniden kurulabilir. Yeniden kurulum park rezervasyonlarını tutarlı yeniden oluşturur; gerçek müşteri/teslimata bağlı kimlikleri çoğaltmaz. Telefon HUD'suna yeni zorunlu menü eklenmez; gerekirse yol seçilince kısa bakım durumu gösterilir, kamera otomatik olarak olayın üzerine çekilmez.

**A4 başlangıç sanat/ritim değerleri:** [Yerleşim paftası §13](DUNYA_YERLESIM_PLANI.md) dört görünür park cebi, çevre aktörü üst sınırı, 30–60 aktif saniyelik seyrek araç beklemesi ve W1–W3 yol kesimleri için aktif saniye eşikleri verir. Bunlar ekonomi, talep veya araç geliri üretmeyen **ölçülecek başlangıç hipotezleridir**; gerçek cihaz yoğunluğu ve oyuncu okunurluğu sonucuyla revize edilir. A4 kabulünde dolu park, kesinti/yükleme, güvenli erişim, yanlış dokunma, ses/az hareket ve bütünleşik performans senaryoları kontrol edilir; ayrıntılar [TEST_STRATEGY.md](TEST_STRATEGY.md) ve [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md) §10'dadır.

## 66. Açılış, ekran düğmeleri ve oyun ansiklopedisi — 27 Eylül 2026

Kullanıcı isteğiyle açılıştan oyun içi yönetim panellerine kadar düğme ve içerik sözleşmesi [EKRAN_VE_MENU_AKISI.md](EKRAN_VE_MENU_AKISI.md) içinde tanımlanmıştır. Bu belge §66'nın ayrıntılı uygulama kataloğudur; ekonomi ve erişim kuralları kendi kaynak bölümlerinden alınır. §58.1 faz sırası korunur; sonraki faz düğmeleri P0'da çalışıyor gibi gösterilmez.

### 66.1 Açılış ve HUD

İlk açılışta dünya görünür; §15/§60 ve UI tasarımındaki landing/sinematik kapak olmaması korunur. Gerçek yükleme sonrası ilk kayıtta Oyuna başla/Ayarlar, mevcut kayıtta Devam et/Menü vardır. Kayıt hatası görünür kurtarma akışına gider. Menü oyun üzerinde açılır ve Devam et, Kayıtlar, Ayarlar, Yeni oyun içerir; yeni oyun eski kaydı sessizce ezmez.

Üst sol kredi/kayıt durumu, üst orta tek hedef ve oyun içi saat, üst sağ Menü; alt sol hareket/yük, alt sağ en fazla üç ana eylem İnşa/Yönetim/Karaktere dön olarak yerleşir. Sol el tercihi alt bölgeleri aynalar. §62 oranları başlangıç kompozisyonudur; piksel konumları cihazda doğrulanır. Ana yönetim, ayarlar ve ansiklopedi panelleri UI nedeniyle duraklatır; platform duraklatması kalkmadan panel kapatma oyunu başlatamaz.

### 66.2 Ayarlar içindeki Oyun Ansiklopedisi

Ayarlar'ın bilgi grubunda **Oyun Ansiklopedisi** düğmesi bulunur. Bu oyun içi wiki, kurulu içerikle çevrimdışı çalışır. Ürünler, girdi/çıktı miktarlı üretim şemaları, makineler, footprint/servis alanı, süre/kapasite ve fazı geldikçe depo/personel/araştırma gibi sistemlerin açıklamaları bulunur. Sayısal bilgi oyunla aynı sürümlü içerik tanımlarından alınır; bağımsız ikinci tarif veya ekonomi kaynağı tutulmaz.

Arama, kategori/açılanlar filtresi, ürün–tarif–makine bağlantıları ve geri geçmişi vardır. Üretim şemasının okunabilir metin alternatifi sunulur. Kilitli tanımlı içerik önkoşulunu gösterir; hikâye sürprizleri açılmadan açıklanmaz. Eksik içerik uydurulmaz. Okumak para/stok değiştirmez, tarif açmaz veya üretim başlatmaz. Kurulu makineye Dünyada bul geçişi aynı nesne kimliğini seçer ve kullanıcı Devam et diyene kadar oyun durur.

### 66.3 Faz ve kabul

P0 ansiklopedi kabuğu yalnız mevcut su/domates, makine ve temel kontrol/kayıt bilgisini içerir; A2–A4 maddeleri ilgili sistem teslimiyle büyür. Dil ve yayın ayarları hazır içerik/platform desteğiyle açılır. Her düğmenin konumu, hedef ekranı, koşulu, onayı ve hata davranışı ekran kataloğunda yer alır. Uygulama kabulü çevrimdışı okuma, veri eşleşmesi, geri/odak sırası, kayıt koruma, pending tekrarları, büyük metin ve yaşam döngüsü kontrollerini gerektirir; belge yazılması bu kontrollerin geçtiği anlamına gelmez.

## 67. Ürün omurgası: görünür zincir ve mahalle etkisi — 27 Eylül 2026

Bu bölüm [konsept karşılaştırma raporundaki](KONSEPT_KARSILASTIRMA_RAPORU.md) yönün ürün kararıdır. Orbit'in ayırt edici vaadi: oyuncu ürünün kaynaktan üretime, stoktan rafa, raftan müşteriye gidişini ve işletme kararının dünyadaki sonucunu anlayabilir. Çok sayıda ayrı yüzde/puan kartı bu temel akışın yerine geçmez. §58.1 fazları ve mevcut kaynak/ekonomi sınırları geçerlidir. Yeni içeriklerin uygulanmış olduğu iddia edilmez.

### 67.1 P0: tek okunur darboğaz

İlk su rafı boşaldığında oyun mevcut Domain durumundan doğru tek ana nedeni gösterir: ham madde eksik, istasyon girdi bekliyor, üretim sürüyor, çıktı dolu, taşıma/görevli bekliyor, raf uyumsuz/dolu, yol erişimsiz veya satış sonrası ikmal gecikmiş. Aynı anda birden çok neden varsa oyuncunun giderebileceği en yakın engel seçilir; diğerleri istasyon/raf detayında erişilebilir kalır. Neden metni nesneye bağlıdır ve bir yapılabilir eyleme gider: ilgili kaynağı/istasyonu/rafı göster, mevcut stok aktarımını yap veya inşa/rota önizlemesini aç. Para/stok değişikliği yine kendi Application komutundan geçer.

Müdahaleden sonra ekran nedenin giderildiğini, gerçek ürünün makineden rafa ve müşteri satışına hangi aşamada geçtiğini güncel durumdan gösterir. Sahte ürün animasyonu veya önceden verilmiş satış ödülü kullanılmaz. Oyun Ansiklopedisi aynı tarif/makine kimliğine salt okunur açıklama sağlar. Öğretimde **neden → müdahale → gözlenen sonuç** akışı denenir; dış oyuncunun boş raf nedenini anlayıp doğru müdahaleyi seçme süresi ölçülür. Rapordaki 10 saniye oyuncu denemesi için başlangıç hedefidir, kanıtlanmış kabul eşiği veya simülasyon zamanlayıcısı değildir.

### 67.2 A2–A3: kararın işletmede karşılığı

A2 depo, tedarik, personel ve ilk işlenmiş ürünler açıldığında teşhis aynı ürün/lot/istasyon/raf kimliklerine bağlanır. İki farklı yerleşimin rota ve boş raf süresi aynı koşullarda karşılaştırılır; bir dekor veya görsel hız animasyonu ekonomik farkı taklit etmez. A3 fiyat, bakım, vardiya ve kontrat teşhisleri aynı kayıtlı olaylardan neden ve çözüm üretir. Dokuz tanımlı A3 yetenek düğümü önce uygulanıp ölçülür; kalan 21 düğüm ve tam rol/oda çeşitliliği §58.1 A4 içeriğidir ve davranış/önkoşul tanımlanmadan aktif gösterilmez.

### 67.3 A4: tek mahalle anlatısı, seçili adaylar

§64 VIP, trend ve vardiya dalgası adayları tek Mahalle Gündemi sunumundan gösterilir; ayrı EventDirector, ziyaretçi sayacı veya zorunlu hedef akışı kurulmaz. Mahalle Bülteni mevcut satış/hizmet olayının nedenini, seçilen müdahaleyi ve gözlenen sonucu izler; bağımsız puan kaynağı değildir. Hijyen yalnız somut seyrek olay olarak değerlendirilir; sürekli temizlik angaryası ve temel satış kilidi oluşturmaz. Günün Hasadı ve esnaf pazarlığı mevcut müşteri, lot, fiyat, rezervasyon ve ledger sınırlarında kalır. 3× hız, +%20–30 kâr ve 60 aktif saniye §64'teki denge hipotezleridir; ölçümden önce oyuncuya kesin sonuç vaadi olarak yazılmaz.

Bölgesel kriz tek ana hikâye olayıdır; §46'daki üretici/tüccar/toplulukçu yolları aynı ilerlemeyi açar. Seçilen yolun ve §48.5'teki finalin izleri dünyadaki pano, diyalog ve sevkiyat görünümünden okunur. §65'in hayvan, otopark ve yol sanatı bu yaşayan mahalleyi tamamlar. Gerçek teslimat vanla, gerçek ziyaret mevcut müşteri kimliğine bağlı araçla temsil edilebilir; dekor yeni müşteri/satış yaratmaz. Çevre ayrıntısı seçili aktörü, erişimi veya düşük cihaz profilini bozarsa yoğunluk azaltılır.

### 67.4 Aday kabul kapısı

A4'te her §64 adayı aynı anda zorunlu olmaz. A3 altyapı kanıtı, ekonomi korunumu, kayıt/kesinti, cihaz bütçesi ve oyuncunun neden–sonuç anlayışı görülür; yeni ayrı menü/puan/tekrar döngüsü gerektiren aday kapsam takasına gider. İki referans oyuna benzer temel al–taşı–rafla–sat hareketi korunur; Orbit farkı bu eylemlerin kaynak ve mahalle sonuçlarıdır. Bu karar yeni SKU, yeni gizli çarpan veya yeni monetizasyon yetkisi vermez.
