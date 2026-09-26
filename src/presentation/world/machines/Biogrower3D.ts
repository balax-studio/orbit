import * as THREE from 'three';
import { BaseMachine3D } from './BaseMachine3D';

export class Biogrower3D extends BaseMachine3D {
  protected buildMesh(): THREE.Mesh {
    // Neo-Brutalist: blocky, flat shading, vivid green accent for bio
    const geometry = new THREE.SphereGeometry(1.5, 8, 8); // low-poly sphere/icosahedron feel
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xA7EB52, // Vivid Green
      flatShading: true,
      roughness: 0.9
    });
    return new THREE.Mesh(geometry, material);
  }
  
  public update(delta: number): void {
    // Pulsing animation
    const scale = 1.0 + Math.sin(Date.now() * 0.003) * 0.05;
    this.group.scale.set(scale, scale, scale);
  }
}
