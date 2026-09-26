# Orbit Market — UI/UX, yaşayan dünya ve görsel üretim rehberi

Sürüm: 2.0 · 26 Eylül 2026. Mevcut UI_DESIGN_SYSTEM.md genişletilmiştir. [Anayasa](OYUN_GELISTIRME_DEVIR_DOSYASI.md) §14–15, §32, §43, §48.5, §60–63 bağlayıcıdır. Yerel ürün ağacı [içerik kataloğunda](OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md) taslaktır; bağlayıcı oynanış değerleri ana kaynakta kalır. Etkileşim kuralları [CONTROLS_AND_UX.md](CONTROLS_AND_UX.md), fazlar [PLAN.md](PLAN.md) içindedir.

**KAYNAK:** Ana dosyada kesinleşmiş gereksinim. **SANAT KARARI:** Kullanıcının yaşayan/hareketli/gelişen dünya isteği için bu belgede verilen görsel tasarım; yeni ekonomi bonusu değildir. **AÇIK:** Prototipte doğrulanacak konu. KAYNAK olarak belirtilmeyen yeni biçim/animasyon önerileri SANAT KARARI'dır. Bunlar üretilmiş asset veya çalışan ekran iddiası değildir.

## 1. Yaşayan evrenin hedefi

Oyuncu malların nereden geldiğini, kimin çalıştığını, hangi rafın boşaldığını ve yaptığı yatırımla yerleşimin nasıl değiştiğini görmelidir: girdi makineye gelir → mekanizma çalışır → ürün çıkar → görevli taşır → raf dolar → müşteri alır → kasa tamamlanır.

Yaşanmışlık; oturma köşesi, dolap, mola, teslim alanı, yön levhası, tamir izleri, topluluk panosu ve tekrar karşılaşılan kişilerle kurulur. Her aktör sürekli koşmaz; sessiz anlar da vardır. Yaşayan evren; sınırsız açık dünya, uzak bölge seyahati, savaş, araç kullanma, konut simülasyonu veya çevrimdışı ilerleme eklemez.

| Katman | Görev | Örnek | Sınır |
|---|---|---|---|
| İşlevsel dünya | İşletme durumunu göster | Üretim, yük, raf, kuyruk | Domain state'i izler |
| Sosyal hareket | İş/mola/ziyareti okunur kıl | Oturma, kasaya dönme, selam | Yeni satış/XP üretmez |
| Ortam | Mağazayı yaşanmış göster | Tabela, havalandırma, sokak ışığı | Talep/rota değiştirmez |
| UI | Kesin miktar, neden, maliyet | Stok, komut önizlemesi | Application sorgusu/komutu |

KAYNAK §61: UI DOM/CSS/TypeScript, dünya Three.js; tek sahne/renderer/animasyon döngüsü. React/Tailwind veya yeni animasyon paketi zorunlu değildir.

## 2. Renk, tipografi, malzeme ve şekil

### Kesin token'lar — KAYNAK §62.1

| Token | Renk | İşlev |
|---|---|---|
| ink | #171717 | Metin/kontur/koyu metal |
| paper | #F4F0E6 | Ana zemin/panel |
| sun | #FFE156 | Ana eylem/kredi/seçim |
| cyan | #35D9E6 | Bilgi/üretim |
| lime | #A7EB52 | Uygun/tamamlandı |
| pink | #FC4F8B | İkaz/hikâye vurgusu |
| white | #FFFFFF | Açık yüzey |

Kontur 2–3 CSS px; buton sert gölgesi 3–4 px, panel 4–5 px; blur=0; köşe 6–10 px. Düz renk, gradient yok. Başlık ağırlığı 800–900, finansal sayılar tabular; uzun metin normal cümle düzeninde. Geometrik sans font lisans/TR karakter/okunabilirlikle seçilir; belirli font zorunlu değildir. İkon kalın SVG; emoji yok.

Basışta içerik 2 px iner, gölge 1 px'e küçülür; az harekette öteleme kaldırılır. Titreşim hafif/kapatılabilir. Neo-Brutalist becerideki alternatif palet ve Flutter örnekleri bu projenin token/teknoloji sözleşmesini değiştirmez.

### Dünya malzemeleri

KAYNAK §62.2: mat, 2–3 düz renk/faset varyantı, küp/prizma ve az faset. Kırık beyaz mağaza, mürekkep taşıyıcı metal, cyan üretim, sarı etkileşim. Dünya doygunluğu HUD'dan düşüktür; bütün aksanlar aynı anda kullanılmaz. Bloom kapalı; blob/baked gölge tercih edilir. Her küpte pahalı outline yok; seçili nesne ve UI'da kontur yoğunlaşır.

Sanat malzeme aileleri: mağaza paneli, koyu metal, opak ambalaj, mat tekstil, blok bitki, kaya. Cam küçük sınırlı yüzey; gerçek zamanlı kırılma/yansıma gerekmez. Vida/çizik/etiket atlasla sade tutulur. Servis hattının daha aşınmış görünmesi yeni hijyen/temizlik metriği değildir. Karanlık tema HUD varyantıdır, gün/gece ekonomisi değildir; kesin koyu renk çiftleri AÇIK ve kontrast testi ister.

## 3. Kamera, ölçek ve ekran kompozisyonu

P0 ortografik kamera, sınırlı pan/zoom, kapatıcı nesnenin seçili aktörü gizlememesi ve cihaz profiline göre render kalitesi [KARARLAR.md](KARARLAR.md) D-009'da kayıtlıdır. iPhone/iPad oranında dünya esnetilmez; HUD safe-area/breakpoint'e uyar (D-016).

Safe-area `env(safe-area-inset-top, 0px)`, `env(safe-area-inset-right, 0px)`, `env(safe-area-inset-bottom, 0px)` ve `env(safe-area-inset-left, 0px)` değerlerinden merkezi CSS tokenlarına aktarılır; her panel için sabit 40 px veya yeni Tailwind eklentisi kullanılmaz. Klavye açıldığında yalnız metin paneli görünür alana taşınır, Canvas ezilmez. Bkz. [KARARLAR.md](KARARLAR.md) D-034/D-039.

A.1–A.6 için net başlangıç: §9'daki 6×6 m oda ve 1 m grid, Şişeleme tezgâhı 1×2 ve domates yatağı; mat low-poly kübik dünya; 45°/32° ortografik bakış, oda merkezine hedefleme ve ekrana göre ortografik görüş yüksekliği. Sayısal kamera ofseti, pan sınırı ve ışık kararının kaynağı [KARARLAR.md](KARARLAR.md) D-017'dir; 32° kaynak aralığı 30–35° içindeki P0 başlangıç seçimidir.

KAYNAK §9/§62: 1 hücre=1 oyun birimi, varsayılan oda 6×6, bağlantı koridoru en az 2 hücre. Orthographic kamera tercih edilir; 30–35° aşağı eğim, 45° yatay grid dönüşü. Güncel §62.3 nedeniyle 90° kontrol nesne döndürmeye aittir; eski kamera dönüş ifadesi otomatik özellik yapılmaz.

Portre başlangıç oranları: orta %65 dünya, üst %12 kredi/görev, alt %18 hareket/eylem. Safe-area hariç başlangıç önerileridir, katı/toplam ekran bölüşümü değildir. 9:16–9:21 telefon ve portre tablet destek düzenidir. Tablet geniş görünüm/detay verir; yeni oyun kuralı getirmez.

```text
Üst safe area
Kredi · Duraklat                 Tek etkin hedef

            Dünya / market / üretim
         Oyuncu ve seçili hedef görünür

Hareket alanı                  En fazla 3 ana eylem
Alt safe area
```

Panel seçili nesneyi kapatıyorsa panel/kamera kontrollü uyarlanır. Yakın duvar/çatı üstü görsel kesilebilir; collider ve erişim değişmez. İnşa grid'i normal oyunda görünmez. Otomatik kamera sarsıntısı/dramatik zoom yoktur. Yakın/uzak görünümler aynı geometri LOD düzenindedir. Kesin zoom sınırı/model ölçüsü AÇIK prototip kararıdır; kaynak footprint değiştirilmez.

## 4. Market dışı ve mağaza çevresi

KAYNAK: küçük mağaza ve bahçe parselleri ile bağlantı yolları; sınırsız arazi üretimi yoktur. Oynanabilir bölüm ile uzak dekor birbirinden ayrılır.

| Dış bölge | Görsel öğeler | Yaşam/hareket | Bağlı durum |
|---|---|---|---|
| Market önü | Tabela, giriş çerçevesi, yön işareti | Gerçek müşterinin yaklaşması | Müşteri rotası |
| Servis yanı | Teslim portu, kasa, kapasite işareti | Sevkiyatta kabul hareketi | Sipariş |
| Bağlantılar | Koyu taşıyıcı köprü, açık yürüme şeridi | Çalışanın yükle geçişi | Erişim grafiği |
| Enerji kenarı | Elektrik panosu ve kablo | Sabit güç durum işareti | E/öncelik |
| Sera kenarı | Blok yaprak, kanal izleri | Üretime bağlı bitki pozu | Parti |
| Sosyal alan | Pano, oturma, işaretler | Göreve bağlı kısa konuşma | Açılmış oda/görev |
| Uzak siluet | Mağaza blokları, tabela, seyrek sokak ışığı | Düşük öncelikli ortam döngüsü | Ekonomik etkisi yok |

A4 teslim aracı yalnız sevkiyat sunumu olabilir; araç kullanma veya yeni teslim süresi eklemez. AwaitingSpace'de sonsuz araç kuyruğu oluşturulmaz. Dekoratif uzak araç kullanılırsa gerçek teslimattan konum/işaretle ayrılır; mal geldi olayı üretmez.

İlk market küçük ve sakin; gerçek modül alındıkça yollar/bağlantılar/levhalar eklenir. Satın alınmamış oda kullanılabilir gösterilmez. Boş geniş alan rastgele kalabalıkla doldurulmaz. İnşa sınırı zemin kenarı ve seçim işaretiyle anlaşılır.

## 5. Market içi, kasa ve müşteri yolu

Girişten ilk raf ve kasa kolay seçilir. Raf servis yüzleri ve gerçek koridorlar erişilebilir; taşıma yolu kuyrukla kalıcı kilit oluşturmaz. Örnek düzen satış önde, üretim yan/arkada, mal kabul depo kenarında; bu öneri zorunlu satın alma/tek koridor düzeni değildir.

Zemin satış/servis sınırını düşük kontrast farkla gösterir. Duvar/tavan ana eylemi kapatmaz. Kasa üç büyük parçadan okunur: tezgâh, terminal, ürün yüzeyi. Müşteri ürünü sunar, oyuncu/kasiyer işlem noktasındadır; ancak committed satıştan sonra kısa onay sesi/görseli gelir. Pending kayıt sırasında kutlama yoktur. Para efekti varsa gruplandırılır; kesin bakiye HUD'dadır.

Kuyruk gerçek aktör dizilimiyle okunur; seçili kasa panelinde bekleme ayrıntısı vardır. Terk eden müşteri çıkışa döner; başarı sesi çalınmaz. Kasa erişimsizse kalıcı küçük işaret ve neden. Dolapta rol işareti, masada çizelge, duvarda topluluk duyurusu yaşanmışlık sağlar. İnteraktif olmayan dekor ana eylem sarısı/buton biçimi kullanmaz, gizli collider ile yolu kapatmaz.

## 6. Raflar ve ürün doluluğu

KAYNAK: modüler basamak, temsilî yığın/instancing; stok kadar mesh yok. Satış rafı, depo rafı ve kabul tamponu farklıdır. Depo rafı 1×2, 8 slot/stackSize10 sözleşmesi görünümle değişmez.

| Tür | Siluet | Bilgi | Hareket |
|---|---|---|---|
| Satış rafı | Açık basamak ve ön dudak | Seçimde SKU/fiyat/adet/kalite | Al/yerleştir pozu |
| Depo rafı | Taşıyıcılar ve kutu bölmeleri | Bölge; seçimde slot/lot | Gerçek transfer |
| Soğutucu | Yalıtımlı hacim ve küçük kapı | Soğuk/güç; detayda ömür | Kısa kapı hareketi |
| Mal kabul | Alçak palet/tampon | Bekliyor/kontrol/kabul | Sevkiyat adımı |

SANAT KARARI doluluk bantları: 0, %1–25, %26–60, %61–100. Bunlar sadece temsilî paket sayısını belirler, mantıksal miktarı yuvarlamaz. Pozitif stokta en az bir paket; boş raf gerçekten boş. Son ürün satılınca animasyon gecikmesi ürünü hâlâ satın alınabilir göstermez.

Karışık kalite/lotta her pakete etiket çoğaltılmaz; örnek görünüm ve panel listesi kullanılır. Fiziksel/serbest/rezerve/yoldaki ayrı sayılardır; rezerve ürün fiziksel olarak rafta kalabilir. Bozulmuş ürün atık işareti alır. Yük oyuncu/görevli üstünde temsil edilir; raftan rafa sürekli ışınlanma efekti yok. Aynı olay tekrarında yeni ürün modeli üretilmez.

## 7. Ürün siluet kataloğu

ID/aileler KAYNAK, ambalaj ve siluetler SANAT KARARI'dır. Dünya modeli/UI simgesi/taşınan yük aynı ana şekli korur. Kalite tek/çift/üçlü küçük işaret + metinle ayrılır; altın parıltı yeni nadirlik değildir. Yalnız renkle ürün ayırma yoktur.

### Yerel ürünler ve taşıma siluetleri

Kimlikler [Tier 1–4 ürün ağacından](OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md) gelir. Ham su geniş servis kabında; küçük cam su ince şişede, 5 L bidon geniş saplı kapta, 19 L damacana kalın gövdeli büyük kapta görünür. Domates kırmızı salkım, siyez başak, zeytin koyu meyve, göl sazı uzun demet, taze alabalık yatay kasa, hasır sepet örgü siluetiyle ayrılır. Aynı ürünün raftaki, eldeki ve stok panelindeki işareti tutarlıdır. Kalite yalnız renkle gösterilmez; görsel sanat kararı stok/para kuralı üretmez.

## 8. Yerel üretim alanının hareket dili

Şişeleme tezgâhı dolum başlığını yalnız aktif partide hareket ettirir; domates yatağı büyümeyi simülasyon durumundan gösterir. Taş pres, değirmen, fırın, dokuma tezgâhı ve diğer istasyonlar [ürün ağacındaki](OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md) gerçek iş durumunu görselleştirir. Animasyon kendi başına girdi tüketmez, ürün oluşturmaz veya para değiştirmez. Her istasyonda okunur girdi/çıktı ve erişilebilir servis hücresi bulunur.

## 9. Depo, kabul ve lojistik

Ham/ara/nihai/soğuk/kabul bölgeleri büyük basit işaretle ayrılır. Seçili raf panelinde kullanılan/rezerve/toplam slot, SKU/kalite ve lot detayı vardır. Aynı slotu paylaşan lotlar gereksiz ayrı fiziksel kutu çoğaltmaz. Sayısal bilgi sürekli canvas metni olarak basılmaz.

Sevkiyat: planlandı → yolda → kabul alanında temsilî kasa → kontrol → depoya transfer. Yoldaki ürün rafta görünmez. AwaitingSpace: tek bekleyen teslim işareti, yer aç/bölge seç/iade; sonsuz araç kuyruğu veya gizli ceza yok. Oyuncu gerçek kabul olmadan stok gelmiş sanmamalı.

Taşıyıcı yükü küçük/büyük temsilî yük pozu, gerçek adedi panelde. Rota beklerken yerinde koşmaz. Görev iptalinde yük yok olmaz. Kapı geçişi görsel yük genişliğiyle test edilir. Soğuk raf kar parçacığıyla ekran doldurmaz; sabit simge yeterli. Güç kesilince simge değişir, ürün aniden çürümez. Atık işaretli yığındır; kaldırma yeni gelir yaratmaz.

## 10. Personel, müşteriler ve sosyal yaşam

### Karakter kiti ve roller

KAYNAK: blok baş/gövde, 8 rol/6 köken, ilk sürümde en fazla 20 personel. Paylaşılan iskelet/gövde ve sınırlı aksesuar varyantı; 48 rol×köken kombinasyonu 48 ayrı model değildir. Köken yerleşim deneyimidir, gerçek milliyet/etnik stereotip değildir.

| Rol | Görsel işaret | Görev pozu |
|---|---|---|
| Raf görevlisi | Kısa önlük, raf işareti | Al/uzan/bırak |
| Kasiyer | Hizmet rozeti | Müşteriye dön, terminale dokun |
| Taşıyıcı | Taşıma çerçevesi | Yüklü yürüyüş/bırakma |
| Üretim operatörü | Önlük, kalibrasyon aracı | Kontrol portunda çalışma |
| Teknisyen | Alet çantası | Servis yüzeyinde alet kullanma |
| Yetiştirici | Biyolojik işaret/eldiven | Yatak/toplama portuna eğilme |
| Satın alma sorumlusu | Basit plan tableti | Teslim/plan kontrolü |
| Vardiya yöneticisi | Çizelge rozeti | Pano kontrolü/ekibe dönme |

Köken varyantları: Merkez hizmet yaması, Soğuk Depo yalıtımlı kayış, Sera bitki detayı, Atölye dayanıklı alet yaması, Kervan sevkiyat etiketi, Akademi veri rozeti. Bunlar ek bonus vermez; katalog etkileri tek kaynaktır.

### Animasyon repertuvarı

Idle nefes/ağırlık aktarımı, yürüyüş, yüklü yürüyüş, al/bırak, kasa/üretim pozu, rota bekleme, güvenli iş bitirme, oturma/dinlenme, işe dönüş, kısa selam/konuşma. Ortak hareketler paylaşılır; rol farkı aksesuar ve çalışma noktasıdır.

Mola gerçek F/koltuk rezervasyonuyla başlar; dekoratif oturma görevliyi işten düşürmez. Yorgunluk enerji kartı ve küçük poz değişimiyle okunur, bütün beden kırmızı yanıp sönmez. Memnuniyetsizlik stok çalma veya aşağılayıcı hareket üretmez. Ayrılan personel önce yük/devir işlemini çözer.

Idle fazları senkron olmak zorunda değildir; görsel seed farklılaşabilir, ekonomi RNG'sini tüketmez. İş hızını temsil etmek için yürüme hızını Domain'den bağımsız değiştirme. Bekleyen çalışanın aktif iş yaptığını gösteren animasyon oynatma.

### Müşteriler

Giriş → raf → ürün alma → kasa → kuyruk → ödeme → çıkış. Yoklukta bakınma/alternatif/çıkış; fiyat veya bütçe reddinde kutlama yok. Üç profil aksesuarı: yerleşim çalışanı iş çantası, araştırmacı saha aracı, kurye sevkiyat çantası. Profil müşteri bütçesini gizlice değiştiren kozmetik değildir.

Kuyrukta baş çevirme/ağırlık değiştirme aynı sabır süresini korur. Her alışveriş uzun diyalogla kesilmez. Tekrarlı sesle veya görsel kalabalıkla gerçek spawn artırılmaz.

### Atmosfer NPC'leri

İsteğe bağlı A4 ortam sakinleri bütçe içinde, müşteri satış işareti taşımadan görünür. Collider ile işletme yolunu kapatmaz, ihtiyaç/satış sayacı oluşturmaz. İş aktörleri önceliklidir; bütçe dolunca dekoratif NPC azaltılır. Oyuncu hangisinin müşteri olduğunu ayıramıyorsa biçim değiştirilir veya ortam NPC'si kaldırılır.

## 11. Odaların yaşanabilir görünümü

KAYNAK oda etkileri içerik kataloğuyla sınırlı; aşağıdaki görsel ayrıntılar yeni bonus değildir.

| Alan | Görsel odak | Yaşam/hareket | Bilgi |
|---|---|---|---|
| Satış | Açık raf/kasa | İkmal, alışveriş, kuyruk | Stok/hizmet |
| Kuru depo | Bölmeler/kasalar | Gerçek transfer | Doluluk/rezervasyon |
| Dinlenme | Koltuk/sebil/bitki | Oturma/dinlenme | Mola/ayrılmış koltuk |
| Soyunma | Dolap/hazırlık noktası | Vardiya hazırlığı | Görev |
| Eğitim | İki kişilik masa/pano | Mentor/öğrenci pozu | Süre/ücret/beceri |
| Yönetim | Terminal/çizelge | Plan kontrolü | Vardiya/sipariş |
| Bakım atölyesi | Alet tezgâhı | Servise hazırlık | Servis kuyruğu |
| Soğuk depo | Yalıtımlı raf | Kabul/çekme | Ömür/güç |
| Mal kabul | Port/kontrol masası | Kontrol/taşıma | Sipariş |
| Müşteri köşesi | Oturma/yönlendirme | Desteklenen bekleme | Konfor/erişim |
| Sera | Blok bitki yatakları | Biyohat | Tarif/girdi |
| İşleme | Makine portları | Üretim/servis | Darboğaz |
| Enerji | Modül/bağlantı yüzeyi | Durum işareti | Kapasite/öncelik |
| Topluluk | Pano/proje izi | Görev konuşması | İtibar/proje |

Son dört alanın eksik bedel/donanım kuralları görselle tamamlanmış olmaz. Odaların hepsi P0'ya eklenmez. Duvar arkasında erişilemeyen koltukta personel oturmaz. Konfor dekoru insanların kullanımına göre konumlanır, sırf bonus istifi olarak birbirine gömülmez.

## 12. Gelişen evren ve kalıcı izler

Görsel gelişim gerçek satın alma/görev/proje sonucunu izler; bölüm arttı diye ücretsiz tesis yaratmaz. Her değişim tetikleyici → görünür sonuç → kalıcılık → faz ilişkisi taşır.

| Tetikleyici | Görsel sonuç | Kalıcılık/sınır |
|---|---|---|
| İlk market | Küçük mağaza, basit tabela, az ürün | P0 minimum kit |
| İlk otomasyon | Görevlinin raf rotası/iş bölümü | Gerçek atama sürdükçe |
| Depo/tedarik | Satın alınmış raf ve kabul alanı | Yerleşim kaydı |
| Enerji/oda genişlemesi | Gerçek modül/bağlantı/levha | Satın alma; ücretsiz tesis yok |
| Yeni ürün ailesi | Gerçek stokta yeni siluetler | Boş raf kendiliğinden dolmaz |
| Kriz çözümü | Pano ve diyalog değişimi | Görev kaydı |
| Kooperatif finali | Ortak pano/dayanışma konuşmaları | Final bayrağı; para bonusu yok |
| Araştırma finali | Teslim kabul masası/ziyaretçi konuşması | Final bayrağı |
| Ticaret finali | Sevkiyat tabelası/tüccar konuşması | Final bayrağı; diğer yollar açık |

Son üç satır KAYNAK §48.5: aynı kit içinde üç kısa NPC sahnesi. Sahne atlanabilir; kamera zorla döndürülmez. Dekorun tekrar kurulması ödülü yeniden vermez. Final sonrası dünya oyuncunun tercihini hatırlar; ekonomi ücretsiz sınırsız para üretmez.

### Geçici olay atmosferi

Festival: küçük bayrak/tabela. Araştırma ziyareti: ziyaretçi aksesuarı/pano. Şebeke bakımı: ilgili güç noktasında teknik işaret. Nakliye gecikmesi: kabul panosunda bilgi. Sıcaklık dalgası: sınırlı sıcak ton/uyarı, tam ekran ısı kırılması yok. Mağaza onarımı: dış kenarda teknik dekor, kaynakta olmayan kapalı koridor cezası yok.

Görsel katman kayıtlı olay aktifken görünür; bitince yalnız o katman kalkar. Olay kapalıysa dekor gizli ekonomik ceza vermez. Gündüz/gece ışık varyantı istenirse A4 kozmetik seçenektir; yeni vardiya, çevrimdışı saat veya zorunlu gece bekleme sistemi değildir, zorunlu ilk sürüm işi sayılmaz.

## 13. Ekran ve panel kataloğu

Makine detayının DOM paneli, ilerleme işaretinin görsel sunumu, font fallback'i, haptic ve kayıt durum mesajları [KARARLAR.md](KARARLAR.md) D-008/D-010'a uyar. Yakın nesnelerde seçim belirsizliği oyuncuya seçici panelle gösterilir (D-009).

B.1–B.5 ve C.1–C.3: portre güvenli alan oranları, Neo-Brutalist renkler, 0,3 sn güvenli al/bırak, onaylı inşa, satış commit'inden sonra tek para vurgusu, makinede okunur süre/durma nedeni ve yetersiz kredide somut gerekçe [KARARLAR.md](KARARLAR.md) D-018/D-019'da sabitlenmiştir.

KAYNAK §15/§60: telefon alt sayfa, tablet yan detay; aynı anda tek ana yönetim sayfası. İlk açılışta dünya görünür, landing/sinematik kapak yok. Menü gerektiğinde oyun bağlamında açılır. iOS için zorunlu uygulamayı kapat düğmesi yoktur.

| Panel | Temel bilgi | Eylem | Zorunlu durumlar | Faz |
|---|---|---|---|---|
| HUD | Kredi, yük, tek hedef, tıkanma; okunabilir saat | Hareket/inşa/duraklat | Normal/paused/save pending | P0 |
| İstasyon | Girdi/çıktı, süre, uyum/neden | Güvenli transfer/uygun komut | Eksik/dolu/erişimsiz | P0 |
| İnşa | Footprint, servis, bedel | Döndür/onay/iptal | Geçersiz/stale/pending | P0 |
| Menü | Devam, kayıtlar, ayarlar, yeni oyun | Devam | Yeni oyunda kayıt koruma | P0 |
| SaveRecovery | Hata, yedek, etkilenen işlem | Tekrar/kurtarma | Disk dolu/bozuk/sürüm | P0 |
| Geri dönüş | Son eylem, tek sonraki iş | Devam/kapat | İsteğe bağlı, FOMO yok | P0 |
| Depo | Serbest/rezerve/yoldaki, slot/lot | Bölge/filtre/detay | Boş/dolu/ayrılmış | A2 |
| Tedarik | Teklif, ücret, süre, kota | Onay/iptal/kabul | AwaitingSpace/iade | A2 |
| Raf fiyatı | SKU, kalite, fiyat, maliyet | Fiyat onayı | Bütçe/fiyat reddi | A2 |
| Personel | Enerji, memnuniyet, iş, mola, ücret | Atama/eğitim/vardiya | İzin/askı/devir | A2/A3 |
| İşletme haritası | Katman, pencere, neden/güven | Nesneye git/incele | Yetersiz örnek | A2/A3 |
| Bakım/güç | W, E, süre/bedel/plan | Servis/öncelik | Duruş/no power | A3 |
| Yetenek | Dal, önkoşul, beceri puanı | Aç/reset önizle | Kilit/bedel | A3/A4 |
| Araştırma | Paket, AP, erişim | Paket aç | Eksik AP/öncül | A3 |
| Kontrat | Hedef, tahsis, süre, ödeme | Teslim/uzat | Timeout/kalite | A3 |
| Görev/itibar | Topluluk, seçenek, sonuç | Seç/teslim | Kalıcı sonuç önizleme | A3/A4 |
| Final | Dalga, yatırım, ikame, sınav | Teslim/başlat | Eksik aile/tekrar/başarı | A4 |
| Görünüm mağazası | Kozmetik, yerel fiyat, hak | Önizle/al/restore | Pending/iptal/refund | A4/A5 |
| Destekle | Belirli ödül/ücretsiz görev | İsteğe bağlı reklam | Kapalı/offline/pending | A4 |
| Gün sonu | Nakit, katkı, stok, hizmet, tıkanma | Tek öneriyi incele | Yetersiz örnek | A2+ |
| Ayarlar | Ses/titreşim, metin/kontrast, hareket, girdi | Önizle/uygula | Kalıcı tercih | P0+ |

Gün sonu ölçüm seçimi UX kararıdır; kaynak beş ölçüm/bir öneri ister. Rapor kritik işlemi bölen zorunlu modal değildir. Yeni oyunda kayıt üzerine yazma sıradan kapat düğmesine bağlanmaz.

### Yetenek ekranı

Üç dal ayrı sütun/sekme, telefonda tek dalın önkoşul zinciri okunur. Açık/kilitli/seçili/erişilebilir durum şekil+ikon+metinle ayrılır. Bedel, gerçek davranış ve kısıt aynı karttadır. Henüz tasarlanmamış 21 düğüm oyuncuya sahte satın alınabilir içerik olarak sunulmaz. Araştırma AP'si beceri XP'si değildir; ayrı paneldir.

### Bileşen ve veri sahipliği

Bileşen adları taslak, mevcut React API'si değildir. HUD sorgu okur; StationInfo instance/state/reason; BuildControls draft/validasyon/komut sonucu; SaveRecovery gerçek hata/yedek kullanır. DOM ikinci stok/bakiye kaynağı tutmaz. Pending buton ikinci transaction üretmez; stale önizleme tekrar doğrulanır. Disabled neden metni erişilebilirdir; bilinmeyen hata başarılı işlem gibi yutulmaz.

## 14. Etkileşim ve hata dili

KAYNAK: uyumlu istasyonda 0,3 sn sabit durunca güvenli transfer; yoldan geçerken harcama, işe alma, tarif değiştirme veya satış yok. Her al/bırak zorunlu menü açmaz. Maliyetli/yıkıcı eylem önizleme/onay gerektirir.

Pointerdown UI/joystick/dünya/inşa sahiplerinden birine bağlanır; up/cancel'a kadar değişmez. UI'dan canvas'a sürükleme dünya işlemi yaratmaz. İki parmak kamera joystick devre dışıyken; kaybolan pointer hareketi nötrler. Android geri önce paneli kapatır.

İnşa doğrulaması: footprint/yön → sınır/çakışma → giriş/kasa/servis erişimi → mevcut parti/yük/rezervasyon/güç etkisi → fiyat/son revision → tek commit. İptal kalıcı durumu korur. İnşa açılınca simülasyon durur; platform pause'u varken panel kapanması resume ettirmez.

Başarı yalnız committed işlemde. Kritik hata tek toast değildir; nesne ve detayda kalıcıdır. Örnek metinler:

- “Girdi eksik · 1 ham su gerekiyor.”
- “Çıkış dolu · Ürünleri depoya taşı.”
- “Bu konum kasa yolunu kapatıyor.”
- “Kayıt tamamlanamadı · İşlem henüz onaylanmadı.”
- “Ödül doğrulanıyor · Yeniden reklam izlemen gerekmiyor.”

Transfer miktarı/tekrar ritmi ayrı teknik denge kararı; FPS'ten türetilmez. Aynı transaction iki başarı pozu/sesi üretmez. İnşa sırasında makine aşınma/parti/envanteri sıfırlanmaz.

## 15. Animasyon, ses ve titreşim bütçesi

Öncelik sırası: oyuncu etkileşimi → yakındaki gerçek aktör → aktif makine → görev/olay vurgusu → uzak dekor. Düşük profilde son katmanlar azaltılır. İş süresi, müşteri sabrı, üretim ve ödül değişmez. Görünmeyen mesh durabilir; Domain aktörü sürer. Pause'da menü geri bildirimi olabilir ama iş dünyası aktif ilerliyormuş gibi gösterilmez.

SANAT KARARI başlangıç motion süreleri: mikro geri bildirim 80–120 ms, panel 140–180 ms, kısa işlem vurgusu 180–260 ms. Cihaz testiyle ayarlanır; ekonomik süre değildir. Az harekette sallanma/öteleme kalkar, durum sabit ikon/metinle kalır. Sürekli pulse, ekran sarsıntısı, dönen sticker, konfeti yoktur.

Ses katmanları: düşük yoğunluklu synth müzik, mağaza uğultusu, seyrek makine tamamlanması, gruplanmış kasa, kısa UI. Müzik/dünya/UI/titreşim ayrı kapatılır. Aynı anda çok makine bitince sınırsız ses binmez; yakın/öncelikli ya da gruplu ses seçilir. Kuyruk sürekli kızgın ses döngüsü değildir. Kritik bilgi yalnız sesle verilmez. Background'da ses durur; dönüşte birikmiş sesler patlamaz. Ödül doğrulanmadan kutlama sesi yok. Tam seslendirme zorunlu yeni kapsam değildir.

## 16. Yaşayan dünya veri ve kayıt sözleşmesi

| Görsel | Kaynak | Kalıcı veri | Yüklemede |
|---|---|---|---|
| Raf | Inventory sorgusu | Lot/adet/konum | Doğru doluluk bandı |
| Makine | Batch/state/süre | Aktif parti | Doğru poz, yeni çıktı yok |
| Personel | Görev/F/rezervasyon | Yük/koltuk/görev | Aynı mantığa bağlanır |
| Kuyruk | Sepet/rota/süre | Müşteri durumu | Sabır resetlenmez |
| Final dekoru | Tamamlanma bayrağı | Proje/görev | Görsel açılır, ödül tekrarlanmaz |
| Olay dekoru | Aktif olay/süre | Olay state'i | Kalan süreyle eşleşir |
| Uzak idle | Cosmetic seed/görsel zaman | Gerekirse varyant ID | Ekonomi değişmeden yeniden başlayabilir |

Son state sorgusu esastır; Presentation bütün olayları görmüş varsayılmaz. Animasyon completion'ı Domain satışı/üretimi tamamlamaz. Görsel RNG ekonomi RNG'sinden ayrıdır. Havuzdan çıkan model önceki SKU/kalite etiketi taşımamalı. Yerleşim/kozmetik değişiminde instanceId korunur.

Context-loss'ta sahne Domain'den yeniden kurulur. Geometry/material/texture/listener sahipliği temizlenir; paylaşılan kaynak erken dispose edilmez. Silinen nesnenin etiketi/aboneliği de gider. Manifest içerik ID'lerini gerçek dosyaya veya prosedürel geometriye bağlar; olmayan asset hazırmış gibi import edilmez.

## 17. Performans, LOD ve asset üretimi

KAYNAK §63 hedefleri: 30 FPS/uygun cihazda 60; 10 Hz/adım p95≤6 ms; düşük profilde ≤150 draw call, ≤150 bin görünür üçgen, ≤25 animasyonlu karakter; JS+GPU hedef ≤600 MB. Düşük DPR≤1,25, üst≤1,5; düşük kısa kenar 640–720 px. Yerel soğuk açılış ≤10 sn, ilk kurulu web içeriği ≤150 MB hipotezi. Ölçülmüş başarı değildir.

| Profil | Korunan | Azaltılan/artırılan |
|---|---|---|
| Düşük | Oyuncu, hedef, siluet, miktar, durum, rota | Uzak prop/NPC, gölge, parçacık, idle sıklığı azaltılır |
| Orta | Aynı ekonomi/etkileşim | Yakın mekanizma/ortam ayrıntısı artabilir |
| Yüksek | Aynı kurallar | Bütçe uygunsa daha akıcı sunum/60 FPS |

Uzak makine ana gövde+durum; yakında ana hareketli parça. LOD collision/iş kuralı değiştirmez. Tekrarlanan raf/ambalaj/küp instancing ve materyal paylaşır; küçük atlas/vertex color. Her stok mesh'i, sınırsız DPR, çoklu gerçek zamanlı gölge ve sahne geneli outline yoktur. Güçlü cihaz görünümü düşük cihazda zorunlu değildir.

### Asset kartı ve üretim sırası

Kart: içerik ID/faz, kaynak veya sanat kararı, ön/üst/izometrik siluet, footprint/servis alanı, pivot/yön, materyal/atlas, animasyon durumları, LOD, hit target, UI simgesi, lisans, gerçek dosya/manifest ve ölçülen maliyet.

Gri kutu → siluet/port okunabilirliği → renk token'ları → state animasyonu → UI ikon eşlemesi → LOD/atlas → cihaz testi → kabul. Modeli parlatmadan girdi/çıktı anlaşılır olmalı. Son sanat footprint'i büyütüyorsa veri sessizce değişmez. Lisanssız asset veya placeholder “son sanat” diye raporlanmaz.

## 18. Fazlara göre görsel teslimler

| Faz | Teslim | Sınır |
|---|---|---|
| P0 | 12–15 primitive, tek karakter placeholder, su kaynağı/şişeleme/domates yatağı, bir raf, üç panel; al/taşı/bırak/üret/sat | Tam rol kıyafeti, dış kalabalık, Tier 2–4 ürünler yok |
| A2 | Üç oynanabilir ürün/makine, depo/tedarik/mola/üç profil; sanat hedefi 8 siluet/10 simge/3 NPC | Sanat listesi tüm makineleri oyuna açmaz |
| A3 | Rol işaretleri, kalite/bakım/güç/oda, dokuz yetenek UI'si, teşhis | Son sanat/tam olay süsleri sonraya |
| A4 | Tier 1–4 ürünler ve gerekli istasyonlar/odalar, olay/final izleri, son ses/TR-EN | Yeni açık dünya mekanikleri yok |
| A5 | Gerçek cihaz/erişilebilirlik/performans; mağaza görselleri gerçek build'den | Test edilmemiş parlatma yok |

A4 atmosferi küçük düşük maliyetli sahnede denenir. Canlılık, gerçek üretim/insan davranışı okunmadan dekor ekleyerek tamamlanmış sayılmaz. Eksik oda bedelleri veya 21 ileri yetenek görsel tasarımla çözülmez.

## 19. Erişilebilirlik ve görsel kabul

KAYNAK: iOS 44 pt/Android 48 dp eşdeğer hit target; CSS/viewport gerçek cihazda doğrulanır. Sağ/sol el, dokun-git, metin büyütme, yüksek kontrast, az hareket, titreşim kapatma. Uzun basış/hover kritik eylemin tek yolu değildir.

Semantik button/heading/label, ikon erişilebilir adı, mantıklı odak, modal kapanınca eski odağa dönüş. Dekor ikonu okutulmaz; her tick canlı duyuru yapılmaz. Kontrast gerçek renk çiftleriyle ölçülür. Büyük metinde fiyat/eylem kesilmez; fontu küçülterek tercih iptal edilmez.

| ID | Senaryo | Beklenen kanıt |
|---|---|---|
| VIS-01 | Küçük ekran ilk açılış | Dünya/karakter/tek hedef görünür, klavyesiz eylem |
| VIS-02 | 24 SKU siluet/renksiz görünüm | Ürünler şekille ayrılır; karışanlar revize |
| VIS-03 | Raf 0/1/orta/tam/rezerve | Sayı doğru, boş raf boş, rezervasyon ürün silmez |
| VIS-04 | Makine tüm bekleme/çalışma durumları | Farklı ikon/metin; sahte üretim yok |
| VIS-05 | Yüklü yürüyüş/bekleme/mola/devir | Yük korunur, yerinde koşma/koltuk çakışması yok |
| VIS-06 | UI sürükleme/touchcancel/çoklu dokunma | Çift komut ve takılı hareket yok |
| VIS-07 | İnşa geçersiz/iptal/onay | Erişim/maliyet açık; iptal state korur |
| VIS-08 | Final dekoru save/load | Görsel iz kalır, ödül tekrarlanmaz |
| VIS-09 | Olay bitişi/background | Doğru katman kalkar, offline ilerleme yok |
| VIS-10 | Sessiz/az hareket/kontrast/büyük metin | Temel görev bilgi kaybetmez |
| VIS-11 | Düşük profil ≥20 dk ısı testi | Bütçeler ölçülür; ekonomi aynı |
| VIS-12 | Context-loss/ekran tekrar açılışı | Doğru dünya, sürekli kaynak artışı yok |
| VIS-13 | Fiyat reddi/terk/pending satış | Yanlış kutlama/para efekti yok |
| VIS-14 | Ortam NPC ve gerçek müşteri | Oyuncu alışveriş yapanı ayırabilir |

Bunlar planlanmış testlerdir, çalıştırılmadı. Rapor build/cihaz/OS/WebView, ayar/seed/yük, görüntü veya video ve gerçek sonucu içerir. “Oyuncu kesin canlı hisseder” yerine hangi işi/nedeni doğru anladığı ve nerede karıştığı gözlemlenir.

## 20. Açık görsel kararlar ve takip

- Font/lisans, koyu tema renk çiftleri, tam metin ölçeği ve kontrast ölçümleri.
- Zoom sınırı, küçük ekran duvar kesiti, yük/karakter görünür ölçeği.
- Her SKU'nun son çizimi/modeli; bu belge sanat brief'idir, üretilmiş dosya değildir.
- Ortam NPC/araç sayısı, ışık varyantı; önce cihaz bütçesi, sonra A4 sanat seçimi.
- Motion sürelerinin testi, eşzamanlı ses/animasyon sınırı ve düşük profil eşikleri.
- Rol aksesuarı ile ücretli kozmetik çakışması; kozmetik işlev bilgisini gizlememeli.
- Oda taban konforu, bonus birleşimi ve diğer açık oyun tanımları içerik kataloğunda çözülür; görsel ekip uydurmaz.

Uygulama, asset manifest'i ve görsel kabul raporu bu belgeyle izlenir. Kodun bu tasarımı gerçekleştirdiği varsayılmaz; yalnız yetkilendirilmiş faz uygulanır. Kaynak/karar/kanıt ayrımı [IMPLEMENTATION_RULES.md](IMPLEMENTATION_RULES.md), gerçek test raporu düzeni [TEST_STRATEGY.md](TEST_STRATEGY.md) içindedir.

## 21. §64 market ritmi ve görsel adayları

A4 sanat adayları: kooperatif başkanı/Baş Mühendis ziyaretinin okunur kimliği; kirli/temiz oda işareti; gerçek satış/kuyruk verisini açıklayan Mahalle Bülteni DOM paneli; tek SKU'lu Günün Hasadı teşhiri; Tier 4 pazarlık kartı; sabah trend kartı; vardiya dalgası ön haberi; ücretsiz işlevsel dekorun mevcut §32 estetik skorunu gösteren etiket. Bu ekranlar yeni ekonomi kaynağı değildir. DOM paneli safe-area, büyük metin, odak sırası ve pointer sahipliğini korur; kritik kayıt/kabul ekranı gerekli olduğunda tam görünür kalır.

Alma–taşıma–koyma için üç aşamalı görsel/ses ritmi, yükte hafif yaylanma ve yerine oturan temsilî ürün yığını tasarlanır. Haptik isteğe bağlıdır, az hareket animasyonu azaltır, sessiz mod metin/ikon geri bildirimini korur; D-025 ses ve §63 düşük profil bütçesi uygulanır. Gerçek yükseltme paslı demir→pirinç, tahta→oymalı tezgâh/taş fırın görünümünü; ham→işlenmiş→ileri zincir mat/koyu→açık→sıcak/altın paleti tetikleyebilir. Kilitli göl ve sonraki alanlar yalnız gerçek erişim koşuluyla siluetlenir. Oyuncu dükkân adı güvenli metin alanında düzenlenir ve tabela/NPC hitabında kayıtlı aynı değerden okunur. Bunlar asset tamamlandı veya cihaz kabul edildi iddiası değildir.
