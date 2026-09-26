# Test Strategy (Test-Driven Development)

## Core Philosophy
We strictly follow **Test-Driven Development (TDD)**. No core logic is implemented without a failing test first.
We use `Vitest` as our test runner.

## What We Test
1. **Zustand State (`src/store/useGameStore.ts`)**:
   - This is the most critical part of the application.
   - **How to test**: Import the store, call its actions (e.g., `getState().addMoney(50)`), and assert the new state (`expect(getState().money).toBe(50)`).
   - Before each test, you MUST reset the store to its initial state using a custom reset function.

2. **Data Logic & Utilities (`src/utils/`)**:
   - Pure functions that calculate prices, crafting times, or queue positions.
   - 100% coverage expected.

## What We DO NOT Test (or mock heavily)
1. **Three.js / React Three Fiber Components**:
   - `WebGLRenderer` does not exist in standard JSDOM/Happy-DOM environments.
   - Do NOT try to mount `<Canvas>` in unit tests.
   - If a React component must be tested, mock `@react-three/fiber` and `@react-three/drei` entirely. Focus on verifying that the component reads the right data from Zustand, not on WebGL rendering.

2. **CSS / Tailwind**:
   - Visual regression is handled manually or via E2E tools (Playwright), not unit tests.

## Bug Fixing Protocol
1. User reports a bug or AI spots a flaw.
2. AI writes a test in `*.test.ts` that reproduces the bug (the test MUST FAIL).
3. AI modifies the implementation to make the test PASS.
4. AI refactors the code without breaking the test.
