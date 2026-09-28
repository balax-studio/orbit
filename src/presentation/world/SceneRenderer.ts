// Orbit Market - Three.js WebGL2 Scene Renderer
// Reference: DUNYA_YERLESIM_PLANI.md §1-4, §8, UI_DESIGN_SYSTEM.md §4, §10

import * as THREE from 'three';
import { WorldLayout, type WorldFixture } from './WorldLayout';
import { PortraitCamera } from '../camera/PortraitCamera';
import { createArticulatedCharacter, type ArticulatedCharacter } from './CharacterRigs';
import { createCarriedAsset, createFixtureAsset, createProductAsset } from './AssetFactory';

interface VisualLot { itemId: string; quantity: number }

export interface InventoryVisualState {
  shelf: VisualLot[];
  shelfCapacity: number;
  bottlerOutput: VisualLot[];
  cropOutput: VisualLot[];
  playerLoad: VisualLot[];
  workerLoad: VisualLot[];
}

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
  private customerMesh: THREE.Group;
  private fixtureMeshes = new Map<string, { body: THREE.Group; service: THREE.Mesh }>();
  private stockSignatures = new Map<string, string>();
  private playerCargo: THREE.Group | null = null;
  private workerCargo: THREE.Group | null = null;
  private playerCargoItem: string | null = null;
  private workerCargoItem: string | null = null;
  private cargoAppear = new WeakMap<THREE.Group, number>();
  private placementPreview: THREE.Mesh | null = null;
  private targetMarker: THREE.Mesh;
  private groundPlane: THREE.Mesh;
  private raycaster: THREE.Raycaster;
  private mouseVec: THREE.Vector2;
  private playerRig: ArticulatedCharacter;
  private workerRig: ArticulatedCharacter;
  private customerRig: ArticulatedCharacter;
  private lastRenderTime = performance.now();
  private moduleGeometryRoot = new THREE.Group();
  private tileTexture = createTileTexture();
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

    this.playerRig = createArticulatedCharacter('player');
    this.workerRig = createArticulatedCharacter('worker');
    this.customerRig = createArticulatedCharacter('customer');
    this.playerMesh = this.playerRig.root;
    this.workerMesh = this.workerRig.root;
    this.customerMesh = this.customerRig.root;
    this.targetMarker = new THREE.Mesh();
    this.groundPlane = new THREE.Mesh();

    this.setupLighting();
    this.setupWorldEnvironment();
    this.setupFixtures();
    this.setupPlayer();
    this.setupWorker();
    this.setupCustomer();
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

    const roomMat = new THREE.MeshStandardMaterial({ map: this.tileTexture, roughness: 0.86 });
    const wallMat = new THREE.MeshStandardMaterial({ color: '#E5DFD3', roughness: 0.7 });
    const cutawayMat = new THREE.MeshStandardMaterial({
      color: '#E5DFD3', roughness: 0.7, transparent: true, opacity: 0.16,
      depthWrite: false, side: THREE.DoubleSide,
    });
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
        const nearCamera = side === 'east' || side === 'south';
        const wall = new THREE.Mesh(new THREE.BoxGeometry(horizontal ? length : 0.3, wallHeight,
          horizontal ? 0.3 : length), nearCamera ? cutawayMat : wallMat);
        const x = side === 'west' ? module.bounds.minX + 0.15
          : side === 'east' ? module.bounds.maxX - 0.15 : start + length / 2;
        const z = side === 'north' ? module.bounds.minZ + 0.15
          : side === 'south' ? module.bounds.maxZ - 0.15 : start + length / 2;
        wall.position.set(x, wallHeight / 2, z);
        wall.castShadow = !nearCamera;
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
    this.scene.add(this.playerMesh);
  }

  private setupWorker(): void {
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
    this.playerRig.setPosition(state.x, state.z);
    this.playerRig.setFacing(state.rotation);
    this.portraitCamera.follow({ x: state.x, y: 0.6, z: state.z });
  }

  public updateWorker(position: { x: number; z: number }): void {
    this.workerRig.setPosition(position.x, position.z);
  }

  private setupCustomer(): void {
    this.customerMesh.visible = false;
    this.scene.add(this.customerMesh);
  }

  public updateCustomer(position: { x: number; z: number } | null): void {
    this.customerMesh.visible = position !== null;
    if (position) this.customerRig.setPosition(position.x, position.z);
  }

  public updateFixtures(fixtures: readonly WorldFixture[]): void {
    const fixtureIds = new Set(fixtures.map((fixture) => fixture.id));
    for (const [id, meshes] of this.fixtureMeshes) {
      if (fixtureIds.has(id)) continue;
      this.scene.remove(meshes.body, meshes.service);
      disposeGroupContents(meshes.body);
      meshes.service.geometry.dispose();
      (meshes.service.material as THREE.Material).dispose();
      this.fixtureMeshes.delete(id);
      this.stockSignatures.delete(id);
    }
    for (const fixture of fixtures) {
      let meshes = this.fixtureMeshes.get(fixture.id);
      if (!meshes) {
        const body = createFixtureAsset(fixture);
        const service = new THREE.Mesh(new THREE.RingGeometry(0.15, 0.25, 16),
          new THREE.MeshBasicMaterial({ color: '#171717', side: THREE.DoubleSide }));
        service.rotation.x = -Math.PI / 2;
        this.scene.add(body, service);
        meshes = { body, service };
        this.fixtureMeshes.set(fixture.id, meshes);
      }
      meshes.body.position.set((fixture.bounds.minX + fixture.bounds.maxX) / 2, 0,
        (fixture.bounds.minZ + fixture.bounds.maxZ) / 2);
      meshes.service.position.set(fixture.serviceCell.x, 0.05, fixture.serviceCell.z);
    }
  }

  /** Presentation follows physical inventory; it never creates or transfers a lot. */
  public updateInventoryVisuals(state: InventoryVisualState): void {
    this.updateStock('fixture.sales_shelf', state.shelf, state.shelfCapacity, 12);
    this.updateStock('station.bottler', state.bottlerOutput, 6, 3);
    this.updateStock('source.crop_plot', state.cropOutput, 6, 3);
    const ripeFruit = this.fixtureMeshes.get('source.crop_plot')?.body.getObjectByName('ripe-fruit');
    if (ripeFruit) ripeFruit.visible = state.cropOutput.some((lot) => lot.quantity > 0);
    this.playerCargo = this.updateCargo(this.playerMesh, this.playerCargo, this.playerCargoItem,
      state.playerLoad[0]?.itemId ?? null);
    this.playerCargoItem = state.playerLoad[0]?.itemId ?? null;
    this.workerCargo = this.updateCargo(this.workerMesh, this.workerCargo, this.workerCargoItem,
      state.workerLoad[0]?.itemId ?? null);
    this.workerCargoItem = state.workerLoad[0]?.itemId ?? null;
  }

  private updateCargo(actor: THREE.Group, current: THREE.Group | null, previousItem: string | null,
    itemId: string | null): THREE.Group | null {
    if (itemId === previousItem) return current;
    if (current) {
      actor.remove(current);
      disposeGroupContents(current);
    }
    if (!itemId) return null;
    const cargo = createCarriedAsset(itemId);
    cargo.position.set(0, 0.84, 0.44);
    cargo.scale.setScalar(0.65);
    this.cargoAppear.set(cargo, 0);
    actor.add(cargo);
    return cargo;
  }

  private updateStock(id: string, lots: VisualLot[], capacity: number, maxVisible: number): void {
    const fixture = this.fixtureMeshes.get(id)?.body;
    if (!fixture) return;
    const valid = lots.filter((lot) => lot.quantity > 0);
    const total = valid.reduce((sum, lot) => sum + lot.quantity, 0);
    const visible = total === 0 ? 0 : Math.max(1, Math.min(maxVisible,
      Math.ceil(total / Math.max(1, capacity) * maxVisible)));
    const signature = `${visible}:${valid.map((lot) => `${lot.itemId}:${lot.quantity}`).join('|')}`;
    if (this.stockSignatures.get(id) === signature) return;
    const old = fixture.getObjectByName('physical-stock');
    if (old instanceof THREE.Group) {
      fixture.remove(old);
      disposeGroupContents(old);
    }
    const stock = new THREE.Group();
    stock.name = 'physical-stock';
    const expanded = valid.flatMap((lot) => Array(Math.min(lot.quantity, maxVisible)).fill(lot.itemId) as string[]);
    for (let index = 0; index < visible; index += 1) {
      const item = createProductAsset(expanded[index % expanded.length]);
      if (id === 'fixture.sales_shelf') {
        item.position.set(0.13, 0.62 + Math.floor(index / 4) * 0.42, (index % 4 - 1.5) * 0.22);
        item.scale.setScalar(0.85);
      } else if (id === 'station.bottler') {
        item.position.set(0.06, 0.89, (index - 1) * 0.26);
        item.scale.setScalar(0.8);
      } else {
        item.position.set(0.58, 0.26, (index - 1) * 0.23);
      }
      stock.add(item);
    }
    fixture.add(stock);
    this.stockSignatures.set(id, signature);
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
    const now = performance.now();
    const deltaSeconds = Math.min((now - this.lastRenderTime) / 1000, 0.05);
    this.lastRenderTime = now;
    this.playerRig.advance(deltaSeconds);
    this.workerRig.advance(deltaSeconds);
    this.customerRig.advance(deltaSeconds);
    for (const cargo of [this.playerCargo, this.workerCargo]) {
      if (!cargo) continue;
      const progress = Math.min(1, (this.cargoAppear.get(cargo) ?? 1) + deltaSeconds / 0.22);
      this.cargoAppear.set(cargo, progress);
      cargo.scale.setScalar(0.65 + 0.35 * progress);
      cargo.position.y = 0.69 + 0.15 * progress;
    }
    this.renderer.render(this.scene, this.portraitCamera.camera);
  }

  public destroy(): void {
    this.unsubscribeWorldLayout?.();
    this.unsubscribeWorldLayout = null;
    disposeGroupContents(this.moduleGeometryRoot);
    this.tileTexture.dispose();
    for (const meshes of this.fixtureMeshes.values()) {
      disposeGroupContents(meshes.body);
      meshes.service.geometry.dispose();
      (meshes.service.material as THREE.Material).dispose();
    }
    this.fixtureMeshes.clear();
    if (this.playerCargo) disposeGroupContents(this.playerCargo);
    if (this.workerCargo) disposeGroupContents(this.workerCargo);
    this.playerRig.dispose();
    this.workerRig.dispose();
    this.customerRig.dispose();
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

function createTileTexture(): THREE.DataTexture {
  const size = 16;
  const pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) {
    const grout = x === 0 || y === 0;
    const offset = (y * size + x) * 4;
    pixels.set(grout ? [202, 193, 178, 255] : [216, 208, 192, 255], offset);
  }
  const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  return texture;
}
