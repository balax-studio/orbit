# Domain ve veri sözleşmeleri

Kaynak: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §17–18, §26–35, §37–48, §60.3, §61. Aşağıdaki alanlar uygulama kontrol listesidir; eksiksiz TypeScript API'si veya çalışan kod iddiası değildir.

## P0 — tek gerçek durum

Fiziksel stok birim başına mesh değildir: item/lot/slot/taşıyıcı yükü ve rezervasyonlar mantıksal kayıttır. Kapasite aşımı, iptal edilen transfer ve atık akışı [KARARLAR.md](KARARLAR.md) D-011'e; yarım satış/çöpe atma ve yüklemede taşınan eşya D-016'ya uyar.

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

## P0 somut TypeScript veri şeması — D-020 uygulama kararı

Bu sözleşme **P0 hedef şemasıdır**, kaynak depoda var olan bir API iddiası değildir. `Product` ayrı envanter sayacı değil, sürümlü `ProductDefinition` içerik kaydıdır. `MachineDefinition` tarif/ölçü gibi değişmeyen veriyi tutar; `Machine`, `Customer` ve `Worker` aşağıdaki kalıcı instance alanlarına sahiptir. Alan ekleme veya isim değiştirme schema/content sürümü ve göç testi ister. Para ölçeği ve yuvarlama [KARARLAR.md](KARARLAR.md) D-021'de karara bağlanmıştır; çalışan kodda henüz uygulanmış değildir. Runtime kimlik indeksleri snapshot'taki dizilerden yüklemede kurulur.

```typescript
type EntityId = string;
type ItemId = `item.${string}`;
type RecipeId = `recipe.${string}`;
type MachineTypeId = `machine.${string}`;
type GridCell = { x: number; z: number }; // tamsayı hücre; 1 hücre = 1 m
type WorldPosition = { x: number; z: number }; // metre, mantıksal konum
type Direction = 0 | 90 | 180 | 270;

type ProductDefinition = {
  id: ItemId;
  displayNameKey: string;
  category: 'raw' | 'intermediate' | 'final';
  stackSize: number;
  baseRetailPriceAtoms: number | null; // yalnız satılabilir ürünlerde
  phase: 'P0' | 'A2' | 'A3' | 'A4';
};
type MachineDefinition = {
  id: MachineTypeId;
  displayNameKey: string;
  purchasePriceAtoms: number;
  footprint: { width: number; depth: number };
  serviceCells: GridCell[]; // makine pivotuna göre yönle döndürülür
  inputCapacity: number;
  outputCapacity: number;
  powerE: number;
  recipeIds: RecipeId[];
};
type RecipeDefinition = {
  id: RecipeId;
  machineTypeId: MachineTypeId;
  inputs: Array<{ itemId: ItemId; quantity: number }>;
  outputs: Array<{ itemId: ItemId; quantity: number }>;
  durationTicks: number;
};
type StockLocation =
  | { kind: 'cabinet' | 'shelf' | 'storage'; ownerId: EntityId }
  | { kind: 'machineInput' | 'machineOutput'; ownerId: EntityId }
  | { kind: 'player' | 'worker' | 'customer'; ownerId: EntityId };
type Station = {
  id: EntityId;
  kind: 'cabinet' | 'shelf' | 'storage' | 'checkout';
  gridPosition: GridCell;
  capacity: number; // checkout için 0; stok tutmaz
};
type StockLot = {
  id: EntityId;
  itemId: ItemId;
  quantity: number;
  qualityScore: number; // P0 tek kalite; A3'te etkin kalite kuralları
  unitCostAtoms: number; // P0 bağış girdisinde 0
  sourceId: string;
  location: StockLocation;
};
type MachineBatch = {
  id: EntityId;
  recipeId: RecipeId;
  remainingTicks: number;
  consumedInputs: Array<{
    lotId: EntityId; itemId: ItemId; quantity: number;
    qualityScore: number; unitCostAtoms: number;
  }>;
};
type Machine = {
  id: EntityId;
  typeId: MachineTypeId;
  gridPosition: GridCell;
  direction: Direction;
  level: 1; // P0: üst seviye davranışı A3+ ve göçle eklenir
  selectedRecipeId: RecipeId | null;
  status: 'Idle' | 'Running' | 'NoInput' | 'NoPower' | 'BlockedOutput' | 'Ready';
  batch: MachineBatch | null;
};
type CarrierTask = {
  id: EntityId;
  sourceLotId: EntityId;
  target: StockLocation;
  quantity: number;
  phase: 'toSource' | 'carrying' | 'toTarget' | 'waiting';
};
type Player = {
  id: EntityId;
  position: WorldPosition;
  carriedLotIds: EntityId[]; // miktarın tek kaynağı StockLot'tur
};
type Worker = {
  id: EntityId;
  roleId: string; // P0: tek raf görevlisi içerik ID'si
  position: WorldPosition;
  carriedLotIds: EntityId[];
  task: CarrierTask | null;
  idleCell: GridCell;
};
type Customer = {
  id: EntityId;
  profileId: string; // P0: tek öğretim profili
  position: WorldPosition;
  phase: 'entering' | 'toShelf' | 'toCheckout' | 'queued' | 'leaving';
  requestedItemId: ItemId;
  basketLotId: EntityId | null;
  lockedPriceAtoms: number | null;
  patienceRemainingTicks: number;
  queueIndex: number | null;
  purchaseThreshold: number; // girişte çekilir; yüklemede yeniden çekilmez
};
type Reservation = {
  id: EntityId;
  ownerId: EntityId;
  lotId: EntityId;
  quantity: number;
  target: StockLocation;
};
type P0Payload = {
  room: { width: 6; depth: 6; entrance: GridCell };
  player: Player;
  workers: Worker[];
  customers: Customer[];
  machines: Machine[];
  stations: Station[];
  lots: StockLot[];
  reservations: Reservation[];
  balanceAtoms: number; // güvenli tamsayı; eksi olamaz
  tutorial: { completedStepIds: string[]; activeStepId: string | null };
  committedTransactions: Array<{ transactionId: string; sequence: number }>;
};
type P0Snapshot = {
  schemaVersion: 1;
  contentVersion: string;
  sequence: number; // snapshot'ın kapsadığı son durable journal işlemi
  tick: number; // yalnız aktif 100 ms adımlar
  rngState: { customer: number; economy: number; cosmetic: number };
  payload: P0Payload;
  checksum: string; // kanonik, checksum alanı hariç snapshot verisi
};
```

`ProductDefinition`, `MachineDefinition` ve `RecipeDefinition` sürümlü içerik manifestindedir; her snapshot'a kopyalanmaz. Ekran mesh'i, DOM seçimi, anlık interpolasyon, pause nedeni ve işlev referansı snapshot'a girmez. İşlem günlüğü `P0Snapshot` içine gömülmez: ayrı kayıtlarda transaction ID, artan sequence, tam komut/olay sonucu ve checksum taşır. Yeni kayıt oluştururken `room.entrance` ve bütün başlangıç nesnelerinin konumu [dünya paftası §13](DUNYA_YERLESIM_PLANI.md) varsayılanından üretilen sürümlü 6×6 yerleşim fixture'ında tanımlanır; bu taslak TypeScript şeması koordinatların kodda kurulduğu veya test edildiği anlamına gelmez. A2/A3'ün ücret, yorgunluk, kalite, bakım, tedarik ve diğer alanları ayrı sürümlü şemayla eklenir; P0'daki dar tipleri tüm oyun modeli sayılmaz.

## A2 — lotlar ve müşteriler

Fiziksel slot ile ekonomik lot farklıdır. Lot; kaynak, gerçek kalite skoru, tarihsel birim maliyet, adet ve rezervasyon ilişkisini taşır. Karışık maliyetli stok tek ortalama/raf fiyatıyla geçmişe dönük yazılmaz. Bahçe kaynağından gelen `item.raw_water` ara lotu ile üç şişelenmiş satış SKU'su ayrıdır; başlangıç dağılımı ve ambalaj sarfı [KARARLAR.md](KARARLAR.md) D-002/D-003'e uyar. Para 10.000 atom/kredi tamsayı hassasiyetinde tutulur; gösterim ledger değerini değiştirmez.

Sipariş durumları, teslimat zamanı ve kapasite rezervasyonu kaydedilir. Müşteri profilinin bütçe ve fiyat tepkisi, ihtiyaç başına sabit kabul eşiği, ikame ilişkisi ve kayıp satış nedeni ayrı tutulur. Rastgelelik yeniden yüklemede yeniden çekilmez.

## A3 — genişleyen sözleşmeler

- Raf: kalıcı seçili SKU, fiyat ön ayarı/fiyat değeri ve SKU kilidi; fiyat revision'ı ve mevcut sepetin kilitli fiyatı ayrı tutulur. Uyumsuz transfer ve dolu rafta uyumsuz kilit değişimi reddedilir.
- Aşırma: olay/şüpheli kimliği, seed'li karar, alınan lotun tek konumu, kapıya kalan rota ve yakalama/kaçış sonucu kaydedilir. Yakalama aynı lotu güvenli kapasiteye döndürür; kayıp satış/ciro sayılmaz.
- Borç: kurum/teklif kimliği, anapara, açık toplam yükümlülük, kalan bakiye, tahsilat gün kimlikleri ve ledger işlemleri kaydedilir. Gün sonu brüt satış tahsilatından %10, bakiye ve eldeki nakitle sınırlı tahsil edilir; tekrar çağrı ikinci kesinti yapmaz.

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

KAYNAK: §37 sabit hassasiyet. KARAR D-021: 1 kredi = 10.000 atom, ledger toplamları güvenli tamsayı `number`; UI gösterimi iki ondalık. Taşma ve round-trip test edilir. Her ara bölmede yuvarlama yapmak yasaktır; maliyet hesabında hassas rasyonel/decimal tutulur. Ledger sınırında en yakın atoma, tam yarımda sıfırdan uzağa yuvarlanır; kasa, iade ve maliyet aynı politikayı kullanır. `BigInt` veya decimal string ileride ancak sürümlü göç ve JSON/adaptör sözleşmesiyle eklenir.

Save zarfı en az schemaVersion/contentVersion, sequence, simülasyon tick'i, RNG state ve payload taşır. Payload: bütün stok konumları/lotlar, ledger bakiye ve rezervasyonlar, makine partileri, taşıyan aktör yükleri/görevleri, müşteri sepetleri/kuyruk, yerleşim, öğretim ve aktif fazın ilerleme sistemleri. Pause sebebi, DOM seçimi, mesh, ses handle ve callback serileştirilmez; açılışta güvenli paused durum oluşturulur. RNG algoritması/sürümü değişirse deterministik devam için göç kararı gerekir.

## Stok konumu ve muhasebe değişmezleri

Kaynak rafı → taşıyan aktör → makine girdisi → parti içeriği → makine çıktısı → satış rafı → müşteri sepeti → satılmış ürün açık konumlardır. Transfer adedi çoğaltmaz; üretim girdiyi çıktıya tarif oranında dönüştürdüğü için ham adet toplamının her üretimde aynı kalması beklenmez. Ürün bazında denge: açılış + edinim + üretim çıktısı − üretim tüketimi − satış − teslim − fire = kapanış. Rezervasyon ek stok değildir.

Sepet iptalinde mal oyuncunun sahipliğinde kalır ve geri stoklama görevi oluşur; rafta anında belirme varsayılmaz. Taşıyıcının görevi iptal edilince yük silinmez; güvenli hedefe devredilir. Bir lotun alt parçalara bölünmesi toplam adet ve maliyeti korur. Stok raporundaki ortalama maliyet geçmiş lot değerlerini yeniden yazmaz.

## A4 adayları için veri sınırı — KAYNAK §64

Bu alanlar uygulanmış şema değildir. A3 olay/oda/fiyat altyapısı doğrulandıktan sonra VIP ziyareti, trend ve vardiya dalgası aynı sürümlü olay takvimi/RNG durumunda; hijyen ve cazibe oda instance'ında; teşhir ataması raf/tezgâh instance'ında; pazarlık teklifi müşteri sepeti ve satış transaction'ında temsil edilir. Mahalle Bülteni gerçekleşmiş olay/ledger projeksiyonudur, ikinci itibar kaynağı değildir. Dükkân adı güvenli yerel metin olarak, önerilen hedef ise SessionBookmark/GoalPin kapsamında kaydedilir; görüntü efekti ve ses handle'ı save'e girmez. Yeni alanların contentVersion/schemaVersion göçü ve eski kayıt varsayılanı uygulama görev kartında tanımlanır; eksik değere sıfır ekonomi etkisi uydurulmaz. Tüm ödül, sarf ve satışlar tekil transaction ID ile idempotent kalır.
