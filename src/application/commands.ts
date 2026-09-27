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

export type ApplicationCommand =
  | CreditTransactionCommand
  | DebitTransactionCommand
  | TransferStockCommand
  | ReserveStockCommand
  | CancelReservationCommand;

export type CommandResult =
  | LedgerEntry
  | TransferResult
  | Reservation
  | { cancelled: boolean; reservationId: EntityId };

export class CommandDispatcher {
  private ledger: EconomyLedger;
  private inventory?: InventoryManager;

  constructor(ledger: EconomyLedger, inventory?: InventoryManager) {
    this.ledger = ledger;
    this.inventory = inventory;
  }

  public setInventory(inventory: InventoryManager): void {
    this.inventory = inventory;
  }

  public execute(command: ApplicationCommand): CommandResult {
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

      default:
        throw new Error(`Bilinmeyen komut tipi: ${(command as Command).type}`);
    }
  }
}
