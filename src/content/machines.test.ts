import { describe, it, expect } from 'vitest';
import { MACHINES, getMachine } from './machines';

describe('Machines Dictionary', () => {
  it('contains packer machine', () => {
    const packer = getMachine('machine.packer');
    expect(packer.id).toBe('machine.packer');
    expect(packer.type).toBe('packer');
    expect(packer.baseCost).toBe(150);
  });
  
  it('throws for missing machine', () => {
    expect(() => getMachine('machine.invalid')).toThrow();
  });
});
