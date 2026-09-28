import { describe, expect, it } from 'vitest';
import { CommandDispatcher } from '../../src/application/commands';
import { PlayerTransferService } from '../../src/application/PlayerTransferService';
import { EconomyLedger } from '../../src/domain/economy/ledger';
import { InventoryManager } from '../../src/domain/inventory/InventoryManager';

describe('player transfer through Application commands', () => {
  it('requires the service cell and preserves stock through pickup, save and drop', async () => {
    const inventory = new InventoryManager();
    const dispatcher = new CommandDispatcher(new EconomyLedger(0), inventory);
    const transfer = new PlayerTransferService(dispatcher, inventory);
    const source = { kind: 'source' as const, ownerId: 'source.spring_water' };
    const player = { kind: 'player' as const, ownerId: 'player' };
    const input = { kind: 'machineInput' as const, ownerId: 'station.bottler' };
    inventory.addLot({ id: 'water-1', itemId: 'item.raw_water', quantity: 5,
      qualityScore: 40, unitCostAtoms: 0, sourceId: 'test', location: source });

    await expect(transfer.transfer({ source, target: player, itemId: 'item.raw_water', quantity: 5,
      tick: 1, playerPosition: { x: 3, z: 3 }, servicePosition: { x: 0, z: 0 } }))
      .rejects.toThrow('servis noktasına');
    expect(inventory.getPhysicalQuantity(source, 'item.raw_water')).toBe(5);

    await transfer.transfer({ source, target: player, itemId: 'item.raw_water', quantity: 5,
      tick: 2, playerPosition: { x: 0, z: 0 }, servicePosition: { x: 0, z: 0 } });
    const snapshot = inventory.serialize();
    const restored = new InventoryManager();
    restored.restore(snapshot);
    expect(restored.getPhysicalQuantity(player, 'item.raw_water')).toBe(5);
    const resumed = new PlayerTransferService(new CommandDispatcher(new EconomyLedger(0), restored), restored);
    await resumed.transfer({ source: player, target: input, itemId: 'item.raw_water', quantity: 5,
      tick: 3, playerPosition: { x: 1, z: 0 }, servicePosition: { x: 0, z: 0 } });
    expect(restored.getPhysicalQuantity(input, 'item.raw_water')).toBe(5);
    expect(restored.getPhysicalQuantity(player, 'item.raw_water')).toBe(0);
    expect(restored.getPhysicalQuantity(source, 'item.raw_water')).toBe(0);
  });

  it('does not move stock when the transfer journal write fails', async () => {
    const inventory = new InventoryManager();
    const source = { kind: 'source' as const, ownerId: 'source.spring_water' };
    const player = { kind: 'player' as const, ownerId: 'player' };
    inventory.addLot({ id: 'water-2', itemId: 'item.raw_water', quantity: 1,
      qualityScore: 40, unitCostAtoms: 0, sourceId: 'test', location: source });
    const dispatcher = new CommandDispatcher(new EconomyLedger(0), inventory, undefined,
      async (command) => {
        if (command.type === 'TRANSFER_STOCK') throw new Error('disk full');
      });
    const transfer = new PlayerTransferService(dispatcher, inventory);

    await expect(transfer.transfer({ source, target: player, itemId: 'item.raw_water', quantity: 1,
      tick: 1, playerPosition: { x: 0, z: 0 }, servicePosition: { x: 0, z: 0 } }))
      .rejects.toThrow('disk full');
    expect(inventory.getPhysicalQuantity(source, 'item.raw_water')).toBe(1);
    expect(inventory.getPhysicalQuantity(player, 'item.raw_water')).toBe(0);
    expect(inventory.getActiveReservations()).toHaveLength(0);
  });

  it('waits for the transfer journal write before resolving the player action', async () => {
    const inventory = new InventoryManager();
    const source = { kind: 'source' as const, ownerId: 'source.spring_water' };
    const player = { kind: 'player' as const, ownerId: 'player' };
    inventory.addLot({ id: 'water-durable', itemId: 'item.raw_water', quantity: 1,
      qualityScore: 40, unitCostAtoms: 0, sourceId: 'test', location: source });

    let releaseTransferWrite!: () => void;
    let notifyTransferWriteStarted!: () => void;
    const transferWriteStarted = new Promise<void>((resolve) => { notifyTransferWriteStarted = resolve; });
    const transferWrite = new Promise<void>((resolve) => { releaseTransferWrite = resolve; });
    const committedCommands: string[] = [];
    const dispatcher = new CommandDispatcher(new EconomyLedger(0), inventory, undefined,
      async (command) => {
        committedCommands.push(command.type);
        if (command.type === 'TRANSFER_STOCK') {
          notifyTransferWriteStarted();
          await transferWrite;
        }
      });
    const transfer = new PlayerTransferService(dispatcher, inventory);
    let actionResolved = false;
    const action = transfer.transfer({ source, target: player, itemId: 'item.raw_water', quantity: 1,
      tick: 4, playerPosition: { x: 0, z: 0 }, servicePosition: { x: 0, z: 0 } })
      .then(() => { actionResolved = true; });

    await transferWriteStarted;
    expect(actionResolved).toBe(false);
    expect(committedCommands).toEqual(['RESERVE_STOCK', 'TRANSFER_STOCK']);
    releaseTransferWrite();
    await action;

    expect(actionResolved).toBe(true);
    expect(inventory.getPhysicalQuantity(source, 'item.raw_water')).toBe(0);
    expect(inventory.getPhysicalQuantity(player, 'item.raw_water')).toBe(1);
  });
});
