// Orbit Market - Three.js WebGL2 Scene Renderer
// Reference: DUNYA_YERLESIM_PLANI.md §1-4, §8, UI_DESIGN_SYSTEM.md §4, §10

import * as THREE from 'three';
import { WorldLayout, type WorldFixture } from './WorldLayout';
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
  private workerMesh: THREE.Group;
  private fixtureMeshes = new Map<string, { body: THREE.Mesh; service: THREE.Mesh }>();
  private placementPreview: THREE.Mesh | null = null;
  private targetMarker: THREE.Mesh;
  private groundPlane: THREE.Mesh;
  private raycaster: THREE.Raycaster;
  private mouseVec: THREE.Vector2;
  private moduleGeometryRoot = new THREE.Group();
  private unsubscribeWorldLayout: (() => void) | null = null;

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
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.portraitCamera = new PortraitCamera(width / height);
    this.raycaster = new THREE.Raycaster();
    this.mouseVec = new THREE.Vector2();

    this.playerMesh = new THREE.Group();
    this.workerMesh = new THREE.Group();
    this.targetMarker = new THREE.Mesh();
    this.groundPlane = new THREE.Mesh();

    this.setupLighting();
    this.setupWorldEnvironment();
    this.setupFixtures();
    this.setupPlayer();
    this.setupWorker();
    this.setupTargetMarker();

    this.updatePlayer({
      x: WorldLayout.PLAYER_SPAWN.x,
      z: WorldLayout.PLAYER_SPAWN.z,
      rotation: 0,
    });
    this.unsubscribeWorldLayout = WorldLayout.subscribe(() => {
      this.refreshWorldModules();
      this.updateFixtures(WorldLayout.FIXTURES);
    });
  }

  private setupLighting(): void {
    const ambient = new THREE.AmbientLight('#FFFFFF', 1.2);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight('#FFF9E6', 1.8);
    dirLight.position.set(WorldLayout.ROOM_CENTER.x - 9, 30, WorldLayout.ROOM_CENTER.z - 20);
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
    const worldWidth = WorldLayout.WORLD_BOUNDS.maxX - WorldLayout.WORLD_BOUNDS.minX;
    const worldDepth = WorldLayout.WORLD_BOUNDS.maxZ - WorldLayout.WORLD_BOUNDS.minZ;
    const groundGeo = new THREE.PlaneGeometry(worldWidth, worldDepth);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#8BA870',
      roughness: 0.9,
    });
    this.groundPlane = new THREE.Mesh(groundGeo, groundMat);
    this.groundPlane.rotation.x = -Math.PI / 2;
    const worldCenter = (WorldLayout.WORLD_BOUNDS.minX + WorldLayout.WORLD_BOUNDS.maxX) / 2;
    const worldDepthCenter = (WorldLayout.WORLD_BOUNDS.minZ + WorldLayout.WORLD_BOUNDS.maxZ) / 2;
    this.groundPlane.position.set(worldCenter, 0, worldDepthCenter);
    this.groundPlane.receiveShadow = true;
    this.scene.add(this.groundPlane);

    const gardenWidth = WorldLayout.GARDEN_BOUNDS.maxX - WorldLayout.GARDEN_BOUNDS.minX;
    const gardenDepth = WorldLayout.GARDEN_BOUNDS.maxZ - WorldLayout.GARDEN_BOUNDS.minZ;
    const gardenCenterX = (WorldLayout.GARDEN_BOUNDS.minX + WorldLayout.GARDEN_BOUNDS.maxX) / 2;
    const gardenCenterZ = (WorldLayout.GARDEN_BOUNDS.minZ + WorldLayout.GARDEN_BOUNDS.maxZ) / 2;
    const gardenGeo = new THREE.PlaneGeometry(gardenWidth, gardenDepth);
    const gardenMat = new THREE.MeshStandardMaterial({
      color: '#5C4033', // Zengin koyu bostan toprağı
      roughness: 0.95,
    });
    const gardenMesh = new THREE.Mesh(gardenGeo, gardenMat);
    gardenMesh.rotation.x = -Math.PI / 2;
    gardenMesh.position.set(gardenCenterX, 0.02, gardenCenterZ);
    gardenMesh.receiveShadow = true;
    this.scene.add(gardenMesh);

    const corridorWidth = WorldLayout.WEST_CORRIDOR.maxX - WorldLayout.WEST_CORRIDOR.minX;
    const corridorDepth = WorldLayout.WEST_CORRIDOR.maxZ - WorldLayout.WEST_CORRIDOR.minZ;
    const corridorCenterX = (WorldLayout.WEST_CORRIDOR.minX + WorldLayout.WEST_CORRIDOR.maxX) / 2;
    const corridorCenterZ = (WorldLayout.WEST_CORRIDOR.minZ + WorldLayout.WEST_CORRIDOR.maxZ) / 2;
    const pathGeo = new THREE.PlaneGeometry(corridorWidth, corridorDepth);
    const pathMat = new THREE.MeshStandardMaterial({
      color: '#D8CBB5',
      roughness: 0.8,
    });
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.rotation.x = -Math.PI / 2;
    pathMesh.position.set(corridorCenterX, 0.03, corridorCenterZ);
    pathMesh.receiveShadow = true;
    this.scene.add(pathMesh);

    this.refreshWorldModules();
  }

  public refreshWorldModules(): void {
    this.refreshGroundPlane();
    disposeGroupContents(this.moduleGeometryRoot);
    if (!this.moduleGeometryRoot.parent) this.scene.add(this.moduleGeometryRoot);

    const roomMat = new THREE.MeshStandardMaterial({ color: '#F4F0E6', roughness: 0.4 });
    const wallMat = new THREE.MeshStandardMaterial({ color: '#E5DFD3', roughness: 0.7 });
    const wallHeight = 2.5;
    for (const module of WorldLayout.getActiveModules()) {
      const width = module.bounds.maxX - module.bounds.minX;
      const depth = module.bounds.maxZ - module.bounds.minZ;
      const floorMat = module.surfaceColor
        ? new THREE.MeshStandardMaterial({ color: module.surfaceColor, roughness: 0.9 })
        : roomMat;
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.set((module.bounds.minX + module.bounds.maxX) / 2, 0.04,
        (module.bounds.minZ + module.bounds.maxZ) / 2);
      floor.receiveShadow = true;
      this.moduleGeometryRoot.add(floor);
      if (module.enclosure === 'open') continue;

      const createWall = (length: number, side: 'north' | 'east' | 'south' | 'west', start: number) => {
        if (length <= 0) return;
        const horizontal = side === 'north' || side === 'south';
        const wall = new THREE.Mesh(new THREE.BoxGeometry(horizontal ? length : 0.3, wallHeight,
          horizontal ? 0.3 : length), wallMat);
        const x = side === 'west' ? module.bounds.minX + 0.15
          : side === 'east' ? module.bounds.maxX - 0.15 : start + length / 2;
        const z = side === 'north' ? module.bounds.minZ + 0.15
          : side === 'south' ? module.bounds.maxZ - 0.15 : start + length / 2;
        wall.position.set(x, wallHeight / 2, z);
        wall.castShadow = true;
        wall.receiveShadow = true;
        this.moduleGeometryRoot.add(wall);
      };

      for (const side of ['north', 'east', 'south', 'west'] as const) {
        const horizontal = side === 'north' || side === 'south';
        const axisMin = horizontal ? module.bounds.minX : module.bounds.minZ;
        const axisMax = horizontal ? module.bounds.maxX : module.bounds.maxZ;
        const openings = module.doorways.filter((door) => door.side === side)
          .map((door) => ({ start: door.center - door.width / 2, end: door.center + door.width / 2 }))
          .sort((a, b) => a.start - b.start);
        let cursor = axisMin;
        for (const opening of openings) {
          createWall(opening.start - cursor, side, cursor);
          cursor = Math.max(cursor, opening.end);
        }
        createWall(axisMax - cursor, side, cursor);
      }
    }
  }

  private refreshGroundPlane(): void {
    const worldWidth = WorldLayout.WORLD_BOUNDS.maxX - WorldLayout.WORLD_BOUNDS.minX;
    const worldDepth = WorldLayout.WORLD_BOUNDS.maxZ - WorldLayout.WORLD_BOUNDS.minZ;
    this.groundPlane.geometry.dispose();
    this.groundPlane.geometry = new THREE.PlaneGeometry(worldWidth, worldDepth);
    this.groundPlane.position.set(
      (WorldLayout.WORLD_BOUNDS.minX + WorldLayout.WORLD_BOUNDS.maxX) / 2,
      0,
      (WorldLayout.WORLD_BOUNDS.minZ + WorldLayout.WORLD_BOUNDS.maxZ) / 2,
    );
  }

  private setupFixtures(): void {
    this.updateFixtures(WorldLayout.FIXTURES);
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

  private setupWorker(): void {
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 1.05, 12),
      new THREE.MeshStandardMaterial({ color: '#35D9E6', roughness: 0.45 })
    );
    body.position.y = 0.53;
    body.castShadow = true;
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 12, 12),
      new THREE.MeshStandardMaterial({ color: '#171717', roughness: 0.5 })
    );
    head.position.y = 1.22;
    this.workerMesh.add(body, head);
    this.scene.add(this.workerMesh);
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

  public updateWorker(position: { x: number; z: number }): void {
    this.workerMesh.position.set(position.x, 0, position.z);
  }

  public updateFixtures(fixtures: readonly WorldFixture[]): void {
    const fixtureIds = new Set(fixtures.map((fixture) => fixture.id));
    for (const [id, meshes] of this.fixtureMeshes) {
      if (fixtureIds.has(id)) continue;
      this.scene.remove(meshes.body, meshes.service);
      meshes.body.geometry.dispose();
      (meshes.body.material as THREE.Material).dispose();
      meshes.service.geometry.dispose();
      (meshes.service.material as THREE.Material).dispose();
      this.fixtureMeshes.delete(id);
    }
    for (const fixture of fixtures) {
      let meshes = this.fixtureMeshes.get(fixture.id);
      if (!meshes) {
        const body = new THREE.Mesh(new THREE.BoxGeometry(
          fixture.bounds.maxX - fixture.bounds.minX, 1,
          fixture.bounds.maxZ - fixture.bounds.minZ),
        new THREE.MeshStandardMaterial({ color: fixture.color, roughness: 0.5 }));
        body.castShadow = true;
        body.receiveShadow = true;
        const service = new THREE.Mesh(new THREE.RingGeometry(0.15, 0.25, 16),
          new THREE.MeshBasicMaterial({ color: '#171717', side: THREE.DoubleSide }));
        service.rotation.x = -Math.PI / 2;
        this.scene.add(body, service);
        meshes = { body, service };
        this.fixtureMeshes.set(fixture.id, meshes);
      }
      meshes.body.position.set((fixture.bounds.minX + fixture.bounds.maxX) / 2, 0.5,
        (fixture.bounds.minZ + fixture.bounds.maxZ) / 2);
      meshes.service.position.set(fixture.serviceCell.x, 0.05, fixture.serviceCell.z);
    }
  }

  public showPlacementPreview(fixture: WorldFixture, valid: boolean): void {
    this.hidePlacementPreview();
    this.placementPreview = new THREE.Mesh(
      new THREE.BoxGeometry(fixture.bounds.maxX - fixture.bounds.minX, 0.12,
        fixture.bounds.maxZ - fixture.bounds.minZ),
      new THREE.MeshBasicMaterial({ color: valid ? '#A7EB52' : '#FF5733', transparent: true, opacity: 0.75 })
    );
    this.placementPreview.position.set((fixture.bounds.minX + fixture.bounds.maxX) / 2, 0.1,
      (fixture.bounds.minZ + fixture.bounds.maxZ) / 2);
    this.scene.add(this.placementPreview);
  }

  public hidePlacementPreview(): void {
    if (this.placementPreview) {
      this.scene.remove(this.placementPreview);
      this.placementPreview.geometry.dispose();
      (this.placementPreview.material as THREE.Material).dispose();
    }
    this.placementPreview = null;
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
    this.unsubscribeWorldLayout?.();
    this.unsubscribeWorldLayout = null;
    disposeGroupContents(this.moduleGeometryRoot);
    this.renderer.dispose();
  }
}

function disposeGroupContents(group: THREE.Group): void {
  const materials = new Set<THREE.Material>();
  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
    }
  });
  for (const material of materials) material.dispose();
  group.clear();
}
