# MVP ve İlk 20 Dakika (AI Geliştirici Paketi)

Bu dosya, sıfırdan kodlamaya başlayacak olan yapay zeka (veya insan) geliştiricinin **"Bölüm 1 - İlk 20 Dakika"** MVP'sini ayağa kaldırabilmesi için gereken fiziksel başlangıç haritasını, sahne boyutlarını, ilk 3B (Three.js) varlık eşleşmelerini ve Zustand başlangıç State'ini tanımlar.

## 1. Başlangıç Durumu (Initial Zustand State)
Oyun ilk açıldığında `useGameStore` içindeki veriler (Fresh Start):

```typescript
const INITIAL_STATE = {
  credits: 50, // Oyuncu oyuna 50 kredi ile başlar
  timePlayed: 0,
  chapter: 1, // Bölüm 1: MVP Düzeyi
  inventory: [
    { itemId: 'water', quantity: 3, quality: 'Standard' } // Başlangıçta 3 birim su verilir
  ],
  machines: [
    // Haritada varsayılan olarak bir adet Şişeleyici bulunur
    { instanceId: 'm1', machineId: 'machine_bottler', position: [2, 0, 2], rotation: [0, 0, 0], isProcessing: false, activeRecipeId: null, progress: 0, inputBuffer: [], outputBuffer: [] }
  ],
  staff: [], // Başlangıçta personel yok, oyuncu manuel çalışır
  unlockedRecipes: ['recipe_water_bottle']
};
```

## 2. 3D Sahne ve Harita Tasarımı (Scene & Map Layout)

- **Grid Sistemi:** Dünya 1x1 birimlik bir kareden oluşur. Toplam dükkan boyutu MVP için **10x10 birim** (Tile) boyutlarındadır.
- **Kamera:** İzometrik bir görünüm sağlamak için OrthographicCamera kullanılır. 
  - `position={[10, 10, 10]}`
  - `lookAt(0, 0, 0)`
- **Kapı ve Müşteri Spawn Noktası:** `[5, 0, 9]` koordinatı dükkan kapısıdır. Müşteriler bu koordinattan doğar (spawn) ve raflara doğru bir vektör üzerinde ilerler.

## 3. İlk 20 Dakika Öğretici Akışı (Tutorial Flow)

`CONTROLS_AND_UX.md` kurallarına göre bu akış ekrana devasa ve kilitleyici pop-uplar basmaz; ekranın üstünde minik "Neo-Brutalist" bağlamsal ipuçlarıyla (`NeoBadge`) ilerler.

1. **(0-2 dk) Taşıma:** Ekranda "Envanterdeki 3 Suyu Rafa Yerleştir" yazar. Oyuncu karaktere (veya joystick'e) basarak rafa gider.
2. **(2-5 dk) İlk Satış:** Müşteri spawn olur. Rafa gidip suyu alır. Kasaya (Register) bırakır. Oyuncu kasaya tıklayarak parayı (Kredi) tahsil eder.
3. **(5-8 dk) Üretim:** Oyuncu `Şişeleyici` (Bottler) makinesine tıklar. İçeri elindeki suyu atıp `İçme Suyu` üretir.
4. **(8-12 dk) İnşa (Build Mode):** Oyuncu ekranın köşesindeki "İnşa Et" butonuna basar, kameranın açısı dikleşir. Rafın pozisyonunu değiştirir.

## 4. MVP (Prototip) 3B Varlık Eşleştirmeleri (Asset Placeholders)

Geliştirici, elinde 3B (GLTF) modeller olmadığı için ilk sürümü **Primitif Geometrilerle (Box, Cylinder)** kuracaktır. Renkler `UI_DESIGN_SYSTEM.md`'deki Neo-Brutalist Hex kodlarıdır.

| Varlık (Entity) | Geometry | Boyut (Scale) | Renk (Material) | Açıklama |
|---|---|---|---|---|
| **Oyuncu / Personel** | Kapsül (Capsule) | `[0.4, 0.8, 0.4]` | `#00F0FF` (Cyan) | Oyuncuyu temsil eder |
| **Müşteri** | Kapsül (Capsule) | `[0.4, 0.8, 0.4]` | `#FF003C` (Red) | Müşteriyi temsil eder |
| **Zemin (Floor)** | Düzlem (Plane) | `[10, 10, 1]` | `#F2F0E9` (Paper) | Üzerinde 1x1'lik ince siyah GridHelper çizili |
| **Raf (Shelf)** | Kutu (Box) | `[2, 1, 1]` | `#FFD000` (Yellow) | Üzerine ürün konulabilen alan |
| **Makine (Bottler)** | Kutu (Box) | `[1, 1.5, 2]` | `#1A1A1A` (Ink) | Tıklanabilir, üzerinde üretim barı olan obje |
| **Eşya (Su/Buz)** | Küçük Kutu | `[0.3, 0.3, 0.3]` | `#00FF66` (Green) | Rafta veya makinede duran görsel miktar |

## 5. Uygulama Kısıtlamaları (AI İçin Kırmızı Çizgiler)
- Müşteriler doğrudan hedefe (Raflara) Pathfinding (A* veya NavMesh) ile gider. MVP'de basit olması için aralarında duvar yoksa doğrudan `lerp` (Lineer Interpolasyon) ile yürütülebilirler. Ancak duvar eklendiğinde rota hesaplanmalıdır.
- Oyuncunun ve diğer hareketli objelerin gölgesi olmalıdır (`castShadow`, `receiveShadow`). Neo-brutalist sert gölgeler (DirectionalLight ile) kullanılacaktır, yumuşak (PCFSoftShadowMap) gölgeler yasaktır.
