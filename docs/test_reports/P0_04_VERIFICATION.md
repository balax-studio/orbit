# P0-04 Doğrulama Raporu: Tek Müşteri, Raf, Kuyruk ve Satış Ledger Akışı

Tarih: 2026-09-27
Görev: P0-04
Durum: Doğrulandı
Test Aracı: Vitest v5.0.2, TypeScript v6.0.2, Oxlint v1.81.0

## 1. Ölçüt Doğrulamaları

### Ölçüt 0: Satışta Gerçek Raf Stoku ve Kayıtlı Fiyat Kullanımı; Ürün ve Bakiyenin Tek İşlem Sonucunda Güncellenmesi
- **Uygulama:** `src/domain/customer/CustomerManager.ts`, `src/domain/inventory/InventoryManager.ts`, `src/application/commands.ts`
- **Bulgular:**
  - Satış sürecinde gerçek fiziksel raf stoku (`fixture.sales_shelf`) denetlenir. Müşteri raftan ürünü aldığında 1 birim ürün müşterinin sepet konumuna (`kind: 'customer', ownerId: customer.id`) taşınır ve katalogdaki kayıtlı perakende satış fiyatı (`item.glass_water_small`: 15.000 atom / 1.50 Kredi; `item.heirloom_tomato`: 40.000 atom / 4.00 Kredi) sepete kilitlenir (`lockedPriceAtoms`).
  - Kasa ödemesi `COMPLETE_SALE` Application komutuyla tek bir atomik işlemde yürütülür: müşteri sepetinden ürün kalıcı olarak düşülür (`consumeStock`), eşzamanlı olarak `EconomyLedger` hesabına `SALE` gerekçesiyle atom hassasiyetinde alacak kaydedilir.
  - **T-P0-04a Doğrulaması:** 100.00 kredi (1.000.000 atom) başlangıç sermayesiyle 1 adet küçük su satıldığında bakiye tam 101.50 krediye (1.015.000 atom) yükselmiş, raftaki stok 1'den 0'a düşmüş ve müşteri sepeti güvenle temizlenmiştir. Domates satışında ise bakiye 104.00 krediye ulaşmış ve rafta kalan stok korunmuştur.
- **Test:** `tests/unit/p0_sales.test.ts` -> "T-P0-04a: Gerçek raf stoku ve kayıtlı fiyat ile atomik satış" (2 test geçti).

### Ölçüt 1: Aynı Transaction Yeniden İşlendiğinde İkinci Satış veya Bakiye Etkisinin Oluşmaması
- **Uygulama:** `src/application/commands.ts`, `src/domain/customer/CustomerManager.ts`, `src/domain/inventory/InventoryManager.ts`
- **Bulgular:**
  - **Idempotency (Dedup):** `CommandDispatcher` ve `InventoryManager` içindeki işlem kayıt mekanizması sayesinde aynı `transactionId` ile gönderilen tekrarlı satış komutları ikinci kez işlenmez.
  - İlk çağrıda `isDuplicate: false` ile 15.000 atom alacak yazılıp bakiye 101.50 kredi olurken; aynı transaction kimliğiyle yapılan 2. ve 3. çağrılarda sistem `isDuplicate: true` yanıtı vermiş, bakiye tam 101.50 kredide sabit kalmış (+0 atom) ve envanterde ikinci bir eksilme meydana gelmemiştir. Ledger geçmişinde yalnızca 1 adet `SALE` kaydı tutulduğu kanıtlanmıştır.
- **Test:** `tests/unit/p0_sales.test.ts` -> "T-P0-04b: İşlem tekilliği ve dedup (idempotency)" (1 test geçti).

### Ölçüt 2: Boş Raf, Fiyat/Bütçe Reddi ve Kuyruk Sonucunun Gerçek Nedenleriyle Ayrılması
- **Uygulama:** `src/domain/customer/CustomerManager.ts`, `src/domain/types.ts`
- **Bulgular:**
  - Müşterinin alışverişi tamamlayamadığı durumlar gerçek domain nedenleriyle ayrıştırılmış ve `LostSaleRecord` kütüğüne kaydedilmiştir:
    - **Boş Raf (`OUT_OF_STOCK`):** Rafta talep edilen ürün tükendiğinde müşteri ürünü alamadan ayrılır, `leaveReason: 'OUT_OF_STOCK'` olarak işaretlenir ve kayıp satış kütüğüne işlenir; bakiye değişmez.
    - **Yetersiz Bütçe (`BUDGET_REJECTED`):** Müşteri bütçesi (ör. 10.000 atom) ürünün kayıtlı fiyatından (15.000 atom) düşük olduğunda müşteri satın almayı reddeder; ürün rafta kalır, `leaveReason: 'BUDGET_REJECTED'` kaydedilir.
    - **Fiyat Reddi (`PRICE_REJECTED`):** Ürün fiyatı adil piyasa değerinin aşırı üzerinde olduğunda (§38.2 kabul fonksiyonu) müşteri fiyatı reddederek mağazayı terk eder.
    - **Kuyruk Sabrı Tükenmesi (`PATIENCE_EXHAUSTED`):** Müşteri kasada 40 aktif saniye (400 tick, KARARLAR D-019 D.2) bekleyip hizmet alamadığında sabrı tükenir; sepetindeki ürün rafa geri iade edilir (`transferStock` ile stok korunur, ne buharlaşır ne çoğalır!), müşteri `leaveReason: 'PATIENCE_EXHAUSTED'` ile ayrılır.
  - **Kuyruk Yönetimi ve Simülasyon Adımı:** Öndeki müşteri kasadan ayrıldığında arkadaki müşterinin otomatik olarak servis hücresine (`queueIndex: 0`) ilerlediği ve `step()` döngüsünün tam otonom hareket/sepet/satış akışını hatasız yürüttüğü doğrulanmıştır.
- **Test:** `tests/unit/p0_sales.test.ts` -> "T-P0-04c: Kayıp satış nedenlerinin açık ayrımı", "T-P0-04d: Çoklu müşteri kuyruğu ve ilerleme", "T-P0-04e: Adım bazlı simülasyon döngüsü (Autonomous Step)" ve "T-P0-04f: Durum serileştirme ve kurtarma" (6 test geçti).

## 2. Kalite ve Test Kanıtları
- `npm test`: 44/44 birim test geçti (9 yeni P0-04 satış testi, 10 P0-03 transfer testi, 15 core testi, 10 world/input testi).
- `npm run lint`: 0 uyarı, 0 hata (Oxlint 22 dosyada 116 kural ile).
- `npm run build`: `tsc -b && vite build` 661 ms'de hatasız tamamlandı.

## 3. 2026-09-27 Bağımlılık ve Komut Yeniden İncelemesi

P0-03 güncel tamamlandıktan ve `CommandDispatcher` P0-06 commit/rollback gözlemcisiyle değiştikten sonra satış suite'i tekrar çalıştırıldı: `npm test -- tests/unit/p0_sales.test.ts` 1 dosyada 9/9 test geçti. Bu kontrol `CustomerManager` satış sonuçları ve Application komut davranışını kapsar; App'te tam müşteri runtime entegrasyonunu veya cihaz satış akışını kanıtlamaz.
