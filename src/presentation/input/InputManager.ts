// Orbit Market - Input Manager & Pointer Ownership
// Reference: CONTROLS_AND_UX.md, KARARLAR.md D-018, D-034

export interface InputVector {
  x: number;
  z: number;
}

export type MoveTargetCallback = (targetX: number, targetZ: number) => void;
export type JoystickCallback = (vector: InputVector) => void;

export interface PointerEventData {
  pointerId: number;
  clientX: number;
  clientY: number;
  target?: any;
}

export class InputManager {
  private activePointerId: number | null = null;
  private pointerStartX: number = 0;
  private pointerStartY: number = 0;
  private isDragging: boolean = false;
  private onMoveTarget: MoveTargetCallback | null = null;
  private onJoystickMove: JoystickCallback | null = null;
  private canvasElement?: { addEventListener: Function; removeEventListener: Function };
  private targetWindow?: { addEventListener: Function; removeEventListener: Function };
  private raycastGround?: (screenX: number, screenY: number) => { x: number; z: number } | null;

  constructor(
    canvasElement?: { addEventListener: Function; removeEventListener: Function },
    raycastGround?: (screenX: number, screenY: number) => { x: number; z: number } | null,
    targetWindow?: { addEventListener: Function; removeEventListener: Function }
  ) {
    this.canvasElement = canvasElement;
    this.raycastGround = raycastGround;
    this.targetWindow = targetWindow ?? (typeof window !== 'undefined' ? window : undefined);
    this.bindEvents();
  }

  public setOnMoveTarget(cb: MoveTargetCallback): void {
    this.onMoveTarget = cb;
  }

  public setOnJoystickMove(cb: JoystickCallback): void {
    this.onJoystickMove = cb;
  }

  /**
   * Pointer olayının bir DOM UI elemanından gelip gelmediğini kontrol eder.
   * UI üzerinde başlayan pointer kesinlikle 3B sahneye sızamaz.
   */
  public static isPointerOverUI(event: { target?: any }): boolean {
    const target = event.target;
    if (!target) return false;
    if (typeof target.closest === 'function') {
      return Boolean(target.closest('[data-ui="true"]') || target.closest('#hud-layer'));
    }
    return false;
  }

  private bindEvents(): void {
    if (this.canvasElement?.addEventListener) {
      this.canvasElement.addEventListener('pointerdown', this.handlePointerDown);
    }
    if (this.targetWindow?.addEventListener) {
      this.targetWindow.addEventListener('pointermove', this.handlePointerMove);
      this.targetWindow.addEventListener('pointerup', this.handlePointerUp);
      this.targetWindow.addEventListener('pointercancel', this.handlePointerCancel);
    }
  }

  public destroy(): void {
    if (this.canvasElement?.removeEventListener) {
      this.canvasElement.removeEventListener('pointerdown', this.handlePointerDown);
    }
    if (this.targetWindow?.removeEventListener) {
      this.targetWindow.removeEventListener('pointermove', this.handlePointerMove);
      this.targetWindow.removeEventListener('pointerup', this.handlePointerUp);
      this.targetWindow.removeEventListener('pointercancel', this.handlePointerCancel);
    }
  }

  public handlePointerDown = (event: PointerEventData): void => {
    // UI kalkanı: UI üzerinden gelen tıklamaları reddet
    if (InputManager.isPointerOverUI(event)) {
      return;
    }

    if (this.activePointerId !== null) {
      return; // Zaten etkin bir dokunuş var
    }

    this.activePointerId = event.pointerId;
    this.pointerStartX = event.clientX;
    this.pointerStartY = event.clientY;
    this.isDragging = false;
  };

  public handlePointerMove = (event: PointerEventData): void => {
    if (event.pointerId !== this.activePointerId) return;

    const dx = event.clientX - this.pointerStartX;
    const dy = event.clientY - this.pointerStartY;
    const distanceSq = dx * dx + dy * dy;

    // 10 pikselden fazla kaydırma drag/joystick kabul edilir
    if (distanceSq > 100) {
      this.isDragging = true;
      const length = Math.sqrt(distanceSq);
      // Normalized yön vektörü (Three.js kamera açısına göre: ekranda yukarı gitmek -Z eksenidir)
      const inputVector: InputVector = {
        x: dx / length,
        z: dy / length,
      };
      if (this.onJoystickMove) {
        this.onJoystickMove(inputVector);
      }
    }
  };

  public handlePointerUp = (event: PointerEventData): void => {
    if (event.pointerId !== this.activePointerId) return;

    if (!this.isDragging) {
      // Tap-to-move: zemine tıklama
      const groundPos = this.raycastGround ? this.raycastGround(event.clientX, event.clientY) : null;
      if (groundPos && this.onMoveTarget) {
        this.onMoveTarget(groundPos.x, groundPos.z);
      }
    } else {
      // Sürükleme bitti, hareketi durdur
      if (this.onJoystickMove) {
        this.onJoystickMove({ x: 0, z: 0 });
      }
    }

    this.activePointerId = null;
    this.isDragging = false;
  };

  public handlePointerCancel = (event: PointerEventData): void => {
    if (event.pointerId === this.activePointerId) {
      // Sistem kesintisinde (gelen arama, el çekme) hareketi sıfırla
      this.activePointerId = null;
      this.isDragging = false;
      if (this.onJoystickMove) {
        this.onJoystickMove({ x: 0, z: 0 });
      }
    }
  };
}
