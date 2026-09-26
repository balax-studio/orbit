import { describe, it, expect } from 'vitest';
import { Customer3D } from './Customer3D';

describe('Customer3D', () => {
  it('builds a customer specific mesh', () => {
    const customer = new Customer3D('cust-1');
    expect(customer.group.children[0].type).toBe('Mesh');
  });
});
