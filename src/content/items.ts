export interface ItemDefinition {
  id: string;
  name: string;
  stackSize: number;
  basePrice: number;
  category: 'resource' | 'intermediate' | 'product';
}

export const ITEMS: Record<string, ItemDefinition> = {
  'item.water': { id: 'item.water', name: 'Su', stackSize: 20, basePrice: 0, category: 'intermediate' },
  'item.nutrient_cube': { id: 'item.nutrient_cube', name: 'Besin Küpü', stackSize: 10, basePrice: 12, category: 'product' },
  // Add algae just so it exists for the recipe
  'item.algae': { id: 'item.algae', name: 'Yosun', stackSize: 20, basePrice: 0, category: 'intermediate' }
};

export function getItem(id: string): ItemDefinition {
  const item = ITEMS[id];
  if (!item) throw new Error(`Item not found: ${id}`);
  return item;
}
