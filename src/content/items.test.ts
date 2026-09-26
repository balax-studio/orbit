import { describe, it, expect } from 'vitest';
import { ITEMS, getItem } from './items';

describe('Items Dictionary', () => {
  it('contains water and nutrient_cube', () => {
    const water = getItem('item.water');
    expect(water.id).toBe('item.water');
    expect(water.basePrice).toBe(0);
    
    const cube = getItem('item.nutrient_cube');
    expect(cube.id).toBe('item.nutrient_cube');
    expect(cube.basePrice).toBe(12);
  });
  
  it('throws for missing item', () => {
    expect(() => getItem('item.invalid')).toThrow();
  });
});
