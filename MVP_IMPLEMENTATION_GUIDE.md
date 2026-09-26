# P0 uygulama rehberi

Kaynak: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) hızlı özet, §58 ve §63. P0, tam oyunun ilk bölümü veya dengelenmiş ekonomi değildir. Uygulama henüz tamamlanmadı; bu belge yalnız sıralı iş tarifidir.

## P0 sahnesi ve başlangıç

Tek oda, grid, karakter, bahçe su kaynağı, şişeleme tezgâhı, domates yatağı, raf, kasa, tek müşteri davranışı ve tek raf görevlisi. Dört ilk satılabilir ürün üç su boyutu ile taze domatestir ([ana kaynak §26](OYUN_GELISTIRME_DEVIR_DOSYASI.md)). Ham su şişeleme ve sulamada aynı stoktan tüketilir. Başlangıç 100 kredi nakit, 50 ham su, 12/4/2 ambalaj ve 8 tohumdur; kaynak seviye 1'de 0,5 birim/aktif saniye üretir. Ambalaj açık maliyetli sarftır; ücretsiz sonsuz girdi değildir. Bunlar başlangıç denge değerleridir, oyuncu testiyle doğrulanmış sonuçlar değildir. P0 kayıtları geliştirme verisidir; yayın kayıt uyumluluğu vaat edilmez.

## Yedi çalışma günü önerisi

| Sıra | İş | Görülebilir kanıt |
|---|---|---|
| 1 | Ortam, kamera, grid, dokunmatik hareket, raf yerleştirme; iki native proje hedefi | Telefona uygun sahne ve hareket |
| 2 | Taşıma, kapasite, atomik transfer, rezervasyon | Ürün kaybolmadan al/bırak |
| 3 | Tek müşteri, raf, kasa, ledger | İlk satış ve doğru para/stok |
| 4 | Su kaynağı/şişeleme/domates ve tıkanma | Girdiden satılan su ve domatese tam zincir |
| 5 | Tek raf görevlisi, checkpoint/günlük, lifecycle | Görev devri ve kayıt sonrası devam |
| 6 | İki yerleşim karşılaştırması, hedefli test ve cihaz build | Yürüyüş/boş raf farkı ve cihaz raporu |
| 7 | En az beş dış oyuncu denemesi, hata düzeltme | Devam/düzelt/durdur kararı |

Bu zaman kutusudur; teslim tarihi garantisi değildir. Kayıt işlemlerinin temeli transfer/satışla birlikte kurulur; beşinci gün ilk kez veri güvenliği düşünülmez. Gerçek Android ve iOS build'leri ilk hafta hedefidir; araç/cihaz yokluğu açık engeldir.

## Kısa oturum öğretimi

İlk 60 sn hareket/taşıma, 1–3 dk ilk satış, 3–5 dk kendi üretimi; sonraki oturumda raf düzeni ve çalışan. A2'de sonraki oturum depo/tedariktir. Metin atlanabilir 1–2 cümlelik ipucudur; TutorialState kaydedilir. Tek oturumda zorunlu 20 dakikalık öğretim yoktur. P0 ilk müşteri öğretim tetikleyicisidir; sonrasında seed'li geliş ve kuyruk sabrı [KARARLAR.md](KARARLAR.md) D-019'a uyar.

## P0 kabul sırası

1. Klavyesiz hareket → kaynak suyu alma → şişeleme veya sulama → raf → müşteri → kasa.
2. Yinelenen işlem/eksik girdi/dolu çıktı durumlarında stok ve para korunur.
3. Raf görevlisi işi devralır; erişilemeyen hedef açık nedeni gösterir.
4. İnşa duraklar; geçerli erişim ve maliyet onaylanır; iptal kaynak tüketmez.
5. Arka plan, zorla sonlandırma, bozuk kayıt ve context-loss sonrası güvenli devam/hata ekranı.
6. İki yerleşim aynı koşullarda yürüyüş ve boş raf süreleriyle karşılaştırılır.
7. Cihaz/oyuncu kanıtları [TEST_STRATEGY.md](TEST_STRATEGY.md) ve [PLAN.md](PLAN.md) eşiklerini karşılar.

## A2'ye geçiş

P0 kabulünden sonra mandıra, kümes, ilk işlenmiş gıda ve sıcak içecek hatları açılır. Kesin başlangıç kredi/stok ve aile erişimi [ana kaynak §26/§46](OYUN_GELISTIRME_DEVIR_DOSYASI.md) ile yeni ekonomi doğrulamasından gelir. Eski besin küpü, yosun yetiştirici ve paketleyici başlangıcı kullanılmaz.

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

Müşteri: Spawn → hedefe yürü → raftan ayır → kasaya yürü → kuyruk → satış → çıkış. Uygun stok yoksa görünür kayıp satış nedeni; kalıcı sıfır mesafeden alış yok. P0 tek davranış içerir; profil/ikame derinliği A2'dir. İlk öğretim gelişi ve sonraki ortalama geliş/sabır kararı D-019'dadır; yürüme hızı ve P0 sepet adedi hâlâ content/config kararıdır, denge kanıtı gibi sunulmaz.

Görevli: Uygun iş ara → kaynak/hedef ayır → kaynağa yürü → yük al → rafa yürü → bırak → rezervasyonu çöz. Rota kesilirse yük/rezervasyon güvenli tutulur ve yeniden planlanır; sınırsız retry/spawn yok. Aynı raf talebi her tick yeni bağımsız iş üretmez. Görev sahipliği, taşınan ürün ve hedef kayıt dönüşünde devam eder. Tam mola/vardiya ekleyerek P0 kapsamı büyütülmez.

## İlk ekranın somut bilgi ve eylemleri

HUD: kredi, taşınan SKU/adet/kapasite, tek öğretim hedefi, duraklat ve inşa. İstasyon: uyumlu eylem, girdi/çıktı miktarı, kalan üretim süresi veya bekleme nedeni. Dolap üzerinde “Prototip tedariki” görünür. Boş rafın nedeni ölçülmeden “daha fazla makine al” tavsiyesi verilmez. HUD seçili hedefi ve karakteri kapatıyorsa sahne/kamera uyarlanır.

P0-08 karşılaştırmasında aynı seed, talep, fiyat, stok, personel ve eşit aktif süre kullanılır. Mesafe, toplam yürüyüş ve talep varken boş raf süresi ayrı kaydedilir. Yalnız daha güzel görünen düzen iyileşme kanıtı değildir.
