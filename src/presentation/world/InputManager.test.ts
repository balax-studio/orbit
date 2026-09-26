import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { InputManager } from './InputManager';

describe('InputManager', () => {
  it('registers clicks and performs raycasting', () => {
    // Create a mock canvas
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;

    const camera = new THREE.PerspectiveCamera(75, 800/600);
    const scene = new THREE.Scene();
    
    // Add a mesh to click
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10));
    mesh.position.set(0, 0, -10); // in front of camera
    scene.add(mesh);

    const inputManager = new InputManager(canvas, camera, scene);
    
    const callback = vi.fn();
    inputManager.onPointSelected = callback;

    // Simulate click at center (0,0 in NDC)
    // Raycaster from 0,0 looking down -Z should hit the mesh at z=-5
    const event = new MouseEvent('pointerdown', {
      clientX: 400,
      clientY: 300
    });
    
    // Dispatching directly might not trigger the internal listener if it's attached via addEventListener
    // But we can call the public/private handle method if we mock it, or just dispatch and hope JSDOM works
    canvas.dispatchEvent(event);

    expect(callback).toHaveBeenCalled();
    const point = callback.mock.calls[0][0] as THREE.Vector3;
    expect(point).toBeInstanceOf(THREE.Vector3);
  });
});
