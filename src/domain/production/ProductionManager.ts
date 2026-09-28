// Orbit Market - Production Domain Manager
// Reference: OYUN_GELISTIRME_DEVIR_DOSYASI.md §26, §58.1, OYUN_SISTEMLERI_VE_ICERIK_KATALOGU.md §2-3, TEST_STRATEGY.md T-P0-05/05b/05c/05d/05e

import { ATOMS_PER_CREDIT } from '../constants';
import { EconomyLedger, DuplicateTransactionError } from '../economy/ledger';
import { InventoryManager } from '../inventory/InventoryManager';
import { P0_MACHINES, P0_RECIPES } from '../../content/p0Content';
import type {
  EntityId,
  ItemId,
  Machine,
  MachineBatch,
  RecipeDefinition,
  RecipeId,
  StockLocation,
} from '../types';

export interface ProductionTickResult {
  currentTick: number;
  completedBatches: Array<{
    machineId: EntityId;
    recipeId: RecipeId;
    outputs: Array<{ itemId: ItemId; quantity: number }>;
    energyCostAtoms: number;
  }>;
  producedWater: number;
}

export interface UpgradeResult {
  success: boolean;
  isDuplicate: boolean;
  machineId: EntityId;
  previousLevel: number;
  newLevel: number;
  costAtoms: number;
}

export interface ProductionSnapshot {
  machines: Machine[];
  processedUpgrades: string[];
  committedTransactions: string[];
}

export interface ProductionCommit {
  transactionId: string;
  type: 'PRODUCTION_SOURCE' | 'PRODUCTION_BATCH_STARTED' | 'PRODUCTION_BATCH_COMPLETED' | 'PRODUCTION_UPGRADE';
  tick: number;
  result?: unknown;
}

export type ProductionCommitObserver = (commit: ProductionCommit) => void;

export class ProductionManager {
  // ponytail: In-memory machines map. Fixed small machine count in P0 room (3 machines: spring, bottler, crop plot).
  // Ceiling: linear iteration over machines during tick. Upgrade path: spatial or state-based buckets if machine count grows.
  private machines: Map<EntityId, Machine>;
  private inventory: InventoryManager;
  private ledger: EconomyLedger;
  private processedUpgrades: Set<string>;
  private committedTransactions: Set<string>;
  private readonly onCommitted?: ProductionCommitObserver;

  constructor(
    inventory: InventoryManager,
    ledger: EconomyLedger,
    initialMachines: Machine[] = [],
    onCommitted?: ProductionCommitObserver
  ) {
    this.inventory = inventory;
    this.ledger = ledger;
    this.onCommitted = onCommitted;
    this.machines = new Map();
    this.processedUpgrades = new Set();
    this.committedTransactions = new Set();

    if (initialMachines.length > 0) {
      for (const m of initialMachines) {
        this.machines.set(m.id, { ...m });
      }
    } else {
      this.initDefaultP0Machines();
    }
  }

  /**
   * P0 kanonik makinelerini ve tampon kapasitelerini kurar.
   */
  public initDefaultP0Machines(): void {
    // 1. Memba Çeşmesi (source.spring_water)
    const spring: Machine = {
      id: 'source.spring_water',
      typeId: 'source.spring_water',
      gridPosition: { x: 6, z: 20 },
      direction: 0,
      level: 1,
      selectedRecipeId: 'recipe.collect_spring_water',
      status: 'Running',
      batch: null,
      progressTicks: 0,
      waitReason: 'PRODUCING',
    };
    this.machines.set(spring.id, spring);
    this.inventory.setCapacity({ kind: 'source', ownerId: spring.id }, 80);

    // 2. Şişeleme Tezgâhı (station.bottler)
    const bottler: Machine = {
      id: 'station.bottler',
      typeId: 'station.bottler',
      gridPosition: { x: 12, z: 22 },
      direction: 0,
      level: 1,
      selectedRecipeId: 'recipe.bottle_glass_water_small',
      status: 'Idle',
      batch: null,
      progressTicks: 0,
      waitReason: 'IDLE',
      energyCostAtoms: 300,
    };
    this.machines.set(bottler.id, bottler);
    this.inventory.setCapacity({ kind: 'machineInput', ownerId: bottler.id }, 40);
    this.inventory.setCapacity({ kind: 'machineOutput', ownerId: bottler.id }, 20);

    // 3. Domates Yatağı (source.crop_plot)
    const cropPlot: Machine = {
      id: 'source.crop_plot',
      typeId: 'source.crop_plot',
      gridPosition: { x: 6, z: 24 },
      direction: 0,
      level: 1,
      selectedRecipeId: 'recipe.grow_heirloom_tomato',
      status: 'Idle',
      batch: null,
      progressTicks: 0,
      waitReason: 'IDLE',
      energyCostAtoms: 0,
    };
    this.machines.set(cropPlot.id, cropPlot);
    this.inventory.setCapacity({ kind: 'machineInput', ownerId: cropPlot.id }, 20);
    this.inventory.setCapacity({ kind: 'machineOutput', ownerId: cropPlot.id }, 40);
  }

  /**
   * P0 açılış sarf malzemelerini ilgili istasyonlara ve kaynağa yükler (OYUN_GELISTIRME_DEVIR_DOSYASI.md §26.1).
   * 50 birim ham su, 12 küçük şişe, 4 adet 5L bidon, 2 damacana, 8 tohum.
   */
  public initializeP0Supplies(): void {
    const springSourceLoc: StockLocation = { kind: 'source', ownerId: 'source.spring_water' };
    const bottlerInputLoc: StockLocation = { kind: 'machineInput', ownerId: 'station.bottler' };
    const cropInputLoc: StockLocation = { kind: 'machineInput', ownerId: 'source.crop_plot' };

    // Eğer zaten stok varsa tekrar yükleme (idempotent init)
    if (this.inventory.getAllLots().some((lot) => lot.sourceId === 'initial_supplies')) {
      return;
    }

    // 1. 50 birim ham su haznede
    this.inventory.addLot({
      id: 'lot_initial_raw_water',
      itemId: 'item.raw_water',
      quantity: 50,
      qualityScore: 40,
      unitCostAtoms: 0,
      sourceId: 'initial_supplies',
      location: springSourceLoc,
    });

    // 2. Şişeleme giriş tamponunda ambalajlar: 12 küçük şişe, 4 adet 5L bidon, 2 damacana
    this.inventory.addLot({
      id: 'lot_initial_small_bottles',
      itemId: 'item.small_bottle',
      quantity: 12,
      qualityScore: 40,
      unitCostAtoms: 2_000, // 0.20 Kredi
      sourceId: 'initial_supplies',
      location: bottlerInputLoc,
    });

    this.inventory.addLot({
      id: 'lot_initial_jugs_5l',
      itemId: 'item.jug_5l_empty',
      quantity: 4,
      qualityScore: 40,
      unitCostAtoms: 7_000, // 0.70 Kredi
      sourceId: 'initial_supplies',
      location: bottlerInputLoc,
    });

    this.inventory.addLot({
      id: 'lot_initial_carboys_19l',
      itemId: 'item.carboy_19l_empty',
      quantity: 2,
      qualityScore: 40,
      unitCostAtoms: 20_000, // 2.00 Kredi
      sourceId: 'initial_supplies',
      location: bottlerInputLoc,
    });

    // 3. Domates yatağı giriş tamponunda 8 tohum
    this.inventory.addLot({
      id: 'lot_initial_tomato_seeds',
      itemId: 'item.tomato_seed',
      quantity: 8,
      qualityScore: 40,
      unitCostAtoms: 10_000, // 1.00 Kredi
      sourceId: 'initial_supplies',
      location: cropInputLoc,
    });
  }

  public getMachine(id: EntityId): Machine | undefined {
    return this.machines.get(id);
  }

  public getAllMachines(): Machine[] {
    return Array.from(this.machines.values());
  }

  public serialize(): ProductionSnapshot {
    return {
      machines: Array.from(this.machines.values()).map(cloneMachine),
      processedUpgrades: Array.from(this.processedUpgrades),
      committedTransactions: Array.from(this.committedTransactions),
    };
  }

  public restore(snapshot: ProductionSnapshot): void {
    if (!Array.isArray(snapshot.machines) || !Array.isArray(snapshot.processedUpgrades) || !Array.isArray(snapshot.committedTransactions)) {
      throw new Error('Production snapshot is incomplete');
    }
    const ids = new Set<string>();
    for (const machine of snapshot.machines) {
      if (!machine.id || ids.has(machine.id)) throw new Error('Production snapshot has a missing or duplicate machine ID');
      ids.add(machine.id);
    }
    this.machines.clear();
    for (const machine of snapshot.machines) this.machines.set(machine.id, cloneMachine(machine));
    this.processedUpgrades = new Set(snapshot.processedUpgrades);
    this.committedTransactions = new Set(snapshot.committedTransactions);
  }

  public registerMachine(machine: Machine): void {
    this.machines.set(machine.id, { ...machine });
  }

  public selectRecipe(machineId: EntityId, recipeId: RecipeId | null): void {
    const machine = this.machines.get(machineId);
    if (!machine) {
      throw new Error(`Makine bulunamadı: ${machineId}`);
    }
    if (recipeId && (!P0_RECIPES[recipeId] ||
        !P0_MACHINES[machine.typeId]?.recipeIds.includes(recipeId))) {
      throw new Error(`Tarif bu istasyonda kullanılamaz: ${recipeId}`);
    }
    machine.selectedRecipeId = recipeId;
    if (recipeId) {
      const recipe = P0_RECIPES[recipeId];
      if (recipe) {
        const machineDef = P0_MACHINES[machine.typeId];
        const powerE = machineDef?.powerE ?? 0;
        machine.energyCostAtoms = powerE * Math.round((recipe.durationTicks / 10) * 100);
      }
    } else {
      machine.energyCostAtoms = 0;
    }
  }

  /**
   * Memba çeşmesi debi seviyesini yükseltir (Seviye 1 -> Seviye 2).
   * Seviye 2: 80 Kredi (800.000 atom), 120 hazne kapasitesi, 1.0 birim/saniye hız.
   * Aynı transactionId tekrar çağrılırsa dedup uygulanır.
   */
  public upgradeWaterSpring(
    springId: EntityId,
    transactionId: string,
    currentTick: number
  ): UpgradeResult {
    const spring = this.machines.get(springId);
    if (!spring) {
      throw new Error(`Su kaynağı bulunamadı: ${springId}`);
    }

    if (this.processedUpgrades.has(transactionId)) {
      return {
        success: true,
        isDuplicate: true,
        machineId: springId,
        previousLevel: spring.level,
        newLevel: spring.level,
        costAtoms: 0,
      };
    }

    if (spring.level >= 2) {
      return {
        success: true,
        isDuplicate: true,
        machineId: springId,
        previousLevel: spring.level,
        newLevel: spring.level,
        costAtoms: 0,
      };
    }

    const costAtoms = 80 * ATOMS_PER_CREDIT; // 80 Kredi
    const previousLevel = spring.level;

    try {
      return this.persistTransition({ transactionId, type: 'PRODUCTION_UPGRADE', tick: currentTick }, () => {
        this.ledger.commitTransaction({
          transactionId,
          timestampTick: currentTick,
          type: 'DEBIT',
          amountAtoms: costAtoms,
          reason: 'UPGRADE',
          metadata: { machineId: springId, upgrade: 'debi_level_2' },
        });

        this.processedUpgrades.add(transactionId);
        spring.level = 2;
        this.inventory.setCapacity({ kind: 'source', ownerId: springId }, 120);

        return {
          success: true,
          isDuplicate: false,
          machineId: springId,
          previousLevel,
          newLevel: 2,
          costAtoms,
        };
      });
    } catch (err) {
      if (err instanceof DuplicateTransactionError) {
        return {
          success: true,
          isDuplicate: true,
          machineId: springId,
          previousLevel,
          newLevel: spring.level,
          costAtoms: 0,
        };
      }
      throw err;
    }
  }

  /**
   * 10 Hz / 100 ms sabit simülasyon adımı.
   * Su kaynağı debi birikimi, üretim partisi ilerletme ve çıktı teslimini yönetir.
   */
  public tick(currentTick: number): ProductionTickResult {
    const completedBatches: ProductionTickResult['completedBatches'] = [];
    let producedWater = 0;

    for (const machine of this.machines.values()) {
      // 1. Memba Çeşmesi (source.spring_water)
      if (machine.typeId === 'source.spring_water' || machine.typeId === 'machine.water_spring') {
        const waterResult = this.tickWaterSpring(machine, currentTick);
        producedWater += waterResult;
        continue;
      }

      // 2. Üretim İstasyonları (station.bottler, source.crop_plot)
      const batchResult = this.tickCraftingMachine(machine, currentTick);
      if (batchResult) {
        completedBatches.push(batchResult);
      }
    }

    return {
      currentTick,
      completedBatches,
      producedWater,
    };
  }

  /**
   * Memba çeşmesi üretimi.
   * Seviye 1: 0.5 ham su / aktif saniye (her 20 tick'te 1 birim).
   * Seviye 2: 1.0 ham su / aktif saniye (her 10 tick'te 1 birim).
   * Hazne dolunca üretim durur.
   */
  private tickWaterSpring(spring: Machine, currentTick: number): number {
    const loc: StockLocation = { kind: 'source', ownerId: spring.id };
    const capacity = this.inventory.getCapacity(loc);
    const currentWater = this.inventory.getPhysicalQuantity(loc, 'item.raw_water');

    if (currentWater >= capacity) {
      spring.status = 'Idle';
      spring.waitReason = 'STORAGE_FULL';
      return 0;
    }

    spring.status = 'Running';
    spring.waitReason = 'PRODUCING';

    const intervalTicks = spring.level === 2 ? 10 : 20;
    const nextProgress = (spring.progressTicks ?? 0) + 1;
    if (nextProgress < intervalTicks) {
      spring.progressTicks = nextProgress;
      return 0;
    }

    const transactionId = `production:water:${spring.id}:${currentTick}`;
    if (this.committedTransactions.has(transactionId)) return 0;
    return this.persistTransition(
      { transactionId, type: 'PRODUCTION_SOURCE', tick: currentTick },
      () => {
        spring.progressTicks = nextProgress - intervalTicks;
        this.inventory.addLot({
          id: `lot_spring_${spring.id}_${currentTick}`,
          itemId: 'item.raw_water',
          quantity: 1,
          qualityScore: 40,
          unitCostAtoms: 0,
          sourceId: spring.id,
          location: loc,
        });
        return 1;
      }
    );
  }

  /**
   * Zanaat istasyonunun (şişeleme veya domates yatağı) simülasyon adımı.
   */
  private tickCraftingMachine(
    machine: Machine,
    currentTick: number
  ): ProductionTickResult['completedBatches'][0] | null {
    const inputLoc: StockLocation = { kind: 'machineInput', ownerId: machine.id };
    const outputLoc: StockLocation = { kind: 'machineOutput', ownerId: machine.id };

    // --- Durum A: Makinede aktif parti var ---
    if (machine.batch) {
      const batch = machine.batch;

      if (batch.remainingTicks > 0) {
        batch.remainingTicks -= 1;
        if (batch.remainingTicks > 0) {
          machine.status = 'Running';
          machine.waitReason = 'IN_PRODUCTION';
          return null;
        }
      }

      // Parti bitti (remainingTicks === 0). Çıktıyı bırakmayı dene.
      const recipe = P0_RECIPES[batch.recipeId];
      if (!recipe) {
        machine.status = 'Idle';
        machine.batch = null;
        return null;
      }

      return this.deliverCompletedBatch(machine, recipe, batch, currentTick);
    }

    // --- Durum B: Makinede aktif parti yok, yeni parti başlatmayı dene ---
    if (!machine.selectedRecipeId) {
      machine.status = 'Idle';
      machine.waitReason = 'WAITING_FOR_RECIPE';
      machine.missingInputs = undefined;
      return null;
    }

    const recipe = P0_RECIPES[machine.selectedRecipeId];
    if (!recipe) {
      machine.status = 'Idle';
      machine.waitReason = 'WAITING_FOR_RECIPE';
      return null;
    }

    // 1. Girdi kontrolü
    const missing: Array<{ itemId: ItemId; required: number; available: number }> = [];
    for (const inp of recipe.inputs) {
      const available = this.inventory.getPhysicalQuantity(inputLoc, inp.itemId);
      if (available < inp.quantity) {
        missing.push({
          itemId: inp.itemId,
          required: inp.quantity,
          available,
        });
      }
    }

    if (missing.length > 0) {
      machine.status = 'NoInput';
      machine.waitReason = 'WAITING_FOR_INPUT';
      machine.missingInputs = missing;
      return null;
    }

    // 2. Çıktı kapasitesi kontrolü (çıktı doluysa parti başlatılmaz)
    const totalOutputQty = recipe.outputs.reduce((sum, o) => sum + o.quantity, 0);
    const freeCapacity = this.inventory.getAvailableCapacity(outputLoc);
    if (freeCapacity < totalOutputQty) {
      machine.status = 'BlockedOutput';
      machine.waitReason = 'WAITING_FOR_OUTPUT_SPACE';
      machine.missingInputs = undefined;
      return null;
    }

    // 3. Enerji / Bakiye kontrolü
    const machineDef = P0_MACHINES[machine.typeId];
    const powerE = machineDef?.powerE ?? 0;
    const durationSeconds = Math.round(recipe.durationTicks / 10);
    const energyCostAtoms = powerE * durationSeconds * 100;

    if (energyCostAtoms > 0 && this.ledger.getBalanceAtoms() < energyCostAtoms) {
      machine.status = 'NoPower';
      machine.waitReason = 'WAITING_FOR_POWER';
      machine.missingInputs = undefined;
      return null;
    }

    // 4. Tüm şartlar sağlandı: Girdileri tüket ve partiyi başlat!
    const batchId = `batch_${machine.id}_${currentTick}`;
    const remainingTicks = Math.max(0, recipe.durationTicks - 1);
    const transactionId = remainingTicks === 0
      ? `production:complete:${batchId}`
      : `production:start:${batchId}`;
    const type = remainingTicks === 0 ? 'PRODUCTION_BATCH_COMPLETED' : 'PRODUCTION_BATCH_STARTED';

    return this.persistTransition({ transactionId, type, tick: currentTick }, () => {
      const consumedInputs: MachineBatch['consumedInputs'] = [];
      for (const inp of recipe.inputs) {
        const consumeRes = this.inventory.consumeStock({
          transactionId: `consume_${machine.id}_${inp.itemId}_${currentTick}`,
          timestampTick: currentTick,
          location: inputLoc,
          itemId: inp.itemId,
          quantity: inp.quantity,
        });

        for (const c of consumeRes.consumedLots) {
          const originalLot = this.inventory.getLot(c.lotId);
          consumedInputs.push({
            lotId: c.lotId,
            itemId: inp.itemId,
            quantity: c.quantity,
            qualityScore: originalLot?.qualityScore ?? 40,
            unitCostAtoms: originalLot?.unitCostAtoms ?? 0,
          });
        }
      }

      const batch: MachineBatch = {
        id: batchId,
        recipeId: recipe.id,
        remainingTicks,
        consumedInputs,
      };
      machine.batch = batch;
      machine.status = 'Running';
      machine.waitReason = 'IN_PRODUCTION';
      machine.missingInputs = undefined;
      machine.energyCostAtoms = energyCostAtoms;

      // One-tick recipes commit their input and output as one durable result.
      if (remainingTicks === 0) return this.deliverCompletedBatch(machine, recipe, batch, currentTick, false);
      return null;
    });
  }

  private deliverCompletedBatch(
    machine: Machine,
    recipe: RecipeDefinition,
    batch: MachineBatch,
    currentTick: number,
    persist = true
  ): ProductionTickResult['completedBatches'][0] | null {
    const outputLoc: StockLocation = { kind: 'machineOutput', ownerId: machine.id };
    const totalOutputQty = recipe.outputs.reduce((sum, o) => sum + o.quantity, 0);
    const freeCapacity = this.inventory.getAvailableCapacity(outputLoc);

    if (freeCapacity < totalOutputQty) {
      machine.status = 'BlockedOutput';
      machine.waitReason = 'WAITING_FOR_OUTPUT_SPACE';
      return null;
    }

    const machineDef = P0_MACHINES[machine.typeId];
    const powerE = machineDef?.powerE ?? 0;
    const durationSeconds = Math.round(recipe.durationTicks / 10);
    const energyCostAtoms = powerE * durationSeconds * 100;

    const complete = () => {
      if (energyCostAtoms > 0) {
        this.ledger.commitTransaction({
          transactionId: `energy_${machine.id}_${batch.id}_${currentTick}`,
          timestampTick: currentTick,
          type: 'DEBIT',
          amountAtoms: energyCostAtoms,
          reason: 'ENERGY_COST',
          metadata: { machineId: machine.id, batchId: batch.id, recipeId: batch.recipeId },
        });
      }

      const consumedTotalCost = batch.consumedInputs.reduce(
        (sum, c) => sum + c.unitCostAtoms * c.quantity,
        0
      );
      const batchTotalCost = consumedTotalCost + energyCostAtoms;
      const unitCostAtoms = Math.round(batchTotalCost / totalOutputQty);

      for (const out of recipe.outputs) {
        this.inventory.addLot({
          id: `lot_${batch.id}_${out.itemId}_${currentTick}`,
          itemId: out.itemId,
          quantity: out.quantity,
          qualityScore: 40,
          unitCostAtoms,
          sourceId: machine.id,
          location: outputLoc,
        });
      }

      const result = {
        machineId: machine.id,
        recipeId: batch.recipeId,
        outputs: [...recipe.outputs],
        energyCostAtoms,
      };

      machine.batch = null;
      machine.status = 'Idle';
      machine.waitReason = 'IDLE';
      return result;
    };

    if (!persist) return complete();
    const transactionId = `production:complete:${batch.id}`;
    if (this.committedTransactions.has(transactionId)) return null;
    return this.persistTransition(
      { transactionId, type: 'PRODUCTION_BATCH_COMPLETED', tick: currentTick },
      complete
    );
  }

  private persistTransition<T>(commit: ProductionCommit, mutation: () => T): T {
    const beforeLedger = this.ledger.serialize();
    const beforeInventory = this.inventory.serialize();
    const beforeProduction = this.serialize();
    try {
      const result = mutation();
      this.committedTransactions.add(commit.transactionId);
      this.onCommitted?.({ ...commit, result });
      return result;
    } catch (error) {
      this.ledger.restore(beforeLedger);
      this.inventory.restore(beforeInventory);
      this.restore(beforeProduction);
      throw error;
    }
  }
}

function cloneMachine(machine: Machine): Machine {
  return {
    ...machine,
    gridPosition: { ...machine.gridPosition },
    batch: machine.batch
      ? {
          ...machine.batch,
          consumedInputs: machine.batch.consumedInputs.map((input) => ({ ...input })),
        }
      : null,
    missingInputs: machine.missingInputs?.map((input) => ({ ...input })),
  };
}
