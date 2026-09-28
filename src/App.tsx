import { useEffect, useRef, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import { SceneRenderer } from './presentation/world/SceneRenderer';
import { customerStatusLabel } from './presentation/customerStatus';
import { WorldLayout } from './presentation/world/WorldLayout';
import { InputManager } from './presentation/input/InputManager';
import { SimulationClock } from './domain/time/clock';
import { EconomyLedger, type EconomyLedgerSnapshot } from './domain/economy/ledger';
import { ATOMS_PER_CREDIT } from './domain/constants';
import { stepPlayerMovement } from './application/playerMovement';
import { CommandDispatcher } from './application/commands';
import { runDurableProductionTick } from './application/DurableProductionTick';
import { runDurableCustomerTick } from './application/DurableCustomerTick';
import { ShelfWorkerManager, type ShelfWorkerSnapshot } from './application/ShelfWorkerManager';
import { PlacementService, type PlacementSnapshot } from './application/PlacementService';
import { PlayerTransferService } from './application/PlayerTransferService';
import { selectDurableP0Recipe } from './application/ProductionRecipeService';
import { InventoryManager, type InventorySnapshot } from './domain/inventory/InventoryManager';
import { CustomerManager } from './domain/customer/CustomerManager';
import type { ItemId, RecipeId, StockLocation } from './domain/types';
import { ProductionManager, type ProductionSnapshot } from './domain/production/ProductionManager';
import { LifecycleCoordinator } from './app/lifecycle/LifecycleCoordinator';
import { BrowserLocalStorageAdapter, SaveService } from './infrastructure/save/SaveService';
import { AsyncSaveService } from './infrastructure/save/AsyncSaveService';
import { CapacitorFilesystemSaveStorage } from './infrastructure/save/CapacitorFilesystemSaveStorage';
import { migrateWorldSavePayload, WORLD_LAYOUT_VERSION } from './application/worldLayoutMigration';

interface AppSavePayload {
  ledger: EconomyLedgerSnapshot;
  inventory?: InventorySnapshot;
  production?: ProductionSnapshot;
  worker?: ShelfWorkerSnapshot;
  customers?: ReturnType<CustomerManager['serialize']>;
  placement?: PlacementSnapshot;
  worldLayoutVersion: number;
  worldModules?: { activeModuleIds: string[] };
  simulationTick: number;
  playerPosition: { x: number; z: number };
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<SceneRenderer | null>(null);
  const inputManagerRef = useRef<InputManager | null>(null);
  const saveServiceRef = useRef<SaveService<AppSavePayload> | AsyncSaveService<AppSavePayload> | null>(null);
  const captureSavePayloadRef = useRef<(() => AppSavePayload) | null>(null);
  const dispatcherRef = useRef<CommandDispatcher | null>(null);
  const inventoryRef = useRef<InventoryManager | null>(null);
  const productionRef = useRef<ProductionManager | null>(null);
  const workerRef = useRef<ShelfWorkerManager | null>(null);
  const customerRef = useRef<CustomerManager | null>(null);
  const placementRef = useRef<PlacementService | null>(null);
  const playerTransferRef = useRef<PlayerTransferService | null>(null);
  const buildModeRef = useRef(false);
  const buildWasPausedRef = useRef(false);
  const draftCellRef = useRef<{ x: number; z: number } | null>(null);
  const lifecycleRef = useRef<LifecycleCoordinator | null>(null);
  const saveReadyRef = useRef(false);
  const saveBlockedRef = useRef(false);
  const saveBusyRef = useRef(false);
  const uiPausedRef = useRef(false);
  const lastCheckpointTickRef = useRef(0);
  const lastRenderTimeRef = useRef(0);
  const lastSaleCountRef = useRef(0);
  const joystickPointerRef = useRef<number | null>(null);

  // Simülasyon saat ve ledger durumları
  const clockRef = useRef<SimulationClock>(new SimulationClock());
  const ledgerRef = useRef<EconomyLedger>(new EconomyLedger(100 * ATOMS_PER_CREDIT)); // 100 Kredi başlangıç

  // Oyuncu mantıksal hareket durumu
  const playerPosRef = useRef({ x: WorldLayout.PLAYER_SPAWN.x, z: WorldLayout.PLAYER_SPAWN.z });
  const previousPlayerPosRef = useRef({ x: WorldLayout.PLAYER_SPAWN.x, z: WorldLayout.PLAYER_SPAWN.z });
  const playerTargetRef = useRef<{ x: number; z: number } | null>(null);
  const joystickVecRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 });
  const playerRotationRef = useRef(0);

  // UI state
  const [balanceCredits, setBalanceCredits] = useState(100);
  const [currentTick, setCurrentTick] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSaveReady, setIsSaveReady] = useState(false);
  const [isSaveBlocked, setIsSaveBlocked] = useState(false);
  const [hasRecoveryCandidate, setHasRecoveryCandidate] = useState(false);
  const [nearestFixture, setNearestFixture] = useState<string>('Boşluk');
  const [hudMessage, setHudMessage] = useState<string>('Dünyaya dokunarak karakterinizi hareket ettirin.');
  const [workerStatus, setWorkerStatus] = useState('Görev bekliyor');
  const [customerStatus, setCustomerStatus] = useState('Müşteri bekleniyor');
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeId>('recipe.bottle_glass_water_small');
  const [bottlerStatus, setBottlerStatus] = useState('Girdi bekleniyor');
  const [joystickOffset, setJoystickOffset] = useState({ x: 0, y: 0 });
  const [playerLoad, setPlayerLoad] = useState('Boş');
  const [isBuildMode, setIsBuildMode] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const options = {
      namespace: 'orbit-market-p0',
      contentVersion: 'p0.1',
    };
    const isNativePlatform = Capacitor.isNativePlatform();
    const saveService = isNativePlatform
      ? new AsyncSaveService<AppSavePayload>(new CapacitorFilesystemSaveStorage(), options)
      : new SaveService<AppSavePayload>(new BrowserLocalStorageAdapter(), options);
    saveServiceRef.current = saveService;

    const inventory = new InventoryManager();
    inventoryRef.current = inventory;
    const placement = new PlacementService();
    placementRef.current = placement;
    let production: ProductionManager | null = null;
    let worker: ShelfWorkerManager | null = null;
    let customers: CustomerManager | null = null;
    const captureSavePayload = (): AppSavePayload => {
      if (!production) throw new Error('ProductionManager is not initialized');
      return {
        ledger: ledgerRef.current.serialize(),
        inventory: inventory.serialize(),
        production: production.serialize(),
        ...(worker ? { worker: worker.serialize() } : {}),
        ...(customers ? { customers: customers.serialize() } : {}),
        placement: placement.serialize(),
        worldLayoutVersion: WORLD_LAYOUT_VERSION,
        worldModules: { activeModuleIds: WorldLayout.getActiveModuleIds() },
        simulationTick: clockRef.current.getTick(),
        playerPosition: { ...playerPosRef.current },
      };
    };
    captureSavePayloadRef.current = captureSavePayload;
    const productionManager = new ProductionManager(inventory, ledgerRef.current, [], isNativePlatform ? undefined : (commit) => {
      (saveService as SaveService<AppSavePayload>).appendTransaction({
        transactionId: commit.transactionId,
        type: commit.type,
        tick: commit.tick,
        event: commit,
        payload: captureSavePayload(),
      });
    });
    production = productionManager;
    productionRef.current = productionManager;
    const checkpoint = async () => {
      const tick = clockRef.current.getTick();
      if (isNativePlatform) {
        saveBusyRef.current = true;
        clockRef.current.pause();
      }
      try {
        const write = saveService.checkpoint({ tick, payload: captureSavePayload() });
        if (write instanceof Promise) await write;
        lastCheckpointTickRef.current = tick;
      } finally {
        if (isNativePlatform) {
          saveBusyRef.current = false;
          if (!lifecycleRef.current?.isPaused()) clockRef.current.resume();
        }
      }
    };
    const onSaveError = (error: unknown) => {
      saveBlockedRef.current = true;
      saveReadyRef.current = false;
      setIsSaveReady(false);
      setIsSaveBlocked(true);
      setHudMessage(`Kayıt hatası; simülasyon duraklatıldı: ${error instanceof Error ? error.message : String(error)}`);
    };
    const lifecycle = new LifecycleCoordinator(clockRef.current, () => saveReadyRef.current && !saveBusyRef.current ? checkpoint() : undefined, {
      onPauseChanged: (paused) => {
        setIsPaused(paused);
        if (paused) {
          joystickVecRef.current = { x: 0, z: 0 };
          playerTargetRef.current = null;
        }
      },
      onCheckpointError: onSaveError,
      onResume: () => {
        lastRenderTimeRef.current = performance.now();
      },
    });
    lifecycleRef.current = lifecycle;

    let effectDisposed = false;
    const initializeSave = async () => {
      let recoveryPending = false;
      let worldLayoutMigrated = false;
      try {
      const loaded = await saveService.load();
      if (effectDisposed) return;
      if (loaded.payload) {
        const migration = migrateWorldSavePayload(loaded.payload);
        const payload = migration.payload;
        worldLayoutMigrated = migration.migrated;
        if (payload.worldModules) WorldLayout.restoreActiveModules(payload.worldModules.activeModuleIds);
        if (
          payload.simulationTick !== loaded.tick ||
          !Number.isFinite(payload.playerPosition?.x) ||
          !Number.isFinite(payload.playerPosition?.z)
        ) {
          throw new Error('Kayıt alanları doğrulanamadı');
        }
        if ((payload.inventory && !payload.production) || (!payload.inventory && payload.production)) {
          throw new Error('Kayıt envanter ve üretim durumunun yalnızca birini içeriyor');
        }
        ledgerRef.current.restore(payload.ledger);
        if (payload.inventory && payload.production) {
          inventory.restore(payload.inventory);
          setPlayerLoad(inventory.getLotsAt({ kind: 'player', ownerId: 'player' })
            .map((lot) => `${lot.quantity} ${lot.itemId}`).join(', ') || 'Boş');
          production.restore(payload.production);
          setSelectedRecipe(production.getMachine('station.bottler')?.selectedRecipeId ?? 'recipe.bottle_glass_water_small');
          if (payload.placement) {
            placement.restore(payload.placement);
            rendererRef.current?.updateFixtures(placement.getFixtures());
            customers?.setShelfServicePosition(placement.getFixtures()
              .find((fixture) => fixture.id === 'fixture.sales_shelf')!.serviceCell);
          }
          if (payload.worker && worker) worker.restore(payload.worker);
          if (payload.customers && customers) {
            customers.restore(payload.customers);
            lastSaleCountRef.current = customers.getCompletedSales().length;
          }
          if (worker?.serialize().task) setWorkerStatus('Kayıttan ikmal işine dönüyor');
        }
        clockRef.current.setState({ currentTick: loaded.tick, isPaused: false });
        playerPosRef.current = { ...payload.playerPosition };
        previousPlayerPosRef.current = { ...payload.playerPosition };
        // Restore completes before the first simulation tick.
        setCurrentTick(loaded.tick);
        setBalanceCredits(ledgerRef.current.getBalanceCredits());
        if (loaded.recovery) {
          recoveryPending = true;
          setHasRecoveryCandidate(true);
          setHudMessage(`Kayıt doğrulaması gerekiyor: ${loaded.recovery.detail}`);
          lifecycle.blockForSaveError(new Error(loaded.recovery.detail));
        }
      } else if (loaded.recovery) {
        throw new Error(`Önceki kayıt doğrulanamadı: ${loaded.recovery.detail}`);
      } else {
        productionManager.initializeP0Supplies();
        await checkpoint();
      }
      if (!recoveryPending) {
        if (worldLayoutMigrated) await checkpoint();
        if (loaded.payload && (!loaded.payload.inventory || !loaded.payload.production ||
          !loaded.payload.worker || !loaded.payload.placement || !loaded.payload.customers) && !worldLayoutMigrated) {
          await checkpoint();
        }
        saveReadyRef.current = true;
        setIsSaveReady(true);
      }
    } catch (error) {
      lifecycle.blockForSaveError(error);
      onSaveError(error);
    }
    };
    const persistCommand = (command: Parameters<NonNullable<ConstructorParameters<typeof CommandDispatcher>[2]>>[0], result: Parameters<NonNullable<ConstructorParameters<typeof CommandDispatcher>[2]>>[1]) =>
      saveService.appendTransaction({
        transactionId: command.transactionId,
        type: command.type,
        tick: command.timestampTick,
        event: { command, result },
        payload: captureSavePayload(),
      });
    dispatcherRef.current = new CommandDispatcher(
      ledgerRef.current,
      inventory,
      isNativePlatform ? undefined : (command, result) => { void persistCommand(command, result); },
      async (command, result) => { await persistCommand(command, result); }
    );
    playerTransferRef.current = new PlayerTransferService(dispatcherRef.current, inventory);
    worker = new ShelfWorkerManager(inventory, dispatcherRef.current, (x, z) => placement.isWalkable(x, z),
      WorldLayout.PLAYER_SPAWN, () => WorldLayout.getWalkableBounds());
    workerRef.current = worker;
    const shelfCell = placement.getFixtures().find((fixture) => fixture.id === 'fixture.sales_shelf')!.serviceCell;
    const checkoutCell = placement.getFixtures().find((fixture) => fixture.id === 'fixture.checkout')!.serviceCell;
    customers = new CustomerManager(inventory, ledgerRef.current,
      new CommandDispatcher(ledgerRef.current, inventory), 1, {
        shelfServicePos: shelfCell,
        checkoutServicePos: checkoutCell,
        checkoutQueueWaitPos: { x: checkoutCell.x - 1, z: checkoutCell.z + 1 },
        entrancePos: { x: 29, z: 59 },
      });
    customerRef.current = customers;
    void initializeSave();

    const handleVisibilityChange = () => {
      lifecycle.setPlatformActive('visibility', document.visibilityState === 'visible');
    };
    const handlePageHide = () => lifecycle.setPlatformActive('pagehide', false);
    const handlePageShow = () => lifecycle.setPlatformActive('pagehide', true);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);
    let capacitorListeners: PluginListenerHandle[] = [];
    if (Capacitor.isNativePlatform()) {
      void Promise.all([
        CapacitorApp.addListener('appStateChange', ({ isActive }) => {
          lifecycle.setPlatformActive('capacitor-app-state', isActive);
        }),
        CapacitorApp.addListener('pause', () => lifecycle.setPlatformActive('capacitor-pause', false)),
        CapacitorApp.addListener('resume', () => lifecycle.setPlatformActive('capacitor-pause', true)),
      ]).then((listeners) => {
        if (effectDisposed) {
          void Promise.all(listeners.map((listener) => listener.remove()));
          return;
        }
        capacitorListeners = listeners;
      }).catch(onSaveError);
    }
    lifecycle.setPlatformActive('visibility', document.visibilityState === 'visible');

    // 1. Three.js Sahnesini Başlat
    const renderer = new SceneRenderer(canvas);
    rendererRef.current = renderer;
    renderer.updateFixtures(placement.getFixtures());

    // 2. Input Manager ile Pointer Sahipliği ve Dokunmatik Kontrolleri Bağla
    const inputManager = new InputManager(canvas, (sx, sy) => renderer.raycastGround(sx, sy));
    inputManagerRef.current = inputManager;

    inputManager.setOnMoveTarget((targetX, targetZ) => {
      if (buildModeRef.current) {
        const cell = { x: Math.round(targetX), z: Math.round(targetZ) };
        draftCellRef.current = cell;
        const preview = placement.preview(cell, [playerPosRef.current, worker!.serialize().position]);
        const shelf = placement.getFixtures(cell).find((fixture) => fixture.id === 'fixture.sales_shelf')!;
        renderer.showPlacementPreview(shelf, preview.valid);
        setHudMessage(preview.valid ? 'Raf yeri geçerli; onaylayabilir veya iptal edebilirsin.' : preview.reasons.join('; '));
        return;
      }
      // Hedef yürünebilir bir alanda mı?
      if (placement.isWalkable(targetX, targetZ)) {
        playerTargetRef.current = { x: targetX, z: targetZ };
        renderer.showTargetMarker(targetX, targetZ);
        setHudMessage(`Hedefe gidiliyor: (${targetX.toFixed(1)}, ${targetZ.toFixed(1)})`);
      } else {
        setHudMessage('Geçersiz konum: Duvar veya engel!');
      }
    });

    inputManager.setOnJoystickMove((vec) => {
      joystickVecRef.current = vec;
      if (vec.x !== 0 || vec.z !== 0) {
        playerTargetRef.current = null; // Sürükleme başladığında tap hedefini iptal et
        renderer.hideTargetMarker();
      }
    });

    // 3. Pencere Boyutlandırma
    const handleResize = () => {
      if (canvas && renderer) {
        renderer.resize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // 4. Render & Simülasyon Döngüsü (10 Hz Tick + 60 FPS Render)
    let animationFrameId: number;
    lastRenderTimeRef.current = performance.now();

    const loop = (currentTimeMs: number) => {
      const deltaMs = Math.max(0, currentTimeMs - lastRenderTimeRef.current);
      lastRenderTimeRef.current = currentTimeMs;

      // Sabit 100 ms Simülasyon Saati
      if (saveReadyRef.current && !saveBlockedRef.current && !saveBusyRef.current) {
        clockRef.current.update(deltaMs, (tick) => {
          setCurrentTick(tick);
          previousPlayerPosRef.current = { ...playerPosRef.current };
          const movement = stepPlayerMovement(
            playerPosRef.current, playerTargetRef.current, joystickVecRef.current,
            (x, z) => placement.isWalkable(x, z)
          );
          playerPosRef.current = movement.position;
          if (movement.rotation !== null) playerRotationRef.current = movement.rotation;
          if (movement.reachedTarget) {
            playerTargetRef.current = null;
            renderer.hideTargetMarker();
          }
          try {
            if (isNativePlatform) {
              const commit = runDurableProductionTick(
                tick, productionManager, inventory, ledgerRef.current, captureSavePayload,
                (transaction) => Promise.resolve(saveService.appendTransaction(transaction))
              );
              if (commit) {
                saveBusyRef.current = true;
                clockRef.current.pause();
                void commit.then(() => {
                  saveBusyRef.current = false;
                  if (!lifecycle.isPaused()) clockRef.current.resume();
                }).catch((error: unknown) => {
                  saveBusyRef.current = false;
                  lifecycle.blockForSaveError(error);
                });
              }
            } else productionManager.tick(tick);
            const bottler = productionManager.getMachine('station.bottler');
            if (bottler) setBottlerStatus(`${bottler.status}: ${bottler.waitReason}`);
            if (!saveBusyRef.current && worker) {
              const workerCommit = worker.step(tick);
              const workerBlock = worker.serialize().blockedReason;
              if (workerBlock) setWorkerStatus(workerBlock);
              if (workerCommit) {
                saveBusyRef.current = true;
                clockRef.current.pause();
                void workerCommit.then(() => {
                  saveBusyRef.current = false;
                  const state = worker?.serialize();
                  setWorkerStatus(state?.task ? 'Ürün rafa taşınıyor' : 'İkmal tamamlandı');
                  if (!lifecycle.isPaused()) clockRef.current.resume();
                }).catch((error: unknown) => {
                  saveBusyRef.current = false;
                  lifecycle.blockForSaveError(error);
                });
              }
              if (!saveBusyRef.current && customers) {
                const customerCommit = runDurableCustomerTick(
                  tick, customers, inventory, ledgerRef.current, captureSavePayload,
                  (transaction) => Promise.resolve(saveService.appendTransaction(transaction)),
                );
                const active = customers.getAllCustomers()[0];
                setCustomerStatus(customerStatusLabel(active,
                  Boolean(customerCommit && active?.leaveReason === 'PURCHASE_COMPLETED')));
                if (customerCommit) {
                  saveBusyRef.current = true;
                  clockRef.current.pause();
                  void customerCommit.then(() => {
                    saveBusyRef.current = false;
                    setCustomerStatus(customerStatusLabel(customers?.getAllCustomers()[0]));
                    const sales = customers?.getCompletedSales() ?? [];
                    if (sales.length > lastSaleCountRef.current) {
                      const sale = sales[sales.length - 1];
                      lastSaleCountRef.current = sales.length;
                      setBalanceCredits(ledgerRef.current.getBalanceCredits());
                      setHudMessage(`${sale.itemId} satıldı: ${(sale.amountAtoms / ATOMS_PER_CREDIT).toFixed(2)} Kredi.`);
                    }
                    if (!lifecycle.isPaused()) clockRef.current.resume();
                  }).catch((error: unknown) => {
                    saveBusyRef.current = false;
                    setCustomerStatus(customerStatusLabel(customers?.getAllCustomers()[0]));
                    lifecycle.blockForSaveError(error);
                  });
                }
              }
            }
          } catch (error) {
            lifecycle.blockForSaveError(error);
            return;
          }
          if (!saveBusyRef.current && tick - lastCheckpointTickRef.current >= 300) {
            void checkpoint().catch((error: unknown) => lifecycle.blockForSaveError(error));
          }
        });
      }

      // Render only interpolates fixed-tick movement; it never changes logical position.
      const alpha = clockRef.current.getPaused() ? 1 : clockRef.current.getInterpolationAlpha();
      const currentPos = {
        x: previousPlayerPosRef.current.x + (playerPosRef.current.x - previousPlayerPosRef.current.x) * alpha,
        z: previousPlayerPosRef.current.z + (playerPosRef.current.z - previousPlayerPosRef.current.z) * alpha,
      };

      // Sahne ve Karakter Görselini Güncelle
      renderer.updatePlayer({
        x: currentPos.x,
        z: currentPos.z,
        rotation: playerRotationRef.current,
      });
      if (worker) renderer.updateWorker(worker.serialize().position);
        if (customers) renderer.updateCustomer(customers.getAllCustomers()[0]?.position ?? null);

      renderer.updateInventoryVisuals({
        shelf: inventory.getLotsAt({ kind: 'shelf', ownerId: 'fixture.sales_shelf' }),
        shelfCapacity: inventory.getCapacity({ kind: 'shelf', ownerId: 'fixture.sales_shelf' }),
        bottlerOutput: inventory.getLotsAt({ kind: 'machineOutput', ownerId: 'station.bottler' }),
        cropOutput: inventory.getLotsAt({ kind: 'machineOutput', ownerId: 'source.crop_plot' }),
        playerLoad: inventory.getLotsAt({ kind: 'player', ownerId: 'player' }),
        workerLoad: inventory.getLotsAt({ kind: 'worker', ownerId: 'worker.shelf.1' }),
      });

      // En yakın istasyonu tespit et
      let closestName = 'Boşluk';
      let minDist = 2.5;
      for (const fixture of placement.getFixtures()) {
        const dx = playerPosRef.current.x - fixture.serviceCell.x;
        const dz = playerPosRef.current.z - fixture.serviceCell.z;
        const d = Math.sqrt(dx * dx + dz * dz);
        if (d < minDist) {
          minDist = d;
          closestName = fixture.name;
        }
      }
      setNearestFixture(closestName);

      // Çiz
      renderer.render();
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      effectDisposed = true;
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      void Promise.all(capacitorListeners.map((listener) => listener.remove()));
      window.removeEventListener('resize', handleResize);
      inputManager.destroy();
      renderer.destroy();
      lifecycleRef.current = null;
      dispatcherRef.current = null;
      inventoryRef.current = null;
      productionRef.current = null;
      workerRef.current = null;
      customerRef.current = null;
      placementRef.current = null;
      playerTransferRef.current = null;
      captureSavePayloadRef.current = null;
      saveReadyRef.current = false;
    };
  }, []);

  const togglePause = () => {
    if (buildModeRef.current) return;
    const nextPaused = !uiPausedRef.current;
    uiPausedRef.current = nextPaused;
    lifecycleRef.current?.setUiPaused(nextPaused);
    setHudMessage(nextPaused ? 'Simülasyon duraklatıldı.' : 'Simülasyon devam ediyor.');
  };

  const stopJoystick = () => {
    joystickPointerRef.current = null;
    joystickVecRef.current = { x: 0, z: 0 };
    setJoystickOffset({ x: 0, y: 0 });
  };

  const updateJoystick = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerId !== joystickPointerRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const radius = bounds.width * 0.34;
    const dx = event.clientX - (bounds.left + bounds.width / 2);
    const dy = event.clientY - (bounds.top + bounds.height / 2);
    const length = Math.hypot(dx, dy);
    const scale = length > radius ? radius / length : 1;
    const offset = { x: dx * scale, y: dy * scale };
    const deadzone = radius * 0.12;
    joystickVecRef.current = length < deadzone
      ? { x: 0, z: 0 }
      : { x: offset.x / radius, z: offset.y / radius };
    setJoystickOffset(offset);
  };

  const handleJoystickPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    joystickPointerRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    playerTargetRef.current = null;
    rendererRef.current?.hideTargetMarker();
    updateJoystick(event);
  };

  const handleJoystickPointerEnd = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (event.pointerId === joystickPointerRef.current) stopJoystick();
  };

  const transferPlayerLoad = async () => {
    const inventory = inventoryRef.current;
    const service = playerTransferRef.current;
    if (!inventory || !service || !saveReadyRef.current || saveBlockedRef.current || saveBusyRef.current || buildModeRef.current) return;
    const fixture = (placementRef.current?.getFixtures() ?? WorldLayout.FIXTURES)
      .map((candidate) => ({ candidate, distance: Math.hypot(
        playerPosRef.current.x - candidate.serviceCell.x,
        playerPosRef.current.z - candidate.serviceCell.z,
      ) }))
      .sort((a, b) => a.distance - b.distance)[0];
    if (!fixture || fixture.distance > 1.25) {
      setHudMessage('Ürün almak veya bırakmak için istasyonun servis noktasına yaklaş.');
      return;
    }

    const playerLocation: StockLocation = { kind: 'player', ownerId: 'player' };
    const cargo = inventory.getLotsAt(playerLocation)[0];
    let source: StockLocation;
    let target: StockLocation;
    let itemId: ItemId;
    if (cargo) {
      source = playerLocation;
      itemId = cargo.itemId;
      if (cargo.itemId === 'item.raw_water' &&
          (fixture.candidate.id === 'station.bottler' || fixture.candidate.id === 'source.crop_plot')) {
        target = { kind: 'machineInput', ownerId: fixture.candidate.id };
      } else if (cargo.itemId !== 'item.raw_water' && fixture.candidate.id === 'fixture.sales_shelf') {
        target = { kind: 'shelf', ownerId: fixture.candidate.id };
      } else if (cargo.itemId === 'item.raw_water' && fixture.candidate.id === 'source.spring_water') {
        target = { kind: 'source', ownerId: fixture.candidate.id };
      } else {
        setHudMessage('Bu yük buraya bırakılamaz. Suyu üretim istasyonuna, ürünü rafa götür.');
        return;
      }
    } else {
      target = playerLocation;
      if (fixture.candidate.id === 'source.spring_water') {
        source = { kind: 'source', ownerId: fixture.candidate.id };
        itemId = 'item.raw_water';
      } else if (fixture.candidate.id === 'station.bottler' || fixture.candidate.id === 'source.crop_plot') {
        source = { kind: 'machineOutput', ownerId: fixture.candidate.id };
        const output = inventory.getLotsAt(source)[0];
        if (!output) {
          setHudMessage('Hazır ürün yok. Girdi ve üretim bekleme nedenini kontrol et.');
          return;
        }
        itemId = output.itemId;
      } else {
        setHudMessage('Bu noktada alınacak ürün yok. Çeşmeye veya üretim çıktısına git.');
        return;
      }
    }
    const quantity = Math.min(
      inventory.getAvailableQuantity(source, itemId),
      inventory.getAvailableCapacity(target),
      cargo?.quantity ?? 5,
    );
    if (quantity < 1) {
      setHudMessage('Transfer yapılamıyor: kaynak boş veya hedef dolu.');
      return;
    }
    saveBusyRef.current = true;
    try {
      await service.transfer({ source, target, itemId, quantity,
        tick: clockRef.current.getTick(), playerPosition: playerPosRef.current,
        servicePosition: fixture.candidate.serviceCell });
      setPlayerLoad(inventory.getLotsAt(playerLocation)
        .map((lot) => `${lot.quantity} ${lot.itemId}`).join(', ') || 'Boş');
      setHudMessage(`${quantity} ${itemId} ${cargo ? 'bırakıldı' : 'alındı'} ve kaydedildi.`);
    } catch (error) {
      if (error instanceof Error && /INSUFFICIENT_STOCK|EXCEEDS_CAPACITY|servis noktasına|Geçersiz/.test(error.message)) {
        setHudMessage(error.message);
      } else lifecycleRef.current?.blockForSaveError(error);
    } finally {
      saveBusyRef.current = false;
    }
  };

  const chooseBottlerRecipe = async (recipeId: RecipeId) => {
    const production = productionRef.current;
    const saveService = saveServiceRef.current;
    const payload = captureSavePayloadRef.current;
    if (!production || !saveService || !payload || !saveReadyRef.current ||
        saveBlockedRef.current || saveBusyRef.current || buildModeRef.current) return;
    const servicePosition = (placementRef.current?.getFixtures() ?? WorldLayout.FIXTURES)
      .find((fixture) => fixture.id === 'station.bottler')!.serviceCell;
    if (Math.hypot(playerPosRef.current.x - servicePosition.x,
      playerPosRef.current.z - servicePosition.z) > 1.25) {
      setHudMessage('Tarif seçmek için şişeleme tezgâhının servis noktasına yaklaş.');
      return;
    }
    saveBusyRef.current = true;
    try {
      await selectDurableP0Recipe(production, recipeId, clockRef.current.getTick(), payload,
        (transaction) => Promise.resolve(saveService.appendTransaction(transaction)));
      setSelectedRecipe(recipeId);
      setHudMessage('Şişeleme tarifi kaydedildi. Girdi gerekiyorsa çeşmeden su taşı.');
    } catch (error) {
      if (error instanceof Error && /Tarif bu istasyonda/.test(error.message)) setHudMessage(error.message);
      else lifecycleRef.current?.blockForSaveError(error);
    } finally {
      saveBusyRef.current = false;
    }
  };

  const delegateRestock = async () => {
    const worker = workerRef.current;
    const inventory = inventoryRef.current;
    if (!worker || !inventory || !saveReadyRef.current || saveBlockedRef.current || saveBusyRef.current) return;
    if (worker.serialize().task) {
      setHudMessage('Raf görevlisi mevcut ikmal işini tamamlıyor.');
      return;
    }
    const shelf = { kind: 'shelf', ownerId: 'fixture.sales_shelf' } as const;
    const sellable = new Set(['item.glass_water_small', 'item.water_jug_5l',
      'item.water_carboy_19l', 'item.heirloom_tomato']);
    const lot = inventory.getAllLots().find((candidate) => candidate.location.kind === 'machineOutput' &&
      sellable.has(candidate.itemId) && inventory.getAvailableQuantity(candidate.location, candidate.itemId) > 0);
    if (!lot) {
      setHudMessage('Görevliye verilecek hazır ürün bulunmuyor; üretim çıktısını kontrol edin.');
      return;
    }
    const fixtures = placementRef.current?.getFixtures() ?? WorldLayout.FIXTURES;
    const sourceFixture = fixtures.find((fixture) => fixture.id === lot.location.ownerId);
    const shelfFixture = fixtures.find((fixture) => fixture.id === shelf.ownerId);
    if (!sourceFixture || !shelfFixture) return;
    const quantity = Math.min(5, inventory.getAvailableQuantity(lot.location, lot.itemId),
      inventory.getAvailableCapacity(shelf));
    if (quantity < 1) {
      setHudMessage('Raf dolu veya başka bir ikmal için ayrılmış.');
      return;
    }
    saveBusyRef.current = true;
    try {
      await worker.delegate({ source: lot.location, target: shelf,
        sourcePosition: sourceFixture.serviceCell, targetPosition: shelfFixture.serviceCell,
        itemId: lot.itemId, quantity }, clockRef.current.getTick());
      setWorkerStatus(`${quantity} ürün için yola çıktı`);
      setHudMessage(`Raf görevlisine ${quantity} ürünlük ikmal devredildi.`);
    } catch (error) {
      if (error instanceof Error && /INSUFFICIENT_STOCK|EXCEEDS_CAPACITY|zaten bir ikmal/.test(error.message)) {
        setHudMessage(error.message);
      } else lifecycleRef.current?.blockForSaveError(error);
    } finally {
      saveBusyRef.current = false;
    }
  };

  const showPlacementDraft = (cell: { x: number; z: number }) => {
    const placement = placementRef.current;
    const renderer = rendererRef.current;
    if (!placement || !renderer) return;
    draftCellRef.current = cell;
    const actors = [playerPosRef.current];
    const workerPosition = workerRef.current?.serialize().position;
    if (workerPosition) actors.push(workerPosition);
    const preview = placement.preview(cell, actors);
    const shelf = placement.getFixtures(cell).find((fixture) => fixture.id === 'fixture.sales_shelf')!;
    renderer.showPlacementPreview(shelf, preview.valid);
    setHudMessage(preview.valid ? 'Raf yeri geçerli. Onayla veya iptal et.' : preview.reasons.join('; '));
  };

  const closeBuildMode = () => {
    rendererRef.current?.hidePlacementPreview();
    draftCellRef.current = null;
    buildModeRef.current = false;
    setIsBuildMode(false);
    uiPausedRef.current = buildWasPausedRef.current;
    lifecycleRef.current?.setUiPaused(buildWasPausedRef.current);
  };

  const beginBuildMode = () => {
    if (!saveReadyRef.current || saveBlockedRef.current || saveBusyRef.current) return;
    if (workerRef.current?.serialize().task) {
      setHudMessage('Görevli yük taşırken raf yeri değiştirilemez.');
      return;
    }
    if (customerRef.current?.getAllCustomers().length) {
      setHudMessage('Müşteri alışverişteyken raf yeri değiştirilemez.');
      return;
    }
    const placement = placementRef.current;
    if (!placement) return;
    buildWasPausedRef.current = uiPausedRef.current;
    uiPausedRef.current = true;
    buildModeRef.current = true;
    setIsBuildMode(true);
    lifecycleRef.current?.setUiPaused(true);
    playerTargetRef.current = null;
    joystickVecRef.current = { x: 0, z: 0 };
    showPlacementDraft(placement.serialize().shelfCell);
  };

  const confirmPlacement = async () => {
    if (!buildModeRef.current || saveBusyRef.current) return;
    const placement = placementRef.current;
    const saveService = saveServiceRef.current;
    const cell = draftCellRef.current;
    if (!placement || !saveService || !cell || !captureSavePayloadRef.current) return;
    if (workerRef.current?.serialize().task) {
      setHudMessage('Görevli yük taşırken raf yeri değiştirilemez.');
      return;
    }
    saveBusyRef.current = true;
    try {
      const tick = clockRef.current.getTick();
      await placement.moveShelf({ transactionId: `move-shelf:${tick}:${placement.serialize().committedTransactions.length + 1}`,
        cell, actors: [playerPosRef.current, workerRef.current!.serialize().position] },
      async (transactionId) => {
        await Promise.resolve(saveService.appendTransaction({ transactionId, type: 'MOVE_SHELF', tick,
          payload: captureSavePayloadRef.current!() }));
      });
      rendererRef.current?.updateFixtures(placement.getFixtures());
      customerRef.current?.setShelfServicePosition(placement.getFixtures()
        .find((fixture) => fixture.id === 'fixture.sales_shelf')!.serviceCell);
      closeBuildMode();
      setHudMessage('Raf yeni yerine kaydedildi.');
    } catch (error) {
      if (error instanceof Error && /Raf |footprint|koridor|kapısı|servis|erişilemiyor|engelin/.test(error.message)) {
        setHudMessage(error.message);
      } else lifecycleRef.current?.blockForSaveError(error);
    } finally {
      saveBusyRef.current = false;
    }
  };

  const reconcileSave = async (acceptVerifiedRecovery: boolean) => {
    try {
      if (saveBusyRef.current) return;
      saveBusyRef.current = true;
      const saveService = saveServiceRef.current;
      if (!saveService) throw new Error('Kayıt servisi hazır değil');
      const loaded = await saveService.load();
      if (!loaded.payload) throw new Error('Kurtarılabilir bir kayıt bulunamadı; yeni kayıt otomatik oluşturulmadı.');
      if (loaded.recovery && !acceptVerifiedRecovery) {
        setHasRecoveryCandidate(true);
        setHudMessage(`Son güvenilir kayıt bulundu: ${loaded.recovery.detail}`);
        return;
      }

      const migration = migrateWorldSavePayload(loaded.payload);
      const payload = migration.payload;
      if (payload.worldModules) WorldLayout.restoreActiveModules(payload.worldModules.activeModuleIds);
      if (
        payload.simulationTick !== loaded.tick ||
        !Number.isFinite(payload.playerPosition?.x) ||
        !Number.isFinite(payload.playerPosition?.z)
      ) {
        throw new Error('Kayıt alanları doğrulanamadı');
      }
      ledgerRef.current.restore(payload.ledger);
      const inventory = inventoryRef.current;
      const production = productionRef.current;
      const worker = workerRef.current;
      const customers = customerRef.current;
      const placement = placementRef.current;
      if (!inventory || !production || !worker || !placement || !customers) throw new Error('Üretim, envanter, görevli, müşteri veya yerleşim hazır değil');
      if (payload.inventory || payload.production) {
        if (!payload.inventory || !payload.production) {
          throw new Error('Kayıt envanter ve üretim durumunun yalnızca birini içeriyor');
        }
        inventory.restore(payload.inventory);
        setPlayerLoad(inventory.getLotsAt({ kind: 'player', ownerId: 'player' })
          .map((lot) => `${lot.quantity} ${lot.itemId}`).join(', ') || 'Boş');
        production.restore(payload.production);
        setSelectedRecipe(production.getMachine('station.bottler')?.selectedRecipeId ?? 'recipe.bottle_glass_water_small');
        if (payload.placement) {
          placement.restore(payload.placement);
          customers.setShelfServicePosition(placement.getFixtures()
            .find((fixture) => fixture.id === 'fixture.sales_shelf')!.serviceCell);
        }
        if (payload.worker) worker.restore(payload.worker);
        if (payload.customers) customers.restore(payload.customers);
        rendererRef.current?.updateFixtures(placement.getFixtures());
        setWorkerStatus(worker.serialize().task ? 'İkmal işine dönüyor' : 'Görev bekliyor');
      }
      clockRef.current.setState({ currentTick: loaded.tick, isPaused: false });
      playerPosRef.current = { ...payload.playerPosition };
      previousPlayerPosRef.current = { ...payload.playerPosition };
      await saveService.checkpoint({
        tick: loaded.tick,
        payload: {
          ...payload,
          inventory: inventory.serialize(),
          production: production.serialize(),
          worker: worker.serialize(),
          customers: customers.serialize(),
          placement: placement.serialize(),
        },
      });
      lastCheckpointTickRef.current = loaded.tick;
      saveReadyRef.current = true;
      saveBlockedRef.current = false;
      setIsSaveReady(true);
      setIsSaveBlocked(false);
      setHasRecoveryCandidate(false);
      setCurrentTick(loaded.tick);
      setBalanceCredits(ledgerRef.current.getBalanceCredits());
      lastSaleCountRef.current = customers.getCompletedSales().length;
      lifecycleRef.current?.clearSaveBlock();
      setHudMessage(loaded.recovery ? 'Son güvenilir kayıt kurtarıldı ve doğrulandı.' : 'Kayıt yeniden doğrulandı.');
    } catch (error) {
      saveReadyRef.current = false;
      saveBlockedRef.current = true;
      setIsSaveReady(false);
      setIsSaveBlocked(true);
      lifecycleRef.current?.blockForSaveError(error);
      setHudMessage(`Kayıt kurtarılamadı: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      saveBusyRef.current = false;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-stone-900 font-mono">
      {/* 3B Three.js Tuvali */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block touch-none z-0"
      />

      {/* Neo-Brutalist HUD Kalkan Katmanı (data-ui="true" ile tıklamalar 3D dünyaya sızmaz) */}
      <div
        id="hud-layer"
        data-ui="true"
        className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-10"
      >
        {/* Üst Durum Çubuğu */}
        <header
          data-ui="true"
          className="pointer-events-auto flex items-center justify-between bg-[#F4F0E6] text-[#171717] border-3 border-[#171717] shadow-[4px_4px_0px_0px_#171717] px-4 py-2.5 rounded-lg"
        >
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-stone-600">
              ORBIT MARKET · P0
            </div>
            <div className="text-lg font-black text-emerald-700">
              {balanceCredits.toFixed(2)} KREDİ
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-stone-500 font-bold">SİMÜLASYON</div>
              <div className="text-sm font-black">Tick #{currentTick}</div>
            </div>

            <button
              data-ui="true"
              onClick={togglePause}
              disabled={isBuildMode}
              className={`px-3 py-1.5 text-xs font-black border-2 border-[#171717] shadow-[2px_2px_0px_0px_#171717] transition-transform active:translate-x-0.5 active:translate-y-0.5 rounded ${
                isPaused ? 'bg-amber-400 text-black' : 'bg-[#35D9E6] text-black'
              }`}
            >
              {isPaused ? 'DEVAM ET' : 'DURAKLAT'}
            </button>
          </div>
        </header>

        <button
          type="button"
          data-ui="true"
          aria-label="Karakter hareket kumandası"
          disabled={!isSaveReady || isSaveBlocked || isBuildMode || isPaused}
          onPointerDown={handleJoystickPointerDown}
          onPointerMove={updateJoystick}
          onPointerUp={handleJoystickPointerEnd}
          onPointerCancel={handleJoystickPointerEnd}
          onLostPointerCapture={handleJoystickPointerEnd}
          className="absolute left-5 pointer-events-auto touch-none rounded-full border-4 border-[#171717] bg-[#F4F0E6]/90 shadow-[4px_4px_0px_0px_#171717] disabled:opacity-55"
          style={{
            bottom: 'calc(19rem + env(safe-area-inset-bottom))',
            width: 112,
            height: 112,
          }}
        >
          <span aria-hidden="true" className="absolute inset-[22%] rounded-full border-2 border-stone-400/70" />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 rounded-full border-3 border-[#171717] bg-[#35D9E6] shadow-[2px_2px_0px_0px_#171717]"
            style={{
              width: 44,
              height: 44,
              marginLeft: -22,
              marginTop: -22,
              transform: `translate(${joystickOffset.x}px, ${joystickOffset.y}px)`,
            }}
          />
        </button>

        {/* Alt Bilgi ve Kontrol Paneli */}
        <footer
          data-ui="true"
          className="pointer-events-auto flex flex-col gap-2 bg-[#F4F0E6] text-[#171717] border-3 border-[#171717] shadow-[4px_4px_0px_0px_#171717] p-3 rounded-lg"
        >
          <div className="flex items-center justify-between text-xs font-bold border-b-2 border-stone-300 pb-1.5">
            <span className="text-stone-600">KONUM:</span>
            <span className="bg-[#FFE156] px-2 py-0.5 border border-black rounded text-black font-black">
              {nearestFixture}
            </span>
          </div>

          <div role="status" aria-live="polite" className="max-h-16 overflow-y-auto break-words text-xs font-medium text-stone-700 leading-tight">
            {hudMessage}
          </div>
          <div className="flex items-center justify-between gap-2 text-xs font-bold">
            <span>YÜK: {playerLoad}</span>
            <button data-ui="true" disabled={!isSaveReady || isSaveBlocked || isBuildMode}
              onClick={() => void transferPlayerLoad()}
              className="px-2 py-1.5 bg-[#FFE156] border-2 border-black rounded disabled:opacity-50">
              AL / BIRAK
            </button>
          </div>
          {nearestFixture === 'Şişeleme Tezgâhı' && (
            <div className="flex flex-col gap-1 text-xs font-bold">
              <span>ŞİŞELEME: {bottlerStatus}</span>
              <div className="flex gap-1">
                {([['KÜÇÜK', 'recipe.bottle_glass_water_small'],
                  ['5 L', 'recipe.bottle_jug_5l'],
                  ['19 L', 'recipe.bottle_carboy_19l']] as const).map(([label, recipeId]) => (
                  <button key={recipeId} data-ui="true" disabled={!isSaveReady || isSaveBlocked || isBuildMode}
                    onClick={() => void chooseBottlerRecipe(recipeId)}
                    className={`flex-1 border-2 border-black rounded px-1 py-1 ${selectedRecipe === recipeId ? 'bg-[#A7EB52]' : 'bg-white'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between gap-2 text-xs font-bold">
            <span>RAF GÖREVLİSİ: {workerStatus}</span>
            <button data-ui="true" disabled={!isSaveReady || isSaveBlocked || isBuildMode}
              onClick={() => void delegateRestock()}
              className="px-2 py-1.5 bg-[#35D9E6] border-2 border-black rounded disabled:opacity-50">
              İKMALİ DEVRET
            </button>
          </div>
          <div className="text-xs font-bold">{customerStatus}</div>

          {!isBuildMode ? (
            <button data-ui="true" disabled={!isSaveReady || isSaveBlocked}
              onClick={beginBuildMode}
              className="py-1.5 text-xs font-black bg-[#FFE156] border-2 border-black rounded disabled:opacity-50">
              RAF YERLEŞİMİ
            </button>
          ) : (
            <div className="flex flex-col gap-1 border-t-2 border-stone-300 pt-2 text-xs font-bold">
              <span>Rafı taşımak için zemine dokun veya 1 m adımlarla seç.</span>
              <div className="flex gap-1 justify-center">
                {([['←', -1, 0], ['↑', 0, -1], ['↓', 0, 1], ['→', 1, 0]] as const).map(([label, dx, dz]) => (
                  <button key={label} data-ui="true" onClick={() => {
                    const cell = draftCellRef.current;
                    if (cell) showPlacementDraft({ x: cell.x + dx, z: cell.z + dz });
                  }} className="w-10 h-9 bg-white border-2 border-black rounded">{label}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <button data-ui="true" onClick={() => void confirmPlacement()}
                  className="flex-1 py-1.5 bg-[#A7EB52] border-2 border-black rounded">ONAYLA</button>
                <button data-ui="true" onClick={closeBuildMode}
                  className="flex-1 py-1.5 bg-white border-2 border-black rounded">İPTAL</button>
              </div>
            </div>
          )}


          {isSaveBlocked && (
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                data-ui="true"
                onClick={() => reconcileSave(false)}
                className="flex-1 py-1.5 text-xs font-black bg-[#35D9E6] text-black border-2 border-[#171717] shadow-[2px_2px_0px_0px_#171717] rounded"
              >
                YENİDEN DENE
              </button>
              {hasRecoveryCandidate && (
                <button
                  data-ui="true"
                  onClick={() => reconcileSave(true)}
                  className="flex-1 py-1.5 text-xs font-black bg-[#FFE156] text-black border-2 border-[#171717] shadow-[2px_2px_0px_0px_#171717] rounded"
                >
                  SON İYİ KAYDI KURTAR
                </button>
              )}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
