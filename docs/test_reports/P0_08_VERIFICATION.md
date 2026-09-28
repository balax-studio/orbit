# P0-08 Doğrulama Raporu: Güvenli Raf Yerleşimi

## 28 Eylül 2026 — güncel uygulama

P0-05/P0-06/P0-07 bağımlılıkları güncel Orvant kayıtlarıyla kapatıldı. Yerleşim önizlemesi artık yalnız oyuncu/görevlinin yeni footprint dışında kalmasını değil, bulunduğu noktadan kapı ve temel servis yollarına yürünebilir bağlantısını da denetliyor. Onay aynı `preview` doğrulamasını yeniden çalıştırıyor. `npm test -- tests/unit/p0_placement.test.ts`: 6/6 geçti. `npm run build`: geçti; Vite 879,18 kB ana paket uyarısı verdi. Gerçek cihaz ve dış oyuncu yerleşim kabulü P0-09'da açık.

Tarih: 2026-09-27
Görev: P0-08
Durum: P0 mevcut satış rafı taşıma akışı kod/bileşen düzeyinde doğrulandı; D-044 sonrası Orvant görevi yeniden incelemede, cihaz/oyuncu kabulü P0-09'a açık

## Uygulama ve kapsam

- `PlacementService` mevcut `fixture.sales_shelf` kimliğini 1 m ızgarada taşır. Önizleme saf sorgudur; footprint/satış odası dışı, diğer nesne çakışması, iki hücreli ana koridor/güney kapısı, servis hücresi, aktör sıkışması ve girişten su kaynağı, domates yatağı, şişeleme, raf ve kasaya rota denetlenir. Onay aynı denetimi yeniden yapar; geçersiz konumun nedeni metin olarak döner.
- `App` yerleştirme modunda simülasyonu durdurur. Zemine dokunma veya 1 m yön düğmeleri taslağı değiştirir; onay `PlacementService.moveShelf` ve aynı save payload'ına bağlı tek transaction günlüğünü bekler. Yazım başarısızsa yerleşim geri alınır; iptal yalnız taslağı siler. Görevli aktif ikmal taşıyorken raf taşınmaz.
- `WorldLayout` dinamik fixture listesiyle yürünebilirliği hesaplar. Bahçe `x9` hücresinin kenarı ile `x10` batı koridoru hücresinin kenarı `x9,5`te buluşur; 0,5 m rota örneklemesindeki yapay boşluk giderildi. `SceneRenderer` kaydedilen raf konumunu çizer ve geçerli/geçersiz taslağı renk + metin geri bildirimiyle gösterir. Render para/stok değiştirmez.
- Bu P0 işi **kurulu tek rafın taşınmasıdır**; yeni oda, makine satın alma veya kaynakta tanımlanmamış inşa bedeli eklenmedi. Mevcut rafın kimliği ve envanter lokasyon ID'si korunur; taşıma kredi/stok üretmez.

## Kontroller

- `npm test -- tests/unit/p0_placement.test.ts`: 6/6 geçti. Varsayılan ve geçerli alternatif konum; geçersiz footprint/kapı/servis/aktör; simülasyon dururken saf önizleme/iptal; yazım hatasında geri alma; kayıt dönüşü; aynı başlangıç stok/görevli ve eşit aktif tick ile iki yerleşimin ikmal süresi karşılaştırıldı.
- `npm test`: 11 dosyada 99/99 geçti.
- `npm run lint`: çıkış kodu 0.
- `npm run build`: başarılı; Vite 849,99 kB ana JS chunk için 500 kB uyarısı verdi.
- `npx cap sync`: Android/iOS App ve Filesystem plugin eşitlemesi başarılı.
- `git diff --check`: hata yok; var olan LF/CRLF uyarıları görüldü.

## Açık cihaz/oyuncu kanıtı

Gerçek Android/iOS derlemesi, dokunmatik yerleştirme denemesi ve dış oyuncunun iki düzeni yorumlaması yapılmadı. İki yerleşim testi ikmal tick farkını gösterir; müşteri talebi varken boş raf süresi veya satış sonucu ölçümü değildir. Bunlar P0-09 cihaz ve oyuncu kabulünde ayrı kaydedilmelidir.

## D-044 sonrası güncel dünya bağlantısı

Başlangıç haritası artık 100×100 m'dir. `PlacementService` oda sınırını seçili aktif modülden, gezinme sınırını etkin modül/bahçe/yollardan alır; yeni oda eklenmesi eski raf hücresini kaydırmaz. Standart modül 12×12 m, asgari oda 8×8 m ve ölçü adımı 4 m'dir. Güncel tam test 99/99, hedefli yerleşim testi 6/6, lint ve build geçti. Orvant P0-08 D-044'e bağlanıp `todo/blocked` oldu; P0-02/P0-03/P0-07 kanıtları yenilenmeden görev kabul edilemez. Bu alan güncellemesi oyuncu/cihaz kabulü sayılmaz.
