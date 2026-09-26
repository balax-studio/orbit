# Görsel Kimlik ve Veri Sözleşmeleri Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the Neo-Brutalist CSS identity, a Three.js generative background shader, and the JSON/TypeScript data contracts for all items and recipes defined in the spec.

**Architecture:** 
- CSS tokens in `src/style.css` following `high-end-visual-design` principles but strictly adhering to Neo-Brutalist palette (ink `#171717`, paper `#F4F0E6`, etc).
- Three.js fragment shader for a subtle retro CRT/dither background effect, attached to a screen-space quad behind the main game view.
- Static data contracts (`src/content/`) acting as the single source of truth for the domain logic to consume, structured as strongly typed TypeScript constants.

**Tech Stack:** TypeScript, Three.js, CSS, Vitest.

## Global Constraints

- Neo-Brutalist UI: Ink black #171717, Paper #F4F0E6, Signal Yellow #FFE156, Electric Cyan #35D9E6, Vivid Green #A7EB52. Hard shadows (no blur), thick borders.
- No React/Vue; use vanilla DOM/HTML for UI overlay.
- TDD must be followed (Vitest).
- `erasableSyntaxOnly` compatible TypeScript (no parameter properties).

---

### Task 1: Create Background Shader

**Files:**
- Create: `src/presentation/world/BackgroundShader.ts`
- Modify: `src/presentation/world/SceneManager.ts:1-200`
- Test: `src/presentation/world/BackgroundShader.test.ts`

**Interfaces:**
- Produces: `class BackgroundShader { constructor(scene: THREE.Scene); update(time: number): void; }`

- [ ] **Step 1: Write the failing test**

```typescript
// src/presentation/world/BackgroundShader.test.ts
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { BackgroundShader } from './BackgroundShader';

describe('BackgroundShader', () => {
  it('adds a mesh to the scene', () => {
    const scene = new THREE.Scene();
    const shader = new BackgroundShader(scene);
    
    // Should have added a Mesh with ShaderMaterial
    expect(scene.children.length).toBe(1);
    expect(scene.children[0]).toBeInstanceOf(THREE.Mesh);
    expect((scene.children[0] as THREE.Mesh).material).toBeInstanceOf(THREE.ShaderMaterial);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/presentation/world/BackgroundShader.test.ts`
Expected: FAIL with "Cannot find module './BackgroundShader'"

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/presentation/world/BackgroundShader.ts
import * as THREE from 'three';

export class BackgroundShader {
  public mesh: THREE.Mesh;
  public material: THREE.ShaderMaterial;

  constructor(scene: THREE.Scene) {
    const geometry = new THREE.PlaneGeometry(2, 2);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0); // full screen quad
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        void main() {
          // Subtle scanline / dither effect
          float scanline = sin(vUv.y * 800.0) * 0.02;
          gl_FragColor = vec4(vec3(0.09) - scanline, 1.0); // #171717 ish
        }
      `,
      depthWrite: false,
      depthTest: false
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    // Render behind everything
    this.mesh.renderOrder = -1;
    scene.add(this.mesh);
  }

  public update(time: number): void {
    this.material.uniforms.time.value = time;
  }
}
```

- [ ] **Step 4: Hook it up in SceneManager**

```typescript
// Add to src/presentation/world/SceneManager.ts
// Inside constructor:
import { BackgroundShader } from './BackgroundShader';

// Add property
public bgShader: BackgroundShader;

// After scene setup:
this.bgShader = new BackgroundShader(this.scene);

// In render loop (if you have one, or just expose it)
// For now, just instantiating it is enough.
```

- [ ] **Step 5: Run tests to verify pass**

Run: `npx vitest run src/presentation/world/BackgroundShader.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/presentation/world/BackgroundShader.ts src/presentation/world/BackgroundShader.test.ts src/presentation/world/SceneManager.ts
git commit -m "feat: add background shader with CRT scanline effect"
```

---

### Task 2: Data Contracts for Items

**Files:**
- Create: `src/content/items.ts`
- Test: `src/content/items.test.ts`

**Interfaces:**
- Produces: `ItemDefinition` interface, `ITEMS` object dictionary.

- [ ] **Step 1: Write the failing test**

```typescript
// src/content/items.test.ts
import { describe, it, expect } from 'vitest';
import { ITEMS, getItem } from './items';

describe('Items Dictionary', () => {
  it('contains water and nutrient_cube', () => {
    const water = getItem('item.water');
    expect(water.id).toBe('item.water');
    expect(water.basePrice).toBe(0);
    
    const cube = getItem('item.nutrient_cube');
    expect(cube.id).toBe('item.nutrient_cube');
    expect(cube.basePrice).toBe(12);
  });
  
  it('throws for missing item', () => {
    expect(() => getItem('item.invalid')).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/content/items.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/content/items.ts
export interface ItemDefinition {
  id: string;
  name: string;
  stackSize: number;
  basePrice: number;
  category: 'resource' | 'intermediate' | 'product';
}

export const ITEMS: Record<string, ItemDefinition> = {
  'item.water': { id: 'item.water', name: 'Su', stackSize: 20, basePrice: 0, category: 'intermediate' },
  'item.nutrient_cube': { id: 'item.nutrient_cube', name: 'Besin Küpü', stackSize: 10, basePrice: 12, category: 'product' },
  // Add algae just so it exists for the recipe
  'item.algae': { id: 'item.algae', name: 'Yosun', stackSize: 20, basePrice: 0, category: 'intermediate' }
};

export function getItem(id: string): ItemDefinition {
  const item = ITEMS[id];
  if (!item) throw new Error(`Item not found: ${id}`);
  return item;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/content/items.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/content/items.ts src/content/items.test.ts
git commit -m "feat: add data contracts for basic items"
```

---

### Task 3: Data Contracts for Recipes

**Files:**
- Create: `src/content/recipes.ts`
- Test: `src/content/recipes.test.ts`

**Interfaces:**
- Consumes: `ItemDefinition` IDs from `items.ts`
- Produces: `RecipeDefinition` interface, `RECIPES` array.

- [ ] **Step 1: Write the failing test**

```typescript
// src/content/recipes.test.ts
import { describe, it, expect } from 'vitest';
import { RECIPES, getRecipesForStation } from './recipes';

describe('Recipes Dictionary', () => {
  it('contains nutrient_cube recipe for packer', () => {
    const packerRecipes = getRecipesForStation('packer');
    expect(packerRecipes.length).toBeGreaterThan(0);
    expect(packerRecipes[0].outputs[0].itemId).toBe('item.nutrient_cube');
    expect(packerRecipes[0].durationSeconds).toBe(8);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/content/recipes.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/content/recipes.ts
export interface RecipeComponent {
  itemId: string;
  quantity: number;
}

export interface RecipeDefinition {
  id: string;
  stationType: string;
  inputs: RecipeComponent[];
  outputs: RecipeComponent[];
  durationSeconds: number;
  powerRequired: number;
}

export const RECIPES: RecipeDefinition[] = [
  {
    id: 'recipe.nutrient_cube',
    stationType: 'packer',
    inputs: [{ itemId: 'item.algae', quantity: 2 }],
    outputs: [{ itemId: 'item.nutrient_cube', quantity: 1 }],
    durationSeconds: 8,
    powerRequired: 2
  }
];

export function getRecipesForStation(stationType: string): RecipeDefinition[] {
  return RECIPES.filter(r => r.stationType === stationType);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/content/recipes.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/content/recipes.ts src/content/recipes.test.ts
git commit -m "feat: add data contracts for recipes"
```
