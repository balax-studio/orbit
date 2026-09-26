# Domain ve veri sözleşmeleri

Kaynak: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §17–18, §26–35, §37–48, §60.3, §61. Aşağıdaki alanlar uygulama kontrol listesidir; eksiksiz TypeScript API'si veya çalışan kod iddiası değildir.

## P0 — tek gerçek durum

| Kayıt | Gerekli bilgi ve kural |
|---|---|
| İçerik tanımları | Kararlı item/recipe/machine ID; birim, miktar, süre, kapasite, footprint; sürümlü veri |
| GameState/SaveDTO | Şema/içerik sürümü, simülasyon saati, RNG durumu, son sequence; işlev veya mesh içermez |
| Para/ledger | Sabit hassasiyet; işlem ID'si, sebep, borç/alacak ve ilgili stok hareketi |
| Envanter | Konum/sahip, ürün, adet, kapasite; kaynak ve hedef rezervasyonları |
| Makine | Instance/type ID, grid konumu/yönü, aktif tarif/parti, kalan süre, girdi/çıktı ve tıkanma nedeni |
| Oyuncu/çalışan | Mantıksal konum, taşınan yük, görev ve hedef rezervasyonu; görsel transform ayrı |
| Müşteri | Durum, rota, ihtiyaç, sepet ve kilitli fiyat, kuyruk süresi; kayıtta korunur |
| Öğretim/yerleşim | Tamamlanan adımlar, seçilen düzen; iptal edilen önizleme kalıcı işlem değildir |

Tipli komutlar Application üzerinden doğrulama → rezervasyon → atomik değişim → dayanıklı günlük → sonuç akışını izler. UI'dan serbest `addCredits`/`removeItem` çağrılarıyla satışın parçalanması yerine tek satış işlemi kullanılır. Aynı transactionId tekrar gelince ödül/ürün tekrarlanmaz; farklı meşru işlemler ayrı ID alır. Bir UI eyleminin kimliği katmanlar arasında korunur.

## A2 — lotlar ve müşteriler

Fiziksel slot ile ekonomik lot farklıdır. Lot; kaynak, gerçek kalite skoru, tarihsel birim maliyet, adet ve rezervasyon ilişkisini taşır. Karışık maliyetli stok tek ortalama/raf fiyatıyla geçmişe dönük yazılmaz. Bağış lotunun maliyeti sıfırdır. Para en az dört ondalık sabit hassasiyetle hesaplanır; gösterim iki ondalık, ödeme toplamı en küçük para birimine yuvarlanır.

Sipariş durumları, teslimat zamanı ve kapasite rezervasyonu kaydedilir. Müşteri profilinin bütçe ve fiyat tepkisi, ihtiyaç başına sabit kabul eşiği, ikame ilişkisi ve kayıp satış nedeni ayrı tutulur. Rastgelelik yeniden yüklemede yeniden çekilmez.

## A3 — genişleyen sözleşmeler

- Personel: rol/beceri, yorgunluk F, memnuniyet, vardiya, mola rezervasyonu, güvenli görev devri. Enerji `100−F` türetilir; ikinci kaynak değildir.
- Üretim: kalite skoru, kalibrasyon, aşınma, servis ve güç tahsisi; kalite etiketi skordan türetilir.
- Kontrat: hedef/alternatif, teslim tarihi, tahsis edilmiş lotlar, kısmi teslim ve tekil ödül.
- İlerleme: kümülatif satış, benzersiz SKU/aile, bölüm koşulları, XP/seviye/beceri, AP kazanım/harcama geçmişi, itibar.
- Olay/oda: oyun saatiyle süre/cooldown, hedefli etki, sınırlar ve aktif oda durumu.

## A4–A5 — final ve haklar

Final projesi dalga/satır teslimi, ikame limiti, yatırım işlemi ve tekil ödül tutar. Hizmet sınavı seed, cohort, bütçe/sepet, kabul eşikleri, kalan süre, kuyruk/boş raf ölçümleriyle kaydedilir. Reklam ödülü ve satın alma hakkı ayrı durum makineleri ve idempotent ID kullanır; iade/geri alma ayrı olaydır.

## Her fazın değişmezleri

Negatif adet ve yetersiz bakiyeyle harcama yoktur. Rezervasyon fiziksel stok/hedef kapasitesini aşmaz; iptal/devrin iki ucu birlikte çözülür. Para ve stok değişimi yarım uygulanmaz. Başarısız komut değişiklik yapmaz. Domain durumu renderer/DOM kaldırıldığında da test edilebilir. Kayıt göçü, eksik içerik ID'si ve bozuk günlük açık hata/kurtarma yoluna gider; sessiz yeni oyun açılmaz.

## Uygulama ayrıntısı — komut ve kalıcılık sınırı

KAYNAK: §59, §60.3. Aşağıdaki alan adları KARAR önerisidir; mevcut kod API'si değildir. Uygularken tek sözleşme halinde tanımlanıp tüm çağıranlar aynı tipi kullanmalıdır.

```typescript
// Dokümantasyon taslağı; kaynak projede tanımlı olduğu varsayılmaz.
type CommandEnvelope<T> = {
  commandId: string;
  payload: T;
  expectedRevision?: number;
};
type CommandResult =
  | { status: 'committed'; transactionId: string; sequence: number }
  | { status: 'alreadyCommitted'; transactionId: string; sequence: number }
  | { status: 'rejected'; reason: string }
  | { status: 'pendingPersistence'; commandId: string };
```

UI `committed` almadan kalıcı başarı toast'ı göstermez. `pendingPersistence` yeni bir commandId ile tekrar satın alma/teslim denemesi değildir. Aynı kimlik farklı payload ile gelirse reddedilir; aynı payload tekrarında ilk sonuç döner. Revision kontrolü seçilirse eski önizlemenin değişen stok/fiyatla uygulanması engellenir. Zaman aşımı işlemin kesin başarısızlığı sayılmaz; önce aynı ID'nin sonucu sorgulanır.

| Komut (kavramsal isim) | Önkoşul | Tek kalıcı etki | Reddedilme örneği |
|---|---|---|---|
| Transfer | Kaynak lot/adet, erişim, hedef kapasite ve rezervasyon sahibi geçerli | Kaynak azalt + hedef artır + rezervasyon çöz | InsufficientStock, TargetFull, NoRoute |
| StartBatch | Tarif açık, makine uyumlu, girdi/güç koşulu geçerli | Girdiyi partiye bağla, batchId ve süreyi sabitle | RecipeLocked, InputMissing, MachineBusy |
| FinishBatch | Parti tamamlanmış, daha önce sonuçlanmamış | Çıktı lotunu bir kez oluştur; maliyeti/kaliteyi bağla | AlreadyCommitted, OutputBlocked |
| CompleteSale | Geçerli sepet, kilitli fiyat ve kasada tamamlanma | Ürün mülkiyeti, para, satış/ilerleme olayları birlikte | InvalidBasket, AlreadyCommitted |
| CommitPlacement | Footprint/rota/maliyet son kez geçerli | Yerleşim ve gerekiyorsa bedel; revision artır | Occupied, BlocksAccess, InsufficientFunds |
| DeliverContract | Tahsisli uygun lot ve kalan hedef | Ürün/kontrat azalt + ödeme bir kez | WrongQuality, TargetAlreadyMet |
| DeliverFinal | Aktif dalga/satır, adet/ikame limiti geçerli | Normal stoktan proje kabulüne geçiş; satış sayılmaz | WaveLocked, SubstitutionLimit |

Reason isimleri öneridir; UI her nedeni Türkçe metne eşler. Bilinmeyen hata başarılı işlem gibi yutulmaz. İçerik tanım hatası oyuncu bakiyesi hatasından ayrılır.

## Sayısal temsil ve save alan kontrolü

KAYNAK: §37 sabit hassasiyet. KARAR önerisi: kredi için 1 kredi = 10.000 atom, ledger toplamları tamsayı; JSON'a güvenli tamsayı veya açık decimal string politikası. Seçilen yaklaşımda taşma ve round-trip test edilir. Her ara bölmede yuvarlama yapmak yasaktır; maliyet hesabında hassas sonuç/rasyonel veya decimal tutulup tanımlı muhasebe sınırında dönüştürülür. Yuvarlama modu anayasa tarafından isimlendirilmemiştir: uygulama kararı kaydedilir, kasa ve iade aynı politikayı kullanır.

Save zarfı en az schemaVersion/contentVersion, sequence, simülasyon tick'i, RNG state ve payload taşır. Payload: bütün stok konumları/lotlar, ledger bakiye ve rezervasyonlar, makine partileri, taşıyan aktör yükleri/görevleri, müşteri sepetleri/kuyruk, yerleşim, öğretim ve aktif fazın ilerleme sistemleri. Pause sebebi, DOM seçimi, mesh, ses handle ve callback serileştirilmez; açılışta güvenli paused durum oluşturulur. RNG algoritması/sürümü değişirse deterministik devam için göç kararı gerekir.

## Stok konumu ve muhasebe değişmezleri

Kaynak rafı → taşıyan aktör → makine girdisi → parti içeriği → makine çıktısı → satış rafı → müşteri sepeti → satılmış ürün açık konumlardır. Transfer adedi çoğaltmaz; üretim girdiyi çıktıya tarif oranında dönüştürdüğü için ham adet toplamının her üretimde aynı kalması beklenmez. Ürün bazında denge: açılış + edinim + üretim çıktısı − üretim tüketimi − satış − teslim − fire = kapanış. Rezervasyon ek stok değildir.

Sepet iptalinde mal oyuncunun sahipliğinde kalır ve geri stoklama görevi oluşur; rafta anında belirme varsayılmaz. Taşıyıcının görevi iptal edilince yük silinmez; güvenli hedefe devredilir. Bir lotun alt parçalara bölünmesi toplam adet ve maliyeti korur. Stok raporundaki ortalama maliyet geçmiş lot değerlerini yeniden yazmaz.
