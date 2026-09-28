import type { CommandDispatcher } from './commands';
import { InventoryManager, isSameLocation } from '../domain/inventory/InventoryManager';
import type { ItemId, StockLocation, WorldPosition } from '../domain/types';
import type { BoundingBox2D } from '../presentation/world/WorldLayout';

export interface ShelfWorkerTask {
  id: string;
  reservationId: string;
  source: StockLocation;
  target: StockLocation;
  sourcePosition: WorldPosition;
  targetPosition: WorldPosition;
  itemId: ItemId;
  quantity: number;
  phase: 'toSource' | 'toTarget';
}

export interface ShelfWorkerSnapshot {
  id: string;
  position: WorldPosition;
  task: ShelfWorkerTask | null;
  blockedReason: string | null;
  stamina: number;
}

/** One P0 shelf carrier. All stock moves go through Application commands. */
export class ShelfWorkerManager {
  private state: ShelfWorkerSnapshot;
  private readonly inventory: InventoryManager;
  private readonly dispatcher: CommandDispatcher;
  private readonly walkable: (x: number, z: number) => boolean;
  private readonly getNavigationBounds: () => BoundingBox2D;

  constructor(inventory: InventoryManager, dispatcher: CommandDispatcher,
    walkable: (x: number, z: number) => boolean,
    start: WorldPosition, getNavigationBounds: () => BoundingBox2D,
    id = 'worker.shelf.1') {
    this.inventory = inventory;
    this.dispatcher = dispatcher;
    this.walkable = walkable;
    this.getNavigationBounds = getNavigationBounds;
    this.state = { id, position: { ...start }, task: null, blockedReason: null, stamina: 100 };
  }

  serialize(): ShelfWorkerSnapshot {
    return structuredClone(this.state);
  }

  restore(snapshot: ShelfWorkerSnapshot): void {
    if (snapshot.id !== this.state.id || !Number.isFinite(snapshot.position?.x) ||
      !Number.isFinite(snapshot.position?.z)) throw new Error('Invalid worker save');
    if (snapshot.task) {
      const reservation = this.inventory.getReservation(snapshot.task.reservationId);
      const workerLocation = this.workerLocation();
      const expectedSource = snapshot.task.phase === 'toSource' ? snapshot.task.source : workerLocation;
      if (!reservation || reservation.status !== 'ACTIVE' || reservation.ownerId !== this.state.id ||
        !isSameLocation(reservation.source, expectedSource) ||
        !isSameLocation(reservation.target, snapshot.task.target) ||
        reservation.itemId !== snapshot.task.itemId || reservation.quantity !== snapshot.task.quantity ||
        (snapshot.task.phase === 'toTarget' &&
          this.inventory.getPhysicalQuantity(workerLocation, snapshot.task.itemId) < snapshot.task.quantity)) {
        throw new Error('Worker load or reservation could not be verified');
      }
    }
    this.state = structuredClone(snapshot);
  }

  async delegate(input: Omit<ShelfWorkerTask, 'id' | 'reservationId' | 'phase'>, tick: number): Promise<void> {
    if (this.state.task) throw new Error('Görevli zaten bir ikmal işi taşıyor');
    if (this.state.stamina < 30) throw new Error('Görevli yorgun, mola veriyor');
    if (!Number.isSafeInteger(tick) || tick < 0 || input.quantity < 1 || !Number.isInteger(input.quantity)) {
      throw new Error('Geçersiz görev zamanı veya miktarı');
    }
    if (input.target.kind !== 'shelf') throw new Error('P0 görevlisi yalnız raf ikmali yapar');
    const id = `worker-restock-${this.state.id}-${tick}`;
    const task: ShelfWorkerTask = { ...structuredClone(input), id, reservationId: `${id}:reserve`, phase: 'toSource' };
    this.state.task = task;
    this.state.blockedReason = null;
    try {
      await this.dispatcher.executeAsync({ type: 'RESERVE_STOCK', transactionId: task.reservationId,
        reservationId: task.reservationId, ownerId: this.state.id, timestampTick: tick,
        source: task.source, target: task.target, itemId: task.itemId, quantity: task.quantity });
    } catch (error) {
      this.state.task = null;
      throw error;
    }
  }

  /** Synchronous walking; returns a Promise only for a critical stock transition. */
  step(tick: number): Promise<void> | null {
    const task = this.state.task;
    if (!task) {
      if (this.state.stamina < 100) {
        const restPosition = { x: 41, z: 38 };
        if (!this.walkable(restPosition.x, restPosition.z)) {
          this.state.stamina = Math.min(100, this.state.stamina + 0.1);
        } else {
          const path = findPath(this.state.position, restPosition, this.walkable, this.getNavigationBounds());
          if (!path) {
            this.state.stamina = Math.min(100, this.state.stamina + 0.1);
          } else {
            const distToRest = Math.hypot(restPosition.x - this.state.position.x, restPosition.z - this.state.position.z);
            if (distToRest < 0.5) {
              this.state.stamina = Math.min(100, this.state.stamina + 0.5);
            } else {
              const next = path[0] ?? restPosition;
              const dx = next.x - this.state.position.x;
              const dz = next.z - this.state.position.z;
              const distance = Math.hypot(dx, dz);
              if (distance > 0.01) {
                const distanceThisTick = Math.min(0.15, distance);
                this.state.position.x += dx / distance * distanceThisTick;
                this.state.position.z += dz / distance * distanceThisTick;
              }
            }
          }
        }
      }
      return null;
    }
    const destination = task.phase === 'toSource' ? task.sourcePosition : task.targetPosition;
    if (!this.walkable(destination.x, destination.z)) {
      this.state.blockedReason = 'Hedef servis hücresine erişilemiyor';
      return null;
    }
    const path = findPath(this.state.position, destination, this.walkable, this.getNavigationBounds());
    if (!path) {
      this.state.blockedReason = 'Rota kapalı; yük ve rezervasyon korunuyor';
      return null;
    }
    this.state.blockedReason = null;
    const next = path[0] ?? destination;
    const dx = next.x - this.state.position.x;
    const dz = next.z - this.state.position.z;
    const distance = Math.hypot(dx, dz);
    if (distance > 0.01) {
      const distanceThisTick = Math.min(0.15, distance);
      this.state.position.x += dx / distance * distanceThisTick;
      this.state.position.z += dz / distance * distanceThisTick;
      this.state.stamina = Math.max(0, this.state.stamina - 0.05);
    }
    if (Math.hypot(destination.x - this.state.position.x, destination.z - this.state.position.z) > 0.3) return null;

    const before = this.serialize();
    if (task.phase === 'toSource') {
      task.phase = 'toTarget';
      return this.dispatcher.executeAsync({ type: 'TRANSFER_STOCK', transactionId: `${task.id}:pickup`,
        timestampTick: tick, source: task.source, target: this.workerLocation(), itemId: task.itemId,
        quantity: task.quantity, reservationId: task.reservationId }).then(() => undefined, (error: unknown) => {
        this.state = before;
        throw error;
      });
    }
    this.state.task = null;
    return this.dispatcher.executeAsync({ type: 'TRANSFER_STOCK', transactionId: `${task.id}:deliver`,
      timestampTick: tick, source: this.workerLocation(), target: task.target, itemId: task.itemId,
      quantity: task.quantity, reservationId: task.reservationId }).then(() => undefined, (error: unknown) => {
      this.state = before;
      throw error;
    });
  }

  private workerLocation(): StockLocation {
    return { kind: 'worker', ownerId: this.state.id };
  }
}

function findPath(from: WorldPosition, to: WorldPosition,
  walkable: (x: number, z: number) => boolean, bounds: BoundingBox2D): WorldPosition[] | null {
  const snap = (value: number) => Math.round(value * 2) / 2;
  const start = { x: snap(from.x), z: snap(from.z) };
  const goal = { x: snap(to.x), z: snap(to.z) };
  const key = (point: WorldPosition) => `${point.x}:${point.z}`;
  const visited = new Map<string, { point: WorldPosition; previous: string | null }>();
  const queue: WorldPosition[] = [start];
  visited.set(key(start), { point: start, previous: null });
  const maxNodes = Math.ceil((bounds.maxX - bounds.minX) * 2 + 1) *
    Math.ceil((bounds.maxZ - bounds.minZ) * 2 + 1);
  for (let index = 0; index < queue.length && index < maxNodes; index += 1) {
    const point = queue[index];
    if (key(point) === key(goal)) {
      const path: WorldPosition[] = [];
      let cursor: string | null = key(point);
      while (cursor && cursor !== key(start)) {
        const entry: { point: WorldPosition; previous: string | null } = visited.get(cursor)!;
        path.unshift(entry.point);
        cursor = entry.previous;
      }
      path.push(to);
      return path;
    }
    for (const next of [
      { x: point.x + 0.5, z: point.z }, { x: point.x - 0.5, z: point.z },
      { x: point.x, z: point.z + 0.5 }, { x: point.x, z: point.z - 0.5 },
    ]) {
      if (next.x < bounds.minX || next.x > bounds.maxX || next.z < bounds.minZ || next.z > bounds.maxZ ||
        visited.has(key(next)) || !walkable(next.x, next.z)) continue;
      visited.set(key(next), { point: next, previous: key(point) });
      queue.push(next);
    }
  }
  return null;
}
