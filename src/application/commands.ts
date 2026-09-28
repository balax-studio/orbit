// Orbit Market - Application Layer Command Dispatcher
// Reference: ARCHITECTURE.md, DOMAIN_MODEL.md, KARARLAR.md D-020

import { EconomyLedger } from '../domain/economy/ledger';
import type { InventoryManager, TransferResult } from '../domain/inventory/InventoryManager';
import type { EntityId, ItemId, LedgerEntry, Reservation, StockLocation, TransactionReason } from '../domain/types';

export interface Command {
  type: string;
  transactionId: string;
  timestampTick: number;
}

export interface CreditTransactionCommand extends Command {
  type: 'CREDIT_ACCOUNT';
  amountAtoms: number;
  reason: TransactionReason;
  metadata?: Record<string, string | number>;
}

export interface DebitTransactionCommand extends Command {
  type: 'DEBIT_ACCOUNT';
  amountAtoms: number;
  reason: TransactionReason;
  metadata?: Record<string, string | number>;
}

export interface TransferStockCommand extends Command {
  type: 'TRANSFER_STOCK';
  source: StockLocation;
  target: StockLocation;
  itemId: ItemId;
  quantity: number;
  reservationId?: EntityId;
}

export interface ReserveStockCommand extends Command {
  type: 'RESERVE_STOCK';
  reservationId: EntityId;
  ownerId: EntityId;
  source: StockLocation;
  target: StockLocation;
  itemId: ItemId;
  quantity: number;
  lotId?: EntityId;
}

export interface CancelReservationCommand extends Command {
  type: 'CANCEL_RESERVATION';
  reservationId: EntityId;
}

export interface CompleteSaleCommand extends Command {
  type: 'COMPLETE_SALE';
  customerId: EntityId;
  shelfLocation: StockLocation;
  customerLocation: StockLocation;
  itemId: ItemId;
  quantity: number;
  unitPriceAtoms: number;
}

export interface SaleResult {
  success: boolean;
  transactionId: string;
  customerId: EntityId;
  itemId: ItemId;
  quantity: number;
  amountAtoms: number;
  balanceAfterAtoms: number;
  isDuplicate: boolean;
}

export type ApplicationCommand =
  | CreditTransactionCommand
  | DebitTransactionCommand
  | TransferStockCommand
  | ReserveStockCommand
  | CancelReservationCommand
  | CompleteSaleCommand;

export type CommandResult =
  | LedgerEntry
  | TransferResult
  | Reservation
  | { cancelled: boolean; reservationId: EntityId }
  | SaleResult;

export type CommandCommitObserver = (command: ApplicationCommand, result: CommandResult) => void;
export type AsyncCommandCommitObserver = (command: ApplicationCommand, result: CommandResult) => Promise<void>;

export class CommandDispatcher {
  private ledger: EconomyLedger;
  private inventory?: InventoryManager;
  private completedSales: Map<string, SaleResult> = new Map();
  private readonly onCommitted?: CommandCommitObserver;
  private readonly onCommittedAsync?: AsyncCommandCommitObserver;

  constructor(
    ledger: EconomyLedger,
    inventory?: InventoryManager,
    onCommitted?: CommandCommitObserver,
    onCommittedAsync?: AsyncCommandCommitObserver
  ) {
    this.ledger = ledger;
    this.inventory = inventory;
    this.onCommitted = onCommitted;
    this.onCommittedAsync = onCommittedAsync;
  }

  public setInventory(inventory: InventoryManager): void {
    this.inventory = inventory;
  }

  public clearTransientSales(): void {
    this.completedSales.clear();
  }

  public execute(command: ApplicationCommand): CommandResult {
    if (this.onCommittedAsync && !this.onCommitted) {
      throw new Error('Use executeAsync for asynchronous durable commits');
    }
    if (!this.onCommitted) return this.executeCommand(command);

    const ledgerBefore = this.ledger.serialize();
    const inventoryBefore = this.inventory?.serialize();
    const completedSalesBefore = new Map(this.completedSales);
    try {
      const result = this.executeCommand(command);
      if (this.isDurableResult(command, result)) this.onCommitted(command, result);
      return result;
    } catch (error) {
      this.ledger.restore(ledgerBefore);
      if (inventoryBefore && this.inventory) this.inventory.restore(inventoryBefore);
      this.completedSales = completedSalesBefore;
      throw error;
    }
  }

  public async executeAsync(command: ApplicationCommand): Promise<CommandResult> {
    if (!this.onCommittedAsync) return this.execute(command);
    const ledgerBefore = this.ledger.serialize();
    const inventoryBefore = this.inventory?.serialize();
    const completedSalesBefore = new Map(this.completedSales);
    try {
      const result = this.executeCommand(command);
      if (this.isDurableResult(command, result)) await this.onCommittedAsync(command, result);
      return result;
    } catch (error) {
      this.ledger.restore(ledgerBefore);
      if (inventoryBefore && this.inventory) this.inventory.restore(inventoryBefore);
      this.completedSales = completedSalesBefore;
      throw error;
    }
  }

  private executeCommand(command: ApplicationCommand): CommandResult {
    switch (command.type) {
      case 'CREDIT_ACCOUNT':
        return this.ledger.commitTransaction({
          transactionId: command.transactionId,
          timestampTick: command.timestampTick,
          type: 'CREDIT',
          amountAtoms: command.amountAtoms,
          reason: command.reason,
          metadata: command.metadata,
        });

      case 'DEBIT_ACCOUNT':
        return this.ledger.commitTransaction({
          transactionId: command.transactionId,
          timestampTick: command.timestampTick,
          type: 'DEBIT',
          amountAtoms: command.amountAtoms,
          reason: command.reason,
          metadata: command.metadata,
        });

      case 'TRANSFER_STOCK':
        if (!this.inventory) {
          throw new Error('InventoryManager bağlı değil');
        }
        return this.inventory.transferStock({
          transactionId: command.transactionId,
          timestampTick: command.timestampTick,
          source: command.source,
          target: command.target,
          itemId: command.itemId,
          quantity: command.quantity,
          reservationId: command.reservationId,
        });

      case 'RESERVE_STOCK':
        if (!this.inventory) {
          throw new Error('InventoryManager bağlı değil');
        }
        return this.inventory.createReservation({
          id: command.reservationId,
          ownerId: command.ownerId,
          source: command.source,
          target: command.target,
          itemId: command.itemId,
          quantity: command.quantity,
          currentTick: command.timestampTick,
          lotId: command.lotId,
        });

      case 'CANCEL_RESERVATION':
        if (!this.inventory) {
          throw new Error('InventoryManager bağlı değil');
        }
        return {
          cancelled: this.inventory.cancelReservation(command.reservationId),
          reservationId: command.reservationId,
        };

      case 'COMPLETE_SALE': {
        const saleKey = command.transactionId;
        const existingSale = this.completedSales.get(saleKey);
        if (existingSale) {
          if (existingSale.customerId !== command.customerId || existingSale.itemId !== command.itemId ||
              existingSale.quantity !== command.quantity ||
              existingSale.amountAtoms !== command.quantity * command.unitPriceAtoms) {
            throw new Error(`İşlem ID farklı satış için kullanılmış: ${saleKey}`);
          }
          return {
            ...existingSale,
            isDuplicate: true,
          };
        }

        const existingLedgerEntry = this.ledger.getEntry(saleKey);
        if (existingLedgerEntry?.reason === 'SALE') {
          const metadata = existingLedgerEntry.metadata ?? {};
          if (!metadata.customerId || !metadata.itemId || !metadata.quantity ||
              metadata.customerId !== command.customerId || metadata.itemId !== command.itemId ||
              metadata.quantity !== command.quantity ||
              existingLedgerEntry.amountAtoms !== command.quantity * command.unitPriceAtoms) {
            throw new Error(`Satış işlem kimliği ledger içinde zaten kullanılmış: ${saleKey}`);
          }
          const result: SaleResult = {
            success: true,
            transactionId: saleKey,
            customerId: String(metadata.customerId ?? command.customerId),
            itemId: String(metadata.itemId ?? command.itemId) as ItemId,
            quantity: Number(metadata.quantity ?? command.quantity),
            amountAtoms: existingLedgerEntry.amountAtoms,
            balanceAfterAtoms: existingLedgerEntry.balanceAfterAtoms,
            isDuplicate: true,
          };
          this.completedSales.set(saleKey, { ...result, isDuplicate: false });
          return result;
        }

        const totalPriceAtoms = command.quantity * command.unitPriceAtoms;
        if (!this.inventory) throw new Error('InventoryManager bağlı değil');
        if (command.customerLocation.kind !== 'customer' || command.customerLocation.ownerId !== command.customerId) {
          throw new Error('Satış sepeti müşteriyle eşleşmiyor');
        }
        if (!Number.isSafeInteger(command.quantity) || command.quantity <= 0 ||
            !Number.isSafeInteger(command.unitPriceAtoms) || command.unitPriceAtoms <= 0 ||
            !Number.isSafeInteger(totalPriceAtoms)) throw new Error('Geçersiz satış miktarı veya fiyatı');
        if (this.ledger.hasProcessed(command.transactionId)) {
          throw new Error(`Satış işlem kimliği ledger içinde zaten kullanılmış: ${command.transactionId}`);
        }
        if (this.inventory.getAvailableQuantity(command.customerLocation, command.itemId) < command.quantity) {
          throw new Error('Müşteri sepetinde yeterli ürün yok');
        }

        // 1. Stok düşümü (müşteri sepetinden veya raftan)
        if (this.inventory) {
          const consumeLocation = command.customerLocation;
          this.inventory.consumeStock({
            transactionId: `consume_${command.transactionId}`,
            timestampTick: command.timestampTick,
            location: consumeLocation,
            itemId: command.itemId,
            quantity: command.quantity,
          });
        }

        // 2. Kredi atom muhasebesi (10.000 atom/kredi, tek transaction atomikliği)
        const ledgerEntry = this.ledger.commitTransaction({
          transactionId: command.transactionId,
          timestampTick: command.timestampTick,
          type: 'CREDIT',
          amountAtoms: totalPriceAtoms,
          reason: 'SALE',
          metadata: {
            customerId: command.customerId,
            itemId: command.itemId,
            quantity: command.quantity,
            unitPriceAtoms: command.unitPriceAtoms,
          },
        });

        const result: SaleResult = {
          success: true,
          transactionId: command.transactionId,
          customerId: command.customerId,
          itemId: command.itemId,
          quantity: command.quantity,
          amountAtoms: totalPriceAtoms,
          balanceAfterAtoms: ledgerEntry.balanceAfterAtoms,
          isDuplicate: false,
        };

        this.completedSales.set(saleKey, result);
        return result;
      }

      default:
        throw new Error(`Bilinmeyen komut tipi: ${(command as Command).type}`);
    }
  }

  private isDurableResult(command: ApplicationCommand, result: CommandResult): boolean {
    if ('isDuplicate' in result && result.isDuplicate) return false;
    if (command.type === 'CANCEL_RESERVATION' && (!('cancelled' in result) || !result.cancelled)) return false;
    return true;
  }
}
