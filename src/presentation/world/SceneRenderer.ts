// Orbit Market - Three.js WebGL2 Scene Renderer
// Reference: DUNYA_YERLESIM_PLANI.md §1-4, §8, UI_DESIGN_SYSTEM.md §4, §10

import * as THREE from 'three';
import { WorldLayout } from './WorldLayout';
import { PortraitCamera } from '../camera/PortraitCamera';

export interface ScenePlayerState {
  x: number;
  z: number;
  rotation: number;
}

export class SceneRenderer {
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public portraitCamera: PortraitCamera;

  private playerMesh: THREE.Group;
  private targetMarker: THREE.Mesh;
  private groundPlane: THREE.Mesh;
  private raycaster: THREE.Raycaster;
  private mouseVec: THREE.Vector2;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#D8E2DC'); // Yumuşak açık pastel gökyüzü tonu

    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.portraitCamera = new PortraitCamera(width / height);
    this.raycaster = new THREE.Raycaster();
    this.mouseVec = new THREE.Vector2();

    this.playerMesh = new THREE.Group();
    this.targetMarker = new THREE.Mesh();
    this.groundPlane = new THREE.Mesh();

    this.setupLighting();
    this.setupWorldEnvironment();
    this.setupFixtures();
    this.setupPlayer();
    this.setupTargetMarker();

    this.updatePlayer({
      x: WorldLayout.PLAYER_SPAWN.x,
      z: WorldLayout.PLAYER_SPAWN.z,
      rotation: 0,
    });
  }

  private setupLighting(): void {
    const ambient = new THREE.AmbientLight('#FFFFFF', 1.2);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight('#FFF9E6', 1.8);
    dirLight.position.set(20, 30, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 70;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    dirLight.shadow.bias = -0.001;
    this.scene.add(dirLight);
  }

  private setupWorldEnvironment(): void {
    // 1. Ana Dış Zemin (Toprak / Çim taban)
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#8BA870',
      roughness: 0.9,
    });
    this.groundPlane = new THREE.Mesh(groundGeo, groundMat);
    this.groundPlane.rotation.x = -Math.PI / 2;
    this.groundPlane.position.set(24, 0, 20);
    this.groundPlane.receiveShadow = true;
    this.scene.add(this.groundPlane);

    // 2. Batı Bahçe Toprak Alanı (x4..9, z20..27)
    const gardenGeo = new THREE.PlaneGeometry(6, 8);
    const gardenMat = new THREE.MeshStandardMaterial({
      color: '#5C4033', // Zengin koyu bostan toprağı
      roughness: 0.95,
    });
    const gardenMesh = new THREE.Mesh(gardenGeo, gardenMat);
    gardenMesh.rotation.x = -Math.PI / 2;
    gardenMesh.position.set(6.5, 0.02, 23.5);
    gardenMesh.receiveShadow = true;
    this.scene.add(gardenMesh);

    // 3. Batı Koridoru ve Ön Kaldırım (x10..15, z24..29)
    const pathGeo = new THREE.PlaneGeometry(3, 2);
    const pathMat = new THREE.MeshStandardMaterial({
      color: '#D8CBB5',
      roughness: 0.8,
    });
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.rotation.x = -Math.PI / 2;
    pathMesh.position.set(11, 0.03, 24.5);
    pathMesh.receiveShadow = true;
    this.scene.add(pathMesh);

    // 4. R3-C0 Satış Odası Zemini (Krem Mat Seramik - DUNYA_YERLESIM_PLANI §8)
    const roomGeo = new THREE.PlaneGeometry(6, 6);
    const roomMat = new THREE.MeshStandardMaterial({
      color: '#F4F0E6',
      roughness: 0.4,
    });
    const roomMesh = new THREE.Mesh(roomGeo, roomMat);
    roomMesh.rotation.x = -Math.PI / 2;
    roomMesh.position.set(14.5, 0.04, 24.5);
    roomMesh.receiveShadow = true;
    this.scene.add(roomMesh);

    // 5. Oda Duvarları (Kuzey, Doğu ve kapı boşluklu Güney/Batı duvarları)
    const wallMat = new THREE.MeshStandardMaterial({
      color: '#E5DFD3',
      roughness: 0.7,
    });

    const createWall = (
      width: number,
      height: number,
      depth: number,
      pos: [number, number, number]
    ) => {
      const geo = new THREE.BoxGeometry(width, height, depth);
      const mesh = new THREE.Mesh(geo, wallMat);
      mesh.position.set(...pos);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    };

    const wallHeight = 2.5;

    // Kuzey Duvarı (kesintisiz 6m)
    createWall(6, wallHeight, 0.3, [14.5, wallHeight / 2, 21.85]);

    // Doğu Duvarı (kesintisiz 6m)
    createWall(0.3, wallHeight, 6, [17.15, wallHeight / 2, 24.5]);

    // Güney Duvarı (ortada 2m kapı boşluğu x14..15 açık)
    createWall(2, wallHeight, 0.3, [12.5, wallHeight / 2, 27.15]);
    createWall(2, wallHeight, 0.3, [16.5, wallHeight / 2, 27.15]);

    // Batı Duvarı (z24..25 bahçe kapısı açık)
    createWall(0.3, wallHeight, 2.5, [11.85, wallHeight / 2, 23.0]);
    createWall(0.3, wallHeight, 1.5, [11.85, wallHeight / 2, 26.5]);
  }

  private setupFixtures(): void {
    for (const fixture of WorldLayout.FIXTURES) {
      const w = fixture.bounds.maxX - fixture.bounds.minX + 1;
      const d = fixture.bounds.maxZ - fixture.bounds.minZ + 1;
      const h = 1.0;

      const posX = (fixture.bounds.minX + fixture.bounds.maxX) / 2;
      const posZ = (fixture.bounds.minZ + fixture.bounds.maxZ) / 2;

      const geo = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({
        color: fixture.color,
        roughness: 0.5,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(posX, h / 2, posZ);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);

      // Servis hücresi görsel göstergesi
      const serviceGeo = new THREE.RingGeometry(0.15, 0.25, 16);
      const serviceMat = new THREE.MeshBasicMaterial({
        color: '#171717',
        side: THREE.DoubleSide,
      });
      const serviceRing = new THREE.Mesh(serviceGeo, serviceMat);
      serviceRing.rotation.x = -Math.PI / 2;
      serviceRing.position.set(fixture.serviceCell.x, 0.05, fixture.serviceCell.z);
      this.scene.add(serviceRing);
    }
  }

  private setupPlayer(): void {
    // Neo-brutalist sevimli karakter gövdesi
    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.2, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: '#FFE156', // Neo sarı
      roughness: 0.3,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.6;
    body.castShadow = true;

    // Baş
    const headGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({
      color: '#171717', // Siyah şapka / saç
      roughness: 0.4,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.35;
    head.castShadow = true;

    // Yön göstergesi (burun/vizör)
    const visorGeo = new THREE.BoxGeometry(0.15, 0.1, 0.15);
    const visorMat = new THREE.MeshBasicMaterial({ color: '#35D9E6' });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.35, 0.3);

    this.playerMesh.add(body);
    this.playerMesh.add(head);
    this.playerMesh.add(visor);
    this.scene.add(this.playerMesh);
  }

  private setupTargetMarker(): void {
    const geo = new THREE.RingGeometry(0.2, 0.35, 24);
    const mat = new THREE.MeshBasicMaterial({
      color: '#35D9E6',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    this.targetMarker = new THREE.Mesh(geo, mat);
    this.targetMarker.rotation.x = -Math.PI / 2;
    this.targetMarker.position.y = 0.05;
    this.targetMarker.visible = false;
    this.scene.add(this.targetMarker);
  }

  public showTargetMarker(x: number, z: number): void {
    this.targetMarker.position.set(x, 0.06, z);
    this.targetMarker.visible = true;
  }

  public hideTargetMarker(): void {
    this.targetMarker.visible = false;
  }

  public updatePlayer(state: ScenePlayerState): void {
    this.playerMesh.position.set(state.x, 0, state.z);
    this.playerMesh.rotation.y = state.rotation;
    this.portraitCamera.follow({ x: state.x, y: 0.6, z: state.z });
  }

  public raycastGround(screenX: number, screenY: number): { x: number; z: number } | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouseVec.x = ((screenX - rect.left) / rect.width) * 2 - 1;
    this.mouseVec.y = -((screenY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouseVec, this.portraitCamera.camera);
    const intersects = this.raycaster.intersectObject(this.groundPlane);

    if (intersects.length > 0 && intersects[0].point) {
      return {
        x: intersects[0].point.x,
        z: intersects[0].point.z,
      };
    }
    return null;
  }

  public resize(width: number, height: number): void {
    this.renderer.setSize(width, height, false);
    this.portraitCamera.updateAspect(width / height);
  }

  public render(): void {
    this.renderer.render(this.scene, this.portraitCamera.camera);
  }

  public destroy(): void {
    this.renderer.dispose();
  }
}
