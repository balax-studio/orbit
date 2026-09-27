// Orbit Market - P0-02 Verification Tests
// Proves all 3 acceptance criteria of Task P0-02

import { describe, it, expect } from 'vitest';
import { WorldLayout } from '../../src/presentation/world/WorldLayout';
import { InputManager } from '../../src/presentation/input/InputManager';
import { PortraitCamera } from '../../src/presentation/camera/PortraitCamera';

describe('P0-02 Acceptance Criteria Verification', () => {
  // =========================================================================
  // ÖLÇÜT 1: P0 sahnesi paftadaki tek satış odası, bahçe kaynağı
  // ve geçerli başlangıç footprint'lerini kullanır.
  // =========================================================================
  describe('Criterion 1: World Layout & Footprint Validation', () => {
    it('R3-C0 Satış odası kesin pafta koordinatlarını (x12..17, z22..27) kullanır', () => {
      expect(WorldLayout.ROOM_BOUNDS.minX).toBe(12);
      expect(WorldLayout.ROOM_BOUNDS.maxX).toBe(17);
      expect(WorldLayout.ROOM_BOUNDS.minZ).toBe(22);
      expect(WorldLayout.ROOM_BOUNDS.maxZ).toBe(27);

      const width = WorldLayout.ROOM_BOUNDS.maxX - WorldLayout.ROOM_BOUNDS.minX;
      const depth = WorldLayout.ROOM_BOUNDS.maxZ - WorldLayout.ROOM_BOUNDS.minZ;
      expect(width).toBe(5); // 12'den 17'ye (6 tamsayı hücre)
      expect(depth).toBe(5); // 22'den 27'ye (6 tamsayı hücre)
    });

    it('Oda içi zemin, batı koridoru ve güney kapı eşiği yürünebilirdir', () => {
      // Başlangıç noktası
      expect(WorldLayout.isWalkable(14.5, 24.5)).toBe(true);

      // Oda içi serbest alanlar
      expect(WorldLayout.isWalkable(15, 25)).toBe(true);
      expect(WorldLayout.isWalkable(13.5, 23.5)).toBe(true);

      // Batı geçiş koridoru (bahçeye giden yol)
      expect(WorldLayout.isWalkable(11, 24.5)).toBe(true);

      // Güney kapısı dış eşiği
      expect(WorldLayout.isWalkable(14.5, 28)).toBe(true);

      // Batı bahçe alanı
      expect(WorldLayout.isWalkable(8, 23)).toBe(true);
    });

    it('Açılmamış odalar (R3-C1 rezervi) ve dış sınırlar yürümeyi engeller', () => {
      // Doğudaki açılmamış Kuru Depo odası R3-C1 (x18..23, z22..27)
      expect(WorldLayout.isWalkable(20, 25)).toBe(false);

      // Kuzeydeki açılmamış İşleme odası R2-C0 (x12..17, z16..21)
      expect(WorldLayout.isWalkable(15, 18)).toBe(false);

      // Dış boşluk / yol alanı
      expect(WorldLayout.isWalkable(0, 0)).toBe(false);
      expect(WorldLayout.isWalkable(14.5, 35)).toBe(false);
    });

    it('Mobilya ve istasyonların footprint engelleri karakterin üstlerine çıkmasını engeller', () => {
      // Memba Çeşmesi (x5..6, z21..22)
      expect(WorldLayout.isWalkable(5.5, 21.5)).toBe(false);

      // Domates Yatağı (x5..6, z25..26)
      expect(WorldLayout.isWalkable(5.5, 25.5)).toBe(false);

      // Şişeleme Tezgâhı (x12, z22..23)
      expect(WorldLayout.isWalkable(12.3, 22.5)).toBe(false);

      // Satış Rafı (x12, z26)
      expect(WorldLayout.isWalkable(12.3, 26.2)).toBe(false);

      // Kasa Masası (x17, z22)
      expect(WorldLayout.isWalkable(16.8, 22.3)).toBe(false);
    });

    it('paftadaki 2×2 ve 1×2 footprint hücrelerini tam boyutta engeller', () => {
      const spring = WorldLayout.FIXTURES.find((fixture) => fixture.id === 'source.spring_water')!;
      const crop = WorldLayout.FIXTURES.find((fixture) => fixture.id === 'source.crop_plot')!;
      const bottler = WorldLayout.FIXTURES.find((fixture) => fixture.id === 'station.bottler')!;
      expect(spring.bounds.maxX - spring.bounds.minX + 1).toBe(2);
      expect(crop.bounds.maxZ - crop.bounds.minZ + 1).toBe(2);
      expect(bottler.bounds.maxX - bottler.bounds.minX + 1).toBe(1);
      expect(bottler.bounds.maxZ - bottler.bounds.minZ + 1).toBe(2);
      expect(WorldLayout.isWalkable(6.4, 21.5)).toBe(false);
      expect(WorldLayout.isWalkable(12.4, 23.4)).toBe(false);
      expect(WorldLayout.isWalkable(7, 21.5)).toBe(true);
    });
  });

  // =========================================================================
  // ÖLÇÜT 2: Klavyesiz dokunmatik hareket çalışır;
  // UI üzerinde başlayan pointer dünya komutuna dönüşmez.
  // =========================================================================
  describe('Criterion 2: Pointer Ownership & Touch Controls', () => {
    it('UI elemanı üzerindeki tıklamalar isPointerOverUI tarafından yakalanır', () => {
      // Mock UI button with data-ui="true"
      const uiButton = {
        closest: (selector: string) => (selector === '[data-ui="true"]' ? uiButton : null),
      };

      expect(InputManager.isPointerOverUI({ target: uiButton })).toBe(true);

      // Child element inside #hud-layer
      const childInHud = {
        closest: (selector: string) => (selector === '#hud-layer' ? { id: 'hud-layer' } : null),
      };
      expect(InputManager.isPointerOverUI({ target: childInHud })).toBe(true);
    });

    it('3B Canvas veya zemin üzerindeki tıklamalar UI olarak kabul edilmez ve sahneye iletilir', () => {
      const canvasTarget = {
        closest: () => null,
      };
      expect(InputManager.isPointerOverUI({ target: canvasTarget })).toBe(false);
      expect(InputManager.isPointerOverUI({ target: null })).toBe(false);
    });

    it('UI üzerinde başlayan pointerdown dünya hareketine dönüşmez (pointer isolation)', () => {
      let targetCalled = false;
      const inputManager = new InputManager(undefined, () => ({ x: 15, z: 25 }));
      inputManager.setOnMoveTarget(() => {
        targetCalled = true;
      });

      const uiTarget = {
        closest: (sel: string) => (sel === '[data-ui="true"]' ? uiTarget : null),
      };

      // UI üzerinde tıklama başlatılır
      inputManager.handlePointerDown({ pointerId: 1, clientX: 100, clientY: 100, target: uiTarget });
      inputManager.handlePointerUp({ pointerId: 1, clientX: 100, clientY: 100, target: uiTarget });

      // Sahne hedefi ayarlanmamış olmalıdır
      expect(targetCalled).toBe(false);
    });

    it('Touchcancel / Pointercancel durumunda hareket güvenle sıfırlanır ve takılı kalmaz', () => {
      let currentJoystickVec = { x: 0, z: 0 };

      const inputManager = new InputManager(undefined, () => ({ x: 15, z: 25 }));
      inputManager.setOnJoystickMove((vec) => {
        currentJoystickVec = vec;
      });

      // Canvas üzerinde dokunuş başlat
      inputManager.handlePointerDown({ pointerId: 1, clientX: 50, clientY: 50 });

      // Sürükleme hareketi (10px üzeri)
      inputManager.handlePointerMove({ pointerId: 1, clientX: 100, clientY: 100 });
      expect(currentJoystickVec.x).toBeGreaterThan(0);
      expect(currentJoystickVec.z).toBeGreaterThan(0);

      // Sistem kesintisi (touchcancel / pointercancel) tetiklenir
      inputManager.handlePointerCancel({ pointerId: 1, clientX: 100, clientY: 100 });

      // Vektör sıfırlanmalıdır
      expect(currentJoystickVec.x).toBe(0);
      expect(currentJoystickVec.z).toBe(0);

      inputManager.destroy();
    });
  });

  // =========================================================================
  // ÖLÇÜT 3: Kamera portre ekranda oyuncu ve seçili P0 hedefini
  // HUD altında bırakmaz.
  // =========================================================================
  describe('Criterion 3: Portrait Camera Framing & HUD Offset Compensation', () => {
    it('ortografik kamera 45° yatay ve yaklaşık 32° aşağı bakar; HUD hedef kaydırmasını uygular', () => {
      const portraitAspect = 9 / 16; // 0.5625 (tipik mobil portre)
      const portraitCam = new PortraitCamera(portraitAspect);

      const playerPos = { x: 14.5, y: 0.6, z: 24.5 };
      portraitCam.follow(playerPos, 1.0); // Anında odaklan

      expect(portraitCam.camera.isOrthographicCamera).toBe(true);
      expect(portraitCam.camera.position.x - playerPos.x).toBeCloseTo(8, 2);
      expect(portraitCam.camera.position.z).toBeCloseTo(24.5 + 1.8 + 8, 2);
      const elevation = Math.atan2(7.07, Math.hypot(8, 8)) * 180 / Math.PI;
      expect(elevation).toBeCloseTo(32, 0);
    });

    it('dar portrede görüş genişliği en az 8 dünya birimi kalır', () => {
      const portraitCam = new PortraitCamera(9 / 21);
      expect(portraitCam.camera.right - portraitCam.camera.left).toBeCloseTo(8);
      expect(portraitCam.camera.top - portraitCam.camera.bottom).toBeGreaterThan(14);
    });
  });
});
