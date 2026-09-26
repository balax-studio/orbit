# Kozmetik ödeme, reklam ve gizlilik sözleşmesi

KAYNAK: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §25, §50–51, §54, §60.5, §63.2. P0/A2/A3'te gerçek SDK yoktur; A4 sandbox, A5 yayın doğrulamasıdır. Sağlayıcı, plugin ve backend seçimi henüz AÇIK'tır; aşağıdaki durumlar ürün sözleşmesidir, hazır SDK API'si değildir.

## Ürün sınırı

Ücretsiz ana oyun; kalıcı non-consumable kozmetikler. Para, kapasite, üretim hızı, XP, kalite, personel veya final ilerlemesi satılmaz. Zorunlu reklam yoktur. Ücretli SKU'lar ile reklam ödül havuzu ayrıdır. İşletme açığı veya oyuncunun harcama geçmişi teklif uygunluğu girdisi değildir.

## Ödüllü reklam uygunluğu

Varsayılan kapalıdır; oyuncu Destekle panelinde açar ve önce belirli kozmetiği seçer. Tüm koşullar birlikte gerekir: panel açık, kullanıcı etkinleştirmiş, internet/sağlayıcı kullanılabilir, yaratıcı metadata doğrulanmış, gizlilik tercihleri çözülmüş, oyun duraklayabilir, final sınavı aktif değil, başka reklam yok, sahip olunmayan ödül var, kayan 24 saatte başarılı izleme <3 ve son başarıdan ≥20 gerçek dakika geçmiş.

Başlangıç havuzu 12 kozmetik; her birinin tek oturumda tamamlanabilen, tipik 3–8 dakikalık yaratıcı görev karşılığı vardır. Saatler süren kaynak öğütme kabul edilmez. Bir doğrulanmış reklam bir kozmetik verir; rastgele kutu/parça biriktirme yoktur. Sağlayıcı azami süreyi bildirmiyorsa teklif yoktur; hedef kabul sınırı 30 sn, sağlayıcı doğrulanmadan süre vaat edilmez. Reklamın otomatik gösterilen ve kapatılabilen end-card'ı olabilir; ödül için ek tıklama, mağazaya geçiş veya indirme zorunluysa o envanter gösterilmez. Ağ bunu denetlemeye izin vermiyorsa reklam özelliği kapalı kalır. Bkz. [D-027 ve D-033](KARARLAR.md).

Reklam uygulama açılışında veya oyun döngüsünde ön yüklenmez. Oyuncu Destekle panelini açıp reklamı etkinleştirdikten ve gizlilik/yaş koşulları çözüldükten sonra asenkron hazırlanır. Hazırlık ve oynatma sırasında simülasyon duraklar; beş saniyede hazır değilse teklif iptal edilir, ödül ve kota değişmez. Gerçek cihazdaki FPS/bellek/ısı ölçümü A4 kapısıdır. Bkz. [D-029](KARARLAR.md).

## Reklam durumları ve kalıcılık

| Geçiş/durum | İşlem | Hata davranışı |
|---|---|---|
| Ready → UserConfirmed | Ödül seçimi, uygunluğu yeniden kontrol, attemptId/rewardId kaydı | Uygun değilse gerekçe, ücretsiz yol açık |
| Loading → Playing | Oyun duraklatma nedeni ekle | NoFill/Failed: ödül ve başarı kotası yok |
| Cancelled | Teklifte belirtildiği gibi ödül yok | Otomatik yeniden oynatma yok; diğer pause nedenlerini koru |
| AwaitingVerification/Pending | Güvenilir doğrulama bekle, bekleyen kaydı koru | Tekrar reklam izletme; bağlantıda aynı attempt'i çöz |
| Granted | Doğrulanmış completionId benzersiz; hak ve başarı kaydı bir kez | Tekrarlanan callback ikinci hak vermez |

İstemci “tamamlandı” callback'i tek başına hak vermez. Sağlayıcı imzalı doğrulaması veya eşdeğer güvenilir sunucu olayı gerekir. Kalıcı oyuncu hesabı/UUID kurulmaz: her teklif için rastgele `attemptId`, kısa süre tutulan tekilleştirme kaydı ve maliyeti ölçülen küçük S2S endpoint kullanılır. Secret WebView içine konulmaz. Gerçek SDK daha fazla veri gerektirirse veri envanteri ve saklama süresi yayın öncesi doğrulanır; kabul edilemezse reklam kapalı kalır. Bkz. [D-028 ve D-030](KARARLAR.md).

Doğrulama beklerken ücretsiz görev aynı kozmetiği verdiyse hak başka sahip olunmayan reklam kozmetiği seçimine dönüşür; paraya/stat'a dönüşmez. Havuz baştan bittiyse teklif yoktur. Gerçek saat yalnız sıklık/gizlilik işidir; oyun saatine eklenmez. Saat geri alma, sonradan gelen completion ve havuzun bekleme sırasında tükenmesi politikaları AÇIK'tır; sessizce ödül silme veya kota atlama uygulanmaz, sandbox kabulünden önce karara bağlanır.

## Satın alma/hak akışı

UI yerelleştirilmiş mağaza fiyatını gösterir; gerçek onay native mağaza ekranındadır. Domain oyun simülasyonu mağaza SDK'sını çağırmaz. Ürün ID/platform katalog eşleşmesi, transaction ID, ürün, doğrulama/hak durumu ve restore/refund geçmişi ayrı kayıttır; mağaza SDK payload alanları sağlayıcı doğrulanınca eşlenir.

Pending/parental approval hak vermez; kullanıcı iptali hata cezası değildir. Bağlantı kaybında sonuç uydurulmaz; aynı transaction sorgulanır. Doğrulanmış işlem bir kez hak verir. Google acknowledgment/Apple finishing seçilen adaptör gereğine göre doğrulanır; tamamlanamayan iş tekrar denenebilir ama hak çoğalmaz. Restore aynı mağaza hesabına ait hakları geri getirir. Refund/revoke bağlantı geldiğinde hakkı kaldırır ve ücretsiz varsayılan görünüm uygulanır; oyun parasına borç yazmaz. Çevrimdışıyken son doğrulanmış kozmetik geçici olarak görünebilir. Süreli internet zorunluluğu/DRM yoktur. Bkz. [D-031](KARARLAR.md).

Yerel kayıt kaybı ile satın alma hakkı kaybı aynı değildir. Reklamla kazanılan kozmetik yalnız yerel kayıttadır; temiz kurulumda otomatik geri gelmez, ücretsiz görevle yeniden kazanılabilir. Satın alınan kozmetik aynı platformun mağaza hesabından restore edilir. iOS↔Android bulut kayıt veya kozmetik aktarımı vaat edilmez. Bu ayrım reklamdan önce oyuncuya gösterilir. Ham receipt/token/kişisel veriler günlüklerde açık yazılmaz; test kanıtında maskelenir.

## Gizlilik ve release kapısı

Reklam yüklemesi gerekli tercihlerden önce başlamaz. ATT ile uygulama içi reklam tercihi ayrı kavramdır; takip yapılacaksa gerekli izin uygulanır, sırf reklam var diye gereksiz izin açılmaz. İzin reddi çekirdek oyun veya ücretsiz ödül yolunu cezalandırmaz. Mağazada hedef kitle doğru beyan edilir. Açılışta sırf reklam için genel bir yaş duvarı yoktur; çocuk veya karma kitle kuralları nötr yaş ekranı gerektiriyorsa ilgili reklam işlevinden önce uygulanır. Yaş/güvenli sunum çözülemiyorsa reklam kapalı kalır. Bkz. [D-032](KARARLAR.md).

Gizlilik ekranı veri silme talebi ile yerel kaydı sıfırlama seçeneklerini açıkça ayırır. Doğrulanabilir S2S deneme kayıtları talep ve geçerli saklama kuralları kapsamında silinir; oyuncu tam yerel silmeyi seçerse reklam ödülleri de silinir. Mağaza sahipliği mağaza hesabında kalır ve restore edilebilir. Oyun hesabı açılırsa uygulama içinden hesap silme başlatma gereği ayrıca uygulanır. Bkz. [D-030](KARARLAR.md).

0,50–1 USD eCPM yalnız örnek varsayımdır: üç ücretlendirilen gösterim ve tam dolulukta günlük 0,0015–0,003 USD/aktif kullanıcı hesabı çıkar; gerçek gelir garantisi değildir. A4'te net gelir, doluluk ve doğrulama/operasyon maliyeti ölçülür. Kabul edilebilir pozitif ekonomi kurulamazsa reklam yayınlanmaz. Bkz. [D-028](KARARLAR.md).

A4'te SDK bazında veri envanteri hazırlanır: toplanan alan, amaç, alıcı, cihazdan çıkış, saklama/silme, izin, takip ilişkisi. Bunlar sağlayıcıdan doğrulanmış veriyle doldurulur; boş “veri toplamıyoruz” metni yazılmaz. A5'te mağaza beyanları, privacy manifest/required-reason API, Data safety, destek/gizlilik adresleri ve üretim/test kimliği ayrımı gerçek build ile kontrol edilir. Hukuki/mağaza kuralları yayın tarihinde resmî kaynaklardan doğrulanır; bu belge onay garantisi değildir.

## A4 kabul örnekleri

Aynı completion 3 kez → 1 hak/1 başarı; NoFill → 0 hak/0 başarı; parental approval → pending; iptal → hak yok; restore iki kez → aynı hak kümesi; reklam sırasında arama → callback tek başına resume etmez; offline → çekirdek oyun açık; ücretsiz görev+geciken doğrulama → alternatif kozmetik hakkı, kredi yok. İki platformda ayrı kanıt olmadan entegrasyon tamamlandı sayılmaz.
