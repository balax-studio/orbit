// Orbit Market - Fixed Step Simulation Clock
// Reference: OYUN_GELISTIRME_DEVIR_DOSYASI.md §60.3, KARARLAR.md D-007, D-022

import { TICK_DURATION_MS, MAX_TICKS_PER_FRAME } from '../constants';

export type TickCallback = (tick: number) => void;

export class SimulationClock {
  private currentTick: number;
  private accumulatorMs: number;
  private isPaused: boolean;

  constructor(initialTick: number = 0) {
    this.currentTick = initialTick;
    this.accumulatorMs = 0;
    this.isPaused = false;
  }

  public getTick(): number {
    return this.currentTick;
  }

  public getElapsedTimeMs(): number {
    return this.currentTick * TICK_DURATION_MS;
  }

  public pause(): void {
    this.isPaused = true;
    // ponytail: pause anında birikmiş artık zaman sıfırlanır, arkada tick birikmez.
    this.accumulatorMs = 0;
  }

  public resume(): void {
    this.isPaused = false;
    this.accumulatorMs = 0;
  }

  public getPaused(): boolean {
    return this.isPaused;
  }

  /**
   * Render döngüsünden çağrılır (requestAnimationFrame / useFrame).
   * @param deltaMs Geçen gerçek milisaniye.
   * @param onTick Sabit 100 ms tick tetiklendiğinde çalışacak fonksiyon.
   * @returns Bu karede çalıştırılan tick adedi (azami MAX_TICKS_PER_FRAME).
   */
  public update(deltaMs: number, onTick: TickCallback): number {
    if (this.isPaused) {
      return 0;
    }

    if (deltaMs <= 0 || isNaN(deltaMs)) {
      return 0;
    }

    this.accumulatorMs += deltaMs;

    let ticksExecuted = 0;

    // ponytail: floating point delta birikiminde (örn. 8.333ms 120 FPS) mikro sapmaları önlemek için 1e-5 tolerans
    const EPSILON = 1e-5;
    while (this.accumulatorMs + EPSILON >= TICK_DURATION_MS) {
      if (ticksExecuted >= MAX_TICKS_PER_FRAME) {
        // Spiral of death önlemi: 5 tick sınırını aşan zaman atılır,
        // oyun donduğunda sonsuz döngüye girmesi engellenir.
        this.accumulatorMs = 0;
        break;
      }

      this.currentTick += 1;
      this.accumulatorMs = Math.max(0, this.accumulatorMs - TICK_DURATION_MS);
      onTick(this.currentTick);
      ticksExecuted += 1;
    }

    return ticksExecuted;
  }

  /**
   * Doğrudan N adet tick işletmek için (testler ve simülasyon adımları).
   */
  public stepTicks(count: number, onTick: TickCallback): void {
    for (let i = 0; i < count; i++) {
      this.currentTick += 1;
      onTick(this.currentTick);
    }
  }

  /**
   * Render interpolasyonu için alfa katsayısı: [0, 1)
   * Bir önceki mantıksal durum ile şimdiki durum arasında görsel geçiş için kullanılır.
   */
  public getInterpolationAlpha(): number {
    return Math.min(1, Math.max(0, this.accumulatorMs / TICK_DURATION_MS));
  }

  public getState(): { currentTick: number; isPaused: boolean } {
    return {
      currentTick: this.currentTick,
      isPaused: this.isPaused,
    };
  }

  public setState(state: { currentTick: number; isPaused?: boolean }): void {
    this.currentTick = state.currentTick;
    this.accumulatorMs = 0;
    this.isPaused = state.isPaused ?? false;
  }
}
