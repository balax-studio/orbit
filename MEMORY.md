# Devir durumu ve karar kaydı

## 2026-09-27 A–E market ritmi — belge revizyonu

Kullanıcı talebindeki sekiz market mekaniği ve deneyim yönü ana kaynak §64'e fazlı aday olarak işlendi. §52–54 ve §60.2'de eski kısa oturum/otomatik hedef sınırları ile yeni sürekli hedef akışı arasındaki değişim açık yazıldı; D-041 karar kaydı, PLAN aday kapısı ve ilgili katalog/domain/ekonomi/UI/UX/test belgeleri eşlendi. Tier 5 açılmadı. 3× teşhir, %15–20 sürpriz, +%25 sıcaklık, 60 aktif saniyelik dalga ve pazarlık +%20–30 değerleri denge hipotezidir. Bu satır belge durumudur; çalışan özellik, test veya cihaz kanıtı değildir. Önceden var olan çalışma ağacı değişiklikleri bu iş kapsamında sahiplenilmez.

## 2026-09-27 yerel ürün dengesi — belge kararı

Ana kaynak §26 ve Tier 1–4 katalogunda 1 ham su = 0,5 L; şişe/5 L/damacana 1/10/38 birim, 3/8/18 aktif saniye. Seviye 1 memba 0,5 birim/sn ve 80 birim hazne; yeni kayıt 100 kredi, 50 su, 12/4/2 ambalaj ve 8 domates tohumu. Ambalaj/tohum edinim bedelleri ve 3–8 dakikalık ilk döngü gerekçesi katalogdadır. İleri girdi tedariki/yerel açılış yolları ile üç finalin dört dalgalı yeni SKU/adetleri belgelendi. Sayılar tasarım ve aritmetik kontrolüdür; çalışan kod, cihaz veya oyuncu testi kanıtı değildir.

Tarih: 26 Eylül 2026. Ana kaynak [OYUN_GELISTIRME_DEVIR_DOSYASI.md](OYUN_GELISTIRME_DEVIR_DOSYASI.md) sürüm 3.0; faz sırası [PLAN.md](PLAN.md).

## Doğrulanmış mevcut durum

Depoda Vite/React/TypeScript başlangıç iskeleti vardır. package.json React, R3F/Drei, Three.js ve Zustand beyan eder; src/App.tsx sayaçlı başlangıç ekranıdır. Bu gözlem bağımlılıkların başarıyla kurulduğunu, build/test geçtiğini veya oyun döngüsünün çalıştığını kanıtlamaz. Aktif hedef P0'dır; önceki “Phase 2 / altyapı tamamlandı” kaydı geçerli kabul kanıtı değildir.

Bu revizyonda diğer 12 Markdown dosyası ana kaynakla uyumlu olarak düzenlendi. Anayasa, kaynak kod, bağımlılıklar ve yapılandırma değiştirilmedi. Çalışan oyun, native proje veya mağaza çıktısı teslim edilmedi; oyun build/test komutları çalıştırılmadı.

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
| D-001–D-006 | Üretim zinciri koruması, su kimliği, P0 tedarik noktası, A2 kapsamı, 9 yetenek bedeli, personel trait alanları | [KARARLAR.md](KARARLAR.md); henüz kod/test değil |
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
