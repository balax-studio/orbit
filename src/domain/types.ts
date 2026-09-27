// Orbit Market - Domain Types
// Reference: DOMAIN_MODEL.md, KARARLAR.md D-020

export type EntityId = string;
export type ItemId = `item.${string}`;
export type RecipeId = `recipe.${string}`;
export type MachineTypeId = `machine.${string}`;

export interface GridCell {
  x: number;
  z: number;
}

export interface WorldPosition {
  x: number;
  z: number;
}

export type Direction = 0 | 90 | 180 | 270;

export interface ProductDefinition {
  id: ItemId;
  displayNameKey: string;
  category: 'raw' | 'intermediate' | 'final';
  stackSize: number;
  baseRetailPriceAtoms: number | null; // Sadece satılabilir ürünlerde
  phase: 'P0' | 'A2' | 'A3' | 'A4';
}

export interface MachineDefinition {
  id: MachineTypeId;
  displayNameKey: string;
  purchasePriceAtoms: number;
  footprint: { width: number; depth: number };
  serviceCells: GridCell[];
  inputCapacity: number;
  outputCapacity: number;
  powerE: number;
  recipeIds: RecipeId[];
}

export interface RecipeDefinition {
  id: RecipeId;
  machineTypeId: MachineTypeId;
  inputs: Array<{ itemId: ItemId; quantity: number }>;
  outputs: Array<{ itemId: ItemId; quantity: number }>;
  durationTicks: number;
}

export type StockLocation =
  | { kind: 'cabinet' | 'shelf' | 'storage' | 'checkout'; ownerId: EntityId }
  | { kind: 'source'; ownerId: EntityId }
  | { kind: 'machineInput' | 'machineOutput'; ownerId: EntityId }
  | { kind: 'player' | 'worker' | 'customer'; ownerId: EntityId };

export interface Station {
  id: EntityId;
  kind: 'cabinet' | 'shelf' | 'storage' | 'checkout';
  gridPosition: GridCell;
  capacity: number;
}

export interface StockLot {
  id: EntityId;
  itemId: ItemId;
  quantity: number;
  qualityScore: number;
  unitCostAtoms: number;
  sourceId: string;
  location: StockLocation;
}

export interface MachineBatch {
  id: EntityId;
  recipeId: RecipeId;
  remainingTicks: number;
  consumedInputs: Array<{
    lotId: EntityId;
    itemId: ItemId;
    quantity: number;
    qualityScore: number;
    unitCostAtoms: number;
  }>;
}

export interface Machine {
  id: EntityId;
  typeId: MachineTypeId;
  gridPosition: GridCell;
  direction: Direction;
  level: 1;
  selectedRecipeId: RecipeId | null;
  status: 'Idle' | 'Running' | 'NoInput' | 'NoPower' | 'BlockedOutput' | 'Ready';
  batch: MachineBatch | null;
}

export interface CarrierTask {
  id: EntityId;
  sourceLotId: EntityId;
  target: StockLocation;
  quantity: number;
  phase: 'toSource' | 'carrying' | 'toTarget' | 'waiting';
}

export interface Player {
  id: EntityId;
  position: WorldPosition;
  carriedLotIds: EntityId[];
}

export interface Worker {
  id: EntityId;
  roleId: string;
  position: WorldPosition;
  carriedLotIds: EntityId[];
  task: CarrierTask | null;
  idleCell: GridCell;
}

export interface Customer {
  id: EntityId;
  profileId: string;
  position: WorldPosition;
  phase: 'entering' | 'toShelf' | 'toCheckout' | 'queued' | 'leaving';
  requestedItemId: ItemId;
  basketLotId: EntityId | null;
  lockedPriceAtoms: number | null;
  patienceRemainingTicks: number;
  queueIndex: number | null;
  purchaseThreshold: number;
}

export interface Reservation {
  id: EntityId;
  ownerId: EntityId;
  source: StockLocation;
  target: StockLocation;
  itemId: ItemId;
  quantity: number;
  lotId?: EntityId;
  status: 'ACTIVE' | 'FULFILLED' | 'CANCELLED';
  createdAtTick: number;
}

export type TransactionType = 'CREDIT' | 'DEBIT';

export type TransactionReason =
  | 'SALE'
  | 'PURCHASE'
  | 'MAINTENANCE'
  | 'INITIAL_CAPITAL'
  | 'UPGRADE';

export interface LedgerEntry {
  sequence: number;
  transactionId: string;
  timestampTick: number;
  type: TransactionType;
  amountAtoms: number;
  balanceAfterAtoms: number;
  reason: TransactionReason;
  metadata?: Record<string, string | number>;
}

export interface GameState {
  schemaVersion: number;
  contentVersion: number;
  simulationTick: number;
  rngState: number;
  balanceAtoms: number;
  room: { width: number; depth: number; entrance: GridCell };
  player: Player;
  workers: Worker[];
  customers: Customer[];
  machines: Machine[];
  stations: Station[];
  lots: StockLot[];
  reservations: Reservation[];
  ledger: LedgerEntry[];
  committedTransactions: Array<{ transactionId: string; sequence: number }>;
}
