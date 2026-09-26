# Hikâye, topluluklar, olaylar ve final

Kaynak: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §28–29, §42, §46, §48 ve §60.2. P0'da hikâye/final yoktur; A2 öğretim, A3 sınırlı olay/kontrat, A4 tam anlatı ve finaller uygulanır.

## A3 — topluluklar ve olaylar

Topluluk adları Kooperatif, Araştırma ve Konsorsiyum'dur. Kararlı içerik ID'leri tek katalogda tutulur; UI çevirileri ID yerine geçmez. Başlangıç itibarı her biri 20, sınır 0–100. Normal kontrat +2, kişisel/topluluk görevleri açıkça +3–5, kriz ilgili topluluğa +10 verir.

Olay tanımı: ID, açılış koşulu, simülasyon süresi, cooldown, etkilenen aile/sistem, etki çarpanı, açıklama ve çözüm. Katalog değerleri §29'dan aktarılır; örnek festival/durgunluk sayıları bağlayıcı yeni veri değildir. Olumsuz olaylar arasında en az iki oyun günü; talep etkisi 0,65–1,40, maliyet 0,85–1,35 sınırları korunur. Seçim/uygunluk/uyarı kuralları §29.2–29.4 ile birlikte uygulanır.

Aynı boyuttaki yüzdeler toplanıp sınırlandırılır; güç etkisi 0,70–1,20 aralığındadır. Aynı anda en fazla bir aktif/planlanmış olumsuz olay, beş günde en fazla iki olumsuz olay ve aynı olaya en az yedi gün tekrar aralığı uygulanır. Bölüm 2 öncesi, öğretimde, toparlanma modunda veya nakit dayanma süresi bir günden azken yeni olumsuz olay seçilmez. Seed/cooldown/geçmiş kaydedilir; yönetici gerçek ödeme davranışını okuyamaz.

Olaylar mevcut para veya stoğu rastgele silmez. Küresel geliş etkisi spawn'a, aile etkisi normalize ihtiyaç ağırlıklarına gider; kabul denkleminde ikinci kez çarpılmaz. Olaylar kapalıyken zorunlu kriz görevi kalır fakat olumsuz ekonomik çarpan uygulanmaz.

## A4 — bölgesel kriz

Bölüm 4 Yerleşim Tedarik Açığı süre sınırı olmadan kısmi teslimle çözülür:

| Yol | Koşul |
|---|---|
| Üretici | 8 küçük su + 4 taze domates üretip teslim |
| Tüccar | Açık bedelli dış tedarikten 12 küçük su kabul edip teslim |
| Toplulukçu | 4 adet 5 L su + 4 taze domates; aynı oyun gününde iki farklı çalışanın kesintisiz molası |

Her yol aynı ana ilerlemeyi ve ilgili +10 itibarı verir; sınıfa özel beceri istemez. Seçenek teslim öncesi değişir, ilk teslimden sonra dal netleşir.

## A4 — üç final

Açılış: kriz çözümü, 12 farklı SKU satışı, üç aile erişimi ve normal kontrat. Her proje dört eşit sevkiyat dalgası; hazırlık süresizdir. İlgili topluluk 40 itibar ister. Yatırım onayda bir kez düşer; mallar proje teslimidir, satış geliri yaratmaz.

| Proje | Toplam teslim | Yatırım |
|---|---|---:|
| Kooperatif merkezi | 40 küçük su + 20 adet 5 L su + 40 domates + 20 köy somunu | 300 |
| Yerel araştırma merkezi | 20 damacana + 20 zeytinyağı + 20 tütsülenmiş alabalık + 20 balmumlu branda | 400 |
| Bölgesel ticaret merkezi | 40 üzüm pekmezi + 20 pastırma + 20 yün şal + 20 kahvaltı tepsisi | 600 |

Standart kalite ve dış alım geçerlidir. Her teslim dört eşit dalgaya bölünür; bu sürümde final satırlarında ikame yoktur, aynı lot iki kez sayılmaz. İtibarı 40 altındaki topluluk için günde bir 10 küçük su veya 5 taze domates kurtarma görevi belgeli lot maliyetini geri öder ve +2 itibar verir; görev kâr üretmez.

## Hizmet sınavı ve kayıt

900 aktif saniyelik sınav; normal spawn yerine 60 ziyaretçi/80 ihtiyaç (40 tek, 20 çift). Seed, ihtiyaçlar, sepet bütçeleri, kabul eşikleri ve kuyruk ölçümleri kaydedilir. Ortak başarı ≥64 ihtiyaç, satış tamamlayanlarda medyan kuyruk ≤25 sn, kuyruktan ayrılan ≤6. Aile dağılımı 30/25/25; geçersiz planla sınav başlamaz (§42.2).

Ek koşullar: Kooperatif gıda veya su tamamen boş geçen birleşik süre ≤120 sn; Araştırma ek 4 damacanayı üretir veya dış alım kabul/kalite kontrolünden geçirir; Ticaret her aileden ≥10 satış ve tek aile payı ≤%70. Rahat modda kuyruk ≤40 sn ve Kooperatif boşluk ≤180 sn.

Olumsuz olay varsa erteleme sunulur; sınavda yeni ekonomik olay başlamaz. Kilit/arka plan süreyi ve müşterileri sıfırlamaz. Başarısızlık yalnız sınavı tekrarlatır; teslim/yatırım korunur. İlk sonuç ana final; diğerleri serbest oyunda tamamlanabilir. Ödül proje başına bir kez; tema/unvan/sahne ve dünya sonucu §48.5'e bağlıdır.

## A5 kabulü

Her finalin üretim ve dış alım yolu, kısmi teslim, kesinti, başarısız tekrar ve tekil ödülü test edilir. İkamesiz teslimde yanlış SKU kabul edilmez. Yeni kayıt ve göç edilmiş kayıtta aynı ilerleme sağlanır. Kayıt silen game-over veya kaçırılan eski göreve bağlı kalıcı kilit bulunmaz.

## Final uygulama durumu — A4

KAYNAK: §42, §48.3, §60.2. KARAR önerisi durum isimleri: Locked → Preparing → Wave1…Wave4 → ReadyForTrial → TrialRunning/TrialPaused → TrialFailed veya Completed. Bu isimler kaynak projede hazır enum değildir.

Locked görünümü eksik kriz/SKU/aile/kontrat/itibar koşullarını ayrı gösterir. Preparing yatırım önizlemesini sunar; onay bir kez yazılır. Aktif dalgaya kısmi kabul normal stoktan proje stoğuna geçirir, geri çekilemez/satılamaz/bozulmaz. Önceki dalga bitmeden sonraki dalga kabul edilmez. Her satır toplamın dörtte biridir; dalga limitleri ayrı tutulur. ReadyForTrial aşamasında geçerli 60 ziyaretçi/80 ihtiyaç planı üretilip kaydedilir; plan geçersizse sınav başlamaz.

Teslim örneği: Kooperatif dalgasında 10 küçük su, 5 adet 5 L su, 10 domates ve 5 köy somunu gerekir. Kısmi teslim ilgili satıra yazılır; tek lot başka dalga/satırda yeniden kullanılamaz. Kabul edilen final ürünleri müşteri satışı/AP/SKU sayacı üretmez.

## Hizmet sınavı ölçüm sözleşmesi

80 kabul eşiği `(i+0,5)/80`, i=0…79; seed ile ihtiyaçlara dağıtılır. Her ailede adil fiyatta en az 15 kabul edilebilir ihtiyaç olmalıdır. Ailelerin 30/25/25 ihtiyaç dağılımı ve bütçeye sığan bütün sepetler başlamadan doğrulanır. Araştırma ek 4 damacana koşulu önce teslim edilmiş stoktan sayılmaz; sınavdaki üretim veya kabul/kalite kontrol olayıyla sayılır, sonunda normal stokta kalır.

Medyan yalnız satış tamamlayan sınav cohort'udur; normal müşteri örnekleri karıştırılmaz. Yeterli satış yoksa bekleme 0 gösterip başarı verme; ≥64 ihtiyaç şartı ayrıca zorunludur. Kuyruk terk sayısı kişi, karşılanan ihtiyaç sayısı satırdır; ikisi aynı sayaç değildir. Kooperatif boşluk, gıda veya su tükenmesinin zaman birleşimidir; ikisi aynı anda boşken süre iki kat artmaz. Ticaret aile payı ihtiyaç adedi varsayımıyla değil kaynakta tanımlı ürün satışı üzerinden hesaplanır.

Save, seed yanında üretilmiş plan/sepet/kabul eşiklerini, ziyaretçi ilerlemesini, biten ihtiyaçları, geçen/kalan aktif süreyi ve tüm ölçüm toplamlarını taşır. Resume cohort'u yeniden üretmez. TrialFailed yatırımı/teslimleri korur; yeni denemenin seed politikası kaynakta kesinleşmiyorsa karar kaydı gerekir. Completed tek ödül verir; diğer final projeleri kapatılmaz.

## Olay seçiminden beklenen sınır örnekleri

Öğretim aktif → olumsuz olay aday olamaz. Beş günlük pencerede iki olumsuz → yenisi yok. Nakit dayanma<1 gün → yeni negatif yok, aktif olayı gizlice kaldırma yok. Boş aday kategorisi → ağırlık “olay yok”a gider. Yeniden yükleme → aynı planlanmış olay/seed/cooldown. Aynı boyutta +%25 ve +%25 talep → clamp(1+0,25+0,25)=1,40; 1,25×1,25 değildir. Kayıt sonrası geçmişi unutmak tekrar olay üretmemelidir.
