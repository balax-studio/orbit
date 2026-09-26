import { GameEngine } from '../application/simulation/GameEngine';
import { SceneManager } from '../presentation/world/SceneManager';
import { Packer3D } from '../presentation/world/machines/Packer3D';
import { Player3D } from '../presentation/world/characters/Player3D';
import { InputManager } from '../presentation/world/InputManager';
import { CustomerSystem } from '../presentation/world/systems/CustomerSystem';
import * as THREE from 'three';

export class AppBootstrap {
  public engine: GameEngine;
  public sceneManager: SceneManager;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private packer3D: Packer3D;
  private player3D: Player3D;
  private inputManager: InputManager;
  private customerSystem: CustomerSystem;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new GameEngine();
    this.sceneManager = new SceneManager(canvas);
    this.inputManager = new InputManager(canvas, this.sceneManager.camera, this.sceneManager.scene);
    
    this.inputManager.onPointSelected = (point) => {
      // Only move on X/Z plane
      const target = new THREE.Vector3(point.x, 0, point.z);
      this.player3D.moveTo(target);
    };

    this.customerSystem = new CustomerSystem(this.sceneManager);

    this.setupVisuals();
  }

  private setupVisuals() {
    // Player
    this.player3D = new Player3D('player-1');
    this.player3D.group.position.set(0, 0, 0);
    this.sceneManager.add(this.player3D.group);

    // Machine 1 (Packer)
    this.packer3D = new Packer3D('packer-bootstrap');
    this.packer3D.group.position.set(-5, 1, 0);
    this.sceneManager.add(this.packer3D.group);

    // Shelf 1
    const shelfMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 1), new THREE.MeshStandardMaterial({ color: 0xA7EB52 }));
    shelfMesh.position.set(5, 1.5, 0);
    this.sceneManager.add(shelfMesh);

    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial({ color: 0xF4F0E6 }));
    floor.rotation.x = -Math.PI / 2;
    this.sceneManager.add(floor);
  }

  public run() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    this.isRunning = false;
  }

  private loop = (time: number) => {
    if (!this.isRunning) return;
    requestAnimationFrame(this.loop);
    
    const delta = time - this.lastTime;
    this.lastTime = time;

    this.engine.tick(delta);
    
    // Update visuals
    this.packer3D.update(delta);
    this.player3D.update(delta);
    this.customerSystem.update(delta);
    
    this.sceneManager.render(time / 1000.0);
  }
}
