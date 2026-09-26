import * as THREE from 'three';
import { BaseMachine3D } from './BaseMachine3D';

export class Melter3D extends BaseMachine3D {
  protected buildMesh(): THREE.Mesh {
    // Neo-Brutalist: blocky, flat shading, signal yellow accent for heat
    const geometry = new THREE.CylinderGeometry(1, 1.2, 2.5, 6); // low-poly hexagon
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xFFE156, // Signal Yellow
      flatShading: true,
      roughness: 0.6
    });
    return new THREE.Mesh(geometry, material);
  }
  
  public update(delta: number): void {
    // Rotation animation
    this.group.rotation.y += delta * 0.5;
  }
}
