# RPG, personel ve ilerleme

Kaynak: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §27–32, §46–48. Fazlar geliştirme sırasıdır; oyun bölümleri kayıt içindeki ilerlemedir.

## P0 ve A2 sınırı

P0 fiziksel oyuncu ve tek raf görevlisiyle oynanır; görev önceliği, lot rezervasyonu, güvenli iptal ve fazlara göre çalışan sınırı [KARARLAR.md](KARARLAR.md) D-014'e uyar.

P0'da tek raf görevlisine devir vardır; RPG, araştırma ve tam yorgunluk sistemi yoktur. A2'de bir çalışan, iki koltuklu mola köşesi ve öğretim bulunur. Tam oyun personel erişimi §46.2'ye göre Bölüm 1→2 geçişindedir; P0 gösterimi bu erişim kuralını değiştirmez.

## A3 — bölüm ve kaynaklar

Kredi kapasite, XP uzmanlık, AP teknik seçenek, itibar topluluk/final ilişkisini temsil eder. XP geçiş kapısı değildir; temel üretim beceriye kilitlenmez. Aynı yükseltme için dört kaynağın birlikte istenmesi yoktur.

| Geçiş | Kümülatif koşul | Erişim/ödül |
|---|---|---|
| 1→2 | 20 satış + kendi üretiminden 5 küp satışı + bir eşya taşıma | 3 AP; dış alım, personel, mola öğretimi |
| 2→3 | İki aileden toplam 60 satış + sevkiyat kabulü + çalışan molası | 4 AP; enerji genişletme, kalite, üçüncü aile |
| 3→4 | Üç aileden toplam 120 satış + normal kontrat + servis | 6 AP; ileri tarif, kriz |
| 4→5 | Krizin üç çözümünden biri + 12 farklı SKU satışı | Final panosu ve 40 itibar hedefleri |
| 5→6 | Bir proje teslimi + hizmet sınavı | Ana final ve serbest oyun |

Satışlar bölümde sıfırlanmaz. Tam final açılışının ek koşulları §42 ve STORY_AND_FACTIONS.md'dedir; 40 itibar Bölüm 4→5 geçişine eklenen ayrı zorunlu eşik değildir.

AP: temel su/domates ücretsizdir. İlk işlenmiş gıda, mandıra/içecek ve zanaat temel paketleri ile bunların üç ileri paketi ayrı ayrı 2 AP; toplam araştırma 12 AP. Bölüm 1→2, 2→3 ve 3→4 ödülleri 3/4/5 AP verir; ana ilerlemede 12 AP kazanılabilir. Aile başına ilk 10 gerçek satış +1 AP ve günde ilk normal kontrat +1 AP ek kaynaklardır. Kazanım geçmişi kaydedilir; al-sat döngüsü, yeniden dağıtım ve kayıt yükleme AP üretmez.

## A3 — XP ve dokuz davranış düğümü

Seviye 1 başlangıç, üst sınır 20; sonraki seviye bedeli `100+25×(mevcutSeviye−1)`. Her geçiş 1 beceri puanı, toplam 19. İlk farklı SKU 20 XP; her gün ilk 20 gerçek satış 2'şer; ilk kontrat 50, sonraki 20; ilk otomasyon/servis/sevkiyat öğretimi 30'ar; bölüm geçişi 100 XP (§47.1).

| Dal | Sıralı düğümler |
|---|---|
| Tüccar | Alternatif teklif → Birleşik sevkiyat → Teslim takvimi |
| Mühendis | Kalibrasyon profili → Hat dönüşümü → Servis penceresi |
| Toplulukçu | Mentor eşleme → Esnek devir → Ortak ihtiyaç panosu |

İlk dokuz çekirdek düğümün her biri 1 puandır; ikinci ilkini, üçüncü ikinciyi ister ([KARARLAR.md](KARARLAR.md) D-005). Davranış/sınırlar §47.1'den alınır; rastgele toplu satış ve genel hız bonuslarıyla değiştirilmez. İlk yeniden dağıtım ücretsiz, sonrası 100 kredi. Açık kontrat kazanımları geri alınmaz, bonus tekrar üretilmez.

## A2 temel mola; A3 tam personel modeli

F yorgunluk 0–100; enerji `100−F`. Normal artış `0,25×roleLoad×environmentLoad/sn`. Kasa/raf 1, taşıma 1,15, üretim 1,05, eğitim 0,70; çevre 0,85–1,25. Hız cezası `clamp((F−40)/200,0,0.25)`; toplam hız sınırı §27'den alınır. Dinlenme `0,55+0,004×roomComfort/sn`.

F≥60 mola talebi; F≥80 yeni görev yok ve en geç 10 sn güvenli adımda devir; F≤15 mola tamamlanır. Koltuk/rota rezervasyonu gerekir. Koltuk beklerken ayakta −0,25/sn, molaya yürürken +0,05/sn; vardiya dışında −1/sn. Gerçek çevrimdışı süre işlemez. Ücret aynı simülasyon gününde tekrar tahsil edilmez. Enerji ile memnuniyet farklı ölçülerdir.

Görev devrinde stok/hedef rezervasyonları atomik aktarılır; görevli yoksa elle çalışma sürer. Rol/köken/özellik, eğitim, izin, olay ve oda etkileri §27–32'den alınır. İlk sürüm toplam personel tavanı 20'dir (§27.1); A2'deki tek çalışan bu tavandan ayrı bir faz kapsamıdır. Aday alanları D-006'daki gibi olumlu özellik, tercih ve geliştirilebilir eksiklik olarak ayrılır.

## A4–A5 — içerik ve doğrulama

Kalan 21 düğüm A4 içerik işidir; davranışları belirlenmeden uygulanmış sayılmaz. Tam ağaçta 30 düğüme karşı 19 puan seçim doğurur; A3'te kullanılmayan puanlar saklanır. Üretici/tüccar/karma yollar aynı ana ilerlemeyi tamamlamalı; yanlış araştırma sırası ve düşük XP kalıcı kilit yaratmamalıdır. Kayıt göçü, tekil ödüller ve günlük sayaçlar A5'te doğrulanır.

## Tekil ilerleme olayları ve ödül anahtarları

KAYNAK: §46–48. Satış sayacı yalnız gerçek müşteri satışının commit olayıyla ilerler. Tedarik alımı, transfer, kontrat/final teslimi gerçek müşteri satışı değildir. Kendi üretiminden beş küp şartı lot source/provenance ile doğrulanır; sadece rafta küp bulunması yeterli değildir. Aile sayacı satılan ürünün katalog ailesini kullanır; UI etiketinden hesaplanmaz.

KARAR önerisi: ödül anahtarları bölüm geçişi, ilk SKU, aile ilk 10 satış, simülasyon gününün ilk kontratı ve öğretim tamamlaması olarak ayrı tutulur. Aynı transaction tekrarında sayaç/ödül artmaz. Birden çok şart aynı olayla sağlanırsa kararlı sıra kullanılır; bölüm geçişi ödülü yeni yüklemede tekrar verilmez. Aynı şartı UI ve Domain ayrı ayrı tamamlamaz.

| Sınır senaryosu | Beklenti |
|---|---|
| 19→20 satış; kendi küpü 5, taşıma tamam | Bölüm 2 bir kez; +3 AP |
| 20 satış ama kendi küpü 4 | Geçiş yok; eksik koşul açık |
| Aynı satış olayı tekrar oynatıldı | XP/AP/satış değişmez |
| Günün 20→21. gerçek satışı | 21. satış normal gelir, satış XP'si 0 |
| AP toplam kazanım 20 | Günlük kontrat yeni AP üretmez; bakiye harcanmış olsa da |
| Seviye 20 | Yeni seviye/20. beceri puanı üretilmez |

“İlk kontrat 50, sonraki 20 XP” ile “ilk aile/ilk SKU” kapsamları farklıdır. İlk kontrat kaydı kalıcıdır; gün değişince tekrar ilk kontrat olmaz. Günlük AP ve satış XP kotası simülasyon günüyle sıfırlanır, gerçek gece yarısıyla değil.

## Güvenli personel durum geçişleri

KAYNAK durumlar: OffShift → Available → Working → FinishingSafeStep → WalkingToRest → Resting → Returning; alternatif WaitingForStation/Training/OnLeave (§31).

F60 mola isteği yeni bir kalıcı sonsuz iş kuyruğu üretmez; koltuk ve rota tek kez ayrılır. F80'de yeni görev engellenir, güvenli bırakma en geç 10 sn; satış başlamışsa transaction tamamlanır, taşıma yükü güvenli depoya/devre gider. Koltuk kalmazsa ayakta toparlanma vardır. F15'e inince ayrılan koltuk bırakılır, işe dönüşte görevin hâlâ geçerli olduğu kontrol edilir. Ayrılan çalışan rezervasyonları bırakır, yük/iş kaybolmaz.

Etkin hız `temelHiz×clamp(1+beceriBonusu+özellikBonusu−yorgunlukCezası,0.75,1.30)`. Günlük memnuniyet değişimi ücret/mola/ortam/tercih/olay toplamından −8/+6 sınırındadır. İki gün memnuniyet<30 görüşme isteği; daha sonra düzelmezse önceden bildirilen ayrılma. “Daha sonra” kaç gün olduğu bu özette kesinleşmemiştir: kaynakta açık değer yoksa içerik kararı olmadan otomatik kovulma yazılmaz.

Oda konforu `0,30 seating+0,20 lighting+0,20 quietness+0,15 amenities+0,15 aesthetics`; alt skorlar 0–100. Yalnız kullanılan dinlenme odası etkiler. İş ortamının günlük memnuniyet etkisi −2/+2; dekor doğrudan çıktı/müşteri üretmez. Tam oda ve özellik katsayıları §27/§32 kataloğundan doğrulanır, boş alanları rastgele bonuslarla doldurulmaz.
