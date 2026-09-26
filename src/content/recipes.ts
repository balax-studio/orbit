export interface RecipeComponent {
  itemId: string;
  quantity: number;
}

export interface RecipeDefinition {
  id: string;
  stationType: string;
  inputs: RecipeComponent[];
  outputs: RecipeComponent[];
  durationSeconds: number;
  powerRequired: number;
}

export const RECIPES: RecipeDefinition[] = [
  {
    id: 'recipe.nutrient_cube',
    stationType: 'packer',
    inputs: [{ itemId: 'item.algae', quantity: 2 }],
    outputs: [{ itemId: 'item.nutrient_cube', quantity: 1 }],
    durationSeconds: 8,
    powerRequired: 2
  }
];

export function getRecipesForStation(stationType: string): RecipeDefinition[] {
  return RECIPES.filter(r => r.stationType === stationType);
}
