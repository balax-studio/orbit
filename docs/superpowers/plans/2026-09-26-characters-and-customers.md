# Karakterler ve Müşteri Sistemi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the visual entities for the player avatar, characters, and customers, alongside the interaction system (mouse/touch input via raycasting).

**Architecture:** 
- `Character3D` wraps a Three.js `Group` with a humanoid/capsule mesh.
- `Player3D` represents the user's avatar.
- `InputManager` uses `THREE.Raycaster` to handle click events on the canvas, mapping 2D pointer coordinates to 3D intersections against machines/objects.

**Tech Stack:** TypeScript, Three.js, Vitest.

## Global Constraints

- Neo-Brutalist 3D UI: Flat shading `MeshStandardMaterial({ flatShading: true })`.
- Characters should be extremely simple (e.g., a capsule or composed boxes).
- TDD must be followed (Vitest).
- `erasableSyntaxOnly` compatible TypeScript (no parameter properties).

---

### Task 1: Create Character3D Base

**Files:**
- Create: `src/presentation/world/characters/Character3D.ts`
- Test: `src/presentation/world/characters/Character3D.test.ts`

**Interfaces:**
- Produces: `abstract class Character3D`

- [ ] **Step 1: Write the failing test**

```typescript
// src/presentation/world/characters/Character3D.test.ts
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Character3D } from './Character3D';

class TestChar extends Character3D {
  protected buildMesh(): THREE.Mesh {
    return new THREE.Mesh(new THREE.BoxGeometry());
  }
}

describe('Character3D', () => {
  it('initializes and can set target position', () => {
    const char = new TestChar('char-1');
    expect(char.group).toBeInstanceOf(THREE.Group);
    
    char.moveTo(new THREE.Vector3(10, 0, 10));
    expect(char.targetPosition.x).toBe(10);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/presentation/world/characters/Character3D.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/presentation/world/characters/Character3D.ts
import * as THREE from 'three';

export abstract class Character3D {
  public id: string;
  public group: THREE.Group;
  public targetPosition: THREE.Vector3;
  private speed: number = 5.0;

  constructor(id: string) {
    this.id = id;
    this.group = new THREE.Group();
    this.targetPosition = new THREE.Vector3();
    const mesh = this.buildMesh();
    this.group.add(mesh);
  }

  protected abstract buildMesh(): THREE.Mesh;
  
  public moveTo(target: THREE.Vector3): void {
    this.targetPosition.copy(target);
  }

  public update(delta: number): void {
    // Simple lerp / movement towards target
    if (this.group.position.distanceTo(this.targetPosition) > 0.1) {
      const direction = this.targetPosition.clone().sub(this.group.position).normalize();
      this.group.position.add(direction.multiplyScalar(this.speed * delta));
    }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/presentation/world/characters/Character3D.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/presentation/world/characters
git commit -m "feat: add Character3D base class with movement logic"
```

---

### Task 2: Create Player3D Implementation

**Files:**
- Create: `src/presentation/world/characters/Player3D.ts`
- Test: `src/presentation/world/characters/Player3D.test.ts`

**Interfaces:**
- Consumes: `Character3D`
- Produces: `Player3D` class

- [ ] **Step 1: Write the failing test**

```typescript
// src/presentation/world/characters/Player3D.test.ts
import { describe, it, expect } from 'vitest';
import { Player3D } from './Player3D';

describe('Player3D', () => {
  it('builds a player specific mesh', () => {
    const player = new Player3D('player-1');
    expect(player.group.children[0].type).toBe('Mesh');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/presentation/world/characters/Player3D.test.ts`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

```typescript
// src/presentation/world/characters/Player3D.ts
import * as THREE from 'three';
import { Character3D } from './Character3D';

export class Player3D extends Character3D {
  protected buildMesh(): THREE.Mesh {
    // Neo-Brutalist: simple capsule, white paper color
    const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xF4F0E6, 
      flatShading: true 
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 1; // Pivot at feet
    return mesh;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/presentation/world/characters/Player3D.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/presentation/world/characters/Player3D.ts src/presentation/world/characters/Player3D.test.ts
git commit -m "feat: add Player3D avatar representation"
```

---

### Task 3: Hook Player3D into Scene

**Files:**
- Modify: `src/app/bootstrap.ts`

- [ ] **Step 1: Integrate Player3D**

Modify `src/app/bootstrap.ts` to instantiate `Player3D`, add it to the `sceneManager`, and call `update(delta)` in the render loop.

- [ ] **Step 2: Commit**

```bash
git add src/app/bootstrap.ts
git commit -m "feat: integrate Player3D into visual bootstrap"
```
