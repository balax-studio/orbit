import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { SceneManager } from './SceneManager';

vi.mock('three', async () => {
  const actual = await vi.importActual('three') as any;
  return {
    ...actual,
    WebGLRenderer: vi.fn().mockImplementation(function() {
      return {
        setSize: vi.fn(),
        render: vi.fn(),
        domElement: document.createElement('canvas'),
      };
    }),
  };
});

describe('SceneManager', () => {
  let manager: SceneManager;

  beforeEach(() => {
    // We mock the DOM element for the renderer
    const canvas = document.createElement('canvas');
    manager = new SceneManager(canvas);
  });

  it('initializes a scene, camera, and renderer', () => {
    expect(manager.scene).toBeDefined();
    expect(manager.camera).toBeDefined();
    expect(manager.renderer).toBeDefined();
  });

  it('can add and remove meshes from the scene', () => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
    manager.add(mesh);
    expect(manager.scene.children.includes(mesh)).toBe(true);

    manager.remove(mesh);
    expect(manager.scene.children.includes(mesh)).toBe(false);
  });
});
