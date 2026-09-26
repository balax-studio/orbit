# Orbit Market — belge ve geliştirme rehberi

Tek bağlayıcı ürün kaynağı [OYUN_GELISTIRME_DEVIR_DOSYASI.md](OYUN_GELISTIRME_DEVIR_DOSYASI.md) sürüm 3.0'dır. Bu yan belgeler onun uygulama rehberidir; yeni ürün şartnamesi değildir. Çelişkide kısa özet ve 61–63 teknik/görsel sözleşmesi, kapsam için 58.1, ilgili sistemin güncellenmiş bölümleri esas alınır. Bölüm 60'ın mobil kuralları 61–63 ile birlikte okunur; eski Unity/PC/Steam hedefleri uygulanmaz.

## Ürün ve mevcut durum

Orbit Market, iOS/Android için dikey izometrik 3B market oyunudur. Çekirdek döngü taşı → üret → rafla → sat; kısa oturum hedefi 3–8 dakikadır. Three.js/TypeScript web oyunu Capacitor ile paketlenir. Yerel simülasyon çevrimdışıdır; ödeme ve isteğe bağlı kozmetik reklam bağlantı ister.

26 Eylül 2026 depo incelemesi: Vite/React/TypeScript başlangıç iskeleti ve React/R3F/Drei/Zustand bağımlılık beyanları vardır; App.tsx başlangıç sayaç ekranıdır. Bu, çalışan oyun veya P0 kabulü değildir. Hedef ilk UI DOM/CSS/TypeScript'tir; mevcut bağımlılıklar zorunlu mimari sayılmaz. Kod geçişi ayrı geliştirme işidir. Bu revizyonda yalnız diğer Markdown dosyaları düzenlenmiştir; anayasa, kaynak kod ve paket ayarları değiştirilmemiştir.

## Okuma sırası

1. Anayasanın hızlı özeti, 58 ve 61–63.
2. [PLAN.md](PLAN.md): sıralı fazlar, bağımlılıklar ve çıkış kapıları.
3. [MVP_IMPLEMENTATION_GUIDE.md](MVP_IMPLEMENTATION_GUIDE.md): P0 uygulama adımları.
4. [ARCHITECTURE.md](ARCHITECTURE.md) ve [DOMAIN_MODEL.md](DOMAIN_MODEL.md): teknik sınırlar ve veri sahipliği.
5. [CONTROLS_AND_UX.md](CONTROLS_AND_UX.md) ve [UI_DESIGN_SYSTEM.md](UI_DESIGN_SYSTEM.md): mobil etkileşim ve görsel sözleşme.
6. [ECONOMY_AND_MACHINES.md](ECONOMY_AND_MACHINES.md), [RPG_AND_PROGRESSION.md](RPG_AND_PROGRESSION.md), [STORY_AND_FACTIONS.md](STORY_AND_FACTIONS.md): ilgili fazda açılacak sistemler.
7. [TEST_STRATEGY.md](TEST_STRATEGY.md) ve [MEMORY.md](MEMORY.md): kabul kanıtları, mevcut durum ve açık kararlar.

## Çalıştırma ve paketleme durumu

Mevcut package.json `dev`, `build`, `lint`, `preview` komutlarını tanımlar. Kilit dosyasıyla kurulum için `npm ci`, geliştirme için `npm run dev`, derleme için `npm run build` kullanılır. Bu belge revizyonunda komutlar çalıştırılmadı; başarılı build iddiası yoktur. Henüz test komutu beyan edilmemiştir.

Capacitor kurulumu ve platform projeleri P0 işidir. Sürüm uyumu doğrulandıktan sonra `webDir: dist`, Android/iOS platform ekleme ve `npx cap sync` akışı hazırlanır. Bunlar mevcut depoda doğrulanmış çalıştırma talimatları değildir. Android için Android Studio/SDK/JDK; iOS için macOS/Xcode, cihaz ve imzalama erişimi gerekir. Android APK başarısı iOS build kanıtı sayılmaz.

## Teslim ilkesi

Her fazda build kimliği, içerik sürümü, çalıştırma adımı, hedefli test sonucu, cihaz bilgisi ve açık engeller kaydedilir. Onaysız mağaza yayını veya gerçek ödeme etkinleştirme yapılmaz. Fazların süreleri tahmindir; tamamlanma yalnız kanıtla işaretlenir.

## Ayrıntılı uygulama sözleşmeleri

Kodlamaya başlamadan [IMPLEMENTATION_RULES.md](IMPLEMENTATION_RULES.md) okunur: kaynak kuralı, teknik karar, açık konu ve çalışma kanıtı ayrıdır. Bu ayrım belirsizliği saklamak veya hallüsinasyonu tamamen önlediğini iddia etmek yerine kontrol edilebilir geliştirme sağlar.

[MONETIZATION_AND_PRIVACY.md](MONETIZATION_AND_PRIVACY.md) A4/A5 reklam, satın alma, güvenilir doğrulama ve gizlilik sınırlarını içerir. Domain belgesinde komut/sonuç ve veri sahipliği; mimaride crash/kayıt protokolü; MVP'de P0-01…09 görevleri; test stratejisinde bunlara karşılık gelen sayısal fixture'lar bulunur.

Önerilen iş döngüsü: aktif faz → ilgili kaynak bölümü → gerçek dosya/API kontrolü → küçük görev kartı → uygulama → hedefli test → gerçek kanıt ve durum güncellemesi. Dokümandaki taslak API'ler depoda zaten varmış gibi import edilmez.
