// Orbit Market - Customer Lifecycle & Sales Flow Manager
// Reference: OYUN_GELISTIRME_DEVIR_DOSYASI.md §7, §26.1, §38, KARARLAR.md D-019

import type { CommandDispatcher, SaleResult } from '../../application/commands';
import type { EconomyLedger } from '../economy/ledger';
import type { InventoryManager } from '../inventory/InventoryManager';
import type {
  Customer,
  EntityId,
  ItemId,
  LostSaleReason,
  StockLocation,
  WorldPosition,
} from '../types';
import { P0_PRODUCTS } from '../../content/p0Content';
import { A2_PRODUCTS } from '../../content/a2Content';
import { Mulberry32Rng } from '../random/rng';

export const ALL_PRODUCTS = { ...P0_PRODUCTS, ...A2_PRODUCTS };

export const PURCHASABLE_ITEMS = Object.values(ALL_PRODUCTS)
  .filter(p => p.category === 'final' && p.baseRetailPriceAtoms !== null)
  .map(p => p.id as ItemId);

export const A2_PURCHASABLE_ITEMS = Object.values(ALL_PRODUCTS)
  .filter(p => p.category === 'final' && p.baseRetailPriceAtoms !== null && p.phase === 'A2')
  .map(p => p.id as ItemId);

export type CustomerProfileId = 'mahalleli' | 'arastirmaci' | 'isci';

export interface CustomerProfileDef {
  id: CustomerProfileId;
  name: string;
  patienceTicks: number;
  budgetAtoms: number;
}

export const CUSTOMER_PROFILES: Record<CustomerProfileId, CustomerProfileDef> = {
  mahalleli: { id: 'mahalleli', name: 'Temel Mahalleli', patienceTicks: 400, budgetAtoms: 300_000 },
  arastirmaci: { id: 'arastirmaci', name: 'Araştırmacı', patienceTicks: 600, budgetAtoms: 600_000 },
  isci: { id: 'isci', name: 'Yerleşim Çalışanı', patienceTicks: 200, budgetAtoms: 150_000 }
};

export interface LostSaleRecord {
  customerId: EntityId;
  itemId: ItemId;
  reason: LostSaleReason;
  timestampTick: number;
  details?: string;
}

export interface CustomerManagerConfig {
  shelfLocation?: StockLocation;
  checkoutLocation?: StockLocation;
  shelfServicePos: WorldPosition;
  checkoutServicePos: WorldPosition;
  checkoutQueueWaitPos: WorldPosition;
  entrancePos: WorldPosition;
  basePatienceTicks?: number; // 40s = 400 ticks (KARARLAR.md D-019 D.2)
  walkSpeed?: number; // 0.15m per 100ms = 1.5 m/s
}

export class CustomerManager {
  private customers: Map<EntityId, Customer> = new Map();
  private completedSales: SaleResult[] = [];
  private lostSales: LostSaleRecord[] = [];
  private rng: Mulberry32Rng;
  private inventory: InventoryManager;
  private ledger: EconomyLedger;
  private dispatcher: CommandDispatcher;
  private customerCounter: number = 0;

  public readonly shelfLocation: StockLocation;
  public readonly checkoutLocation: StockLocation;
  public shelfServicePos: WorldPosition;
  public readonly checkoutServicePos: WorldPosition;
  public readonly checkoutQueueWaitPos: WorldPosition;
  public readonly entrancePos: WorldPosition;
  public readonly basePatienceTicks: number;
  public readonly walkSpeed: number;

  constructor(
    inventory: InventoryManager,
    ledger: EconomyLedger,
    dispatcher: CommandDispatcher,
    seed: number,
    config: CustomerManagerConfig
  ) {
    this.inventory = inventory;
    this.ledger = ledger;
    this.dispatcher = dispatcher;
    this.rng = new Mulberry32Rng(seed);

    this.shelfLocation = config.shelfLocation ?? { kind: 'shelf', ownerId: 'fixture.sales_shelf' };
    this.checkoutLocation = config.checkoutLocation ?? { kind: 'checkout', ownerId: 'fixture.checkout' };
    this.shelfServicePos = config.shelfServicePos;
    this.checkoutServicePos = config.checkoutServicePos;
    this.checkoutQueueWaitPos = config.checkoutQueueWaitPos;
    this.entrancePos = config.entrancePos;
    this.basePatienceTicks = config.basePatienceTicks ?? 400; // 40 saniye (D-019 D.2)
    this.walkSpeed = config.walkSpeed ?? 0.15;
  }

  public getCustomer(id: EntityId): Customer | undefined {
    return this.customers.get(id);
  }

  public getLedger(): EconomyLedger {
    return this.ledger;
  }

  public getInventory(): InventoryManager {
    return this.inventory;
  }

  public getAllCustomers(): Customer[] {
    return Array.from(this.customers.values());
  }

  public getQueuedCustomers(): Customer[] {
    return Array.from(this.customers.values())
      .filter((c) => c.phase === 'queued' && c.queueIndex !== null)
      .sort((a, b) => (a.queueIndex ?? 0) - (b.queueIndex ?? 0));
  }

  public getLostSales(): LostSaleRecord[] {
    return [...this.lostSales];
  }

  public getCompletedSales(): SaleResult[] {
    return [...this.completedSales];
  }

  public setShelfServicePosition(position: WorldPosition): void {
    this.shelfServicePos = { ...position };
  }

  public clearTransientSalesAfterRollback(): void {
    this.dispatcher.clearTransientSales();
  }

  public maybeSpawnP0Customer(): Customer | null {
    if (this.customers.size > 0) return null;
    if (this.customerCounter === 0) {
      if (this.inventory.getAvailableQuantity(this.shelfLocation, 'item.glass_water_small') < 1) return null;
    } else if (this.rng.nextFloat() >= 56 / 9000) {
      return null;
    }
    const requestedItemId = PURCHASABLE_ITEMS[this.rng.nextInt(0, PURCHASABLE_ITEMS.length - 1)];
    return this.spawnCustomer({ requestedItemId });
  }

  /**
   * A2 için tek müşteri oluşturma ve dünyaya sokma (Yalnızca A2 ürünleri).
   * A2 pazar talebi P0'a ek olarak çalışır.
   */
  public maybeSpawnA2Customer(): Customer | null {
    if (this.customers.size > 1) return null; // A2'de dükkanda max 2 müşteri olabilir
    if (this.rng.nextFloat() >= 40 / 9000) { // Biraz daha nadir
      return null;
    }
    const requestedItemId = A2_PURCHASABLE_ITEMS[this.rng.nextInt(0, A2_PURCHASABLE_ITEMS.length - 1)];
    return this.spawnCustomer({ requestedItemId });
  }

  /**
   * P0 için tek müşteri oluşturma ve dünyaya sokma
   */
  public spawnCustomer(params: {
    id?: EntityId;
    profileId?: string;
    requestedItemId?: ItemId;
    budgetAtoms?: number;
    patienceTicks?: number;
    startPos?: WorldPosition;
  } = {}): Customer {
    const id = params.id ?? `customer_${this.customerCounter + 1}`;
    if (this.customers.has(id)) {
      throw new Error(`Müşteri ID zaten kullanımda: ${id}`);
    }
    this.customerCounter += 1;

    const requestedItemId = params.requestedItemId ?? 'item.glass_water_small';
    const requestedProduct = ALL_PRODUCTS[requestedItemId];
    if (!requestedProduct || requestedProduct.baseRetailPriceAtoms === null) {
      throw new Error(`Satılamayan ürün talep edildi: ${requestedItemId}`);
    }

    // A2: Profil seçimi (Eğer parametreyle verilmediyse RNG ile rastgele seçilir)
    let profileId = params.profileId as CustomerProfileId | undefined;
    if (!profileId) {
      const rand = this.rng.nextFloat();
      if (rand < 0.5) profileId = 'mahalleli';
      else if (rand < 0.8) profileId = 'isci';
      else profileId = 'arastirmaci';
    }
    const profile = CUSTOMER_PROFILES[profileId] || CUSTOMER_PROFILES['mahalleli'];

    // Müşteri özellikleri profilden veya test parametresinden gelir
    const budgetAtoms = params.budgetAtoms ?? profile.budgetAtoms;
    const patienceRemainingTicks = params.patienceTicks ?? profile.patienceTicks;

    const customer: Customer = {
      id,
      profileId: profile.id,
      position: { ...(params.startPos ?? this.entrancePos) },
      phase: 'entering',
      requestedItemId,
      basketLotId: null,
      lockedPriceAtoms: null,
      patienceRemainingTicks,
      queueIndex: null,
      purchaseThreshold: 0.88, // §38.2: adil fiyatta %88.1 kabul
      budgetAtoms,
    };

    // Müşteri sepeti için 1 birimlik kapasite tanımla
    this.inventory.setCapacity({ kind: 'customer', ownerId: customer.id }, 1);

    this.customers.set(customer.id, customer);
    return customer;
  }

  /**
   * Raftaki ürünü kontrol eder, bütçe/fiyat doğrular ve sepetine ekler.
   */
  public inspectAndPickFromShelf(customerId: EntityId, currentTick: number): boolean {
    const customer = this.customers.get(customerId);
    if (!customer) {
      throw new Error(`Müşteri bulunamadı: ${customerId}`);
    }
    if (customer.basketLotId || (customer.phase !== 'entering' && customer.phase !== 'toShelf')) {
      throw new Error(`Müşteri raf seçimi için uygun durumda değil: ${customerId}`);
    }

    // 1. Stok kontrolü
    const availableStock = this.inventory.getAvailableQuantity(
      this.shelfLocation,
      customer.requestedItemId
    );

    if (availableStock <= 0) {
      this.recordLostSale(
        customer.id,
        customer.requestedItemId,
        'OUT_OF_STOCK',
        currentTick,
        'Rafta talep edilen ürün stoku bulunamadı'
      );
      customer.phase = 'leaving';
      customer.leaveReason = 'OUT_OF_STOCK';
      return false;
    }

    // 2. Fiyat ve bütçe kontrolü
    const product = ALL_PRODUCTS[customer.requestedItemId];
    if (!product || product.baseRetailPriceAtoms === null) {
      throw new Error(`Satılamayan ürün: ${customer.requestedItemId}`);
    }
    const retailPriceAtoms = product.baseRetailPriceAtoms;

    if (customer.budgetAtoms < retailPriceAtoms) {
      this.recordLostSale(
        customer.id,
        customer.requestedItemId,
        'BUDGET_REJECTED',
        currentTick,
        `Müşteri bütçesi (${customer.budgetAtoms} atom) ürün fiyatından (${retailPriceAtoms} atom) düşük`
      );
      customer.phase = 'leaving';
      customer.leaveReason = 'BUDGET_REJECTED';
      return false;
    }

    // P0 fiyatı katalogda sabittir; oyuncu fiyat tepkisi A2'de açılır (D-019 D.3).
    // Sepete alma (Raftan müşterinin sepetine 1 adet transfer)
    const customerBasketLoc: StockLocation = { kind: 'customer', ownerId: customer.id };
    const transferResult = this.inventory.transferStock({
      transactionId: `pick_${customer.id}_${currentTick}`,
      timestampTick: currentTick,
      source: this.shelfLocation,
      target: customerBasketLoc,
      itemId: customer.requestedItemId,
      quantity: 1,
    });

    if (!transferResult.success || transferResult.transferredLots.length === 0) {
      throw new Error(`Raftan sepete transfer başarısız: ${customer.id}`);
    }

    customer.basketLotId = transferResult.targetLotId;
    customer.lockedPriceAtoms = retailPriceAtoms;
    customer.phase = 'toCheckout';
    return true;
  }

  /**
   * Müşteriyi kasa kuyruğuna ekler.
   */
  public joinQueue(customerId: EntityId): void {
    const customer = this.customers.get(customerId);
    if (!customer) {
      throw new Error(`Müşteri bulunamadı: ${customerId}`);
    }
    if (customer.phase !== 'toCheckout') {
      throw new Error(`Müşteri kasa kuyruğuna giremez: ${customerId}`);
    }

    const queued = this.getQueuedCustomers();
    customer.queueIndex = queued.length;
    customer.phase = 'queued';

    if (customer.queueIndex === 0) {
      customer.position = { ...this.checkoutServicePos };
    } else {
      customer.position = { ...this.checkoutQueueWaitPos };
    }
  }

  /**
   * Kasa ödeme işlemini tek atomik transaction ile tamamlar.
   * Aynı transactionId ile tekrar çağrıldığında yan etki üretmez (Idempotency).
   */
  public checkoutCustomer(
    customerId: EntityId,
    currentTick: number,
    customTxId?: string
  ): SaleResult {
    if (customTxId) {
      const previousSale = this.completedSales.find((sale) => sale.transactionId === customTxId);
      if (previousSale) {
        if (previousSale.customerId !== customerId) {
          throw new Error(`İşlem ID farklı müşteri için kullanılmış: ${customTxId}`);
        }
        return { ...previousSale, isDuplicate: true };
      }
    }
    const customer = this.customers.get(customerId);
    if (!customer) {
      throw new Error(`Müşteri bulunamadı: ${customerId}`);
    }
    if (customer.phase !== 'queued' || customer.queueIndex !== 0) {
      throw new Error(`Müşteri kasa sırasında değil: ${customerId}`);
    }

    if (!customer.basketLotId || customer.lockedPriceAtoms === null) {
      throw new Error(`Müşterinin sepetinde kilitli ürün ve fiyat yok: ${customerId}`);
    }

    const transactionId = customTxId ?? `tx_sale_${customer.id}_${currentTick}`;

    const customerBasketLoc: StockLocation = { kind: 'customer', ownerId: customer.id };

    // Application command ile tek atomik satış işlemi
    const saleResult = this.dispatcher.execute({
      type: 'COMPLETE_SALE',
      transactionId,
      timestampTick: currentTick,
      customerId: customer.id,
      shelfLocation: this.shelfLocation,
      customerLocation: customerBasketLoc,
      itemId: customer.requestedItemId,
      quantity: 1,
      unitPriceAtoms: customer.lockedPriceAtoms,
    }) as SaleResult;

    if (!saleResult.isDuplicate) {
      this.completedSales.push(saleResult);
    }

    customer.phase = 'leaving';
    customer.leaveReason = 'PURCHASE_COMPLETED';
    customer.basketLotId = null;
    customer.queueIndex = null;

    this.advanceQueue();
    return saleResult;
  }

  /**
   * Kuyrukta sabrı tükenen müşteriyi işler.
   * Sepetindeki ürün rafa güvenle iade edilir (stok çoğaltılmaz veya kaybolmaz).
   */
  public handlePatienceTimeout(customerId: EntityId, currentTick: number): void {
    const customer = this.customers.get(customerId);
    if (!customer) return;

    if (customer.basketLotId) {
      const customerBasketLoc: StockLocation = { kind: 'customer', ownerId: customer.id };
      // Ürünü rafa geri iade et
      try {
        this.inventory.transferStock({
          transactionId: `return_${customer.id}_${currentTick}`,
          timestampTick: currentTick,
          source: customerBasketLoc,
          target: this.shelfLocation,
          itemId: customer.requestedItemId,
          quantity: 1,
        });
      } catch {
        // Raf doluyken sepeti ve kuyruk durumunu koru; sonraki tick'te yeniden dene.
        // Müşteri ayrılırsa sepetindeki lot erişilemez hale gelir.
        return;
      }
      customer.basketLotId = null;
    }

    this.recordLostSale(
      customer.id,
      customer.requestedItemId,
      'PATIENCE_EXHAUSTED',
      currentTick,
      'Kuyrukta bekleme süresi aşıldı (sabır tükendi)'
    );

    customer.phase = 'leaving';
    customer.leaveReason = 'PATIENCE_EXHAUSTED';
    customer.queueIndex = null;

    this.advanceQueue();
  }

  /**
   * Kuyruktaki bir müşteri ayrıldığında arkadaki müşterileri bir öne kaydırır.
   */
  private advanceQueue(): void {
    const queued = this.getQueuedCustomers();
    for (let i = 0; i < queued.length; i++) {
      queued[i].queueIndex = i;
      if (i === 0) {
        queued[i].position = { ...this.checkoutServicePos };
      } else {
        queued[i].position = { ...this.checkoutQueueWaitPos };
      }
    }
  }

  private recordLostSale(
    customerId: EntityId,
    itemId: ItemId,
    reason: LostSaleReason,
    timestampTick: number,
    details?: string
  ): void {
    this.lostSales.push({
      customerId,
      itemId,
      reason,
      timestampTick,
      details,
    });
  }

  /**
   * İki 2B nokta arasındaki mesafeyi hesaplar.
   */
  private distanceTo(a: WorldPosition, b: WorldPosition): number {
    const dx = a.x - b.x;
    const dz = a.z - b.z;
    return Math.hypot(dx, dz);
  }

  /**
   * Hedefe doğru bir adım hareket ettirir.
   */
  private moveTowards(current: WorldPosition, target: WorldPosition, maxStep: number): boolean {
    const dist = this.distanceTo(current, target);
    if (dist <= maxStep) {
      current.x = target.x;
      current.z = target.z;
      return true;
    }
    const ratio = maxStep / dist;
    current.x += (target.x - current.x) * ratio;
    current.z += (target.z - current.z) * ratio;
    return false;
  }

  /**
   * Sabit simülasyon adımı (100 ms tick)
   */
  public step(currentTick: number): void {
    for (const customer of Array.from(this.customers.values())) {
      switch (customer.phase) {
        case 'entering':
        case 'toShelf': {
          const arrived = this.moveTowards(customer.position, this.shelfServicePos, this.walkSpeed);
          if (arrived) {
            customer.phase = 'toShelf';
            this.inspectAndPickFromShelf(customer.id, currentTick);
          }
          break;
        }

        case 'toCheckout': {
          const arrived = this.moveTowards(
            customer.position,
            this.checkoutServicePos,
            this.walkSpeed
          );
          if (arrived) {
            this.joinQueue(customer.id);
          }
          break;
        }

        case 'queued': {
          // Kuyrukta sabır sayacı geri sayar (D-019 D.2: 40 saniye = 400 tick)
          customer.patienceRemainingTicks -= 1;
          if (customer.patienceRemainingTicks <= 0) {
            this.handlePatienceTimeout(customer.id, currentTick);
          } else if (customer.queueIndex === 0) {
            // Servis noktasındaki müşteri için ödeme gerçekleştirilir
            this.checkoutCustomer(customer.id, currentTick);
          }
          break;
        }

        case 'leaving': {
          const arrived = this.moveTowards(customer.position, this.entrancePos, this.walkSpeed);
          if (arrived) {
            this.customers.delete(customer.id);
          }
          break;
        }
      }
    }
  }

  public serialize(): {
    customers: Customer[];
    completedSales: SaleResult[];
    lostSales: LostSaleRecord[];
    customerCounter: number;
    rngState: number;
  } {
    return {
      customers: Array.from(this.customers.values()).map((c) => ({
        ...c,
        position: { ...c.position },
      })),
      completedSales: [...this.completedSales],
      lostSales: [...this.lostSales],
      customerCounter: this.customerCounter,
      rngState: this.rng.getState(),
    };
  }

  public restore(data: {
    customers: Customer[];
    completedSales: SaleResult[];
    lostSales: LostSaleRecord[];
    customerCounter: number;
    rngState?: number;
  }): void {
    this.customers.clear();
    for (const c of data.customers) {
      this.customers.set(c.id, { ...c, position: { ...c.position } });
    }
    this.completedSales = [...data.completedSales];
    this.lostSales = [...data.lostSales];
    this.customerCounter = data.customerCounter;
    if (data.rngState !== undefined) {
      this.rng.setState(data.rngState);
    }
  }
}
