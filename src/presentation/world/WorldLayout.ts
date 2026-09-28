// Orbit Market - Data-driven world modules and walkability
// Coordinates follow DUNYA_YERLESIM_PLANI.md §§1-4, 9 and 13.

export interface BoundingBox2D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface WorldFixture {
  id: string;
  name: string;
  bounds: BoundingBox2D;
  serviceCell: { x: number; z: number };
  color: string;
}

export interface ModuleDoorway {
  side: 'north' | 'east' | 'south' | 'west';
  center: number;
  width: number;
  connectsTo: string;
}

export interface WorldModule {
  id: string;
  label: string;
  type: string;
  phase: 'P0' | 'A2' | 'A3' | 'A4' | 'A5';
  status: 'active' | 'reserved';
  bounds: BoundingBox2D;
  doorways: ModuleDoorway[];
  enclosure?: 'closed' | 'open';
  surfaceColor?: string;
  fixtures?: WorldFixture[];
  costCredits?: number;
}

const moduleBounds = (row: number, column: number): BoundingBox2D => {
  const legacyMinX = 12 + column * 6;
  const legacyMinZ = 4 + row * 6;
  return {
    minX: legacyMinX * 2 - 1,
    maxX: legacyMinX * 2 + 11,
    minZ: legacyMinZ * 2 - 1,
    maxZ: legacyMinZ * 2 + 11,
  };
};

const moduleCatalog: Array<Omit<WorldModule, 'bounds' | 'doorways'> & {
  row: number; column: number; doorways?: ModuleDoorway[];
}> = [
  { id: 'R0-C0', label: 'Topluluk', type: 'community', phase: 'A4', status: 'reserved', row: 0, column: 0 },
  { id: 'R0-C1', label: 'Soyunma', type: 'locker', phase: 'A4', status: 'reserved', row: 0, column: 1 },
  { id: 'R0-C2', label: 'Rezerv', type: 'expansion', phase: 'A5', status: 'reserved', row: 0, column: 2 },
  { id: 'R0-C3', label: 'Rezerv', type: 'expansion', phase: 'A5', status: 'reserved', row: 0, column: 3 },
  { id: 'R1-C0', label: 'Sera', type: 'greenhouse', phase: 'A3', status: 'reserved', row: 1, column: 0 },
  { id: 'R1-C1', label: 'Enerji', type: 'energy', phase: 'A3', status: 'reserved', row: 1, column: 1, costCredits: 200,
    fixtures: [
      { id: 'station.generator', name: 'Jeneratör', bounds: { minX: 40, maxX: 42, minZ: 25, maxZ: 27 }, serviceCell: { x: 41, z: 28 }, color: '#FF3333' }
    ]
  },
  { id: 'R1-C2', label: 'Eğitim', type: 'training', phase: 'A4', status: 'reserved', row: 1, column: 2 },
  { id: 'R1-C3', label: 'Yönetim', type: 'management', phase: 'A3', status: 'reserved', row: 1, column: 3, costCredits: 300 },
  { id: 'R2-C0', label: 'İşleme ve üretim', type: 'production', phase: 'A2', status: 'reserved', row: 2, column: 0, costCredits: 50,
    fixtures: [
      { id: 'source.cow_dairy', name: 'Mandıra', bounds: { minX: 25, maxX: 27, minZ: 34, maxZ: 36 }, serviceCell: { x: 26, z: 37 }, color: '#FFFFFF' },
      { id: 'station.stone_oven', name: 'Taş Fırın', bounds: { minX: 30, maxX: 31, minZ: 34, maxZ: 36 }, serviceCell: { x: 30, z: 37 }, color: '#888888' }
    ]
  },
  { id: 'R2-C1', label: 'Dinlenme', type: 'rest', phase: 'A2', status: 'reserved', row: 2, column: 1, costCredits: 30,
    fixtures: [
      { id: 'fixture.rest_chair', name: 'Mola Köşesi', bounds: { minX: 40, maxX: 42, minZ: 35, maxZ: 37 }, serviceCell: { x: 41, z: 38 }, color: '#44AAFF' }
    ]
  },
  { id: 'R2-C2', label: 'Soğuk depo', type: 'cold-storage', phase: 'A3', status: 'reserved', row: 2, column: 2, costCredits: 250,
    fixtures: [
      { id: 'station.fridge', name: 'Büyük Dolap', bounds: { minX: 50, maxX: 53, minZ: 35, maxZ: 37 }, serviceCell: { x: 51, z: 38 }, color: '#33AAFF' }
    ]
  },
  { id: 'R2-C3', label: 'Bakım', type: 'maintenance', phase: 'A3', status: 'reserved', row: 2, column: 3, costCredits: 150,
    fixtures: [
      { id: 'station.workbench', name: 'Bakım Tezgahı', bounds: { minX: 63, maxX: 65, minZ: 35, maxZ: 36 }, serviceCell: { x: 64, z: 37 }, color: '#FFAA33' }
    ]
  },
  { id: 'R3-C0', label: 'Satış', type: 'sales', phase: 'P0', status: 'active', row: 3, column: 0,
    doorways: [
      { side: 'west', center: 49, width: 4, connectsTo: 'garden.main' },
      { side: 'south', center: 29, width: 4, connectsTo: 'entrance.south' },
    ] },
  { id: 'R3-C1', label: 'Kuru depo', type: 'dry-storage', phase: 'A2', status: 'reserved', row: 3, column: 1, costCredits: 200 },
  { id: 'R3-C2', label: 'Mal kabul', type: 'receiving', phase: 'A2', status: 'reserved', row: 3, column: 2, costCredits: 100 },
  { id: 'R3-C3', label: 'Servis avlusu', type: 'service-yard', phase: 'A2', status: 'reserved', row: 3, column: 3, costCredits: 150 },
];

const createCatalogModule = (item: typeof moduleCatalog[number]): WorldModule => ({
  id: item.id,
  label: item.label,
  type: item.type,
  phase: item.phase,
  status: item.status,
  bounds: moduleBounds(item.row, item.column),
  doorways: structuredClone(item.doorways ?? []),
  costCredits: item.costCredits,
});

export class WorldLayout {
  public static readonly WORLD_BOUNDS: BoundingBox2D = { minX: 0, maxX: 100, minZ: 0, maxZ: 100 };
  // 12 m is the standard plug-in module; compact modules may never go below 8 m.
  public static readonly MODULE_SIZE = 12;
  public static readonly MINIMUM_MODULE_SIZE = 8;
  public static readonly MODULE_SIZE_INCREMENT = 4;
  public static readonly MINIMUM_PASSAGE_WIDTH = 4;
  public static readonly MODULES: WorldModule[] = moduleCatalog.map(createCatalogModule);
  private static readonly changeListeners = new Set<() => void>();

  // 12×12 satış modülü, ölçeği iki katına çıkarılmış eski paftanın R3-C0 modülüdür.
  public static readonly SALES_MODULE_ID = 'R3-C0';
  public static readonly ROOM_BOUNDS = this.getModule(this.SALES_MODULE_ID)!.bounds;
  public static readonly ROOM_CENTER = { x: 29, z: 49 };
  public static readonly PLAYER_SPAWN = { ...this.ROOM_CENTER };
  public static readonly DEFAULT_SHELF_CELL = { x: 24, z: 52 };

  // Bahçe, koridor ve güney eşiği iki kat ölçeklenmiştir; bunlar modül kimliklerinden bağımsız alanlardır.
  public static readonly GARDEN_BOUNDS: BoundingBox2D = { minX: 7, maxX: 19, minZ: 39, maxZ: 55 };
  public static readonly WEST_CORRIDOR: BoundingBox2D = { minX: 19, maxX: 25, minZ: 47, maxZ: 51 };
  public static readonly SOUTH_ENTRANCE: BoundingBox2D = { minX: 27, maxX: 31, minZ: 55, maxZ: 61 };
  public static readonly ACCESS_AREAS = [this.WEST_CORRIDOR, this.SOUTH_ENTRANCE] as const;

  // Physical fixtures retain their catalog footprint. Only room/zone spacing and coordinates are scaled.
  private static readonly BASE_FIXTURES: WorldFixture[] = [
    {
      id: 'source.spring_water', name: 'Memba Çeşmesi',
      bounds: { minX: 10, maxX: 12, minZ: 42, maxZ: 44 },
      serviceCell: { x: 14, z: 43 }, color: '#35D9E6',
    },
    {
      id: 'source.crop_plot', name: 'Domates Yatağı',
      bounds: { minX: 10, maxX: 12, minZ: 50, maxZ: 52 },
      serviceCell: { x: 14, z: 51 }, color: '#FF5733',
    },
    {
      id: 'station.bottler', name: 'Şişeleme Tezgâhı',
      bounds: { minX: 24, maxX: 24.8, minZ: 44, maxZ: 45.8 },
      serviceCell: { x: 27, z: 45 }, color: '#FFE156',
    },
    {
      id: 'fixture.sales_shelf', name: 'Satış Rafı',
      bounds: { minX: 24, maxX: 24.8, minZ: 51.6, maxZ: 52.6 },
      serviceCell: { x: 27, z: 52.6 }, color: '#A7EB52',
    },
    {
      id: 'fixture.checkout', name: 'Kasa Masası',
      bounds: { minX: 33, maxX: 33.5, minZ: 44, maxZ: 45 },
      serviceCell: { x: 32, z: 45 }, color: '#F4F0E6',
    },
  ];

  public static get FIXTURES(): WorldFixture[] {
    return [...this.BASE_FIXTURES,
      ...this.MODULES.filter((module) => module.status === 'active')
        .flatMap((module) => module.fixtures ?? [])];
  }

  public static createModule(module: WorldModule): WorldModule {
    return structuredClone(module);
  }

  public static registerModule(module: WorldModule): void {
    validateModule(module);
    if (this.MODULES.some((existing) => existing.id === module.id)) {
      throw new Error(`World module ID already exists: ${module.id}`);
    }
    if (this.MODULES.some((existing) => overlaps(existing.bounds, module.bounds))) {
      throw new Error(`World module overlaps an existing module: ${module.id}`);
    }
    const existingFixtureIds = new Set([
      ...this.BASE_FIXTURES,
      ...this.MODULES.flatMap((existing) => existing.fixtures ?? []),
    ].map((fixture) => fixture.id));
    for (const fixture of module.fixtures ?? []) {
      if (existingFixtureIds.has(fixture.id) || !contains(module.bounds, fixture.bounds.minX, fixture.bounds.minZ) ||
        fixture.bounds.maxX > module.bounds.maxX || fixture.bounds.maxZ > module.bounds.maxZ) {
        throw new Error(`Invalid or duplicate fixture in world module ${module.id}: ${fixture.id}`);
      }
      existingFixtureIds.add(fixture.id);
    }
    this.expandWorldBounds(module.bounds);
    this.MODULES.push(structuredClone(module));
    if (module.status === 'active') this.connectAdjacentModules();
    this.notifyChanged();
  }

  public static activateModule(id: string): void {
    const module = this.getModule(id);
    if (!module) throw new Error(`World module does not exist: ${id}`);
    if (module.status === 'active') return;
    module.status = 'active';
    this.connectAdjacentModules();
    this.notifyChanged();
  }

  public static restoreActiveModules(ids: readonly string[]): void {
    const uniqueIds = new Set(ids);
    if (uniqueIds.size !== ids.length || ids.some((id) => typeof id !== 'string' || !id.trim())) {
      throw new Error('Saved active world modules must use unique stable IDs');
    }
    const modules = ids.map((id) => this.getModule(id));
    if (modules.some((module) => !module)) {
      const missingId = ids[modules.findIndex((module) => !module)];
      throw new Error(`Saved world module is not present in this content version: ${missingId}`);
    }
    let changed = false;
    for (const module of modules) {
      if (module!.status === 'active') continue;
      module!.status = 'active';
      changed = true;
    }
    changed = this.connectAdjacentModules() || changed;
    if (changed) this.notifyChanged();
  }

  public static getActiveModuleIds(): string[] {
    return this.getActiveModules().map((module) => module.id).sort();
  }

  public static subscribe(listener: () => void): () => void {
    this.changeListeners.add(listener);
    return () => this.changeListeners.delete(listener);
  }

  public static getModule(id: string): WorldModule | undefined {
    return this.MODULES.find((module) => module.id === id);
  }

  public static getActiveModules(): WorldModule[] {
    return this.MODULES.filter((module) => module.status === 'active');
  }

  public static getWalkableBounds(): BoundingBox2D {
    const regions = [...this.getActiveModules().map((module) => module.bounds),
      this.GARDEN_BOUNDS, this.WEST_CORRIDOR, this.SOUTH_ENTRANCE];
    return regions.reduce((bounds, region) => ({
      minX: Math.min(bounds.minX, region.minX), maxX: Math.max(bounds.maxX, region.maxX),
      minZ: Math.min(bounds.minZ, region.minZ), maxZ: Math.max(bounds.maxZ, region.maxZ),
    }), { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity });
  }

  public static isWalkable(x: number, z: number): boolean {
    return this.isWalkableWith(this.FIXTURES, x, z);
  }

  public static isWalkableWith(fixtures: readonly WorldFixture[], x: number, z: number): boolean {
    if (!Number.isFinite(x) || !Number.isFinite(z) ||
      x < this.WORLD_BOUNDS.minX || x > this.WORLD_BOUNDS.maxX ||
      z < this.WORLD_BOUNDS.minZ || z > this.WORLD_BOUNDS.maxZ) return false;

    const activeModules = this.getActiveModules();
    const inRoom = activeModules.some((module) => contains(module.bounds, x, z));
    const inGarden = contains(this.GARDEN_BOUNDS, x, z);
    const inCorridor = contains(this.WEST_CORRIDOR, x, z);
    const inSouthEntrance = contains(this.SOUTH_ENTRANCE, x, z);
    if (!inRoom && !inGarden && !inCorridor && !inSouthEntrance) return false;
    if (!canCrossModuleWall(activeModules, x, z)) return false;

    for (const fixture of fixtures) {
      const margin = 0.2;
      if (x >= fixture.bounds.minX - margin && x <= fixture.bounds.maxX + margin &&
        z >= fixture.bounds.minZ - margin && z <= fixture.bounds.maxZ + margin) return false;
    }
    return true;
  }

  private static notifyChanged(): void {
    for (const listener of this.changeListeners) listener();
  }

  private static expandWorldBounds(bounds: BoundingBox2D): void {
    this.WORLD_BOUNDS.minX = Math.min(this.WORLD_BOUNDS.minX, bounds.minX);
    this.WORLD_BOUNDS.maxX = Math.max(this.WORLD_BOUNDS.maxX, bounds.maxX);
    this.WORLD_BOUNDS.minZ = Math.min(this.WORLD_BOUNDS.minZ, bounds.minZ);
    this.WORLD_BOUNDS.maxZ = Math.max(this.WORLD_BOUNDS.maxZ, bounds.maxZ);
  }

  private static connectAdjacentModules(): boolean {
    let changed = false;
    const active = this.getActiveModules();
    for (let left = 0; left < active.length; left += 1) {
      for (let right = left + 1; right < active.length; right += 1) {
        const moduleA = active[left];
        const moduleB = active[right];
        if (moduleA.enclosure === 'open' && moduleB.enclosure === 'open') continue;
        const connection = getAdjacentDoorway(moduleA, moduleB);
        if (!connection) continue;
        const { sideA, sideB, center } = connection;
        const doorA = moduleA.doorways.find((door) => door.side === sideA && door.connectsTo === moduleB.id);
        const doorB = moduleB.doorways.find((door) => door.side === sideB && door.connectsTo === moduleA.id);
        if (doorA && doorB && doorA.center === doorB.center && doorA.width === doorB.width) continue;
        const width = doorA?.width ?? doorB?.width ?? this.MINIMUM_PASSAGE_WIDTH;
        let doorwayCenter = doorA?.center ?? doorB?.center;
        if (doorwayCenter === undefined) {
          const candidateCenters: number[] = [];
          for (let candidate = connection.start + width / 2;
            candidate <= connection.end - width / 2; candidate += width) candidateCenters.push(candidate);
          candidateCenters.sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
          for (const candidate of candidateCenters) {
            if (canPlaceDoor(moduleA, sideA, candidate, width, moduleB.id, connection.start, connection.end) &&
              canPlaceDoor(moduleB, sideB, candidate, width, moduleA.id, connection.start, connection.end)) {
              doorwayCenter = candidate;
              break;
            }
          }
        }
        if (doorwayCenter === undefined ||
          !canPlaceDoor(moduleA, sideA, doorwayCenter, width, moduleB.id, connection.start, connection.end) ||
          !canPlaceDoor(moduleB, sideB, doorwayCenter, width, moduleA.id, connection.start, connection.end)) continue;
        if (!doorA) {
          moduleA.doorways.push({ side: sideA, center: doorwayCenter, width, connectsTo: moduleB.id });
          changed = true;
        }
        if (!doorB) {
          moduleB.doorways.push({ side: sideB, center: doorwayCenter, width, connectsTo: moduleA.id });
          changed = true;
        }
      }
    }
    return changed;
  }
}

function validateModule(module: WorldModule): void {
  if (!module.id.trim() || !module.label.trim() || !module.type.trim()) {
    throw new Error('World modules require stable IDs, labels and types');
  }
  const { minX, maxX, minZ, maxZ } = module.bounds;
  const width = maxX - minX;
  const depth = maxZ - minZ;
  if (![minX, maxX, minZ, maxZ].every(Number.isFinite) ||
    width < WorldLayout.MINIMUM_MODULE_SIZE || depth < WorldLayout.MINIMUM_MODULE_SIZE ||
    width % WorldLayout.MODULE_SIZE_INCREMENT !== 0 || depth % WorldLayout.MODULE_SIZE_INCREMENT !== 0) {
    throw new Error(`World modules must be at least ${WorldLayout.MINIMUM_MODULE_SIZE} m and use ${WorldLayout.MODULE_SIZE_INCREMENT} m increments`);
  }
  for (const door of module.doorways) {
    const axisMin = door.side === 'north' || door.side === 'south' ? minX : minZ;
    const axisMax = door.side === 'north' || door.side === 'south' ? maxX : maxZ;
    if (!door.connectsTo.trim() || !Number.isFinite(door.center) || !Number.isFinite(door.width) ||
      door.width < WorldLayout.MINIMUM_PASSAGE_WIDTH ||
      door.center - door.width / 2 < axisMin || door.center + door.width / 2 > axisMax) {
      throw new Error(`Invalid doorway in world module ${module.id}`);
    }
  }
}

function getAdjacentDoorway(a: WorldModule, b: WorldModule): {
  moduleA: WorldModule; moduleB: WorldModule; sideA: ModuleDoorway['side'];
  sideB: ModuleDoorway['side']; center: number; start: number; end: number;
} | null {
  const epsilon = 0.001;
  const candidates: Array<{
    aSide: ModuleDoorway['side']; bSide: ModuleDoorway['side']; start: number; end: number;
  }> = [];
  if (Math.abs(a.bounds.maxX - b.bounds.minX) < epsilon) {
    candidates.push({ aSide: 'east', bSide: 'west',
      start: Math.max(a.bounds.minZ, b.bounds.minZ), end: Math.min(a.bounds.maxZ, b.bounds.maxZ) });
  } else if (Math.abs(b.bounds.maxX - a.bounds.minX) < epsilon) {
    candidates.push({ aSide: 'west', bSide: 'east',
      start: Math.max(a.bounds.minZ, b.bounds.minZ), end: Math.min(a.bounds.maxZ, b.bounds.maxZ) });
  }
  if (Math.abs(a.bounds.maxZ - b.bounds.minZ) < epsilon) {
    candidates.push({ aSide: 'south', bSide: 'north',
      start: Math.max(a.bounds.minX, b.bounds.minX), end: Math.min(a.bounds.maxX, b.bounds.maxX) });
  } else if (Math.abs(b.bounds.maxZ - a.bounds.minZ) < epsilon) {
    candidates.push({ aSide: 'north', bSide: 'south',
      start: Math.max(a.bounds.minX, b.bounds.minX), end: Math.min(a.bounds.maxX, b.bounds.maxX) });
  }
  const candidate = candidates.find((item) => item.end - item.start >= WorldLayout.MINIMUM_PASSAGE_WIDTH);
  if (!candidate) return null;
  return {
    moduleA: a,
    moduleB: b,
    sideA: candidate.aSide,
    sideB: candidate.bSide,
    center: (candidate.start + candidate.end) / 2,
    start: candidate.start,
    end: candidate.end,
  };
}

function canPlaceDoor(module: WorldModule, side: ModuleDoorway['side'], center: number,
  width: number, connectsTo: string, segmentStart: number, segmentEnd: number): boolean {
  const start = center - width / 2;
  const end = center + width / 2;
  if (width < WorldLayout.MINIMUM_PASSAGE_WIDTH || start < segmentStart || end > segmentEnd) return false;
  return !module.doorways.some((door) => door.side === side && door.connectsTo !== connectsTo &&
    start < door.center + door.width / 2 && end > door.center - door.width / 2);
}

function contains(bounds: BoundingBox2D, x: number, z: number): boolean {
  return x >= bounds.minX && x <= bounds.maxX && z >= bounds.minZ && z <= bounds.maxZ;
}

function overlaps(a: BoundingBox2D, b: BoundingBox2D): boolean {
  return a.minX < b.maxX && a.maxX > b.minX && a.minZ < b.maxZ && a.maxZ > b.minZ;
}

function canCrossModuleWall(modules: readonly WorldModule[], x: number, z: number): boolean {
  const epsilon = 0.001;
  for (let left = 0; left < modules.length; left += 1) {
    const a = modules[left];
    for (let right = left + 1; right < modules.length; right += 1) {
      const b = modules[right];
      if (a.enclosure === 'open' && b.enclosure === 'open') continue;
      if (Math.abs(a.bounds.maxX - b.bounds.minX) < epsilon && Math.abs(x - a.bounds.maxX) < 0.25 &&
        z >= Math.max(a.bounds.minZ, b.bounds.minZ) && z <= Math.min(a.bounds.maxZ, b.bounds.maxZ) &&
        !hasMatchingDoor(a, b, 'east', 'west', z)) return false;
      if (Math.abs(b.bounds.maxX - a.bounds.minX) < epsilon && Math.abs(x - b.bounds.maxX) < 0.25 &&
        z >= Math.max(a.bounds.minZ, b.bounds.minZ) && z <= Math.min(a.bounds.maxZ, b.bounds.maxZ) &&
        !hasMatchingDoor(b, a, 'east', 'west', z)) return false;
      if (Math.abs(a.bounds.maxZ - b.bounds.minZ) < epsilon && Math.abs(z - a.bounds.maxZ) < 0.25 &&
        x >= Math.max(a.bounds.minX, b.bounds.minX) && x <= Math.min(a.bounds.maxX, b.bounds.maxX) &&
        !hasMatchingDoor(a, b, 'south', 'north', x)) return false;
      if (Math.abs(b.bounds.maxZ - a.bounds.minZ) < epsilon && Math.abs(z - b.bounds.maxZ) < 0.25 &&
        x >= Math.max(a.bounds.minX, b.bounds.minX) && x <= Math.min(a.bounds.maxX, b.bounds.maxX) &&
        !hasMatchingDoor(b, a, 'south', 'north', x)) return false;
    }
  }
  return true;
}

function hasMatchingDoor(a: WorldModule, b: WorldModule, sideA: ModuleDoorway['side'],
  sideB: ModuleDoorway['side'], position: number): boolean {
  const aDoor = a.doorways.find((door) => door.side === sideA && door.connectsTo === b.id &&
    Math.abs(position - door.center) <= door.width / 2);
  const bDoor = b.doorways.find((door) => door.side === sideB && door.connectsTo === a.id &&
    Math.abs(position - door.center) <= door.width / 2);
  return Boolean(aDoor && bDoor);
}
