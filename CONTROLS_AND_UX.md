# Kontroller, UX ve Etkileşim (AI Geliştirici Paketi)

Bu dosya, oyundaki 2D HUD ve 3D Dünya etkileşimlerini koda dökecek ajan için kesin yönergeleri barındırır.

## 1. 3B Dokunma (Raycaster) Kısıtlamaları
Three.js canvası üzerinde tıklama algılaması yapılırken uyulması gereken kurallar:
- **Olay Geçirgenliği:** UI açıkken 3B dünyaya tıklanamaz. HUD panelleri üzerinde `pointerEvents="auto"` ve `onPointerDown={(e) => e.stopPropagation()}` bulunmalıdır.
- **Seçim (Selection):** Bir nesne seçildiğinde (örn: Makine), nesnenin etrafında belirgin bir **3D Siyah Çizgi (Outline/EdgesGeometry)** veya alt karesinde yeşil bir alan belirir.
- **Otomatik İşlem Yok:** Nesneye dokunulduğunda işlem doğrudan gerçekleşmez; arayüzde bir `ActionMenu` çıkar ("Üretimi Başlat", "İçeriği Al", "Yık").

## 2. Mobil Kontrol (Floating Joystick) Entegrasyonu
Hareket için `nipplejs` veya özel bir `useTouchJoystick` hook'u kullanılacaktır.
```typescript
// Beklenen Hook Arayüzü:
const { movement, isMoving } = useJoystick(); 
// movement = { x: -1 to 1, y: -1 to 1 }
```
3D karakter modeli (R3F) `useFrame` içinde her karede pozisyonunu `movement` verisine göre günceller ve model yürüme yönüne döndürülür (`Math.atan2`).

## 3. İnşa Modu (Build Mode) UX Kuralları
İnşa moduna geçildiğinde kodda şu olaylar dizisi tetiklenmelidir:
1. `store.setPaused(true)` - Oyun simülasyonu durur.
2. Kamera izometrik üst açıya (Top-down) daha fazla eğilir.
3. Grid yardımcı çizgileri (GridHelper) görünür olur.
4. Ekranda seçilen modül, kullanıcının parmağını (veya fareyi) takip eder ancak **1x1 grid'e snap (hizalanma)** olacak şekilde zıplayarak hareket eder. (`Math.round(x)`)
5. Çakışma varsa modelin rengi `neo-red`, boşsa `neo-green` tint (emissive color) alır.

## 4. Zeigarnik Geri Dönüş Logu
Kullanıcı oyuna döndüğünde çalışacak mantık:
```typescript
// App init aşamasında
if (lastSessionLog) {
  showNeoModal({
    title: "Geri Döndün",
    content: `Geçen sefer: ${lastSessionLog.lastAction}.\nSıradaki Adım: ${lastSessionLog.nextSuggestedTask}`,
    button: "Devam"
  });
}
```
**Asla** "Hemen şu görevi yap yoksa kaybedersin" (FOMO) tarzı sayaçlar eklenmez. Süreler sadece oyun-içi saat (`simulationTime`) ile ilerler, gerçek dünya saatine (Date.now) bağlanarak oyuncu cezalandırılamaz.
