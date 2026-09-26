# P0 uygulama rehberi

Kaynak: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) hızlı özet, §58 ve §63. P0, tam oyunun ilk bölümü veya dengelenmiş ekonomi değildir. Uygulama henüz tamamlanmadı; bu belge yalnız sıralı iş tarifidir.

## P0 sahnesi ve başlangıç

Tek oda, grid, karakter, prototip tedarik dolabı, yetiştirici, paketleyici, raf, kasa, tek müşteri davranışı ve tek raf görevlisi. Satılabilir ürün yalnız besin küpüdür. Yosun hattı iki makineyle gösterilir; su/spor gibi girdiler anayasanın tariflerine göre açıkça etiketlenmiş prototip dolabından sağlanır. Dolap düzeni tek prototip tedarik noktasıdır; ücretsiz girdiler tam oyunun ekonomi dengesi olarak raporlanmaz.

Oda ölçüsü, başlangıç koordinatları ve prototip kredi miktarı anayasanın kesin şartı değildir; seçildiğinde geri alınabilir P0 kararı olarak kaydedilir. Zorunlu 10×10 oda, 50 kredi/3 su ve tek şişeleyici başlangıcı yoktur. P0 kayıtları geliştirme verisidir; yayın kayıt uyumluluğu vaat edilmez.

## Yedi çalışma günü önerisi

| Sıra | İş | Görülebilir kanıt |
|---|---|---|
| 1 | Ortam, kamera, grid, dokunmatik hareket, raf yerleştirme; iki native proje hedefi | Telefona uygun sahne ve hareket |
| 2 | Taşıma, kapasite, atomik transfer, rezervasyon | Ürün kaybolmadan al/bırak |
| 3 | Tek müşteri, raf, kasa, ledger | İlk satış ve doğru para/stok |
| 4 | Yetiştirici/paketleyici, tarif süreleri ve tıkanma | Girdiden satılan küpe tam zincir |
| 5 | Tek raf görevlisi, checkpoint/günlük, lifecycle | Görev devri ve kayıt sonrası devam |
| 6 | İki yerleşim karşılaştırması, hedefli test ve cihaz build | Yürüyüş/boş raf farkı ve cihaz raporu |
| 7 | En az beş dış oyuncu denemesi, hata düzeltme | Devam/düzelt/durdur kararı |

Bu zaman kutusudur; teslim tarihi garantisi değildir. Kayıt işlemlerinin temeli transfer/satışla birlikte kurulur; beşinci gün ilk kez veri güvenliği düşünülmez. Gerçek Android ve iOS build'leri ilk hafta hedefidir; araç/cihaz yokluğu açık engeldir.

## Kısa oturum öğretimi

İlk 60 sn hareket/taşıma, 1–3 dk ilk satış, 3–5 dk kendi üretimi; sonraki oturumda raf düzeni ve çalışan. A2'de sonraki oturum depo/tedariktir. Metin atlanabilir 1–2 cümlelik ipucudur; TutorialState kaydedilir. Tek oturumda zorunlu 20 dakikalık öğretim yoktur.

## P0 kabul sırası

1. Klavyesiz hareket → güvenli al/bırak → iki makine → raf → müşteri → kasa.
2. Yinelenen işlem/eksik girdi/dolu çıktı durumlarında stok ve para korunur.
3. Raf görevlisi işi devralır; erişilemeyen hedef açık nedeni gösterir.
4. İnşa duraklar; geçerli erişim ve maliyet onaylanır; iptal kaynak tüketmez.
5. Arka plan, zorla sonlandırma, bozuk kayıt ve context-loss sonrası güvenli devam/hata ekranı.
6. İki yerleşim aynı koşullarda yürüyüş ve boş raf süreleriyle karşılaştırılır.
7. Cihaz/oyuncu kanıtları [TEST_STRATEGY.md](TEST_STRATEGY.md) ve [PLAN.md](PLAN.md) eşiklerini karşılar.

## A2'ye geçiş

P0 kabulünden sonra üç ürün/üç makineye geçilir. Gerçek yeni kayıt: 600 kredi, kasa, raf, teslim dolabı (4 slot), geçici 8 E güç, 12 küp, 20 su, 8 spor; ürünler sıfır maliyetli bağış lotudur. İlk makineler oyuncu tarafından yetiştirici 160 ve paketleyici 180 krediye alınır (§46.2). Üçüncü ürün/makine seçimi tarif bağımlılıkları ve tek tedarikçi sınırına göre kaydedilir; burada yeni tarif uydurulmaz.

A3 kalite/kontrat/RPG, A4 final ve sandbox monetizasyon, A5 yayın işi bu rehberin P0 teslimine eklenmez.

## P0 iş paketleri ve beklenen davranış

Aşağıdaki ID'ler PLAN/TEST takibi içindir; kodda mevcut fonksiyon adı değildir. Her paket IMPLEMENTATION_RULES.md görev kartıyla yürütülür.

| İş | Bağımlılık | Minimum davranış | Kabul testi |
|---|---|---|---|
| P0-01 Saat/veri | Ortam | 100 ms tick, seed, içerik ID doğrulama, para temsili | T-P0-01 |
| P0-02 Dünya/girdi | P0-01 | Tek oda, kameraya uygun hareket, touchcancel, UI sahipliği | T-P0-02 |
| P0-03 Transfer | P0-01/02 | Kaynak/taşıyıcı/hedef, kapasite, rezervasyon | T-P0-03 |
| P0-04 Satış | P0-03 | Tek müşteri, sepet, kasa, stok/para tek sonuç | T-P0-04 |
| P0-05 Üretim | P0-03 | İki tarif, girdi tüketimi, süre, dolu çıktıda bekleme | T-P0-05 |
| P0-06 Kayıt | P0-01; transferle beraber geliştirilir | Günlük/checkpoint/yedek/lifecycle | T-P0-06 |
| P0-07 Görevli | P0-03/05/06 | Tek raf işi, rota, devir ve kayıt | T-P0-07 |
| P0-08 Yerleşim | P0-02/03/07 | Geçerli taşıma, iptal, erişim, karşılaştırma | T-P0-08 |
| P0-09 Cihaz/oyuncu | Tüm akış | İki platform ve oyuncu denemesi | T-P0-09 |

Native kurulum P0-09'a ertelenmez; ilk günden paralel hazırlık işidir. Bu tablo paralel ajan çalıştırma talimatı değildir.

## Müşteri ve görevli için minimum durum taslağı — KARAR

Müşteri: Spawn → hedefe yürü → raftan ayır → kasaya yürü → kuyruk → satış → çıkış. Uygun stok yoksa görünür kayıp satış nedeni; kalıcı sıfır mesafeden alış yok. P0 tek davranış içerir; profil/ikame derinliği A2'dir. Yürüme hızları, spawn aralığı ve P0 sepet miktarı ana kaynakta P0 için kesinleşmemiştir; content/config kararı yapılır, denge kanıtı gibi sunulmaz.

Görevli: Uygun iş ara → kaynak/hedef ayır → kaynağa yürü → yük al → rafa yürü → bırak → rezervasyonu çöz. Rota kesilirse yük/rezervasyon güvenli tutulur ve yeniden planlanır; sınırsız retry/spawn yok. Aynı raf talebi her tick yeni bağımsız iş üretmez. Görev sahipliği, taşınan ürün ve hedef kayıt dönüşünde devam eder. Tam mola/vardiya ekleyerek P0 kapsamı büyütülmez.

## İlk ekranın somut bilgi ve eylemleri

HUD: kredi, taşınan SKU/adet/kapasite, tek öğretim hedefi, duraklat ve inşa. İstasyon: uyumlu eylem, girdi/çıktı miktarı, kalan üretim süresi veya bekleme nedeni. Dolap üzerinde “Prototip tedariki” görünür. Boş rafın nedeni ölçülmeden “daha fazla makine al” tavsiyesi verilmez. HUD seçili hedefi ve karakteri kapatıyorsa sahne/kamera uyarlanır.

P0-08 karşılaştırmasında aynı seed, talep, fiyat, stok, personel ve eşit aktif süre kullanılır. Mesafe, toplam yürüyüş ve talep varken boş raf süresi ayrı kaydedilir. Yalnız daha güzel görünen düzen iyileşme kanıtı değildir.
