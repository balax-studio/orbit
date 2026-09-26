import { describe, it, expect, vi } from 'vitest';
import { AppBootstrap } from './bootstrap';

// Mock WebGLRenderer to avoid jsdom canvas issues
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

describe('AppBootstrap', () => {
  it('instantiates and sets up game engine and scene', () => {
    const canvas = document.createElement('canvas');
    const app = new AppBootstrap(canvas);
    expect(app).toBeDefined();
    expect(app.engine).toBeDefined();
    expect(app.sceneManager).toBeDefined();
  });
});
