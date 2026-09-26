import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { CustomerSystem } from './CustomerSystem';
import { SceneManager } from '../SceneManager';

vi.mock('../SceneManager', () => ({
  SceneManager: class {
    add = vi.fn();
  }
}));

describe('CustomerSystem', () => {
  it('spawns customers over time', () => {
    const sceneManager = new SceneManager({} as HTMLCanvasElement);
    const system = new CustomerSystem(sceneManager);
    
    expect(system.getCustomers().length).toBe(0);
    
    // update a lot of time to force a spawn
    system.update(100); 
    
    expect(system.getCustomers().length).toBeGreaterThan(0);
  });
});
