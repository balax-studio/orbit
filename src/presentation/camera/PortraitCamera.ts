// Orbit Market - Portrait Camera Controller
// Reference: DUNYA_YERLESIM_PLANI.md §1, KARARLAR.md D-017, D-039

import * as THREE from 'three';

export interface CameraTarget {
  x: number;
  y: number;
  z: number;
}

export class PortraitCamera {
  public camera: THREE.OrthographicCamera;
  private currentLookAt: THREE.Vector3;
  private targetLookAt: THREE.Vector3;

  // Kamera açı ve mesafe sabitleri
  private readonly CAMERA_OFFSET = new THREE.Vector3(8, 7.07, 8);
  // Portre ekranda alt HUD'ın (~120px) oyuncuyu kapatmaması için hedef merkezini hafif aşağı kaydırma ofseti
  private readonly HUD_COMPENSATION_Z = 1.8;

  constructor(aspect: number) {
    this.camera = new THREE.OrthographicCamera(-4, 4, 7, -7, 0.1, 100);
    this.currentLookAt = new THREE.Vector3();
    this.targetLookAt = new THREE.Vector3();

    this.updateAspect(aspect);
  }

  public updateAspect(aspect: number): void {
    if (!Number.isFinite(aspect) || aspect <= 0) return;
    // En az 8 dünya birimi yatay alan; dar portrede yüksekliği genişlet.
    const halfHeight = Math.max(14, 8 / aspect) / 2;
    const halfWidth = halfHeight * aspect;
    this.camera.left = -halfWidth;
    this.camera.right = halfWidth;
    this.camera.top = halfHeight;
    this.camera.bottom = -halfHeight;
    this.camera.updateProjectionMatrix();
  }

  public follow(target: CameraTarget, lerpFactor: number = 0.1): void {
    // Hedef nokta: oyuncu koordinatına HUD kompanzasyonu eklenmiş nokta
    this.targetLookAt.set(
      target.x,
      target.y,
      target.z + this.HUD_COMPENSATION_Z
    );

    if (this.currentLookAt.lengthSq() === 0) {
      this.currentLookAt.copy(this.targetLookAt);
      this.camera.position.copy(this.targetLookAt).add(this.CAMERA_OFFSET);
    } else {
      this.currentLookAt.lerp(this.targetLookAt, lerpFactor);
      const desiredPosition = new THREE.Vector3()
        .copy(this.currentLookAt)
        .add(this.CAMERA_OFFSET);
      this.camera.position.lerp(desiredPosition, lerpFactor);
    }

    this.camera.lookAt(this.currentLookAt);
  }
}
