import { useEffect, useRef, useState } from 'react';
import { SceneRenderer } from './presentation/world/SceneRenderer';
import { WorldLayout } from './presentation/world/WorldLayout';
import { InputManager } from './presentation/input/InputManager';
import { SimulationClock } from './domain/time/clock';
import { EconomyLedger } from './domain/economy/ledger';
import { ATOMS_PER_CREDIT } from './domain/constants';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<SceneRenderer | null>(null);
  const inputManagerRef = useRef<InputManager | null>(null);

  // Simülasyon saat ve ledger durumları
  const clockRef = useRef<SimulationClock>(new SimulationClock());
  const ledgerRef = useRef<EconomyLedger>(new EconomyLedger(100 * ATOMS_PER_CREDIT)); // 100 Kredi başlangıç

  // Oyuncu mantıksal hareket durumu
  const playerPosRef = useRef({ x: WorldLayout.PLAYER_SPAWN.x, z: WorldLayout.PLAYER_SPAWN.z });
  const playerTargetRef = useRef<{ x: number; z: number } | null>(null);
  const joystickVecRef = useRef<{ x: number; z: number }>({ x: 0, z: 0 });
  const playerRotationRef = useRef(0);

  // UI state
  const [balanceCredits, setBalanceCredits] = useState(100);
  const [currentTick, setCurrentTick] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [nearestFixture, setNearestFixture] = useState<string>('Boşluk');
  const [hudMessage, setHudMessage] = useState<string>('Dünyaya dokunarak karakterinizi hareket ettirin.');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Three.js Sahnesini Başlat
    const renderer = new SceneRenderer(canvas);
    rendererRef.current = renderer;

    // 2. Input Manager ile Pointer Sahipliği ve Dokunmatik Kontrolleri Bağla
    const inputManager = new InputManager(canvas, (sx, sy) => renderer.raycastGround(sx, sy));
    inputManagerRef.current = inputManager;

    inputManager.setOnMoveTarget((targetX, targetZ) => {
      // Hedef yürünebilir bir alanda mı?
      if (WorldLayout.isWalkable(targetX, targetZ)) {
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
    let lastTimeMs = performance.now();

    const loop = (currentTimeMs: number) => {
      const deltaMs = currentTimeMs - lastTimeMs;
      lastTimeMs = currentTimeMs;

      // Sabit 100 ms Simülasyon Saati
      clockRef.current.update(deltaMs, (tick) => {
        setCurrentTick(tick);
      });

      // Oyuncu Hareketi (Render adımında pürüzsüz interpolasyon)
      const currentPos = playerPosRef.current;
      const speed = 4.0; // 4 m/s yürüyüş hızı
      const dt = Math.min(deltaMs / 1000, 0.05);

      let moveX = 0;
      let moveZ = 0;

      // Sanal joystick hareketi
      if (joystickVecRef.current.x !== 0 || joystickVecRef.current.z !== 0) {
        moveX = joystickVecRef.current.x * speed * dt;
        moveZ = joystickVecRef.current.z * speed * dt;
      }
      // Tap-to-move hareketi
      else if (playerTargetRef.current) {
        const dx = playerTargetRef.current.x - currentPos.x;
        const dz = playerTargetRef.current.z - currentPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 0.1) {
          moveX = (dx / dist) * Math.min(dist, speed * dt);
          moveZ = (dz / dist) * Math.min(dist, speed * dt);
        } else {
          playerTargetRef.current = null;
          renderer.hideTargetMarker();
        }
      }

      // Çarpışma ve Yürünebilirlik Kontrolü
      if (moveX !== 0 || moveZ !== 0) {
        const nextX = currentPos.x + moveX;
        const nextZ = currentPos.z + moveZ;

        // X ekseninde hareket kontrolü
        if (WorldLayout.isWalkable(nextX, currentPos.z)) {
          currentPos.x = nextX;
        }
        // Z ekseninde hareket kontrolü
        if (WorldLayout.isWalkable(currentPos.x, nextZ)) {
          currentPos.z = nextZ;
        }

        // Karakter dönüş açısı
        playerRotationRef.current = Math.atan2(moveX, moveZ);
      }

      // Sahne ve Karakter Görselini Güncelle
      renderer.updatePlayer({
        x: currentPos.x,
        z: currentPos.z,
        rotation: playerRotationRef.current,
      });

      // En yakın istasyonu tespit et
      let closestName = 'Boşluk';
      let minDist = 2.5;
      for (const fixture of WorldLayout.FIXTURES) {
        const dx = currentPos.x - fixture.serviceCell.x;
        const dz = currentPos.z - fixture.serviceCell.z;
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
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      inputManager.destroy();
      renderer.destroy();
    };
  }, []);

  const togglePause = () => {
    if (clockRef.current.getPaused()) {
      clockRef.current.resume();
      setIsPaused(false);
      setHudMessage('Simülasyon devam ediyor.');
    } else {
      clockRef.current.pause();
      setIsPaused(true);
      setHudMessage('Simülasyon duraklatıldı.');
    }
  };

  const handleTestDebit = () => {
    try {
      ledgerRef.current.commitTransaction({
        transactionId: `tx-ui-test-${Date.now()}`,
        timestampTick: clockRef.current.getTick(),
        type: 'DEBIT',
        amountAtoms: 5 * ATOMS_PER_CREDIT, // 5 Kredi
        reason: 'PURCHASE',
      });
      setBalanceCredits(ledgerRef.current.getBalanceCredits());
      setHudMessage('5 Kredi test harcaması yapıldı.');
    } catch (e: any) {
      setHudMessage(`Hata: ${e.message}`);
    }
  };

  const handleTestCredit = () => {
    ledgerRef.current.commitTransaction({
      transactionId: `tx-ui-test-${Date.now()}`,
      timestampTick: clockRef.current.getTick(),
      type: 'CREDIT',
      amountAtoms: 10 * ATOMS_PER_CREDIT, // 10 Kredi
      reason: 'SALE',
    });
    setBalanceCredits(ledgerRef.current.getBalanceCredits());
    setHudMessage('10 Kredi test geliri eklendi.');
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
              className={`px-3 py-1.5 text-xs font-black border-2 border-[#171717] shadow-[2px_2px_0px_0px_#171717] transition-transform active:translate-x-0.5 active:translate-y-0.5 rounded ${
                isPaused ? 'bg-amber-400 text-black' : 'bg-[#35D9E6] text-black'
              }`}
            >
              {isPaused ? 'DEVAM ET' : 'DURAKLAT'}
            </button>
          </div>
        </header>

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

          <div className="text-xs font-medium text-stone-700 leading-tight">
            {hudMessage}
          </div>

          {/* Test Butonları (Pointer sahipliği kanıtı: bu butonlara tıklandığında karakter arkaya yürümez) */}
          <div className="flex gap-2 pt-1">
            <button
              data-ui="true"
              onClick={handleTestDebit}
              className="flex-1 py-1.5 text-xs font-black bg-[#FF5733] text-white border-2 border-[#171717] shadow-[2px_2px_0px_0px_#171717] active:translate-x-0.5 active:translate-y-0.5 rounded"
            >
              -5 Kredi
            </button>
            <button
              data-ui="true"
              onClick={handleTestCredit}
              className="flex-1 py-1.5 text-xs font-black bg-[#A7EB52] text-black border-2 border-[#171717] shadow-[2px_2px_0px_0px_#171717] active:translate-x-0.5 active:translate-y-0.5 rounded"
            >
              +10 Kredi
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
