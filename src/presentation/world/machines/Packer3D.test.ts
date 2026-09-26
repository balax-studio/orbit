import { describe, it, expect } from 'vitest';
import { Packer3D } from './Packer3D';

describe('Packer3D', () => {
  it('builds a packer specific mesh', () => {
    const packer = new Packer3D('packer-1');
    expect(packer.group.children[0].type).toBe('Mesh');
  });
});
