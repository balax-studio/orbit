# Orbit Market — sıfırdan mağaza yayınına uygulama planı

Sürüm: 2.0 · ilk taslak 26 Eylül 2026, belge gözden geçirmesi 27 Eylül 2026. Ana kaynak: [OYUN_GELISTIRME_DEVIR_DOSYASI.md](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §58, §60–63 ve ilgili sistem bölümleri. Bu dosya mevcut PLAN.md'nin genişletilmiş halidir; ikinci bağımsız yol haritası değildir.

**Mevcut durum:** Tasarım/yan belgeler yazıldı; depoda başlangıç iskeleti bulunduğu önceki incelemede kaydedildi. Bu kayıt çalışan oyun, geçmiş test, cihaz build'i veya mağaza yayını kabulü değildir. İlk uygulama hedefi P0'dır. “Sıfırdan” mevcut dosyaları silme talimatı değildir; geliştirme öncesi gerçek durum yeniden doğrulanır. Bu plan aşağıdaki işleri yürütmez.

## 1. Planın kullanımı ve tamamlanma kuralı

Ana fazlar anayasadaki **P0 → A2 → A3 → A4 → A5** sırasını korur. Hazırlık bunların önündedir; A5 alt adımları mağaza başvurusu, inceleme ve gerçek yayına kadar uzatılmıştır. Eski A0/A1 işleri P0 içindedir. Oyun bölümü 1–6, geliştirme fazı değildir. Aşağıdaki alt fazlar iş planıdır, yeni oyun kapsamı eklemez.

Her işte kaynak bölüm → görev kartı → gerçek dosya/değişiklik → test → kanıt bağlantısı kurulur. [IMPLEMENTATION_RULES.md](IMPLEMENTATION_RULES.md) esas alınır. Durumlar: **bekliyor / sürüyor / engelli / uygulandı / doğrulandı**. Kutular yalnız ilgili teslim ve kanıt tamamlanınca işaretlenir. Belgelendi, kodlandı, test geçti, cihazda doğrulandı ve mağazada yayınlandı farklı durumlardır.

Takvim ekip kapasitesi, araç/hesap erişimi ve P0 ölçümünden sonra tahmin edilir. Yedi çalışma günü önerisi P0 için zaman kutusudur; bütün oyun veya mağaza incelemesi için süre garantisi değildir. Yeni özellik eklemek yerine önce fazın kabul sorunları çözülür. Eksik bir platformun işi açık kalır; bağımsız işler ilerleyebilir.

## 2. Uçtan uca faz haritası

| Alt faz | Amaç | Ana teslim | Başlama bağımlılığı |
|---|---|---|---|
| H0 | Kaynak, kapsam ve açık kararlar | Onaylı kapsam/karar listesi | Mevcut belgeler |
| H1 | Araç, hesap ve proje hazırlığı | Doğrulanmış geliştirme ortamı | H0 |
| P0.1 | İskelet, domain, zaman ve native kabuk | Açılan sahne + iki platform proje hedefi | H1 |
| P0.2 | Dokunma, transfer, üretim, satış | İlk oynanabilir döngü | P0.1 |
| P0.3 | Kayıt, görevli ve yerleşim | Kesintiye dayanıklı prototip | P0.2; kayıt temeli P0.1'de |
| P0.4 | Cihaz ve oyuncu doğrulaması | Devam/düzelt/durdur raporu | P0.1–3 |
| A2.1 | Gerçek ekonomi ve tedarik | İlk işlenmiş gıda, kümes/mandıra ve sıcak içecek hatlarıyla dikey dilim | P0 kabulü |
| A2.2 | Mola, müşteri, öğretim ve teşhis | 20–30 dk toplam oynanış | A2.1 |
| A2.3 | İki platform dilim kabulü | Cihaz/parite raporu | A2.1–2 |
| A3.1 | Depo, kalite, güç ve bakım | Derin işletme sistemleri | A2 kabulü |
| A3.2 | Personel, araştırma ve yetenek | Dokuz düğümlü ilerleme | A3.1 ile ilgili bağımlılıklar |
| A3.3 | Kontrat, olay ve kurtarma | Üç işletme yolunun kanıtı | A3.1–2 |
| A4.1 | Tam içerik ve yetenek tasarımı | Eksiksiz katalog | A3 kabulü |
| A4.2 | Kriz, üç final ve serbest oyun | Baştan finale build | A4.1 |
| A4.3 | Son sanat, ses ve diller | Yayın içeriği | Kararlı oyun ekranları |
| A4.4 | Kozmetik ödeme/reklam sandbox | İki platform hak doğrulaması | A3 kabulü + sağlayıcı kararları |
| A4.5 | Uçtan uca beta | Test kanalı raporu | A4.1–4 |
| A5.1 | Denge, performans, kayıt ve erişilebilirlik | Yayın adayı | A4 kabulü |
| A5.2 | Hesap, mağaza ve gizlilik hazırlığı | İncelemeye hazır mağaza kayıtları | Hesaplar + son veri akışı |
| A5.3 | İmzalı paket ve son kontrol | Sürümü sabitlenmiş yayın paketi | A5.1–2 |
| A5.4 | Yetki, yükleme ve inceleme | İki mağazada ayrı inceleme sonucu | A5.3 + gerekli yayın yetkisi |
| A5.5 | Yayına açma ve doğrulama | İndirilebilir Android/iOS sürümleri | Mağaza onayı + yayın kararı |
| Y1 | Yayın sonrası ilk takip ve düzeltme | İlk sürüm operasyon devri | A5.5 |

Hesap/cihaz hazırlığı ve isim/lisans araştırması erken başlatılabilir; native kurulum son faza bırakılmaz. Tablo paralel ajan çalıştırma talimatı değildir.

## 3. H0 — kapsam, kaynak ve açık kararlar

Uygulama kararı olarak sabitlenen 100 ek soru [KARARLAR.md](KARARLAR.md) D-007–D-016'da ve ilgili sistem rehberlerinde izlenir. Teknik başlangıç sayıları, kaynakta sabit olmayan performans varsayımları ve oyuncu deneyimi ilkeleri P0 cihaz/oyuncu kanıtıyla doğrulanır; karar kaydı kod kabulü sayılmaz.

A–E görsel/etkileşim/geri bildirim/matematik/veri sorularının yanıtı D-017–D-020'dedir. P0 somut tipleri [DOMAIN_MODEL.md](DOMAIN_MODEL.md) içindedir; yeni schemaVersion/contentVersion değişiklikleri kayıt göçü ve aynı seed'li kabul testi ister.

Derin mimari soruların runtime indeks, para, tick, WebGL, kayıt, ses ve kod kapısı kararları D-021–D-026'dadır. P0 kurulumu gerçek `package-lock.json` ile npm akışını izler; teknik kararların uygulanması ve CI kanıtı ilgili kod fazında yapılır.

- [x] Yan belgeler, uygulama sözleşmeleri ve ayrı içerik kataloğu hazırlandı; bu kod kabulü değildir.
- [ ] Kullanılacak belge sürümlerini ve gerçek depo durumunu karşılaştır; önceki tamamlandı iddialarını kanıtla.
- [ ] Mobil hedefi, dikey dokunma, Three.js/TypeScript/Vite/Capacitor ve ilk DOM/CSS UI sözleşmesini sabitle.
- [ ] Mevcut React/R3F/Zustand iskeletinin hedefe uyum yolunu incele; gerekçesiz yeniden yazım veya yeni framework ekleme.
- [ ] P0 kapsamını tek oda, su kaynağı/şişeleme/domates yatağı, üç su ürünü, taze domates ve tek görevli olarak kilitle; tam oyun backlog'unu ayrı tut.
- [ ] [Dünya paftası §13](DUNYA_YERLESIM_PLANI.md) ve [içerik kataloğu §7](OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md) kararlarını gerçek P0 içerik/rota verisine aktar; A2/A3/A4 parselleri, kaynakları ve ritmini kendi fazında cihaz/oyuncu ölçümüyle doğrula. Belge kararı kod kabulü değildir.
- [ ] İçerik kataloğundaki açık tanımları fazlara ata: 21 ileri yetenek, personel üretimi, bonus birleşimi, oda taban skorları ve sağlayıcı doğrulaması.
- [ ] Ekip/kapasite, asset bütçesi, cihaz erişimi, hedef yaş grubu ve yayın sorumlusunu kaydet; bilinmeyeni olmuş gibi işaretleme.

**Teslim:** Kaynak ve karar listesi, öncelikli P0 görev kartları. **Çıkış:** P0'ya engel açık kararlar çözülmüş veya bağımlı iş açıkça ayrılmış; sonraki faz belirsizlikleri prototipi durdurmuyor.

## 4. H1 — geliştirme ortamı, proje ve hesap hazırlığı

- [ ] Node/paket yöneticisi, TypeScript/Vite/Three.js/Capacitor sürüm uyumunu doğrula; kilit dosyası ve gerçek çalıştırma komutlarını belirle.
- [ ] Domain/Application/Infrastructure/Presentation/Content/App sınırlarını kur; içerik ve kayıt ID kurallarını tanımla.
- [ ] Git çalışma düzeni, secret dışlama, hedefli test komutu, build/lint/typecheck ve hata raporlama yolunu hazırla.
- [ ] Android Studio/SDK/JDK ve gerçek Android cihaz erişimini doğrula.
- [ ] macOS/Xcode, iPhone ve imzalama erişimini doğrula; eksikse iOS engelini açık tut.
- [ ] App ID/bundle ID ve uygulama adının kararını kaydet; çalışma adı ile yayın marka kararını ayır.
- [ ] App Store Connect/Play Console hesap sahipliği, erişim rolleri ve gereken hesap doğrulamalarının durumunu kaydet.
- [ ] Hesap ücreti, dış hizmet bütçesi veya sözleşme gerektiren işlemleri yetkili kullanıcı kararı olarak ayır; kimlik/banka/signing bilgilerini depoya koyma.
- [ ] Gelecekteki build için `docs/decisions`, `docs/balance`, `docs/playtests` kayıt düzenini ve lisans envanterini hazırla.

**Teslim:** Tekrarlanabilir geliştirme kurulumu ve platform engel listesi. **Çıkış:** Web geliştirme çalışıyor, native build yolu somut; hesap eksiği platform kabulüne yanlış başarı yazılmasına yol açmıyor.

## 5. P0 — çekirdek oynanış kanıtı

### P0.1 — iskelet, veri, saat ve kabuk

- [ ] [Dünya yerleşim paftasındaki](DUNYA_YERLESIM_PLANI.md) `R3-C0` 6×6 oda, batı bahçe, iki hücrelik bağlantı ve kamera dünya kaydırmasını tek koordinat sistemiyle kur; gelecekteki odaları erken açma.
- [ ] §66/[ekran kataloğu](EKRAN_VE_MENU_AKISI.md): dünya üstü açılış/devam, HUD yerleşimi, menü/ayarlar/kayıt akışı ve yalnız P0 içerikli Oyun Ansiklopedisi (su/domates, makineler, erişilebilir üretim şemaları).
- [ ] Saf domain, sabit 10 Hz saat, seed'li RNG, tek ledger, sabit hassasiyet ve komut/transaction kimliği.
- [ ] Minimum içerik doğrulayıcı; `item.raw_water` ile üç şişelenmiş su SKU'su ayrı ID; kaynak/şişeleme/domates tarif ve kapasite verisi.
- [ ] Three.js WebGL2 sahnesi, grid, portre kamera, placeholder karakter ve Neo-Brutalist HUD.
- [ ] Yerel asset yolları, safe-area, WebGL2 hata ekranı; render ve simülasyon ayrımı.
- [ ] Capacitor yapılandırması ve ilk gün Android/iOS native proje üretimi hedefi; ilk hafta iki gerçek cihaz build'i hedefi.
- [ ] Save portu ve günlük/checkpoint tasarımını baştan kur; yalnız kapanış callback'ine güvenme.

### P0.2 — ilk üretim ve satış

- [ ] Joystick/dokun-git, pointer sahipliği, touchcancel ve kamera jestleri.
- [ ] Kaynak → taşıyıcı → makine → çıktı → raf transferleri; kaynak/hedef kapasite rezervasyonu.
- [ ] Bahçe su kaynağı; şişeleme tezgâhında üç su boyutu ve domates yatağında sulama/hasat zinciri.
- [ ] Eksik girdi/dolu çıktı/erişimsiz hedef için görünür gerekçe; sessiz ürün kaybı yok.
- [ ] §67 ilk boş su rafında Domain nedenini → tek uygulanabilir müdahaleyi → gerçek ürün/satış sonucunu aynı kimliklerle göster; ansiklopedi bağlantısı salt okunur olsun. Birden çok engelde en yakın giderilebilir nedeni seç, kalanları detayda tut.
- [ ] Tek müşteri davranışı, sepet, kasa ve atomik satış; tekrarlanan çağrı ikinci para üretmez.
- [ ] İlk 60 sn hareket/taşıma, 1–3 dk satış, 3–5 dk kendi üretimi hedefleyen kısa ipuçları.

### P0.3 — kayıt, görevli ve düzenleme

- [ ] 30 aktif saniyelik checkpoint, append-only günlük, checksum/sequence, tek yazıcı, yedek ve kurtarma ekranı.
- [ ] Platform/UI duraklatma nedenlerini birleştir; arka planda saat/render durur, güvenli kullanıcı devamı gerekir.
- [ ] Tek raf görevlisinin rezervasyon, rota, yük, bırakma ve devir akışı; tam yorgunluk sistemi yok.
- [ ] İnşa duraklatması, grid/döndürme, footprint/servis/giriş erişimi, maliyet önizleme, onay/iptal.
- [ ] İki yerleşimi aynı koşullarda yürüyüş ve talep varken boş raf süresiyle karşılaştır.

### P0.4 — prototip kabulü

- [ ] T-P0-01…09 ve ilgili hata fixture'larını çalıştır; kayıt kesintisi/double transaction hatalarını kapat.
- [ ] 20 arka plan/dönüş ve farklı işlem noktalarında sonlandırma; offline açılış, context-loss, UI-raycast yalıtımı.
- [ ] Android ve iPhone'da 3–8 dk klavyesiz döngü; P0 cihazda en az 10 dk test.
- [ ] En az beş dış oyuncu: ≥4/5 ilk satışı yardımsız 5 dk içinde; ≥3/5 düzen iyileştirmesinin nedenini açıklayabilmeli.
- [ ] Beş oyuncuda boş su rafı nedenini anlama, doğru müdahale seçme ve sonucu açıklama sürelerini ayrı kaydet; 10 saniyeyi deneme hedefi olarak kullan, ölçülmüş eşik diye sunma.
- [ ] Aynı kritik stok/para hatası iki oyuncuda tekrarlanırsa düzelt; yeni özellik ekleyerek sonucu örtme.

**Teslim:** Oynanabilir P0, çalıştırma/build talimatı, cihaz raporu ve devam/düzelt/durdur kararı. **Çıkış:** İlk satış, devir, kesintiden doğru dönüş ve ölçülebilir yerleşim etkisi kanıtlı.

**Kapsam dışı:** Tier 2–4 işlenmiş ürünler, RPG, tam odalar/mola, dış alım, bakım, kontrat, olay/hikâye/final ve gerçek reklam/ödeme. P0 kayıtları geliştirme verisidir; yayın uyumluluğu vaat edilmez.

**Yedi çalışma günü önerisi:** 1 ortam/sahne/girdi; 2 transfer; 3 satış; 4 üretim; 5 görevli/kayıt entegrasyonu; 6 yerleşim/test/build; 7 oyuncu denemesi/düzeltme. Kayıt güvenliği ilk ekonomik işlemden itibaren geliştirilir; beşinci güne ertelenmez.

## 6. A2 — oynanabilir dikey dilim

### A2.1 — gerçek başlangıç ve ekonomi

- [ ] Paftadaki `R2-C0` işleme, `R3-C1` kuru depo, `R2-C1` dinlenme ve `R3-C2` geçici mal kabul pedini gerçek açılış/bedel koşullarıyla bağla; kapı eşikleri ve iki hücrelik omurga açılsın.
- [ ] [KARARLAR.md](KARARLAR.md) D-002–D-004 uyarınca su kaynağı, üç şişelenmiş su SKU'su ve domates zincirini gerçek lotlarla kur; ilk mandıra ve işlenmiş gıda erişimini doğrula.
- [ ] §26 ve [ürün ağacındaki](OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md) 100 kredi, 50 ham su, 12/4/2 ambalaj, 8 tohum ve seviye 1 debiyi uygula; ilk 3–8 dakikalık oturumda stok/talep dengesini ölç.
- [ ] İlk işleme istasyonlarının satın alımı, enerji/sarf ve lot muhasebesini doğrula.
- [ ] Tek depo rafı/tedarikçi, fiyat teklifi, onay, teslim, kabul, kapasite rezervasyonu ve iptal/iade.
- [ ] Para/stok korunumu, katkı/net kâr/nakit farkı; satın alım ve satışta çifte gideri önle.

### A2.2 — okunabilir yönetim ve öğretim

- [ ] Bir çalışan, iki koltuklu mola köşesi, güvenli görev bırakma ve dinlenme öğretimi.
- [ ] Üç müşteri profili, bütçe/fiyat tepkisi, tek ikame ve kayıp satış nedenleri.
- [ ] İki teşhis katmanı, beş öğretim görevi ve kısa oturumlar arasında kaydedilen ilerleme.
- [ ] Ürün/lot/istasyon/raf kimliğini teşhis ve ansiklopedi arasında koru; depo/tedarik/çalışan kararı sonrası rotanın ve boş raf süresinin gerçekten değiştiğini göster.
- [ ] İki farklı yerleşim deneyi; telefon HUD'unda küçük masaüstü tablolarını sıkıştırmak yerine okunabilir detaylar.
- [ ] A2 sanat hedefini oynanış kapsamıyla karıştırma: 8 makine silueti hazırlığı 8 oynanabilir makine izni değildir.

### A2.3 — cihaz ve dilim kabulü

- [ ] 20–30 dk toplam oynanış kısa oturumlarla tamamlanıyor; stok/para/tedarik/mola korunuyor.
- [ ] Android test APK ve gerçek iOS build; safe-area, jestler ve işlev paritesi.
- [ ] En az iki küçük ekran, iki Android performans sınıfı ve bir iOS cihazı; en az 20 dk ısı testi.
- [ ] T-A2 fixture'ları, TR metin okunabilirliği, sağ/sol el ve dokun-git temel kontrolleri.

**Teslim:** Tekrarlanabilir dikey dilim ve maliyet/oyuncu/cihaz raporu. **Çıkış:** Üç ürünlü ekonomi ve öğretim bağımsız oynanıyor; iki platform sonucu ayrı kanıtlı.

**Kapsam dışı:** Tam rol/oda/olay kataloğu, bozulma, ileri bakım, 30 beceri, final ve gerçek ödeme.

## 7. A3 — sistem derinliği

### A3.1 — işletme altyapısı

- [ ] [Paftadaki](DUNYA_YERLESIM_PLANI.md) soğuk depo, bakım, enerji ve yönetim odalarını yalnız gerçek içerik/bedel/açılış koşuluyla kur; iki hücrelik iç omurga ve servis erişimi her odada doğrulansın.
- [ ] Lot/slot ayrımı, rezervasyon, FIFO/FEFO, gelişmiş tedarik ve isteğe bağlı raf ömrü.
- [ ] Kalite skoru/kademesi, kaynak kalite erişimi, kalibrasyon ve yükseltme; gerçek skor lot boyunca korunur.
- [ ] Güç kapasitesi/önceliği, kesintide kalan parti süresi ve temel elle döngü.
- [ ] Aşınma, planlı servis, duruş, ücretsiz elle toparlama; servis maliyeti bir kez.
- [ ] Oda işlev/donanım/erişim, konfor ve dekor üst sınırları; katlanan gizli bonus yok.

### A3.2 — personel ve oyuncu gelişimi

- [ ] Rol/köken/özellikleri aktif kapsam kadar ekle; ücret, tercih, eğitim ve görünür beceriler.
- [ ] Vardiya, mola koltuğu/rota, F60/F80/F15, güvenli devir, eğitim/izin çakışması.
- [ ] Araştırma paketleri/AP, XP/seviye/beceri puanı ve tekil bölüm/öğretim ödülleri.
- [ ] Dokuz çekirdek davranış düğümü ve reset; eksik bedel/bonus birleşimlerini karar kaydıyla çöz.
- [ ] Taşıma ekipmanı 6→8→10→12, analiz aracı ve üretim aparatı sınırları.

### A3.3 — kontrat, olay, teşhis ve toparlanma

- [ ] §38.4 fiyat tabelası: kaliteye uyarlanmış referansa göre 1,00×/0,80×/1,50× seçimi, özel fiyat, aralık ve sepet fiyat kilidi; aynı seed ile %50 ortalama kuyruk hedefi ölçümü ve pahalı fiyat ret geri bildirimi.
- [ ] §38.5 raf SKU kilidi: oyuncu/görevli transferi, dolu rafta kilit değişimi reddi ve kayıt dönüşü; olaylar açık ve `item.aged_cheese` stoklu günlerde %20 seed'li olasılık, günde en çok bir aşırma, en az 12 aktif saniye yakalama, güvenli iade veya çıkış kaybı. Akü katalog kimliği/üretim yolu gelmeden açılmaz.
- [ ] §38.6 Kooperatif 100 kredi/ücretsiz ve Konsorsiyum 300 kredi/%5 tek ücret/toplam 315 kredi teklifleri; aynı anda tek borç, sabit vade/ceza yok, günlük brüt satış cirosundan %10 tekil kesinti ve yardım yolunun açık kalması.
- [ ] Kontrat teklifi, kısmi teslim, tahsis, uzatma, timeout ve perakende fırsat maliyeti.
- [ ] Sınırlı dünya/personel olayları; cooldown, etki sınırları, olay kapalıyken zorunlu kriz erişimi.
- [ ] İşletme haritası ölçümleri, kanıta dayanan en fazla üç öneri; otomatik satın alma yok.
- [ ] Ücret/oda askısı, yardım görevi ve temel elle çalışma; negatif bakiye/kalıcı kilit yok.
- [ ] Üretici/tüccar/karma yollar aynı ilerlemeyi geçiyor; 20 dk cihaz profili ve crash/context-loss kurtarması.

**Teslim:** Dokuz düğümlü, araştırma/kalite/bakım/kontrat içeren sistem build'i. **Çıkış:** T-A3 testleri ve üç işletme yolu kanıtlı; yanlış araştırma sırası veya ekonomik başarısızlık kalıcı kilit oluşturmuyor.

**Kapsam dışı:** Tam içerik/son sanat ve monetizasyon SDK'ları.

### A3 sonrası A–E adayları için önkoşul kapısı

§64 adayları P0/A2 teslimi değildir. A3'te mevcut olay, vardiya, fiyat/raf, oda/dekor ve teşhis sistemleri doğrulandıktan sonra A4 aday işi açılır: VIP, günlük haber ve vardiya dalgası için tek EventDirector ve tek Mahalle Gündemi sunumu; hijyen ve cazibe için §32 oda sınırı; Bülten için gerçek olayın neden–müdahale–sonuç izi; teşhir/pazarlık için satış ledger'ı ve fiyat kontrolü. Önce dokuz tanımlı A3 yetenek düğümünün davranışı kanıtlanır; A4'ün kalan 21 düğümü boş ad/bedelle doldurulmaz. Her aday ayrı zorunlu menü, puan veya tekrar döngüsü ekliyorsa §58.3 kapsam takasına veya süre/bütçe etkisiyle H0 karar listesine döner. Bu paragraf adayları uygulanmış veya A4 zorunlu teslim saymaz.

## 8. A4 — tam oyun, son içerik ve sandbox

### A4.1 — içerik kataloğunu tamamlama

- [ ] Tier 1–4 yerel ürün ağacının ham kaynak, ara form, tarif, istasyon, maliyet ve erişim doğrulaması.
- [ ] 8 rol, 6 köken, bireysel özellikler, 20 çalışan üst sınırı, aday üretim ve çelişen özellik kuralları.
- [ ] Gerekli oda/donanım, tedarikçi, müşteri ve olay kataloğu; eksik tanım sıfırla doldurulmaz.
- [ ] Kalan 21 yeteneğin gerçek davranış/bedel/önkoşul/reset tasarımını tamamla; anayasada hazır olmadığı açıkça korunur.
- [ ] İsimli karakter tercih/eksiklikleri, kişisel görevleri, diyalog ve ilişkisel sonuçları.
- [ ] §64 adaylarının her biri için ürün/olay/dekor kimliği, önkoşul, ekonomi sınırı ve kayıt göçü gereksinimini karara bağla; Tier 5 oluşturma.

### A4 aday mekanik paketleri — yalnız A3 kapısından sonra

- [ ] VIP teftişi, sabah trendi ve vardiya dalgasını tek Mahalle Gündemi kartı/olay takviminde dene; aynı anda tek yaklaşan hazırlık kararı, zorunlu modal veya tekrar ziyaret/ödül yok.
- [ ] Seyrek hijyen olayı, Mahalle Bülteni'nin neden–müdahale–gözlenen sonuç izi ve dekor cazibesini gerçek oda/hizmet olaylarıyla bağla; sürekli temizlik angaryası, yeni bülten puanı ve ücretli kozmetik avantajı yok.
- [ ] Günün Hasadı teşhiri ve Tier 4 pazarlığını mevcut fiyat, talep, stok rezervasyonu ve ledger üzerinde dene; 3× hız ve +%20–30 kâr hipotezlerini ayrı ölç.
- [ ] 60 aktif saniyelik vardiya dalgası hipotezini Mahalle Gündemi içinde müşteri kapasitesi, kayıt dönüşü ve düşük cihaz profiliyle doğrula.
- [ ] §52–54/§60.2 sürekli hedef akışı, üç aşamalı ses/haptik ritmi, dükkân adı ve görsel yükseltmeleri erişilebilirlik ve cihaz bütçesi içinde dene; %15–20 sürpriz ve +%25 sıcaklık hipotezlerini ancak içerik/korunum testinden sonra aç.

**Aday kabul kapısı:** [TEST_STRATEGY.md](TEST_STRATEGY.md) A–E senaryoları, gerçek oyuncu geri bildirimi, ekonomi korunumu ve cihaz profili görülmeden aday ilk sürüm zorunluluğuna dönüşmez. P0 → A2 → A3 → A4 → A5 sırası değişmez.

### A4.2 — başlangıçtan finale

- [ ] Tek bölgesel krizin üretici/tüccar/toplulukçu seçeneklerini aynı ana ilerlemeyle sınayıp seçimin pano, ziyaret ve sevkiyat izlerini §48.5 ile eşleştir; üç ayrı zorunlu kampanya oluşturma.
- [ ] Altı oyun bölümü erişimi, araştırma ve topluluk itibarı tutarlı.
- [ ] Bölgesel krizin üç çözümü, kısmi teslim ve aynı ana ilerleme.
- [ ] Üç finalin §42'deki dört dalgası, yatırım, ikamesiz teslim ve geri çekilemeyen proje kabulü.
- [ ] 60 ziyaretçi/80 ihtiyaç hizmet sınavı, seed/sepet/süre/ölçüm kaydı ve başarısız denemede teslimlerin korunması.
- [ ] Final sahneleri, dünyada görsel sonuç, tekil ödül ve diğer projelere açık serbest oyun.
- [ ] Baştan finale üretim ve dış alım yolları; finalin kısa oturumlara bölünebilmesi.

### A4.3 — sanat, ses ve yerelleştirme

- [ ] [Dünya sanat paftası](DUNYA_YERLESIM_PLANI.md) §8'e göre satış seramiği, tüm açılmış oda yüzeyleri, dış cephe, yol/peyzaj, ışık/çatı kesmesi, animasyon ve ses varlıklarını fazlı üret; cihazda renk/okunurluk ve toplam render bütçesini ölç.
- [ ] §65 dış çevresini [paftadaki](DUNYA_YERLESIM_PLANI.md) yol, dört başlangıç park cebi, ağaç/taş peyzajı ve hayvan bölgelerine yerleştir; gerçek cihazda görünürlük/erişim/bütçe ölçülürse koordinat ve kayıt etkisini açık revize et.
- [ ] §66 düğme kataloğunu fazlarda açılan sistemlerle tamamla; ansiklopedi Tier 1–4 tanımlı içerikle, kilit/spoiler kurallarıyla ve TR/EN çevirileriyle aynı sürümde olsun. P0 sonrası ansiklopedi maddeleri ilgili A2/A3 sistemleri teslim edilirken eklenir.
- [ ] §65 yaşayan dış çevreyi kur: hayvan/bitki/taş kitleri, market önü otoparkı, araç giriş–park–çıkış rotaları ve yaya güvenli alanı.
- [ ] Yol aşınması → bakım → yenilenme döngüsünü aktif zaman ve kalıcı kayıtla bağla; erişim, dolu park, kesinti/dönüş ve düşük cihaz profili kabul senaryolarını doğrula. Süre, yoğunluk ve park kapasitesini prototipten sonra belirle.
- [ ] Placeholder yerine gerekli kübik low-poly kit, karakter/makine silueti, ürün/UI ikonları ve animasyonlar.
- [ ] Neo-Brutalist token'lar, buton/hata/pending durumları ve ekran okuyucu semantiği.
- [ ] Müzik/efekt, ses/titreşim kapatma, az hareket ve arka planda ses davranışı.
- [ ] Türkçe/İngilizce localization anahtarları, metin taşması, sayı/para sunumu, font karakter desteği.
- [ ] Paket/asset/font/ses lisansları ve üçüncü taraf bildirimleri; son içerik boyut/performans kontrolü.

### A4.4 — kozmetik ödeme, reklam ve gizlilik

- [ ] Sağlayıcı/plugin bakım ve Capacitor uyumu, lisans/boyut/izin/veri akışı ve maliyetini doğrula.
- [ ] Gerekiyorsa güvenilir doğrulama hizmetinin kapsamı, kimlik eşleştirmesi, secret yönetimi ve hata yolunu kararlaştır; WebView callback'ini kanıt sayma.
- [ ] Ücretli kozmetik SKU'ları, iki mağaza katalog eşlemesi ve yerelleştirilmiş fiyatlar.
- [ ] Sandbox satın alma, pending/parental approval, iptal, bağlantı kaybı, restore, refund/revoke, acknowledgment/finishing.
- [ ] Reklam varsayılan kapalı; açık ödül seçimi, 12 kozmetik ve ücretsiz görev karşılığı, başarı limiti ve idempotent completion.
- [ ] Reklam/ödeme/arama kesintisi, gecikmiş doğrulama, tekrar callback ve ücretsiz görevle eşzamanlı kazanım.
- [ ] Yaş/gizlilik tercihi, gerekliyse takip izni ve gerçek SDK veri envanteri; izin reddi oyunu cezalandırmaz.
- [ ] Ücretsiz/reklamsız temel ekonominin bağımsız çalışması.

### A4.5 — uçtan uca beta

- [ ] İlgili dağıtım yetkileri ve erişimler sağlanınca TestFlight/Play test kanalı build'leri; sürüm ve test grubu kayıtları.
- [ ] T-A4 senaryoları, gerçek kullanıcı görevleri, eski kayıtla devam ve iki platform hata listesi.
- [ ] Kritik crash, veri kaybı, ödeme/hak ve ilerleme kilitleri giderildi.
- [ ] Beta geri bildirimlerini kapsam genişletmeden sınıflandır; yeni mekanik talebini ayrı backlog'a al.

**Teslim:** Baştan finale oynanabilir tam oyun, son içerik, iki platform sandbox ve beta raporu. **Çıkış:** Katalog/ilerleme/final tamam; güvenilir hak teslimi ve ücretsiz yollar doğrulanmış.

§63.2 A4 sandbox'ı ile §58.1 A5 yayın ödemesi farklıdır. Sandbox geçişi üretim ödemesini açma veya mağazaya yayınlama yetkisi değildir.

## 9. A5.1 — yayın adayı kalite kapısı

- [ ] Yeni oyun, güncelleme, save migration, bozuk kayıt/yedek ve disk dolu senaryoları.
- [ ] 20 arka plan/dönüş, kritik işlemde kill, uçak modu, context-loss ve düşük cihaz davranışı.
- [ ] Denge deneyleri; üretim/ticaret/karma yol, ücret/kontrat/final ve reklam kullanmayan oyuncu.
- [ ] Sağ/sol el, dokun-git, metin büyütme, yüksek kontrast, az hareket, odak sırası, TR/EN ekran taşmaları.
- [ ] 60 müşterilik mantıksal yük, 25 görünür animasyonlu karakter hedefi ve reklam açılış bellek tepesi.
- [ ] Gerçek cihazda en az 20 dk ısı/pil ölçümü; render kalitesini düşürmek ekonomiyi değiştirmiyor.
- [ ] Kritik hatalar kapalı; kalan düşük etkili sorunlar etki/geçici çözüm ve sürüm kararıyla kayıtlı.

| Bütçe | Hedef ve raporlama |
|---|---|
| Kare hızı | 30 FPS; uygun cihazda isteğe bağlı 60 |
| Simülasyon | 10 Hz, adım p95 ≤6 ms |
| Draw call/geometri | Düşük profil ≤150 çağrı, ≤150 bin görünür üçgen |
| Bellek | JS+GPU hedef ≤600 MB; native/SDK tepe ayrı ölçülür |
| Çözünürlük | Düşük kısa kenar 640–720 px; DPR ≤1,25/üst ≤1,5 |
| Açılış | Yerel soğuk açılış ≤10 sn hipotezi |
| Boyut | Kurulu web içeriği ≤150 MB; sıkıştırılmış ilk indirme ≤200 MB; kurulu temel içerik ≤500 MB ayrı ölçümler |

Bunlar anayasa hedefidir; desteklenen cihaz garantisi değildir. Başarısız bütçe gerçek ölçüm ve kapsam/kalite kararıyla çözülür, tahminle geçti yazılmaz.

**Teslim:** Sürümü sabitlenmiş aday ve cihaz/denge/erişilebilirlik/kayıt raporu. **Çıkış:** Kritik riskler kapalı, platform bazında kabul açık.

## 10. A5.2 — mağaza, hesap ve gizlilik hazırlığı

Aşağıdakiler yayın tarihinde yeniden doğrulanacak işlerdir; güncel politika doğrulaması yapılmış sayılmaz. SDK/API hedef numarası, zorunlu test süresi/kişi sayısı veya inceleme süresi bu planda uydurulmaz. Hesap türü ve ülkeye bağlı koşullar ilgili konsolda/resmî kaynakta kontrol edilip tarihli kayıt tutulur.

- [ ] Yayın adı/marka uygunluğu, kalıcı bundle/app ID ve geliştirici görünür adı kesin.
- [ ] İki mağaza hesabının doğrulama/erişim durumu, gerekli sözleşmeler ve ücretli kozmetik için gereken ticari/ödeme bilgileri tamam; yetkili hesap sahibi yürütür.
- [ ] Mağaza uygulama kayıtları, kategori, yaş/içerik derecelendirmesi ve hedef kitle beyanı.
- [ ] Türkçe/İngilizce açıklamalar, anahtar/arama metinleri, simge, gerekli ekran görüntüleri ve varsa tanıtım videosu; görseller gerçek oyunu temsil ediyor.
- [ ] Çalışan destek ve gizlilik bağlantıları, iletişim yolu, veri saklama/silme açıklamaları.
- [ ] Gerçek SDK/veri akışıyla eşleşen Apple gizlilik/manifest ve Google Data safety/reklam beyanları; kullanılan API/izin gereklilikleri doğrulanmış.
- [ ] Hesap/veri silme gibi gereksinimler varsa gerçek ürün özelliklerine göre karşılanmış; oyunda olmayan hesap sistemi sırf şablon için eklenmemiş.
- [ ] Üretim IAP katalogları, görseller/metin/fiyatlar, inceleme gereksinimleri ve bölge erişimi hazırlığı.
- [ ] Gerekli test kanalı veya production erişim koşulları hesap özelinde tamam; P0 oyuncu testi mağaza testi yerine sayılmıyor.
- [ ] İncelemeci notları: offline temel döngü, reklam seçimi, restore yolu, final/özellik erişimi; gerekiyorsa güvenli test erişimi.
- [ ] Yayın ülkeleri, dil desteği, fiyat/ürün kullanılabilirliği ve ilk yayın yöntemi kararı.

**Teslim:** İki mağaza için eksiksiz başvuru kontrol listesi ve tarihli politika doğrulama kaydı. **Çıkış:** Boş/zıt beyan veya erişilemeyen destek adresi yok; hesap engelleri çözülmüş.

## 11. A5.3 — imzalı paket, sürüm ve son prova

- [ ] Tek commit/içerik sürümü üzerinden tekrarlanabilir release build; sürüm ve Android/iOS build numaraları belirli.
- [ ] Android imzalı AAB; iOS archive ve dağıtım imzası/provisioning; anahtarlar güvenli ve erişim yetkileri kayıtlı.
- [ ] Web build → Capacitor sync → platform build adımlarını README'de gerçek komutlarla doğrula.
- [ ] Release'te remote server/localhost, debug inspector, test reklam/ödeme kimliği, secret ve uygunsuz kaynak haritası sızıntısı kontrolü.
- [ ] İlk açılış/offline asset yolları ve temel içeriğin zorunlu ek indirme istememesi.
- [ ] Son imzalı adayda temiz kurulum, önceki desteklenen kayıttan güncelleme, satın alma/restore ve lifecycle prova.
- [ ] Asset/lisans listesi, privacy beyanları ve SDK envanteri tam olarak bu build ile aynı.
- [ ] Hata halinde yayını durdurma, ürün/reklamı güvenli kapatma ve yeni düzeltme build'i planı; mağazada eski binary'ye anlık geri dönüş varsayılmaz.

**Teslim:** Android AAB, iOS archive/dağıtım build'i, checksum/build kimliği, test raporu, release notu ve yayın dosyası. **Çıkış:** Test edilmiş paket ile gönderilecek paket aynı; son değişiklik varsa ilgili kontroller tekrarlanmış.

## 12. A5.4 — yayın yetkisi, mağazaya gönderim ve inceleme

Bu planı yazma talebi tek başına mağaza yüklemesi, gerçek ödeme açılması veya herkese yayın yetkisi değildir (§60.6). Yayın aşamasında mevcut oturumda verilmiş geçerli yetki varsa tekrar istenmez. Eksikse önce aşağıdaki somut yayın dosyası hazırlanır, ardından yalnız eksik yetki istenir.

**Yayın dosyası:** Build kimliği/çıktıları, hedef mağazalar/ülkeler, sürüm notu, fiyat/kozmetik durumu, gizlilik/yaş beyanı, test özeti, bilinen sorunlar, önerilen yayın yöntemi ve durdurma planı.

- [ ] Yetkinin kapsamı kaydedildi: test dağıtımı, mağaza başvurusu, üretim ödeme/reklamı, herkese yayın ve hedef ülkeler birbirine karıştırılmadı.
- [ ] Yetkili Android AAB Play Console'a, iOS build App Store Connect'e yüklendi; işleme/validasyon sonuçları kontrol edildi.
- [ ] Mağaza metinleri, IAP inceleme bağlantıları ve gerekli beyanlar ilgili build ile eşlendi.
- [ ] İncelemeye gönderildi; iki platformun durum/geri bildirimleri ayrı kaydedildi.
- [ ] Red/eksik bilgi halinde gerçek gerekçe sınıflandırıldı; gerekli kod/metin/beyan düzeltildi, ilgili testler tekrarlandı ve yeniden gönderildi.
- [ ] Onaylanan build kimliği son raporla eşleşiyor; sonradan değişen aday yeniden test edilmeden yayınlanmıyor.

**Teslim:** Android ve iOS için ayrı inceleme sonucu. **Çıkış:** Her iki mağaza onayı veya açık platform engeli; biri onaylanınca diğeri yayınlandı sayılmaz. Mağaza kabulü/süresi garanti edilmez.

## 13. A5.5 — gerçek mağaza yayını ve doğrulama

- [ ] Yetkili yayın kararı uygulandı; planlanan manuel/zamanlı/kademeli yöntem ilgili mağazanın bu sürüm için desteklediği seçeneklerden seçildi.
- [ ] Android ürün sayfası ve iOS ürün sayfası hedef ülkelerde görünür; bağlantılar ve sürüm bilgileri kaydedildi.
- [ ] Test kanalı yerine gerçek mağazadan temiz kurulum: açılış, ilk satış, offline devam ve kayıt dönüşü.
- [ ] Gerçek katalog fiyat/para birimi, kozmetik erişimi, restore ve reklam tercih akışı kontrol edildi; maliyet doğuracak gerçek işlem ayrıca yetkili kapsamda yürütüldü.
- [ ] İzin reddi, ağ kesintisi ve bağlantı hatası temel oyunu kapatmıyor.
- [ ] Yayındaki paket/support/privacy adresleri ve release notları doğru.
- [ ] Kritik hata görülürse ilgili mağazanın mevcut kontrolleriyle dağıtım durduruldu/sınırlandı; düzeltme build'i ve kullanıcı iletişimi planlandı.

**Tamamlanma tanımı:** Her iki mağazada hedeflenen kapsamda indirilebilir sürüm + mağazadan kurulmuş cihazda temel döngü kanıtı + çalışan destek/gizlilik bağlantıları. Yalnız “incelemeye gönderildi”, “onaylandı” veya TestFlight linki bu hedefi kapatmaz.

**Teslim:** İki gerçek mağaza bağlantısı, yayın tarihi/sürümü, mağaza kurulum test raporu ve operasyon devri.

## 14. Y1 — yayın sonrası ilk takip ve düzeltme

Bu bölüm yeni oyun mekanikleri değil yayın tesliminin devamıdır. Gerçek takip sıklığı/sorumlusu yayın kararında belirlenir; bu belge otomatik izleme veya mesaj gönderimi başlatmaz.

- [ ] Mağaza konsollarındaki crash/ANR ve kullanıcı bildirimlerini, kullanılan veri izinleri sınırında değerlendir.
- [ ] Veri kaybı, ödeme/hak, açılış veya ilerleme kilidi hatalarını önceliklendir; kaynak/yeniden üretim ve etkilenen sürümü kaydet.
- [ ] Gerekli hotfix: hatayı üreten fixture → küçük düzeltme → ilgili test ve kayıt uyumluluğu → yeni imzalı build → gerekli yayın süreci.
- [ ] Kullanıcı destek cevaplarını ve sürüm notlarını yetkili iletişim kapsamıyla yürüt; gizli veri içeren log isteme.
- [ ] İlk yayın raporu: cihaz sorunları, destek yükü, gerçek oturum/ekonomi gözlemleri ve sonraki bakım backlog'u.
- [ ] Mağaza/SDK güncelleme ve imzalama yenileme sorumluluğunu devret; son build ve kayıt göçü kanıtlarını sakla.

**Teslim:** Yayın sonrası sorun listesi, varsa doğrulanmış düzeltme sürümü ve bakım sorumluluğu. Yeni platform, multiplayer veya yeni ana mekanik ayrı kapsam kararıdır.

## 15. Fazlar boyunca değişmeyen kontrol noktaları

| Konu | İlk ele alınacağı yer | Sonraki zorunlu kontrol |
|---|---|---|
| Kayıt/transaction güvenliği | P0 ilk ekonomik işlem | Her ekonomi/kayıt değişimi ve A5 göç |
| Native cihaz build | P0 ilk hafta hedefi | A2 parite, A3 profil, A4 SDK, A5 release |
| İzin/gizlilik | H0 hedef yaş; SDK öncesi veri planı | A4 gerçek akış, A5 mağaza beyanı |
| Denge | A2 gerçek maliyet | A3 işletme yolları, A4 final, A5 son denge |
| Erişilebilirlik | P0 dokunma/HUD | A2 öğretim, A4 son içerik, A5 tam cihaz matrisi |
| Lisans/boyut | İlk dependency/asset | A4 son sanat ve A5 tam build |
| Kanıt/doğru durum | Her görev | Faz geçişi ve gerçek yayın |

Kritik bağımlılık: veri/saat/ledger → transfer/üretim/satış → kayıt/görevli/yerleşim → gerçek ekonomi/tedarik → kalite/personel/RPG/kontrat → tam katalog/final/SDK → beta → release → mağaza incelemesi → yayın doğrulaması.

Kapsam değişikliğinde oyuncu sorunu, mevcut çözüm, minimum iş, bakım/test yükü ve hedef faz yazılır. A2'ye ek yük gelirse eşdeğer iş çıkarılır veya süre/bütçe etkisi kullanıcıya sunulur. Denge/kayıt güvenliği sorunu yeni özelliklerle örtülmez.

## 16. Başvurulacak belgeler ve teslim kaydı

- [MVP_IMPLEMENTATION_GUIDE.md](MVP_IMPLEMENTATION_GUIDE.md): P0-01…09 iş paketleri ve yedi günlük öneri.
- [ARCHITECTURE.md](ARCHITECTURE.md), [DOMAIN_MODEL.md](DOMAIN_MODEL.md): katmanlar, state, komut ve kayıt protokolü.
- [CONTROLS_AND_UX.md](CONTROLS_AND_UX.md), [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md): mobil davranış/görsel kabul.
- [OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md](OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md): yerel su, çiftlik, göl ve zanaat ürün ağacı taslağı; eski personel/ekonomi/final katalogları bu dosyada artık yoktur.
- [ECONOMY_AND_MACHINES.md](ECONOMY_AND_MACHINES.md), [RPG_AND_PROGRESSION.md](RPG_AND_PROGRESSION.md), [STORY_AND_FACTIONS.md](STORY_AND_FACTIONS.md): sistem uygulama ayrıntıları.
- [MONETIZATION_AND_PRIVACY.md](MONETIZATION_AND_PRIVACY.md): sağlayıcı/hak/gizlilik akışları.
- [TEST_STRATEGY.md](TEST_STRATEGY.md): T-P0/T-A2/T-A3/T-A4 fixture'ları ve cihaz rapor şablonu.
- [MEMORY.md](MEMORY.md): son gerçek durum, engeller ve kararlar; [README.md](README.md): doğrulanmış çalıştırma/build komutları.

Her faz teslim kaydı: faz/iş ID, tarih, gerçek durum, commit/build/içerik sürümü, değişen dosyalar, çalıştırılan kontrol ve sonucu, artifact/log yolu, Android/iOS kanıtı, açık sorun ve sıradaki bağımlı iş. Mağaza aşamalarında başvuru/build kimliği ve yayın bağlantısı eklenir. Planın revize edilmiş olması oyun fazlarının tamamlandığı anlamına gelmez.
