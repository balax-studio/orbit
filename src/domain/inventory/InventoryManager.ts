// Orbit Market - Inventory & Transfer Domain Manager
// Reference: OYUN_GELISTIRME_DEVIR_DOSYASI.md §26, §58.1, §60-61, TEST_STRATEGY.md T-P0-03/03b

import type { EntityId, ItemId, Reservation, StockLocation, StockLot } from '../types';

export function locationKey(loc: StockLocation): string {
  return `${loc.kind}:${loc.ownerId}`;
}

export function isSameLocation(a: StockLocation, b: StockLocation): boolean {
  return a.kind === b.kind && a.ownerId === b.ownerId;
}

export const DEFAULT_CAPACITIES: Record<StockLocation['kind'], number> = {
  player: 5,
  worker: 5,
  customer: 1,
  shelf: 20,
  cabinet: 30,
  storage: 50,
  checkout: 5,
  source: 80,
  machineInput: 20,
  machineOutput: 10,
};

export interface TransferResult {
  success: boolean;
  transactionId: string;
  timestampTick: number;
  source: StockLocation;
  target: StockLocation;
  itemId: ItemId;
  quantity: number;
  isDuplicate: boolean;
  transferredLots: Array<{ lotId: EntityId; quantity: number }>;
  targetLotId: EntityId;
}

export interface ConsumeResult {
  success: boolean;
  transactionId: string;
  timestampTick: number;
  location: StockLocation;
  itemId: ItemId;
  quantity: number;
  isDuplicate: boolean;
  consumedLots: Array<{ lotId: EntityId; quantity: number }>;
}

export type InventoryTransactionResult = TransferResult | ConsumeResult;

export interface InventorySnapshot {
  lots: StockLot[];
  reservations: Reservation[];
  capacities: Array<[string, number]>;
  committedTransactions: Array<[string, InventoryTransactionResult]>;
}

export class InventoryManager {
  // ponytail: in-memory Map of lots and reservations. Small lot count per room in P0.
  // Ceiling: linear scan over lots for matching locations/items. Upgrade path: index by locationKey.
  private lots: Map<EntityId, StockLot>;
  private reservations: Map<EntityId, Reservation>;
  private capacities: Map<string, number>;
  private committedTransactions: Map<string, InventoryTransactionResult>;

  constructor() {
    this.lots = new Map();
    this.reservations = new Map();
    this.capacities = new Map();
    this.committedTransactions = new Map();
  }

  public setCapacity(location: StockLocation, maxCapacity: number): void {
    if (maxCapacity < 0 || !Number.isInteger(maxCapacity)) {
      throw new Error(`Geçersiz kapasite değeri: ${maxCapacity}`);
    }
    this.capacities.set(locationKey(location), maxCapacity);
  }

  public getCapacity(location: StockLocation): number {
    const custom = this.capacities.get(locationKey(location));
    if (custom !== undefined) {
      return custom;
    }
    return DEFAULT_CAPACITIES[location.kind] ?? 20;
  }

  public getLotsAt(location: StockLocation): StockLot[] {
    const key = locationKey(location);
    const result: StockLot[] = [];
    for (const lot of this.lots.values()) {
      if (locationKey(lot.location) === key) {
        result.push(lot);
      }
    }
    return result;
  }

  public getPhysicalQuantity(location: StockLocation, itemId?: ItemId): number {
    let total = 0;
    const key = locationKey(location);
    for (const lot of this.lots.values()) {
      if (locationKey(lot.location) === key) {
        if (!itemId || lot.itemId === itemId) {
          total += lot.quantity;
        }
      }
    }
    return total;
  }

  public getReservedIncoming(location: StockLocation): number {
    let total = 0;
    const key = locationKey(location);
    for (const res of this.reservations.values()) {
      if (res.status === 'ACTIVE' && locationKey(res.target) === key) {
        total += res.quantity;
      }
    }
    return total;
  }

  public getReservedOutgoing(location: StockLocation, itemId?: ItemId): number {
    let total = 0;
    const key = locationKey(location);
    for (const res of this.reservations.values()) {
      if (res.status === 'ACTIVE' && locationKey(res.source) === key) {
        if (!itemId || res.itemId === itemId) {
          total += res.quantity;
        }
      }
    }
    return total;
  }

  public getAvailableCapacity(location: StockLocation): number {
    const maxCap = this.getCapacity(location);
    const currentPhysical = this.getPhysicalQuantity(location);
    const incomingReserved = this.getReservedIncoming(location);
    const freeSpace = maxCap - currentPhysical - incomingReserved;
    return Math.max(0, freeSpace);
  }

  public getAvailableQuantity(location: StockLocation, itemId: ItemId): number {
    const physical = this.getPhysicalQuantity(location, itemId);
    const outgoingReserved = this.getReservedOutgoing(location, itemId);
    const available = physical - outgoingReserved;
    return Math.max(0, available);
  }

  public addLot(lot: StockLot): void {
    if (lot.quantity <= 0 || !Number.isInteger(lot.quantity)) {
      throw new Error(`Geçersiz lot adedi: ${lot.quantity}`);
    }
    if (this.lots.has(lot.id)) {
      throw new Error(`Lot ID zaten kullanımda: ${lot.id}`);
    }
    const currentTotal = this.getPhysicalQuantity(lot.location);
    const maxCap = this.getCapacity(lot.location);
    if (currentTotal + this.getReservedIncoming(lot.location) + lot.quantity > maxCap) {
      throw new Error(
        `Kapasite aşıldı: ${locationKey(lot.location)} kapasitesi ${maxCap}, mevcut ${currentTotal}, eklenmek istenen ${lot.quantity}`
      );
    }
    this.lots.set(lot.id, { ...lot });
  }

  public getLot(lotId: EntityId): StockLot | undefined {
    return this.lots.get(lotId);
  }

  public getAllLots(): StockLot[] {
    return Array.from(this.lots.values());
  }

  public getReservation(reservationId: EntityId): Reservation | undefined {
    return this.reservations.get(reservationId);
  }

  public getActiveReservations(): Reservation[] {
    return Array.from(this.reservations.values()).filter((r) => r.status === 'ACTIVE');
  }

  private reservedOnLot(lotId: EntityId, exceptReservationId?: EntityId): number {
    let reserved = 0;
    for (const reservation of this.reservations.values()) {
      if (reservation.status === 'ACTIVE' && reservation.lotId === lotId &&
          reservation.id !== exceptReservationId) {
        reserved += reservation.quantity;
      }
    }
    return reserved;
  }

  private selectLots(
    location: StockLocation,
    itemId: ItemId,
    quantity: number,
    reservation?: Reservation
  ): Array<{ lot: StockLot; quantity: number }> {
    const selected: Array<{ lot: StockLot; quantity: number }> = [];
    let remaining = quantity;
    for (const lot of this.getLotsAt(location)) {
      if (lot.itemId !== itemId || (reservation?.lotId && lot.id !== reservation.lotId)) continue;
      const available = Math.max(0, lot.quantity - this.reservedOnLot(lot.id, reservation?.id));
      const take = Math.min(available, remaining);
      if (take > 0) {
        selected.push({ lot, quantity: take });
        remaining -= take;
      }
      if (remaining === 0) break;
    }
    if (remaining > 0) {
      throw new Error(`INSUFFICIENT_STOCK: ${locationKey(location)} konumunda ${itemId} için ${remaining} birim eksik`);
    }
    return selected;
  }

  public createReservation(params: {
    id: EntityId;
    ownerId: EntityId;
    source: StockLocation;
    target: StockLocation;
    itemId: ItemId;
    quantity: number;
    currentTick: number;
    lotId?: EntityId;
  }): Reservation {
    if (params.quantity <= 0 || !Number.isInteger(params.quantity)) {
      throw new Error(`Geçersiz rezervasyon miktarı: ${params.quantity}`);
    }

    if (this.reservations.has(params.id)) {
      const existing = this.reservations.get(params.id)!;
      if (existing.status === 'ACTIVE' && existing.ownerId === params.ownerId &&
          isSameLocation(existing.source, params.source) &&
          isSameLocation(existing.target, params.target) &&
          existing.itemId === params.itemId && existing.quantity === params.quantity &&
          existing.lotId === params.lotId) {
        return existing;
      }
      throw new Error(`Rezervasyon ID zaten kullanımda: ${params.id}`);
    }

    const availableStock = this.getAvailableQuantity(params.source, params.itemId);
    if (availableStock < params.quantity) {
      throw new Error(
        `INSUFFICIENT_STOCK: ${locationKey(params.source)} konumunda ${params.itemId} için yeterli serbest stok yok (talep: ${params.quantity}, serbest: ${availableStock})`
      );
    }

    if (params.lotId) {
      const lot = this.lots.get(params.lotId);
      if (!lot || !isSameLocation(lot.location, params.source) || lot.itemId !== params.itemId ||
          lot.quantity - this.reservedOnLot(lot.id) < params.quantity) {
        throw new Error(`INSUFFICIENT_STOCK: seçilen lot için yeterli serbest stok yok: ${params.lotId}`);
      }
    }

    const availableCapacity = this.getAvailableCapacity(params.target);
    if (availableCapacity < params.quantity) {
      throw new Error(
        `EXCEEDS_CAPACITY: ${locationKey(params.target)} hedefinde yeterli serbest kapasite yok (talep: ${params.quantity}, serbest kapasite: ${availableCapacity})`
      );
    }

    const reservation: Reservation = {
      id: params.id,
      ownerId: params.ownerId,
      source: params.source,
      target: params.target,
      itemId: params.itemId,
      quantity: params.quantity,
      lotId: params.lotId,
      status: 'ACTIVE',
      createdAtTick: params.currentTick,
    };

    this.reservations.set(reservation.id, reservation);
    return reservation;
  }

  public cancelReservation(reservationId: EntityId): boolean {
    const reservation = this.reservations.get(reservationId);
    if (!reservation) {
      return false;
    }
    if (reservation.status !== 'ACTIVE') {
      return false;
    }
    reservation.status = 'CANCELLED';
    return true;
  }

  public transferStock(params: {
    transactionId: string;
    timestampTick: number;
    source: StockLocation;
    target: StockLocation;
    itemId: ItemId;
    quantity: number;
    reservationId?: EntityId;
  }): TransferResult {
    // 1. Idempotency kontrolü: aynı transactionId daha önce işlendiyse ikinci etki yok
    const existing = this.committedTransactions.get(params.transactionId);
    if (existing) {
      if ('transferredLots' in existing) {
        if (!isSameLocation(existing.source, params.source) ||
            !isSameLocation(existing.target, params.target) ||
            existing.itemId !== params.itemId || existing.quantity !== params.quantity) {
          throw new Error(`İşlem ID farklı transfer için kullanılmış: ${params.transactionId}`);
        }
        return { ...existing, isDuplicate: true };
      }
      throw new Error(`İşlem ID farklı envanter işlemi için kullanılmış: ${params.transactionId}`);
    }

    if (params.quantity <= 0 || !Number.isInteger(params.quantity)) {
      throw new Error(`Geçersiz transfer miktarı: ${params.quantity}`);
    }

    let reservation: Reservation | undefined;
    let workerPickup = false;
    if (params.reservationId) {
      reservation = this.reservations.get(params.reservationId);
      if (!reservation) {
        throw new Error(`Rezervasyon bulunamadı: ${params.reservationId}`);
      }
      if (reservation.status !== 'ACTIVE') {
        throw new Error(`Rezervasyon aktif değil (${reservation.status}): ${params.reservationId}`);
      }
      if (!isSameLocation(reservation.source, params.source)) {
        throw new Error('Transfer kaynağı rezervasyon kaynağı ile eşleşmiyor');
      }
      workerPickup = params.target.kind === 'worker' && params.target.ownerId === reservation.ownerId &&
        reservation.target.kind === 'shelf';
      if (!workerPickup && !isSameLocation(reservation.target, params.target)) {
        throw new Error('Transfer hedefi rezervasyon hedefi ile eşleşmiyor');
      }
      if (reservation.itemId !== params.itemId) {
        throw new Error('Transfer edilen ürün rezervasyon ürünü ile eşleşmiyor');
      }
      if (reservation.quantity < params.quantity) {
        throw new Error('Transfer miktarı rezerve miktarı aşıyor');
      }
      if (workerPickup && this.getAvailableCapacity(params.target) < params.quantity) {
        throw new Error('EXCEEDS_CAPACITY: görevli yük kapasitesi yetersiz');
      }
      if (workerPickup && reservation.quantity !== params.quantity) {
        throw new Error('Görevli tek işi parça parça alamaz');
      }
    } else {
      // Rezervasyonsuz transfer: anlık stok ve kapasite kontrolü
      const availableStock = this.getAvailableQuantity(params.source, params.itemId);
      if (availableStock < params.quantity) {
        throw new Error(
          `INSUFFICIENT_STOCK: ${locationKey(params.source)} serbest stok yetersiz (talep: ${params.quantity}, serbest: ${availableStock})`
        );
      }
      const availableCapacity = this.getAvailableCapacity(params.target);
      if (availableCapacity < params.quantity) {
        throw new Error(
          `EXCEEDS_CAPACITY: ${locationKey(params.target)} serbest kapasite yetersiz (talep: ${params.quantity}, serbest: ${availableCapacity})`
        );
      }
    }

    // 2. Kaynak lotlardan eksiltme (FIFO / lot bazlı korunum)
    const sourceLots = this.selectLots(params.source, params.itemId, params.quantity, reservation);
    const transferredLots: Array<{ lotId: EntityId; quantity: number }> = [];

    // Transfer edilecek lotların maliyet ve kalite ağırlıklı ortalaması
    let accumulatedCost = 0;
    let accumulatedQuality = 0;
    let fallbackSourceId = 'transfer';

    for (const { lot, quantity: takeAmount } of sourceLots) {
      lot.quantity -= takeAmount;

      accumulatedCost += lot.unitCostAtoms * takeAmount;
      accumulatedQuality += lot.qualityScore * takeAmount;
      fallbackSourceId = lot.sourceId;

      transferredLots.push({ lotId: lot.id, quantity: takeAmount });

      if (lot.quantity === 0) {
        this.lots.delete(lot.id);
      }
    }

    const avgUnitCost = Math.round(accumulatedCost / params.quantity);
    const avgQuality = Math.round(accumulatedQuality / params.quantity);

    // 3. Hedef konuma lot ekleme veya birleştirme
    const targetLots = this.getLotsAt(params.target).filter(
      (l) => l.itemId === params.itemId && l.unitCostAtoms === avgUnitCost && l.qualityScore === avgQuality
    );

    let targetLotId: EntityId;
    if (targetLots.length > 0) {
      targetLots[0].quantity += params.quantity;
      targetLotId = targetLots[0].id;
    } else {
      const lotIdBase = `lot_${params.transactionId}_${params.timestampTick}`;
      let newLotId = lotIdBase;
      let suffix = 1;
      while (this.lots.has(newLotId)) {
        newLotId = `${lotIdBase}_${suffix++}`;
      }
      const newLot: StockLot = {
        id: newLotId,
        itemId: params.itemId,
        quantity: params.quantity,
        qualityScore: avgQuality,
        unitCostAtoms: avgUnitCost,
        sourceId: fallbackSourceId,
        location: { ...params.target },
      };
      this.lots.set(newLot.id, newLot);
      targetLotId = newLot.id;
    }

    // 4. Rezervasyon varsa çözme
    if (reservation) {
      if (workerPickup) {
        reservation.source = { ...params.target };
      } else if (reservation.quantity === params.quantity) {
        reservation.status = 'FULFILLED';
      } else {
        reservation.quantity -= params.quantity;
      }
    }

    // 5. İşlemi kaydetme (Idempotent Ledger)
    const result: TransferResult = {
      success: true,
      transactionId: params.transactionId,
      timestampTick: params.timestampTick,
      source: params.source,
      target: params.target,
      itemId: params.itemId,
      quantity: params.quantity,
      isDuplicate: false,
      transferredLots,
      targetLotId,
    };

    this.committedTransactions.set(params.transactionId, result);
    return result;
  }

  public consumeStock(params: {
    transactionId: string;
    timestampTick: number;
    location: StockLocation;
    itemId: ItemId;
    quantity: number;
  }): ConsumeResult {
    // 1. Idempotency kontrolü: aynı transactionId daha önce işlendiyse ikinci etki yok
    const existing = this.committedTransactions.get(params.transactionId);
    if (existing) {
      if ('consumedLots' in existing) {
        if (!isSameLocation(existing.location, params.location) ||
            existing.itemId !== params.itemId || existing.quantity !== params.quantity) {
          throw new Error(`İşlem ID farklı tüketim için kullanılmış: ${params.transactionId}`);
        }
        return { ...existing, isDuplicate: true };
      }
      throw new Error(`İşlem ID farklı envanter işlemi için kullanılmış: ${params.transactionId}`);
    }

    if (params.quantity <= 0 || !Number.isInteger(params.quantity)) {
      throw new Error(`Geçersiz tüketim miktarı: ${params.quantity}`);
    }

    const available = this.getAvailableQuantity(params.location, params.itemId);
    if (available < params.quantity) {
      throw new Error(
        `INSUFFICIENT_STOCK: ${locationKey(params.location)} konumunda yeterli ${params.itemId} yok (talep: ${params.quantity}, mevcut: ${available})`
      );
    }

    const lots = this.selectLots(params.location, params.itemId, params.quantity);
    const consumedLots: Array<{ lotId: EntityId; quantity: number }> = [];

    for (const { lot, quantity: take } of lots) {
      lot.quantity -= take;
      consumedLots.push({ lotId: lot.id, quantity: take });

      if (lot.quantity === 0) {
        this.lots.delete(lot.id);
      }
    }

    const result: ConsumeResult = {
      success: true,
      transactionId: params.transactionId,
      timestampTick: params.timestampTick,
      location: { ...params.location },
      itemId: params.itemId,
      quantity: params.quantity,
      isDuplicate: false,
      consumedLots,
    };

    this.committedTransactions.set(params.transactionId, result);
    return result;
  }

  public serialize(): InventorySnapshot {
    return {
      lots: Array.from(this.lots.values()).map((l) => ({ ...l, location: { ...l.location } })),
      reservations: Array.from(this.reservations.values()).map((r) => ({
        ...r,
        source: { ...r.source },
        target: { ...r.target },
      })),
      capacities: Array.from(this.capacities.entries()),
      committedTransactions: Array.from(this.committedTransactions.entries()).map(([k, v]) => [
        k,
        'transferredLots' in v
          ? {
              ...v,
              source: { ...v.source },
              target: { ...v.target },
              transferredLots: [...v.transferredLots],
            }
          : {
              ...v,
              location: { ...v.location },
              consumedLots: [...v.consumedLots],
            },
      ]),
    };
  }

  public restore(snapshot: InventorySnapshot): void {
    this.lots.clear();
    for (const lot of snapshot.lots) {
      this.lots.set(lot.id, { ...lot, location: { ...lot.location } });
    }

    this.reservations.clear();
    for (const res of snapshot.reservations) {
      this.reservations.set(res.id, {
        ...res,
        source: { ...res.source },
        target: { ...res.target },
      });
    }

    this.capacities.clear();
    for (const [k, v] of snapshot.capacities) {
      this.capacities.set(k, v);
    }

    this.committedTransactions.clear();
    for (const [k, v] of snapshot.committedTransactions) {
      this.committedTransactions.set(
        k,
        'transferredLots' in v
          ? {
              ...v,
              source: { ...v.source },
              target: { ...v.target },
              transferredLots: [...v.transferredLots],
            }
          : {
              ...v,
              location: { ...v.location },
              consumedLots: [...v.consumedLots],
            }
      );
    }
  }
}
