import * as THREE from 'three';
import { BaseMachine3D } from './BaseMachine3D';

export class Packer3D extends BaseMachine3D {
  protected buildMesh(): THREE.Mesh {
    // Neo-Brutalist: blocky, flat shading, electric cyan accent
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x35D9E6, 
      flatShading: true,
      roughness: 0.8
    });
    return new THREE.Mesh(geometry, material);
  }
  
  public update(delta: number): void {
    // Simple idle animation (bobbing)
    this.group.position.y = Math.sin(Date.now() * 0.002) * 0.1;
  }
}
