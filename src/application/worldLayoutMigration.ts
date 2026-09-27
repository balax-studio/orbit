import type { PlacementSnapshot } from './PlacementService';
import type { ShelfWorkerSnapshot } from './ShelfWorkerManager';

export const WORLD_LAYOUT_VERSION = 2;
const LEGACY_TO_EXPANDED_SCALE = 2;

export interface WorldLayoutSavePayload {
  worldLayoutVersion?: number;
  playerPosition: { x: number; z: number };
  worker?: ShelfWorkerSnapshot;
  placement?: PlacementSnapshot;
}

export function migrateWorldSavePayload<T extends WorldLayoutSavePayload>(payload: T): {
  payload: T & { worldLayoutVersion: number };
  migrated: boolean;
} {
  const version = payload.worldLayoutVersion ?? 1;
  if (!Number.isSafeInteger(version) || version < 1 || version > WORLD_LAYOUT_VERSION) {
    throw new Error(`Unsupported world layout version: ${String(version)}`);
  }
  if (version === WORLD_LAYOUT_VERSION) return { payload: payload as T & { worldLayoutVersion: number }, migrated: false };

  const migrated: T & { worldLayoutVersion: number } = {
    ...structuredClone(payload),
    playerPosition: scalePoint(payload.playerPosition),
    worldLayoutVersion: WORLD_LAYOUT_VERSION,
  };
  if (payload.placement) {
    migrated.placement = {
      ...structuredClone(payload.placement),
      shelfCell: {
        x: scaleNumber(payload.placement.shelfCell.x),
        z: scaleNumber(payload.placement.shelfCell.z),
      },
      shelfRoomId: payload.placement.shelfRoomId,
    };
  }
  if (payload.worker) {
    migrated.worker = {
      ...structuredClone(payload.worker),
      position: scalePoint(payload.worker.position),
      task: payload.worker.task ? {
        ...structuredClone(payload.worker.task),
        sourcePosition: scalePoint(payload.worker.task.sourcePosition),
        targetPosition: scalePoint(payload.worker.task.targetPosition),
      } : null,
    };
  }
  return { payload: migrated, migrated: true };
}

function scalePoint(point: { x: number; z: number }): { x: number; z: number } {
  return { x: scaleNumber(point.x), z: scaleNumber(point.z) };
}

function scaleNumber(value: number): number {
  if (!Number.isFinite(value)) throw new Error('Saved world coordinates must be finite');
  return value * LEGACY_TO_EXPANDED_SCALE;
}
