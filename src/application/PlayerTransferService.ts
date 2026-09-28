import type { CommandDispatcher } from './commands';
import type { InventoryManager } from '../domain/inventory/InventoryManager';
import type { ItemId, StockLocation, WorldPosition } from '../domain/types';

export interface PlayerTransferRequest {
  source: StockLocation;
  target: StockLocation;
  itemId: ItemId;
  quantity: number;
  tick: number;
  playerPosition: WorldPosition;
  servicePosition: WorldPosition;
}

export class PlayerTransferService {
  private readonly dispatcher: CommandDispatcher;
  private readonly inventory: InventoryManager;

  constructor(
    dispatcher: CommandDispatcher,
    inventory: InventoryManager,
  ) {
    this.dispatcher = dispatcher;
    this.inventory = inventory;
  }

  public async transfer(request: PlayerTransferRequest): Promise<void> {
    const distance = Math.hypot(
      request.playerPosition.x - request.servicePosition.x,
      request.playerPosition.z - request.servicePosition.z,
    );
    if (distance > 1.25) throw new Error('İşlem için istasyonun servis noktasına yaklaş.');
    if ((request.source.kind !== 'player' || request.source.ownerId !== 'player') &&
        (request.target.kind !== 'player' || request.target.ownerId !== 'player')) {
      throw new Error('Oyuncu yükü bu transferin kaynağı veya hedefi olmalı.');
    }
    if (request.quantity < 1 || !Number.isInteger(request.quantity)) {
      throw new Error('Geçersiz taşıma miktarı.');
    }

    const reservationId = `player-reservation:${request.tick}:${this.inventory.serialize().reservations.length + 1}`;
    await this.dispatcher.executeAsync({
      type: 'RESERVE_STOCK', transactionId: reservationId,
      reservationId, ownerId: 'player', timestampTick: request.tick,
      source: request.source, target: request.target,
      itemId: request.itemId, quantity: request.quantity,
    });
    try {
      await this.dispatcher.executeAsync({
        type: 'TRANSFER_STOCK', transactionId: `player-transfer:${reservationId}`,
        timestampTick: request.tick, source: request.source, target: request.target,
        itemId: request.itemId, quantity: request.quantity, reservationId,
      });
    } catch (error) {
      try {
        await this.dispatcher.executeAsync({
          type: 'CANCEL_RESERVATION', transactionId: `player-cancel:${reservationId}`,
          timestampTick: request.tick, reservationId,
        });
      } catch {
        // Keep the persisted reservation for recovery when storage itself failed.
      }
      throw error;
    }
  }
}
