import { describe, it, expect, beforeEach } from 'vitest';
import { EconomyLedger, InsufficientBalanceError } from '../../src/domain/economy/ledger';
import { CommandDispatcher } from '../../src/application/commands';
import { ModuleUnlockService } from '../../src/application/ModuleUnlockService';
import { WorldLayout } from '../../src/presentation/world/WorldLayout';
import { ATOMS_PER_CREDIT } from '../../src/domain/constants';

describe('T-A2.1-UNLOCK: Module Unlock Service', () => {
  let ledger: EconomyLedger;
  let dispatcher: CommandDispatcher;
  let unlockService: ModuleUnlockService;

  beforeEach(() => {
    // Reset WorldLayout active modules for isolated test
    WorldLayout.restoreActiveModules(['R3-C0']);
    ledger = new EconomyLedger(500 * ATOMS_PER_CREDIT); // 500 Credits
    dispatcher = new CommandDispatcher(ledger);
    unlockService = new ModuleUnlockService(dispatcher);
  });

  it('Yeterli bakiye varsa modülü açar ve bakiyeyi düşer', () => {
    const initialBalance = ledger.getBalanceAtoms();
    const cost = 150 * ATOMS_PER_CREDIT;
    
    expect(WorldLayout.getModule('R2-C0')?.status).toBe('reserved');
    
    unlockService.unlockModule('tx-unlock-1', 10, 'R2-C0', cost);
    
    expect(WorldLayout.getModule('R2-C0')?.status).toBe('active');
    expect(ledger.getBalanceAtoms()).toBe(initialBalance - cost);
  });

  it('Bakiye yetersizse hata fırlatır ve modülü açmaz', () => {
    const cost = 1000 * ATOMS_PER_CREDIT;
    
    expect(() => {
      unlockService.unlockModule('tx-unlock-2', 15, 'R3-C1', cost);
    }).toThrow(InsufficientBalanceError);
    
    expect(WorldLayout.getModule('R3-C1')?.status).toBe('reserved');
  });

  it('Zaten açık olan modül için hata fırlatır', () => {
    expect(() => {
      unlockService.unlockModule('tx-unlock-3', 20, 'R3-C0', 100 * ATOMS_PER_CREDIT);
    }).toThrow('Modül zaten açık: R3-C0');
  });
});
