# Ekonomi, üretim ve stok

Kaynak: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §26, §33–41, §47–48. Fiyat/maliyet başlangıç referansı §37'dir; değerler test hipotezidir. Özet tablolar tarif ağacının yerine geçmez.

## P0 — su ve domates korunumu

Tek kaynak suyu şişeleme ve sulama arasında paylaştırılır. Kullanılabilir stok = fiziksel stok − rezerve stok. Üç su boyutu ve taze domates satışında girdi, çıktı, raf ve para tek işlem kimliğiyle değişir. Yükseltme anında geçmiş üretim doldurulmaz; arka planda su birikmez. Eksik su, ambalaj veya çıktı alanı görünür bekleme nedenidir. Son temel su satış yolu [KARARLAR.md](KARARLAR.md) D-001 uyarınca korunur.

## A2 — gerçek maliyet ve fiyat

Ürün kimlikleri ve tarif yönü [yerel ürün ağacından](OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md), bağlayıcı kapsam [ana kaynak §26'dan](OYUN_GELISTIRME_DEVIR_DOSYASI.md) alınır. Katalogdaki fiyat, ham maliyet ve kâr sayıları denge hipotezidir. Ambalaj, tohum, enerji, nakliye ve ara lot maliyetleri doğrulanmadan gerçek kâr raporu oluşturulmaz. Ledger 10.000 atom/kredi tamsayı hassasiyetini kullanır; UI sunumu ledger değerini değiştirmez. Eski küp ve buz bazlı maliyet hesabı kullanılmaz.

## A2–A3 — müşteri ve kalite

A3 raf fiyat tabelası, SKU kilidi, aşırma ve oyun içi borç sözleşmesi [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §38.4–38.6'dadır. Ön ayarlar referansın 1,00×/0,80×/1,50× katıdır. İndirimli kuyrukta +%50 ortalama hedef mevcut talep ve kapasite içinde ölçülür; sabit spawn çarpanı değildir. Uygun `item.aged_cheese` stoklu günde aşırma olasılığı %20, en çok bir olay ve yakalama süresi en az 12 aktif saniyedir; akü henüz katalogda yoktur. Aşırma satış geliri değildir; yakalamada aynı lot geri döner. Kooperatif 100 kredi ücretsiz, Konsorsiyum 300 kredi ve bir defalık 15 kredi ücretle toplam 315 kredidir; aynı anda tek borç bulunur, sabit vade/ceza yoktur. Günlük brüt satış cirosunun %10'u borç bakiyesi ve mevcut nakitle sınırlı tek kesintidir. Bütün bu sayılar başlangıç denge hipotezidir, test sonucu değildir.

Müşteri ihtiyaç RNG'si girişte kaydedilir; boş raf talebi silmez. Kuyruk hücreleri, sabır ve güvenli çıkış kararları [KARARLAR.md](KARARLAR.md) D-013'tedir.

P0 öğretim gelişinin ayrı tetiklenmesi, sonrasındaki `56/9000` seed'li tick geliş olasılığı ve 40 aktif saniyelik P0 kuyruk sabrı D-019 D.1–D.3 kararıdır. İlk su ürünlerinin referans fiyatı katalogdadır; P0 ritmi doğrulanmış oyuncu sonucu değildir. A2 profil sabrı 40/55/30 sn ve bölüm ziyaret hedefleri anayasa §38'den alınır.

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

Tier 1–4 ürünleri için her kaynak, tedarik, ara form, tarif, istasyon ve satış kimliği doğrulanır. Üretim/ticaret/karma senaryoları ücret, enerji, bakım, oda, lojistik ve vazgeçilen satış katkısıyla karşılaştırılır. Final teslimleri satış geliri değildir. Ücretsiz, reklamsız ekonomi bağımsız çalışır.

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

Aşınma yalnız Running'de: yeni istasyonlar için tanımlanacak aktif aşınma hızı. W60 uyarı, W80 yeni partide +%10 süre, W100 mevcut parti sonrası güvenli duruş; ilk oyun günü görünür koruma. Planlı servis 30 sn/8 kredi → W10; onarım 60 sn/14 → W20; durmuş makineye ücretsiz 90 sn elle toparlama → W70. Servis bedeli fiili başlangıçta bir kez; kesintide ilerleme korunur. Satılabilir bakım kiti servis sarfı değildir (§40).

Normal kontrat fiyatı referans×kalite×0,82; bölüm 2:10–20 adet/2 gün, 3:30–60/3, 4:60–100/4. En fazla iki aktif kontrat; aynı SKU toplamı son üç gün ortalama günlük perakende ihtiyacının iki katını aşmaz. Birimlik kısmi teslim ödenir; avans yok. Bir defa +1 gün uzatma kalan fiyatı %5 düşürür. Timeout kalan kısmı kapatır; ilgili itibar kaybı en çok 3, borç/geri alınan geçmiş teslim yoktur (§41).

A2 bozulma kapalı; A3 isteğe bağlıdır. Yeni ürün ailelerinin raf ömürleri içerik verisiyle tanımlanır; dokuma ürünleri ömürsüzdür. Soğukta ilgili yaşlanma yarım hız; güç kesilince normal hıza döner. Transfer yaşı sıfırlamaz. Son %10 ömürde uyarı; sıfırda satılamaz ve fire/atık kaydı. FEFO, ömürsüzde FIFO. Geri dönüşüm yalnız kaldırır; ücretsiz sonsuz kaynak üretmez (§34.3).

## Sayısal kabul örnekleri

- 20 adet ×7 kredi +20 taşıma →160 nakit çıkışı, birim lot maliyeti 8. 12 adet ×12 satış →144 gelir, 96 satılan mal maliyeti, 48 brüt katkı, 64 kalan stok, −16 net nakit (§34.4).
- Kalite girdi95/kalibrasyon90/uzmanlık80 →90,5; Özel. İki girdinin adetleri 1 ve 3, skorları 40 ve 80 ise girdi ortalaması 70'tir; 60 değildir.
- Standart küp kontratı 20×12×0,82=196,80 gelir; 80 maliyete karşı 116,80 katkı (§41.2).
- Aynı rezervasyon iki görevliye atanırsa ikinci görev ürün yaratamaz; sipariş iadesi ikinci callback'te tekrar para vermez.

## A4 market adaylarının ekonomi sözleşmesi — KAYNAK §64

VIP teslimi, hijyen sarfı, teşhir satışı, pazarlık ve sıcaklık bonusu mevcut lot/ledger/rezervasyon yolundan geçer. Teşhirin +%200 satış hızı normalin 3×'i için **denenecek talep hedefidir**; boş raf, bütçesiz müşteri veya kapasite sınırı satış üretmez. Pazarlık +%20–30 kâr ve sıcak ekmek ilk 3 aktif dakikada +%25 kâr, net kâr garantisi değildir: fiyat, lot maliyeti, vergi/ücret ve satış kaydıyla sınanır. Trend, VIP, kalite, oda/dekor, teşhir ve sıcaklık etkileri aynı sepeti sessiz çarpan zinciriyle katlamaz; birleşim kuralı ve tavan uygulamadan önce sayısal fixture ile sabitlenir. Reddedilen teklif veya süresi dolan sıcaklık fırsatı ürünü silmez. Seed'li %15–20 doğal bonus hipotezinde fazladan çıkan her ürün tanımlı lot ve maliyetle kayda girer; tekrar yükleme ikinci hasat yaratmaz.
