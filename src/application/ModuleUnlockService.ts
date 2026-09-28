import type { CommandDispatcher } from './commands';
import { WorldLayout } from '../presentation/world/WorldLayout';

export class ModuleUnlockService {
  private dispatcher: CommandDispatcher;
  constructor(dispatcher: CommandDispatcher) {
    this.dispatcher = dispatcher;
  }

  public unlockModule(transactionId: string, timestampTick: number, moduleId: string, costAtoms: number): void {
    const module = WorldLayout.getModule(moduleId);
    if (!module) throw new Error(`Modül bulunamadı: ${moduleId}`);
    if (module.status === 'active') throw new Error(`Modül zaten açık: ${moduleId}`);

    const result = this.dispatcher.execute({
      type: 'UNLOCK_MODULE',
      transactionId,
      timestampTick,
      moduleId,
      costAtoms
    });

    if ('unlocked' in result && result.unlocked) {
      WorldLayout.activateModule(moduleId);
    }
  }
}
