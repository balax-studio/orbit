# Orbit Market — UI/UX ve görsel uygulama kuralları

Bu belge ekran, etkileşim ve dünya görünümünü uygularken kullanılan kısa kontrol sözleşmesidir. Bağlayıcı kaynak [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §9, §60–63; ayrıntı [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md), [CONTROLS_AND_UX.md](CONTROLS_AND_UX.md) ve [KARARLAR.md](KARARLAR.md) içindedir. Kaynak değerleri ile P0 tasarım seçimlerini ayır; çelişkide anayasayı esas al. Bu kurallar uygulanmış oyun veya geçirilmiş test iddiası değildir.

## 1. Oyuncunun gördüğü temel döngü

- Açılışta oynanabilir dünya ve tek etkin hedef görünür. Taşı → üret → rafla → sat adımları sahnede anlaşılır olmalıdır.
- Oyuncunun fiziksel karakteri vardır. Dokunmak uzaktan stok taşımaz; işlem erişim, kapasite ve rezervasyon doğrular.
- İlk anlamlı döngü hedefi 3–8 dakikadır; bu zorunlu oturum sonu değildir (§60.2 revizyonu). Öğretim kısa ve atlanabilir metin kullanır; ilerleme gerçek eylemden gelir.
- İş devri oyuncunun tekrar eden yükünü azaltır. Canlı dünya görüntüsü gerçek üretim ve müşteri davranışını açıklamalıdır.
- Sahte kıtlık, zorunlu reklam, günlük seri kaybı veya kapalıyken ceza ekleme. Çevrimdışı simülasyon ilerlemez.

## 2. Görsel dil ve token'lar

UI DOM/CSS tabanlı Neo-Brutalist; dünya mat low-poly kübik/prizmatiktir. Mevcut React/Tailwind/R3F araçları bu sanat sözleşmesini değiştirmez.

| Token | Değer | Kullanım |
|---|---|---|
| ink | `#171717` | Metin, kontur, koyu taşıyıcı |
| paper | `#F4F0E6` | Ana panel/zemin |
| sun | `#FFE156` | Ana eylem, kredi, seçim |
| cyan | `#35D9E6` | Bilgi ve üretim |
| lime | `#A7EB52` | Uygun/tamamlandı |
| pink | `#FC4F8B` | İkaz/hikâye vurgusu |

- Kontur 2–3 CSS px; buton sert gölgesi 3–4 px, panel 4–5 px; blur 0; köşeler 6–10 px. Gradient veya glassmorphism ekleme.
- Başlık ağırlığı 800–900; uzun metin normal cümle düzeninde; finansal rakamlar tabular. Türkçe karakterleri ve font lisansını doğrula.
- İkonlar kalın, okunur SVG; ürün arayüzünde emoji ikon sistemi kullanma. İkonun erişilebilir adı olsun.
- Renk tek anlam taşıyıcısı değildir: hata/başarı/seçim ikon, kontur ve metinle de anlaşılır.
- Dünya UI aksanlarından daha düşük doygunluktadır; mat yüzey ve 2–3 faset tonu kullan. Bütün nesneleri aynı anda parlatma.

## 3. Ekran, kamera ve yerleşim

- Telefon/tablet portre düzeni; 9:16–9:21 telefon oranı ve portre tablet kabulü. Safe-area, çentik ve home indicator hesaba katılır.
- Başlangıç bölgeleri: üst yaklaşık %12 kredi/görev/duraklat, orta yaklaşık %65 dünya, alt yaklaşık %18 hareket ve en fazla üç ana eylem. Bunlar katı piksel koordinatı veya toplamı %100 olan zorunlu bölüşüm değildir.
- Telefon detayları alt panel, tablette uygun yan panel olarak açılır; aynı anda bir ana yönetim sayfası vardır. Seçili nesne HUD altında kaybolmaz.
- §9 varsayılan oda 6×6 hücre, hücre 1 metre; koridor en az 2 hücre. Makine footprint'i katalogdan alınır; P0 yetiştirici 2×2, paketleyici 1×2.
- Ortografik kamera 45° yatay/30–35° aşağı eğim. D-017 P0 seçimi 32°, hedef `(3,0,3)`, başlangıç yaklaşık `(11,7.07,11)`; frustum ekrana göre ayarlanır.
- İki parmak pan/zoom ve karaktere dön vardır; serbest orbit yoktur. İnşa döndürmesi nesneye aittir. Aspect ratio değişince dünya esnetilmez.
- Duvar seçili aktörü kapatıyorsa yalnız örten görsel parça soluklaşır/kesilir veya siluet kullanılır; collider değişmez.

## 4. Dokunma ve inşa

- Joystick varsayılan, dokun-git alternatifidir; sağ/sol el yerleşimi sunulur. Uzun basış kritik eylemin tek yolu olamaz.
- Uyumlu istasyonda 0,3 saniye sabit durduktan sonra güvenli al/bırak yapılır. Yoldan geçmek harcama, satış, işe alma veya tarif değişimi tetiklemez.
- Pointer başladığı UI/joystick/dünya/inşa sahibinde up/cancel'a kadar kalır. UI'dan canvas'a sürüklemek dünya komutu üretmez.
- İki parmak kamera yalnız hareket çubuğu devre dışıyken çalışır; üçüncü parmak ek işlem yaratmaz. Touchcancel hareketi nötrler.
- İnşa: içerik/bedel → grid önizlemesi → sürükle/döndür → doğrula → onay/iptal. İnşada simülasyon durur.
- Onayda footprint, çakışma, servis hücresi, kapı/kasa/aktör yolu, güç, stok ve son maliyet tekrar doğrulanır. Geçersizlik yalnız kırmızı renkle anlatılmaz.
- Taşınan makinenin kimliği, parti süresi ve envanteri korunur; iptal kaynak tüketmez. Son temel üretim yolunu erişimsiz veya kurtarılamaz bırakamazsın.
- Çalışan makine gibi grid'e yerleştirilmez: personel panelinden işe alınır ve göreve atanır; faz erişimi korunur.

## 5. Ekran ve durum sözleşmesi

| Ekran | Gösterilecek bilgi | Temel eylem/hata |
|---|---|---|
| HUD | Kredi, yük, tek hedef, önemli darboğaz | Hareket, inşa, duraklat |
| İstasyon | Girdi/çıktı, kalan süre, durma nedeni | Uyumlu transfer; dolu/eksik/erişimsiz |
| İnşa | Footprint, servis alanı, maliyet | Onay/iptal; eski önizleme tekrar doğrulanır |
| Kayıt kurtarma | Gerçek kayıt hatası ve son iyi durum | Tekrar dene/kurtar; sessiz yeni kayıt yok |
| Depo/tedarik (A2) | Serbest/rezerve/yoldaki miktar, slot, fiyat ve teslim | Sipariş/kabul; yer yoksa ürün kaybolmaz |
| Raf etiketi (A3) | SKU/kilit, mevcut ve adil fiyat, piyasa/indirimli/pahalı etki ve zarar uyarısı | Dokunarak aç/onayla; geçersiz fiyat veya uyumsuz stok nedenini göster |
| Borç (A3) | Kurum, anapara, toplam yükümlülük, %10 günlük ciro kesintisi, kalan borç | Koşulları gör/onayla; yetersiz nakitte negatif bakiye yok |
| Personel (A2/A3) | Görev, faza uygun mola/ücret/enerji bilgisi | Atama/devir; yapılamayan işin nedeni |
| İlerleme (A3/A4) | Bedel, önkoşul, gerçek kazanım | Kilit nedeni; tanımsız düğüm satın alınabilir görünmez |

Her uygulanmış panel normal, boş, seçili, pasif, işlem bekliyor, başarılı ve hata hallerinden kendisine uygun olanları tanımlar. Ağ/kayıt beklemesi gerekiyorsa gösterilir; yerel hazır veri için sahte loading üretilmez. `pending` komutunda tekrar basış yeni transaction açmaz.

## 6. Geri bildirim, metin, hareket ve ses

- Satışın kalıcı kaydı onaylanınca kredi güncellenir; P0'da gerçek satılan ürünün tutarı kısa bir vurguyla yalnız bir kez görünür. Bekleyen işlem başarı gibi kutlanmaz.
- Üretim çubuğu aktif tick'ten türetilir. `Running`, `NoInput`, `NoPower`, `BlockedOutput`, `Ready` durumları metin/ikonla ayrılır; animasyon ürünü üretmez.
- Hata metni neden + yapılabilir adım içerir: “Çıkış dolu · Ürünleri depoya taşı.” Kritik hata kaybolan tek toast'a bırakılmaz.
- Yetersiz kredi pasif düğmenin yanında somut eksik tutarla gösterilir. Gizli ücret, yanlış geri alma vaadi veya bilinmeyen başarı mesajı yazma.
- Mikro geri bildirim 80–120 ms, panel 140–180 ms, işlem vurgusu 180–260 ms başlangıç sanat seçimidir; ekonomik zaman değildir. Az harekette öteleme/sallanma kaldırılır.
- Sürekli pulse, ekran sarsıntısı ve görsel kalabalık yoktur. Çoklu tamamlanma sesleri gruplanır; background'da ses durur, dönüşte birikmiş ses çalmaz.
- Ses ve hafif titreşim kapatılabilir. Kritik bilgi yalnız ses/titreşimle verilmez.
- A4 alma–taşıma–koyma ritmi gerçek transfer durumunu izler; önerilen sonraki hedef otomatik görünebilir, fakat görev kabulü veya stok harcaması kendiliğinden gerçekleşmez (§52.2, §64).
- Aynı tick'te makine sesleri D-025'e göre gruplanır: aynı ses varyantı en fazla 2, toplam oyun efekti başlangıçta en fazla 8 eşzamanlı ses. Sayılar cihaz ses denemesiyle ayarlanır; bitiş olayları Domain'de eksilmez.

## 7. Yaşayan dünya ve ürün görünümü

- Raf doluluğu gerçek adetlerden temsilî yığın olarak görünür; her stok birimine mesh oluşturma. Etiket adet/kalite/fiyatı doğru konumdan okur.
- Makine çalışması, giriş eksikliği, çıkış doluluğu ve güç beklemesi farklı görünür. Boş makine çalışıyor gibi efekt üretmez.
- Depo, kabul alanı ve taşıyıcı yükü farklı aşamalardır; yoldaki mal rafta gösterilmez. İptal edilen görev yükü silmez.
- Müşteri giriş → raf → kasa → kuyruk → çıkış yolunu izler. Sıra ayrı hücrelerde görünür; sabır/kayıp satış görseli gerçek durumdan gelir.
- A3 pahalı fiyat reddinde müşteri rafta kısa baş sallar ve SKU'ya uygun konuşma/metinle çıkar. Aşırmada şüpheli ve oyuncu/çırak yakalama hedefi seçilir; geri alınan ürün yalnız kalıcı lot dönüşünden sonra görünür.
- Personelin yürüme, yük taşıma, al/bırak, idle ve fazı açıldıysa mola pozu aynı mantıksal göreve bağlıdır. Yol beklerken yerinde koşma yoktur.
- A4 ortam NPC'leri iş aktörlerini ve yolları kapatmaz; müşteri/talep sayılmaz. İlerlemeyle açılan ücretsiz sahne ayrıntıları kayıtlı hikâye sonucundan türetilir.
- A4 adaylarında VIP, hijyen, Bülten, teşhir, Tier 4 pazarlığı, trend, vardiya dalgası ve cazibe yalnız gerçek Domain olayından görünür. Teşhir boş rafı satmaz; değerlendirme uydurma sosyal kullanıcıya dayanmaz; kozmetik dekor fazladan puan vermez (§64).
- Ürün/makine siluetleri, market içi/dışı ve odaların tam listesi [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md) §4–12'dedir; burada ikinci bağımsız katalog oluşturma.

## 8. Erişilebilirlik ve oyuncu deneyimi

- Dokunma tabanı iOS 44 pt, Android 48 dp eşdeğeridir; CSS/viewport karşılığı gerçek cihazda doğrulanır.
- Büyük metinde fiyat/eylem kesilmez. Başlık/label/button semantiği, odak sırası ve modal kapanınca önceki odağa dönüş korunur.
- Kontrast gerçek token çiftleriyle kontrol edilir; neon yüzeylerde okunabilir koyu metin kullan. Renk körlüğünde anlam kaybolmasın.
- Kısa eylem–açık sonuç, tek etkin hedef, görünür darboğaz ve yanlış dokunuştan güvenli dönüş önceliklidir.
- Öğretim/oyuncu denemesinde “Neden durdu?”, “Ne değişti?”, “Şimdi ne yapabilirim?” cevapları anlaşılmıyorsa görünümü/akışı düzelt. Psikolojik ilke yazmak kullanıcı testi kanıtı değildir.

## 9. Veri, performans ve faz kabulü

- Domain 10 Hz, render varsayılan 30/isteğe bağlı 60 FPS. R3F varsa görsel interpolasyon frame döngüsündedir; bütün component ağacı her tick yeniden render edilmez.
- Düşük profil hedefi ≤150 draw call, ≤150 bin görünür üçgen, ≤25 animasyonlu karakter; DPR düşükte ≤1,25/üstte ≤1,5. Blob/baked gölge, atlas ve instancing kullan; bloom varsayılan kapalıdır.
- Görsel kaliteyi azaltmak üretim süresi, talep, kapasite, sabır veya ücretleri değiştirmez. Context-loss'ta aynı Domain'den sahne kurulur.
- P0: tek oda, su kaynağı/şişeleme/domates yatağı, üç su boyutu ve taze domates, tek müşteri davranışı, tek raf görevlisi. A2: ilk işlenmiş gıda/mandıra/içecek, depo/tedarik/mola; A3 sistemler, A4 tam içerik, A5 yayın. Sanat hedefi yeni oynanabilir içerik açma yetkisi değildir.
- UI kopya ledger/envanter tutmaz. Veri tipleri [DOMAIN_MODEL.md](DOMAIN_MODEL.md), komut akışı [ARCHITECTURE.md](ARCHITECTURE.md) üzerinden alınır. Bağlayıcı denge değerleri [ana kaynakta](OYUN_GELISTIRME_DEVIR_DOSYASI.md) kalır; [yerel ürün ağacı](OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md) taslaktır.

## 10. Bir görsel değişikliği bitirme kontrolü

1. Kaynak/karar ID'si ve ürün fazı doğru; eklenen ekranın bütün gerekli durumları var.
2. Telefon ve tablet oranı, safe-area, büyük metin ve azaltılmış hareket uygun kapsamda kontrol edildi.
3. Dünya/UI pointer ayrımı, geri/iptal, onay ve kesintiden dönüş bozulmadı.
4. Gösterilen fiyat, miktar, süre ve başarı gerçek Domain sonucuna bağlı; kaynak değerleri ayrı yerde kopyalanmadı.
5. Görsel inceleme ve gerekiyorsa performans ölçümü gerçek cihaz/build bilgisiyle kaydedildi. Yapılmadıysa açıkça belirtilir.

Ayrıntılı kabul kimlikleri [TEST_STRATEGY.md](TEST_STRATEGY.md) ve UI_DESIGN_SYSTEM.md görsel kabul tablosundadır. Rol/iş akışı için [AGENTS.md](AGENTS.md); belirsiz değer ve değişiklik gerekçesi için KARARLAR.md kullanılır.
