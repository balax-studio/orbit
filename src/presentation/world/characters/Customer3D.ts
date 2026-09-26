import * as THREE from 'three';
import { Character3D } from './Character3D';

export class Customer3D extends Character3D {
  protected buildMesh(): THREE.Mesh {
    // Neo-Brutalist: blocky, stark color
    const geometry = new THREE.BoxGeometry(0.8, 1.8, 0.8);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xFF5733, // Vivid Red/Orange
      flatShading: true 
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 0.9; // Pivot at feet
    return mesh;
  }
}
