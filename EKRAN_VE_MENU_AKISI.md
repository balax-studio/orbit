# Orbit Market — ekranlar, düğmeler ve oyun ansiklopedisi

Kaynak: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §58.1, §60–63 ve §66. Bu belge §66'nın ayrıntılı ekran sözleşmesidir. Görsel token'lar [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md), dokunma davranışı [CONTROLS_AND_UX.md](CONTROLS_AND_UX.md), teslim fazları [PLAN.md](PLAN.md) içindedir. Aşağıdakiler belgelendirilmiş tasarımdır; çalışan ekran veya cihaz testi değildir.

## 1. Açılıştan oyuna akış

İlk karelerde dünya/sahne görünür; ayrı reklam, landing veya sinematik kapak yoktur. Gerçek kayıt yüklenirken küçük durum katmanı vardır, simülasyon başlamaz. Kayıt doğrulanınca mevcut oyun için son durum ve **Devam et**, ilk oyun için kısa açıklama ve **Oyuna başla** gösterilir. İlk başlatma başlangıç kaydının kalıcı oluşturulmasından sonra tamamlanır. Hata kurtarma yoluna gider; sahte ilerleme yüzdesi kullanılmaz.

Akış: Açılış → kayıt kontrolü → ilk başlangıç / devam → oyun HUD'u. HUD → Menü → Kayıtlar / Ayarlar / Yeni oyun. Ayarlar → Oyun Ansiklopedisi → kategori → madde → bağlantılı ürün/makine. Geri, gidilen sayfaların tersini izler; Ayarlar'dan ansiklopediye gidip geri dönmek oyunu başlatmaz.

| Ekran | Konum ve içerik | Düğmeler ve sonuç | Koşul/faz |
|---|---|---|---|
| Açılış/yükleme | Dünya üzerinde merkezde gerçek yükleme durumu | Hata varsa **Tekrar dene**; donanım uyumsuzluğunda **Ayrıntılar** | P0; yükleme sürerken yeni oyun başlatılmaz |
| İlk başlangıç | Dünya üzerinde kısa alt kart; oyun amacı, ilk hedef | **Oyuna başla**, **Ayarlar** | P0; kayıt yoksa |
| Kayıtlı oyuna dönüş | Son kayıtlı iş, tek önerilen sonraki adım | **Devam et**, **Menü** | P0; öneriyi yapmak zorunlu değil |
| Menü | Dünya üzerinde telefon alt sayfası; başlık ve kayıt durumu | **Devam et**, **Kayıtlar**, **Ayarlar**, **Yeni oyun**, başlıkta **Kapat** | P0; devam yalnız geçerli aktif kayıt varsa |
| Yeni oyun onayı | Başlangıç özeti ve korunacak/değişecek kayıt bilgisi | **Yeni oyunu başlat**, **Vazgeç** | P0; eski kayıt korunmadan veya açık üzerine yazma onayı alınmadan başlatılmaz |
| Kayıtlar | Mevcut kayıt, oyun içi ilerleme, son başarılı kayıt zamanı/durumu; doğrulanmış yedek bilgisi | **Şimdi kaydet**, **Yükle**, **Yedekten kurtar**, **Geri** | P0; yalnız gerçekten bulunan kayıt/yedek seçilir; bulut veya çoklu slot varmış gibi gösterilmez |
| Yükleme onayı | Seçilen kayıt ve kaybolabilecek mevcut ilerleme | **Kaydet ve yükle**, **Vazgeç** | Kaydetme başarısızsa yükleme yapılmaz |
| Kayıt kurtarma | Hata nedeni, son doğrulanmış durum, kurtarmanın etkisi | **Tekrar dene**, geçerli yedek varsa **Yedeği incele** → **Bu yedekten kurtar**, **Geri** | P0; Geri oyunu bozuk kayıtla başlatmaz; sessiz sıfırlama yok |

Kayıt sayısı/slot kotası burada belirlenmez; mevcut kayıt sözleşmesinin sunduğu kayıtlar listelenir. Yeni oyunda ayrı kayıt desteklenmiyorsa açık **Mevcut kaydın üzerine yaz** onayı gerekir; önce doğrulanmış yedek korunur. Kullanıcının sıradan geri/kapat eylemi kayıt silmez. iOS'ta zorunlu **Uygulamadan çık** düğmesi yoktur.

## 2. Oyun ekranındaki sabit yerleşim

Portre safe-area içinde üst yaklaşık %12, orta yaklaşık %65, alt yaklaşık %18 başlangıç bölgeleridir; sabit piksel paylaşımı değildir. Metin büyüyünce kartlar genişler/kaydırılır, dünya esnetilmez. Telefonda ayrıntı alt sayfada, tablette uygun yan panelde açılır.

| Yer | Öğe | Dokunma sonucu / gösterilen içerik |
|---|---|---|
| Sol üst | Kredi ve küçük kayıt durum göstergesi | Kredi P0'da bilgi alanıdır; sonraki fazda finans özeti Yönetim'den açılır. Başarısız kayıt göstergesi **Kurtarmayı aç** eylemi taşır |
| Üst orta | Tek etkin hedef kartı; oyun içi gün/saat | **Hedefi aç**: mevcut adımlar ve gerçek ilerleme; saat pasif bilgidir |
| Sağ üst | **Menü** (duraklat simgesi + erişilebilir ad) | Simülasyonu UI nedeniyle duraklatır ve menüyü açar |
| Orta | 3B dünya, seçim konturu, küçük darboğaz işareti | Nesneye dokununca bağlama uygun istasyon/raf/çalışan/çevre detayı; sürekli metin yığını yok |
| Alt sol | Hareket alanı, yanında küçük taşıma yükü göstergesi | Varsayılan joystick; dokun-git seçeneğinde dünya hedefi. **Yükü aç** ürün/adet/kapasiteyi gösterir |
| Alt sağ | En fazla üç ana eylem: **İnşa**, **Yönetim**, **Karaktere dön** | İnşa kataloğu; yönetim kategorileri; kamerayı oyuncuya merkezleme |

§67 uyarınca ilk boş su rafında hedef kartı gerçek ana nedeni kısa metinle gösterir; dokununca **Nedeni incele** ve yalnız uygun durumda **Kaynağı/Makineyi/Rafı göster** eylemi çıkar. Müdahale ilgili oyun paneline götürür; yalnız yardım kartına dokunmak stok taşımaz, para harcamaz veya hedefi tamamlamaz. Sonuç aynı gerçek ürün/lot akışından güncellenir.

Sol el seçeneği alt hareket ve eylem bölgelerini aynalar. Yakınlıkla güvenli al/bırak korunur; sürekli dördüncü eylem düğmesi eklenmez. Bağlamsal panel kendi eylemlerini içerir. Ana hedef, kredi ve oyuncu panel altında tamamen kaybolmaz. Harcama yapan bir düğme yalnız simgeyle sunulmaz.

## 3. Ayarlar ve bütün kontrolleri

Telefon: üstte **Geri** ve Ayarlar başlığı, ortada kaydırılabilir gruplar, altta **Uygula** / **Vazgeç**. Ayar değişiklikleri taslak olarak önizlenir; Uygula kalıcı tercihi kaydeder, başarısızlıkta hata gösterir. Geri/kapat değiştirilmiş taslak varsa **Uygula ve dön** / **Değişiklikleri bırak** / **Düzenlemeye devam et** seçeneklerini açar. **Varsayılanlara dön** yalnız ayar taslağını sıfırlar; oyun kaydını etkilemez.

| Grup | Denetimler / düğmeler | İçerik ve davranış |
|---|---|---|
| Bilgi | **Oyun Ansiklopedisi** | Aranabilir ürün, üretim şeması, makine ve sistem rehberi; aşağıdaki §4 |
| Ses | **Müzik**, **Oyun efektleri**, **Ortam sesleri** ses düzeyi; **Tüm sesleri kapat** | Gerçekte bulunan ses kanalları; tercih yeniden açılışta korunur |
| Dokunma | **Titreşim** aç/kapat; **Kontrol yöntemi** joystick/dokun-git; **El yerleşimi** sağ/sol | Desteklenmeyen titreşim seçeneği neden metniyle pasif |
| Okunabilirlik | **Metin boyutu**, **Yüksek kontrast**, **Seçim vurgusu** | Metin/ikon/kontur desteği; kritik bilgi yalnız renkle verilmez |
| Hareket | **Azaltılmış hareket** | UI geçişleri, sarsıntı ve çevre hareketleri sadeleşir; üretim zamanı değişmez |
| Görüntü | **Kalite profili**, **Kare hızı** 30 / uygun cihazda 60 | Cihazda desteklenmeyen seçenek açıklanır; simülasyon 10 Hz kalır |
| Dil | **Türkçe / English** | Yalnız çevirisi teslim edilmiş dil seçilebilir; tam dil teslimi A4 |
| Yardım | **Kontroller**, **Kayıt ve kurtarma** | Ansiklopedinin ilgili maddelerine gider; gerçek kayıt işlemleri Kayıtlar ekranındadır |
| Hukuki/bilgi | **Gizlilik**, **Lisanslar ve katkılar**, **Sürüm bilgisi** | Paket sürümü, kullanılan içerik lisansları ve geçerli gizlilik metni; metinler yayın öncesi tamamlanır |
| Gizlilik işlemleri | **Yerel verileri sil** | Yayın kapsamındaki veri silme akışına gider; silinecek kayıt/tercihler açıkça listelenir, ayrı onay gerekir; sıradan ayar sıfırlaması değildir |

P0'da ansiklopedi çekirdeği, mevcut kontrol/ses/erişilebilirlik tercihleri gösterilir. Henüz uygulanmamış sistemler çalışıyor gibi görünmez; yayın ve SDK tercihleri ilgili A4/A5 kapısından sonra eklenir. Ansiklopediye giderken ayar taslağı korunur, dönünce aynı grup görünür.

## 4. Oyun Ansiklopedisi (oyun içi wiki)

Oyuncuya görünen ad **Oyun Ansiklopedisi**; Wikipedia sitesine bağlantı değildir. Ayarlar'da üst bilgi grubunda bulunur. Kurulu içerikle çevrimdışı çalışır; hesap, internet veya reklam izlemesi gerektirmez. Okumak tarif açmaz, ürün üretmez veya araştırma satın almaz.

Üstte **Geri**, başlık ve **Kapat**; altında **Ara** alanı ve **Aramayı temizle**; sonra kategoriler. Telefon tek sütun kart ve ayrıntı sayfası, tablet liste + ayrıntı kullanır. Geri önce madde geçmişine, ardından kategoriye, sonra Ayarlar'a döner. Kapat wiki'yi kapatıp Ayarlar'a döner; oyunu otomatik sürdürmez.

| Kategori | Madde içeriği |
|---|---|
| Başlangıç ve kontroller | Hareket, kamera, güvenli al/bırak, inşa, kayıt, ilk üretim/satış adımları |
| Ürünler ve malzemeler | Ad/ikon, ham–ara–nihai tür, birim, kaynak, kullanıldığı ve üretildiği tarifler; fazı varsa kalite/saklama bilgisi |
| Üretim şemaları | Girdi miktarları → makine/işlem → süre → çıktı ve yan ürün miktarları; önkoşullar, ambalaj/enerji gibi tanımlı ihtiyaçlar |
| Makineler | İşlev, footprint, servis hücresi/yönü, uyumlu tarifler, girdi/çıktı kapasitesi, tanımlı güç/bakım ve erişim koşulları |
| Raf, depo ve tedarik | Raf uyumu, serbest/rezerve/yoldaki stok ayrımı, kabul ve depolama kuralları |
| Personel ve odalar | Görev/atama, fazı açıldığında mola, vardiya, eğitim ve oda işlevleri |
| İlerleme ve ekonomi | Fiyat, kalite, araştırma AP'si, beceri puanı, kontrat ve borç kuralları; kavramlar birbirinden ayrılır |
| Dünya ve yardım | Çevre/otopark/yol bakımı açıklaması; girdi eksik, çıkış dolu, erişim ve kayıt hatası çözümleri |

**Üretim şeması görünümü:** Telefonda dikey girdi kartları → işlem kartı → çıktı kartları; tablette yatay gösterim kullanılabilir. Her düğme aynı içerik kimliğinin maddesine gider. **Girdiyi incele**, **Makineyi incele**, **Çıktıyı incele**, **Önceki adım**, **Sonraki adım** yalnız var olan bağlantılarda görünür. Şemanın aynı bilgisi ekran okuyucuya sıralı metin olarak sunulur; yakınlaştırma okumak için zorunlu değildir.

**Liste denetimleri:** **Kategori**, **Açılanlar / Tümü**, ada göre **Sırala**, **Filtreleri temizle**. Arama ürün/makine/tarif adlarını ve tanımlı eş adları tarar. Sonuç yoksa açık mesaj ve filtre temizleme düğmesi bulunur. Tanımlanmamış tarif/düğüm sahte bilgiyle tamamlanmaz. Henüz açılmamış tanımlı içerik kilit nedeni gösterir; hikâye/final sürprizlerinin ayrıntısı ilgili ilerlemeden önce gizlenir.

**Makine maddesi eylemleri:** **Tarifleri gör**, **Yerleşim ölçüsünü gör**, kurulu örnek varsa **Dünyada bul**. Dünyada bul birden fazla örnekte seçim listesi açar, ardından oyun ekranını duraklatılmış halde hedefe merkezler; **Devam et** gerekir. Okuma sayfasında satın al/yerleştir/üret düğmesi bulunmaz; ekonomik işlem ilgili oyun panelinde yapılır.

**Veri doğruluğu:** Sayısal değerler sürümlü ortak içerik tanımlarından okunur; elle çoğaltılmış ikinci tarif tablosu tutulmaz. Temel makine süresi ile oyuncunun geçerli yükseltme etkisi ayrı etiketlenir. Canlı stok gerekiyorsa salt okunur Domain sorgusu kullanılır. Paket sürümüyle uyuşmayan maddeler yanlış sayı göstermek yerine açık içerik hatası verir. P0 yalnız su/domates ve mevcut makineleri kapsar; katalog fazlarla büyür.

## 5. Yönetim ve bağlamsal panellerin düğmeleri

Yönetim girişinde açık kategoriler kart olarak listelenir. P0'da **Taşıma yükü**, **İstasyonlar**, **Görevli** ve **Hedef** vardır. Sonraki kategoriler ilgili faz ve oyun içi önkoşuluyla açılır. Tanımlı fakat kilitli bir kategori nedeni gösterebilir; geliştirme aşamasında uygulanmamış kategori oyuncuya aktif sunulmaz. Aynı anda bir ana panel vardır; alt sayfadan Geri önce kategoriye döner.

| Panel / faz | İçerik | Düğmeler ve sonuç |
|---|---|---|
| Yük / P0 | Taşınan ürünler, miktar/kapasite, uyumlu hedef | **Ürünü incele** ansiklopedi; **Hedefi göster** mevcut uyumlu istasyonu işaretler; stok silen genel Çöpe at yok |
| İstasyon / P0+ | Girdi/çıktı, kalan süre, durma nedeni, mevcut tarif | **Tarifi incele**, **Makine rehberi**, **Dünyada bul**; tarif seçimi desteklendiğinde **Tarif seç** → etkiler → **Onayla** |
| İnşa kataloğu / P0+ | Fazda açılmış nesneler, footprint, bedel, önkoşul | **Kategori**, **İncele**, **Yerleştir**, **Kapat**; Yerleştir yalnız önizleme başlatır |
| İnşa önizleme / P0+ | Grid, yön, servis alanı, son bedel, geçersizlik nedeni | **Döndür** (90° nesne), **Onayla**, **İptal**; geçersiz konumda onay pasif |
| Mevcut yapı / P0+ | Makine kimliği, parti/stok, taşınma veya kaldırma etkileri | **Taşı**, **Elden çıkar** → maliyet/iade ve koruma kontrolü → **Onayla / Vazgeç**; son temel zincir korunur |
| Raf/kasa / P0+ | Gerçek stok, uyum ve kuyruk/hizmet durumu | **Ürünü incele**, **Darboğazı göster**; A3'te **Fiyatı düzenle**, **SKU kilidini düzenle** → **Uygula / Vazgeç** |
| Depo / A2 | Bölge, slot/lot, serbest/rezerve/yoldaki adet | **Bölge**, **Filtre**, **Lot ayrıntısı**, **Dünyada bul**; panelden doğrudan stok yazılmaz |
| Tedarik / A2 | Teklif, miktar, toplam bedel, teslim koşulları | **Ürün seç**, **Miktar −/+**, **Siparişi incele** → **Siparişi onayla / Vazgeç**; gelen sevkiyatta **Teslimatı incele**, koşullar sağlanınca **Kabul et** |
| Personel / P0–A3 | P0 tek raf görevlisi ve görevi; A2 adaylar, A3 vardiya/enerji/ücret | **Göreve ata / Değiştir**; fazıyla **Adayları gör**, **İşe al**, **Vardiya**, **Eğitim**, **İşten çıkar**; yük/devir ve maliyet onayları korunur |
| İşletme haritası / A2–A3 | A2 iki teşhis katmanı; A3 ölçümler, pencere ve gerekçe | **Katman seç**, **Zaman penceresi**, **Nesneye git**, **Öneriyi incele**; otomatik satın alma yok |
| Mahalle Gündemi / A4 adayı | Tek yaklaşan VIP/trend/vardiya olayı, kaynaklı ön haber, kalan aktif süre ve gerçek sonuç | **Hazırlığı incele**, isteğe bağlı **İlgili yere git**, **Kapat**; kabul/harcama ilgili panelde, olay kapalıysa kart yok |
| Bakım/güç / A3 | Arıza/aşınma, servis bedeli/süresi, güç kapasitesi ve öncelik | **Servis planla**, **Önceliği değiştir**, **İşlemi incele** → **Onayla / Vazgeç**; yolun çevresel tadilatıyla karışmaz |
| Finans/borç / A3 | Bakiye, gelir/gider, borç koşulları ve kalan yükümlülük | **Dönem seç**, **İşlem ayrıntısı**, **Borç koşullarını incele** → **Borcu onayla / Vazgeç**; yeni faiz veya ödeme tipi eklenmez |
| Yetenek / A3–A4 | Dal, tanımlı düğüm, önkoşul, bedel ve etki | **Dal seç**, **Düğümü incele**, **Aç** → **Onayla**; **Sıfırlamayı incele** mevcut reset kuralını uygular |
| Araştırma / A3 | Paket, AP bedeli, öncül ve gerçek açılım | **Paketi incele**, **Araştırmayı aç** → **Onayla / Vazgeç** |
| Kontrat / A3 | İstenen SKU/kalite/adet, süre, tahsis, ödeme | **Koşulları incele**, **Kabul et**, **Stok tahsis et**, **Teslimi incele** → **Teslim et**; **Süre uzat** yalnız kaynakta izinli koşulda |
| Hedef/görev/itibar / P0–A4 | P0 etkin hedef; ileride topluluk, seçenek ve kalıcı sonuç | **Adımları gör**, **Hedefi göster**; görev fazında **Kabul et**, **Seçeneği incele**, **Teslimi onayla**; sonraki hedef önerisi otomatik harcama değildir |
| Final / A4 | Dal, yatırım, dalga, ikamesiz teslim ve sınav | **Projeyi incele**, **Teslimatı incele/onayla**, **Sınavı başlat**, izinli durumda **Yeniden dene**; geri alınamayan adım açıkça belirtilir |
| Görünüm mağazası / A4 sandbox, A5 yayın | Kozmetik, yerelleştirilmiş fiyat, sahiplik | **Önizle**, **Satın al**, **Satın alımları geri yükle**, sahip olunan için **Kullan**; ödeme native onayıyla, hak doğrulaması sonrası |
| Destekle / A4+ | Belirli ödül, reklam koşulu, ücretsiz alternatif | **Reklamı izle**, **Ücretsiz görevi gör**, **Vazgeç**; doğrulanmadan ödül verilmez |
| Gün sonu / A2+ | Nakit, katkı, stok, hizmet, tıkanma; tek öneri | **Öneriyi incele**, **Kapat**; zorunlu modal değil |
| Çevre/yol / A4 | Seçili çevre öğesinin açıklaması, varsa bakım evresi | **Ansiklopedide aç**, **Kapat**; ücretli yol tamiri veya hayvan satın alma eklenmez |

## 6. Ortak düğme, geri ve hata sözleşmesi

- Panel başlığında **Geri** önceki sayfaya, **Kapat** ilgili panel kökünü kapatmaya yarar. Menüden oyuna dönüş **Devam et** ile olur. Yönetim/ansiklopedi/inşa açıkken simülasyon durur; salt küçük dünya bilgi etiketi oyunu durdurmaz. Platform kesintisinde açık panelin kapanması tek başına devam ettirmez.
- Android geri: önce klavye → en üst onay → ayrıntı → panel kökü → duraklatma menüsü. Değişmiş taslakta kaybetme uyarısı verilir. Geri tuşuyla kazara kayıt silme veya uygulamadan atma yoktur.
- Arama/filtre/sekme yalnız görünümü değiştirir. Ekonomik onay; hedef, miktar, toplam bedel ve sonucu gösterir. Pending sırasında tekrar basış aynı işlemi çoğaltmaz; başarı kalıcı onaydan sonra görünür.
- Pasif düğmede neden yazılır. Yetersiz kredi/boş stok/kapalı faz halinde sonuç uydurulmaz. Boş liste, sonuç yok, erişim yok, işlem bekliyor ve kayıt hatası ayrı içeriktir. **Tekrar dene** aynı transaction'ın durumunu kontrol ederek çalışır.
- 44 pt / 48 dp eşdeğeri dokunma hedefi, büyük metin, görünür odak, ekran okuyucu adı ve metinle hata açıklaması korunur. UI pointer'ı dünyaya sızmaz; pencere kapanınca odak çağıran düğmeye döner.
- Düğme adları yerelleştirme anahtarlarıyla sunulur. Her yeni sistem bu katalogda giriş noktası, geri yolu, koşulu ve hata davranışı tanımlanmadan gizli HUD kısayolu eklemez.

## 7. Açık kalan uygulama ayrıntıları

Kesin piksel ölçüleri, cihaz breakpoint'leri, metin boyutu basamakları ve liste sayfalama büyüklüğü cihaz prototipinde belirlenir. Kaynakta eksik ekonomi değeri, tarif veya ileri yetenek bu ekran kataloğuyla tamamlanmış sayılmaz. Ekran akışı ve düğme işlevleri belirlenmiştir; görsel kabul ve uygulanmış özellik kanıtı ayrıca gerekir.
