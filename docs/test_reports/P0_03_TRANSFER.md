# P0-03 Transfer Verification

Date: 2026-09-28  
Scope: capacity, reservation, cancellation, duplicate transfer, and durable inventory result.

## Result

P0-03 acceptance is covered by the current application and inventory implementation plus targeted tests. This pass tightened two edges: `setCapacity` rejects a limit below physical stock plus active incoming reservations, and the app awaits durable command writes for transfer actions on both web and native platforms before reporting success.

## Acceptance evidence

1. **Source, carrier, destination, capacity, and reservation checks:** `PlayerTransferService` enforces the service-cell range and requires the player to be one transfer endpoint. `InventoryManager.createReservation` checks available source stock and destination capacity; reserved transfers check the matching active reservation, source, target, item, and quantity. The capacity-shrink regression test confirms occupied and reserved capacity cannot be invalidated.
2. **Cancellation and duplicate safety:** reservation cancellation releases an active reservation without moving stock. `transferStock` returns the committed result for the same transaction ID without a second stock effect. Tests cover cancellation, duplicate IDs, lot/quantity conservation, and a failed durable journal write.
3. **Single domain transfer and durable result:** `InventoryManager.transferStock` moves stock and records the transfer result in one synchronous domain operation. `PlayerTransferService` uses `executeAsync`; the app now supplies an awaited journal observer on web and native platforms, and its success message follows the awaited transfer. A delayed-journal test confirms the player action stays pending until the transfer write completes. Inventory serialization includes lots, reservations, and committed transaction results. Tests restore a snapshot and verify the transaction remains deduplicated; the player transfer test also verifies pickup, save/reload, and drop.

## Checks run

- `npm test -- tests/unit/p0_transfer.test.ts tests/unit/p0_player_transfer.test.ts` — passed, 2 files / 17 tests.
- `npm run lint` — passed.
- `npm run build` — passed. Vite reports the existing main JavaScript chunk is about 878 kB, above its 500 kB advisory threshold.
- `git diff --check` — passed; Git emitted only existing working-copy LF/CRLF normalization notices.

No Android transfer interaction test was run for this task. P0-09 still owns end-to-end device and external-player acceptance; the earlier Android movement evidence is not transfer evidence.
