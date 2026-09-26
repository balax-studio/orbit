import * as THREE from 'three';

export abstract class Character3D {
  public id: string;
  public group: THREE.Group;
  public targetPosition: THREE.Vector3;
  private speed: number = 5.0;

  constructor(id: string) {
    this.id = id;
    this.group = new THREE.Group();
    this.targetPosition = new THREE.Vector3();
    const mesh = this.buildMesh();
    this.group.add(mesh);
  }

  protected abstract buildMesh(): THREE.Mesh;
  
  public moveTo(target: THREE.Vector3): void {
    this.targetPosition.copy(target);
  }

  public update(delta: number): void {
    // Simple lerp / movement towards target
    if (this.group.position.distanceTo(this.targetPosition) > 0.1) {
      const direction = this.targetPosition.clone().sub(this.group.position).normalize();
      this.group.position.add(direction.multiplyScalar(this.speed * delta));
    }
  }
}
