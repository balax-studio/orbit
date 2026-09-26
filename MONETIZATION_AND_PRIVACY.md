# Kozmetik ödeme, reklam ve gizlilik sözleşmesi

KAYNAK: [anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §25, §50–51, §54, §60.5, §63.2. P0/A2/A3'te gerçek SDK yoktur; A4 sandbox, A5 yayın doğrulamasıdır. Sağlayıcı, plugin ve backend seçimi henüz AÇIK'tır; aşağıdaki durumlar ürün sözleşmesidir, hazır SDK API'si değildir.

## Ürün sınırı

Ücretsiz ana oyun; kalıcı non-consumable kozmetikler. Para, kapasite, üretim hızı, XP, kalite, personel veya final ilerlemesi satılmaz. Zorunlu reklam yoktur. Ücretli SKU'lar ile reklam ödül havuzu ayrıdır. İşletme açığı veya oyuncunun harcama geçmişi teklif uygunluğu girdisi değildir.

## Ödüllü reklam uygunluğu

Varsayılan kapalıdır; oyuncu Destekle panelinde açar ve önce belirli kozmetiği seçer. Tüm koşullar birlikte gerekir: panel açık, kullanıcı etkinleştirmiş, internet/sağlayıcı kullanılabilir, yaratıcı metadata doğrulanmış, gizlilik tercihleri çözülmüş, oyun duraklayabilir, final sınavı aktif değil, başka reklam yok, sahip olunmayan ödül var, kayan 24 saatte başarılı izleme <3 ve son başarıdan ≥20 gerçek dakika geçmiş.

Başlangıç havuzu 12 kozmetik; her birinin tek seferlik ücretsiz yaratıcı görev karşılığı vardır. Bir tamamlanmış reklam bir kozmetik verir; rastgele kutu/parça biriktirme yoktur. Sağlayıcı azami süreyi bildirmiyorsa teklif yoktur; hedef kabul sınırı 30 sn, sağlayıcı doğrulanmadan süre vaat edilmez. Zorunlu ek end-card/indirme koşulu kabul edilmez.

## Reklam durumları ve kalıcılık

| Geçiş/durum | İşlem | Hata davranışı |
|---|---|---|
| Ready → UserConfirmed | Ödül seçimi, uygunluğu yeniden kontrol, attemptId/rewardId kaydı | Uygun değilse gerekçe, ücretsiz yol açık |
| Loading → Playing | Oyun duraklatma nedeni ekle | NoFill/Failed: ödül ve başarı kotası yok |
| Cancelled | Teklifte belirtildiği gibi ödül yok | Otomatik yeniden oynatma yok; diğer pause nedenlerini koru |
| AwaitingVerification/Pending | Güvenilir doğrulama bekle, bekleyen kaydı koru | Tekrar reklam izletme; bağlantıda aynı attempt'i çöz |
| Granted | Doğrulanmış completionId benzersiz; hak ve başarı kaydı bir kez | Tekrarlanan callback ikinci hak vermez |

İstemci “tamamlandı” callback'i tek başına hak vermez. Sağlayıcı imzalı doğrulaması veya eşdeğer güvenilir sunucu olayı gerekir. Bunun için gereken sunucu ve kimlik eşleştirme yolu A4 sağlayıcı seçiminde çözümlenir; secret WebView içine konulmaz. Güvenilir doğrulama yoksa gerçek reklam özelliği kabul edilemez; çekirdek oyun devam eder.

Doğrulama beklerken ücretsiz görev aynı kozmetiği verdiyse hak başka sahip olunmayan reklam kozmetiği seçimine dönüşür; paraya/stat'a dönüşmez. Havuz baştan bittiyse teklif yoktur. Gerçek saat yalnız sıklık/gizlilik işidir; oyun saatine eklenmez. Saat geri alma, sonradan gelen completion ve havuzun bekleme sırasında tükenmesi politikaları AÇIK'tır; sessizce ödül silme veya kota atlama uygulanmaz, sandbox kabulünden önce karara bağlanır.

## Satın alma/hak akışı

UI yerelleştirilmiş mağaza fiyatını gösterir; gerçek onay native mağaza ekranındadır. Domain oyun simülasyonu mağaza SDK'sını çağırmaz. Ürün ID/platform katalog eşleşmesi, transaction ID, ürün, doğrulama/hak durumu ve restore/refund geçmişi ayrı kayıttır; mağaza SDK payload alanları sağlayıcı doğrulanınca eşlenir.

Pending/parental approval hak vermez; kullanıcı iptali hata cezası değildir. Bağlantı kaybında sonuç uydurulmaz; aynı transaction sorgulanır. Doğrulanmış işlem bir kez hak verir. Google acknowledgment/Apple finishing seçilen adaptör gereğine göre doğrulanır; tamamlanamayan iş tekrar denenebilir ama hak çoğalmaz. Restore aynı mağaza hesabına ait hakları geri getirir. Refund/revoke ilgili hakkı günceller; oyun parasına borç yazmaz. Aktif iade edilmiş kozmetiğin görünümden çıkarılma/fallback davranışı ürün kararı olarak kaydedilir.

Yerel kayıt kaybı ile satın alma hakkı kaybı aynı değildir. iOS↔Android bulut kayıt veya kozmetik aktarımı vaat edilmez. Ham receipt/token/kişisel veriler günlüklerde açık yazılmaz; test kanıtında maskelenir.

## Gizlilik ve release kapısı

Reklam yüklemesi gerekli tercihlerden önce başlamaz. ATT ile uygulama içi reklam tercihi ayrı kavramdır; takip yapılacaksa gerekli izin uygulanır, sırf reklam var diye gereksiz izin açılmaz. İzin reddi çekirdek oyun veya ücretsiz ödül yolunu cezalandırmaz. Yaş grubu ve güvenli sunum belirlenemiyorsa reklam kapalı kalır.

A4'te SDK bazında veri envanteri hazırlanır: toplanan alan, amaç, alıcı, cihazdan çıkış, saklama/silme, izin, takip ilişkisi. Bunlar sağlayıcıdan doğrulanmış veriyle doldurulur; boş “veri toplamıyoruz” metni yazılmaz. A5'te mağaza beyanları, privacy manifest/required-reason API, Data safety, destek/gizlilik adresleri ve üretim/test kimliği ayrımı gerçek build ile kontrol edilir. Hukuki/mağaza kuralları yayın tarihinde resmî kaynaklardan doğrulanır; bu belge onay garantisi değildir.

## A4 kabul örnekleri

Aynı completion 3 kez → 1 hak/1 başarı; NoFill → 0 hak/0 başarı; parental approval → pending; iptal → hak yok; restore iki kez → aynı hak kümesi; reklam sırasında arama → callback tek başına resume etmez; offline → çekirdek oyun açık; ücretsiz görev+geciken doğrulama → alternatif kozmetik hakkı, kredi yok. İki platformda ayrı kanıt olmadan entegrasyon tamamlandı sayılmaz.
