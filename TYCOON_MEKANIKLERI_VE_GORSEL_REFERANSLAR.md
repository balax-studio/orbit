# Orbit Market — tycoon görsel referansları

Bu dosya görsel esin ve sahne kompozisyonu içindir; yeni oyun mekaniği, ürün, ekonomi değeri veya faz açılımı tanımlamaz. Bağlayıcı davranış için [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §58.1, §62, §65–67; sabit yerleşim ve varlık tarifleri için [dünya paftası](DUNYA_YERLESIM_PLANI.md) §13; düğmeler için [ekran kataloğu](EKRAN_VE_MENU_AKISI.md) esas alınır. Aşağıdaki görseller kavramsal eskizdir: nesne konumu, ölçü, ürün ve UI metni kanıtı değildir.

## Market, raf ve kasa

![Market rafları ve kasa için görsel eskiz](./referans_gorseller/market_shelves_checkout_view_1790499645665.jpg)

Okunur raf silüeti, açık dolaşım, görülebilen kasa kuyruğu ve ürünün kaynaktan rafa taşınması görsel hedeflerdir. P0'daki gerçek ürünler üç şişe su boyutu ve taze domatestir; ekmek/peynir görüntüsü P0 stoğu anlamına gelmez. Raf içeriği, müşteri alışverişi ve kasa sonucu Domain/Application akışından gelir. Fiyat düzenleme A3 kapsamındadır; sahnedeki etiket veya HUD tek başına fiyatı değiştirmez. DOM/CSS panel ölçüleri [UI tasarım sistemi](UI_DESIGN_SYSTEM.md) ve anayasa §62.1'e uyar: 2–3 px kontur, 3–5 px sert gölge, 6–10 px köşe yarıçapı.

## Üretim istasyonları

![Atölye için görsel eskiz](./referans_gorseller/workshop_production_view_1790499703023.jpg)

Malzeme, giriş/çıkış portu ve bekleme nedeninin silüetten anlaşılması hedeflenir. P0 yalnız memba çeşmesi, şişeleme tezgâhı ve domates yatağını çalıştırır. Değirmen, yayık ve fırın kendi katalog/faz açılımlarına kadar dekor önerisidir; siyez ekmeği A3 ürünüdür. Üretim kuyruğu, süre ve tıkanma bilgisi [ekran kataloğundaki](EKRAN_VE_MENU_AKISI.md) fazına uygun panelde gösterilir; taşıma animasyonu stok üretmez.

## Bostan, kümes, arılık ve göl

![Dış alanlar için görsel eskiz](./referans_gorseller/farm_pasture_lake_view_1790499721870.jpg)

Arazi karakteri, bitki/hayvan ölçeği ve yaya yolları için renk referansıdır. P0 memba çeşmesi gölden ayrı bir kaynaktır. Göl, mera, arılık ve diğer dış alanların gerçek sınırı, kapısı, portu ve erişim fazı [dünya paftasında](DUNYA_YERLESIM_PLANI.md) belirlenir. Eskizdeki kesikli sınır yeni arazi satın alma, kapasite bonusu veya yol açma kuralı yaratmaz. Her ekonomik edinim kendi doğrulama ve kalıcı işlem günlüğüyle onaylanır; 30 aktif saniye yalnız değişiklik varsa checkpoint için üst sınırdır, işlem süresi değildir.

## Gün sonu görünümü

![Gün sonu paneli için görsel eskiz](./referans_gorseller/gamedev_style_report_modal_1790499744547.jpg)

Bu görselin kart yerleşimi ve sayı hiyerarşisi esin kaynağı olabilir. Onaylı akış, A2+ için zorunlu olmayan **Gün sonu** panelidir: nakit, katkı, stok, hizmet, tıkanma ve tek öneri; **Öneriyi incele** ve **Kapat** eylemleri [ekran kataloğunda](EKRAN_VE_MENU_AKISI.md) tanımlıdır. Dört jüri, puan kartı, yeni lonca/kurul sistemi, katalog dışı ürün veya günü bitirmek için “kasa kilitleme” düğmesi bu tasarımın parçası değildir. Oyun günü 900 aktif simülasyon saniyesidir; kritik işlemin dayanıklı kaydı gün sonu paneline bağlı değildir.

## Diğer görsel eskizler

| Dosya | Esin konusu | Uygulama sınırı |
|---|---|---|
| [Oyun HUD'u](referans_gorseller/neo_brutalist_gameplay_hud_1790499395876.jpg) | Sahne ve bilgi dengesi | Anayasa §62 ve ekran kataloğu |
| [Üretim paneli](referans_gorseller/neo_brutalist_crafting_modal_1790499424627.jpg) | Reçete okunurluğu | Gerçek makine/faz kataloğu |
| [Ansiklopedi](referans_gorseller/neo_brutalist_codex_album_1790499454596.jpg) | Şema ve albüm dili | Ayarlar → Oyun Ansiklopedisi |
| [Arazi paneli](referans_gorseller/neo_brutalist_land_expansion_1790499490689.jpg) | Harita bilgi katmanı | Paftadaki sınır ve erişim |
| [Market](referans_gorseller/market_shelves_checkout_view_1790499645665.jpg) | Raf, kasa, müşteri | P0 ürün ve dolaşım sözleşmesi |
| [Atölye](referans_gorseller/workshop_production_view_1790499703023.jpg) | İstasyon silüeti | Fazına uygun gerçek port |
| [Dış alanlar](referans_gorseller/farm_pasture_lake_view_1790499721870.jpg) | Doğa ve yol | Dünya paftası §13 |
| [Gün sonu](referans_gorseller/gamedev_style_report_modal_1790499744547.jpg) | Panel hiyerarşisi | A2+ isteğe bağlı akış |
