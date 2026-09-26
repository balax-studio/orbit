# UI/UX Design System (Neo-Brutalist)

## Core Philosophy
The game uses a **Neo-Brutalist** aesthetic. This means:
- No soft shadows. No gradients. No rounded corners (unless explicitly `rounded-sm` for tiny elements).
- Everything looks like a printed poster or a retro computer interface.
- High contrast and bold, thick borders.

## Tailwind Tokens (Configured in tailwind.config.js)
- `bg-neo-black` / `text-neo-black`: `#171717` (Deep Ink Black)
- `bg-neo-paper` / `text-neo-paper`: `#F4F0E6` (Warm Off-White/Paper)
- `bg-neo-yellow` / `text-neo-yellow`: `#FFE156` (Signal Yellow)
- `bg-neo-cyan` / `text-neo-cyan`: `#35D9E6` (Electric Cyan)
- `bg-neo-green` / `text-neo-green`: `#A7EB52` (Vivid Green)
- `bg-neo-red` / `text-neo-red`: `#FF5733` (Alert Red)

## Component Rules
1. **Buttons (`<button>`)**:
   - Must have `border-4 border-neo-black`.
   - Must have a hard shadow: `shadow-[4px_4px_0px_0px_#171717]`.
   - On hover/active: Translate down and right to "press" the shadow (`hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#171717]`).
   - Font must be `font-mono font-bold uppercase`.

2. **Panels / Modals (Inventory, Menus)**:
   - Background: `bg-neo-paper`.
   - Border: `border-4 border-neo-black`.
   - Shadow: `shadow-[8px_8px_0px_0px_#171717]`.
   - Text color: `text-neo-black`.

3. **3D Scene Rules (React Three Fiber)**:
   - All materials must be `<meshStandardMaterial flatShading={true} />`.
   - Outline effect: Use `<Outlines thickness={2} color="black" />` from `@react-three/drei` to give meshes a drawn/comic border.
   - Lighting: One strong `directionalLight` (for sharp cast shadows) and ambient light.
   - Background: Use a flat color (like `neo-paper`) or a custom post-processing shader (CRT scanlines, dither).
