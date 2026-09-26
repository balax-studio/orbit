import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { BaseMachine3D } from './BaseMachine3D';

class TestMachine extends BaseMachine3D {
  protected buildMesh(): THREE.Mesh {
    return new THREE.Mesh(new THREE.BoxGeometry(1,1,1));
  }
}

describe('BaseMachine3D', () => {
  it('initializes with a mesh', () => {
    const machine = new TestMachine('test-id');
    expect(machine.id).toBe('test-id');
    expect(machine.group).toBeInstanceOf(THREE.Group);
    expect(machine.group.children.length).toBe(1);
  });
});
