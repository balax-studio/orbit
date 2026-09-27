// Orbit Market - Portrait Camera Controller
// Reference: DUNYA_YERLESIM_PLANI.md §1, KARARLAR.md D-017, D-039

import * as THREE from 'three';

export interface CameraTarget {
  x: number;
  y: number;
  z: number;
}

export class PortraitCamera {
  public camera: THREE.PerspectiveCamera;
  private currentLookAt: THREE.Vector3;
  private targetLookAt: THREE.Vector3;

  // Kamera açı ve mesafe sabitleri
  private readonly CAMERA_OFFSET = new THREE.Vector3(0, 16, 12);
  // Portre ekranda alt HUD'ın (~120px) oyuncuyu kapatmaması için hedef merkezini hafif aşağı kaydırma ofseti
  private readonly HUD_COMPENSATION_Z = 1.8;

  constructor(aspect: number) {
    // Portre modda dikey görüş açısını 45 dereceye sabitle
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.currentLookAt = new THREE.Vector3();
    this.targetLookAt = new THREE.Vector3();

    this.updateAspect(aspect);
  }

  public updateAspect(aspect: number): void {
    this.camera.aspect = aspect;
    // Portre ekranda (aspect < 1) sahneyi yanlardan kırpmamak için FOV'u dinamik genişlet
    if (aspect < 1) {
      this.camera.fov = 45 / Math.max(0.65, aspect);
    } else {
      this.camera.fov = 45;
    }
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
