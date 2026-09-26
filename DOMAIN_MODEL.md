# Domain Model & Zustand Store (AI Geliştirici Paketi)

Bu doküman, yapay zeka ajanlarının tereddüt etmeden kodu yazabilmesi için kesin TypeScript State arayüzlerini ve Store Action'larını içerir.

## 1. Kesin Veri Tipleri (Types)

```typescript
export type ItemCategory = 'Raw' | 'Intermediate' | 'Final';
export type QualityTier = 'Standard' | 'Nitelikli' | 'Özel';
export type Faction = 'Community' | 'Researchers' | 'Traders';

export interface Item {
  id: string; // Örn: "nutrient_cube"
  name: string;
  category: ItemCategory;
  baseCost: number; // Üretim maliyeti
  referencePrice: number; // Satış fiyatı
}

export interface InventorySlot {
  itemId: string;
  quantity: number;
  quality: QualityTier;
}

export interface Machine {
  instanceId: string; // uuid
  machineId: string; // Örn: "machine_packer"
  position: [number, number, number];
  rotation: [number, number, number];
  isProcessing: boolean;
  activeRecipeId: string | null;
  progress: number; // 0.0 to 1.0
  inputBuffer: InventorySlot[];
  outputBuffer: InventorySlot[];
}

export interface Staff {
  id: string;
  name: string;
  role: 'Cashier' | 'Restocker' | 'Transporter' | 'Operator' | 'Technician';
  skillLevel: number; // 0-100
  fatigue: number; // 0-100 (100 = bitkin)
  satisfaction: number; // 0-100
  assignedTask: string | null;
}
```

## 2. Zustand Store ve Action'lar

```typescript
export interface GameState {
  // --- STATE ---
  credits: number;
  timePlayed: number;
  chapter: number;
  reputation: Record<Faction, number>;
  inventory: InventorySlot[];
  machines: Machine[];
  staff: Staff[];
  unlockedRecipes: string[];
  
  // --- ACTIONS ---
  // Ekonomi
  addCredits: (amount: number) => void;
  deductCredits: (amount: number) => boolean;
  
  // Üretim ve Envanter
  addItemToInventory: (itemId: string, qty: number, quality: QualityTier) => void;
  removeItemFromInventory: (itemId: string, qty: number) => boolean;
  
  // Makine Yönetimi
  placeMachine: (machineId: string, position: [number, number, number]) => void;
  updateMachineProgress: (instanceId: string, delta: number) => void;
  startRecipe: (instanceId: string, recipeId: string) => void;
  collectOutput: (instanceId: string) => void;
  
  // Personel
  hireStaff: (staffData: Omit<Staff, 'id'>) => void;
  assignTask: (staffId: string, taskId: string) => void;
  updateFatigue: (delta: number) => void;
}
```

## 3. Sabit Kısıtlamalar (AI İçin Kırmızı Çizgiler)
- **Asla** negatif envanter veya negatif kredi oluşmamalıdır (`deductCredits` ve `removeItemFromInventory` fonksiyonları yetersiz bakiye/stok durumunda `false` dönmeli ve işlemi iptal etmelidir).
- Tüm güncellemeler (State mutasyonları) Immer veya Zustand'ın immutable set() yapısıyla yapılmalıdır.
- Oyuncu veya müşterilerin 3D koordinatları (X,Y,Z) Zustand'da **TUTULMAMALIDIR** (performans için). Onlar R3F içindeki lokal `useRef`'lerde yaşar. Sadece mantıksal varlıklar (Makineler, Raflar) Zustand'da koordinat tutar.
