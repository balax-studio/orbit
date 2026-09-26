import * as THREE from 'three';
import { Customer3D } from '../characters/Customer3D';
import { SceneManager } from '../SceneManager';

export class CustomerSystem {
  private customers: Customer3D[] = [];
  private sceneManager: SceneManager;
  private spawnTimer: number = 0;
  private spawnInterval: number = 5.0; // spawn every 5 seconds

  constructor(sceneManager: SceneManager) {
    this.sceneManager = sceneManager;
  }

  public getCustomers(): Customer3D[] {
    return this.customers;
  }

  public update(delta: number): void {
    this.spawnTimer += delta;
    
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnCustomer();
    }

    // Update all customers (movement)
    this.customers.forEach(c => c.update(delta));
  }

  private spawnCustomer() {
    const id = `cust-${Date.now()}`;
    const customer = new Customer3D(id);
    
    // Spawn at a far point
    customer.group.position.set(10, 0, 10);
    
    // Target a spot in the shop (e.g. queue position)
    // For now, just line them up along the Z axis
    const queueZ = this.customers.length * 2; 
    customer.moveTo(new THREE.Vector3(3, 0, queueZ - 5));

    this.customers.push(customer);
    this.sceneManager.add(customer.group);
  }
}
