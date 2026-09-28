import { WorldLayout, type WorldFixture } from '../presentation/world/WorldLayout';

export interface PlacementSnapshot {
  shelfCell: { x: number; z: number };
  shelfRoomId?: string;
  committedTransactions: string[];
}

export interface PlacementPreview {
  valid: boolean;
  reasons: string[];
  shelfCell: { x: number; z: number };
}

const DEFAULT_CELL = WorldLayout.DEFAULT_SHELF_CELL;
const SERVICE_IDS = ['source.spring_water', 'source.crop_plot', 'station.bottler',
  'fixture.sales_shelf', 'fixture.checkout'] as const;

/** P0 relocation of the existing sales shelf; no new item or price is created. */
export class PlacementService {
  private state: PlacementSnapshot = {
    shelfCell: { ...DEFAULT_CELL }, shelfRoomId: WorldLayout.SALES_MODULE_ID, committedTransactions: [],
  };

  serialize(): PlacementSnapshot {
    return structuredClone(this.state);
  }

  restore(snapshot: PlacementSnapshot): void {
    if (!Array.isArray(snapshot.committedTransactions) ||
      snapshot.committedTransactions.some((id) => typeof id !== 'string' || !id.trim())) {
      throw new Error('Invalid placement transaction history');
    }
    const shelfRoomId = snapshot.shelfRoomId ?? WorldLayout.SALES_MODULE_ID;
    const preview = this.preview(snapshot.shelfCell, [], shelfRoomId);
    if (!preview.valid) throw new Error(`Saved placement is inaccessible: ${preview.reasons.join('; ')}`);
    this.state = { ...structuredClone(snapshot), shelfRoomId };
  }

  getFixtures(cell = this.state.shelfCell): WorldFixture[] {
    const dx = cell.x - DEFAULT_CELL.x;
    const dz = cell.z - DEFAULT_CELL.z;
    return WorldLayout.FIXTURES.map((fixture) => fixture.id === 'fixture.sales_shelf'
      ? { ...fixture,
        bounds: { minX: fixture.bounds.minX + dx, maxX: fixture.bounds.maxX + dx,
          minZ: fixture.bounds.minZ + dz, maxZ: fixture.bounds.maxZ + dz },
        serviceCell: { x: fixture.serviceCell.x + dx, z: fixture.serviceCell.z + dz } }
      : fixture);
  }

  isWalkable(x: number, z: number): boolean {
    return WorldLayout.isWalkableWith(this.getFixtures(), x, z);
  }

  preview(cell: { x: number; z: number }, actors: Array<{ x: number; z: number }> = [],
    roomId = this.state.shelfRoomId ?? WorldLayout.SALES_MODULE_ID): PlacementPreview {
    const reasons: string[] = [];
    if (!Number.isInteger(cell?.x) || !Number.isInteger(cell?.z)) {
      return { valid: false, reasons: ['Raf 1 m ızgara hücresine oturmalı'], shelfCell: cell };
    }
    const room = WorldLayout.getModule(roomId);
    if (!room || room.status !== 'active') {
      return { valid: false, reasons: ['Raf yalnız açık bir oda modülüne yerleştirilebilir'], shelfCell: { ...cell } };
    }
    const fixtures = this.getFixtures(cell);
    const shelf = fixtures.find((fixture) => fixture.id === 'fixture.sales_shelf')!;
    if (shelf.bounds.minX < room.bounds.minX || shelf.bounds.maxX > room.bounds.maxX ||
      shelf.bounds.minZ < room.bounds.minZ || shelf.bounds.maxZ > room.bounds.maxZ) {
      reasons.push(`Raf ${room.label.toLowerCase()} odası sınırını aşıyor`);
    }
    if (WorldLayout.ACCESS_AREAS.some((area) => overlaps(shelf.bounds, area))) {
      reasons.push('Ana koridor veya kapı geçişi kapanıyor');
    }
    for (const fixture of fixtures) {
      if (fixture.id === shelf.id) continue;
      if (shelf.bounds.minX < fixture.bounds.maxX && shelf.bounds.maxX > fixture.bounds.minX &&
        shelf.bounds.minZ < fixture.bounds.maxZ && shelf.bounds.maxZ > fixture.bounds.minZ) {
        reasons.push(`${fixture.name} ile footprint çakışıyor`);
      }
    }
    const walkable = (x: number, z: number) => WorldLayout.isWalkableWith(fixtures, x, z);
    for (const fixture of fixtures) {
      if (!walkable(fixture.serviceCell.x, fixture.serviceCell.z)) {
        reasons.push(`${fixture.name} servis hücresi kapalı`);
      }
    }
    for (const actor of actors) {
      if (!walkable(actor.x, actor.z)) reasons.push('Oyuncu veya görevli yeni engelin içinde kalıyor');
    }
    if (reasons.length === 0) {
      const entrance = { x: (WorldLayout.SOUTH_ENTRANCE.minX + WorldLayout.SOUTH_ENTRANCE.maxX) / 2,
        z: WorldLayout.SOUTH_ENTRANCE.maxZ - 1 };
      for (const actor of actors) {
        if (!hasRoute(actor, entrance, walkable)) {
          reasons.push('Oyuncu veya görevli kapı ve servis yoluna erişemiyor');
        }
      }
      for (const id of SERVICE_IDS) {
        const service = fixtures.find((fixture) => fixture.id === id)!.serviceCell;
        if (!hasRoute(entrance, service, walkable)) reasons.push(`${id} kapıdan erişilemiyor`);
      }
    }
    return { valid: reasons.length === 0, reasons, shelfCell: { ...cell } };
  }

  async moveShelf(input: { transactionId: string; cell: { x: number; z: number };
    actors?: Array<{ x: number; z: number }>; roomId?: string },
    persist: (transactionId: string) => Promise<void>): Promise<{ duplicate: boolean }> {
    if (!input.transactionId.trim()) throw new Error('Placement transaction ID is required');
    if (this.state.committedTransactions.includes(input.transactionId)) return { duplicate: true };
    const shelfRoomId = input.roomId ?? this.state.shelfRoomId ?? WorldLayout.SALES_MODULE_ID;
    const preview = this.preview(input.cell, input.actors, shelfRoomId);
    if (!preview.valid) throw new Error(preview.reasons.join('; '));
    const before = this.serialize();
    this.state.shelfCell = { ...input.cell };
    this.state.shelfRoomId = shelfRoomId;
    this.state.committedTransactions.push(input.transactionId);
    try {
      await persist(input.transactionId);
      return { duplicate: false };
    } catch (error) {
      this.state = before;
      throw error;
    }
  }
}

function hasRoute(from: { x: number; z: number }, to: { x: number; z: number },
  walkable: (x: number, z: number) => boolean): boolean {
  const snap = (value: number) => Math.round(value * 2) / 2;
  const start = { x: snap(from.x), z: snap(from.z) };
  const goal = { x: snap(to.x), z: snap(to.z) };
  const key = (x: number, z: number) => `${x}:${z}`;
  const bounds = WorldLayout.getWalkableBounds();
  const maxNodes = Math.ceil((bounds.maxX - bounds.minX) * 2 + 1) *
    Math.ceil((bounds.maxZ - bounds.minZ) * 2 + 1);
  const seen = new Set([key(start.x, start.z)]);
  const queue = [start];
  for (let i = 0; i < queue.length && i < maxNodes; i += 1) {
    const current = queue[i];
    if (current.x === goal.x && current.z === goal.z) return true;
    for (const next of [
      { x: current.x + 0.5, z: current.z }, { x: current.x - 0.5, z: current.z },
      { x: current.x, z: current.z + 0.5 }, { x: current.x, z: current.z - 0.5 },
    ]) {
      if (next.x < bounds.minX || next.x > bounds.maxX || next.z < bounds.minZ || next.z > bounds.maxZ ||
        seen.has(key(next.x, next.z)) || !walkable(next.x, next.z)) continue;
      seen.add(key(next.x, next.z));
      queue.push(next);
    }
  }
  return false;
}

function overlaps(a: { minX: number; maxX: number; minZ: number; maxZ: number },
  b: { minX: number; maxX: number; minZ: number; maxZ: number }): boolean {
  return a.minX < b.maxX && a.maxX > b.minX && a.minZ < b.maxZ && a.maxZ > b.minZ;
}
