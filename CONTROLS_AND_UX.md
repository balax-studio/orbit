# Mobil kontroller ve kullanıcı deneyimi

Kaynak: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) hızlı özet, §52–54, §60.1–60.3, §62–63. Hedef dikey telefon ve tek başparmakla temel işletmedir; klavye yalnız debug yardımcısıdır.

## P0 — hareket ve güvenli etkileşim

Panel sahipliği, tek etkin dünya pointer'ı, isteğe bağlı titreşim/uzun basış ve P0 hedef işaretçisi için [KARARLAR.md](KARARLAR.md) D-010 uygulanır. Pan/zoom ve oran değişiminde sahne geometrisi esnetilmez (D-009/D-016).

Alt bölgede yüzen joystick, alternatif erişilebilir dokun-git modu. Mantıksal hareket/çarpışma simülasyona, görsel enterpolasyon renderer'a aittir. Pointer kimliği, touchcancel, ekran dışına çıkış ve arka plan hareketi güvenle keser; takılı joystick olmaz.

İşaretli istasyonda en az 0,3 sn sabit kalınca, önceden belirlenmiş uyumlu hedefe güvenli al/bırak temel davranıştır. Yoldan geçerken harcama, işe alma, tarif değiştirme veya satış yapılmaz; aynı üründe mevcut rezervasyon kazanır. Her taşıma için zorunlu ActionMenu açılmaz. Yakınlık, raycast ve UI seçimi tek hedef çözer; ürün/hedef/kapasite görünürdür. Satın alma, yıkım ve maliyetli değişiklikler önizleme/onay ister. Kapasite doluluğu ve yanlış girdi kısa gerekçeyle bildirilir.

DOM buton/panelleri dünya etkileşimini tüketir; yalnız CSS pointer-events kullanmak yeterli varsayılmaz. UI üzerinde başlayan pointer dünya seçimi/hareketine dönüşmemeli, sürükleme sonunda satış/yerleştirme tetiklememelidir. Seçim renk yanında kontur/işaret/metinle gösterilir; bütün sahneye pahalı outline uygulanmaz.

## P0 — inşa

Makine grid'e onaylı yerleştirilir; çalışan işe alma ve görev ataması personel panelindedir. İki eylemin akışı ve portre HUD bölgeleri [KARARLAR.md](KARARLAR.md) D-018 B.3–B.5'te ayrılmıştır.

İnşa modunda simülasyon durur. Grid üzerinde seç → sürükle → döndür → onay/iptal. Footprint, çakışma, kapı/istasyon erişimi, çalışan rotası ve maliyet onaydan önce doğrulanır. Parmağın kapattığı hedef önizlemesi görünür alana taşınır. Geçersiz konum yalnız kırmızı renkle anlatılmaz; nedeni yazılır. İptal stok/para harcamaz. Onay tek işlemdir; arka plandan dönüş ikinci onay yaratmaz.

## P0–A2 — kamera ve kesinti

9:16–9:21 dikey telefon ve portre tablet düzeni kullanılır. İki parmak pan/zoom hareket çubuğu devre dışıyken çalışır. Dikey izometrik kamera, sınırlı pan/iki parmak zoom ve karaktere dön kontrolü; hareket, zoom ve inşa jestleri çakışmaz. HUD safe-area içinde, dünya seçimleri panel altında kaybolmaz. Android geri önce açık paneli kapatır. iOS için zorunlu uygulamayı kapat düğmesi yoktur.

Metin girişi oyun dünyasını sıkıştırmaz: isim/arama DOM paneli klavyenin üstünde kalır, oyun durur ve Canvas'ın sabit dünya kompozisyonu korunur. iOS'ta `KeyboardResize.None`, Android'de görünür viewport ölçüsü kullanılır; gerçek pencere değişimi kamera görüş hacmini yeniden hesaplar. Ayrıntı [KARARLAR.md](KARARLAR.md) D-034'tedir.

İnşa/panel duraklatması ile platform duraklatması ayrı nedenlerdir. Arama, ekran kilidi ve native pencere kapanışı tek başına oyunu başlatmaz. Foreground ve kullanıcı devamı gerekir. Kısa geri dönüş özeti son eylem/isteğe bağlı sonraki işi gösterir; zorunlu modal veya kayıp tehdidi içermez. TutorialState ve aktif hedef korunur.

## A2–A3 — okunabilir yönetim

3–8 dk oturumlar için bir ana hedef ve küçük alt adımlar; tamamlanan iş açık kapanış verir. Stok, fiyat, kuyruk ve darboğaz nedenleri ayrılır. İki A2 teşhis katmanı daha sonra §43 işletme haritasına genişler. Mola, sevkiyat, bakım ve kontrat tahsisinde mevcut taahhüt ve maliyet önizlenir. Eylem tekrarı zorunlu angaryaya dönüşüyorsa otomasyon öğretimi ve yerleşim test edilir.

## A4–A5 — etik geri dönüş ve erişilebilirlik

Dokunma tabanı iOS 44 pt, Android 48 dp eşdeğeridir; CSS/viewport karşılığı gerçek cihazda ölçülür. Uzun basış kritik eylemin tek erişimi değildir. Sağ/sol el, dokun-git, metin büyütme, az hareket, yüksek kontrast ve kapatılabilir titreşimle temel görev tamamlanır. Renk tek bilgi kaynağı olmaz; DOM metni semantik ve odak sırası anlamlıdır. Çevrimdışı ceza, zorunlu bildirim, can/enerji bekletme ve FOMO sayacı yoktur. Kontrat/final süreleri yalnız aktif simülasyondur; reklamın 24 saat/20 dakika uygunluk saati ayrı monetizasyon politikasıdır.

Reklam açıkça kullanıcı seçimiyle yalnız kozmetik ödül sunar; reklam izlemeyene ücretsiz görev yolu vardır. Mağaza/reklam bağlantı yokken anlaşılır unavailable durumu gösterir; sonsuz yükleme yoktur. Satın alma yerelleştirilmiş fiyat ve native mağaza onayıyla yapılır. P0'da bu SDK'lar ve gereksiz izin istemleri bulunmaz.

## Pointer ve eylem sahipliği — P0 uygulama sözleşmesi

KAYNAK: §60.1, §63.5. Bir pointerdown yalnız UI, joystick, dünya seçimi veya inşa sürüklemesinden birine atanır. Sahiplik pointerup/cancel'a kadar değişmez; UI'da başlayan jest parmak canvas'a taşındığında dünya işlemi olmaz. Çoklu dokunmada ikinci parmak joystick'i başka bir parmağa devretmez. Touchcancel/lost capture/background bütün geçici hareketleri nötrler.

| Oyuncu durumu | İzin verilen davranış | Engellenen çakışma |
|---|---|---|
| Joystick tutuluyor | Hareket, uyumlu istasyon önizlemesi | İki parmak kamera ve inşa sürüklemesi |
| Uyumlu istasyonda 0,3 sn sabit | Güvenli transfer | Her kare yeni aynı transfer veya uyumsuz ürün |
| İnşa önizlemesi | Grid sürükleme/döndür/onay/iptal | Simülasyon ilerlemesi ve otomatik transfer |
| Yönetim sayfası açık | Panel kontrolleri, Android geriyle kapatma | Panel altındaki raycast |
| Platform kesintisi | Duraklama/kayıt | Hareket ve ekonomi zamanı |

Otomatik transferin bir seferde miktarı/tekrar aralığı AÇIK teknik denge kararıdır. 0,3 saniye bekleme her render karesinde bir ürün aktarımı anlamına gelmez. Aynı geçerli eylem commandId'si katmanlarda korunur; sonraki meşru aktarım ayrı eylemdir.

## İnşa doğrulama sırası

1. Nesne footprint'ini ızgara ve yönünden üret; yalnız merkez hücreyi kontrol etme.
2. Sınır/çakışma, servis hücresi, giriş/kasa/temel rota erişimini kontrol et.
3. Taşınan makinenin çalışan partisi, yükü, rezervasyonu ve bağlantı etkisini göster; tanımsız “taşıyınca sıfırla” kuralı ekleme.
4. Maliyet/iade önizlemesini mevcut revision ile bağla. Onayda koşulları yeniden kontrol et; değiştiyse yeni sonucu göster.
5. Tek commit sonrası rota/oda/güç önbelleklerini yenile. İptalde kalıcı state ve bakiye birebir korunur.

Çalışan parti taşınırken davranış anayasanın ilgili yerleşim kuralıyla doğrulanamıyorsa karar kaydı gerekir. Ücretsiz aşınma tamiri, parti atlama veya gizli ürün silme kabul edilemez.

## A2 teşhis görünümünün hesap tanımı

KARAR önerisi: ilk iki katman Raf ve Üretim; farklı seçim yapılırsa gerekçesi kaydedilir. §43 kaynak eşikleri: talep varken boş raf >%15; üretimde tek bekleme türü >%20. Paydanın gözlem penceresi ve talep var koşulu raporda açık olmalı. Yetersiz örnekte yüzdeyi kesin teşhis diye sunma. Telefon tek ana katman ve detay kartı; en fazla üç öncelikli öneri. Ölçüm pencereleri son 5 aktif dakika/son tam gün; pause'da ilerlemez.

Gösterilecek teşhis: nesne, ölçüm, pencere, gerçek bekleme nedeni, olası müdahale, maliyet, tahmini etki ve güven. Örnek: çıktı tıkalı → depo dolu; bu durumda otomatik yeni makine önerilmez. Harita kendiliğinden satın alma veya işten çıkarma yapmaz.
