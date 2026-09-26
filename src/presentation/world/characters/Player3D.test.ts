import { describe, it, expect } from 'vitest';
import { Player3D } from './Player3D';

describe('Player3D', () => {
  it('builds a player specific mesh', () => {
    const player = new Player3D('player-1');
    expect(player.group.children[0].type).toBe('Mesh');
  });
});
