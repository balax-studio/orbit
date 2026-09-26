import { describe, it, expect } from 'vitest';
import { RECIPES, getRecipesForStation } from './recipes';

describe('Recipes Dictionary', () => {
  it('contains nutrient_cube recipe for packer', () => {
    const packerRecipes = getRecipesForStation('packer');
    expect(packerRecipes.length).toBeGreaterThan(0);
    expect(packerRecipes[0].outputs[0].itemId).toBe('item.nutrient_cube');
    expect(packerRecipes[0].durationSeconds).toBe(8);
  });
});
