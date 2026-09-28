import type { ProductionManager } from '../domain/production/ProductionManager';
import type { RecipeId } from '../domain/types';

export async function selectDurableP0Recipe<T>(
  production: ProductionManager,
  recipeId: RecipeId,
  tick: number,
  capturePayload: () => T,
  append: (transaction: { transactionId: string; type: string; tick: number; payload: T }) => Promise<unknown>,
): Promise<void> {
  const before = production.serialize();
  if (production.getMachine('station.bottler')?.selectedRecipeId === recipeId) return;
  try {
    production.selectRecipe('station.bottler', recipeId);
    await append({ transactionId: `select-recipe:${tick}:${recipeId}`, type: 'SELECT_MACHINE_RECIPE',
      tick, payload: capturePayload() });
  } catch (error) {
    production.restore(before);
    throw error;
  }
}
