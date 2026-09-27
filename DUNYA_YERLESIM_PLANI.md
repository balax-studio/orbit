# Orbit Market — dünya ve market yerleşim paftası

**Durum:** Varsayılan başlangıç yerleşimi ve fazlı genişleme için uygulama kararı; yapılmış sahne veya cihaz kabulü değildir. Ürün sınırları [anayasa §9, §58.1, §62–63 ve §65](OYUN_GELISTIRME_DEVIR_DOSYASI.md), yerleştirme güvenliği [KARARLAR.md](KARARLAR.md) D-001/D-009/D-017/D-018, görsel dil [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md) §4/§10–12 ve kontrol listesi [RULES.md](RULES.md) içindedir. Sayısal ada koordinatları kaynakta önceden verilmemişti; **bu dosyada ajanlar için sabitlenen teknik yerleşim seçimidir**. İçerik kataloğunun gerçek footprint ve servis hücresi daha üst önceliklidir. Bu pafta yeni ekonomi, oda bedeli veya açılma eşiği üretmez.

## 1. Koordinat ve okuma kuralı

- Dünya planlama ızgarası `x=0..47`, `z=0..39` (48×40 hücre). Hücre 1 oyun metresi / 1 Three.js yatay birimdir. `x` doğuya/sağa, `z` güneye/aşağı artar. `(x,z)` hücrenin kimliğidir; tablodaki iki uç dahildir. Yükseklik ve çatı bu 2B işgal haritasından ayrıdır.
- Duvarlar hücrenin dış sınır çizgisine oturur; oda kenarındaki döşeme hücresi içeriden yürünebilir. Kapı koordinatı iki komşu odanın sınır döşemelerini ve aradaki duvar açıklığını belirtir. Karşı oda açılmadıysa bu duvar kapalıdır; boş rezervin içine yürünmez.
- **Kuzey** ekran paftasının üstü, ana **araç yolu güney** kenarıdır. Marketin önü güneydedir. P0 6×6 satış odasının batı-kuzey köşesi `(12,22)`, merkez hedefi `(15,25)`tir. D-017'deki yerel `(3,0,3)` kamera hedefi bu oda için dünya kaydırmasıyla `(15,0,25)` olur; kamera açıları ve responsive frustum değişmez.
- 48×40, **yerleşim planı sınırıdır**; P0'da tüm odaların mesh, collider, ekonomisi ve uzak dekoru yaratılmaz. Görünür çevre cihaz bütçesine ve açılmış faza göre çizilir. Geleceğe ayrılmış hücreler oyuncuya sahte satın alınabilir oda olarak sunulmaz.
- Tablodaki oda/kare yerleri başlangıç veya genişleme **varsayılanıdır**. Oyuncu §9 izinli modülü taşıyabilir; her değişiklik footprint, servis, iki hücrelik geçiş, giriş/kasa/teslim erişimi ve son temel zincir kuralıyla yeniden doğrulanır. Kalıcı kimlik, stok ve parti yerleşimle birlikte korunur. Dünya yolu, yaya geçidi, park/servis girişi ve güvenlik tamponu inşa alanı değildir.

## 2. Kuşbakışı ana pafta

```text
                           KUZEY  z azalır
  x=0                                                               x=47
  ┌───────────┬─────────────────────────────────────┬───────────────┐
  │ göl/mera  │ R0  topluluk | soyunma | rezerv | rezerv           │
  │ korusu    │ R1  sera      | enerji  | eğitim | yönetim          │
  │ bahçe     │ R2  işleme   | dinlenme| soğuk  | bakım            │
  │           │ R3  SATIŞ    | kuru depo| kabul | servis avlusu    │
  ├───────────┴─────────────────────────────────────┴───────────────┤
  │ yaya kaldırımı / market girişi / park üstü geçiş               │
  │                    otopark ve erişim şeridi                     │
  │══════════════════════ DOĞU–BATI ARAÇ YOLU ═════════════════════│
  └─────────────────────────────────────────────────────────────────┘
                           GÜNEY  z artar
```

| Şerit / alan | Hücreler | Görev | İlk erişim |
|---|---|---|---|
| Batı peyzaj ve bahçe | `x=2..11, z=2..29` | Göl/mera rezervi, ağaçlar ve P0 üretim bahçesi; alt bölgeler §5'te | Bahçe P0; diğerleri fazına göre |
| Modüler yapı | `x=12..35, z=4..27` | Dört sütun × dört satır oda rezervi; yalnız açılan modüller inşa edilir | Satış P0 |
| Doğu servis yolu | `x=36..39, z=22..34` | Gerçek tedarik girişine ayrılmış iki hücrelik geçiş ve emniyet payı | A2 basit teslim noktası; A4 araç görseli |
| Doğu üretim şeridi | `x=40..47, z=2..34` | A3 bağ/zeytinlik ile geniş tarla parselleri, iki hücreli servis/yaya omurgası ve güneyde A4 peyzaj; ayrım §13'te | Arazi satın alındıkça |
| Ön kaldırım | `x=10..35, z=28..29` | Giriş, yaya yönü ve park üstü yürüyüş; kesintisiz | P0 sade zemin |
| Park/araç bölgesi | `x=16..35, z=30..34` | Park cepleri `z=30..32`, erişim şeridi `z=33..34` | A4; öncesinde sahte trafik yok |
| Ana yol | `x=0..47, z=35..38` | Doğu–batı trafik, aşınma ve bakım görünümü | A4; P0 yalnız uzak zemin sınırı |
| Güney dış sınır | `z=39` | Oynanamaz peyzaj/tampon | Gerektiğinde |

## 3. Oda matrisi ve açılma sırası

Her hücre 6×6'dır. Sütunlar `C0 x12..17`, `C1 x18..23`, `C2 x24..29`, `C3 x30..35`; satırlar `R0 z4..9`, `R1 z10..15`, `R2 z16..21`, `R3 z22..27`. Bu oda listesi [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md) §11'deki alanları yerleştirir; satın alma bedeli/gerçek açılış koşulu içerik ve §58.1'den gelir.

| Konum | Hücreler | Alan ve kullanım | Faz sınırı |
|---|---|---|---|
| R3-C0 | `x12..17,z22..27` | **Satış/başlangıç:** tek raf, kasa, P0 şişeleme; A2'de şişeleme işleme odasına taşınabilir, eski niş açık nefes alanı kalır | P0 tek kapalı oda |
| R3-C1 | `x18..23,z22..27` | **Kuru depo:** tek A2 rafından başlayan ham/ara/nihai bölmeler | A2; P0'da kapalı rezerv |
| R3-C2 | `x24..29,z22..27` | **Mal kabul:** A2'de dış teslim işareti ve geçiş rezervi, sonraki fazda tam kabul/kontrol odası | A2 basit işaret; oda donanımı fazına göre |
| R3-C3 | `x30..35,z22..27` | **Açık servis avlusu:** iki hücrelik doğu–batı teslim geçidi ve manevra; oda değildir | A2 geçiş; A4 van |
| R2-C0 | `x12..17,z16..21` | **İşleme/üretim:** su şişeleme ve sonra tanımlı ilk gıda/içecek hatları; odanın orta aksı açık | A2 |
| R2-C1 | `x18..23,z16..21` | **Dinlenme:** iki koltuklu ilk mola köşesi, daha sonra tanımlı konfor | A2 |
| R2-C2 | `x24..29,z16..21` | **Soğuk depo:** uygun lot/ömür/güç, teslim ve işleme arasında | A3 |
| R2-C3 | `x30..35,z16..21` | **Bakım atölyesi:** alet ve servis kuyruğu; yol bakımından ayrı | A3 |
| R1-C0 | `x12..17,z10..15` | **Sera:** satın alınmış üretim/biyohat; P0 domates yatağı dış bahçededir | A3/A4 içerik erişimi |
| R1-C1 | `x18..23,z10..15` | **Enerji:** kapasite ve öncelik panosu | A3 |
| R1-C2 | `x24..29,z10..15` | **Eğitim:** mentor/öğrenci masası | A3/A4 içerik erişimi |
| R1-C3 | `x30..35,z10..15` | **Yönetim:** çizelge, sipariş ve araştırma ekranına erişim | A3 |
| R0-C0 | `x12..17,z4..9` | **Topluluk:** pano, kriz/final izi; erken fazda bina değildir | A4 |
| R0-C1 | `x18..23,z4..9` | **Soyunma:** dolap ve vardiya hazırlığı | A3/A4 içerik erişimi |
| R0-C2/C3 | `x24..35,z4..9` | **Boş başlangıç rezervi:** A3/A4'te gerekli iç istasyonlar için satın alınmış işleme odası kopyaları §13.3'e göre kurulabilir | Gerekli oda/bağlantı açılmadan inşa yok |

**Müşteri dinlenme alanı:** A4'te ücretli işlevsel oda, güneybatı ön bahçede `x6..9,z28..31` **4×4 cam pavyondur**; doğu kapısı ve bağlantısı §13'tedir. Satış içindeki `x12..13,z22..23` P0 şişeleme nişi, makine A2'de taşınınca boş kalır; 2×2 dekor, dinlenme oda etkisi veya ücretsiz koltuk değildir. Bu seçim satış odasının ferah orta aksını ve kaynak §32.1 asgari alan/160 kredi kabuk kuralını birlikte korur.

### 3.1 Oda içi işlev cepleri

Bu koordinatlar **mobilya/istasyon için boş bırakılmış köşe cepleridir**; odanın otomatik dolduğu veya kaç ekipmanın satın alındığı anlamına gelmez. Her oda için merkezde `x+2..3` ve `z+2..3` iki hücrelik çapraz omurga ile komşu kapı eşikleri açıktır. İçerik tanımındaki footprint/servis hücresi belirtilen cebe sığmazsa nesne gizlice küçültülmez; pafta ve rota birlikte revize edilir.

| Oda | Kuzeybatı / kuzeydoğu cepleri | Güneybatı / güneydoğu cepleri |
|---|---|---|
| Satış R3-C0 | `x12..13,z22..23` şişeleme → taşınırsa boş görüş/nefes cebi; `x16..17,z22..23` kasa | `x12..13,z26..27` ilk raf; `x16..17,z26..27` ek raf/boş manevra rezervi |
| Kuru depo R3-C1 | `x18..19,z22..23` ham/ara; `x22..23,z22..23` nihai ürün rafı | `x18..19,z26..27` ayrılmış lot; `x22..23,z26..27` boş kabul/taşıma cebi |
| Mal kabul R3-C2 | `x24..25,z22..23` kontrol; `x28..29,z22..23` etiket/masa | `x24..25,z26..27` bekleyen lot; `x28..29,z26..27` boş yük cebi |
| İşleme R2-C0 | `x12..13,z16..17` ilk şişeleme; `x16..17,z16..17` açılmış ikinci istasyon | `x12..13,z20..21` girdi; `x16..17,z20..21` çıktı bekleme |
| Dinlenme R2-C1 | `x18..19,z16..17` koltuk 1; `x22..23,z16..17` koltuk 2 | `x18..19,z20..21` sebil/yan destek; `x22..23,z20..21` dolap/boş alan |
| Soğuk depo R2-C2 | `x24..25,z16..17` soğuk raf 1; `x28..29,z16..17` soğuk raf 2 | `x24..25,z20..21` güç/izleme; `x28..29,z20..21` kabul tamponu |
| Bakım R2-C3 | `x30..31,z16..17` tezgâh; `x34..35,z16..17` alet/dolap | `x30..31,z20..21` servis bekleyen; `x34..35,z20..21` boş manevra |
| Sera R1-C0 | `x12..13,z10..11` bitki yatağı 1; `x16..17,z10..11` bitki yatağı 2 | `x12..13,z14..15` girdi; `x16..17,z14..15` hasat tamponu |
| Enerji R1-C1 | `x18..19,z10..11` modül 1; `x22..23,z10..11` modül 2 rezervi | `x18..19,z14..15` öncelik panosu; `x22..23,z14..15` servis alanı |
| Eğitim R1-C2 | `x24..25,z10..11` çalışma masası; `x28..29,z10..11` mentor yeri | `x24..25,z14..15` pano; `x28..29,z14..15` boş eğitim cebi |
| Yönetim R1-C3 | `x30..31,z10..11` masa; `x34..35,z10..11` sipariş/çizelge | `x30..31,z14..15` görüşme; `x34..35,z14..15` boş karar cebi |
| Topluluk R0-C0 | `x12..13,z4..5` ortak pano; `x16..17,z4..5` görev/final izi | `x12..13,z8..9` görüşme; `x16..17,z8..9` açık sergi cebi |
| Soyunma R0-C1 | `x18..19,z4..5` dolap 1; `x22..23,z4..5` dolap 2 | `x18..19,z8..9` hazırlık; `x22..23,z8..9` boş geçiş cebi |

Satışta ek raf, enerji modülü veya diğer boş cep faz açılmadan ücretsiz oluşmaz. İşleme odasına şişeleme taşınırsa önce kalıcı nesne kimliği, içindeki girdi/çıktı ve sürmekte olan parti korunur; eski satış nişi ancak başarılı taşıma sonrasında boş görünür. Oda cepleri amaç gruplarıdır; servis hücreleri ve geçerli footprint bütün odalarda içerik tanımından denetlenir.

## 4. P0'da tam yerleşen hücreler

| Nesne / yol | Hücre veya rezerv | Etkileşim/koruma |
|---|---|---|
| Market güney kapısı | `x14..15,z27`; dış eşik `x14..15,z28..29` | Tek müşteri spawn/çıkış kapısı; D-016 kimliği aynı. Kapı iki hücre geniştir |
| Bahçe bağlantısı | Market batı eşiği `x12,z24..25`; dış koridor `x10..11,z24..25` | Oyuncu/görevli su-domates taşır; maliyetli işlem tetiklemez |
| Ana iç aks | `x14..15,z22..27`; enine aks `x12..17,z24..25` | Sabit nesne konmaz; kapıdan raf, kasa ve ileride oda kapılarına iki hücrelik rota korunur |
| Şişeleme tezgâhı | `x12,z22..23` (1×2) | Girdi/çıktı/servis hücresi `x13,z22..23` içerik tanımıyla doğrulanır |
| Satış rafı `fixture.sales_shelf` | `(12,26)` 1×1; raf önü `(13,26)` | Kesin P0 içerik tanımı §13; ilk su/domates için fiziksel raf, orta aksa taşmaz |
| Kasa `fixture.checkout` | `(17,22)` 1×1; görevli `(17,23)`, müşteri `(16,22)` | Kesin P0 içerik tanımı §13; sıra rezervasyonu §13. Doğu kapısı `z24..25` kapanmaz |
| Bahçe sınırı | `x4..9,z20..27` | Marketin batısında; bahçe dekoru üretim hücresini örtmez |
| Su kaynağı `source.spring_water` | `x5..6,z21..22` 2×2, erişim `x7,z21..22` | Kesin P0 içerik tanımı §13; ham su buradan gelir |
| Domates yatağı `source.crop_plot` | `x5..6,z25..26` (2×2), servis `x7,z25..26` | P0 domates kaynağı; yol üstüne taşmaz |
| Bahçe ana yürüyüşü | `x8..9,z20..27` | İki hücre açık; batı bağlantısına `x10..11,z24..25` ile bağlanır |

P0 başlangıç nesnelerinin kesin footprint/port sözleşmesi §13 ve içerik kataloğunda eşlenmiştir. Oyuncu taşırsa nesne en yakın boş hücreye sessizce kaydırılmaz; yeni konum/rotasyon aynı servis ve geçiş kontrolünden geçer. P0 tek müşteriyle, A2 ise eşzamanlı görevli/müşteri ve dolu kuyrukla sınanır; geçiş iki hücrenin altına düşerse yerleşim reddedilir.

**Açılış sarf konumu — KARAR D-003:** 12 küçük şişe, 4 boş bidon ve 2 boş damacana lotu şişeleme tezgâhının; 8 domates tohumu lotu domates yatağının kayıtlı giriş tamponundadır. Tamponlar bu lotları taşıyacak kapasiteyle tanımlanır; rafta satılık ürün veya görünmez ortak depo sayılmaz. Suyu çeşme haznesinden servis yoluyla taşıma gerekir. A2'de gerçek tedarik/teslim gelene kadar bu sarflar kendiliğinden yenilenmez.

## 5. Kapılar, servis ve yaya/araç yolları

Oda açıldıkça ortak duvarda orta iki hücre kapı olur: kuzey/güney bağlantısı sütunun `x+2..3` hücrelerinde, doğu/batı bağlantısı satırın `z+2..3` hücrelerinde. Her iki odanın sınır hücresi eşik olarak ayrılır. Açılmamış odaya kapı, boşluğa giden geçit veya geçilebilir collider üretilmez. Her açılan odanın `x+2..3` kuzey–güney ve `z+2..3` doğu–batı **iç omurgası** sabit yerleşimden boş kalır; servis hücresi yürünebilir olabilir ama makineler koridoru işgal etmez.

| Bağlantı | Eşik / açık rota | İlk faz |
|---|---|---|
| Satış ↔ işleme | `x14..15,z21..22` | A2, işleme odası gerçekten açılınca |
| Satış ↔ kuru depo | `x17..18,z24..25` | A2, depo açılınca |
| İşleme ↔ dinlenme | `x17..18,z18..19` | A2 |
| Kuru depo ↔ dinlenme | `x20..21,z21..22` | A2 |
| Kuru depo ↔ mal kabul | `x23..24,z24..25` | A2 teslim pedi; oda tamamlanınca aynı eşik |
| Mal kabul ↔ servis avlusu | `x29..30,z24..25` | A2 yaya/yük; A4 van servis sınırı dışta |
| Servis avlusu ↔ doğu servis yolu | `x35..39,z24..25` | A2 yaya/yük; A4 araç manevrası ayrıştırılır |
| Ön kaldırım ↔ market | `x14..15,z27..29` | P0 müşteri; park ve yol gelecekte açıldığında da aynı kimlik |

Diğer açılmış komşu odaların orta kapıları aynı kuralla üretilir; soğuk depo, bakım, sera, eğitim, enerji, yönetim, soyunma ve topluluk için bağlantı açılmadan önce iki uçta yürünebilir yol doğrulanır. Personel rotası müşteri kuyruğuna zorunlu olarak sokulmaz. İnşa, oda taşıma, yıkım, bakım bariyeri ve geçici aktör rezervasyonu hem yaya kapısını hem kasa/raf/servis erişimini yeniden denetler. Yol bulunmazsa işlem reddedilir ve gerekçe gösterilir.

| Aktör | İzinli ana rota | Yasak varsayım |
|---|---|---|
| Müşteri | Güney kapısı `x14..15,z27` → satış rafı → kasa kuyruğu → aynı çıkış; A4'te satın alınmış dış pavyona kaldırımdan gider | Depo/işleme/bahçe kapısından kestirme veya araçtan ikinci müşteri spawn'ı yok |
| Oyuncu ve görevli | Bahçe batı bağlantısı ↔ üretim ↔ depo ↔ raf; mal kabulden aynı lotun gerçek transfer rotası | Kapalı rezerv oda, servis hücresi olmayan makine veya kuyruk hücresinde kalıcı kilit yok |
| Tedarikçi/servis aracı | Güney yol → doğu servis girişi → avlu; yük aktörü gerçek kabul noktasından depoya gider | Müşteri parkı, kaldırım veya mağaza içinden araç geçişi yok |
| Ortam müşteri aracı | Güney yol → park erişim şeridi → boş P1–P4 → aynı kapıdan çıkış | Park doluluğu müşteri bütçesini/talebini değiştirmez |
| Kedi/köpek/koyun | §6'da ayrılan sakin çevre/çevrili alan | Yola fırlama, müşteri kuyruğunu kapama veya üretim girdisi oluşturma yok |

**Dış yaya yolu:** Market kapısından `x14..15,z28..34` iki hücrelik yürüyüş ana yolu iner. `z28..29` ön kaldırım doğu–batı boyunca park üst sınırına ve hizmet noktalarına bağlanır. Bahçe ile market `x10..11,z24..25` üzerinden bağlıdır. A4 park araçları yaya yoluna girmez; parked araçtan çıkan dekoratif yürüyüş gerçek müşteri kimliği varsa yalnız o aktörü temsil eder.

**Araç yolu:** Ana yol doğu–batı `z35..38`. Müşteri parkına giriş/çıkış `x34..35,z33..38`; iç erişim şeridi `x16..35,z33..34`. Ayrı tedarik girişi `x38..39,z35..38` → servis yolu `x38..39,z22..34` → avlu `x30..35,z24..25` yönündedir. Park ile tedarik manevrası karışmaz. Yol kenarındaki çizgi/dekor collider'ı bu iki kapıyı daraltmaz.

**A4 otoparkı:** Dört görünür cep: P1 `x18..19,z30..32`, P2 `x22..23,z30..32`, P3 `x26..27,z30..32`, P4 `x30..31,z30..32`. Bunlar ilk sanat/rota referansıdır, §65'te açık bırakılan nihai kapasite dengesi değildir. Aynı cepte iki araç bulunmaz; dolu park yeni ortam aracını geçirir, ziyaret/satış sayısını değiştirmez. Park, `x14..15` yaya aksını ve `x34..35` girişini kapatmaz. Araç animasyonu ekonomi işlemi değildir.

**A4 yol bakımı:** Görsel aşınma/bakım aday kesimleri W1 `x0..11,z35..38`, W2 `x18..31,z35..38`, W3 `x40..47,z35..38`. Yaya aksı `x14..15`, park girişi `x34..35` ve servis girişi `x38..39` bakım collider'ı dışındadır. Bakım konisi yolun tamamını kapatmaz; açık geçiş denetlenemiyorsa o kesimde bakım görünümü ertelenir. Aktif süre, kesim kimliği ve evre §65 uyarınca kaydedilir. Kesim sayısı/süresi yeni ekonomi kuralı değildir.

## 6. Bahçe, göl, ağaç, taş ve hayvan konumları

| Dış alan | Hücreler / merkezler | Görünüm ve güvenlik | Faz |
|---|---|---|---|
| P0 üretim bahçesi | `x4..9,z20..27` | Su/domates ve iki hücrelik `x8..9` yürüyüş; diğer dikim yalnız açılmış tarifle | P0 |
| Göl kıyısı rezervi | `x2..7,z2..6` | Bölüm erişimi gelmeden siluet; P0 ham su kaynağı yerine geçmez | İlgili bölüm/faz |
| Koyun yeşil alanı | `x2..7,z8..13` | Alçak çit ve otlama; yaya geçişi `x9..10` dışında | A4 çevre sanatı |
| Batı korusu | `x2..5,z14..15` ve `x2..5,z19` | A2 kümes/mandıra `z16..17` ve servis `z18` açık; seyrek ağaç/çalı | A4 |
| Kuzey ağaç şeridi | `(14,2)`, `(20,2)`, `(27,2)`, `(34,2)` çevresindeki peyzaj cepleri | Yapının `z4` duvarına/kapısına değmez | A4 |
| Doğu bağ/zeytinlik ve tarla | `x42..47,z4..13` ve `x42..47,z16..23` | Satın alınabilir iki A3 parsel; ayrı sınır ve erişim §13'te | A3 |
| Doğu yeşil tampon | `x42..47,z25..34` | Seyrek ağaç/taş; `x36..39` servis yoluna ve parsel yoluna değmez | A4 |
| Güneybatı taş/çalı cebi | `x3..5,z29..33` ve `x6..9,z32..33` | A4 müşteri pavyonu `x6..9,z28..31` ve yaya bağlantısından uzak | A4 |
| Kedi sakin noktası | `x3..5,z28..29`, koru kenarı `x2..5,z19` | Pavyon, servis ve market kapısından uzakta kısa dolaşma/uyuma | A4 |
| Köpek sakin noktası | `x6..7,z19`, bahçe dışı `x8..9,z18..19` | A2 kümes/mandıra servisini ve yaya/araç çizgisini kesmeden kısa gezinme | A4 |
| Koyun dolaşımı | Yalnız `x2..7,z8..13` içi | Mağazaya, yola veya üretim bahçesine geçmez; süt/yün stokunu yaratmaz | A4 |

Ağaç kökleri/taşlar gösterilen **peyzaj ceplerinde** kalır; her hücreyi nesneyle doldurma talimatı değildir. Tekrarlanabilir seyrek dağılım görsel seed ile kurulur; rezervin dışında yeni collider veya ürün kaynağı oluşturulmaz. Ağaç gölgesi kasa/raf bilgisini kapatırsa kesilir veya soluklaştırılır. Hayvan ve araç hareketleri ayrı sahne bütçesine değil §63'ün toplam karakter/draw call bütçesine dahildir.

## 7. Ajanın uygulama ve değişiklik sırası

1. P0'da yalnız `R3-C0` satış odası, `x4..9,z20..27` bahçe ve iki hücrelik bağlantıyı inşa et. Üretim, raf, kasa ve tek müşteri yolunu gerçek içerik footprint'leriyle doğrula. Oda dışında rezerv alanları oynanabilir içerik gibi göstermeden sade uzak zemin kullan.
2. A2'de işleme `R2-C0`, kuru depo `R3-C1`, dinlenme `R2-C1` ve mal kabulün geçici pedini aç. Oda açılışında kapı çiftini ve iki hücrelik omurgayı üret; P0 nesnesi taşınıyorsa mevcut kimlik/parti/envanter korunur.
3. A3'te yalnız gerçek satın alma/erişim koşulu sağlanan soğuk depo, bakım, enerji, yönetim, eğitim ve diğer tanımlı odaları aç. `R0` rezervlerine otomatik bina yerleştirme.
4. A4'te §65 peyzaj, hayvan, dört görsel park cebi ve yol aşınma/bakım katmanlarını ekle. Kriz/final dünya izlerini gerçek görev bayrağına bağla; dekor para/stok/talep üretmez. Gerçek müşteri ve tedarikçiyle eşlenmeyen araç yalnız görseldir.
5. Her fazda inşa/taşıma/elden çıkarma, save/load, background dönüş, kamera ve küçük portre ekranında aynı koordinat/kapı/rota kimliklerini denetle. Cihaz veya oyuncu testinde pafta değişirse eski kayıtların koordinat göçünü ya da geliştirme kaydı sıfırlama sınırını açıkça karara bağla; sessiz taşıma yapma.

**Pafta kabulü:** Gerçek footprint'ler sığar; market güney kapısı, kasa, raf, şişeleme ve bahçe arasında iki hücrelik yapısal yol bulunur; servis hücreleri erişilebilir; teslim yolu yaya yolu ve müşteri kuyruğunu zorunlu kesmez; park/yol bakım kapıları açık kalır; oyuncu tarafından taşınan modüller hiçbir temel erişimi kesemez. Bu maddeler uygulama sırasında rota grafiği ve gerçek cihaz görünürlüğüyle ayrıca doğrulanır; belge çizimi test sonucu değildir.

## 8. Malzeme, renk ve yaşayan dünya sanat paftası

Bu bölüm, üstteki koordinat paftasının **hangi malzeme ve atmosferle üretileceğini** belirler. §62.1'in UI renkleri aynen kalır; 3B dünya bu renklerin daha sakin, mat eşleridir. Aşağıdaki hex değerleri ve ölçüler **başlangıç sanat seçimidir**, gerçek telefon ekranında renk/kontrast ve performans doğrulamasıyla revize edilebilir. Yeni mekanik, ekonomik bonus, hava sistemi veya tamamlanmış asset iddiası değildir. Ürün sayıları, footprint ve faz sınırı §58.1/§62–63/§65'e tabidir.

### 8.1 Ana görüntü: sıcak, okunur, yaşayan mahalle

Oyuncu ilk bakışta üç ilişkiyi aynı sahnede seçebilmelidir: **bahçe → üretim → satış**. Market, sokağın üzerinde sıcak ışıklı küçük bir odak; çevresi ise ağaç, toprak, taş ve hareket eden birkaç canlıyla nefes alan mahalledir. Oyun ekranı sinematik bir kapakla başlamaz. Sinematik his; 45° yatay/32° aşağı ortografik kompozisyon, belirgin ön–orta–arka plan, kontrollü ışık, malzeme farkı ve doğru anda görünen küçük eylemlerle kurulur. Kamera oyuncunun kontrolünü kesen otomatik turlar, dramatik zoom veya sürekli sarsıntı yapmaz.

Ana okunma sırası: (1) oyuncu ve taşıdığı ürün, (2) seçili istasyon/raf, (3) kapı ve müşteri rotası, (4) çevre atmosferi. Çevre hiçbir durumda kritik üretim, kasa, servis veya hata işaretinden daha parlak/doygun olmaz. HUD üstte ve alttayken merkezdeki dünya rahat okunur; ağaç/çatı oyuncuyu kapatırsa yalnız örten görsel parça soluklaşır/kesilir, collider ve rota değişmez.

### 8.2 3B malzeme ve renk kartelası

Bu tablo **dünya malzemeleri** içindir; DOM/CSS `ink/paper/sun/cyan/lime/pink` tokenlarını yeniden tanımlamaz. Aynı malzeme için temel renk ve en fazla 1–2 düz faset/atlas varyantı kullanılır; rastgele çok renkli yüzey veya gerçekçi foto doku yoktur.

| Kod / malzeme | Başlangıç tonu | Yüzey karakteri | Nerede |
|---|---|---|---|
| `world.wall.paper` | `#E7E0D2` | Sıcak kırık beyaz, mat sıva/boyalı panel | Market, dinlenme, eğitim, yönetim; UI `paper`dan biraz koyu |
| `world.floor.ceramic` | `#D8D0C0` | Mat, açık krem seramik karo; derz `#B8AE9F` | Satış alanı; dış müşteri pavyonu açık taş döşemedir |
| `world.floor.work` | `#AEB6B2` | Kaymaz taş/seramik görünümlü düz yüzey | Üretim ve mal kabul |
| `world.floor.concrete` | `#969B96` | Az benekli, mat beton | Kuru depo, bakım, servis avlusu |
| `world.floor.cold` | `#BBC8CC` | Açık mavi-gri yalıtımlı karo | Soğuk depo |
| `world.wood.warm` | `#99734F` | Düz damarlı, parlak olmayan ahşap | Tezgâh kenarı, bank, dinlenme/eğitim masası |
| `world.metal.ink` | `#353B43` | Koyu mürekkep taşıyıcı, düşük parlaklık | Raf iskeleti, kasa ayağı, makine gövdesi, çit |
| `world.machine.cyan` | `#4BABB2` | UI cyan'dan daha sakin emaye panel | Üretim makinelerinin okunur büyük parçası |
| `world.accent.sun` | `#D8B94E` | Soluk sıcak sarı, dar alan işareti | Etkileşim kenarı, yön, uyarı çizgisi; UI güneş sarısıyla yarışmaz |
| `world.soil` | `#795D46` | Düz koyu toprak + bir açık faset | Bahçe/sera yatağı |
| `world.grass` | `#739365` | Zeytine yakın orta yeşil + iki ton blok | Peyzaj ve mera; üretim yatağıyla karışmaz |
| `world.stone` | `#A8A49A` | Mat gri-bej, büyük kırık faset | Kaya, bordür, zemin taşı |
| `world.pavement` | `#BDB7A9` | Sıcak taş kaldırım, koyu derz | Market önü ve yaya aksı |
| `world.asphalt` | `#565C60` | Kömür-gri, soluk yama tonları | Ana yol, park erişim şeridi |
| `world.water` | `#65969B` | Opak mavi-yeşil, az faset | Göl ve kaynak yüzeyi; gerçek zamanlı yansıma yok |
| `world.far_ground` | `#9EAE91` | Düşük detaylı mat uzak arazi | Oynanamaz plan sınırının devamı; yeni rota/üretim yok |
| `world.sky` | `#BED1CF` | Düz, soluk mavi-gri arka plan | Kamerada görünen boşluk; foto gökyüzü veya hareketli gradient yok |
| `world.shadow` | `#667679` | Yarı saydam sıcak-gri/mavi lekeler | Blob/baked temas gölgesi; üretim durumunun yerine geçmez |

Kasa ve işaret yazılarında okunur koyu mürekkep tonu kullanılır. Ekonomik durum renkleri UI sözleşmesindeki metin/ikonla birlikte görünür; dünya sarısı yalnız gerçekten seçilebilir nesneye, pembe yalnız anlamı olan ikaza ayrılır. Makinelerin hepsi cyan'a boyanmaz: koyu gövde + bir cyan işlev paneli + ürüne özgü tek siluet parçası kullanılır. Ücretli kozmetik görünüm okunurluk veya cazibe gücü avantajı vermez.

### 8.3 Yapı kabuğu ve market içi yüzeyler

**P0 satış odası (`R3-C0`):** Başlangıç duvar yüksekliği yaklaşık 2,8 oyun birimi, ince düz parapet/çatı, mat kırık beyaz üst duvar ve ilk 0,4 birimde daha koyu dayanıklı süpürgelik (`#A9A093`). Duvar köşeleri ana blok olarak keskindir; ince pencere pervazı ve birkaç büyük çerçeve okunurluk içindir. Güney cephede `x14..15,z27` kapının iki yanında sınırlı iki vitrin açıklığı bulunur; cam açık mavi-gri, opaklığa yakın ve yansımasızdır. Vitrin müşterinin girişini/rafı göstermeli, parıltıyla HUD'a baskın olmamalıdır. Tabela kapının üstündedir; kayıtlı dükkân adı aynı metin kaynağından gelir.

**Zemin kararı:** Satışta mat seramik; başlangıç karosu yaklaşık yarım hücrelik kare görsel ritim verir. 1 m oyun grid'i karonun derzi değildir ve normal oyunda inşa ızgarası gibi görünmez. Derz ince ve düşük kontrastlıdır; uzaktan dama tahtasına dönmez. Kapı eşiğinde tek koyu taş şerit, kasa önünde yalnız hafif aşınma/ayak izi atlası vardır. Temizlik/hijyen olayı yokken kirli zemin efekti gösterilmez; görsel aşınma saklı hijyen cezası yaratmaz.

**Raf:** `world.metal.ink` modüler dikmeler, sıcak ahşap veya kırık beyaz düz raf tablası, opak ürün ambalajı. Raf doluluğu gerçek lot/adetlerden temsilî yığınla okunur; her birim için ayrı mesh yoktur. Ürün etiketi küçük ve yüksek kontrastlıdır, fiyatın tam detayı seçilen DOM panelindedir. **Kasa:** Koyu metal ayak + açık taş/ahşap tezgâh, bir büyük ödeme işareti; kuyruk çizgisi boyalı sayı değil, aktörlerin gerçek sıra hücrelerinden anlaşılır.

**Şişeleme:** En fazla 3–5 büyük siluet parçası: koyu taban, sakin cyan işlev gövdesi, opak su kabı/çıktı alanı. Çalışırken kısa büyük hareket; girdi yoksa hareket durur, çıktı doluysa sabit işaret ve nedeni görünür. Domates yatağı koyu toprak, büyük yaprak/salkım siluetleri; büyüme/hasat görünümü gerçek parti durumuna bağlıdır. Su kaynağı tek düşük poligon havza/çıktı portudur; göl rezervinin açılması P0 su kaynağı verimini değiştirmez.

**Çatı ve görünürlük:** Market ve açılmış odaların üst örtüsü sahne dışı siluet ve tabela için vardır; oynarken seçili oyuncu/makineyi örten güney/doğu çatı ve duvar parçaları kesilir veya düşük opaklıkla çizilir. Uzak kuzey/batı duvarları hacim duygusunu korur. Kamera değişimi collider, oda sınırı veya içerik üretmez. Tam sahne üstü pahalı outline/bloom kullanılmaz.

### 8.4 Oda bazında iç mimari çizelgesi

Malzeme/ışık her odanın işlevini ilk bakışta ayırır; aynı kübik kit ve §3.1'deki köşe cepleri kullanılır. Aşağıdaki tasvir **oda açılışından sonra** geçerlidir; rezerv odayı P0'da çizme talimatı değildir.

| Oda | Zemin / duvar | Sabit görsel odak ve ışık | Kullanım notu |
|---|---|---|---|
| Satış / dış müşteri pavyonu | Satışta krem mat seramik ve kırık beyaz duvar; pavyonda açık taş ve geniş mat cam | Giriş üstü sıcak ışık, raf/kasa arasında net kontrast; A4 ayrı pavyonda iki koltuk ve yön levhası | Satış nişi makine taşınınca boş kalır; 4×4 pavyon ücretli işlevsel odadır |
| İşleme | Kaymaz `#AEB6B2` karo; açık gri-alt duvar, koyu metal süpürgelik | Gerçek çalışan istasyonda tek sakin cyan durum alanı ve görev ışığı | Girdi/çıktı cebinin önü boş, sahte buharla duruş nedeni örtülmez |
| Kuru depo | Mat sıcak gri beton; kırık beyaz üst panel | Büyük ham/ara/nihai işaretler, koyu raf silueti | Serbest/rezerve/yoldaki miktar yalnız doğru panelde; duvar kutu kalabalığı yok |
| Mal kabul | Mat koyu beton, ince sarı yaya sınırı; açık üst duvar | Kontrol masası, kapı üstü teslim işareti; kapıdan gelen doğal ışık | A2 geçici pedinde tam oda/dekor yok; ürün kabulü animasyondan değil kayıttan |
| Soğuk depo | Açık mavi-gri mat karo, yalıtımlı açık panel | Sabit soğuk simgesi ve raf gövdesi; daha serin ışık tonu | Yoğun kar/parçacık yok; sıcaklık/power nedeni panelde |
| Dinlenme | Mat ahşap görünümlü modüler levha; sıcak açık duvar | İki okunur koltuk, sebil, sakin sarımsı ışık | Mola yalnız gerçek rezervasyonla başlar, boş koltuk dekoru otomatik enerji vermez |
| Bakım atölyesi | Mat gri beton; koyu alt panel | Ahşap tezgâh, büyük alet silueti, yerel çalışma lambası | Kullanım izi bakım durumu göstergesi değildir; yol tadilatından ayrıdır |
| Sera | Toprak yatakları arasında mat açık taş geçiş; kırık beyaz çerçeve | Büyük bitki formları, opak soluk cam paneller | Sulama/hasat gerçek lota bağlı; pahalı cam yansıması yok |
| Enerji | Koyu taş/beton; açık üst panel | İki büyük modül silueti, ölçülü sarı uyarı ve okunur kapasite işareti | Güç kesintisi neden/öncelikle açıklanır, sürekli kırmızı yanıp sönme yok |
| Eğitim | Sıcak ahşap levha; açık duvar | Tek iki kişilik masa, büyük pano, sakin yön ışığı | Öğrenci/mentor pozu gerçek eğitim durumuna bağlı |
| Yönetim | Açık taş karo; kırık beyaz duvar, koyu metal çizelge | Masa, toplu durum panosu, az sayıda kâğıt silueti | Sayısal ayrıntı DOM panelde; duvar ekranı ikinci veri kaynağı olmaz |
| Topluluk | Açık taş + sıcak ahşap; seçili hikâye alanında dar pembe vurgu | Kriz/finalden sonra değişen gerçek pano/tabela | İlerleme bayrağı yokken finale ait tamamlanmış tabela görünmez |
| Soyunma | Mat nötr karo; koyu dolap metali | İki dolap grubunda küçük okunur numara ve hazırlık bankı | Vardiya pozu gerçek personel görevinden gelir |

### 8.5 Dış cephe, sokak ve doğal yüzeyler

**Dünya zemini ve ufuk:** Oynanabilir parsel dışı, `world.far_ground` geniş sade parçalar ve birkaç büyük uzak ağaç siluetiyle devam eder; bittiği yerde `world.sky` düz arka plan kullanılır. Uzak görüntü yeni gidilebilir mahalle vaadi değildir. Yoğun sis, foto gökyüzü ve tam ekran renk filtresi küçük ekranda stok/işaret kontrastını düşürmez.

**Market önü (`z28..29`):** `world.pavement` büyük, mat kaldırım plakları; kenarda `world.stone` bordür. Güney kapısından `x14..15` boyunca açık yaya bandı vardır. Pavyon dışındaki küçük çevre eşyaları §13'ün açık ceplerine yerleşir; giriş görüşü/iki hücre yolu bozulmaz. Tabela ve bir asılı işaret ana aksa bakar; bütün cepheyi reklam panosuna çevirmeyiz.

**Otopark (`z30..34`):** Yol asfaltından bir ton açık yama ve kesintisiz düşük kontrastlı park çizgileri. P1–P4 tek tek okunur; her araç iki hücre genişlikte blok siluete, koyu lastik ve sınırlı cam alanına sahiptir. Canlılık; geliş, dönüş, kısa bekleme ve ayrılmanın seyrek ritmidir. Araçlar yaya bandına taşmaz. Far parıltısı, sürekli korna ve gerçek zamanlı gövde yansıması yoktur. Tedarik avlusu daha koyu beton/taş ve ayrı yük işaretiyle müşteri parkından ayırt edilir.

**Ana yol (`z35..38`):** Mat kömür-gri asfalt, büyük düz renkli yama parçaları ve açık taş-sarı şerit. Aşınma ilerledikçe 1–2 soluk çizgi, sınırlı çatlak ve yama katmanı eklenir; her hücre mikro detayla doldurulmaz. Bakımda koni, alçak bariyer, küçük servis aracı ve 1–2 görevli silueti yalnız §5'teki güvenli W1–W3 kesimindedir. Yenilenen kesim diğerlerinden biraz koyu/düz görünür; sonra görsel ton normalleşir. Bu, satış/teslim gecikmesi veya onarım borcu değildir.

**Bahçe (`x4..9,z20..27`):** Koyu toprak yatakları, açık sıkıştırılmış zemin yolu ve alçak taş/ahşap kenar. P0 su ve domates önce okunur; diğer ürün ailesi kilitliyken rastgele hasat görseli çıkmaz. Bölüm açıldıkça özgül ürün siluetleri gelir; tek atlası rengârenk tarlaya dönüştürme.

**Ağaç, çalı ve kaya cepleri (§6):** Ağaç gövdesi sıcak koyu ahşap, taç 2–3 büyük blok/faset yeşili; yüksekliği farklı birkaç tekrar parça. Çalı daha koyu/yuvarlak kübik, ot/çiçekler seyrek alçak kart veya üçgen grup. Büyük kaya mat gri-bej 4–6 belirgin yüzeyli blok; küçük taşlar yola dağılmak yerine cepte kümelenir. Ağaçlar ana kapı/kasa hizasını perdelemez. Kuzey şeridi derinlik verir, batı korusu bahçeyi çerçeveler, doğu yeşil tampon servis yoluna sınır çizer.

**Göl ve mera:** Göl açılmadan sakin siluet; açılınca opak mavi-yeşil yüzey, kenarda az sayıda saz ve düz taş. Ekranı dolduran şeffaf dalga/refleksiyon yok. Koyun alanı sıcak yeşil ot ve alçak ahşap çitle ayrılır; koyun blok yün gövde, koyu baş/bacak, kısa otlama/baş kaldırma animasyonu taşır. Koyun burada çevre canlısıdır, stok üretim makinesi değildir. Kedi ve köpek küçük ayırt edilebilir siluet/pozla §6'nın sakin ceplerinde kalır.

### 8.6 Işık, gölge, hareket ve ses ritmi

**Temel ışık:** P0 açık ve yumuşak gündüz. Bir ana yön ışığı kuzeybatıdan sıcak-krem vurgu verir; hafif serin çevre ışığı gölge tarafını okunur tutar. Oda içindeki kasa, üretim ve oturma ışıkları yalnız çevre/işlev vurgusudur; ayrı ekonomik sayaç değildir. Yüzeylerde parlak yansıma yerine sabit açık/koyu faset ve blob/baked temas gölgeleri vardır. UI düz renk kalır; dünya ışığı UI tokenlarını bozmaz. Gündüz/gece varyantı istenirse A4 kozmetik seçenektir; 900 aktif saniyelik oyun günü veya müşteri talebiyle yeni kural bağlanmaz.

**Sinematik çerçeve:** Market tabelası ve sıcak giriş ışığı orta planda; solda bahçe/koru, sağda depot/servis çizgisi, en arkada yol ve birkaç ağaç parçası. Kamera oyuncuyu takip ederken yumuşak görsel enterpolasyon yapabilir, fakat Domain tick'i veya gerçek dünya koordinatı değişmez. Büyük sahne açılırken kamera zorla uzak alana uçmaz; oyuncu pan/zoom ve karaktere dön denetimini korur. Çatı/duvar kesmesi katman katman, ani sahne sıfırlaması olmadan yapılır.

**Yaşam ritmi:** Eşzamanlı sürekli hareket yerine aralıklı küçük olaylar. Makine gerçek Running durumunda kısa mekanik döngü yapar; çıktı hazır olunca temsili paket belirir; görevli gerçek rotasında bir yük taşır; müşteri raf–kasa yolunu izler; hayvan kısa gezinip durur; ağaç hafif salınır; araç gerçek veya dekoratif kimliğiyle park eder/çıkar. Her katman kendi ayrı görsel seed'ini kullanır; ekonomi RNG'si tüketilmez. Aynı olayın yeniden yüklenmesi ikinci satış, stok veya ödül doğurmaz.

**Ses:** Bahçede seyrek yaprak/kuş, markette düşük yoğunluklu adım/raf, üretimde gerçek çalışma vuruşu, yol tarafında çok seyrek araç geçişi. Ortam, müzik ve efekt ayrı kısılabilir; hayvan/kornanın sürekli tekrarı yoktur. Ses, durum anlaşılması için tek kanal değildir; kapalı seste metin/ikon/animasyonun sade hali aynı bilgiyi verir. D-025 toplam eşzamanlı ses sınırı ve platform arka plan sessizliği korunur.

**Azaltılmış hareket:** Ağaç salınımı, ikincil hayvan jestleri, kasa vurgu sarsıntısı ve yumuşak kamera takip etkisi azaltılır/kapanır. Gerçek aktör konumu, yol güvenliği, inşa önizlemesi ve satış sonucu aynı kalır. Ekran okuyucuya dünya malzemesi değil, ilgili seçili nesnenin durum/eylem açıklaması sunulur.

### 8.7 Üretim sırası ve görsel kabul

| Faz | Üretilecek görsel set | Kabul sorusu |
|---|---|---|
| P0 | Sıcak seramikli tek satış odası, kırık beyaz duvar, koyu raf/kasa, sade cyan şişeleme, toprak domates yatağı, basit bahçe zemini, kapı/iki hücreli yol | Ürün akışı ve boş raf nedeni küçük portre ekranda görülebiliyor mu? |
| A2 | İşleme/depoya ayrı zemin ve büyük işaretler, dinlenmeye sıcak malzeme, gerçek kabul noktası | Oyuncu üç odanın işlevini sayı okumadan ayırabiliyor mu; iki yerleşimde rota sonucu fark ediliyor mu? |
| A3 | Soğuk, bakım, enerji, eğitim ve yönetim malzemeleri; gerçek durum işaretleri | Görsel duruş nedeni gerçek sistem durumuyla uyuşuyor mu? |
| A4 | Tam peyzaj, hayvanlar, dört park cebi, araç akışı, yolda aşınma/bakım evreleri, topluluk ve final izleri | Mahalle canlı ama satış/rota/HUD okunur mu; düşük cihaz profili §63 bütçesinde mi? |

**Her fazın kontrolü:** Dünya malzemesi 2–3 düz ton/faset; atlas/instancing uygun; düşük profilde ≤150 draw call, ≤150 bin görünür üçgen, ≤25 animasyonlu karakter ve DPR ≤1,25 **ölçüm hedefidir**. Üst profilde DPR ≤1,5. Bu pafta değerlerin sağlandığını kanıtlamaz. Gerektiğinde önce uzak bitki/araç/hayvan yoğunluğu, sonra ikincil hareket ve gölge ayrıntısı azaltılır; Domain state'i, ürün/satış görünürlüğü veya UI kontrastı azaltılmaz. Ortografik açı ve safe-area korunur; küçük ekran, büyütülmüş metin, yüksek kontrast, az hareket ve sessiz modda ayrı bakılır.

**Asset teslim biçimi:** Her varlık için kimlik, ait olduğu faz/alan, footprint ile çarpışma yüzeyi, görünen malzeme kodu, seçildiğinde kontur/solma davranışı, LOD/atlas grubu, animasyonun bağlandığı gerçek durum ve varsa ses olayı belirtilir. Raf, makine ve ürün sanat dosyası para/stok kuralı taşımaz. Renk kartelasındaki yeni tonlar UI token değişimi olarak kaydedilmez; cihazda okunurluk düzeltmesi gerekiyorsa bu pafta ve ilgili [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md) birlikte güncellenir.

## 9. Ajan için kapı, duvar ve oda içi kesin çizim tarifi

Bu bölüm **sanat ve varsayılan mimari yerleşim kararıdır**; odaların satın alınmış/açılmış olduğunu söylemez. Bölüm 3'teki matris odaları 6×6'dır; A4 dış müşteri pavyonu §13'te ayrı 4×4 modüldür, §9 taşınabilir oda varyantları da desteklenir. Duvar hücre merkezinden değil dış kenardan yükselir. Kapı genişliği iki hücredir. `K`, `D`, `G`, `B` sırasıyla kuzey/doğu/güney/batıdır. Bir komşu oda veya geçit fiilen açılmadıysa listelenen kapı yerinde **kesintisiz duvar ve collider** vardır. Bir odanın içerik/bağlantı yolu hazır değilse tek başına etkin oda yapılmaz.

### 9.1 Tekrarlanabilir yapı kiti

| Parça | Ajanın çizeceği biçim | Davranış/sınır |
|---|---|---|
| Genel iç duvar | Alt 1/3'te darbe dayanımlı mat sıcak taş rengi süpürgelik, üstte kırık beyaz sıvalı düz panel; köşede tek kalın koyu çizgi | Her duvara rastgele poster/raf konmaz. Odanın kendi satırında yazmayan eşya çizilmez |
| Dış cephe | Açık kireç sıva, düşük taş kaide, koyu ahşap/metal dikme; satış girişinde tek `ORBIT MARKET` tabelası | Cephe komşu kapalı rezervi bina gibi taklit etmez; inşa edilen modül kadar uzar |
| Kamu kapısı `P` | İki hücre açıklık, koyu çerçeve ve büyük mat cam kanat; eşikte sıcak seramik aynı hizadan sürer | Satış güney girişinde tek kamu kapısı. Açılış/çıkış yönü yaya aksına taşmaz; çarpışma yalnız açık geçitte kaldırılır |
| Personel kapısı `S` | İki hücre açıklık, bel hizasına kadar opak sıcak gri sürgü paneli, üstte küçük frosted cam şerit; yanına küçük oda piktogramı | Müşteri kapısı değildir. Erişim rol/rota kuralından gelir; dekor kapı kilidi yeni oyun mekaniği değildir |
| Yük kapısı `Y` | İki hücre açıklık, koyu metal kasalı düz geniş sürgü, zeminde ince sarı yön çizgisi | Servis avlusundan mal kabule; kamyon yolu ve yaya aksı ayrılır. Açılmamış kabul odasında görünmez |
| Soğuk kapı `C` | İki hücre açıklık, kalın açık mavi-gri panel, kalın conta ve tek büyük kar tanesi işareti | Güç durumu lambası bilgi verir; görsel kapı kendiliğinden ürün koruma kuralı üretmez |
| İç pencere | Yalnız aşağıdaki oda tarifinde belirtilen duvarda üst bant veya alçak çerçeve; düz yarı opak cam | Ortografik kamerayı engellerse çatıyla beraber soluklaşır. Pencere collider veya geçit değildir |
| Çatı kesiti | İnşa edilmiş odanın açık/koyu düz çatısı, duvar üst kenarını okutan ince şerit | Oyuncuyu/etkileşimi örttüğünde yalnız görsel yüzey kesilir. Duvarın mantıksal çarpışması kalır |

**Eşik kuralı:** Kuzey/güney kapıları odanın orta `x+2..3`, doğu/batı kapıları orta `z+2..3` hücrelerine bakar. Kapı önünde eşya, pano ayağı, koltuk veya kasa kuyruğu kurulmaz. Açık kapıdaki zemin rengi odadan odaya sınır çizgisiyle geçer; rota genişliğini bir hücreye indiren pervaz yoktur. Görselde kapalı görünen kapıdan aktör geçmez; geçilen açıklık da görünmez duvar gibi çizilmez. Müşteriyle personelin aynı duvardaki ayrı ayrı rastgele kapıları yoktur.

### 9.2 Oda bazında dört duvar, kapı, pencere ve eşya

**R3-C0 Satış — P0.** Güney duvarının ortasında `P` kapı (`x14..15,z27`), bu kapının iki yanında diz hizasından başlayan iki sabit vitrin camı vardır; vitrin kapı değildir. Batı duvarının orta iki hücresinde bahçeye `S` açıklığı (`x12,z24..25`); kuzey, R2-C0 açılana dek sıva duvar, açılınca merkezde `S`; doğu, R3-C1 açılana dek sıva duvar, açılınca merkezde `S`. Duvar altı silinebilir bej seramik, üstü kırık beyaz; kasanın arkasında tek küçük fiyat/ödeme panosu, batı üretim nişinin arkasında mavi su piktogramı; başka yazı/poster yok. Güneybatı cepte alçak koyu ahşap raf, kuzeydoğuda koyu metal kasalı ve açık tezgâhlı kasa, kuzeybatıda P0 şişeleme. Rafın önü müşteri erişimine, kasa önü mantıksal sıraya ayrılır; ana kapıdan gelen orta koridor sabit eşyadan boştur. Şişeleme **gerçekten taşındıktan sonra** eski niş boş görüş/nefes alanıdır; işlevsel müşteri oturma odası ayrı 4×4 pavyondur. Zemin §8'in krem mat seramiğidir; kir animasyonu tüm yüzeyi rastgele lekelemez.

**R3-C1 Kuru depo — A2.** Batıda satış açıldığında `S`; doğuda A2 teslim pedi kullanıma girdiğinde dışarıya bakan `S` çıkışı, aynı eşikte tam mal kabul odası açıldığında iç `S` geçidi; kuzeyde R2-C1'e `S`; güneyde pencere/kapı yoktur. Sıva yerine alt yarıda düz koruyucu gri panel, üst yarıda sıcak kirli beyaz; güney duvarında büyük fakat tek satırlık `HAM / ARA / SON` bölme işaretleri. Kuzeybatıda ham/ara için açık metal raf, kuzeydoğuda nihai için aynı raf, güneybatıda ayrılmış lotların temsilî kasası; güneydoğu manevra boşluğu. Her görünür kasa gerçek lot/doluluk durumunu temsil eder; raf önündeki servis yüzü ve merkez geçişi açıktır. Dış cephede pencere yok; depo kapısını vitrin gibi yapma.

**R3-C2 Mal kabul — A2 ped, tam oda içerik açılınca.** Batı R3-C1'e `S`, kuzey R2-C2 açıldığında `C/S` işaretli iç geçit, doğu servis avlusuna `Y`; güney kapalı kör duvar. Tam oda inşa edilmeden yalnız avluda basit teslim pedi görünür, dört duvarlı kabul salonu oluşmaz. Tam odada duvar altı koyu yıkanabilir taş, üstü bej; doğu yük kapısının üstünde tek büyük teslim ok işareti, batıda sipariş/lot kontrol listesi. Kuzeybatıda alçak kontrol masası ve tartı silueti, kuzeydoğuda etiket pultu, güneybatıda bekleyen gerçek sevkiyat için zemin kasası, güneydoğuda boş taşıma cebi. Bekleyen ürün teslim edilmeden depo rafına ışınlanmaz; `AwaitingSpace` tek görünür bekleyen yığın/işarettir.

**R3-C3 Açık servis avlusu — A2 geçiş.** Bu alanın **odası, çatısı ve dört tam duvarı yoktur**. Batı kabul odası inşa edildiğinde `Y` eşiği; doğu `x36..39` servis yoluna açık; kuzey ve güney kenarda alçak güvenlik bordürü. Zemin mat koyu beton, orta `z24..25` iki hücrelik yük geçidi; kuzeybatıda yalnız gerçek teslim anında palet, güney kenarında tek güvenlik çizgisi. A4 van bu alana girebilir, park yeri sayılmaz. Müşteri girişi bu tarafta üretilmez.

**R2-C0 İşleme — A2.** Güney satışa `S`; doğu dinlenme açıldığında `S`; kuzey sera açıldığında `S`; batı dış servis/üretim duvarı, burada kapı yok. Alt duvar açık taş-gri yıkanabilir panel, üst duvar sıcak beyaz; kuzey duvarında bir yüksek dar pencere ve tek üretim akış şeması `GİRDİ → İŞLEM → ÇIKTI`, güneyde kapı yanında güvenlik işareti. Kuzeybatıda P0'dan taşınmış mevcut şişeleme istasyonu veya boş cep; kuzeydoğuda yalnız satın alınmış ikinci istasyon; güneybatıda gerçek girdi kasası, güneydoğuda çıktı tamponu. Yan yana makineler orta `x14..15` ve `z18..19` koridorunu işgal etmez. Taş pres/fırın/değirmen/tezgâh gibi her 1×2 istasyon aynı anda bu odaya sığacakmış gibi çizilmez; yeni istasyon için geçerli footprint ve servis testi yapılır, gerekirse genişleme kararı gerekir.

**R2-C1 Dinlenme — A2.** Batı işleme, güney kuru depo, doğu soğuk depo açıldığında `S`; kuzey enerji açıldığında `S`. Alt duvar açık ahşap kaplama, üst duvar kremsi sıva; güney kapı yanında tek vardiya/mola panosu, doğuda küçük üst pencere yalnız dış cephe varsa (bu matris içinde yoktur). Kuzeybatı ve kuzeydoğuda iki ayrı koltuk, güneybatıda küçük sebil/yan masa, güneydoğu boş dolap cebi. Koltuk üstündeki personel yalnız gerçek mola/rezervasyon durumuyla görünür; dekor üçüncü dinlenme slotu yaratmaz. Sıcak ahşap zemin sınırı kapıda bitebilir, kaygan parlak cila yoktur.

**R2-C2 Soğuk depo — A3.** Güney mal kabul tam odası, batı dinlenme, doğu bakım açıldığında `C`; kuzey eğitim açıldığında `C`; açılmamış komşu tarafı yalıtımlı duvardır. Dört duvarda açık mavi-gri panel ve koyu conta, dış pencere yok; güney kapıda tek `SOĞUK` işareti ve sıcaklık/güç durum simgesi. Kuzey iki köşede kalın yalıtımlı raf, güneybatıda güç/izleme dolabı, güneydoğuda kabul tamponu. Raflar buz parçacığı saçmaz; güç kesilince yalnız gerçek sistem durumundan işaret değişir. Ürün için ömür/lot mantığı görsel renk tonundan çıkarılmaz.

**R2-C3 Bakım atölyesi — A3.** Batı soğuk depo açıldığında `S`, güney açık avluya yalnız tanımlı personel servis çıkışı `S`, kuzey yönetim açıldığında `S`; doğu dış duvarında yüksek dar gün ışığı bandı, kapı yok. Alt duvar koyu metal darbe paneli, üst duvar açık gri; kuzeyde asılı üç alet silueti, güneyde gerçek servis kuyruğu durum etiketi. Kuzeybatı çalışma tezgâhı, kuzeydoğu kapalı alet dolabı, güneybatıda bakım bekleyen tek temsilî parça, güneydoğu manevra alanı. Buradaki bakım makine/oda servisidir; A4 yol tadilat ekibi ve yol kapaması bu odanın ekonomisiyle kendiliğinden bağlanmaz.

**R1-C0 Sera — A3/A4 içerik erişimi.** Güney işleme ve doğu enerji açıldığında `S`; kuzey topluluk açıldığında `S`; batı dış duvarda yatay yüksek cam şerit. Alçak taş kaide, üstte koyu ince çerçeveli yarı opak sera paneli; şeffaf tam duvar kamerayı ve seçimi boğmaz. Kuzeybatı ve kuzeydoğu cepleri iki ayrı blok bitki yatağına ayrılır, güneybatı gerçek girdi, güneydoğu hasat tamponudur. Bitki türü yalnız erişilebilir tarif/edinim yolundan gelir; kilitli türü rastgele dolgu bitkisi olarak çizme. Su/büyüme işareti gerçek yatak durumuna bağlıdır.

**R1-C1 Enerji — A3.** Batı sera, doğu eğitim, güney dinlenme, kuzey soyunma açıldığında `S`; bu kapıların dışında pencere yok. Dört duvar açık gri sıva ve bel altında koyu teknik kaide; kuzeyde tek hat şeması, güneyde kapasite/öncelik panosu. Kuzeybatı gerçek modül, kuzeydoğu ikinci modül için boş rezerv, güneybatı kontrol yüzeyi, güneydoğu servis boşluğu. Parlayan kablo, dekor jeneratör ve görünürde sınırsız güç üretme yoktur; kapasiteler gerçek sistemden gelir.

**R1-C2 Eğitim — A3/A4 içerik erişimi.** Batı enerji, doğu yönetim, güney soğuk depo, kuzey R0-C2'de §13.3 işleme kopyası gerçekten satın alınıp açıldığında `S`; aksi hâlde kuzey tam duvardır. Alt duvar açık ahşap, üstü kırık beyaz; kuzeyde tek boş/gerçek ders panosu, güney kapı yanında süre/beceri durum simgesi. Kuzeybatı iki kişilik çalışma masası, kuzeydoğu mentor sandalyesi, güneybatı duvar panosu, güneydoğu açık uygulama cebi. Mentor ve öğrenci pozu yalnız gerçek eğitim işi sırasında oynar; masada kozmetik öğrenci ordusu yoktur.

**R1-C3 Yönetim — A3.** Batı eğitim, güney bakım açıldığında `S`; kuzey R0-C3'te §13.3 işleme kopyası gerçekten satın alınıp açıldığında `S`, aksi hâlde duvar; doğu dış duvarında dar yüksek pencere, kapı yok. Alt duvar sıcak ahşap, üstü düz açık sıva; kuzeyde vardiya çizelgesi, doğuda sipariş/araştırma için tek etkileşim paneli. Kuzeybatı yönetim masası, kuzeydoğu çizelge terminali, güneybatı iki kişilik görüşme köşesi, güneydoğu boş karar cebi. Panel gerçek menüye açılır, ikinci domain durumu yaratmaz.

**R0-C0 Topluluk — A4.** Güney sera, doğu soyunma açıldığında `S`; kuzey dış duvarda iki küçük üst pencere; batı dış duvar kapalıdır. Duvar sıcak taş/sıva, pano çevresinde tek vurgu rengi; kuzeybatı ortak ilan panosu, kuzeydoğu gerçek görev/final izi, güneybatı kısa görüşme bankı, güneydoğu boş sergi cebi. Tamamlanmamış görev için bitmiş anıt, boş proje için etkin bonus gösterme.

**R0-C1 Soyunma — A3/A4 içerik erişimi.** Batı topluluk, güney enerji açıldığında `S`; doğu R0-C2 ve kuzey dış cephe kapalı, kuzeyde ince üst pencere olabilir. Alt duvar dayanıklı açık gri panel, üstte kırık beyaz; kuzeyde iki numaralı sade dolap grubu, güneybatı hazırlık bankı, güneydoğu geçiş boşluğu. Dolap sayısı işçi kapasitesi veya otomatik personel sayısı değildir. Etkin vardiya durumu panelde görünür.

**R0-C2 ve R0-C3 başlangıç rezervleri.** Satın alınmadan zemin/dört duvar/kapı/pencere/mobilya oluşturma; inşa edilmemiş arazi rengi göster. §13.3'teki doğrulanmış işleme odası kopyası satın alınırsa R2-C0 yapı kiti/zemin/duvarı tekrarlanır ve yalnız açık komşuya merkez `S` kapısı üretilir. Mutfak, VIP salonu veya ücretsiz makine uydurma.

### 9.3 Kapı ve duvar son kontrolü

| Kontrol | Beklenen sonuç |
|---|---|
| P0 dışarıdan bakış | Yalnız satış odası ve bahçe bağlantısı fiziksel; kuzey/doğu duvarı tamdır, rezerv odaların silueti yoktur |
| A2 açılışı | Satış–işleme ve satış–depo kapıları görünür; depo doğu çıkışı gerçek açık hava kabul pedine bağlanır, bu ped duvarlı oda gibi çizilmez |
| Kapalı komşu | O tarafta ne boş kapı çerçevesi ne kapı ikonu ne geçilebilir collider vardır |
| Kamu/personel ayrımı | Müşteri `P` güney girişinden satış rafı/kasasına; personel `S/Y/C` gerçek yetkili iş rotasına gider |
| Erişilebilirlik | Kapı üstü piktogram + seçili nesne metni, yalnız renk veya ses değil; iki hücrelik eşik ve kamera kesiti açık |

## 10. Müşteri, personel ve çevre sakini karakter paftası

**Durum ayrımı:** Aşağıdaki yüz/kıyafet/siluetler sanat kararıdır. Müşteri profilleri, rota ve sabır gibi davranış sınırları [UI_DESIGN_SYSTEM.md §10](UI_DESIGN_SYSTEM.md) ve [anayasa §62/§65](OYUN_GELISTIRME_DEVIR_DOSYASI.md) kaynağına bağlıdır. Yüz ve kıyafet görünümü tek başına yeni bütçe, talep, sabır veya satış olasılığı üretmez. Bir müşteri bir mantıksal aktördür; aynı kişinin park eden otomobili, kuyruktaki gövdesi ve satın aldığı yükü ikinci spawn'a dönüştürme.

| Kimlik / görünüş seti | Baş, gövde, kıyafet ve eldeki ayırt edici şekil | Nerede ve ne zaman görülür |
|---|---|---|
| P0 temel mahalle müşterisi | Tek blok baş, kısa/orta gövde varyantı, mat lacivert veya toprak rengi üst, açık bez çanta; yüz için iki nokta göz ve tek ağız çizgisi yeter | Güney `P` kapısından girer; rafın önünde durur, gerçek seçimden sonra kasaya geçer ve aynı kapıdan çıkar. P0'da kalabalık varyant ordusu yoktur |
| Yerleşim çalışanı profili | Turuncuya kaçmayan iş yeleği, koyu pantolon, omuzda dikdörtgen iş çantası; baret zorunlu değil | Gerçek müşteri olarak aynı kapı/raf/kasa rotası. İş kıyafeti personel yetkisi veya ekstra indirim vermez |
| Araştırmacı profili | Sakin gri-yeşil ceket, çapraz saha askısı ve küçük kare örnek kutusu/tablet; gözlük isteğe bağlı tek aksesuar | Gerçek müşteri olarak alışveriş yapar. Saha aracı araştırma ödülü veya veri toplama sayacı başlatmaz |
| Kurye profili | Koyu mavi kısa ceket, sırtında okunur kutu biçimli sevkiyat çantası; personel taşıyıcısının çerçevesinden farklı görünür | Müşteri profilinin rolüdür; gerçek tedarik vanı veya bedava teslimat oluşturmaz |
| Gerçek mağaza personeli | Aynı temel iskelet, sekiz rolün önlük/rozet/alet farkı [UI_DESIGN_SYSTEM.md §10](UI_DESIGN_SYSTEM.md) tablosuna göre | Raf, kasa, taşıma, üretim, teknik servis, yetiştirme, satın alma veya vardiya işi gerçek komut/iş durumundan görünür |
| A4 ortam sakini | Sade tek ton mont ve küçük çanta, müşteri alışveriş işareti yok; kasaya yaklaşmayan farklı yürüme silueti | Yalnız çevre ceplerinde; performans bütçesi dolunca önce kaldırılır. Müşteri sayacı veya collider ile kapı kesmez |

**Ortak model ölçütü:** Baş belirgin blok, boyun yok veya kısa, omuz genişliği gövdeden açıkça okunur; eller iki basit parça, ayaklar zemine temas gölgesiyle ayrılır. Cilt tonu ve saç için çeşitli sakin paletler kullanılabilir; köken/milliyet kalıbı kurulmaz. Bir müşteriyi diğerinden esasen siluet, çanta ve üst kıyafet ayırır; yalnız palet değiştirmek yetmez. Düşük profilde tek paylaşılan gövde/iskelet ve atlas kullanılır; yakın portre için ayrıntı çoğaltılmaz. Faz sınırı ve toplam animasyonlu karakter bütçesi §63'tür.

**Hareket çizelgesi:** Dış eşik `x14..15,z28..29` → güney `P` kapısı → satış iç aksı `x14..15` → raf servis önü `x13,z26` → kasa önü `x16,z22..23` → kapıdan çıkış. Kasada tek müşteri işlem görür; arkadaki gerçek aktörler kuyruk hücresine sırayla yerleşir. Raf boşsa bakınma/alternatif/çıkış pozu, para/fiyat reddinde sakin geri çekilme; hiçbirinde bedava ürün, kutlama veya ürünü elde tutma animasyonu yok. Gerçek satış onayından önce çıkışta satın alınmış çanta dolu görünmez. Kuyrukta küçük baş çevirme görsel döngüdür, sabır süresini değiştirmez. Kapıdaki açılma görseli collider/rota kararıyla aynı anda olmalıdır; kamera kesiti karakteri görünür tutar.

**A4 dış canlıları:** Kedi açık krem veya koyu tek ton, küçük üçgen kulak ve uzun kuyruk; `x3..5,z28..29` ya da koru kenarında oturur/gerinir. Köpek gövdede daha uzun blok, düşük kulak ve kısa kuyruk; `x6..7,z19` çevresinde bekler/kısa yürür. Koyun iri krem yün blokları, koyu küçük yüz ve dört kısa bacak; yalnız çitli `x2..7,z8..13` merasında otlar. Kuş küçük iki kanat üçgeni olarak isteğe bağlıdır. Hayvanlar dekoratif canlıdır; petek, süt, yün veya stok üretmez, oyuncu/kasa/araç yolunu kesmez. Erişilebilirlikte hayvan sesi zorunlu bilgi kanalı değildir.

## 11. Üretim aracı ve doğal kaynak görsel envanteri

**Kaynak:** İstasyon kimliği, temel footprint/güç ve ürün ilişkisi [OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md §2–3](OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md) içindir. Aşağıdaki malzeme/siluet/poz **sanat kararıdır**. `1×2` veya `2×2` yazısı katalog footprint'idir; arazi/oda önerisi bir açılma koşulu değildir. Bir istasyonun teknik servis portu katalogda kesin hücreye bağlanmamışsa yerleştirme anında gerçek tanımla doğrulanır. Bütün hareketler gerçek `Running/Ready/Blocked/Stopped` benzeri durumdan gelir; animasyon tarifi kendi kendine ürün üretmez.

| İstasyon / faza uygun alan | Tek tek çizim tarifi, girdi-çıktı okunurluğu |
|---|---|
| `source.spring_water` — P0 bahçe | Alçak yontulmuş taş başlık, kısa mavi-gri oluk, altında kapalı oval hazne ve tek büyük damla piktogramı. Akış yalnız kaynağın gerçek üretim/hazne durumunda gösterilir. Çeşme P0 ham su kaynağıdır; dekor göl/yağmur aynı kaynak sayılmaz. Kesin 2×2 footprint ve servis portu katalog ile §13.1'de tanımlıdır |
| `station.bottler` — 1×2, P0 satış nişi → doğrulanmış taşıma sonrası işleme | Mat açık mavi metal tezgâh, bir dikey dolum başlığı, yanda üç ölçek silueti: ince şişe, saplı 5 L bidon, büyük damacana. Semaver/dibek/salep tarifi açıldığında aynı istasyona takılan tek çıkarılabilir bakır/koyu ahşap üst parça göster; aynı anda üç ayrı bedava makine çizme. Başlık yalnız gerçek aktif partide iner, hazır çıktı gerçek türün temsiliyle belirir |
| `station.oil_press` — 1×2, sonraki işleme/uygun genişleme | Alçak taş havan, iri yatay koyu ahşap pres kirişi, tek metal toplama tası; üzüm pekmezi için ayrıca küçük bakır kazan parçası. Zeytin sarı-yeşil akış, ayçiçeği sıcak sarı, pekmez koyu mor-kahve örnektir; lot/ürün ayrımı işaret ve panelde yapılır, renk tek kanal değildir |
| `station.fishing_dock` — 2×2, gerçek açılmış göl kıyısı | Kısa iki tahta iskele dilimi, iki kazık, katlanmış ağ ve tek sığ kasa. Saz hasadı/inci çıkışı aynı iskeleden ayrı tür işaretiyle; görünür balık gerçek lot yoksa kasada kalmaz. İskele kapalı göl rezervinde çalışır gibi görünmez |
| `station.smokehouse` — 1×2, işleme/uygun servis alanı | Koyu taş altlık, meşe renkli yan raf, kısa metal baca ve kapaklı dar tütsü kabini. İşteyken küçük tek opak duman kümesi; sis perdesi veya sahneye yayılan parçacık yok. Alabalık/pastırma için iki farklı çıkış silueti gerekir |
| `station.beehive_apiary` — 2×2, gerçek açılmış mera/arı parseli | İki basamaklı ahşap kovan blokları, küçük uçuş deliği ve tek çiçekli taban. Arı sürüsü yerine birkaç seyrek nokta kullanılabilir; hasat animasyonu aynı işlemin petek balı **ve** balmumu çıktısını temsil eder, iki ücretsiz hasat taklidi yok |
| `station.sheep_pen` — 2×2, gerçek açılmış mera | Alçak dört köşe ahşap çit, köşede yemlik ve su oluğu, içeride en çok temsili bir koyun/keçi silueti. Yün kırkma/süt/et çıkışı ayrı gerçek işlem işaretiyle; A4 dekor koyunu bu istasyonun üretici aktörüne dönüştürme |
| `station.mill_gin` — 1×2, işleme/uygun genişleme | Açık taş çift disk, kısa merkezi mil, yanda dişli/çıkrık parçası ve tek çuval tutacağı. Un çıktıysa bej torba; pamuk/yün ipliği çıktıysa sarılı makara. Taş yalnız aktif işlemede yavaş döner; yüksek devir efekti yok |
| `station.stone_oven` — 1×2, işleme/uygun genişleme | Kısa kemerli taş ocak, siyah ağız, bakır küçük kazan ve yana koyulan ahşap kürek. Ekmek/pide/hamur işi fırın ağzında, menemen/kavurma/köme kazan/tezgâh önünde ayrı tepsiyle; her tarif için yeni fırın yaratma. Ateş yalnız gerçek tarif ve yakıt koşulunda görünür |
| `station.loom` — 1×2, işleme/uygun genişleme | İki dik koyu ahşap direk, arada düz gergin iplik paneli, önde tek mekik; alt rafında kapalı makara. Kumaş düz katlanmış parça, şal püsküllü rulo, branda koyu kalın rulo, heybe saplı torba olarak çıkar. Çalışmıyorsa mekik hareket etmez |
| `station.distillery` — 1×2, işleme/uygun genişleme | Düşük taş masa, kısa bakır imbik gövdesi, tek kıvrımlı boru ve iki kapalı küçük şişe yuvası. Sirke/öz/sabun yalnız tarif/edinim yolu tanımlandıysa farklı sembolle görünür; sırf katalogdaki genel fiil yüzünden satılabilir `sabun/esans` SKU'su uydurma |
| `source.crop_plot` — 2×2, bahçe/parsel | Dört alçak toprak bölme, ortada **tek atanmış mahsulün** büyük ayırt edici silueti; domates salkım, siyez başak, zeytin kısa ağaç, üzüm asma vb. Hasat hazır değilken olgun ürün göstermez. Ağaç varyantı ikinci gizli kaynak değildir |
| `source.chicken_coop` — 2×2, A2 batı kaynak cebi | Alçak tel/ahşap çevre, bir kapalı yuva ve küçük tavuk silueti; yumurta yalnız gerçek tamamlanan partiyle viyolde belirir. Kümes görseli sabit tedarik kaynağı değildir |
| `source.cow_dairy` — 2×2, A2 batı kaynak cebi | Açık taş sağım zemininde tek inek silueti, kısa metal süt kabı ve gövdeye entegre küçük yayık kolu. Süt/ayran/tereyağı aynı kaynakta sıralı gerçek işlerdir; üç bedava paralel sayaç çizilmez |
| `station.preservation_table` — 1×2, açılmış işleme kopyası | Açık taş tezgâh, iki kapalı kavanoz yuvası ve alçak kesme yüzü. Zeytin/peynir/turşu/mezede kapalı kavanoz; kahvaltı ve dürümde düz sunum tepsisi; yalnız gerçek tarife göre tek çıkış görünür |
| `station.drying_rack` — 1×2, bağ/tarla dış cebi | İki ahşap ayak, tek gerili tel/hasır düzlem ve üzerinde gerçek parti kadar sınırlı üzüm demeti. “Güneşleme” ışık gösterimidir, yeni hava/mevsim veya ücretsiz hız kuralı değildir |
| `source.salt_pan` — 2×2, açılmış göl parseli | Sığ bej-gri taş havuz, üç büyük beyaz kristal kümesi ve küçük torba çıkış yüzü. Çıktı `item.lake_salt` lotudur; kooperatif `item.salt` torbası aynı görsel/lot kimliği değildir |

**Doğal kaynak varyantları:** P0 domates yatağı `source.crop_plot`un kırmızı salkımlı başlangıç örneğidir. A3 ot/çay/kahve/baharat/salep yatakları her biri farklı yaprak/demet başlığıyla aynı kaynak kitini, ceviz ağacı kırık blok tacı kullanır; odun için budanmış dal demeti gösterilir. Zeytinlik kısa gri-yeşil ağaç, bağ dikme üstünde mor salkım, tarla seyrek sarı başak/mısır/ayçiçeği, göl mat mavi-yeşil yüzeydir. Kaynak §3'teki edinim/açılma olmadan bu temsillerden bedava girdi düşmez.

**Sarf ve ara ürünlerin çizimi:** `item.raw_water` kapaklı geniş servis kabında; `item.small_bottle` boş dar cam; `item.jug_5l_empty` boş saplı bidon; `item.carboy_19l_empty` boş geniş damacana; `item.tomato_seed` küçük bej kâğıt zarf. `item.lemon_mint_bundle` sarı limon/yeşil nane ikilisi, `item.tea_leaf` kuru koyu yeşil yaprak kesesi, `item.coffee_bean` kahverengi çekirdek kesesi, `item.yeast` küçük maya paketi, `item.fodder` sıkı ot demeti, `item.salt` açık kristal torbası, `item.wood_fuel` kısa kütük demeti, `item.walnut` iki kabuklu ceviz, `item.herb_bundle` ince yeşil ot demeti, `item.spice_bundle` koyu kırmızı-kahve baharat kesesi, `item.salep_tuber` bej yumru kesesi, `item.jar` boş şeffaf kavanoz/koyu kapak. `item.tomato_puree` kapalı kırmızı püre kasesi, `item.cotton_thread` açık iplik makarası, `item.vinegar` koyu amber küçük şişedir. Bunlar **girdi/ara formdur**; katalogda ayrıca satılabilir SKU yazmıyorsa rastgele satış rafına dizilmez.

## 12. Satılabilir ürünlerin tekil görsel kataloğu

Bu bölümdeki **57 SKU kimliği ve ürün adı** [içerik kataloğu §3](OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md) kaynağından gelir. Ambalaj, palet ve siluet seçimi bu paftanın **sanat kararıdır**; fiyat, tarif, kalite, son kullanma, yük slotu veya açılma fazı burada yeniden tanımlanmaz. Ürün aynı temel şekli raf modeli, oyuncu/görevli taşıma temsili, müşteri elindeki yük ve DOM simgesinde korur. Küçük ekranda her satırın biçim ipucu renk olmadan da seçilebilmelidir. Tek rafta görünen paket sayısı gerçek stok değildir; [UI_DESIGN_SYSTEM.md §6](UI_DESIGN_SYSTEM.md) doluluk bantlarına uyar. Kilitli/üretilmemiş SKU rafı dekorla doldurmaz.

### 12.1 Tier 1 — su ve içecek

| SKU | Dünya/raf modeli ve taşınan yük silueti |
|---|---|
| `item.glass_water_small` | İnce uzun saydam cam şişe, dar açık mavi etiket, düz metal kapak; elde tek dar dikdörtgen |
| `item.water_jug_5l` | Alçak-geniş yarı saydam 5 L gövde, kalın üst sap, kısa mavi kapak; iki elle/sapından geniş yük |
| `item.water_carboy_19l` | Boyu belirgin büyük silindir damacana, omuzlu boyun ve koyu kapak; yükte tek büyük gövde, küçük şişeyle ölçek farkı açık |
| `item.fresh_lemonade` | Kısa cam şişe veya kapalı bardak silueti, tek sarı limon dilimi ve yeşil yaprak piktogramı; su şişesinden daha tombul |
| `item.brewed_tea` | İnce bel veren kapalı çay bardağı/taşıma kılıfı, amber sıvı ve küçük çay yaprağı işareti; taşınırken dökülmez |
| `item.mortar_coffee` | Kısa koyu seramik fincan ve düz kapak/altlık, ön yüzde küçük havan piktogramı; çaydan kısa-geniş |
| `item.mountain_salep` | Uzun krem renkli sıcak içecek kupası, koyu kahve tarçın çizgisi ve kalın kulp; kahve fincanından uzun |

### 12.2 Tier 2 — bostan, tarla, bağ ve zeytinlik

| SKU | Dünya/raf modeli ve taşınan yük silueti |
|---|---|
| `item.heirloom_tomato` | Üç iri düzensiz kırmızı domatesli kısa salkım, yeşil yıldız sap; raf kasasında açıkta, elde salkım/küçük kese |
| `item.local_cucumber` | İki uzun ince koyu yeşil salatalık, soluk kısa çizgili; domatesten yatay siluet |
| `item.village_pepper` | Üç kıvrık ince yeşil biber ve açık sap; salatalıktan daha küçük ve kıvrımlı |
| `item.einkorn_wheat` | Sarı-bej uzun başak demeti, üstte üç sivri püskül; un torbasıyla karışmaz |
| `item.sunflower` | Tek kalın sap, geniş koyu çekirdek diski ve sekiz iri sarı yaprak; rafta baş/diski vurgula |
| `item.sweet_corn` | Yeşil yaprak kılıfından çıkan sarı koçan; taşınırken kısa oval sarı tanecik bantları okunur |
| `item.roasted_corn` | Çubuk üstünde koyu köz izli soyulmuş koçan, altında küçük kâğıt kılıf; çiğ mısırdan is/kılıf farkı |
| `item.aegean_cotton` | Kahverengi kısa dal ucunda üç beyaz pamuk topu; kumaş rulosuna dönüşmez |
| `item.fresh_olives` | İnce dallı küçük yeşil/koyu mor zeytin demeti, altında yaprak; sele zeytininden dal sayesinde ayrılır |
| `item.cured_olives` | Geniş alçak koyu hasır/ahşap kâse içinde seçilebilir koyu zeytinler, üstte tek tuz işareti |
| `item.extra_virgin_olive_oil` | Uzun dar koyu cam şişe, zeytin dalı etiketi ve ince dökme ağzı; ayçiçek yağından boy/profil farkı |
| `item.sunflower_oil` | Daha basık ve geniş açık amber şişe, yuvarlak ayçiçeği disk etiketi; zeytinyağıyla aynı etiket kullanılmaz |
| `item.black_grapes` | Kısa saptan aşağı inen koyu mor konik üzüm salkımı, iki açık yaprak |
| `item.raisins` | Küçük düz mat kâğıt kese, önünde üç buruşuk mor nokta/üzüm simgesi; taze salkım çizilmez |
| `item.grape_molasses` | Tombul koyu amber cam kavanoz, kalın düz kapak ve mor damla etiketi; yağ şişesinden kısa-geniş |
| `item.walnut_sausage` | İpe dizili ceviz boğumlarını gösteren uzun koyu mor-kahve köme çubuğu, küçük kâğıt bant; et sucuğu gibi kırmızı yapılmaz |

### 12.3 Tier 2.5 — hayvancılık, mandıra ve arılık

| SKU | Dünya/raf modeli ve taşınan yük silueti |
|---|---|
| `item.farm_egg` | Açık karton altılı viyol, kapak kenarından görünen iki krem oval yumurta; tek yumurta yere yuvarlanmaz |
| `item.fresh_milk` | Kısa beyaz cam süt şişesi, geniş omuz ve mavi tek çizgi; su şişesinden opak dolulukla ayrılır |
| `item.churned_ayran` | Geniş boyunlu kısa açık seramik/kapalı şişe, yayık çubuğu piktogramı; sütle aynı kap kullanılmaz |
| `item.farm_butter` | Basık dikdörtgen sarı blok, balmumu kâğıdı katı ve küçük mandıra işareti; rafta soğuk ürün bilgisi paneldedir |
| `item.comb_honey` | Altıgen petek kesiti gösteren saydam kısa kutu, amber altıgen yüzey; serbest akan bal kavanozu değildir |
| `item.natural_beeswax` | İki küçük mat sarı balmumu külçesi, üzerinde kabartma altıgen; bal ile aynı hasattan çıksa da ayrı SKU görünür |
| `item.raw_wool` | İple sarılmış iri krem yün yumağı/ham balya, pürüzlü blok yüzey; bitmiş şal kıvrımı yok |
| `item.goat_milk` | Açık krem süt şişesi, daha dar boğaz ve küçük keçi başı işareti; inek sütünden ikon ve profil farkı |
| `item.aged_cheese` | Üçgen kesilmiş soluk sarı sert peynir dilimi, koyu kenar kabuğu ve alçak kâğıt taban |
| `item.raw_meat` | Kapalı koyu kırmızı iki parça et içeren düz soğuk tepsi, opak güvenli kapak; kan/sıçrama efekti yok |

### 12.4 Tier 3 — göl, fırın, şarküteri ve dokuma

| SKU | Dünya/raf modeli ve taşınan yük silueti |
|---|---|
| `item.fresh_trout` | Yatay gümüş-mavi tek alabalık, baş-kuyruk belirgin; sığ kapalı soğuk kasada, sıçrayan canlı balık gibi değil |
| `item.lake_reeds` | Üç uzun yeşil-bej saz sapı, tepede koyu ince başak; hasır sepetten dikey demetle ayrılır |
| `item.lake_salt` | Ağzı bağlı küçük beyaz-bej kumaş torba, üzerinde büyük kristal piktogramı |
| `item.freshwater_pearl` | Tek parlak açık krem inci, küçük koyu mavi astarlı kapalı kare kutunun ortasında; göl dışı rastgele yerde parlamaz |
| `item.smoked_trout` | Koyu altın-kahve yatay balık dilimi, üstte iki ince is çizgisi, düz kapalı tepsi; taze balığın gümüş bütün gövdesi yok |
| `item.woven_basket` | Kısa geniş oval hasır sepet, iki kulp ve okunur çapraz örgü bantları; taşınırken aynı sepet silueti |
| `item.einkorn_flour` | Dik bej un çuvalı, kıvrılmış üst ağız ve tek başak damgası; ham başak demeti değil |
| `item.sourdough_bread` | Çatlak üç diyagonal çizgili kubbe somun, koyu alt kabuk ve küçük kâğıt kuşak |
| `item.village_tomato_paste` | Kısa cam kavanoz, yoğun koyu kırmızı dolgu, kalın koyu kapak ve domates dairesi etiketi; ara püre kasesinden farklı |
| `item.jarred_pickle` | Uzun cam kavanoz, içinde dik duran iki yeşil salatalık, sarımsı salamura ve metal kapak |
| `item.marinated_sun_tomatoes` | Geniş alçak kapalı meze kavanozu, zeytinyağı altında katlı koyu kırmızı dilimler ve küçük ot yaprağı işareti |
| `item.pot_confit` | Kısa iki kulplu kızıl kahve toprak çömlek, kapak altında koyu kavurma yüzeyi; açık et tepsisi değildir |
| `item.cured_pastirma` | İnce üst üste koyu kırmızı dilimler, koyu çemen kenarı, düz sarılı paket; çiğ et tepsisinden yassı farkı |
| `item.baked_pastry` | Yuvarlak katlı altın boyoz/çörek, ortada açık peynir yarığı, altta kare fırın kâğıdı |
| `item.sucuk_pide` | Uzun kayık biçimli kızarmış pide, ortada birkaç koyu sucuk diski ve açık peynir yüzeyi; boyozdan uzun-yatay |
| `item.canned_menemen` | Alçak kapaklı bakır/seramik sıcak yemek kabı, üst etiketinde domates-biber-yumurta üçlü şekli; ürün adı `canned` olsa da kaynak adı sıcak esnaf menemenidir, ekonomik ambalaj kuralı icat edilmez |
| `item.tarhana_soup` | Kapaklı geniş çorba kasesi, sıcak kiremit kırmızısı yüzey ve tek tahta kaşık piktogramı; menemen kabından daha geniş/yuvarlak |
| `item.woven_fabric` | Düz katlı açık krem kumaş rulosu, kenarda iki paralel iplik çizgisi; ham pamuk balyası veya şal değildir |

### 12.5 Tier 4 — gurme sofra ve dokuma

| SKU | Dünya/raf modeli ve taşınan yük silueti |
|---|---|
| `item.village_breakfast` | İki kulplu geniş ahşap tepsi, üzerinde yedi küçük basit bölüm simgesi (ekmek, bal, tereyağı, peynir, yumurta, zeytin, çay); gerçek bileşen stoğu olmadan dolu tepsi çizilmez |
| `item.pastirma_wrap` | Açık kâğıt kuşaklı kısa silindir dürüm, kesik uçta koyu kırmızı pastırma/yeşil turşu katı; balık dürümüyle uç ikonu farklı |
| `item.smoked_fish_wrap` | Daha uzun açık kâğıt kuşaklı dürüm, kesik uçta altın-kahve balık ve yeşil turşu katı, küçük balık damgası |
| `item.wool_shawl` | Uçlarında üç püskül olan katlı sıcak krem yün şal; düz kumaş rulosundan yumuşak kat/fiyonk farkı |
| `item.waxed_canvas` | Kalın koyu kum rengi rulo, bir yanda balmumu damla işareti ve bağlı iki kayış; ince kumaştan kalın profil |
| `item.insulated_bag` | İki yan cebine sahip geniş kapaklı sefer heybesi, çapraz askı ve hasır alt bant; satılabilir ürün olarak görünür, katalogda verilmemiş taşıma bonusu çizimle vaat edilmez |

### 12.6 Ürün sanat dosyası ve gerçek durum denetimi

- Her SKU asset kaydında `skuId`, aynı siluetin `world/shelf/carry/icon` varyantı, satın alma/üretim açılışı, kaynak istasyon, gerçek footprint/taşıma portu, atlas/LOD grubu ve seçili metin adı bulunur. Kaynak ID'si olmayan görsel ürün ekonomiye veya raf etkileşimine bağlanmaz.
- Raf boşsa fiziksel ürün modeli yoktur; gerçek stok pozitifse doluluk bandına göre temsili paket görünür. Rezerve/yolda/bozulmuş ayrımı stok panelinden gelir; rastgele renk filtresi gerçek miktarın yerine geçmez. Müşteri yükü ancak doğrulanmış satıştan sonra onun aktörüyle çıkar.
- Tarif/edinim yolu, fiyat veya kalite bilgisi bu sanat tarifinden türetilmez. Özellikle katalogdaki bazı genel istasyon çıktıları (ör. sabun/esans), Tier 5 ve §64 adayları kimlik/fiyat/erişim tamamlanmadan SKU değildir. Eksik veya çelişkili kaynakta çizim `taslak görsel` olarak bekler, oyuncuya hazır ürün diye açılmaz.
- İlk uygulama ve her içerik genişlemesinde kaynak kataloğundaki `item.*` satırları bu tabloyla bire bir ID üzerinden karşılaştırılır. Yeni SKU eklenirse satır, raf/taşıma simgesi ve durum kontrolü aynı değişiklikte eklenir; ID silinirse hayalet raf modeli bırakılmaz.

## 13. Uygulamaya doğrudan aktarılacak açık yerleşim kararları

Bu bölüm, üstteki sanat ve koordinat paftasını **kodun içerik tanımına bağlayan teknik karar**dır. Satın alma/faz kaynakları [ana §26/§32/§33/§58.1](OYUN_GELISTIRME_DEVIR_DOSYASI.md) ve [katalog §2/§7](OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md) olarak kalır. İlk çizim ferah olmalıdır: P0 6×6 satışta yalnız üç sabit nesne (raf/kasa/şişeleme), geniş vitrin, iki hücreli artı biçimli boş orta aks; dışarıda gökyüzü, bahçe ve uzun görüş çizgisi. 4×4 asgari oda bir sıkışık kutu hedefi değildir; genişletilmiş 6×6 kabuk aynı türün geçerli seçeneğidir. Hiçbir dolgu mobilyası boş cep diye otomatik doğmaz.

### 13.1 P0 yerleştirme tanımları ve sıra

`fixture.*` kimlikleri burada sabitlenen içerik kimlikleridir; kurulu başlangıç nesnesi ikinci kez satın alınmaz. Tablodaki footprint döndürülürse işgal, servis ve etkileşim yüzü aynı 90° dönüşle birlikte çevrilir. `x,z` servis hücresi kalıcı nesne değil, iş sırası boyunca geçici rezervasyon hedefidir; başkasının geçişini sonsuza kadar kapatmaz. Oyuncu/müşteri bir yürüyüş hücresini geçici işgal eder. Kaydedilen nesne kimliği, yönü ve koordinatı mesh'ten değil Domain yerleşiminden okunur.

| Kimlik | P0 işgal ve yön | Girdi/çıkış/etkileşim yüzü | Kabul |
|---|---|---|---|
| `source.spring_water` | `x5..6,z21..22`, 2×2, doğuya bakar | Doğu servis `x7,z21..22`; oyuncu/görevli su alma `(7,21)` | `x8..9` ana bahçe yolu ve domates portu açık |
| `source.crop_plot` (`item.heirloom_tomato`) | `x5..6,z25..26`, 2×2, doğuya bakar | Doğu sulama/hasat `x7,z25..26`; öncelikli `(7,25)` | Yatak P0 tek mahsuldür; başka cropId bedava açılmaz |
| `station.bottler` | `x12,z22..23`, 1×2, doğuya bakar | Doğu girdi/çıktı/işletme `x13,z22..23`; ilk servis `(13,22)` | Kuzeybatı nişi kaplar, iç orta koridora taşmaz |
| `fixture.sales_shelf` | `(12,26)`, 1×1, doğuya bakar | Müşteri ve ikmal yüzü `(13,26)`; aynı hücre için aktörler sırayla rezervasyon alır | Su/domates stok slotu gerçek lota bağlanır; görsel raf bedava ikinci depo değildir |
| `fixture.checkout` | `(17,22)`, 1×1, batıya bakar | Müşteri `(16,22)`, görevli `(17,23)`; iki yüz ayrı ve aynı işlem kimliğine bağlı | Kasa müşterisi personel hücresine çapraz ışınlanmaz |

**P0 müşteri ve A2 sıra:** P0 aynı anda bir müşteri davranışıyla doğrulanır. Satış odasında kasa hizmet hücresi `(16,22)` ve **tek** iç bekleme `(16,23)` geçici aktör rezervasyonudur; doğu–batı orta aksındaki `(16,24)` kuyruk değildir. Dış bekleme cebi `(13,30)` ve `(13,31)` açık taş zemindir; iki hücreli ana giriş `x14..15` hep açıktır. A2 eşzamanlı müşteri üst sınırı cihaz ölçümüyle içerik ayarı olur; dolu iç/dış sırada aktör üst üste konmaz ve kaynak sabır/kaçan satış davranışı işler. Kuyruk noktasını görsel pozu değil Domain rezervasyonu sahiplenir. D-038 A* ve D-013 sabır kararları geçerlidir. Test senaryosu: oyuncu çeşmeden taşırken görevli kasada, bir müşteri rafta, biri kasada, biri beklemede; hiçbir işgal kalıcı kapı kilidi yaratmaz.

### 13.2 Ferah oda kabuğu, döndürme ve cam müşteri pavyonu

**Yapı kiti ölçüsü:** Zemin `y=0`, düz duvar yüksekliği `3,2 m`, iç kapı net geçiş yüksekliği `2,6 m`, görsel duvar kalınlığı `0,15 m`; kapı genişliği tam iki 1 m hücre sınırıdır. Bunlar mimari sanat/çarpışma başlangıç ölçüsüdür, karakter hızını veya ekonomi değerini değiştirmez. Satış güney cephesinde kapı dışındaki iki cam panel toplam cepheyi açar; A2 odalarında yüksek pencere/yarı opak üst bant gün ışığı verir. Çatı ve kameraya yakın güney/doğu duvarı oyuncu veya hedefi örtünce soluklaşır; işgal ve kapı collider'ı silinmez. Duvar gövdesi her hücre kenarından, kapı komşuluk grafiğinden türetilir; bağımsız dekor mesh'i save'e yazılmaz.

**Modül taşıma:** 6×6 varsayılan oda ile §32.1'de izinli 4×4 alt sınır, aynı taşınabilir oda veri tipidir. Oda `origin, width, depth, rotation, roomId` olarak kaydedilir; 90° dönme veya taşıma tek Application komutunda önce yeni işgal/kapı/servis/iki hücreli yol ile son temel zinciri doğrular, sonra içerideki eşya/lot/parti kalıcı kimliklerini beraber taşır. Eski duvar/kapı mesh'i yeni komşuluğa göre yeniden türetilir; kapalı eski boşluk kalmaz. Kabuk bedeli tür başınadır, 6×6 olduğu için §32.1 bedeliyle alan çarpımı yapılmaz. Geçersiz dönüş, sığmayan eşya veya tek girişin kapanması bütünüyle reddedilir; geri al/yeniden yap tüketilmiş envanteri çoğaltmaz.

**A4 işlevsel müşteri pavyonu:** `x6..9,z28..31`, 4×4 ayrı oda; doğu iki hücreli kamu kapısı `x9..10,z29..30`, bağlantı `x10..11,z28..31` üzerinden `x12..13,z28..29` ön kaldırımına çıkar. Kuzey duvarı bahçeye bakar ama kapısız geniş mat camdır; güney/batı ince açık renk kaide + cam üst bant, doğu kapı çerçevesi koyu ahşap. İçeride iki koltuk kuzeybatı/güneybatı kenarında, yön panosu kuzeydoğu duvarında, orta ve doğu kapı aksı boştur. Cam çatı oyunda kesilir; yapı sokağı kapalı kutuya dönüştürmez. Kabuk 160 kredi; [§32.2](OYUN_GELISTIRME_DEVIR_DOSYASI.md) iki koltuk 35'er, yönlendirme tabelası 25 kredi olmak üzere açılış donanımı 95 kredi, toplam teklif 255 kredidir. Üç bileşen aynı işlemde doğrulanıp alınmadıkça pavyon işlevsel açılmaz; ücretsiz konfor/slot yoktur. Satış odasındaki eski 2×2 niş yalnız açık görünüm/boşluk olarak kalır.

### 13.3 Dört satın alınabilir dış parsel ve üretim yolu

Parseller eşik/fiyatı [katalog §2](OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md) üzerinden açılır. A3 satın alınmadan oyuncuya çalışır istasyon, hasat veya sahte çit kapısı gösterilmez. Batı ana yaya/servis şeridi `x8..9,z2..27` iki hücre açık kalır; P0 bahçe yoluyla birleşir. Doğu iki hücreli parsel yolu `x40..41,z4..29`dur; A2 servis avlusundan `x36..39,z24..25` işaretli yaya geçidiyle bağlanır. Servis vanı bu geçitte yaya rezervasyonu varken durur; aktör araç gövdesinden geçmez. Parsel içine tek hücre servis cepleri olabilir, fakat ana bağlantı iki hücrenin altına düşmez.

| Zone ID | Sınır, giriş, yerleştirilebilir cep | Açılınca görünen kaynak, çit/peyzaj ayrımı |
|---|---|---|
| `zone.natural_lake` | `x2..7,z2..6`, doğu erişim `x6..7,z4..5` → batı omurga | İskele `x2..3,z3..4`, tuz havuzu `x4..5,z3..4`; kıyı sazı kalan sınırlı kenarda. Göl P0 çeşmesi değildir |
| `zone.pasture_apiary` | `x2..7,z8..13`, doğu erişim `x6..7,z10..11` | Arılık `x2..3,z9..10`, üretici ağıl `x4..5,z9..10`; A4 dekor koyun aynı lotu ikinci kez üretmez. Çit giriş ağzını kapatmaz |
| `zone.orchard_grove` | `x42..47,z4..13`, batı giriş `x42,z8..9` → doğu omurga | Zeytin ağacı ve üzüm asması `source.crop_plot` varyantları ayrılmış 2×2 ceplere kurulur; dar taş kenar/parsel tabelası, `x40..41` yolu boş |
| `zone.large_field` | `x42..47,z16..23`, batı giriş `x42,z19..20` → doğu omurga | Siyez, ayçiçeği, mısır, pamuk için açılmış `source.crop_plot` 2×2 cepleri; sahte dolu tarla değil, gerçek ekili mahsulün seyrek büyük silueti |

**A2 ara kaynaklar:** Kümes `source.chicken_coop` `x2..3,z16..17` (2×2), güney servis `x2..3,z18`; mandıra/yayık `source.cow_dairy` `x4..5,z16..17` (2×2), doğu servis `x6,z16..17`. İki kaynak için yaya bağlantısı `x6..7,z16..18` → `x8..9` batı omurgadır. A4 koru bu hücrelere girmez; koru dekoru `x2..5,z14..15` ve `x2..5,z19` ceplerinde kalır. A2 kaynakları ancak gerçek edinim/kurulumdan sonra çizilir. P0 su ve domates aynı hücrelerde kalır.

**A3 küçük girdi bitkileri:** Bahçe `x4..5,z23..24` limon/nane **veya** ot için tek 2×2 cep; servis `(4,22)` batı yan yolundan erişilir, komşu domates/su portuna girmez. Çay, kahve, ceviz ve baharat için bağ/zeytinlik sırasıyla `x42..43,z5..6`, `x44..45,z5..6`, `x46..47,z5..6`, `x44..45,z8..9` boş kaynak cepleridir; `x42,z8..9` parsel girişi açık kalır. Salep için mera `x2..3,z11..12` cebi, arılık/ağıl servisinden ayrı kalır. Tüm bu `source.crop_plot` örnekleri katalogdaki tek ürün/tek sıra iş kuralını kullanır; bahçe/mera/bağ henüz açılmadıysa görünmez. Zeytin ve üzüm için alt parsel sıraları boş bırakılır; bitki yoğunluğu parselin tamamını doldurmaz.

**İç istasyon kapasitesi:** R2-C0 işleme odası aynı anda iki 1×2 istasyon ve iki tampon cebi için tasarlanır. İlk slot `x12,z16..17` taşınmış şişeleme, ikinci slot `x17,z16..17` gerçek satın alınmış açılmış istasyondur; ilgili servis yüzleri orta aksa döner. Diğer iç istasyonlar aynı 6×6 kabuğun **yeni satın alınmış kopyalarında** kurulur: R0-C2 sonra R0-C3 rezervleri önce işleme modülü için kullanılabilir, fakat §58.1 içerik ve geçerli bağlantı sağlanmadan bina çizilmez. İlk kopya R0-C2 `x24..29,z4..9`, yalnız güney R1-C2 gerçekten açıldıysa `S` kapısıyla bağlanır; ikinci kopya R0-C3 `x30..35,z4..9`, güney R1-C3 veya batı ilk kopya açılınca geçit alır. Bu iki rezerv sonradan gizlice yeni oda türü olmaz; `room.processing` kopyalarıdır. Bunlar yetmezse §9 modül taşıma/yerleştirme doğrulamasıyla açık parsel üzerinde yeni 6×6 kabuk seçilir, pafta yeni varsayılan diye uydurulmaz. `station.drying_rack` bağ/tarla dış ceplerinde, `station.preservation_table` işleme kopyasında, `source.salt_pan` göldedir. Tüm istasyonlar kendi lot/iş kimliğiyle kaydedilir.

### 13.4 Otoparktan yaya çıkışı, küçük çevre eşyası ve yol ritmi

P1–P4 park cepleri §5'teki gibidir. Her araçtan kaldırıma iki hücreli boş yaya arası sırasıyla `x20..21`, `x24..25`, `x28..29`, `x32..33` için `z30..32`; bunlar araç park hücresi değildir. Gerçek müşteri arabayla eşlenmişse aynı ziyaret ID'si bu aradan `z28..29` kaldırımına ve `x14..15` market girişine yürür. Boş park cebi bulunmayan dekor araç geçip gider; gerçek müşteri spawn/satış adedi değiştirilmez.

| Çevre eşyası / ilk görünüm | Sabit cep ve çarpışma |
|---|---|
| Çöp kutusu | `(11,33)`; tek hücre, market ana `x14..15` yolundan ve pavyon `x10..11,z28..31` bağlantısından uzak |
| Bisiklet parkı | `x12..13,z32..33`; iki hücre, araç cebi ve A2 dış sıra `x12..13,z30..31` ile çakışmaz |
| Alçak yol lambası | `(11,32)` ve `(34,29)`; ikincisi kaldırımın kenar görseli olup yürünebilir `x34..35,z28..29` iki hücresine collider sokmaz |
| Bank | Yalnız satın alınmış A4 pavyonun içinde iki koltuk; giriş önünde rastgele ek bank yok |
| Alçak çit | Göl/mera parsel kenarı ve pavyonun batı sınırı; tanımlı iki hücreli kapı/yaya açıklığında collider yok |

**A4 başlangıç ritmi — ölçüm hipotezi:** Dört park cebi görünür; dekoratif aktif otomobil en çok 2, gerçek müşteriyle eşlenmiş araçlar mevcut 4 fiziksel cebe sığar. Gerçek teslimat vanı park cebine değil servis avlusuna gider. Kedi 1, köpek 1, dekor koyun en çok 2, kuş en çok 2; toplam §63 animasyonlu karakter bütçesine dahildir. Dekor aracın park beklemesi görsel seed ile 30–60 **aktif** saniye aralığındadır; spawn satış/talep olayı değildir. Yol W1–W3'ün her biri ayrı `wearSeconds` taşır: 0–899 bakımlı/yenilenmiş, 900–2699 kullanılmış, 2700–3599 aşınmış; 3600'de güvenli kesim için 90 aktif saniyelik bakım başlar. Bakım bitince aynı kesimin sayacı sıfırlanır, `everRepaired` işareti kalır ve sonraki 3600 saniyelik döngü başlar. Aynı anda yalnız bir kesim bakımda olur; hazır kesimler W1→W2→W3 sırasıyla bekler. Yaya, park ve servis girişleri bakım collider'ı dışında kalır. Sayaç, evre ve işaret Domain save'dedir; yüklemede ikinci bakım başlamaz. Bunlar ücret, satış cezası veya yeni yol tamir butonu değildir; cihaz/oyuncu ölçümüyle değişebilir.

### 13.5 Asset ölçü ve bağlama kuralı

Her ürün §12'deki silueti kullanır. P0 teslim kartları aşağıdaki metre cinsinden **en büyük kutu** ölçüleridir; oyun kuralındaki slot ölçüsü değildir. Model pivotu taban orta noktası `(0,0,0)`, raf bağı `shelfAnchor` alt yüz, taşıma bağı `carryAnchor` kütle merkezi, DOM ikonu aynı önden/üstten ayırt edici konturdur. Raf üzerinde gerçek sayıya göre §6 doluluk bandı örneklenir, kutu boyu rafın içine kırpılır; büyük damacana küçük şişe yuvasına sığmış gibi ölçeklenmez.

| P0 SKU | En büyük `en×boy×derinlik` | Raf/taşıma varyantı |
|---|---|---|
| `item.glass_water_small` | `0,18×0,42×0,18 m` | Dar dik şişe; 1 elde aynı siluet |
| `item.water_jug_5l` | `0,32×0,50×0,28 m` | Saplı geniş kap; taşıma pozu sapta |
| `item.water_carboy_19l` | `0,42×0,70×0,42 m` | Alt raf/büyük yük yuvası; iki elle gövde kavrama |
| `item.heirloom_tomato` | `0,30×0,22×0,28 m` | Salkım kasası; elde küçük kese/salkım |

A2–A4 SKU'larında §12 silueti için aynı kart alanları (`skuId`, faz, kutu ölçüsü, pivot, raf bağı, elde tutuş, ikon, kalite/bozulma işareti, atlas/LOD, animasyon durumu) **içerik açılırken** doldurulur. Bu kartı olmayan SKU sahnede hayalet raf ürünü olarak açılmaz. P0 kartları başlangıç sanat ölçeğidir; gerçek telefon portresinde kamera/okunurluk ve büyük metin ile ölçülmeden son asset kabulü değildir.

**Tier 1–4 ortak ölçü profilleri:** Aşağıdaki sınır kutuları sanat üretiminde hedef üst ölçüdür; §12'deki her SKU kendi şekil/renk/ambalajını korur. Liste her 57 satılabilir SKU'yu bir kez kapsar. Rafın kullanılabilir hacmi ve taşıma pozu gerçek `loadSlot`/raf tanımına göre doğrulanır; yalnız kutuyu küçültüp 19 L damacanayı küçük şişe gözüne sokma. Her profilin pivotu taban merkezi; rafta dik duranlarda `shelfAnchor` taban merkezi, yatay/tepside alt orta; elde tutuş `carryAnchor` üst tutamak/yan kavrama, ayrıntısı §12 siluetinden gelir. İkonun dış konturu modelin aynı yönden basit izdüşümüdür; kalite ve bozulma işareti ayrı metin/piktogram katmanıdır.

| Profil; en×boy×derinlik | SKU kimlikleri |
|---|---|
| S1 dar şişe `0,22×0,52×0,22 m` | `item.glass_water_small`, `item.fresh_lemonade`, `item.fresh_milk`, `item.churned_ayran`, `item.goat_milk`, `item.extra_virgin_olive_oil`, `item.sunflower_oil` |
| S2 sıcak kupa `0,24×0,28×0,24 m` | `item.brewed_tea`, `item.mortar_coffee`, `item.mountain_salep` |
| S3 saplı bidon `0,36×0,52×0,32 m` | `item.water_jug_5l` |
| S4 büyük damacana `0,45×0,75×0,45 m` | `item.water_carboy_19l` |
| S5 meyve/koçan/viyol `0,44×0,34×0,36 m` | `item.heirloom_tomato`, `item.local_cucumber`, `item.village_pepper`, `item.sweet_corn`, `item.roasted_corn`, `item.fresh_olives`, `item.black_grapes`, `item.farm_egg` |
| S6 başak/demet/çubuk `0,36×0,58×0,36 m` | `item.einkorn_wheat`, `item.sunflower`, `item.aegean_cotton`, `item.walnut_sausage`, `item.lake_reeds` |
| S7 küçük kese/çuval `0,34×0,44×0,25 m` | `item.raisins`, `item.lake_salt`, `item.einkorn_flour` |
| S8 kavanoz/petek `0,28×0,34×0,28 m` | `item.cured_olives`, `item.grape_molasses`, `item.comb_honey`, `item.village_tomato_paste`, `item.jarred_pickle`, `item.marinated_sun_tomatoes` |
| S9 alçak kapalı tepsi/külçe `0,50×0,22×0,38 m` | `item.farm_butter`, `item.natural_beeswax`, `item.aged_cheese`, `item.raw_meat`, `item.fresh_trout`, `item.smoked_trout`, `item.cured_pastirma` |
| S10 sepet/rulo/balya/heybe `0,55×0,42×0,45 m` | `item.raw_wool`, `item.woven_basket`, `item.woven_fabric`, `item.wool_shawl`, `item.waxed_canvas`, `item.insulated_bag` |
| S11 fırın/yemek kabı `0,56×0,32×0,42 m` | `item.sourdough_bread`, `item.pot_confit`, `item.baked_pastry`, `item.sucuk_pide`, `item.canned_menemen`, `item.tarhana_soup` |
| S12 geniş tepsi `0,68×0,30×0,52 m` | `item.village_breakfast` |
| S13 küçük kutu `0,18×0,14×0,18 m` | `item.freshwater_pearl` |
| S14 sarılı dürüm `0,42×0,16×0,18 m` | `item.pastirma_wrap`, `item.smoked_fish_wrap` |
