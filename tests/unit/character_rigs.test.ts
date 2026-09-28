import { describe, expect, it } from 'vitest';
import { createArticulatedCharacter, type CharacterRole } from '../../src/presentation/world/CharacterRigs';

describe('reference-inspired character walk rigs', () => {
  it.each(['player', 'worker', 'customer'] satisfies CharacterRole[])(
    '%s walks on movement and returns to an idle pose when stopped', (role) => {
      const rig = createArticulatedCharacter(role);
      const leftLeg = rig.root.getObjectByName('leg.left')!;
      const rightLeg = rig.root.getObjectByName('leg.right')!;

      rig.setPosition(10, 10);
      rig.advance(0.05);
      expect(leftLeg.rotation.x).toBeCloseTo(0);
      expect(rightLeg.rotation.x).toBeCloseTo(0);

      rig.setPosition(10.2, 10);
      rig.advance(0.025);
      expect(leftLeg.rotation.x).toBeGreaterThan(0);
      expect(rightLeg.rotation.x).toBeLessThan(0);
      expect(rig.root.position.y).toBeGreaterThan(0);

      for (let frame = 0; frame < 5; frame += 1) rig.advance(0.05);
      expect(leftLeg.rotation.x).toBeCloseTo(0);
      expect(rightLeg.rotation.x).toBeCloseTo(0);
      expect(rig.root.position.y).toBe(0);
      rig.dispose();
    },
  );

  it('keeps the carrying arm steady while the free arm swings', () => {
    const rig = createArticulatedCharacter('worker');
    const leftArm = rig.root.getObjectByName('arm.left')!;
    const rightArm = rig.root.getObjectByName('arm.right')!;

    rig.setPosition(0, 0);
    rig.setPosition(0.2, 0);
    rig.advance(0.025);

    expect(leftArm.rotation.x).not.toBe(0);
    expect(rightArm.rotation.x).toBe(0);
    rig.dispose();
  });
});
