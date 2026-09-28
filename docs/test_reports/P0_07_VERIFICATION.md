# P0-07 Doğrulama Raporu: Tek Raf Görevlisi

Tarih: 2026-09-27
Görev: P0-07
Durum: Kod/bileşen kabulü; gerçek cihaz ve dış oyuncu kabulü P0-09'da açık

## Uygulama

- `ShelfWorkerManager` tek raf ikmal işini kaynağa gitme → rezervasyonlu yük alma → rafa gitme → bırakma olarak yürütür. Yürüyüş 100 ms simülasyon tick'inde ilerler; 0,5 m ızgarada geçerli yol aranır. Yol kesilirse görev, rezervasyon ve fiziksel yük korunur; yol açılınca devam eder. Aynı raf için her tick yeni görev üretilmez.
- `InventoryManager` kaynak→görevli ara taşımasını mevcut raf rezervasyonuyla doğrular. Alışta rezervasyonun kaynak ucu görevli yüküne taşınır; raf kapasite rezervasyonu korunur. Bırakışta aynı rezervasyon tamamlanır. Görevli kapasitesi ve tam miktar kontrol edilir.
- `App` görevli durumunu ledger/envanter/üretim ile aynı save payload'ına ekler. Rezervasyon, alış ve bırakış `CommandDispatcher.executeAsync` yoluyla native günlük onayını bekler; kayıt hatası simülasyonu durdurur. Eski P0 payload'ı görevli başlangıç durumuyla checkpoint'e yükseltilir. Görev verme butonu yalnız hazır makine çıktısı için mevcut stoğu ve raf kapasitesini kullanır.
- `SceneRenderer` görevli mesh'ini yalnız kayıtlı konumdan günceller; stok/para mutasyonu render katmanında yoktur.

## Kontroller

- `npm test -- tests/unit/p0_worker.test.ts`: 3/3 geçti. Son 1 ürün yarışında yalnız rezervasyon sahibi alır; kaynak/görevli/raf toplamı 1 kalır. Yükle ve rezervasyonla kayıt dönüşü sonrası ikmal tamamlanır. Yol kesintisinde ürün görevli envanterinde kalır ve açılınca rafa gider.
- `npm test`: 9 dosyada 85/85 geçti.
- `npm run lint`: çıkış kodu 0, uyarı yok.
- `npm run build`: başarılı; Vite 829,97 kB ana JS chunk için 500 kB uyarısı verdi.
- `npx cap sync`: Android/iOS App ve Filesystem plugin eşitlemesi başarılı.
- `git diff --check`: hata yok; var olan LF/CRLF uyarıları görüldü.

## Sınırlar

Gerçek Android/iOS cihazda arka plan kesintisi ve oyuncunun baştan sona üretim→ikmal→satış döngüsü henüz denenmedi. App'te oyuncunun üretim girdisini fiziksel taşıma etkileşimi olmadığı için görev verme butonu hazır ürün çıktısı oluşmadan iş başlatmaz; P0-09 oyuncu döngüsü bu açığı ayrıca göstermek zorundadır. Kod varlığı veya web build cihaz/oyuncu kabulü değildir.
