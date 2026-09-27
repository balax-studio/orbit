import { describe, expect, it } from 'vitest';
import { stepPlayerMovement } from '../../src/application/playerMovement';
import { SimulationClock } from '../../src/domain/time/clock';

describe('P0-02: oyuncu hareketi sabit simülasyon adımında', () => {
  function runForOneSecond(frames: number) {
    const clock = new SimulationClock();
    let position = { x: 0, z: 0 };
    for (let frame = 0; frame < frames; frame++) {
      clock.update(1000 / frames, () => {
        position = stepPlayerMovement(position, null, { x: 1, z: 0 }, () => true).position;
      });
    }
    return { position, tick: clock.getTick() };
  }

  it('30 ve 60 FPS aynı 10 tick ve aynı konumu üretir', () => {
    const at30Fps = runForOneSecond(30);
    const at60Fps = runForOneSecond(60);
    expect(at30Fps.tick).toBe(10);
    expect(at60Fps).toEqual(at30Fps);
    expect(at30Fps.position.x).toBeCloseTo(4);
  });

  it('duraklatmada geçen süre hareket üretmez', () => {
    const clock = new SimulationClock();
    let position = { x: 0, z: 0 };
    const move = () => {
      position = stepPlayerMovement(position, null, { x: 1, z: 0 }, () => true).position;
    };
    clock.update(100, move);
    clock.pause();
    clock.update(1000, move);
    expect(position.x).toBeCloseTo(0.4);
    clock.resume();
    clock.update(100, move);
    expect(position.x).toBeCloseTo(0.8);
  });
});
