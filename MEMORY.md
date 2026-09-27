# Devir durumu ve karar kaydı

## 2026-09-27 P0-03 kodlama ve doğrulama tamamlandı — görev kabulü

P0-03 ("Kapasite ve rezervasyon korumalı ürün transferini kur") Orvant iş akışıyla `start_task` -> kodlama -> kanıt sunumu -> `complete_task` döngüsüyle doğrulandı.
- `src/domain/inventory/InventoryManager.ts`: Tüm fiziksel (`source`, `shelf`, `storage`, `cabinet`, `machineInput`, `machineOutput`) ve aktör (`player`, `worker`, `customer`) konumları tekilleştirildi.
- Kapasite ve serbest stok kontrolü: `getAvailableQuantity`, `getAvailableCapacity`, `DEFAULT_CAPACITIES` (oyuncu 5, raf 20, çeşme 80 vb.) ve özel limitler uygulandı.
- T-P0-03b: Yetersiz stokta (`INSUFFICIENT_STOCK`) ve hedef kapasitesi aşıldığında (`EXCEEDS_CAPACITY`) işlem reddedildi; state/ledger/rezervasyonlar değişmedi.
- T-P0-03: `committedTransactions` dedup kontrolüyle aynı transactionId tekrarlandığında ikinci etki oluşmadı (`isDuplicate: true`).
- Rezervasyon ve İptal: `createReservation` ile kaynak stok ve hedef kapasite atomik kilitlendi; `cancelReservation` ile kilitler kayıpsız ve fazlalıksız açıldı; görevli rota kesintisinde ürünün görevli envanterinde güvenle korunduğu doğrulandı.
- `src/application/commands.ts`: `TRANSFER_STOCK`, `RESERVE_STOCK`, `CANCEL_RESERVATION` komutları CommandDispatcher'a entegre edildi.
- `tests/unit/p0_transfer.test.ts`: 10/10 test geçti (toplam 35 birim test, vitest 494 ms, oxlint 0 hata, build 702 ms). Doğrulama raporu `docs/test_reports/P0_03_VERIFICATION.md` olarak kaydedildi.
- Orvant state revizyonu 9'a yükseldi; `P0-04` (Satış), `P0-05` (Üretim) ve `P0-06` (Kayıt/Snapshot) görevleri açıldı.

## 2026-09-27 P0-02 kodlama ve doğrulama tamamlandı — görev kabulü

P0-02 ("Tek oda dünyasını, dokunmatik hareketi ve pointer sahipliğini kur") Orvant iş akışıyla `start_task` -> kodlama -> kanıt sunumu -> `complete_task` döngüsüyle doğrulandı.
- `src/presentation/world/WorldLayout.ts`: R3-C0 6×6 satış odası (`x12..17, z22..27`), güney kapısı (`x14..15, z27`), batı koridoru (`x10..12, z24..25`), bahçe alanı (`x4..9, z20..27`) ve istasyon footprint engelleri (`isWalkable`) tanımlandı.
- `src/presentation/world/SceneRenderer.ts`: Three.js WebGL2 sahnesi, krem seramik oda zemini, duvarlar, bahçe toprağı, P0 istasyon kutuları ve servis halkaları, karakter mesh'i ve hedef işaretçisi uygulandı.
- `src/presentation/input/InputManager.ts`: Tap-to-move, sanal joystick, touchcancel/pointercancel güvenliği ve UI pointer sahipliği (pointer isolation - `isPointerOverUI`) uygulandı.
- `src/presentation/camera/PortraitCamera.ts`: Alt HUD için Z kompanzasyonu (`+1.8m`) ve dar portre ekranlar için dinamik FOV genişletmesi uygulandı.
- `src/App.tsx`: Three.js sahnesi ile Neo-Brutalist HUD katmanı (`data-ui="true"`) entegre edildi.
- `tests/unit/p0_world_input.test.ts`: 10/10 test geçti (toplam 25 birim test). Doğrulama raporu `docs/test_reports/P0_02_VERIFICATION.md` olarak kaydedildi.
- Orvant state revizyonu 6'ya yükseldi; `P0-03` ve `P0-06` görevleri açıldı.

## 2026-09-27 P0-01 kodlama ve doğrulama tamamlandı — görev kabulü

P0-01 ("Sabit simülasyon saati, seed ve içerik doğrulayıcı temelini kur") Orvant iş akışıyla `start_task` -> kodlama -> kanıt sunumu -> `complete_task` döngüsüyle doğrulandı.
- `@tailwindcss/postcss` ve `vitest` eklendi; `vite build` (618 ms) ve `oxlint` (0 hata) temizlendi.
- `src/domain/time/clock.ts`: 100 ms sabit adımlı `SimulationClock`, 30/60/120 FPS render bağımsızlığı, 1e-5 epsilon toleransı, MAX_TICKS_PER_FRAME (5) sınırı ve arka plan pause koruması uygulandı.
- `src/domain/random/rng.ts`: 32-bit deterministik `Mulberry32Rng` uygulandı; tohumlama ve durum (state) geri yükleme kanıtlandı.
- `src/content/p0Content.ts`: 9 P0 SKU'su, 3 makine ve 5 tarif kataloğu ve `validateContent` doğrulayıcısı uygulandı; geçersiz girdi, tanımsız makine/ürün ve negatif fiyat reddi test edildi.
- `src/domain/economy/ledger.ts`: 10.000 atom = 1 kredi sabit hassasiyetli `EconomyLedger`, yetersiz bakiyede red (Math.max yok), idempotent tek işlem ve `CommandDispatcher` uygulandı.
- `tests/unit/p0_core.test.ts`: 15/15 birim test geçti. Doğrulama raporu `docs/test_reports/P0_01_VERIFICATION.md` olarak kaydedildi.
- Orvant state revizyonu 3'e yükseldi; `P0-02` ve `P0-06` görevleri açıldı.

## 2026-09-27 Markdown tutarlılık denetimi — belge revizyonu

Kök projedeki 23 Markdown dosyası kaynak önceliğiyle tarandı. Eski görsel referans rehberi bağlayıcı mekanik sanılmayacak şekilde yeniden yazıldı; P0 dört ürün/çok girdili su-domates, A2 müşteri fiyat tepkisi/A3 fiyat düzenleme, güncel 57 SKU, P0 fiziksel açılış sarf konumu, A2+ isteğe bağlı gün sonu ve güncel faz/karar bağlantıları eşlendi. Eski küp/spor/prototip dolabı, 24 SKU, dört jüri ve yanlış görsel yolları aktif talimatlardan çıkarıldı. Yerel Markdown bağlantıları ve `git diff --check` kontrol edildi. Bu yalnız belge denetimidir; kod, asset, build, cihaz ve oyuncu kabulü yapılmadı.

## 2026-09-27 dünya paftası açık kararları kapatıldı — belge revizyonu

Kullanıcı isteğiyle denetim maddeleri [DUNYA_YERLESIM_PLANI.md](DUNYA_YERLESIM_PLANI.md) §13, [katalog](OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md) §2/§7, anayasa §32.1/§33.3 ve KARARLAR D-043 içine işlendi. P0 footprint/servis ve sıra; 4×4 cam dış müşteri pavyonu; A2 kapasite vermeyen gerçek teslim pedi; dört A3 parsel ve 17 kaynak/istasyonun 57 SKU'ya port eşlemesi; ayrı iki tuz ID'si ve tek arılık balmumu işlemi açıklandı. Geçici inceleme raporu kullanıcı isteğiyle silindi. Bunlar belge/başlangıç denge kararlarıdır; kod, asset veya cihaz doğrulaması değildir.

## 2026-09-27 oda, müşteri, istasyon ve SKU görsel sözleşmesi — belge revizyonu

Kullanıcı geri bildirimiyle [DUNYA_YERLESIM_PLANI.md](DUNYA_YERLESIM_PLANI.md) §9–12 genişletildi: yapı kiti ve 13 oda ile açık servis avlusunun duvar/kapı/pencere/eşyası, müşteri profilleri/rotası ve 57 satılabilir SKU için tekil siluet/ambalaj tarifi yazıldı. Sonraki §13 revizyonu R0 rezervlerini koşullu işleme kopyası yaptı ve katalog fiziksel portları 17'ye tamamladı. Oyun varlığı, render ve cihaz testi yapılmadı.

## 2026-09-27 dünya malzeme ve atmosfer paftası — belge revizyonu

Kullanıcı isteğiyle DUNYA_YERLESIM_PLANI.md §8'e marketin mat krem seramik zemini, kırık beyaz duvar/cephe, üretim/depo/soğuk/dinlenme/diğer oda yüzeyleri, raf/makine/kasa malzemeleri, asfalt/kaldırım/toprak/bitki/kaya/su kartelası, ışık/çatı kesmesi, hayvan–araç–müşteri hareket ritmi ve fazlı sanat kabulü yazıldı. Anayasa §62.2, AGENTS, UI_DESIGN_SYSTEM, RULES, PLAN ve TEST_STRATEGY paftaya bağlandı. Hex değerleri kaynak UI tokenı değil başlangıç dünya sanat seçimidir; efektler para/stok/kayıt üretmez. Asset, render ve cihaz kanıtı henüz yoktur.

## 2026-09-27 dünya yerleşim paftası — belge kararı

Kullanıcı isteğiyle DUNYA_YERLESIM_PLANI.md oluşturuldu: 1 m hücreli `x0..47,z0..39` planlama ızgarası; P0 satış odası `x12..17,z22..27`, batı bahçe, P0 makine/raf/kasa kapıları ve iki hücrelik geçişler; A2–A4 oda matrisi; güney yol, park/servis girişleri ve peyzaj/hayvan bölgeleri koordinatlandı. AGENTS, ana kaynak §9, RULES, UI_DESIGN_SYSTEM, PLAN, KARARLAR ve TEST_STRATEGY paftaya bağlandı. Bu sayılar ürün kaynağındaki hazır koordinatlar değil, varsayılan uygulama seçimidir. Gerçek içerik footprint'i/servis hücresi ve cihazda rota doğrulanmadan sahne kabul edilmiş sayılmaz. Kod/native proje değiştirilmedi; önceki çalışma ağacı değişiklikleri korunur.

## 2026-09-27 görünür üretim zinciri ve mahalle yönü — belge kararı

Kullanıcının konsept karşılaştırma raporundaki iyileştirmeleri uygulama isteğiyle §67 ürün omurgası eklendi: P0 boş su rafında gerçek neden → uygun müdahale → gözlenen ürün/satış sonucu; A2 aynı kimlikli teşhis ve yerleşim etkisi; A3 kanıtlı dokuz yetenek/olay altyapısı; A4 tek Mahalle Gündemi kartı, seyrek hijyen, bültende neden–müdahale–sonuç, kriz seçiminin dünyada izi. §5/§6/§64'te çelişen eski ifadeler, PLAN, UI_DESIGN_SYSTEM, RULES, EKRAN_VE_MENU_AKISI ve TEST_STRATEGY eşlendi. §64 yüzdeleri hâlâ ölçülmemiş hipotez; hiçbir oyun kodu, ekonomi işlemi, cihaz veya oyuncu testi bu belge işiyle tamamlanmış değildir. Önceden var olan çalışma ağacı değişiklikleri korunur.

## 2026-09-27 ekran akışı ve oyun ansiklopedisi — belge revizyonu

Kullanıcı isteğiyle §66 ve EKRAN_VE_MENU_AKISI.md eklendi: dünya üstü açılış, HUD konumları, menü/kayıt/ayarlar, bütün mevcut panel düğmeleri ve geri/onay/hata yolları tanımlandı. Ayarlar'daki Oyun Ansiklopedisi çevrimdışı üretim şemaları, ürün/makine ve sistem rehberini ortak içerikten gösterir. P0 çekirdek maddelerle başlar; sonraki içerik kendi fazında gelir. UI_DESIGN_SYSTEM, CONTROLS_AND_UX, RULES, PLAN ve TEST_STRATEGY eşlendi; UI özetindeki A2 fiyat onayı ifadesi §58.1'e uygun A3 düzenleme/A2 tepki ayrımıyla düzeltildi. Belge düzenlemesidir; ekran/oyun kodu uygulanmadı, oyun veya cihaz testi çalıştırılmadı.

## 2026-09-27 yaşayan dış çevre — belge revizyonu

Kullanıcı isteğiyle ana kaynağa §65 eklendi: kedi/köpek/koyun, bitki/taş peyzajı, market önü otoparkı, gelip park eden ve ayrılan araçlar, aktif zamanda yol aşınması ve dönemsel tadilat. Görsel davranışlar UI_DESIGN_SYSTEM §10'a, uygulama listesi RULES'a, A4.3 işleri PLAN'a ve gelecekteki kabul senaryoları TEST_STRATEGY'ye işlendi. Otopark/çevre doğrudan yeni talep, kaynak veya bakım borcu üretmez. Süreler, yoğunluk ve park kapasitesi açık; P0 kapsamı değişmedi. Bu kayıt belge durumudur, çalışan özellik veya cihaz testi değildir.

## 2026-09-27 A–E market ritmi — belge revizyonu

Kullanıcı talebindeki sekiz market mekaniği ve deneyim yönü ana kaynak §64'e fazlı aday olarak işlendi. §52–54 ve §60.2'de eski kısa oturum/otomatik hedef sınırları ile yeni sürekli hedef akışı arasındaki değişim açık yazıldı; D-041 karar kaydı, PLAN aday kapısı ve ilgili katalog/domain/ekonomi/UI/UX/test belgeleri eşlendi. Tier 5 açılmadı. 3× teşhir, %15–20 sürpriz, +%25 sıcaklık, 60 aktif saniyelik dalga ve pazarlık +%20–30 değerleri denge hipotezidir. Bu satır belge durumudur; çalışan özellik, test veya cihaz kanıtı değildir. Önceden var olan çalışma ağacı değişiklikleri bu iş kapsamında sahiplenilmez.

## 2026-09-27 yerel ürün dengesi — belge kararı

Ana kaynak §26 ve Tier 1–4 katalogunda 1 ham su = 0,5 L; şişe/5 L/damacana 1/10/38 birim, 3/8/18 aktif saniye. Seviye 1 memba 0,5 birim/sn ve 80 birim hazne; yeni kayıt 100 kredi, 50 su, 12/4/2 ambalaj ve 8 domates tohumu. Ambalaj/tohum edinim bedelleri ve 3–8 dakikalık ilk döngü gerekçesi katalogdadır. İleri girdi tedariki/yerel açılış yolları ile üç finalin dört dalgalı yeni SKU/adetleri belgelendi. Sayılar tasarım ve aritmetik kontrolüdür; çalışan kod, cihaz veya oyuncu testi kanıtı değildir.

İlk depo incelemesi: 26 Eylül 2026. Ana kaynak [OYUN_GELISTIRME_DEVIR_DOSYASI.md](OYUN_GELISTIRME_DEVIR_DOSYASI.md) sürüm 3.0; faz sırası [PLAN.md](PLAN.md). Üstteki 27 Eylül kayıtları sonraki belge çalışmalarını anlatır.

## Doğrulanmış mevcut durum

Depoda Vite/React/TypeScript başlangıç iskeleti vardır. package.json React, R3F/Drei, Three.js ve Zustand beyan eder; src/App.tsx sayaçlı başlangıç ekranıdır. Bu gözlem bağımlılıkların başarıyla kurulduğunu, build/test geçtiğini veya oyun döngüsünün çalıştığını kanıtlamaz. Aktif hedef P0'dır; önceki “Phase 2 / altyapı tamamlandı” kaydı geçerli kabul kanıtı değildir.

26 Eylül incelemesinde 12 yan Markdown dosyası ana kaynakla uyumlu olarak düzenlenmişti. Sonraki 27 Eylül çalışmalarında anayasa ve başka belgeler ayrıca değişti; bu eski satır güncel dosya değişikliklerinin tam listesi değildir. Çalışan oyun, native proje veya mağaza çıktısı bu belge çalışmalarında teslim edilmedi; oyun build/test komutları çalıştırılmadı.

## 2026-09-26 belge kararları

| Konu | Karar ve gerekçe | Durum |
|---|---|---|
| Kaynak önceliği | §61–63 teknik/görsel; §58 kapsam; güncellenmiş sistem bölümleri | Belgelendi |
| Framework | İlk hedef DOM/CSS + Three.js; mevcut React paketleri zorunlu seçim değildir | Kod geçişi yapılmadı |
| Fazlar | A0/A1 işleri P0 içinde; P0→A2→A3→A4→A5 | Belgelendi |
| P0 ekonomi | Eski iki makine/tek küp prototipi yerel su ve domates kapsamıyla değiştirildi | Yeni §26; denge rakamları açık |
| Kayıt | Tek JSON/localStorage örneği yerine snapshot+günlük+durable işlem | Uygulama bekliyor |
| Monetizasyon | A4 sandbox; A5 yayın/mağaza doğrulaması | Entegrasyon yapılmadı |
| İçerik ayrıntısı | Anayasa kataloğuna referans; uydurma eşik/bonus/API zorunluluğu kaldırıldı | Belgelendi |
| D-001–D-006 | Üretim zinciri koruması, su kimliği ve açılış sarf konumu, A2 kapsamı, 9 yetenek bedeli, personel trait alanları | [KARARLAR.md](KARARLAR.md); henüz kod/test değil |
| D-007–D-016 | Yapıştırılan 100 sorunun simülasyon, kayıt, kamera, UI, stok, ekonomi, müşteri, çalışan, makine ve kurtarma cevapları | [KARARLAR.md](KARARLAR.md); cihaz/oyuncu doğrulaması bekliyor |
| D-017–D-020 | A–E görsel, UI, geri bildirim, P0 müşteri matematiği ve somut P0 veri şeması | [KARARLAR.md](KARARLAR.md), [DOMAIN_MODEL.md](DOMAIN_MODEL.md); uygulanmadı |
| D-021–D-026 | Runtime kimlik indeksleri, 10.000 atom/kredi, 5 tick sınırı, 3B hit/context kurtarma, JSON/lifecycle, ses sınırı, npm ve kod kapısı | [KARARLAR.md](KARARLAR.md); mimari karar, henüz kod/cihaz kanıtı değil |
| D-027–D-033 | End-card sınırı, reklam birim ekonomisi ve yükleme, yerel ödül/veri silme, çevrimdışı iade, yaş uygunluğu ve ücretsiz görev dengesi | [KARARLAR.md](KARARLAR.md), [MONETIZATION_AND_PRIVACY.md](MONETIZATION_AND_PRIVACY.md); SDK, cihaz ve hukuk doğrulaması A4/A5'te |
| D-034–D-039 | Klavye/Canvas, WebGL kurtarma, `es2020` build hedefi, ses yükleme, olay bazlı A* ve ortak safe-area tokenları | [KARARLAR.md](KARARLAR.md); kod/cihaz doğrulaması P0/A5'te |
| D-040 | A3 fiyat, aşırma ve borç başlangıç değerlerinin kaynağı ve test sınırı | [KARARLAR.md](KARARLAR.md); denge hipotezi, kod/oyuncu kanıtı değil |

## Açık kararlar ve bağımlılıklar

§38.4–38.6 için A3 başlangıç denge hipotezleri belgelendi: fiyat 1,00×/0,80×/1,50×; uygun peynir stoklu günde %20 ve en çok bir aşırma, en az 12 aktif saniye yakalama; Kooperatif 100 kredi ücretsiz, Konsorsiyum 300 kredi +15 kredi tek ücret, aynı anda tek borç ve günlük satış cirosundan %10 kesinti. Akü SKU'su/üretim yolu katalogda olmadığından olay kapsamı dışıdır. Bu sayılar benzer oyunların mekaniklerinden esinlenerek Orbit için seçildi; başka oyunlara ait değer veya oyuncu testi sonucu değildir. Kod/cihaz uygulaması ve denge testi yapılmadı. Mevcut çalışma ağacındaki diğer değişiklikler korunmuştur.


| Bilgi/karar | Şimdiki yaklaşım | Gerektiği kapı |
|---|---|---|
| Ekip/kapasite/bütçe | Tek geliştirici odaklı prototip varsayımı | Takvim/bütçe taahhüdü |
| Node/Three.js/Capacitor sürümü | Kurulum tarihinde uyumluluk doğrulanacak | P0 kurulum |
| React iskeleti uyumu | Çalışan yapıyı incele, minimum geçişi gerekçelendir | P0 kod işi |
| App ID, Android/iOS araçları ve cihazlar | Henüz doğrulanmadı | Native proje/build |
| macOS/Xcode, hesap/imzalama | Android başarısı iOS kabulü değildir | iOS cihaz ve imzalı dağıtım |
| P0 oda/yerleşim, prototip kredi | Geri alınabilir karar olarak kaydet | P0 içerik kurulumu |
| A2 ürün/makine/tedarik zinciri | Üç ürün, üç makine ve Yerel Kooperatif D-004'te sabit; SKU erişimi kaynak katalogda doğrulanacak | A2 kabulü |
| Asset/ses/font lisansı ve bütçe | Özgün/lisanslı placeholder | Son sanat/A5 |
| İlk diller | TR prototip; TR/EN anahtar hazırlığı | Son metin ve QA |
| Reklam/IAP sağlayıcı ve yaş grubu | P0'da gerçek SDK yok | A4 sandbox ve gizlilik |
| Pazar talebi/kozmetik dönüşümü | Doğrulanmamış hipotez | Tam içerik yatırımını büyütme |
| İsim/marka ve mağaza koşulları | Yayın öncesi araştırma | A5 |

Ana metin içindeki yorum farklarında kapsamı büyütme: §62.4 A2 sanat sayıları §58.1 üç makine kapsamını artırmaz; §63.2 A4 sandbox'ı §58.1 A5 yayın ödemesinden ayrıdır. Yeni gerçek çelişkileri kaynak bölümleriyle karar kaydına ekle; anayasa değişikliği bu işin kapsamında değildir.

## Sonraki iş ve kanıt düzeni

Kod geliştirme talep edildiğinde PLAN.md Faz 0/P0 ile başla. Bu belge revizyonu kendi başına kod yazma veya yayın yetkisi değildir. Karar kayıtları gelecekte `docs/decisions`, denge verileri `docs/balance`, oyuncu denemeleri `docs/playtests` altında tutulur; bağımlılık/asset lisansları için THIRD_PARTY_NOTICES.md uygulama sırasında hazırlanır. Üretilmeyen dosyalar varmış gibi raporlanmaz.

Her devamda değişen dosyalar, hedefli kontrol, gerçek cihaz kanıtı ve açık engelleri güncelle. Doğrulanmayan işi tamamlandı işaretleme.

## Ayrıntılandırma revizyonu — 26 Eylül 2026

Kullanıcı isteğiyle yüzeysel uygulama alanları genişletildi: kaynak/karar/açık/kanıt ayrımı, komut önkoşulları, durum makineleri, save/crash protokolü, lot muhasebesi, pointer sahipliği, personel/final sınırları ve sayısal test fixture'ları. IMPLEMENTATION_RULES.md ile MONETIZATION_AND_PRIVACY.md eklendi. Mevcut 12 yan belge genişletildi; anayasa ve kod aynı kapsam sınırında korundu.

Yeni teknik taslaklar uygulanmış API değildir. Önerilen atom ölçeği, komut reason isimleri, tick sırası ve müşteri durum isimleri uygulama sırasında karar olarak doğrulanacaktır. Reklam sağlayıcısı/güvenilir sunucu doğrulaması, gerçek saat anomalileri, bekleyen ödülde havuz tükenmesi ve iade edilmiş kozmetik fallback'i A4 açıklarıdır. Mevcut geliştirme kabulü ilerlemedi: P0 hâlâ tamamlanmadı, oyun build/test veya cihaz ölçümü bu belge işi sırasında çalıştırılmadı.
