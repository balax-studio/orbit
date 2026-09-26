import { GameEngine } from '../application/simulation/GameEngine';
import { SceneManager } from '../presentation/world/SceneManager';
import * as THREE from 'three';

export class AppBootstrap {
  public engine: GameEngine;
  public sceneManager: SceneManager;
  private lastTime: number = 0;
  private isRunning: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new GameEngine();
    this.sceneManager = new SceneManager(canvas);

    this.setupVisuals();
  }

  private setupVisuals() {
    // Machine 1
    const machineMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshStandardMaterial({ color: 0x35D9E6 }));
    machineMesh.position.set(-5, 1, 0);
    this.sceneManager.add(machineMesh);

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
    this.sceneManager.render(time / 1000.0);
  }
}
