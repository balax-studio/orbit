import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Character3D } from './Character3D';

class TestChar extends Character3D {
  protected buildMesh(): THREE.Mesh {
    return new THREE.Mesh(new THREE.BoxGeometry());
  }
}

describe('Character3D', () => {
  it('initializes and can set target position', () => {
    const char = new TestChar('char-1');
    expect(char.group).toBeInstanceOf(THREE.Group);
    
    char.moveTo(new THREE.Vector3(10, 0, 10));
    expect(char.targetPosition.x).toBe(10);
  });
});
