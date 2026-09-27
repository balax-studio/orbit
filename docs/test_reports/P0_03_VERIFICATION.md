# P0-03 Doğrulama Raporu: Kapasite ve Rezervasyon Korumalı Ürün Transferi

Tarih: 2026-09-27
Görev: P0-03
Durum: Doğrulandı
Test Aracı: Vitest v5.0.2, TypeScript v6.0.2, Oxlint v1.81.0

## 1. Ölçüt Doğrulamaları

### Ölçüt 0: Kaynak, Taşıyıcı ve Hedef Konumları ile Kapasite/Rezervasyon Doğrulanması
- **Uygulama:** `src/domain/inventory/InventoryManager.ts`, `src/domain/types.ts`
- **Bulgular:**
  - Tüm fiziksel ve aktör konumları `StockLocation` tipiyle (`source`, `shelf`, `storage`, `cabinet`, `machineInput`, `machineOutput`, `player`, `worker`, `customer`, `checkout`) tekilleştirildi.
  - P0 varsayılan ve özelleştirilebilir kapasite sınırları (`DEFAULT_CAPACITIES`: oyuncu 5, görevli 5, müşteri 1, raf 20, memba çeşmesi 80, makine girdisi 20, makine çıktısı 10 vb.) tanımlandı.
  - Rezervasyon mekanizması (`createReservation`): kaynak serbest stok miktarını (`getAvailableQuantity`) ve hedef serbest kapasitesini (`getAvailableCapacity`) atomik olarak kilitler; yetersiz stok veya dolu hedef durumunda işlem reddedilir.
  - **T-P0-03b Denetimi:** Kaynakta 5 ham su varken 6 birim taşınmak istendiğinde `INSUFFICIENT_STOCK`, hedefte 2 boş yer varken 3 birim bırakılmak istendiğinde `EXCEEDS_CAPACITY` ile reddedildiği ve domain state'inin kesinlikle değişmediği kanıtlandı.
- **Test:** `tests/unit/p0_transfer.test.ts` -> "T-P0-03b: Yetersiz stok veya kapasite aşımında red ve state değişmezliği" ve "Rezervasyon ve İptal Güvenliği" (5 test geçti).

### Ölçüt 1: İptal veya Yinelenen Komutun Ürün Çoğaltmaması, Silmemesi veya Kayıtsız Konuma Bırakmaması
- **Uygulama:** `src/domain/inventory/InventoryManager.ts`
- **Bulgular:**
  - **Idempotency (Dedup):** `committedTransactions` tablosu ile aynı `transactionId` ikinci kez çağrıldığında işlem yinelenmez; önceden üretilen sonuç `isDuplicate: true` ile döndürülür, kaynak ve hedef stokları ikinci kez değişmez (**T-P0-03** kanıtı).
  - **Rezervasyon İptali:** `cancelReservation` çağrıldığında kilitlenen stok ve hedef kapasitesi güvenle serbest kalır; hiçbir lot silinmez veya çoğalmaz.
  - **Kesinti ve Rota Güvenliği:** Görevli veya oyuncu yük taşırken rota kesildiğinde veya hedef rezervasyonu iptal edildiğinde ürün güvenle taşıyıcının envanterinde (`kind: 'player' | 'worker'`) kalır; ürün buharlaşmaz, silinmez veya tanımsız konuma düşmez.
- **Test:** `tests/unit/p0_transfer.test.ts` -> "T-P0-03: Başarılı transfer ve işlem idempotency (dedup)", "Rezervasyon ve İptal Güvenliği", "Taşıyıcı Döngüsü ve Kesinti Koruması" (4 test geçti).

### Ölçüt 2: Taşıma Sonucunun Tek Domain İşlemiyle Korunması
- **Uygulama:** `src/domain/inventory/InventoryManager.ts`, `src/application/commands.ts`
- **Bulgular:**
  - `InventoryManager.transferStock` işlemi tek bir atomik adımda kaynak lotu eksiltir (FIFO / ağırlıklı maliyet), hedefte lot oluşturur/birleştirir, rezervasyonu `FULFILLED` yapar ve işlemi deduplication tablosuna kaydeder.
  - `CommandDispatcher` entegrasyonu: `TRANSFER_STOCK`, `RESERVE_STOCK` ve `CANCEL_RESERVATION` komutları Application katmanı üzerinden tek tip komut arayüzüyle yürütülür.
  - `serialize` ve `restore` yeteneği ile tüm lotlar, rezervasyonlar, kapasiteler ve commit edilmiş işlem geçmişi kalıcı snapshot'a aktarılır ve tam doğrulukla geri yüklenir.
- **Test:** `tests/unit/p0_transfer.test.ts` -> "CommandDispatcher Entegrasyonu" ve "Snapshot ve Restore Kalıcılığı" (2 test geçti).

## 2. Kalite ve Test Kanıtları
- `npm test`: 35/35 birim test geçti (10 yeni transfer testi, 15 core testi, 10 world/input testi).
- `npm run lint`: 0 uyarı, 0 hata (Oxlint 20 dosyada).
- `npm run build`: `tsc -b && vite build` 702 ms'de hatasız tamamlandı.

## 3. 2026-09-27 Bağımlılık ve Kaynak Yeniden İncelemesi

P0-01/P0-02 kanıtları güncellendikten sonra P0-03'ün mevcut inventory/command kaynakları tekrar çalıştırıldı: `npm test -- tests/unit/p0_transfer.test.ts` 1 dosyada 10/10 test geçti. Bu yeniden inceleme P0-06 kayıt kancalarının transfer komutlarına genel runtime entegrasyonu olduğunu kanıtlamaz; P0-06 raporundaki entegrasyon sınırı geçerlidir.
