# Sistem Mimarisi (AI Geliştirici Paketi)

Bu dosya, kodun klasör mimarisini, render döngüsünü ve Capacitor native ayarlarını uygulatmak için kesin kurallar barındırır.

## 1. Dizin ve Dosya Sınırları (Boundary Rules)
- **`src/domain/`**: Sadece `.ts` dosyaları. React veya R3F import edilemez. Matematik, interface, sabitler buradadır.
- **`src/store/`**: `useGameStore.ts` (Zustand). Zustand store, R3F veya React DOM mantığı barındıramaz, sadece state ve fonksiyon tutar.
- **`src/presentation/world/`**: R3F bileşenleri (`<Machine3D>`, `<Player3D>`). 
- **`src/presentation/ui/`**: 2D React DOM bileşenleri (`<HUD>`, `<Menus>`).

## 2. Render ve Oyun Döngüsü (Game Loop)
Performans bütçesine uymak için fizik ve oyun kuralları saniyede 10 kere (10Hz) çalışır.
```typescript
// src/application/simulation/useGameLoop.ts
import { useFrame } from '@react-three/fiber';
import { useStore } from '../../store/useGameStore';

let lastTime = 0;
const LOGIC_TICK_RATE = 100; // 10 Hz (100ms)

export function useGameLoop() {
  const updateMachines = useStore(state => state.updateMachines);
  const updateCustomers = useStore(state => state.updateCustomers);
  
  useFrame((state, delta) => {
    const now = state.clock.getElapsedTime() * 1000;
    if (now - lastTime >= LOGIC_TICK_RATE) {
      updateMachines(LOGIC_TICK_RATE);
      updateCustomers(LOGIC_TICK_RATE);
      lastTime = now;
    }
  });
}
```
*Görsel animasyonlar (yürüme, eşya sallanması) 60 FPS `useFrame` üzerinden sürekli akar, ancak arka plan (üretim süresi) 10Hz'de güncellenir.*

## 3. Capacitor Entegrasyonu
Paket.json kurulduğunda çalışacak terminal akışı (Ajan bunları sırayla yürütmek zorundadır):
1. `npm install @capacitor/core @capacitor/android @capacitor/ios`
2. `npm install @capacitor/cli --save-dev`
3. `npx cap init OrbitMarket org.antigravity.orbitmarket --web-dir dist`
4. `npm run build`
5. `npx cap add android` (İOS ortamı Macbook'da olmadığı için şimdilik atlanabilir, ancak konfigürasyonda yer alır).

## 4. Kayıt Sistemi (Save/Load) LocalStorage / Capacitor Storage
Oyun durumu JSON serileştirilerek saklanır.
```typescript
const SAVE_KEY = 'orbit_market_save_v1';
export const saveGame = (state: GameState) => {
  const payload = JSON.stringify({
    schemaVersion: 1,
    time: Date.now(),
    data: state
  });
  localStorage.setItem(SAVE_KEY, payload); // Capacitor'da Storage Plugin'e yönlendirilir
}
```
Yükleme sırasında sürüm doğrulaması yapılır. Çökmüş/Hatalı (Corrupted) bir JSON gelirse oyun sessizce sıfırlanmaz, oyuncuya hata menüsü sunulur.
