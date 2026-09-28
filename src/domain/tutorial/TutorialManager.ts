export type TutorialStepId = 
  | 'WELCOME'
  | 'ORDER_SUPPLY'
  | 'BUILD_MACHINE'
  | 'PRODUCE_ITEM'
  | 'RESTOCK_SHELF'
  | 'CHECK_DIAGNOSTICS'
  | 'COMPLETED';

export interface TutorialTask {
  id: TutorialStepId;
  title: string;
  description: string;
}

export const TUTORIAL_TASKS: Record<TutorialStepId, TutorialTask> = {
  WELCOME: { id: 'WELCOME', title: 'Hoş Geldiniz', description: 'Markete hoş geldiniz! A2 eğitimine başlamak için ekrana dokunun.' },
  ORDER_SUPPLY: { id: 'ORDER_SUPPLY', title: 'Hammadde Tedariği', description: 'Tedarik (A2) menüsünü açarak en az 1 Yem veya Tuz sipariş edin.' },
  BUILD_MACHINE: { id: 'BUILD_MACHINE', title: 'Üretim Tesisi', description: 'Bir Mandıra veya Taş Fırın inşa edin.' },
  PRODUCE_ITEM: { id: 'PRODUCE_ITEM', title: 'İlk Üretim', description: 'Makineye hammadde (su/yem) taşıyarak Süt veya Püre üretmesini sağlayın.' },
  RESTOCK_SHELF: { id: 'RESTOCK_SHELF', title: 'Rafa Dizilim', description: 'Ürettiğiniz A2 ürününü satış rafına yerleştirin.' },
  CHECK_DIAGNOSTICS: { id: 'CHECK_DIAGNOSTICS', title: 'Sistem Teşhisi', description: 'Teşhis menüsünü açıp üretim ve raf durumunu inceleyin.' },
  COMPLETED: { id: 'COMPLETED', title: 'Eğitim Tamamlandı', description: 'Tebrikler! İşletmenizi artık özgürce yönetebilirsiniz.' },
};

import type { ProductionManager } from './../production/ProductionManager';
import type { InventoryManager } from './../inventory/InventoryManager';

export class TutorialManager {
  private currentStep: TutorialStepId = 'WELCOME';
  private hasSeenDiagnostics: boolean = false;
  private hasOrderedSupply: boolean = false;
  private hasBuiltMachine: boolean = false;
  private hasProducedItem: boolean = false;
  private hasRestockedA2: boolean = false;

  public getCurrentStep(): TutorialStepId {
    return this.currentStep;
  }

  public getTaskDetails(): TutorialTask {
    return TUTORIAL_TASKS[this.currentStep];
  }

  // --- Olay Tetikleyicileri (Event Hooks) ---

  public onScreenTap(): void {
    if (this.currentStep === 'WELCOME') {
      this.currentStep = 'ORDER_SUPPLY';
    }
  }

  public onSupplyOrdered(): void {
    this.hasOrderedSupply = true;
    this.evaluateProgress();
  }

  public onMachineBuilt(): void {
    this.hasBuiltMachine = true;
    this.evaluateProgress();
  }

  public onItemProduced(): void {
    this.hasProducedItem = true;
    this.evaluateProgress();
  }

  public onA2ItemRestocked(): void {
    this.hasRestockedA2 = true;
    this.evaluateProgress();
  }

  public onDiagnosticsOpened(): void {
    this.hasSeenDiagnostics = true;
    this.evaluateProgress();
  }

  // Durumu kontrol edip bir sonraki aşamaya geçirir
  private evaluateProgress(): void {
    switch (this.currentStep) {
      case 'ORDER_SUPPLY':
        if (this.hasOrderedSupply) this.currentStep = 'BUILD_MACHINE';
        break;
      case 'BUILD_MACHINE':
        if (this.hasBuiltMachine) this.currentStep = 'PRODUCE_ITEM';
        break;
      case 'PRODUCE_ITEM':
        if (this.hasProducedItem) this.currentStep = 'RESTOCK_SHELF';
        break;
      case 'RESTOCK_SHELF':
        if (this.hasRestockedA2) this.currentStep = 'CHECK_DIAGNOSTICS';
        break;
      case 'CHECK_DIAGNOSTICS':
        if (this.hasSeenDiagnostics) this.currentStep = 'COMPLETED';
        break;
    }
  }

  // State üzerinden manuel tetiklemeler olmadan (save/load veya tick loop esnasında) kontrolleri yapmak için:
  public checkProgressFromState(production: ProductionManager, inventory: InventoryManager): void {
    if (this.currentStep === 'BUILD_MACHINE') {
      const machines = production.getAllMachines();
      if (machines.some(m => m.id === 'source.cow_dairy' || m.id === 'station.stone_oven')) {
        this.onMachineBuilt();
      }
    }
    
    if (this.currentStep === 'PRODUCE_ITEM') {
      // Mandıra süt veya püre üretmiş mi? (Inventory'de lot var mı veya output'ta lot var mı?)
      // A2 itemleri ('item.fresh_milk', 'item.farm_butter', 'item.churned_ayran', 'item.tomato_puree') 
      // Herhangi bir stock location'da (production output veya player vs) mevcut mu?
      const a2ItemIds = ['item.fresh_milk', 'item.farm_butter', 'item.churned_ayran', 'item.tomato_puree'];
      const hasProduced = a2ItemIds.some(itemId => 
        inventory.serialize().lots.some(lot => lot.itemId === itemId)
      );
      if (hasProduced) {
        this.onItemProduced();
      }
    }

    if (this.currentStep === 'RESTOCK_SHELF') {
      // Satış rafında (fixture.sales_shelf) A2 ürünü var mı?
      const a2ItemIds = ['item.fresh_milk', 'item.farm_butter', 'item.churned_ayran', 'item.tomato_puree'];
      const shelfLots = inventory.serialize().lots.filter(l => l.location.ownerId === 'fixture.sales_shelf');
      const hasOnShelf = shelfLots.some(lot => a2ItemIds.includes(lot.itemId));
      if (hasOnShelf) {
        this.onA2ItemRestocked();
      }
    }
  }

  // --- Save / Load (Serileştirme) ---
  
  public serialize(): any {
    return {
      currentStep: this.currentStep,
      hasSeenDiagnostics: this.hasSeenDiagnostics,
      hasOrderedSupply: this.hasOrderedSupply,
      hasBuiltMachine: this.hasBuiltMachine,
      hasProducedItem: this.hasProducedItem,
      hasRestockedA2: this.hasRestockedA2,
    };
  }

  public restore(data: any): void {
    if (!data) return;
    this.currentStep = data.currentStep ?? 'WELCOME';
    this.hasSeenDiagnostics = !!data.hasSeenDiagnostics;
    this.hasOrderedSupply = !!data.hasOrderedSupply;
    this.hasBuiltMachine = !!data.hasBuiltMachine;
    this.hasProducedItem = !!data.hasProducedItem;
    this.hasRestockedA2 = !!data.hasRestockedA2;
  }
}
