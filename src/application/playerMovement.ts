import { TICK_DURATION_MS } from '../domain/constants';
import type { WorldPosition } from '../domain/types';

export interface PlayerMovementResult {
  position: WorldPosition;
  reachedTarget: boolean;
  rotation: number | null;
}

/** One logical movement step; render timing never changes the resulting position. */
export function stepPlayerMovement(
  position: WorldPosition,
  target: WorldPosition | null,
  joystick: WorldPosition,
  isWalkable: (x: number, z: number) => boolean,
  speedMetersPerSecond = 4
): PlayerMovementResult {
  const maxStep = speedMetersPerSecond * TICK_DURATION_MS / 1000;
  let moveX = 0;
  let moveZ = 0;
  let reachedTarget = false;

  if (joystick.x !== 0 || joystick.z !== 0) {
    moveX = joystick.x * maxStep;
    moveZ = joystick.z * maxStep;
  } else if (target) {
    const dx = target.x - position.x;
    const dz = target.z - position.z;
    const distance = Math.hypot(dx, dz);
    if (distance <= 0.1) {
      reachedTarget = true;
    } else {
      const step = Math.min(distance, maxStep);
      moveX = dx / distance * step;
      moveZ = dz / distance * step;
    }
  }

  const next = { ...position };
  if (moveX !== 0 && isWalkable(next.x + moveX, next.z)) {
    next.x += moveX;
  }
  if (moveZ !== 0 && isWalkable(next.x, next.z + moveZ)) {
    next.z += moveZ;
  }
  if (target && Math.hypot(target.x - next.x, target.z - next.z) <= 0.1) {
    reachedTarget = true;
  }

  return {
    position: next,
    reachedTarget,
    rotation: moveX !== 0 || moveZ !== 0 ? Math.atan2(moveX, moveZ) : null,
  };
}
