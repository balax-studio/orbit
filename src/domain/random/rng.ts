// Orbit Market - Deterministic Seeded Pseudo-Random Number Generator
// Reference: KARARLAR.md D-022, D-023

export interface IRng {
  nextFloat(): number; // [0, 1)
  nextInt(min: number, max: number): number; // [min, max] kapsayıcı
  nextBool(probability?: number): boolean;
  getState(): number;
  setState(state: number): void;
}

/**
 * Mulberry32 algoritması: 32-bit hızlı, hafif ve deterministik PRNG.
 * Save/load durumlarında tek bir integer ile serileştirilebilir.
 */
export class Mulberry32Rng implements IRng {
  private state: number;

  constructor(seed: number) {
    // ponytail: Mulberry32 32-bit unsigned state kullanır.
    this.state = (seed | 0) >>> 0;
    if (this.state === 0) {
      this.state = 1;
    }
  }

  public nextFloat(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const result = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    return result;
  }

  public nextInt(min: number, max: number): number {
    if (min > max) {
      throw new Error(`Invalid range: min (${min}) cannot be greater than max (${max})`);
    }
    const range = max - min + 1;
    return Math.floor(this.nextFloat() * range) + min;
  }

  public nextBool(probability: number = 0.5): boolean {
    if (probability <= 0) return false;
    if (probability >= 1) return true;
    return this.nextFloat() < probability;
  }

  public getState(): number {
    return this.state;
  }

  public setState(state: number): void {
    this.state = (state | 0) >>> 0;
  }
}

export function createRng(seed: number): IRng {
  return new Mulberry32Rng(seed);
}
