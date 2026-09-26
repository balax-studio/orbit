# Ekonomi, üretim ve stok

Kaynak: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §26, §33–41, §47–48. Fiyat/maliyet başlangıç referansı §37'dir; değerler test hipotezidir. Özet tablolar tarif ağacının yerine geçmez.

## P0 — korunumu kanıtla

Fiziksel stok/kapasite/atık soruları [KARARLAR.md](KARARLAR.md) D-011'de; negatif kredi, satış iadesi, gelir bildirimi D-012'de; makine buffer/parti/yerleştirme D-015'tedir. Son temel üretim yolu yalnız makine adediyle değil erişilebilir rota, servis, güç, girdi ve çıkışla korunur (D-001/D-016).

Tek küp hattı, iki makine ve etiketli prototip tedariki kullanılır. Aktarım/satış atomiktir; kullanılabilir stok = fiziksel − rezerve. Kaynak miktarı ve hedef kapasitesi birlikte rezerve edilir, iptalde birlikte bırakılır. Üretim emri ürün/hedef/minimum stok/öncelik/maksimum ayrılmış girdi içerir. Çıktı dolu veya girdi eksikse ürün kaybolmaz; sebep görünürdür.

Parti süresi simülasyon saatidir. Çıktı/dakika = çıktı adedi × 60 / parti süresi; hat kapasitesi en yavaş aşamayla sınırlıdır. Tek paketleyici küpte 7,5 adet/dk referansına sahiptir. Makine yükseltmelerine kaynaksız genel süre çarpanı uygulanmaz; §26.4 tanımı aktarılır.

## A2 — gerçek maliyet ve fiyat

Tanımlar `src/content/` altında sürümlenir. Tarif miktarları/süreleri/makineler §26; güncel maliyet ve referans satış §37'den aktarılır. Formül ve veri için üçüncü bağımsız sabit listesi oluşturulmaz.

| Ürün | Üretim maliyeti | Referans satış |
|---|---:|---:|
| Besin küpü | 4,00 | 12,00 |
| İçme suyu | 1,06 | 5,00 |
| Sefer öğünü (ileri içerik) | 10,97 | 40,00 |

Bunlar tam katalog değildir. Ara ürün su maliyeti 1,02 ile şişelenmiş nihai içme suyu 1,06 birbirine karıştırılmaz. Yosun `(1,02+6,56+0,10)/4=1,92`; küp `2×1,92+0,16=4,00`. Ara hesap yuvarlanmaz. Ledger en az dört ondalık sabit hassasiyet; UI iki ondalık, ödeme en küçük para birimine yuvarlanır. Katkı, personel/bakım/oda giderleri öncesidir; net kâr değildir.

Normal nihai toptan bedel referans perakendenin %65'i; nakliye 5 kredi/sipariş, kapasite 40 birim. Gerçek taşıma payı sipariş adediyle hesaplanır. Hacim indirimi §33'e göre ayrı uygulanır. Oyuncunun raf fiyatını artırması referans tedarik/kontrat değerini değiştirmez. Tarihsel lot maliyeti korunur.

## A2–A3 — müşteri ve kalite

Müşteri ihtiyaç RNG'si girişte kaydedilir; boş raf talebi silmez. Kuyruk hücreleri, sabır ve güvenli çıkış kararları [KARARLAR.md](KARARLAR.md) D-013'tedir.

P0 öğretim gelişinin ayrı tetiklenmesi, sonrasındaki `56/9000` seed'li tick geliş olasılığı, 40 aktif saniyelik P0 kuyruk sabrı ve 12 kredilik sabit küp fiyatı D-019 D.1–D.3 kararıdır. A2 profil sabrı 40/55/30 sn ve bölüm ziyaret hedefleri anayasa §37–38'den alınır; P0 ritmi doğrulanmış denge sonucu değildir.

A2 üç profil ve bir ikameyle başlar; §38–39'un tam entegrasyonu A3 derinliğine bağlanır. Raf fiyatı oyuncu seçimiyle değişebilir; oyuncunun nakdine göre gizlice değişmez. Sepetteki fiyat kilitlenir. Stok ve bütçe filtresinden sonra:

```text
fairPrice = baseRetail × (1 + alpha × qualityPremium)
r = shelfPrice / fairPrice
P = 1 / (1 + exp(-(2 - epsilon × (r - 1))))
```

Profil alpha/epsilon/bütçe/sabır değerleri §38.1'den alınır. İhtiyaç başına kabul eşiği bir kez çekilir; ikame veya yeniden yükleme şansı tekrar üretmez. İtibar spawn etkisi kabul denklemine ikinci kez eklenmez. Kayıp satış nedenleri stok, bütçe, fiyat, ikame ve kuyruk olarak ayrılır.

A3 kalite skoru = `0,5 × miktar ağırlıklı girdi + 0,3 × kalibrasyon + 0,2 × ilgili personel uzmanlığı`; sonuç 0–100. Personel yoksa 40 kullanılır; mevcut personelin 0 becerisi 40'a dönüştürülmez. Standart <60, Nitelikli 60≤skor<85, Özel ≥85; fiyat çarpanları 1/1,15/1,30. Gerçek skor lotta korunur, etiket tekrar 40/70/95 skoruna çevrilmez.

Ham kaynak skorları 40/70/95 ve alış çarpanları 1/1,25/1,60; kalibrasyon I/II/III = 40/70/90. Özenli mod +10 kalibrasyon ve +%15 süre, Titiz son skora +5; üst sınır 100. Üst kalite nihai tedarik SKU kotasının en fazla %25'idir (§47.2).

## A3 — tamamlanacak sistemler

- Lot/slot ayrımı, FIFO/raf ömrü kuralları, depo bölgeleri, yeniden sipariş, tedarik kotaları ve teslim zamanı (§33–34, §48).
- Aşınma, servis yöntemleri, servis rezervasyonu ve gider muhasebesi (§40).
- Kontrat/perakende tahsisi, fırsat maliyeti ve çift teslim engeli (§41).
- Başlangıç 8 E bağlantı, güç önceliği ve temel elle döngünün korunması (§47.3).
- İflas yardımı, ücret/oda gideri davranışı ve stok silmeyen toparlanma (§48.4).

## A4–A5 — tam katalog ve denge kanıtı

24 nihai ürün, tüm ara tarifler ve altı aile tutarlı ID'lerle doğrulanır. Üretim/ticaret/karma senaryoları; ücret, enerji, bakım, oda, lojistik ve vazgeçilen satış katkısıyla karşılaştırılır. Final teslimleri satış geliri değildir. Ücretsiz, reklamsız ekonomi bağımsız çalışır; kozmetik ödül üretim/para/XP/kalite avantajı vermez. Denge raporu aritmetik kontrol ile oyuncu deneyimini ayrı gösterir.

## P0 aktarılacak minimum katalog — KAYNAK §26.2–26.4

`item.water` ara su, `item.drinking_water` satılabilir içme suyudur; aynı ID kullanılamaz. Tarifler `recipe.*`, ürünler `item.*` biçimindedir. Makine ID yazımı uygulama kararıdır; aşağıdaki Türkçe araç adlarıyla tek katalogda eşlenir.

| Tarif | Parti girdisi | Araç | Süre | Çıktı |
|---|---|---|---:|---|
| recipe.algae | 1 item.water + 1 spor | Biyoyetiştirici | 10 sn | 4 yosun |
| recipe.nutrient_cube | 2 yosun | Paketleyici | 8 sn | 1 item.nutrient_cube |

P0 dolabı tarif girdilerini sağlar; kaynak çıkarma veya üçüncü makine ekleme zorunluluğu yoktur. Prototip bağışı normal alım gibi maliyetlendirilmez. Tam ekonomi regresyon fixture'ı ise §37 ücretli girdilerini kullanır; bu iki senaryonun sonuçları karıştırılmaz.

| Araç | Fiyat | Footprint | Güç | Girdi/çıktı kapasitesi |
|---|---:|---|---:|---|
| Biyoyetiştirici | 160 | 2×2 | 1 E | 16/24 |
| Paketleyici | 180 | 1×2 | 2 E | 24/12 |

Her araç erişilebilir en az bir servis hücresi ister. II seviye işlem süresini %15 kısaltır; yükseltme bedeli satın alma bedelinin %10'u. III ikinci sıraya alınmış tarif kuyruğu ve %25 yükseltme maliyetidir; paralel üretim eklemez. Yükseltmenin devam eden partiye uygulanma anı teknik kararda netleşir; mevcut partiye ikinci çıktı verilmez.

## A2 tedarik ve müşteri ayrıntıları

Sipariş: Draft → Quoted → Confirmed → InTransit → Arrived → Inspecting → Accepted; alternatif Cancelled/AwaitingSpace/Rejected/Refunded. Confirmed'da para bir kez düşer, kapasite ve kota ayrılır; mülkiyet Accepted'da geçer. InTransit ürün satılamaz. Yola çıkmadan iptal tam iade ve kota bırakma; yola çıktıktan sonra ürün bedeli iade, gösterilmiş taşıma iade edilmez ve aynı gün kota yenilenmez. Yer yoksa AwaitingSpace; mal kaybolmaz, ceza yok, yeni otomatik alım durur (§33.3, §48.2).

Depo rafı: 60 kredi, 1×2, 8 slot; stackSize=10, tek SKU/kalite kademesi. Alt lotlar aynı slotu paylaşabilir. Günlük nihai SKU kotası bölüm 2/3/4+ için 20/40/80; tedarikçi toplamı 80/160/320. Ham SKU 200/gün, özel kalite en çok %25. Bir gün 900, çeyrek gün 225 aktif saniye.

| Profil | Pay | Bütçe | Epsilon | Alpha | Sabır |
|---|---:|---|---:|---:|---:|
| Yerleşim çalışanı | %50 | 20–45 | 6 | 0,50 | 40 sn |
| Araştırmacı | %25 | 40–90 | 4 | 1,00 | 55 sn |
| Kurye/gezgin | %25 | 25–65 | 5 | 0,70 | 30 sn |

Bölüm 1 bütçe ×0,75; bölüm 2 ×0,90; sonrası ×1. Bütçe seed ile ziyaret başında seçilir; tamsayı/ondalık çekim yöntemi teknik karar olarak sabitlenir. Fiyat artınca bütçe yükselmez. İkame aday sırası §39 ile eşlenir; bütçeye sığmayan adayda kabul zarı atarak alış zorlama yoktur.

## A3 bakım, kontrat ve yaşlanma

Aşınma yalnız Running'de: eritici/yetiştirici 1 puan/dk, diğerleri 2. W60 uyarı, W80 yeni partide +%10 süre, W100 mevcut parti sonrası güvenli duruş; ilk oyun günü görünür koruma. Planlı servis 30 sn/8 kredi → W10; onarım 60 sn/14 → W20; durmuş makineye ücretsiz 90 sn elle toparlama → W70. Servis bedeli fiili başlangıçta bir kez; kesintide ilerleme korunur. Satılabilir bakım kiti servis sarfı değildir (§40).

Normal kontrat fiyatı referans×kalite×0,82; bölüm 2:10–20 adet/2 gün, 3:30–60/3, 4:60–100/4. En fazla iki aktif kontrat; aynı SKU toplamı son üç gün ortalama günlük perakende ihtiyacının iki katını aşmaz. Birimlik kısmi teslim ödenir; avans yok. Bir defa +1 gün uzatma kalan fiyatı %5 düşürür. Timeout kalan kısmı kapatır; ilgili itibar kaybı en çok 3, borç/geri alınan geçmiş teslim yoktur (§41).

A2 bozulma kapalı; A3 isteğe bağlıdır. Yosun/meyve 3 gün, açık gıda 4, paketli gıda/içecek 8; tekstil/pil/dekor ömürsüz. Soğukta ilgili yaşlanma yarım hız; güç kesilince normal hıza döner. Transfer yaşı sıfırlamaz. Son %10 ömürde uyarı; sıfırda satılamaz ve fire/atık kaydı. FEFO, ömürsüzde FIFO. Geri dönüşüm yalnız kaldırır; ücretsiz sonsuz kaynak üretmez (§34.3).

## Sayısal kabul örnekleri

- 20 adet ×7 kredi +20 taşıma →160 nakit çıkışı, birim lot maliyeti 8. 12 adet ×12 satış →144 gelir, 96 satılan mal maliyeti, 48 brüt katkı, 64 kalan stok, −16 net nakit (§34.4).
- Kalite girdi95/kalibrasyon90/uzmanlık80 →90,5; Özel. İki girdinin adetleri 1 ve 3, skorları 40 ve 80 ise girdi ortalaması 70'tir; 60 değildir.
- Standart küp kontratı 20×12×0,82=196,80 gelir; 80 maliyete karşı 116,80 katkı (§41.2).
- Aynı rezervasyon iki görevliye atanırsa ikinci görev ürün yaratamaz; sipariş iadesi ikinci callback'te tekrar para vermez.
