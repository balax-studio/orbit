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
