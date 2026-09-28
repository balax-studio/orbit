import type { SimulationClock } from '../../domain/time/clock';

export interface LifecycleCoordinatorOptions {
  onPauseChanged?: (paused: boolean) => void;
  onCheckpointError?: (error: unknown) => void;
  onResume?: () => void;
}

/** Merges UI and platform signals so duplicate background events cannot pause/resume twice. */
export class LifecycleCoordinator {
  private readonly clock: SimulationClock;
  private readonly checkpoint: () => void | Promise<void>;
  private readonly options: LifecycleCoordinatorOptions;
  private readonly inactiveSources = new Set<string>();
  private uiPaused = false;
  private paused = false;
  private blockedBySaveError = false;

  constructor(
    clock: SimulationClock,
    checkpoint: () => void | Promise<void>,
    options: LifecycleCoordinatorOptions = {}
  ) {
    this.clock = clock;
    this.checkpoint = checkpoint;
    this.options = options;
  }

  setUiPaused(paused: boolean): void {
    if (paused === this.uiPaused) return;
    this.uiPaused = paused;
    this.reconcile(paused);
  }

  setPlatformActive(source: string, active: boolean): void {
    if (!source.trim()) throw new Error('Lifecycle source is required');
    if (active) this.inactiveSources.delete(source);
    else this.inactiveSources.add(source);
    this.reconcile(!active);
  }

  isPaused(): boolean {
    return this.paused;
  }

  isSaveBlocked(): boolean {
    return this.blockedBySaveError;
  }

  blockForSaveError(error: unknown): void {
    if (this.blockedBySaveError) return;
    this.blockedBySaveError = true;
    if (!this.paused) {
      this.paused = true;
      this.clock.pause();
      this.options.onPauseChanged?.(true);
    }
    this.options.onCheckpointError?.(error);
  }

  clearSaveBlock(): void {
    if (!this.blockedBySaveError) return;
    this.blockedBySaveError = false;
    this.reconcile(false);
  }

  private reconcile(checkpointOnPause: boolean): void {
    const shouldPause = this.uiPaused || this.inactiveSources.size > 0 || this.blockedBySaveError;
    if (shouldPause && !this.paused) {
      this.paused = true;
      this.clock.pause();
      this.options.onPauseChanged?.(true);
      if (checkpointOnPause) this.requestCheckpoint();
      return;
    }
    if (!shouldPause && this.paused) {
      this.paused = false;
      this.clock.resume();
      this.options.onPauseChanged?.(false);
      this.options.onResume?.();
    }
  }

  private requestCheckpoint(): void {
    try {
      void Promise.resolve(this.checkpoint()).catch((error: unknown) => this.blockForSaveError(error));
    } catch (error) {
      this.blockForSaveError(error);
    }
  }
}
