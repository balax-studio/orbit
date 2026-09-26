# Kodlama ajanı için kaynak ve kanıt sözleşmesi

Bu dosya [anayasanın](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §58–59, §61–63 kurallarını uygulanabilir hale getirir. Hallüsinasyonu tamamen engelleme garantisi vermez; yanlış varsayımı görünür ve denetlenebilir kılar. Bu belge revizyonu yalnız Markdown kapsamındadır.

## 1. Bilginin dört durumu

| Etiket | Anlam | Kodlamada davranış |
|---|---|---|
| KAYNAK | Ana dosyada açık ürün kuralı; bölüm numarası gerekir | Aynen uygula; başka faza taşıma |
| KARAR | Ana dosyanın açık bıraktığı geri alınabilir teknik seçim | Gerekçe, alternatif, faz ve test yaz; ürün gerçeği gibi sunma |
| AÇIK | Kaynak/kanıt yetersiz veya kaynaklar çelişkili | Sayı/API uydurma; yalnız bağımlı işi açık bırak |
| KANIT | Depo okuması, çalıştırılmış kontrol veya cihaz raporu | Komut/yer, tarih, kapsam ve gerçek sonucu belirt |

Bir tasarım değeri KAYNAK olabilir ama oynanış dengesi yine hipotezdir. Bir bağımlılığın package.json'da bulunması kurulduğu veya doğru çalıştığı anlamına gelmez. Bir örnek TypeScript tipi mevcut API değildir. Bir testin yazılmış olması geçtiği anlamına gelmez.

Kaynak önceliği: geçerli kullanıcı talimatı ve uygulanabilir AGENTS.md → anayasanın güncel sözleşmesi → kaynakla uyumlu yan belge → kaydedilmiş teknik karar. Teknik/görsel kapsam §61–63, faz kapsamı §58.1; eski sistem bölümü yerine açık güncellemesi kullanılır. Çelişki sürüyorsa iki bölüm ve etkisi kaydedilir; sessizce uygun görünen sayı seçilmez.

## 2. Her küçük kod işi için görev kartı

```text
İş ID / faz:
Oyuncu davranışı:
Kaynak bölüm / yan belge:
Önkoşullar ve bağımlı işler:
Dokunulacak mevcut dosya/semboller (önce doğrula):
Girdi → doğrulama → durum değişimi → çıktı:
Başarısızlık ve iptal davranışı:
Kalıcı veri / transaction / migration etkisi:
Kapsam dışı:
Kabul testi ID ve beklenen sonuç:
Teknik seçim / açık karar:
Gerçek sonuç / kanıt / kalan engel:
```

İş kartı tamamlanmadan tüm sistemi yazmaya başlama. Geri alınabilir bir algoritma/isim seçimi bağımsız ilerlemeyi durdurmaz; KARAR olarak kaydedilir. Ürün kapsamı, platform veya bütçe maddi değişiyorsa kullanıcıya somut etki sunulur. AÇIK alanı sıfır, boş dizi, otomatik başarı veya sahte veriyle production'a taşıma.

## 3. Depo ve API doğrulaması

1. İlgili dosya/sembolü scoped aramayla bul; yoksa “mevcut” değil “oluşturulacak” yaz.
2. package.json ve kilit sürümünü oku. Kullanılacak imzayı kurulu tipler/resmî sürüm belgesinden doğrula; hafızadan plugin metodu veya config anahtarı yazma.
3. Bağımlılık ekleme gerekiyorsa gerekçe, lisans, platform uyumu ve boyut etkisi kaydedilir. P0'ya reklam/IAP SDK'sı ekleme.
4. Native platform kodu veya signing ayarı üretildi diye cihaz build geçti deme. Web, Android ve iOS kanıtlarını ayır.
5. Mock/fake/prototip kaynağı adında ve raporda açıkça belirtilir. Sahte mağaza receipt'i, hardcoded başarı, timer ile reklam completion'ı gerçek entegrasyon sayılmaz.
6. Test komutu ancak script/config mevcutsa kullanılır. Çalıştırılamadıysa nedeni yazılır; beklenen sonucu gerçek sonuç alanına kopyalama.

## 4. İçerik aktarımı tamamlanma ölçütü

Her kayıt için ID, kaynak bölüm, faz, birim, varsayılan değer ve doğrulama bulunur. Eksik sayıyı 0 ile doldurmak yerine içerik doğrulaması kaydı reddeder. A4 katalog kapısı: 24 nihai ürünün her biri tarif/makine/girdi erişimi, süre, çıktı, fiyat, aile ve bölüm bağlantısına sahip; ara ürünler ve makineler de referans bütünlüğünü geçer.

Tarif grafiğinde eksik ID, negatif/sıfır miktar, sıfır süre ve istenmeyen döngü hata olur. Bölüm kilidi ile araştırma açılışı aynı alan değildir. UI metni kalıcı ID olarak kullanılmaz. ID değişimi kayıt göçü olmadan yapılamaz.

## 5. Tamamlandı demeden önce

- İstenen davranış ve hata yolu gerçekten mevcut mu?
- Hedefli kontrol çalıştı mı; çıkış kodu ve beklenen/gerçek sonuç aynı mı?
- Yan etki tek işlem mi; tekrar çağrı/kayıt dönüşünde çoğalma var mı?
- Sonuç yalnız web üzerinde mi; cihaz iddiası için cihaz kanıtı var mı?
- Açık karar ve kapsam dışı özellikler yanlışlıkla uygulanmış mı?
- README/MEMORY/PLAN gerçek durumla aynı mı?

Bir özellik “belgelendi”, “uygulandı”, “hedefli test geçti”, “cihazda doğrulandı”, “faz kabul edildi” olarak ayrı raporlanır. Sonraki durum öncekinin otomatik sonucu değildir. Yapılmayan işleri [x] işaretleme.

## 6. Devam istemi şablonu

> Önce IMPLEMENTATION_RULES.md, MEMORY.md ve PLAN.md'nin aktif fazını oku. İlgili anayasa bölümlerini ve gerçek depo dosyalarını doğrula. Tek küçük kabul edilebilir iş seç; görev kartında kaynak, veri değişimi, hata yolu ve test beklentisini yaz. Tanımlanmamış ürün değeri veya doğrulanmamış API uydurma. Yalnız yetkilendirilen kapsamı uygula, hedefli kontrolü çalıştır ve gerçek sonucu kaydet. İlgisiz sonraki fazları ekleme.
