import * as THREE from 'three';

export abstract class BaseMachine3D {
  public id: string;
  public group: THREE.Group;

  constructor(id: string) {
    this.id = id;
    this.group = new THREE.Group();
    const mesh = this.buildMesh();
    this.group.add(mesh);
  }

  protected abstract buildMesh(): THREE.Mesh;
  
  public update(delta: number): void {
    // Override for animation
  }
}
