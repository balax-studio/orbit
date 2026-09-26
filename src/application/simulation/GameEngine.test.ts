import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from './GameEngine';

describe('GameEngine', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
  });

  it('completes the full gameplay loop', () => {
    // 1. Initial State
    expect(engine.state.money).toBe(0);
    
    // Give player some raw materials to start
    engine.state.addToInventory('raw_material', 2);
    
    // 2. Interact with Machine (Drops input)
    const machineId = 'machine_1';
    engine.playerInteract(machineId);
    
    const machine = engine.getMachine(machineId);
    expect(machine?.inputCount).toBe(2);
    expect(engine.state.inventory.get('raw_material') || 0).toBe(0);

    // 3. Tick time so machine processes
    engine.tick(1000); // Machine takes 1000ms
    expect(machine?.outputCount).toBe(1);

    // 4. Interact with Machine again (Collects output)
    engine.playerInteract(machineId);
    expect(machine?.outputCount).toBe(0);
    expect(engine.state.inventory.get('product_a')).toBe(1);

    // 5. Interact with Shelf (Drops product)
    const shelfId = 'shelf_1';
    engine.playerInteract(shelfId);
    const shelf = engine.getShelf(shelfId);
    expect(shelf?.productCount).toBe(1);
    expect(engine.state.inventory.get('product_a') || 0).toBe(0);

    // 6. Spawn Customer and interact
    engine.spawnCustomer('product_a', 1);
    engine.tick(100); // Simulate customer processing

    // 7. Validate outcome
    expect(shelf?.productCount).toBe(0);
    expect(engine.state.money).toBe(15); // product_a price is 15
  });
});
