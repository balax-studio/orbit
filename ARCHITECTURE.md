# System Architecture

## Core Design Principles
The project separates the **State/Logic** from the **Presentation**.
1. **Zustand (Store):** Holds the pure game state (inventory, money, machines, queues). Does NOT know about React or Three.js.
2. **React (UI):** Reads from Zustand to draw HTML menus, buttons, and HUD.
3. **React Three Fiber (3D):** Reads from Zustand to spawn 3D meshes (machines, players, customers) in the WebGL canvas.

## Folder Structure

```text
src/
├── components/
│   ├── ui/          # 2D React Components (HUD, Inventory, Buttons)
│   └── world/       # 3D R3F Components (Player, Machines, Customers, Scene)
├── store/           # Zustand stores (useGameStore.ts)
├── types/           # TypeScript interfaces and contracts (Machine, Item, Recipe)
├── utils/           # Helper functions, math, constants
├── App.tsx          # Main entry point, combining UI overlay and Canvas
└── index.css        # Tailwind imports and global shader styles
```

## Data Flow
- User clicks a 3D machine -> `onClick` event in R3F -> calls `store.interactWithMachine(id)` -> Zustand updates state -> React/R3F re-renders the changes automatically.
- Game Loop: A `useFrame` hook inside R3F, or a global `requestAnimationFrame` loop in Zustand, updates time-based mechanics (like crafting progress).
