# Orbit Market — proje bağlamı

Revision: 35 · Yetkili kaynak: .project/state.json

Bu görünüm türetilmiştir. Güncel kanıt kontrolü için context komutunu çalıştır.

Amaç: P0 kapsamında tek odada su ve domates üretiminden rafa, müşteriye ve kalıcı kayda uzanan oynanabilir çekirdek döngüyü teslim etmek.
Hedef kitle: Orbit Market oyununu geliştiren ekip

## Kapsam

- P0: sabit simülasyon saati ve doğrulanan içerik
- P0: dokunmatik tek oda, çeşme, şişeleme, domates yatağı, raf, kasa ve tek müşteri davranışı
- P0: transfer, satış, kayıt/yükleme ve tek raf görevlisine iş devri
- P0 kabulünde gerçek cihaz ve dış oyuncu doğrulaması

## Kapsam dışı

- A2 ve sonraki fazların ekonomisini veya içeriğini P0'a taşımak
- Gerçek para, reklam ve yayın entegrasyonu
- Ürün belgesinde tanımlı olmayan ekonomi, makine veya performans değerleri uydurmak

## Kısıtlar

- P0 kapsamı OYUN_GELISTIRME_DEVIR_DOSYASI.md §58.1 ile sınırlıdır.
- Simülasyon domain durumunun tek mantıksal kaynağıdır; 100 ms sabit tick kullanır.
- Teknik araç ve API'ler depodaki gerçek yapı doğrulanarak seçilir.
- Tasarım belgesi, uygulanmış özellik veya test kanıtı sayılmaz.

## Açık sorular

- P0 cihaz kabulü için Android ve iOS cihaz erişimi kimde ve ne zaman hazır olacak?
- Orbit Market yayın öncesi kesin ürün adı olarak kalacak mı?

## Nesneler ve ilişkiler

- constitution-p0 (source_doc): P0 kapsamı ve çekirdek ekonomi
- mvp-guide-p0 (source_doc): P0 iş paketleri ve kabul sırası
- content-catalog-p0 (source_doc): P0 içerik kimlikleri ve tarifler
- world-map-p0 (source_doc): P0 başlangıç yerleşimi
- p0-core (milestone): P0 — çekirdek kanıt
- p0-time-content (capability): Sabit simülasyon saati ve içerik doğrulama
- p0-world-input (capability): Tek oda ve dokunmatik kontrol
- p0-transfer (capability): Rezervasyonlu fiziksel transfer
- p0-sales (capability): Müşteri ve tekil satış işlemi
- p0-production (capability): Su şişeleme ve domates hasadı
- p0-save (capability): Kesintiye dayanıklı yerel kayıt
- p0-worker (capability): Tek raf görevlisine iş devri
- p0-placement (capability): Güvenli yerleşim ve erişim
- p0-device-acceptance (capability): Gerçek cihaz ve dış oyuncu kabulü
- p0-time-content → Kaynağa dayanır → constitution-p0
- p0-time-content → Kaynağa dayanır → mvp-guide-p0
- p0-time-content → Kaynağa dayanır → content-catalog-p0
- p0-world-input → Kaynağa dayanır → constitution-p0
- p0-world-input → Kaynağa dayanır → mvp-guide-p0
- p0-world-input → Kaynağa dayanır → world-map-p0
- p0-transfer → Kaynağa dayanır → constitution-p0
- p0-transfer → Kaynağa dayanır → mvp-guide-p0
- p0-sales → Kaynağa dayanır → constitution-p0
- p0-production → Kaynağa dayanır → constitution-p0
- p0-production → Kaynağa dayanır → content-catalog-p0
- p0-production → Kaynağa dayanır → mvp-guide-p0
- p0-save → Kaynağa dayanır → constitution-p0
- p0-worker → Kaynağa dayanır → constitution-p0
- p0-placement → Kaynağa dayanır → world-map-p0
- p0-placement → Kaynağa dayanır → mvp-guide-p0
- p0-device-acceptance → Kaynağa dayanır → constitution-p0
- p0-device-acceptance → Kaynağa dayanır → mvp-guide-p0
- p0-time-content → Faz hedefinin parçasıdır → p0-core
- p0-world-input → Faz hedefinin parçasıdır → p0-core
- p0-transfer → Faz hedefinin parçasıdır → p0-core
- p0-sales → Faz hedefinin parçasıdır → p0-core
- p0-production → Faz hedefinin parçasıdır → p0-core
- p0-save → Faz hedefinin parçasıdır → p0-core
- p0-worker → Faz hedefinin parçasıdır → p0-core
- p0-placement → Faz hedefinin parçasıdır → p0-core
- p0-device-acceptance → Faz hedefinin parçasıdır → p0-core

### Somut nesne değerleri

- constitution-p0: {"file": "OYUN_GELISTIRME_DEVIR_DOSYASI.md", "scope_note": "P0 ürün kapsamı, ilk döngü, sabit tick ve teknik/görsel sınırlar.", "section": "§26, §58.1, §60–63"}
- mvp-guide-p0: {"file": "MVP_IMPLEMENTATION_GUIDE.md", "scope_note": "P0 uygulama adımları ve beklenen davranışlar; henüz uygulanmış oldukları anlamına gelmez.", "section": "P0 sahnesi, P0-01…P0-09"}
- content-catalog-p0: {"file": "OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md", "scope_note": "Kaynak, üç su SKU'su, taze domates, istasyon ve açılış sarfları.", "section": "§2, §7, §26 ile eşlenen içerik"}
- world-map-p0: {"file": "DUNYA_YERLESIM_PLANI.md", "scope_note": "P0 nesnelerinin varsayılan hücre, footprint, kapı, port ve servis yerleri.", "section": "§13.1"}
- p0-core: {"outcome": "Telefonda 3–8 dakikalık su/domates üretim ve satış döngüsü; işi devretme, kayıt/yükleme ve görünür yerleşim etkisi.", "phase": "P0", "status": "planned"}
- p0-time-content: {"behavior": "100 ms sabit tick, seed'li rastgelelik, para temsili ve kararlı içerik kimlikleriyle geçerli tarif/içerik denetimi.", "phase": "P0", "status": "planned"}
- p0-world-input: {"behavior": "Paftadaki 6×6 satış odası ve bahçe kaynağında UI pointer sahipliği korunarak karaktere dokun-git veya joystick hareketi.", "phase": "P0", "status": "planned"}
- p0-transfer: {"behavior": "Oyuncu veya görevli ürünü gerçek kaynak konumundan kapasitesi uygun hedefe taşır; iptal ve yinelenen komut stok çoğaltmaz.", "phase": "P0", "status": "planned"}
- p0-sales: {"behavior": "Tek müşteri davranışı raftaki gerçek stoğu alır, kasada bir kez satış/ledger sonucu üretir ve kuyruk durumunu korur.", "phase": "P0", "status": "planned"}
- p0-production: {"behavior": "Çeşme suyu, ambalaj ve tohum lotları tarif/kapasite kurallarıyla üç su ürünü ve taze domatese dönüşür; bekleme nedeni görünürdür.", "phase": "P0", "status": "planned"}
- p0-save: {"behavior": "Snapshot ve kritik işlem günlüğüyle kayıt/yükleme ekonomik işlemi bir kez korur; pause/background simülasyonu ilerletmez.", "phase": "P0", "status": "planned"}
- p0-worker: {"behavior": "Bir raf ikmal görevi gerçek yük/rota/rezervasyonla tamamlanır; kesinti veya yeniden yüklemede yük kaybolmaz.", "phase": "P0", "status": "planned"}
- p0-placement: {"behavior": "Nesne yerleştirme önizlemesi footprint, servis hücresi, kapı, kasa ve taşıma yolunu denetler; iptal state değiştirmez.", "phase": "P0", "status": "planned"}
- p0-device-acceptance: {"behavior": "Android/iOS cihaz kayıt ve dokunma döngüsü ile dış oyuncunun yardımsız çekirdek döngüyü tamamlaması gerçek kanıtla doğrulanır.", "phase": "P0", "status": "planned"}

Türler ve bağlantı kuralları: `ontology` komutu / `ONTOLOJİ.md`.

## Kararlar


## Görevler

- P0-01 [done] Sabit simülasyon saati, seed ve içerik doğrulayıcı temelini kur (kayıt: done)
  - Ölçüt: Simülasyon 100 ms sabit tick ile işler; render sıklığı ekonomik sonucu değiştirmez.
  - Ölçüt: Seed'li RNG ve kararlı içerik ID doğrulaması vardır; eksik veya geçersiz tarif girdisi sessizce kabul edilmez.
  - Ölçüt: Kredi temsili sabit hassasiyetlidir ve para/stok yalnız Application/domain komutlarıyla değişir.
  - Ölçüt: Gerçek package.json ve kilit dosyasına göre uygun hedefli kontrol çalıştırılır; komut ve sonuç kaydedilir.
  - İlgili nesneler: p0-time-content, constitution-p0, mvp-guide-p0, content-catalog-p0
  - Girdiler: constitution-p0, mvp-guide-p0, content-catalog-p0
  - Ürettiği nesneler: p0-time-content
  - Etkin önkoşullar: yok
  - Kabul güncelliği: güncel · tamamlanma sayısı: 4
- P0-02 [review] Tek oda dünyasını, dokunmatik hareketi ve pointer sahipliğini kur (kayıt: review)
  - Ölçüt: P0 sahnesi paftadaki tek satış odası, bahçe kaynağı ve geçerli başlangıç footprint'lerini kullanır.
  - Ölçüt: Klavyesiz dokunmatik hareket çalışır; UI üzerinde başlayan pointer dünya komutuna dönüşmez.
  - Ölçüt: Kamera portre ekranda oyuncu ve seçili P0 hedefini HUD altında bırakmaz.
  - İlgili nesneler: p0-world-input, constitution-p0, mvp-guide-p0, world-map-p0
  - Girdiler: constitution-p0, mvp-guide-p0, world-map-p0
  - Ürettiği nesneler: p0-world-input
  - Etkin önkoşullar: P0-01
  - Kabul güncelliği: yeniden inceleme gerekli · tamamlanma sayısı: 2
  - Yeniden inceleme: dependency task P0-01 changed
- P0-03 [blocked] Kapasite ve rezervasyon korumalı ürün transferini kur (kayıt: review)
  - Ölçüt: Kaynak, taşıyıcı ve hedef konumları ile kapasite/rezervasyon doğrulanır.
  - Ölçüt: İptal veya yinelenen komut ürün çoğaltmaz, silmez ya da kayıtsız konuma bırakmaz.
  - Ölçüt: Taşıma sonucu tek domain işlemiyle korunur.
  - İlgili nesneler: p0-transfer, constitution-p0, p0-time-content, p0-world-input
  - Girdiler: constitution-p0, p0-time-content, p0-world-input
  - Ürettiği nesneler: p0-transfer
  - Etkin önkoşullar: P0-01, P0-02
  - Üretici bağı: p0-time-content ← P0-01
  - Üretici bağı: p0-world-input ← P0-02
  - Kabul güncelliği: yeniden inceleme gerekli · tamamlanma sayısı: 3
  - Yeniden inceleme: dependency task P0-01 changed
  - Kontrol: dependency P0-02: review
- P0-04 [blocked] Tek müşteri, raf, kuyruk ve satış ledger akışını kur (kayıt: review)
  - Ölçüt: Satışta gerçek raf stoku ve kayıtlı fiyat kullanılır; ürün ve bakiye tek işlem sonucunda güncellenir.
  - Ölçüt: Aynı transaction yeniden işlendiğinde ikinci satış veya bakiye etkisi oluşmaz.
  - Ölçüt: Boş raf, fiyat/bütçe reddi ve kuyruk sonucu gerçek nedenleriyle ayrılır.
  - İlgili nesneler: p0-sales, constitution-p0, content-catalog-p0, p0-transfer
  - Girdiler: constitution-p0, content-catalog-p0, p0-transfer
  - Ürettiği nesneler: p0-sales
  - Etkin önkoşullar: P0-03
  - Üretici bağı: p0-transfer ← P0-03
  - Kabul güncelliği: yeniden inceleme gerekli · tamamlanma sayısı: 1
  - Yeniden inceleme: dependency task P0-03 changed
  - Kontrol: dependency P0-03: blocked
- P0-05 [blocked] Üç su tarifini ve domates hasadını gerçek girdiyle çalıştır (kayıt: todo)
  - Ölçüt: Küçük şişe, 5 L bidon ve 19 L damacana tarifleri ham su ve ilgili ambalaj lotunu tüketir.
  - Ölçüt: Domates hasadı katalogdaki su/tohum girdilerini kullanır; çıktı doluysa girdi/ürün kaybolmaz.
  - Ölçüt: Üretim süresi, enerji ve bekleme nedeni gerçek domain durumundan gösterilir.
  - İlgili nesneler: p0-production, constitution-p0, mvp-guide-p0, content-catalog-p0, p0-transfer
  - Girdiler: constitution-p0, mvp-guide-p0, content-catalog-p0, p0-transfer
  - Ürettiği nesneler: p0-production
  - Etkin önkoşullar: P0-03
  - Üretici bağı: p0-transfer ← P0-03
  - Kabul güncelliği: henüz doğrulanmadı · tamamlanma sayısı: 0
  - Kontrol: dependency P0-03: blocked
- P0-06 [todo] Snapshot, kritik işlem günlüğü ve lifecycle dönüşünü kur (kayıt: todo)
  - Ölçüt: Kritik satış/üretim/transfer sonucu durable kayıtla bir kez uygulanır.
  - Ölçüt: Yarım yazım veya bozuk kayıt sessizce sıfırlanmaz; görünür kurtarma yolu bulunur.
  - Ölçüt: Background süresinde simülasyon ilerlemez; dönüşte çift tick veya çift işlem oluşmaz.
  - İlgili nesneler: p0-save, constitution-p0, mvp-guide-p0, p0-time-content
  - Girdiler: constitution-p0, mvp-guide-p0, p0-time-content
  - Ürettiği nesneler: p0-save
  - Etkin önkoşullar: P0-01
  - Üretici bağı: p0-time-content ← P0-01
  - Kabul güncelliği: henüz doğrulanmadı · tamamlanma sayısı: 0
- P0-07 [blocked] Tek raf görevlisinin ikmal işini güvenli devretmesini sağla (kayıt: todo)
  - Ölçüt: Görevli tek gerçek raf ikmal işini kaynak/hedef rezervasyonuyla tamamlar.
  - Ölçüt: Rota kesintisi veya kayıt dönüşünde yük ve rezervasyon korunur ya da güvenle çözülür.
  - Ölçüt: Görevli mesh/animasyonu para veya stok değiştirmez.
  - İlgili nesneler: p0-worker, constitution-p0, p0-transfer, p0-production, p0-save
  - Girdiler: constitution-p0, p0-transfer, p0-production, p0-save
  - Ürettiği nesneler: p0-worker
  - Etkin önkoşullar: P0-03, P0-05, P0-06
  - Üretici bağı: p0-production ← P0-05
  - Üretici bağı: p0-save ← P0-06
  - Üretici bağı: p0-transfer ← P0-03
  - Kabul güncelliği: henüz doğrulanmadı · tamamlanma sayısı: 0
  - Kontrol: dependency P0-03: blocked
  - Kontrol: dependency P0-05: blocked
  - Kontrol: dependency P0-06: todo
- P0-08 [blocked] İnşa ve yerleşimde servis, kapı ve temel üretim erişimini koru (kayıt: todo)
  - Ölçüt: Geçersiz footprint, kapı, servis hücresi veya rota yerleşimi reddedilir ve neden gösterilir.
  - Ölçüt: İnşa sırasında simülasyon durur; iptal para, stok veya yerleşimi değiştirmez.
  - Ölçüt: İnşa onayı son temel su/domates satış yolunu erişimsiz bırakmaz.
  - İlgili nesneler: p0-placement, mvp-guide-p0, world-map-p0, p0-transfer, p0-worker
  - Girdiler: mvp-guide-p0, world-map-p0, p0-transfer, p0-worker
  - Ürettiği nesneler: p0-placement
  - Etkin önkoşullar: P0-02, P0-03, P0-07
  - Üretici bağı: p0-transfer ← P0-03
  - Üretici bağı: p0-worker ← P0-07
  - Kabul güncelliği: henüz doğrulanmadı · tamamlanma sayısı: 0
  - Kontrol: dependency P0-02: review
  - Kontrol: dependency P0-03: blocked
  - Kontrol: dependency P0-07: blocked
- P0-09 [blocked] P0 döngüsünü gerçek cihazda ve dış oyuncuyla kabul et (kayıt: todo)
  - Ölçüt: Android ve iOS cihaz build/yaşam döngüsü sonuçları ayrı kaydedilir; bir platform diğerinin kanıtı sayılmaz.
  - Ölçüt: Dış oyuncu yardımsız taşıma/üretim/raf/satış döngüsünü tamamlar ve nedenleri doğru açıklar.
  - Ölçüt: P0 kabul raporu gerçek build, cihaz, komut, seed ve gözlenen sonuçla saklanır.
  - İlgili nesneler: p0-device-acceptance, constitution-p0, mvp-guide-p0, p0-world-input, p0-transfer, p0-sales, p0-production, p0-save, p0-worker, p0-placement
  - Girdiler: constitution-p0, mvp-guide-p0, p0-world-input, p0-transfer, p0-sales, p0-production, p0-save, p0-worker, p0-placement
  - Ürettiği nesneler: p0-device-acceptance
  - Etkin önkoşullar: P0-04, P0-05, P0-06, P0-07, P0-08, P0-03, P0-02
  - Üretici bağı: p0-placement ← P0-08
  - Üretici bağı: p0-production ← P0-05
  - Üretici bağı: p0-sales ← P0-04
  - Üretici bağı: p0-save ← P0-06
  - Üretici bağı: p0-transfer ← P0-03
  - Üretici bağı: p0-worker ← P0-07
  - Üretici bağı: p0-world-input ← P0-02
  - Kabul güncelliği: henüz doğrulanmadı · tamamlanma sayısı: 0
  - Kontrol: dependency P0-04: blocked
  - Kontrol: dependency P0-05: blocked
  - Kontrol: dependency P0-06: todo
  - Kontrol: dependency P0-07: blocked
  - Kontrol: dependency P0-08: blocked
  - Kontrol: dependency P0-03: blocked
  - Kontrol: dependency P0-02: review

## Çalışılabilir görevler

P0-02, P0-06

## Uyarılar

- Yok.

## Onarım işlemleri

Bunlar öneridir; gerekçeyi değerlendir, actor ekle ve güncel revision ile uygula.
- Yok.

Kanıt hash'i dosya sürümünü denetler; kalite veya insan kabulünü ispatlamaz.
