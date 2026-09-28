# P0-04 Sales Verification

Date: 2026-09-28  
Scope: P0 customer purchase, basket, queue, sale ledger, and player-visible outcome.

## Result

P0 uses the catalog retail price, checks actual shelf stock and customer budget, and completes basket consumption plus credit through one `COMPLETE_SALE` command. Duplicate transaction IDs return the prior sale without another stock or balance effect. Customer tick journaling persists the inventory, ledger, and customer result together and restores them if the write fails.

This pass replaced the HUD's raw `queued`/`leaving` phase labels with brief labels derived from customer state. Empty shelf, budget rejection, queue position, patience timeout, pending sale write, and durable purchase are distinguishable. The HUD shows purchase completion only after the customer-tick journal succeeds. P0 price remains fixed at the catalog price; customer price response begins in A2 and player-selected shelf pricing in A3 (KARARLAR.md D-019 D.3).

## Acceptance evidence

1. **Actual shelf stock and recorded price; one product/balance result:** `CustomerManager.inspectAndPickFromShelf` checks available shelf stock and `P0_PRODUCTS` price/budget. `COMPLETE_SALE` consumes the customer's basket lot and credits the same transaction through the application command. `tests/unit/p0_sales.test.ts` verifies the 1.50-credit P0 sale, product removal, and balance result.
2. **Duplicate transaction safety:** sales tests repeat the transaction callback and verify one sale/ledger entry and one product removal. Durable customer tests force the sale journal write to fail, verify rollback, and retry without duplicate credit.
3. **Distinct real customer/queue outcomes:** `customerStatusLabel` maps current customer phase and leave reason to readable text; tests cover empty shelf, budget rejection, queue position, patience timeout, and the difference between pending and completed sale writes.

## Android device observation

- Technical evidence: after the responsive HUD change, the debug APK was rebuilt with Java 21, installed, and launched on the connected Xiaomi Android 13 device. The app process was present and `P0_04_ANDROID_LAUNCH.png` records the updated launch screen. This verifies app launch only.
- Guided user observation: pending. No guided action/result has been recorded yet, so no customer sale or HUD behavior is accepted from a user's device observation. Any earlier agent-driven interaction is excluded from user acceptance evidence.

## Web preview

- Chrome mobile emulation at 375×812 CSS pixels showed the header, customer status, and action panel inside the viewport. Header/footer bounds were x=16..359 with no horizontal overflow. `src/index.css` now lets the header controls wrap and constrains the HUD panels on narrow screens.
- This is a visual layout check. No sale interaction or player acceptance is inferred from the screenshot.

## Checks run

- `npm test -- tests/unit/p0_sales.test.ts tests/unit/p0_durable_customer.test.ts tests/unit/p0_save.test.ts tests/unit/customer_status.test.ts` — passed, 4 files / 36 tests.
- `npm test` — passed, 16 files / 124 tests.
- `npm run lint` — passed.
- `npm run build` after the responsive HUD CSS change — passed. Vite reports the main JavaScript chunk at 879.03 kB, above its 500 kB advisory threshold.
- `npx cap sync android` — passed after the web build.
- `gradlew.bat assembleDebug` with Java 21 and the installed Android SDK — passed after the web asset sync.
- `adb install -r` and launcher start on the connected Xiaomi Android 13 device — completed; process presence was verified and the updated launch screenshot saved. This is technical launch evidence, not a guided user result, sale interaction, or P0-09 player acceptance.

The debug APK was installed directly through ADB. No Play Protect submission was made. P0-09 still requires end-to-end Android/iOS lifecycle evidence and an external player completing the loop.
# 28 Eylül 2026 — güncel satış incelemesi

P0-03 sonrası satış/transfer ve müşteri tick kayıt yolu yeniden incelendi. `npm test -- tests/unit/p0_sales.test.ts tests/unit/p0_durable_customer.test.ts tests/unit/customer_status.test.ts`: 3 dosyada 20/20 geçti. Önceki Android ekran görüntüsü dosya hash'i değiştiği için bu yeniden incelemenin kanıtı olarak kullanılmadı. Gerçek cihazda rehberli satış ve dış oyuncu kabulü P0-09 için açık.
