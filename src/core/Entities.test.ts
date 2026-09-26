import { describe, it, expect, beforeEach } from 'vitest';
import { Machine, Shelf, Customer } from './Entities';
import { GameState } from './GameState';

describe('Machine', () => {
  it('processes input into output over time', () => {
    // Requires 2 raw_materials to make 1 product_a, takes 1000ms
    const machine = new Machine('processor', 'raw_material', 2, 'product_a', 1, 1000);
    
    // Add inputs
    expect(machine.addInput(1)).toBe(true);
    expect(machine.addInput(1)).toBe(true);
    expect(machine.addInput(1)).toBe(false); // Max capacity reached, assume max is 2 for this test
    
    expect(machine.inputCount).toBe(2);
    expect(machine.outputCount).toBe(0);

    // Tick 500ms
    machine.tick(500);
    expect(machine.outputCount).toBe(0);

    // Tick another 500ms
    machine.tick(500);
    expect(machine.inputCount).toBe(0);
    expect(machine.outputCount).toBe(1);

    // Collect output
    const collected = machine.collectOutput(1);
    expect(collected).toBe(1);
    expect(machine.outputCount).toBe(0);
  });
});

describe('Shelf', () => {
  it('stores products and handles purchases', () => {
    const shelf = new Shelf('shelf_1', 'product_a', 10, 15); // capacity 10, price 15
    const state = new GameState();

    expect(shelf.addProduct(5)).toBe(true);
    expect(shelf.productCount).toBe(5);
    
    // Customer buys 2
    const success = shelf.buyProduct(2, state);
    expect(success).toBe(true);
    expect(shelf.productCount).toBe(3);
    expect(state.money).toBe(30); // 2 * 15
  });
});

describe('Customer', () => {
  it('seeks products and leaves if not found', () => {
    const customer = new Customer('product_a', 2);
    const shelf = new Shelf('shelf_1', 'product_a', 10, 15);
    const state = new GameState();

    // Shelf is empty
    expect(customer.tryBuy(shelf, state)).toBe(false);
    expect(state.money).toBe(0);

    // Add product to shelf
    shelf.addProduct(5);
    expect(customer.tryBuy(shelf, state)).toBe(true);
    expect(state.money).toBe(30);
    expect(shelf.productCount).toBe(3);
  });
});
