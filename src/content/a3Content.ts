import type { ItemId, MachineDefinition, MachineTypeId, ProductDefinition, RecipeDefinition, RecipeId } from '../domain/types';

export const A3_PRODUCTS: Record<string, ProductDefinition> = {
  'item.aged_cheese': { id: 'item.aged_cheese', displayNameKey: 'item.aged_cheese.name', category: 'final', stackSize: 10, baseRetailPriceAtoms: 250000, phase: 'A3' },
  'item.battery': { id: 'item.battery', displayNameKey: 'item.battery.name', category: 'raw', stackSize: 5, baseRetailPriceAtoms: null, phase: 'A3' },
  'item.spare_parts': { id: 'item.spare_parts', displayNameKey: 'item.spare_parts.name', category: 'raw', stackSize: 10, baseRetailPriceAtoms: null, phase: 'A3' },
};

export const A3_MACHINES: Record<string, MachineDefinition> = {
  'station.generator': {
    id: 'station.generator',
    displayNameKey: 'station.generator.name',
    purchasePriceAtoms: 500000,
    footprint: { width: 2, depth: 2 },
    serviceCells: [{ x: 1, z: 2 }],
    inputCapacity: 10,
    outputCapacity: 0,
    powerE: -10, // Üretim
    recipeIds: [],
  },
  'station.fridge': {
    id: 'station.fridge',
    displayNameKey: 'station.fridge.name',
    purchasePriceAtoms: 300000,
    footprint: { width: 3, depth: 2 },
    serviceCells: [{ x: 1, z: 2 }],
    inputCapacity: 50,
    outputCapacity: 50,
    powerE: 5,
    recipeIds: ['recipe.age_cheese'],
  },
  'station.workbench': {
    id: 'station.workbench',
    displayNameKey: 'station.workbench.name',
    purchasePriceAtoms: 200000,
    footprint: { width: 2, depth: 1 },
    serviceCells: [{ x: 1, z: 1 }],
    inputCapacity: 20,
    outputCapacity: 20,
    powerE: 1,
    recipeIds: [],
  },
};

export const A3_RECIPES: Record<string, RecipeDefinition> = {
  'recipe.age_cheese': {
    id: 'recipe.age_cheese',
    machineTypeId: 'station.fridge',
    inputs: [
      { itemId: 'item.fresh_milk', quantity: 3 },
      { itemId: 'item.salt', quantity: 1 }
    ],
    outputs: [{ itemId: 'item.aged_cheese', quantity: 1 }],
    durationTicks: 200,
  }
};
