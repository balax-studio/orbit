import type { ItemId, MachineDefinition, MachineTypeId, ProductDefinition, RecipeDefinition, RecipeId } from '../domain/types';

export const A2_PRODUCTS: Record<ItemId, ProductDefinition> = {
  'item.fodder': { id: 'item.fodder', displayNameKey: 'item.fodder.name', category: 'raw', stackSize: 50, baseRetailPriceAtoms: null, phase: 'A2' },
  'item.salt': { id: 'item.salt', displayNameKey: 'item.salt.name', category: 'raw', stackSize: 50, baseRetailPriceAtoms: null, phase: 'A2' },
  'item.fresh_milk': { id: 'item.fresh_milk', displayNameKey: 'item.fresh_milk.name', category: 'final', stackSize: 20, baseRetailPriceAtoms: 55000, phase: 'A2' },
  'item.churned_ayran': { id: 'item.churned_ayran', displayNameKey: 'item.churned_ayran.name', category: 'final', stackSize: 20, baseRetailPriceAtoms: 75000, phase: 'A2' },
  'item.farm_butter': { id: 'item.farm_butter', displayNameKey: 'item.farm_butter.name', category: 'final', stackSize: 10, baseRetailPriceAtoms: 120000, phase: 'A2' },
  'item.tomato_puree': { id: 'item.tomato_puree', displayNameKey: 'item.tomato_puree.name', category: 'intermediate', stackSize: 20, baseRetailPriceAtoms: null, phase: 'A2' },
};

export const A2_MACHINES: Record<MachineTypeId, MachineDefinition> = {
  'source.cow_dairy': {
    id: 'source.cow_dairy',
    displayNameKey: 'source.cow_dairy.name',
    purchasePriceAtoms: 140000,
    footprint: { width: 2, depth: 2 },
    serviceCells: [{ x: 1, z: 2 }],
    inputCapacity: 40,
    outputCapacity: 40,
    powerE: 1,
    recipeIds: ['recipe.cow_dairy_milk', 'recipe.cow_dairy_ayran', 'recipe.cow_dairy_butter'],
  },
  'station.stone_oven': {
    id: 'station.stone_oven',
    displayNameKey: 'station.stone_oven.name',
    purchasePriceAtoms: 100000,
    footprint: { width: 1, depth: 2 },
    serviceCells: [{ x: 0, z: 2 }],
    inputCapacity: 40,
    outputCapacity: 20,
    powerE: 2,
    recipeIds: ['recipe.stone_oven_puree'],
  },
};

export const A2_RECIPES: Record<RecipeId, RecipeDefinition> = {
  'recipe.cow_dairy_milk': {
    id: 'recipe.cow_dairy_milk',
    machineTypeId: 'source.cow_dairy',
    inputs: [
      { itemId: 'item.raw_water', quantity: 2 },
      { itemId: 'item.fodder', quantity: 1 }
    ],
    outputs: [{ itemId: 'item.fresh_milk', quantity: 1 }],
    durationTicks: 80,
  },
  'recipe.cow_dairy_ayran': {
    id: 'recipe.cow_dairy_ayran',
    machineTypeId: 'source.cow_dairy',
    inputs: [
      { itemId: 'item.fresh_milk', quantity: 1 },
      { itemId: 'item.raw_water', quantity: 1 },
      { itemId: 'item.salt', quantity: 1 }
    ],
    outputs: [{ itemId: 'item.churned_ayran', quantity: 1 }],
    durationTicks: 80,
  },
  'recipe.cow_dairy_butter': {
    id: 'recipe.cow_dairy_butter',
    machineTypeId: 'source.cow_dairy',
    inputs: [
      { itemId: 'item.fresh_milk', quantity: 2 }
    ],
    outputs: [{ itemId: 'item.farm_butter', quantity: 1 }],
    durationTicks: 100,
  },
  'recipe.stone_oven_puree': {
    id: 'recipe.stone_oven_puree',
    machineTypeId: 'station.stone_oven',
    inputs: [
      { itemId: 'item.heirloom_tomato', quantity: 2 }
    ],
    outputs: [{ itemId: 'item.tomato_puree', quantity: 1 }],
    durationTicks: 60,
  }
};
