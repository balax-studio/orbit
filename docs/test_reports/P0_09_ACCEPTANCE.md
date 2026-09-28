# P0-09 — gerçek cihaz ve dış oyuncu kabulü

Durum (2026-09-27): **incelemede/bloklu; kabul edilmedi.** Orvant revizyon 145'te D-044 kabul edildi; P0-02/P0-06/P0-08 güncel kanıt bekliyor ve P0-01'in kaynak kanıtı yenilenene kadar bağımlılıkları bloklu. Gerçek cihaz ve dış oyuncu kabulü yapılmadı.

## Mevcut hazırlık sonucu

| Alan | Gerçek gözlem | Sonuç |
|---|---|---|
| Web paket | `npm run build` geçti; Vite 8.3.1, 46 modül, ana JS 849.99 kB; 500 kB uyarısı var | Yalnız web derlemesi |
| Kod kontrolleri | `npm test`: 11 dosyada 99/99; `npm run lint`: geçti | Simülasyon ve kod kanıtı; cihaz/oyuncu kabulü değil |
| Yerel ön izleme | `http://127.0.0.1:5173/` açıldı; 12×12 satış modülü, 12×16 üretim bahçesi ve HUD görüldü. `SceneRenderer` güncel Three.js gölge seçeneğini kullanıyor; son yüklemede yeni konsol hatası/uyarısı oluşmadı | Web ön izlemesi; Android/iOS cihazı değil |
| Android | Bu Windows ortamında `java`, `adb`, `gradle` komutları ve `ANDROID_HOME`/`ANDROID_SDK_ROOT` bulunmadı; fiziksel cihaz bilgisi yok | Build ve cihaz denemesi yapılmadı |
| iOS | Bu Windows ortamında Xcode/macOS ve iOS cihaz erişimi yok | Build ve cihaz denemesi yapılmadı |
| Dış oyuncu | Katılımcı ve gözlem kaydı yok | Deneme yapılmadı |
| Oynanış bütünlüğü | `src/App.tsx` içindeki HUD mevcut raf ikmali/yerleşim ve test bakiye komutlarını sunuyor; oyuncu transferi ve `CustomerManager` satış döngüsü bağlanmamış | Yardımsız taşıma → üretim → raf → satış kabulü henüz uygulanabilir değil |

## Ön izleme geri bildirimi ve alan güncellemesi

2026-09-27 iç ekip ön izlemesinde mevcut oda ve üretim alanı dar/klostrofobik bulundu; ileride eklenecek raf ve üretim araçlarının sığmayacağı kaygısı belirtildi. Kullanıcı kararıyla başlangıç dünyası 100×100 m'ye, P0 satış odası 12×12 m'ye, üretim bahçesi 12×16 m'ye çıkarıldı; geçitler 4 m oldu. 12×12 m standart modül, 8×8 m asgari oda ve 4 m adımlı ölçülerle kapalı odalar, açık mahalleler ve dış üretim bölgeleri ortak kayıtla eklenebilir. Modül kaydı 100 m sınırını aşarsa zemin/gezinme sınırı büyür, mevcut modül kimliği ve mutlak koordinatlar yerinde kalır; komşu etkin modüller eşleşen 4 m geçit alır. Eski kayıtların koordinatları hem normal açılışta hem güvenilir yedekten kurtarmada bir defa 2× göç edilir; etkin modüller kimlikle geri yüklenir, para/stok/lot/işlem korunur. `tests/unit/p0_world_input.test.ts` 15/15; `tests/unit/world_layout_migration.test.ts` eski koordinat dönüşümünü kontrol eder. Bu yerel ön izleme ve testler dış oyuncu kabulü değildir.

## Kabul oturumu kayıt şablonu

Her platform için ayrı satır açılacak: tarih/saat, commit veya dosya hash'i, `contentVersion`, kullanılan build komutu ve sonucu, paket dosyası, cihaz marka/modeli, OS sürümü, donanım profili, seed, başlangıç kayıt durumu, 10 dakika oynama/ısı gözlemi, uçak modu, 20 arka plan–geri dönüş çevrimi, kilit/uygulama kapanması sonrası tick ve stok/bakiye karşılaştırması, hata veya video/log yolu. Boş alan başarı sayılmaz.

Dış oyuncu için en az beş katılımcı ayrı kaydedilecek: oyuncuya verilen tek başlangıç talimatı, müdahale sayısı, ilk satışa kadar aktif süre, taşıma → üretim → raf → satış adımlarının gerçekleşip gerçekleşmediği, boş raf veya duran üretim nedenini nasıl açıkladığı, yerleşim iyileştirmesini açıklayıp açıklamadığı. [PLAN.md](../../PLAN.md) hedefi: en az 4/5 oyuncu ilk satışı yardımsız beş dakikada yapar, en az 3/5 oyuncu düzen iyileştirmesinin nedenini açıklar. Gözlem ve katılımcı yokken oran yazılmaz.

## Kapanış koşulu

Önce oyuncu transferi ile müşteri satışını gerçek uygulama akışına bağla. Ardından Android ve iOS build/lifecycle kayıtlarını ayrı cihazlarda doldur, dış oyuncu oturumlarını yap ve gözlenen sonucu seed/komut/build kimliğiyle bu rapora ekle. Ancak bundan sonra Orvant'a kanıt sunulup P0-09 kabulü değerlendirilebilir.
