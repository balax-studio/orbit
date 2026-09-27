# Orbit Market — Yerel Su, Çiftlik, Göl ve Zanaat Ürün Ağacı (Tier 1 – Tier 4)

Bu belge, [ana ürün sözleşmesi §26](OYUN_GELISTIRME_DEVIR_DOSYASI.md) kapsamında bahçedeki su kaynağından başlayan **Tier 1–4 ürün ağacıdır**. Hızlı raf döngülerini genişletilebilir göl, mera, zeytinlik ve bağ alanlarıyla; gıda, dokuma ve basit zanaat ürünleriyle birleştirir. Tier 1–4 ürün kimlikleri ve tarif yönü yeni ürün kapsamıdır. Süre, maliyet, fiyat, güç, arazi bedeli ve kâr oranları denge hipotezidir; çalışan içerik kanıtı sayılmaz.

**Başlangıç kimlikleri:** `source.spring_water` aktif simülasyon zamanında `item.raw_water` üretir; 1 birim 0,5 litredir. Ham su şişeleme ve sulama arasında paylaşılır; şişelenmiş üç SKU ayrı lotlardır. `item.heirloom_tomato` doğrudan rafta satılır veya püre/salça hattına ayrılır. Başlangıç haznesi, debi ve sarf lotları [ana kaynak §26.1](OYUN_GELISTIRME_DEVIR_DOSYASI.md) ile aynıdır.

**P0 fiziksel içerik tanımı:** `source.spring_water` 2×2; `source.crop_plot`un başlangıç domates örneği 2×2; `station.bottler` 1×2; `fixture.sales_shelf` 1×1 ve `fixture.checkout` 1×1'dir. Kasa/rafın `fixture.*` kimliği satılabilir SKU veya yeni ücretli açılış değildir. Yön, kesin servis/alışveriş hücresi ve başlangıç koordinatı [pafta §13.1](DUNYA_YERLESIM_PLANI.md) tablosunda tek tek verilir; içerik tanımı o tabloyla aynı kalmalıdır. Daha sonraki 90° dönüşte footprint ve port birlikte döner, geçersiz rota reddedilir.

**Tarif tamamlama kapısı:** Tabloda girdisi yazılan fakat kaynağı veya ara tarifi yazılmayan püre, çay yaprağı, kahve, maya, ceviz, sirke, baharat ve benzeri öğeler kendiliğinden oluşmaz. Her biri yerel üretim veya fiyatı görünen tedarik SKU'su olarak tanımlanır. Kaynağı olmayan tarif kilitli kalır; A4 içerik doğrulaması bu eksikleri raporlar. Adet/süre ve ekonomik denge doğrulanmadan faz kabulü verilmez.

---

## 1. Değer Zinciri ve Çapraz Bağımlılık Şeması

```
[Tier 1: Memba Çeşmesi] ──┬──> [Şişeleme & Ocak] ────> Cam Su / 5L Bidon / 19L Damacana / Limonata / Semaver Çay / Dibek Kahvesi
                         │
                         ├──> [Tier 2: Bostan, Tarla, Bağ & Zeytinlik]
                         │       ├──> Domates / Salatalık / Biber / Siyez / Ayçiçeği / Mısır / Pamuk
                         │       ├──> Gemlik Zeytini ───────> [Taş Pres] ──> Sele Zeytini & Sızma Zeytinyağı
                         │       └──> Siyah Bağ Üzümü ──────> [Kazan & Güneş] ──> Kuru Üzüm & Üzüm Pekmezi ──> Cevizli Köme
                         │
[Satın Alınabilir Göl] ───┼──> [Göl İskelesi & Su Ürünleri]
(Bedel: 800 Kredi)       │       ├──> Taze Göl Alabalığı ──> [Meşe Tütsüleme] ──> Tütsülenmiş Alabalık
                         │       ├──> Göl Sazlığı ─────────> [Hasır Örme] ──────> El Örmesi Hasır Sepet
                         │       ├──> Doğal Göl Tuzu ──────> Salamura, Peynir & Pastırma Tuzu
                         │       └──> Tatlısu İncisi ─────────────────────────> Doğrudan raf satışı / süsleme
                         │
[Satın Alınabilir Mera] ──┼──> [Hayvancılık, Mandıra & Arılık]
(Bedel: 500 Kredi)       │       ├──> [Bahçe Kümesi] ──────> Taze Köy Yumurtası
                         │       ├──> [İnek Mandırası] ────> Taze Süt ──> Yayık Ayranı & Tereyağı
                         │       ├──> [Koyun/Keçi Ağılı] ──> Yün (Şal) + Keçi Sütü (Ezine Peyniri) + Besi Eti (Kavurma/Pastırma)
                         │       └──> [Karakovan Arılığı] ─> Karakovan Petek Balı & Saf Doğal Balmumu
                         │
                         ├──> [Tier 3: Değirmen, Taş Fırın & Şarküteri]
                         │       ├──> Siyez Unu & Ekşi Maya ──> Köy Somunu / Peynirli Boyoz / Sucuklu Pide
                         │       ├──> Domates & Biber ────────> Köy Salçası / Tava Menemen / Bostan Turşusu
                         │       ├──> Et & Baharat ───────────> Çömlek Kavurması / Çemenli Pastırma
                         │       └──> Pamuk & Yün ────────────> Dokuma Kumaş / Mumlu Branda / Yün Şal
                         │
                         └──> [Tier 4: Zengin Ziyafet Sofraları & Kompozitler]
                                 ├──> Köy Kahvaltı Tepsisi (Ekmek + Bal + Tereyağı + Peynir + Yumurta + Zeytin + Çay)
                                 ├──> Gurme Çemenli Pastırma Dürümü (Pastırma + Ekmek + Turşu + Tereyağı)
                                 ├──> Meşe Tütsülü Balık Dürümü (Tütsülü Alabalık + Ekmek + Turşu + Zeytinyağı)
                                 ├──> Sıcak Dağ Salebi (Dağ Orkidesi + Keçi Sütü + Tarçın)
                                 └──> Yalıtımlı Sefer Heybesi (Balmumlu Branda + Hasır Sepet + Dokuma Kumaş)
```

---

## 2. Satın Alınabilir Araziler ve İstasyon Envanteri

### Satın Alınabilir Araziler (Zone Expansions)
* **Doğal Göl Alanı (`zone.natural_lake` — Yatırım: 800 Kredi):** Alabalık avı, sazlık biçimi, göl tuzu havuzları ve inci çıkarma imkânı sağlar. İnci doğrudan satılabilir doğal üründür.
* **Çiftlik Merası & Arılık (`zone.pasture_apiary` — Yatırım: 500 Kredi):** Koyun ağılı, keçi mandırası ve karakovan arılıkları için kır parseli.
* **Zeytinlik & Üzüm Bağı (`zone.orchard_grove` — Yatırım: 450 Kredi):** Asırlık zeytin ağaçları ve üzüm asmaları barındıran meyve bahçesi.
* **Geniş Tarım Tarlası (`zone.large_field` — Yatırım: 400 Kredi):** Ayçiçeği, mısır ve buğday ekilen açık tarla alanı.

### İstasyon Türleri ve Grid/Güç Değerleri
* **Memba Çeşmesi (`source.spring_water`):** Seviye 1–5 debi yükseltilebilir su kaynağı.
* **Şişeleme ve Semaver Tezgahı (`station.bottler` - 1×2 Grid, 1 E):** Su şişeleme, limonata, semaver çayı, dibek kahvesi ve salep hazırlar.
* **Taş Pres Yağhane & Şıra Kazanı (`station.oil_press` - 1×2 Grid, 2 E):** Zeytinyağı, ayçiçek yağı ve kaynar üzüm pekmezi sıkar.
* **Göl İskelesi & Ağ Atma İstasyonu (`station.fishing_dock` - 2×2 Grid, 0 E):** Taze alabalık, sazlık ve inci toplar.
* **Meşe Odunlu Tütsüleme Fırını (`station.smokehouse` - 1×2 Grid, 2 E):** Alabalık tütsüler, pastırma kurutur.
* **Karakovan Arılığı (`station.beehive_apiary` - 2×2 Grid, 0 E):** Petek balı ve doğal balmumu üretir.
* **Koyun & Keçi Ağılı (`station.sheep_pen` - 2×2 Grid, 0 E):** Yün, keçi sütü ve besi eti üretir.
* **Taş Değirmen & Çırçır (`station.mill_gin` - 1×2 Grid, 1 E):** Un öğütür, pamuk ve yün ipliği eğirir.
* **Taş Fırın & Esnaf Ocağı (`station.stone_oven` - 1×2 Grid, 2 E):** Ekmek, pide, boyoz, menemen, kavurma ve pekmezli köme pişirir.
* **El Dokuma & Terzi Tezgâhı (`station.loom` - 1×2 Grid, 1 E):** Kumaş, yün şal, mumlu branda ve heybe diker.
* **Damıtma İbiği & Şifahane (`station.distillery` - 1×2 Grid, 1 E):** Sabun, sirke ve esans hazırlar.
* **Ürün Parseli (`source.crop_plot` - 2×2 Grid, 0 E):** Yalnız atanmış tek mahsul kimliğiyle domates, salatalık, biber, siyez, ayçiçeği, mısır, pamuk, zeytin, üzüm veya tanımlı ot/fidan ürününü yetiştirir. P0 domates yatağı bu kimliğin `item.heirloom_tomato` varyantıdır; her mahsulün kendi tarif süresi/girdisi korunur. Ağaç/asma/yatak görsel varyantı bedelsiz ikinci kaynak değildir.
* **Kümes (`source.chicken_coop` - 2×2 Grid, 0 E):** A2'de buğday girdisiyle taze yumurtanın tek üretim portu; fiyatı/edinimi ayrıca görünür olmalı, başlangıç nesnesi değildir.
* **İnek Mandırası & Yayık (`source.cow_dairy` - 2×2 Grid, tarifteki E):** A2'de süt üretimi ve açılmış ayran/tereyağı tarifleri aynı nesnenin sıralı işleri; aynı anda üç ayrı ücretsiz çıktı vermez.
* **Saklama/Salamura Tezgâhı (`station.preservation_table` - 1×2 Grid, tarifteki E):** Sele zeytin, olgun peynir, turşu ve zeytinyağlı kuru domatesin tek işlem portu; yalnız erişilebilir tarif çalışır.
* **Güneşleme Askısı (`station.drying_rack` - 1×2 Grid, 0 E):** Üzüm kurutmanın dış parsel portu; güneşleme yeni hava/mevsim kuralı değildir.
* **Göl Tuzu Havuzu (`source.salt_pan` - 2×2 Grid, 1 E):** Göl parselinde 6 aktif saniyede bir `item.lake_salt` üretir; satılabilir torba ile tarif girdisi aynı lot kimliğidir.

**Yeni fiziksel portların başlangıç kurulum bedeli (denge hipotezi):** P0 kurulu domates `source.crop_plot`u ücretsiz açılış nesnesidir; sonradan alınan 2×2 `source.crop_plot` kabuğu 40 kredi (tohum/fide ayrı), `source.chicken_coop` 90 kredi, `source.cow_dairy` 140 kredi, `station.preservation_table` 100 kredi, `station.drying_rack` 60 kredi, `source.salt_pan` 120 kredidir. Bunlar oda kabuğu/zone bedeli değildir ve onları bedelsiz vermez. Satın alma teklifi kurulum ile zorunlu girdiyi ayrı gösterir; gerçek cihaz/oyuncu ekonomi testinden sonra değerler revize edilir. P0 başlangıç nesneleri ikinci kez ücretlendirilmez.

---

## 3. Taslak Ürün Kataloğu ve Fiyat Tablosu

> **Denge notu:** Tier 1'in üç su ürünü ve taze domatesi aşağıdaki açık sarf/enerji hesabıyla güncellenmiş başlangıç değerleridir. Diğer satırların maliyet ve fiyatları doğrulanmamış taslak değerlerdir. Birim kâr, taban satıştan birim değişken maliyet çıkarılarak; kâr oranı ise birim kârın değişken maliyete bölünmesiyle gösterilir. Personel, bakım ve kira bu birim maliyetin dışında kalır.

### P0 sarf ve ilk maliyet hesabı

| Sarf/lot ID | Kaynak | Birim edinim maliyeti | Yeni kayıtta |
|---|---|---:|---:|
| `item.raw_water` | Bahçe membası; 1 birim = 0,5 L | 0 kredi | 50 birim haznede |
| `item.small_bottle` | Yerel kooperatif | 0,20 kredi | 12 |
| `item.jug_5l_empty` | Yerel kooperatif | 0,70 kredi | 4 |
| `item.carboy_19l_empty` | Yerel kooperatif | 2,00 kredi | 2 |
| `item.tomato_seed` | Yerel kooperatif | 1,00 kredi | 8 |

Yeni kayıtta bu sarfların toplam lot maliyeti **17,20 kredi**, ayrıca nakit **100 kredi**dir. Lot maliyeti açılış stokunun tarihsel değeridir; nakitten ikinci kez düşülmez. Şişeleyici enerji bedeli `1 E × aktif saniye × 0,01 kredi`: küçük/5 L/damacana için 0,03/0,08/0,18 kredi. Ham su kaynağının P0 enerji ve sarf gideri yoktur; hazne/debi ve makine kapasitesi üretimi sınırlar. Domates yatağı `2 ham su + 1 tohum → 1 taze domates` tarifini 8 aktif saniyede, 0 E ile tamamlar; tohum lotu 1,00 kredi maliyet taşır. Sarf yeniden alımı kooperatiften, görünür fiyat ve stok/teslim kuralıyla yapılır; başlangıç lotları bitince bedelsiz yenilenmez.

### Eksik girdilerin edinim yolu

P0 açılış sarfı 3–8 dakikalık döngüyü taşır. A2'de Yerel Kooperatif'in 0,25 oyun günü (225 aktif saniye), en az 5 birimlik siparişi bu sarfları yeniler. Aşağıdaki bedeller Standard kalite için **başlangıç denge değeri**dir; nakliye ayrıca teklif ekranında görünür. A3'te açılan yerel kaynak, aynı girdiyi kendi üretme seçeneği verir; önceki satın alınmış lotun tarihsel maliyeti değişmez.

| Girdi | Kooperatif birim bedeli | Yerel kaynak / açılış | Tariflerdeki rolü |
|---|---:|---|---|
| `item.lemon_mint_bundle` | 0,80 kredi | Bahçe ot yatağı / A3 | Limonata |
| `item.einkorn_wheat` | 1,80 kredi | Geniş tarla `source.crop_plot` / A3 | A2 kümes yumurtasının görünür kooperatif yem girdisi; A3'te yerel üretim alternatifi |
| `item.tea_leaf` | 0,60 kredi | Bahçe çay fidanı / A3 | Semaver çayı |
| `item.coffee_bean` | 1,00 kredi | Bahçe kahve fidanı / A3 | Dibek kahvesi |
| `item.yeast` | 0,40 kredi | Kendi mayasını ayırma / A3 | Ekmek ve hamur |
| `item.fodder` | 0,40 kredi | 1 siyez → 2 yem, değirmen 4 sn / A3 | Mandıra/ağıl |
| `item.salt` | 0,30 kredi | Kooperatif; yerel göl tuzu bununla aynı lot değildir | Genel tuz yazan tarifler |
| `item.wood_fuel` | 0,30 kredi | Bağ/zeytinlik budaması / A3 | Odun ateşi ve tütsü |
| `item.walnut` | 2,50 kredi | Bahçe ceviz ağacı / A3 | Cevizli köme |
| `item.herb_bundle` | 0,20 kredi | Bahçe ot yatağı / A3 | Kekik ve ot |
| `item.spice_bundle` | 0,60 kredi | Bahçe baharat yatağı / A3 | Çemen ve baharat |
| `item.salep_tuber` | 2,00 kredi | Mera bitki yatağı / A3 | Sıcak salep |
| `item.jar` | 0,40 kredi | Görünür ambalaj tedariki / A2 | Turşu ve kavanozlu ürün |

A3 yerel alternatiflerinde tek yatak/fidan çıktısı sıralı çalışır: ot yatağı 8 sn, çay fidanı 10 sn, kahve fidanı 12 sn, ceviz ağacı 15 sn, baharat yatağı 10 sn, mera salep yatağı 12 sn; her hasat 1 ürün ve 1 ham su tüketir. Kurulum bedelleri sırasıyla 60/80/100/120/80/120 kredidir. Her kaynak 8 çıktı kapasiteli tampon kullanır; çakışan hasat ikinci çıktı üretmez. Bağ/zeytinlik budamasında 20 saniyede 2 odun sarfı, göl tuzu havuzunda 6 saniyede 1 `item.lake_salt` çıkar; bu ikisi de ilgili satın alınmış araziye bağlıdır. `item.salt` yalnız genel tuz tariflerine kooperatiften gelir; “göl tuzu” diyen tarifler doğrudan `item.lake_salt` tüketir, iki ID birbirine ücretsiz çevrilmez. Bunlar başlangıç denge değerleridir ve P0 döngüsünü yavaşlatmaz. Bir tarifin ilk kez açılması için kullanılan girdinin tedarik yolu erişilebilir olmalıdır. Standart kooperatif nakliyesi 5 kredi/sipariş ve §33 kapasite/kota sınırlarıyla çalışır; P0'daki ilk sarf açılış lotudur, bedelsiz tekrar verilemez.

| Ara ürün | Kaynak tarifi | İstasyon / aktif süre | Erişim |
|---|---|---|---|
| `item.tomato_puree` | 2 taze domates → 1 püre | Taş fırın/kazan, 6 sn, 2 E | A2 |
| `item.cotton_thread` | 2 ham pamuk → 2 iplik | Değirmen/çırçır, 8 sn, 1 E | A3 |
| `item.vinegar` | 2 siyah üzüm + 1 ham su → 1 sirke | Damıtma tezgâhı, 8 sn, 1 E | A3 |

Fırın/ocak tarifinde odun ateşi yazıyorsa `item.wood_fuel` bir sarf olarak rezerve edilir; tuz, maya, baharat, ot ve kavanoz da yazıldıkları tarifte stoktan düşer. `item.natural_beeswax` ayrı bedelsiz hasat değildir: arılıkta tek **14 saniye, 0 E** hasat aynı işlem kimliğiyle 1 petek balı ve 1 balmumu verir; girdinin lot maliyeti iki çıktıya paylaştırılır. Balmumunun tabloda görülen 1,50 kredi maliyeti bu ortak işlemin ayrılan payıdır, ikinci bir enerji/işlem ücreti değildir. Böylece arılığı iki kez çalıştırıp aynı çiçek kaynağından çift ürün çıkarma yolu açılmaz.

| SKU Kimliği | Türkçe Ürün Adı | Girdiler & Ara Formlar | Süre (sn) | Güç (E) | Yük Slotu | Ham Maliyet | Taban Satış | Birim Kâr | Kâr Oranı |
|---|---|---|---|---|---|---|---|---|---|
| **Tier 1: Su ve İçecekler** | | | | | | | | | |
| `item.glass_water_small` | 0,5 L Cam Şişe Pınar Suyu | 1 Ham Su + 1 küçük şişe | 3 | 1 | 1 | 0,23 | 1,50 | +1,27 | %552 |
| `item.water_jug_5l` | 5 L Kaynak Bidonu | 10 Ham Su + 1 boş 5 L bidon | 8 | 1 | 2 | 0,78 | 5,50 | +4,72 | %605 |
| `item.water_carboy_19l` | 19 L Mahalle Damacanası | 38 Ham Su + 1 boş damacana | 18 | 1 | 4 | 2,18 | 18,00 | +15,82 | %726 |
| `item.fresh_lemonade` | Nane & Limonlu Bostan Şerbeti| 2 Su + 1 Nane/Meyve | 6 | 1 | 1 | 1,80 | 5,00 | +3,20 | %177 |
| `item.brewed_tea` | Semaverde Tavşan Kanı Çay | 1 Su + 1 Çay Yaprağı (0.60) | 5 | 1 | 1 | 1,10 | 3,50 | +2,40 | %218 |
| `item.mortar_coffee` | Közde Taş Dibek Kahvesi | 1 Su + 1 Kahve Çekirdeği (1.0) | 8 | 1 | 1 | 1,50 | 5,50 | +4,00 | %266 |
| `item.mountain_salep` | Sıcak Tarçınlı Dağ Salebi | 1 Keçi Sütü + 1 Salep Yumrusu (2.0)| 12 | 1 | 1 | 3,50 | 14,00 | +10,50 | %300 |
| **Tier 2: Bostan, Tarla, Bağ & Zeytinlik** | | | | | | | | | |
| `item.heirloom_tomato` | Ayaş Salkım Domatesi | 2 Ham Su + 1 domates tohumu | 8 | 0 | 1 | 1,00 | 4,00 | +3,00 | %300 |
| `item.local_cucumber` | Çengelköy Salatalığı | 1 Su + 1 Tohum (0.60) | 6 | 0 | 1 | 1,10 | 2,20 | +1,10 | %100 |
| `item.village_pepper` | Çıtır Köy Biberi | 1 Su + 1 Tohum (0.60) | 6 | 0 | 1 | 1,10 | 2,30 | +1,20 | %109 |
| `item.einkorn_wheat` | Siyez Buğdayı Başağı | 2 Su + 1 Tohum (0.80) | 8 | 0 | 1 | 1,80 | 3,50 | +1,70 | %94 |
| `item.sunflower` | İri Çekirdekli Ayçiçeği | 2 Su + 1 Tohum (1.00) | 10 | 0 | 1 | 2,00 | 4,50 | +2,50 | %125 |
| `item.sweet_corn` | Süt Mısır Koçanı | 2 Su + 1 Tohum (0.80) | 8 | 0 | 1 | 1,80 | 3,80 | +2,00 | %111 |
| `item.roasted_corn` | Közlenmiş / Haşlanmış Mısır| 1 Mısır + 1 Göl Tuzu + Köz Isısı | 6 | 1 | 1 | 2,00 | 6,00 | +4,00 | %200 |
| `item.aegean_cotton` | Ege Pamuğu / Ham Lif | 3 Su + 1 Tohum (1.20) | 12 | 0 | 1 | 2,70 | 5,00 | +2,30 | %85 |
| `item.fresh_olives` | Gemlik Sofralık Taze Zeytin | 2 Su + 1 Zeytin Fidesi (1.20) | 10 | 0 | 1 | 2,20 | 5,00 | +2,80 | %127 |
| `item.cured_olives` | Kaya Tuzlu Sele Zeytini | 2 Taze Zeytin + 1 Göl Tuzu | 10 | 0 | 1 | 4,80 | 13,00 | +8,20 | %170 |
| `item.extra_virgin_olive_oil`| Erken Hasat Sızma Zeytinyağı | 3 Taze Zeytin (Taş Pres) | 12 | 2 | 1 | 6,60 | 22,00 | +15,40 | %233 |
| `item.sunflower_oil` | Soğuk Sıkım Ayçiçek Yağı | 2 Ayçiçeği (Taş Pres) | 10 | 2 | 1 | 4,00 | 14,00 | +10,00 | %250 |
| `item.black_grapes` | Siyah Bağ Üzümü | 2 Su + 1 Asma Fidesi (1.00) | 8 | 0 | 1 | 2,00 | 4,50 | +2,50 | %125 |
| `item.raisins` | Güneşte Kurutulmuş Kuru Üzüm | 2 Siyah Üzüm + Güneşleme | 10 | 0 | 1 | 4,00 | 12,00 | +8,00 | %200 |
| `item.grape_molasses` | Kazan Kaynatması Üzüm Pekmezi| 3 Siyah Üzüm + Odun Ateşi | 14 | 2 | 1 | 6,00 | 20,00 | +14,00 | %233 |
| `item.walnut_sausage` | Cevizli Pekmez Kömesi / Sucuk| 1 Üzüm Pekmezi + 1 Ceviz (2.50)| 16 | 2 | 1 | 8,50 | 32,00 | +23,50 | %276 |
| **Tier 2.5: Hayvancılık, Mandıra & Arılık** | | | | | | | | | |
| `item.farm_egg` | Taze Köy Yumurtası | 1 `item.einkorn_wheat` (Kümes) | 6 | 0 | 1 | 1,80 | 4,50 | +2,70 | %150 |
| `item.fresh_milk` | Taze İnek Sütü | 2 Su + 1 Ot (Mandıra) | 8 | 1 | 1 | 2,00 | 5,50 | +3,50 | %175 |
| `item.churned_ayran` | Köy Yayık Ayranı | 1 Taze Süt + 1 Su + Tuz | 8 | 1 | 1 | 2,70 | 7,50 | +4,80 | %177 |
| `item.farm_butter` | Geleneksel Köy Tereyağı | 2 Taze Süt (Yayık) | 10 | 1 | 1 | 4,00 | 12,00 | +8,00 | %200 |
| `item.comb_honey` | Karakovan Petek Balı | Bostan Çiçekleri (Arılık) | 14 | 0 | 1 | 2,50 | 18,00 | +15,50 | %620 |
| `item.natural_beeswax` | Saf Doğal Balmumu | Petek balıyla aynı arılık hasadı | 14 | 0 | 1 | 1,50 | 12,00 | +10,50 | %700 |
| `item.raw_wool` | Kırkılmış Ham Koyun Yünü | 1 Buğday/Ot (Ağıl) | 12 | 0 | 2 | 1,80 | 8,00 | +6,20 | %344 |
| `item.goat_milk` | Yağlı Keçi Sütü | 2 Su + 1 Dağ Otu (Ağıl) | 8 | 1 | 1 | 2,20 | 6,50 | +4,30 | %195 |
| `item.aged_cheese` | Ezine Tipi Olgun Koyun Peyniri| 2 Keçi Sütü + 1 Göl Tuzu + Maya | 16 | 1 | 1 | 5,50 | 22,00 | +16,50 | %300 |
| `item.raw_meat` | Taze Besi Eti | 2 Buğday + 2 Su (Ağıl) | 16 | 0 | 2 | 4,50 | 16,00 | +11,50 | %255 |
| **Tier 3: Göl Su Ürünleri, Fırın & Şarküteri** | | | | | | | | | |
| `item.fresh_trout` | Taze Göl Alabalığı | Göl İskelesi Ağ Hasadı | 10 | 0 | 1 | 2,00 | 9,00 | +7,00 | %350 |
| `item.lake_reeds` | Göl Sazlığı & Hasır Lifi | Göl Kıyısı Biçimi | 8 | 0 | 1 | 1,00 | 4,00 | +3,00 | %300 |
| `item.lake_salt` | Doğal Göl Tuzu Torbası | Göl Buharlaştırma Havuzu | 6 | 1 | 1 | 0,80 | 3,00 | +2,20 | %275 |
| `item.freshwater_pearl` | Saf Tatlısu İncisi | Dip Midyesi Ayıklama | 20 | 0 | 1 | 4,00 | 35,00 | +31,00 | %775 |
| `item.smoked_trout` | Meşe Dumanında Alabalık | 1 Alabalık + 1 Göl Tuzu + Duman | 14 | 2 | 1 | 4,00 | 24,00 | +20,00 | %500 |
| `item.woven_basket` | El Örmesi Hasır Sepet | 2 Göl Sazlığı (Hasır Tezgâhı) | 10 | 1 | 1 | 2,00 | 12,00 | +10,00 | %500 |
| `item.einkorn_flour` | Taş Değirmen Siyez Unu | 2 Siyez Buğdayı | 6 | 1 | 1 | 3,60 | 8,00 | +4,40 | %122 |
| `item.sourdough_bread` | Ekşi Mayalı Köy Somunu | 1 Siyez Unu + 1 Maya + 1 Su | 12 | 2 | 1 | 8,20 | 25,00 | +16,80 | %205 |
| `item.village_tomato_paste`| Kazan Köy Salçası | 2 Domates Püresi + 1 Tuz | 12 | 2 | 1 | 9,50 | 26,00 | +16,50 | %174 |
| `item.jarred_pickle` | Kavanoz Bostan Turşusu | 2 Salatalık + 1 Sirke + 1 Su | 12 | 1 | 1 | 6,70 | 22,00 | +15,30 | %228 |
| `item.marinated_sun_tomatoes`| Zeytinyağlı Kuru Domates Mezesi| 2 Domates + 1 Zeytinyağı + Kekik | 12 | 1 | 1 | 8,50 | 28,00 | +19,50 | %229 |
| `item.pot_confit` | Toprak Çömlek Kavurması | 2 Besi Eti + 1 Tereyağı + Tuz | 18 | 2 | 1 | 13,50 | 48,00 | +34,50 | %255 |
| `item.cured_pastirma` | Kurutulmuş Çemenli Pastırma | 2 Besi Eti + 1 Çemen/Baharat + Tuz| 20 | 1 | 1 | 11,50 | 50,00 | +38,50 | %334 |
| `item.baked_pastry` | Peynirli Çıtır Boyoz / Çörek| 1 Un + 1 Yumurta + 1 Tereyağı + 1 Peynir | 14 | 2 | 1 | 14,20 | 48,00 | +33,80 | %238 |
| `item.sucuk_pide` | Sucuklu Kaşarlı Köy Pidesi | 1 Un + 1 Kavurma/Sucuk + 1 Peynir | 16 | 2 | 1 | 16,50 | 58,00 | +41,50 | %251 |
| `item.canned_menemen` | Sıcak Esnaf Menemeni | 2 Domates + 2 Biber + 2 Yumurta + Tereyağı| 16 | 2 | 1 | 13,80 | 52,00 | +38,20 | %276 |
| `item.tarhana_soup` | Usta İşi Sıkma Tarhana | 1 Un + 1 Salça + 1 Süt/Maya | 18 | 2 | 2 | 17,50 | 60,00 | +42,50 | %242 |
| `item.woven_fabric` | Geleneksel Dokuma Kumaş | 2 Pamuk İpliği | 10 | 1 | 1 | 10,80 | 32,00 | +21,20 | %196 |
| **Tier 4: Zengin Gurme Sofraları ve Dokuma Ürünleri** | | | | | | | | | |
| `item.village_breakfast` | Zengin Köy Kahvaltı Tepsisi | 1 Ekmek + 1 Bal + 1 Tereyağı + 1 Peynir + 1 Yumurta + 1 Zeytin + 1 Çay| 20 | 2 | 2 | 26,40 | **125,00** | **+98,60** | **%373** |
| `item.pastirma_wrap` | Gurme Çemenli Pastırma Dürümü | 1 Pastırma + 1 Ekmek + 1 Turşu + 1 Tereyağı| 16 | 2 | 1 | 28,40 | **130,00** | **+101,60**| **%357** |
| `item.smoked_fish_wrap` | Meşe Tütsülü Balık Dürümü | 1 Tütsülü Balık + 1 Ekmek + 1 Turşu + 1 Zeytinyağı| 16 | 2 | 1 | 25,50 | **120,00** | **+94,50** | **%370** |
| `item.wool_shawl` | El Dokuması Sıcak Yün Şal | 2 Ham Yün (Eğirme Tezgâhı) | 15 | 1 | 1 | 3,60 | 28,00 | +24,40 | %677 |
| `item.waxed_canvas` | Balmumlu Su Geçirmez Branda| 1 Dokuma Kumaş + 1 Saf Balmumu | 12 | 1 | 1 | 12,30 | 65,00 | +52,70 | %428 |
| `item.insulated_bag` | Yalıtımlı Sefer Heybesi | 1 Balmumlu Branda + 1 Hasır Sepet + 1 Kumaş| 18 | 1 | 2 | 25,10 | 140,00 | +114,90 | %457 |

---

## 4. Taşıma ve Özel Ekipman Avantajları

* **Başlangıç:** 6 Slot (Seviye atlamayla 8, 10 ve 12 slota yükseltilir).
* **Hasır Sepet Taşıma Bonusu (`item.woven_basket`):** Karakter üzerinde tutulduğunda ek +2 hafif eşya (yumurta, ekmek, çay vb.) taşıma alanı açar.
* **Yalıtımlı Sefer Heybesi (`item.insulated_bag`):** Taşınabilir bir ürün olarak satılır. Ağır yük taşıma bonusu bu taslakta verilmez; ekipman etkisi ayrıca dengelenmelidir.

---

## 5. İlerleme ve Arazi Açılma Aşamaları (P0 → A3)

1. **P0 (Su & Manav Siftahı):** Memba çeşmesi, şişeleme ve domates yatağı. Müşteriler su ve taze domates alarak ilk nakit döngüsünü kurar.
2. **A2 (Mandıra, Çay Ocağı ve İlk İşleme):** Kümes, inek mandırası ve semaver kurulur. Taze yumurta, süt, yayık ayranı, tereyağı ve sıcak çay tezgâha; tereyağı ilk işlenmiş satılabilir gıdadır. A2 domates püresi işlenmiş **ara ürün** olarak üretim hattına çıkar. Ekmek ve menemen Tier 3 tarifleriyle A3'te açılır; A2'de hazır satış dekoru değildir.
3. **A3 (Göl, Mera, Zeytinlik ve Bağ Genişlemesi):**
   - Göl (800 Kr), Mera (500 Kr), Zeytinlik/Bağ (450 Kr) ve Tarla (400 Kr) arazileri açılır.
   - Sele zeytini, sızma zeytinyağı, üzüm pekmezi, cevizli köme, alabalık tütsüsü, ezine peyniri, petek balı ve çemenli pastırma devreye girer.
   - İlk devasa ziyafet tepsisi olan **Zengin Köy Kahvaltı Tepsisi** ve **Pastırma Dürümü** satış rekorları kırar.

## 6. §64 adayları için içerik kapısı

Bu katalog Tier 1–4 ile sınırlıdır; Tier 5, Termal Akü veya Altın Karakovan Balı adının örnekte geçmesi bunları satılabilir SKU yapmaz. VIP isteği, hijyen sabun/kolonya sarfı, vurgu tezgâhı, Tier 4 pazarlığa uygun ürün, doğal bonus çıktısı ve sıcaklık fırsatı için kalıcı ID, edinim/tarif yolu, süre, maliyet, fiyat ve faz tanımı tamamlanmadan ekonomik etki açılmaz. İnci mevcut göl ürünüdür; bonus çıkışında da gerçek lot olur. Aday dekorlar §32 işlevsel dekor tavanına bağlı ücretsiz nesnelerdir; kozmetik görünüm yeni cazibe puanı taşımaz. %15–20, +%25 ve 3× değerleri §64 başlangıç hipotezidir, katalog fiyatı veya uygulanmış özellik değildir.

## 7. Ürün → fiziksel işlem portu eşlemesi

Bu eşleme [yerleşim paftası §11–13](DUNYA_YERLESIM_PLANI.md) ile birlikte kullanılır. Aynı hücredeki tek istasyon **sıralı** parti işler; ürün listesi bedava paralel makine demek değildir. Görsel malzeme üretimi başlatmaz. Ücretli A2/A3 kaynak ve istasyonların açılma/edinim koşulları kendi fazında görünür teklif olarak tanımlanır; P0 açılışında yalnız §26.1 nesneleri kurulu gelir. Kimliklerin burada bir porta atanması tek başına satın alma, bedava yerleştirme veya ekonomi dengesi onayı değildir.

| Fiziksel kaynak/istasyon | Satılabilir SKU kimlikleri ve gerekli ara port |
|---|---|
| `station.bottler` | `item.glass_water_small`, `item.water_jug_5l`, `item.water_carboy_19l`, `item.fresh_lemonade`, `item.brewed_tea`, `item.mortar_coffee`, `item.mountain_salep` |
| `source.crop_plot` | `item.heirloom_tomato`, `item.local_cucumber`, `item.village_pepper`, `item.einkorn_wheat`, `item.sunflower`, `item.sweet_corn`, `item.aegean_cotton`, `item.fresh_olives`, `item.black_grapes` |
| `station.stone_oven` | `item.roasted_corn`, `item.walnut_sausage`, `item.sourdough_bread`, `item.village_tomato_paste`, `item.pot_confit`, `item.baked_pastry`, `item.sucuk_pide`, `item.canned_menemen`, `item.tarhana_soup`; ara port: `item.tomato_puree` |
| `station.oil_press` | `item.extra_virgin_olive_oil`, `item.sunflower_oil`, `item.grape_molasses` |
| `station.preservation_table` | `item.cured_olives`, `item.aged_cheese`, `item.jarred_pickle`, `item.marinated_sun_tomatoes`, `item.village_breakfast`, `item.pastirma_wrap`, `item.smoked_fish_wrap` |
| `station.drying_rack` | `item.raisins` |
| `source.chicken_coop` | `item.farm_egg` |
| `source.cow_dairy` | `item.fresh_milk`, `item.churned_ayran`, `item.farm_butter` |
| `station.beehive_apiary` | Aynı 14 saniye/0 E/tek transaction: `item.comb_honey` + `item.natural_beeswax` |
| `station.sheep_pen` | `item.raw_wool`, `item.goat_milk`, `item.raw_meat` |
| `station.fishing_dock` | `item.fresh_trout`, `item.lake_reeds`, `item.freshwater_pearl` |
| `source.salt_pan` | `item.lake_salt` |
| `station.smokehouse` | `item.smoked_trout`, `item.cured_pastirma` |
| `station.loom` | `item.woven_basket`, `item.woven_fabric`, `item.wool_shawl`, `item.waxed_canvas`, `item.insulated_bag` |
| `station.mill_gin` | `item.einkorn_flour`; ara port: `item.cotton_thread` |
| `station.distillery` | Ara port: `item.vinegar`; sabun/esans satılabilir SKU değildir |

**Tuz kuralı:** “Göl Tuzu” adı yazan `item.roasted_corn`, `item.cured_olives`, `item.aged_cheese`, `item.smoked_trout` tarifleri `item.lake_salt` lotu ister. “Tuz” adı yazan `item.churned_ayran`, `item.village_tomato_paste`, `item.pot_confit`, `item.cured_pastirma` tarifleri `item.salt` lotu ister. İki kimlik birbirinin gizli ikamesi değildir. Genel tuz kooperatiften, göl tuzu açılmış göl parselindeki `source.salt_pan`dan gelir. Tablodaki eski ham maliyetler denge hipotezidir; gerçek lot edinim bedeli ledger'da korunur.

**İçerik kapısı:** Üstteki yeni portların kurulum bedelleri başlangıç hipotezidir; her alışverişte gerçekten erişilebilir faz, parsel, oda, girdi ve stok kapasitesi denetlenir. Katalogda hâlâ tanımlanmamış sabun/esans gibi satış SKU'su veya hayalî istasyon butonu açılmaz. Ekonomik kabul, §33 ledger ve A2/A3 oyuncu/cihaz testiyle ayrıdır.
