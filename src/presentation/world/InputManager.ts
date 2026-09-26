import * as THREE from 'three';

export class InputManager {
  private raycaster: THREE.Raycaster;
  private pointer: THREE.Vector2;
  private canvas: HTMLCanvasElement;
  private camera: THREE.Camera;
  private scene: THREE.Scene;

  public onPointSelected: ((point: THREE.Vector3, object: THREE.Object3D) => void) | null = null;

  constructor(canvas: HTMLCanvasElement, camera: THREE.Camera, scene: THREE.Scene) {
    this.canvas = canvas;
    this.camera = camera;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.canvas.addEventListener('pointerdown', this.onPointerDown);
  }

  public dispose() {
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
  }

  private onPointerDown = (event: PointerEvent | MouseEvent) => {
    // Calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components.
    const rect = this.canvas.getBoundingClientRect();
    
    // Account for potential padding/borders
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.pointer.x = (x / rect.width) * 2 - 1;
    this.pointer.y = -(y / rect.height) * 2 + 1;

    // Update the picking ray with the camera and pointer position
    this.raycaster.setFromCamera(this.pointer, this.camera);

    // Calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0 && this.onPointSelected) {
      // Return the first hit
      const hit = intersects[0];
      this.onPointSelected(hit.point, hit.object);
    }
  };
}
