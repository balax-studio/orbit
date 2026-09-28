// Orbit Market - P0 Validated Content Catalog
// Reference: OYUN_GELISTIRME_DEVIR_DOSYASI.md §26, §58.1, OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md §2-3

import type {
  ItemId,
  MachineDefinition,
  MachineTypeId,
  ProductDefinition,
  RecipeDefinition,
  RecipeId,
} from '../domain/types';
import { A2_PRODUCTS, A2_MACHINES, A2_RECIPES } from './a2Content';

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(`[ContentValidation] ${message}`);
    this.name = 'ContentValidationError';
  }
}

export interface GameContent {
  version: number;
  products: Record<ItemId, ProductDefinition>;
  machines: Record<MachineTypeId, MachineDefinition>;
  recipes: Record<RecipeId, RecipeDefinition>;
}

export const P0_PRODUCTS: Record<ItemId, ProductDefinition> = {
  // --- Kanonik P0 Ürünleri (OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md §3) ---
  'item.raw_water': {
    id: 'item.raw_water',
    displayNameKey: 'item.raw_water.name',
    category: 'raw',
    stackSize: 50,
    baseRetailPriceAtoms: null, // Doğrudan satılmaz
    phase: 'P0',
  },
  'item.small_bottle': {
    id: 'item.small_bottle',
    displayNameKey: 'item.small_bottle.name',
    category: 'raw',
    stackSize: 50,
    baseRetailPriceAtoms: null,
    phase: 'P0',
  },
  'item.jug_5l_empty': {
    id: 'item.jug_5l_empty',
    displayNameKey: 'item.jug_5l_empty.name',
    category: 'raw',
    stackSize: 20,
    baseRetailPriceAtoms: null,
    phase: 'P0',
  },
  'item.carboy_19l_empty': {
    id: 'item.carboy_19l_empty',
    displayNameKey: 'item.carboy_19l_empty.name',
    category: 'raw',
    stackSize: 10,
    baseRetailPriceAtoms: null,
    phase: 'P0',
  },
  'item.glass_water_small': {
    id: 'item.glass_water_small',
    displayNameKey: 'item.glass_water_small.name',
    category: 'final',
    stackSize: 30,
    baseRetailPriceAtoms: 15_000, // 1.50 Kredi (Katalog §3)
    phase: 'P0',
  },
  'item.water_jug_5l': {
    id: 'item.water_jug_5l',
    displayNameKey: 'item.water_jug_5l.name',
    category: 'final',
    stackSize: 15,
    baseRetailPriceAtoms: 80_000, // 8.00 Kredi (Katalog §3)
    phase: 'P0',
  },
  'item.water_carboy_19l': {
    id: 'item.water_carboy_19l',
    displayNameKey: 'item.water_carboy_19l.name',
    category: 'final',
    stackSize: 5,
    baseRetailPriceAtoms: 240_000, // 24.00 Kredi (Katalog §3)
    phase: 'P0',
  },
  'item.tomato_seed': {
    id: 'item.tomato_seed',
    displayNameKey: 'item.tomato_seed.name',
    category: 'raw',
    stackSize: 50,
    baseRetailPriceAtoms: null,
    phase: 'P0',
  },
  'item.heirloom_tomato': {
    id: 'item.heirloom_tomato',
    displayNameKey: 'item.heirloom_tomato.name',
    category: 'final',
    stackSize: 40,
    baseRetailPriceAtoms: 40_000, // 4.00 Kredi (Katalog §3)
    phase: 'P0',
  },

  // --- Geriye Uyumlu Takma İsimler (Test / Eski Referans Desteği) ---
  'item.water_bottle_empty': {
    id: 'item.water_bottle_empty',
    displayNameKey: 'item.small_bottle.name',
    category: 'raw',
    stackSize: 50,
    baseRetailPriceAtoms: null,
    phase: 'P0',
  },
  'item.water_jug_empty': {
    id: 'item.water_jug_empty',
    displayNameKey: 'item.jug_5l_empty.name',
    category: 'raw',
    stackSize: 20,
    baseRetailPriceAtoms: null,
    phase: 'P0',
  },
  'item.water_carboy_empty': {
    id: 'item.water_carboy_empty',
    displayNameKey: 'item.carboy_19l_empty.name',
    category: 'raw',
    stackSize: 10,
    baseRetailPriceAtoms: null,
    phase: 'P0',
  },
  'item.water_bottle_small': {
    id: 'item.water_bottle_small',
    displayNameKey: 'item.glass_water_small.name',
    category: 'final',
    stackSize: 30,
    baseRetailPriceAtoms: 10_000,
    phase: 'P0',
  },
  'item.fresh_tomato': {
    id: 'item.fresh_tomato',
    displayNameKey: 'item.heirloom_tomato.name',
    category: 'final',
    stackSize: 40,
    baseRetailPriceAtoms: 15_000,
    phase: 'P0',
  },
};

export const P0_MACHINES: Record<MachineTypeId, MachineDefinition> = {
  // --- Kanonik P0 İstasyon ve Kaynakları (OYUN_GELISTIRME_DEVIR_DOSYASI.md §26 / DUNYA_YERLESIM_PLANI.md §13) ---
  'source.spring_water': {
    id: 'source.spring_water',
    displayNameKey: 'source.spring_water.name',
    purchasePriceAtoms: 0,
    footprint: { width: 2, depth: 2 },
    serviceCells: [{ x: 7, z: 21 }],
    inputCapacity: 0,
    outputCapacity: 80,
    powerE: 0,
    recipeIds: ['recipe.collect_spring_water'],
  },
  'station.bottler': {
    id: 'station.bottler',
    displayNameKey: 'station.bottler.name',
    purchasePriceAtoms: 50_000,
    footprint: { width: 1, depth: 2 },
    serviceCells: [{ x: 13, z: 22 }],
    inputCapacity: 40,
    outputCapacity: 20,
    powerE: 1,
    recipeIds: [
      'recipe.bottle_glass_water_small',
      'recipe.bottle_jug_5l',
      'recipe.bottle_carboy_19l',
      'recipe.bottle_small',
    ],
  },
  'source.crop_plot': {
    id: 'source.crop_plot',
    displayNameKey: 'source.crop_plot.name',
    purchasePriceAtoms: 30_000,
    footprint: { width: 2, depth: 2 },
    serviceCells: [{ x: 7, z: 25 }],
    inputCapacity: 20,
    outputCapacity: 40,
    powerE: 0,
    recipeIds: ['recipe.grow_heirloom_tomato', 'recipe.grow_tomato'],
  },

  // --- Geriye Uyumlu Takma İsimler ---
  'machine.water_spring': {
    id: 'machine.water_spring',
    displayNameKey: 'source.spring_water.name',
    purchasePriceAtoms: 0,
    footprint: { width: 2, depth: 2 },
    serviceCells: [{ x: 0, z: -1 }],
    inputCapacity: 0,
    outputCapacity: 80,
    powerE: 0,
    recipeIds: ['recipe.collect_spring_water'],
  },
  'machine.bottling_table': {
    id: 'machine.bottling_table',
    displayNameKey: 'station.bottler.name',
    purchasePriceAtoms: 50_000,
    footprint: { width: 2, depth: 1 },
    serviceCells: [{ x: 0, z: -1 }],
    inputCapacity: 40,
    outputCapacity: 20,
    powerE: 1,
    recipeIds: [
      'recipe.bottle_small',
      'recipe.bottle_jug_5l',
      'recipe.bottle_carboy_19l',
      'recipe.bottle_glass_water_small',
    ],
  },
  'machine.tomato_patch': {
    id: 'machine.tomato_patch',
    displayNameKey: 'source.crop_plot.name',
    purchasePriceAtoms: 30_000,
    footprint: { width: 2, depth: 2 },
    serviceCells: [{ x: 0, z: -1 }],
    inputCapacity: 20,
    outputCapacity: 40,
    powerE: 0,
    recipeIds: ['recipe.grow_tomato', 'recipe.grow_heirloom_tomato'],
  },
};

export const P0_RECIPES: Record<RecipeId, RecipeDefinition> = {
  // --- Kanonik P0 Tarifleri ---
  'recipe.collect_spring_water': {
    id: 'recipe.collect_spring_water',
    machineTypeId: 'source.spring_water',
    inputs: [],
    outputs: [{ itemId: 'item.raw_water', quantity: 1 }],
    durationTicks: 20, // 2 saniye = 0.5 ham su / saniye (§26.1)
  },
  'recipe.bottle_glass_water_small': {
    id: 'recipe.bottle_glass_water_small',
    machineTypeId: 'station.bottler',
    inputs: [
      { itemId: 'item.raw_water', quantity: 1 },
      { itemId: 'item.small_bottle', quantity: 1 },
    ],
    outputs: [{ itemId: 'item.glass_water_small', quantity: 1 }],
    durationTicks: 30, // 3 saniye
  },
  'recipe.bottle_jug_5l': {
    id: 'recipe.bottle_jug_5l',
    machineTypeId: 'station.bottler',
    inputs: [
      { itemId: 'item.raw_water', quantity: 10 },
      { itemId: 'item.jug_5l_empty', quantity: 1 },
    ],
    outputs: [{ itemId: 'item.water_jug_5l', quantity: 1 }],
    durationTicks: 80, // 8 saniye
  },
  'recipe.bottle_carboy_19l': {
    id: 'recipe.bottle_carboy_19l',
    machineTypeId: 'station.bottler',
    inputs: [
      { itemId: 'item.raw_water', quantity: 38 },
      { itemId: 'item.carboy_19l_empty', quantity: 1 },
    ],
    outputs: [{ itemId: 'item.water_carboy_19l', quantity: 1 }],
    durationTicks: 180, // 18 saniye
  },
  'recipe.grow_heirloom_tomato': {
    id: 'recipe.grow_heirloom_tomato',
    machineTypeId: 'source.crop_plot',
    inputs: [
      { itemId: 'item.tomato_seed', quantity: 1 },
      { itemId: 'item.raw_water', quantity: 2 },
    ],
    outputs: [{ itemId: 'item.heirloom_tomato', quantity: 1 }], // Katalog §3: 1 salkım
    durationTicks: 80, // 8 saniye
  },

  // --- Geriye Uyumlu Takma İsimler ---
  'recipe.bottle_small': {
    id: 'recipe.bottle_small',
    machineTypeId: 'machine.bottling_table',
    inputs: [
      { itemId: 'item.raw_water', quantity: 1 },
      { itemId: 'item.water_bottle_empty', quantity: 1 },
    ],
    outputs: [{ itemId: 'item.water_bottle_small', quantity: 1 }],
    durationTicks: 30,
  },
  'recipe.grow_tomato': {
    id: 'recipe.grow_tomato',
    machineTypeId: 'machine.tomato_patch',
    inputs: [
      { itemId: 'item.tomato_seed', quantity: 1 },
      { itemId: 'item.raw_water', quantity: 2 },
    ],
    outputs: [{ itemId: 'item.fresh_tomato', quantity: 4 }],
    durationTicks: 120,
  },
};

export const P0_CONTENT: GameContent = {
  version: 1,
  products: { ...P0_PRODUCTS, ...A2_PRODUCTS } as Record<ItemId, ProductDefinition>,
  machines: { ...P0_MACHINES, ...A2_MACHINES } as Record<MachineTypeId, MachineDefinition>,
  recipes: { ...P0_RECIPES, ...A2_RECIPES } as Record<RecipeId, RecipeDefinition>,
};

/**
 * İçerik kataloğunu kararlı biçimde doğrular.
 * Eksik veya geçersiz tarif girdisi, tanımsız makine veya hatalı fiyat sessizce kabul edilmez.
 */
export function validateContent(content: GameContent): void {
  if (!content || typeof content.version !== 'number' || content.version <= 0) {
    throw new ContentValidationError('Geçersiz içerik sürümü.');
  }

  // 1. Ürün doğrulaması
  for (const [id, prod] of Object.entries(content.products)) {
    if (prod.id !== id) {
      throw new ContentValidationError(`Ürün ID uyumsuzluğu: anahtar '${id}', tanım '${prod.id}'`);
    }
    if (!prod.id.startsWith('item.')) {
      throw new ContentValidationError(`Ürün ID 'item.' ön eki taşımalıdır: '${prod.id}'`);
    }
    if (prod.stackSize <= 0 || !Number.isInteger(prod.stackSize)) {
      throw new ContentValidationError(`Ürün yığın boyutu pozitif tamsayı olmalıdır: '${prod.id}'`);
    }
    if (prod.baseRetailPriceAtoms !== null) {
      if (
        !Number.isInteger(prod.baseRetailPriceAtoms) ||
        prod.baseRetailPriceAtoms < 0
      ) {
        throw new ContentValidationError(
          `Satış fiyatı negatif olmayan bir tamsayı atom değeri olmalıdır: '${prod.id}'`
        );
      }
    }
  }

  // 2. Makine doğrulaması
  for (const [id, machine] of Object.entries(content.machines)) {
    if (machine.id !== id) {
      throw new ContentValidationError(`Makine ID uyumsuzluğu: anahtar '${id}', tanım '${machine.id}'`);
    }
    if (
      !machine.id.startsWith('machine.') &&
      !machine.id.startsWith('station.') &&
      !machine.id.startsWith('source.')
    ) {
      throw new ContentValidationError(
        `Makine ID 'machine.', 'station.' veya 'source.' ön eki taşımalıdır: '${machine.id}'`
      );
    }
    if (machine.footprint.width <= 0 || machine.footprint.depth <= 0) {
      throw new ContentValidationError(`Makine footprint pozitif olmalıdır: '${machine.id}'`);
    }
    if (machine.serviceCells.length === 0) {
      throw new ContentValidationError(`Makinenin en az 1 servis hücresi olmalıdır: '${machine.id}'`);
    }
    for (const recipeId of machine.recipeIds) {
      if (!content.recipes[recipeId]) {
        throw new ContentValidationError(
          `Makine '${machine.id}' tanımsız tarif referans ediyor: '${recipeId}'`
        );
      }
    }
  }

  // 3. Tarif doğrulaması
  for (const [id, recipe] of Object.entries(content.recipes)) {
    if (recipe.id !== id) {
      throw new ContentValidationError(`Tarif ID uyumsuzluğu: anahtar '${id}', tanım '${recipe.id}'`);
    }
    if (!recipe.id.startsWith('recipe.')) {
      throw new ContentValidationError(`Tarif ID 'recipe.' ön eki taşımalıdır: '${recipe.id}'`);
    }
    if (!content.machines[recipe.machineTypeId]) {
      throw new ContentValidationError(
        `Tarif '${recipe.id}' tanımsız makine tipi referans ediyor: '${recipe.machineTypeId}'`
      );
    }
    if (recipe.durationTicks <= 0 || !Number.isInteger(recipe.durationTicks)) {
      throw new ContentValidationError(
        `Tarif süresi pozitif tamsayı tick olmalıdır: '${recipe.id}' (süre: ${recipe.durationTicks})`
      );
    }
    if (recipe.outputs.length === 0) {
      throw new ContentValidationError(`Tarif en az 1 çıktı üretmelidir: '${recipe.id}'`);
    }

    // Girdilerin geçerliliği
    for (const input of recipe.inputs) {
      if (!content.products[input.itemId]) {
        throw new ContentValidationError(
          `Tarif '${recipe.id}' tanımsız girdi ürünü referans ediyor: '${input.itemId}'`
        );
      }
      if (input.quantity <= 0 || !Number.isInteger(input.quantity)) {
        throw new ContentValidationError(
          `Tarif '${recipe.id}' girdi miktarı pozitif tamsayı olmalıdır: '${input.itemId}'`
        );
      }
    }

    // Çıktıların geçerliliği
    for (const output of recipe.outputs) {
      if (!content.products[output.itemId]) {
        throw new ContentValidationError(
          `Tarif '${recipe.id}' tanımsız çıktı ürünü referans ediyor: '${output.itemId}'`
        );
      }
      if (output.quantity <= 0 || !Number.isInteger(output.quantity)) {
        throw new ContentValidationError(
          `Tarif '${recipe.id}' çıktı miktarı pozitif tamsayı olmalıdır: '${output.itemId}'`
        );
      }
    }
  }
}
