import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from './GameState';

describe('GameState', () => {
  let state: GameState;

  beforeEach(() => {
    state = new GameState();
  });

  it('starts with default values', () => {
    expect(state.money).toBe(0);
    expect(state.inventory.size).toBe(0);
  });

  it('adds money correctly', () => {
    state.addMoney(100);
    expect(state.money).toBe(100);
  });

  it('adds item to inventory up to capacity', () => {
    state.inventoryCapacity = 6;
    expect(state.addToInventory('raw_material', 4)).toBe(true);
    expect(state.inventory.get('raw_material')).toBe(4);
    
    // Test exceeding capacity
    expect(state.addToInventory('raw_material', 3)).toBe(false);
    expect(state.inventory.get('raw_material')).toBe(4); // Remains unchanged
  });

  it('removes item from inventory', () => {
    state.inventoryCapacity = 6;
    state.addToInventory('product_a', 5);
    
    expect(state.removeFromInventory('product_a', 3)).toBe(true);
    expect(state.inventory.get('product_a')).toBe(2);
    
    // Test removing more than we have
    expect(state.removeFromInventory('product_a', 5)).toBe(false);
    expect(state.inventory.get('product_a')).toBe(2);
  });
});
