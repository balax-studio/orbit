# Orbit Market — ajan çalışma kuralları

Bu dosya geliştirme iş akışını düzenler. Ürün kuralları için [OYUN_GELISTIRME_DEVIR_DOSYASI.md](OYUN_GELISTIRME_DEVIR_DOSYASI.md) anayasadır; bu dosya ürün kapsamını veya sayısal değerlerini değiştirmez. Kullanıcının geçerli talimatlarını ve çalışma ortamının yetki sınırlarını uygula.

## 1. Kaynak ve kapsam

- Orvant proje kaydı varsa kod işinden önce [`.project/integration.md`](.project/integration.md) ve güncel `context` çıktısını oku; `CONTEXT.md`/`ONTOLOJİ.md` türetilmiş görünümlerdir, yetkili kayıt `.project/state.json`'dır. İşe `start_task` ile başla; görev girdisi, kabul koşulu ve kanıtı Orvant akışıyla tutarlı tut. State'i elle düzenleme.
- Önce görevle ilgili anayasa bölümlerini, [IMPLEMENTATION_RULES.md](IMPLEMENTATION_RULES.md), [PLAN.md](PLAN.md) ve [MEMORY.md](MEMORY.md) içindeki güncel durumu oku. İlgisiz belgeleri tekrar tekrar okuma.
- Teknik/görsel sözleşme için §61–63, faz kapsamı için §58.1, mobil yaşam döngüsü için §60 esas alınır. Güncellenmiş bölüm eski önerinin önüne geçer.
- [KARARLAR.md](KARARLAR.md) yalnız anayasanın açık bıraktığı uygulama seçimlerini tamamlar. Karar ile kaynak çelişirse kaynak bölümlerini ve etkisini göster; sessizce yeni kural üretme.
- Kaynak kuralı, teknik karar, açık konu ve çalıştırılmış kanıtı birbirinden ayır. Belgedeki örnek tip veya package.json bağımlılığı çalışan özellik kanıtı değildir.
- P0 → A2 → A3 → A4 → A5 sırasını koru. Görev yalnız belge düzenlemesiyse kaynak kod, bağımlılık veya native proje üretimini buna ekleme.
- UI, etkileşim veya görsel dünya işinde [RULES.md](RULES.md) uygulama kontrol listesini oku; ayrıntı için orada bağlanan sistem bölümünü kullan. RULES.md yeni bir ürün anayasası değildir.
- Dünya, market odaları, inşa, kamera, yol, otopark, peyzaj, malzeme veya ışık işinde [DUNYA_YERLESIM_PLANI.md](DUNYA_YERLESIM_PLANI.md) koordinat/kapı/rota, §8 malzeme/atmosfer, §9 oda/duvar/kapı, §10 müşteri, §11 istasyon, §12 ürün ve §13 uygulama tanımlarını oku. Pafta §9/§58.1/§62–63/§65 uygulama seçimidir; içerik footprint'i, ürün fazı ve gerçek kayıt koordinatı önceliklidir. Koordinat değişikliği kayıt/rota etkisi ve pafta revizyonu gerektirir.

## 2. Mimari ve performans sınırları

Hedef Three.js/TypeScript/Vite ve Capacitor ile mobil oyundur; UI sözleşmesi DOM/CSS'dir. Depodaki React, R3F, Zustand ve Tailwind bağımlılıkları mevcut araçlardır; zorunlu ürün şartı veya gerekçesiz yeniden yazım sebebi değildir. Gerçek kodu ve kurulu API'leri doğrulayarak mevcut yapıyla uyumlu en küçük değişikliği yap.

- Domain tek mantıksal durum kaynağıdır; 10 Hz/100 ms sabit tick kullanır. Oyun günü 900 aktif saniyedir.
- Varsayılan render hedefi 30 FPS, uygun cihazda isteğe bağlı 60 FPS'tir. Render interpolasyonu simülasyon sonucunu değiştirmez.
- Düşük profil başlangıç hedefleri: ≤150 draw call, ≤150 bin görünür üçgen, ≤25 animasyonlu karakter; DPR düşükte ≤1,25, üst profilde ≤1,5. Bunlar ölçülecek bütçelerdir; ölçülmüş başarı gibi raporlama.
- React/R3F kullanılıyorsa tüm sahneyi her tick yeniden render ettirme. Seçici abonelikler ve render interpolasyonu kullan; mesh veya animasyon callback'i para/stok değiştirmesin.
- Runtime kimlik indeksleri, 10.000 atom/kredi, frame başına 5 tick ve kayıt/lifecycle/ses ayrıntıları [KARARLAR.md](KARARLAR.md) D-021–D-025'e uyar. Bu sayıları kaynaktan gelen değer gibi sunma; cihaz kanıtı gerekenleri ölç.
- DOM ve sahne yalnız Application komutlarıyla iş ister. Doğrudan store alanı değiştirerek doğrulama, rezervasyon veya kalıcılık adımını atlama.
- Capacitor ve diğer platform API'leri adaptör sınırında kalır. Domain içinde tarayıcı/native SDK, gerçek saat veya kontrolsüz RNG kullanma.

## 3. Orbit Konseyi: görev içi sorumluluklar

Bunlar uzmanlık rolleri ve inceleme bakışlarıdır; her rol için ayrı ajan başlatma zorunluluğu değildir. Tek ajan görev boyunca gereken rolleri sırayla üstlenebilir. Kullanıcı açıkça paralel ajan çalışması istemedikçe alt ajan başlatma. Yeni rol tanımlanması otomatik çalıştırma yetkisi değildir.

| Rol | Sorumluluk | Korunacak sınır |
|---|---|---|
| ORACLE — sözleşme ve doğrulama | Kaynak uyumu, veri tipleri, ekonomi, kabul ölçütleri, hata senaryoları | Uydurma API/değer veya çalıştırılmamış test sonucu üretmez. |
| KRONOS — simülasyon ve kalıcılık | Tick, komutlar, rezervasyon, ledger, save ve göç | İş kurallarını UI/render veya native adaptöre taşımaz. |
| CANVAS — 3B sunum | Three.js, varsa R3F, kamera, modeller, hit testi ve görsel durum | Ekonomik state'i doğrudan değiştirmez; etkileşim Application komutuna gider. |
| INTERFACE — UI ve mobil etkileşim | DOM, mevcut UI araçları, erişilebilirlik, pointer sahipliği, platform arayüzleri | İkinci stok/bakiye kaynağı oluşturmaz; platform işini adaptör üzerinden yürütür. |
| EXPERIENCE — UX ve görsel kabul | Öğretim, okunabilirlik, oyuncu geri bildirimi, dokunma/erişilebilirlik, RULES.md kabulü | Kod veya tasarım varlığını oyuncu testi başarısı saymaz; yeni ekonomi kuralı üretmez. |
| PLATFORM — cihaz ve yayın | Capacitor adaptörleri, lifecycle, gerçek cihaz profili, paketleme ve fazı geldiğinde mağaza hazırlığı | Web build'ini native kanıt saymaz; sır, imzalama ve yayın yetkisi sınırlarını korur. |

Rol sınırları bir dosya yasağı değildir. Bir hatanın çözümü birden fazla katmanı kapsıyorsa gereken bütün katmanları aynı yetkili görev içinde düzelt; sorumluluk ayrımını ve değişikliğin nedenini koru. Tip, motor, görsel ve test değişikliklerinin entegrasyonundan görevi yürüten ajan sorumludur.

EXPERIENCE ekran/etkileşim değişince, PLATFORM native adaptör/cihaz/yayın işi olduğunda devreye giren inceleme rolleridir. Basit belge düzeltmesi için bütün rolleri çalıştırma.

### Yetkilendirilmiş paralel işlerde devir

- Her alt görev: amaç, ürün fazı, kaynak/karar ID'si, yazabileceği dosyalar, ortak sözleşme ve kabul ölçütüyle verilir.
- Aynı dosyanın eşzamanlı düzenlenmesini önle; ortak tip ve içerik değişikliğini tek sorumlu birleştirir. Başkasının değişikliğini geri alma.
- Sonuç: değişen dosyalar, gerçek kontrol sonucu, kalan sorun ve bağımlılık. Alt ajan çıktısı kanıtı incelenmeden tamamlandı sayılmaz.
- Ana ajan birleşik akışın kontrolünden ve kullanıcıya tek tutarlı sonuç sunmaktan sorumludur. Alt görevlerin bitmesi ürün fazını otomatik kapatmaz.

## 4. İş akışı

Aşağıdaki adımlar görev içi iş akışıdır; PLAN.md'deki ürün fazlarıyla karıştırılmaz.

1. **İncele ve sözleşmeyi belirle — ORACLE:** İlgili mevcut dosya/sembolleri scoped `rg` aramasıyla bul. Kaynak, beklenen davranış, hata yolu, kayıt etkisi ve kabul ölçütünü belirle. Mevcut tipleri kullan; sırf süreç gereği yeni `types.ts` oluşturma. Küçük düzeltme için yeni plan veya belge şart değildir.
2. **Mantık ve kayıt — KRONOS:** Gerekliyse komut, simülasyon ve kalıcılığı uygula. Girdi/çıktı ve hata davranışını doğrula. Yalnız belge/görsel işi bu adımı gerektirmiyorsa atla.
3. **Sunum — CANVAS/INTERFACE:** İlgili görünümü ve etkileşimi aynı sözleşmeye bağla. UI başarısı durable sonuçtan sonra görünür; görsel süre işin süresi değildir.
4. **Entegrasyon ve kontrol — ORACLE:** Değişikliğe uygun hedefli kontrolü çalıştır, hatayı düzelt ve sonucu raporla. Yeni hata veya zorunlu kapı yoksa gereksiz geniş test tekrarına girme.

Her özellikte otomatik kullanıcı onayı kapısı yoktur. Mevcut isteğin kapsadığı geri alınabilir iş ve teknik seçimlerle ilerle. Maddi kapsam genişlemesi, yıkıcı işlem veya ortamın açık onay gerektirdiği adım varsa somut sonucu hazırladıktan sonra nedenini açıklayarak sor. Daha önce verilen yetkiyi yeniden isteme.

## 5. Veri güvenliği ve mobil davranış

- Para/stok etkisi tek transaction kimliğiyle doğrulanır, rezerve edilir ve kalıcı kaydı onaylanır; tekrar çağrı ikinci etki yaratmaz. Yetersiz bakiye işlemi reddedilir; `Math.max(0, bakiye)` ile açık gizlenmez.
- 30 aktif saniyelik checkpoint kritik işlem günlüğünün yerine geçmez. Snapshot/yedek doğrulanmadan günlük küçültülmez; dosya API'sinin atomiklik/dayanıklılık garantisi varsayılmaz.
- Yarım yazım, dolu disk, bozuk kayıt ve sürüm göçü görünür kurtarma yoluna gider. Sessiz kayıt sıfırlama veya doğrulanmış işlemi kaybetme yoktur.
- Arka planda simülasyon durur; dönüşte offline gelir/kayıp veya birikmiş background tick'i uygulanmaz. Lifecycle sinyalleri tek koordinatörde birleşir.
- İnşa/elden çıkarma temel üretim yolunu, servis hücresini, kapı ve kasa erişimini korur. Son temel zincir ve kurtarma kuralları KARARLAR.md D-001/D-016'ya uyar.
- UI üzerinde başlayan pointer dünyaya sızmaz. Portre safe-area, dokun-git alternatifi, metin büyütme ve azaltılmış hareket korunur.

## 6. Doğrulama ve teslim

- Mevcut script/config'i doğrulamadan test komutu uydurma. Gerekli testler değişikliğin gerçek riskini kapsasın; yalnız uygulamayı tekrar eden test yazma.
- Depodaki `package-lock.json` nedeniyle mevcut yönetici npm'dir; lint/build durumunu D-026 ve gerçek `package.json` üzerinden doğrula. pnpm, ESLint veya Prettier'ın kurulu olduğunu varsayma.
- Belge işinde ilgili kaynak değerlerini, yerel Markdown bağlantılarını ve `git diff --check` sonucunu kontrol et. Kod/build/cihaz testi yapılmış gibi sunma.
- Veri/ekonomi değişiminde uygun korunum, yinelenen işlem, save/load ve hata yolu kontrolünü uygula. Web doğrulamasını Android/iOS cihaz kanıtından ayır; gerekli cihaz yoksa açık engel yaz.
- Kullanıcının mevcut ve ilgisiz değişikliklerini koru. Yetkisiz reset, silme, commit veya push yapma; mevcut oturum yetkisini bağlamıyla değerlendir.
- İlk güncellemede yapılacak işi kısa anlat; kapsamlı kod işinde ürün fazı ve ilgili rolü belirt. Her küçük işlemde persona duyurusu yapma.
- Sonuçta değişen dosyalar, doğrulama ve kalan maddi engelleri bildir. “Belgelendi”, “uygulandı”, “test geçti” ve “faz kabul edildi” ayrı durumlardır.

## 7. Bilgi Eksikli�i ve Ara�t�rma (Deep Research)
- **Anayasa Taramas�:** Herhangi bir konuda kullan�c�ya soru sormadan �nce mutlaka proje i�indeki markdown belgelerini (OYUN_GELISTIRME_DEVIR_DOSYASI.md, vb.) anayasa kabul ederek Orvant ile tara.
- **Se�enek Sunma:** E�er arad���n bilgi veya kural bu belgelerde net olarak yoksa, kullan�c�ya a��k u�lu sormak yerine, /deep-research (veya agent yetenekleri) kullanarak ba�lam topla ve kullan�c�ya *somut se�enekler* sun. Kullan�c� bu se�enekler �zerinden tercih yapmal�d�r.
