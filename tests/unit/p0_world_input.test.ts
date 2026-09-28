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
    it('100×100 dünya sınırı ve 12×12 R3-C0 modülünü kullanır', () => {
      expect(WorldLayout.WORLD_BOUNDS).toEqual({ minX: 0, maxX: 100, minZ: 0, maxZ: 100 });
      expect(WorldLayout.MODULE_SIZE).toBe(12);
      expect(WorldLayout.ROOM_BOUNDS).toEqual({ minX: 23, maxX: 35, minZ: 43, maxZ: 55 });
      expect(WorldLayout.ROOM_CENTER).toEqual({ x: 29, z: 49 });

      const width = WorldLayout.ROOM_BOUNDS.maxX - WorldLayout.ROOM_BOUNDS.minX;
      const depth = WorldLayout.ROOM_BOUNDS.maxZ - WorldLayout.ROOM_BOUNDS.minZ;
      expect(width).toBe(12);
      expect(depth).toBe(12);
    });

    it('Oda içi zemin, batı koridoru ve güney kapı eşiği yürünebilirdir', () => {
      expect(WorldLayout.isWalkable(WorldLayout.PLAYER_SPAWN.x, WorldLayout.PLAYER_SPAWN.z)).toBe(true);

      // Oda içi serbest alanlar
      expect(WorldLayout.isWalkable(31, 49)).toBe(true);
      expect(WorldLayout.isWalkable(25.5, 45.5)).toBe(true);

      // Batı geçiş koridoru (bahçeye giden yol)
      expect(WorldLayout.isWalkable(21, 49)).toBe(true);

      // Güney kapısı dış eşiği
      expect(WorldLayout.isWalkable(29, 58)).toBe(true);

      // Batı bahçe alanı
      expect(WorldLayout.isWalkable(16, 47)).toBe(true);
    });

    it('Açılmamış modüller ve dış dünya sınırları yürümeyi engeller', () => {
      expect(WorldLayout.getModule('R3-C1')?.bounds).toEqual({ minX: 35, maxX: 47, minZ: 43, maxZ: 55 });
      expect(WorldLayout.isWalkable(40, 49)).toBe(false);

      // Kuzeydeki açılmamış işleme modülü
      expect(WorldLayout.isWalkable(29, 37)).toBe(false);

      expect(WorldLayout.isWalkable(0, 0)).toBe(false);
      expect(WorldLayout.isWalkable(101, 49)).toBe(false);
    });

    it('Mobilya ve istasyonların footprint engelleri karakterin üstlerine çıkmasını engeller', () => {
      expect(WorldLayout.isWalkable(10.5, 42.5)).toBe(false);
      expect(WorldLayout.isWalkable(10.5, 50.5)).toBe(false);
      expect(WorldLayout.isWalkable(24.3, 44.5)).toBe(false);
      expect(WorldLayout.isWalkable(24.3, 52.2)).toBe(false);
      expect(WorldLayout.isWalkable(33.2, 44.3)).toBe(false);
    });

    it('yeni 12×12 modül kaydını mevcut koordinatları kaydırmadan takar', () => {
      const initialBounds = { ...WorldLayout.WORLD_BOUNDS };
      const initialModuleCount = WorldLayout.MODULES.length;
      const module = WorldLayout.createModule({
        id: 'room.dynamic-test', label: 'Gelecek Üretim Modülü', type: 'production', phase: 'A2',
        status: 'reserved', bounds: { minX: 80, maxX: 92, minZ: 80, maxZ: 92 }, doorways: [],
        fixtures: [{ id: 'fixture.dynamic-test', name: 'Üretim Aracı',
          bounds: { minX: 81, maxX: 83, minZ: 81, maxZ: 83 },
          serviceCell: { x: 84, z: 82 }, color: '#35D9E6' }],
      });
      try {
        WorldLayout.registerModule(module);
        expect(WorldLayout.isWalkable(86, 86)).toBe(false);
        expect(WorldLayout.FIXTURES.some((fixture) => fixture.id === 'fixture.dynamic-test')).toBe(false);
        WorldLayout.restoreActiveModules([module.id]);
        expect(WorldLayout.isWalkable(86, 86)).toBe(true);
        expect(WorldLayout.getActiveModuleIds()).toContain(module.id);
        expect(WorldLayout.FIXTURES.some((fixture) => fixture.id === 'fixture.dynamic-test')).toBe(true);
        expect(WorldLayout.ROOM_BOUNDS).toEqual({ minX: 23, maxX: 35, minZ: 43, maxZ: 55 });
        expect(() => WorldLayout.restoreActiveModules(['missing-module'])).toThrow('not present');
      } finally {
        WorldLayout.MODULES.splice(initialModuleCount);
        Object.assign(WorldLayout.WORLD_BOUNDS, initialBounds);
      }
    });

    it('8×8 asgari odayı bağlayıp 100×100 sınırını yeni modüle göre büyütür', () => {
      const initialBounds = { ...WorldLayout.WORLD_BOUNDS };
      const initialModuleCount = WorldLayout.MODULES.length;
      const module = WorldLayout.createModule({
        id: 'room.world-expansion-test', label: 'Genişletilebilir Üretim Odası', type: 'production', phase: 'A2',
        status: 'reserved', bounds: { minX: 104, maxX: 112, minZ: 96, maxZ: 104 }, doorways: [],
      });

      try {
        WorldLayout.registerModule(module);
        expect(WorldLayout.WORLD_BOUNDS).toEqual({ minX: 0, maxX: 112, minZ: 0, maxZ: 104 });
        expect(WorldLayout.isWalkable(108, 100)).toBe(false);
        WorldLayout.activateModule(module.id);
        expect(WorldLayout.isWalkable(108, 100)).toBe(true);
        expect(WorldLayout.getWalkableBounds()).toMatchObject({ maxX: 112, maxZ: 104 });
      } finally {
        WorldLayout.MODULES.splice(initialModuleCount);
        Object.assign(WorldLayout.WORLD_BOUNDS, initialBounds);
      }
    });

    it('komşu oda açılınca iki tarafta da 4m geçit oluşturur', () => {
      const adjacent = WorldLayout.getModule('R3-C1')!;
      const originalStatus = adjacent.status;
      const originalDoorways = structuredClone(adjacent.doorways);

      try {
        WorldLayout.activateModule(adjacent.id);
        const salesRoom = WorldLayout.getModule(WorldLayout.SALES_MODULE_ID)!;
        expect(salesRoom.doorways).toContainEqual({
          side: 'east', center: 49, width: 4, connectsTo: adjacent.id,
        });
        expect(adjacent.doorways).toContainEqual({
          side: 'west', center: 49, width: 4, connectsTo: salesRoom.id,
        });
        expect(WorldLayout.isWalkable(35, 49)).toBe(true);
      } finally {
        adjacent.status = originalStatus;
        adjacent.doorways.splice(0, adjacent.doorways.length, ...originalDoorways);
        const salesRoom = WorldLayout.getModule(WorldLayout.SALES_MODULE_ID)!;
        salesRoom.doorways.splice(0, salesRoom.doorways.length,
          ...salesRoom.doorways.filter((door) => door.connectsTo !== adjacent.id));
      }
    });

    it('açık mahalle modülü duvarsız çizilir ve üretim alanı olarak sisteme eklenebilir', () => {
      const initialBounds = { ...WorldLayout.WORLD_BOUNDS };
      const initialModuleCount = WorldLayout.MODULES.length;
      const salesRoom = WorldLayout.getModule(WorldLayout.SALES_MODULE_ID)!;
      const originalDoorways = structuredClone(salesRoom.doorways);
      const zone = WorldLayout.createModule({
        id: 'zone.production-test', label: 'Açık Üretim Mahallesi', type: 'production-zone', phase: 'A2',
        status: 'active', enclosure: 'open', surfaceColor: '#8BA870',
        bounds: { minX: 31, maxX: 39, minZ: 55, maxZ: 63 }, doorways: [],
      });

      try {
        WorldLayout.registerModule(zone);
        expect(WorldLayout.isWalkable(35, 59)).toBe(true);
        expect(WorldLayout.isWalkable(33, 55)).toBe(true);
        expect(zone.enclosure).toBe('open');
        expect(zone.surfaceColor).toBe('#8BA870');
      } finally {
        WorldLayout.MODULES.splice(initialModuleCount);
        salesRoom.doorways.splice(0, salesRoom.doorways.length, ...originalDoorways);
        Object.assign(WorldLayout.WORLD_BOUNDS, initialBounds);
      }
    });

    it('dar veya 4m ızgarasına uymayan yeni modül ölçüsünü reddeder', () => {
      const narrow = WorldLayout.createModule({
        id: 'room.too-narrow-test', label: 'Dar Oda', type: 'storage', phase: 'A2',
        status: 'reserved', bounds: { minX: 80, maxX: 87, minZ: 80, maxZ: 88 }, doorways: [],
      });
      expect(() => WorldLayout.registerModule(narrow)).toThrow('at least 8 m');
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
    it('Kamera takip noktasında alt HUD için Z kompanzasyonu (+1.8m) uygular', () => {
      const portraitAspect = 9 / 16; // 0.5625 (tipik mobil portre)
      const portraitCam = new PortraitCamera(portraitAspect);

      const playerPos = { x: WorldLayout.PLAYER_SPAWN.x, y: 0.6, z: WorldLayout.PLAYER_SPAWN.z };
      portraitCam.follow(playerPos, 1.0); // Anında odaklan

      expect(portraitCam.camera.isOrthographicCamera).toBe(true);
      expect(portraitCam.camera.position.z).toBeCloseTo(WorldLayout.PLAYER_SPAWN.z + 1.8 + 8, 1);
    });

    it('Dar portre ekranlarda ortografik görüş sahnenin yanlarını kesmeyecek şekilde genişler', () => {
      const landscapeCam = new PortraitCamera(16 / 9); // Yatay ekran
      expect(landscapeCam.camera.right - landscapeCam.camera.left).toBeGreaterThanOrEqual(8);

      const portraitCam = new PortraitCamera(9 / 16); // Dar dikey ekran (aspect ~0.56)
      expect(portraitCam.camera.top - portraitCam.camera.bottom).toBeGreaterThanOrEqual(14);
    });
  });
});
