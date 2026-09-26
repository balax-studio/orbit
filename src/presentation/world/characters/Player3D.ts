import * as THREE from 'three';
import { Character3D } from './Character3D';

export class Player3D extends Character3D {
  protected buildMesh(): THREE.Mesh {
    // Neo-Brutalist: simple capsule, white paper color
    const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xF4F0E6, 
      flatShading: true 
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 1; // Pivot at feet
    return mesh;
  }
}
