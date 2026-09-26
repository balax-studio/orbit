export class GameState {
  public money: number;
  public inventory: Map<string, number>;
  public inventoryCapacity: number;

  constructor() {
    this.money = 0;
    this.inventory = new Map();
    this.inventoryCapacity = 6;
  }

  public addMoney(amount: number): void {
    if (amount > 0) {
      this.money += amount;
    }
  }

  public addToInventory(itemId: string, quantity: number): boolean {
    const currentQuantity = this.inventory.get(itemId) || 0;
    
    // Check if adding exceeds total capacity (for now treating capacity as per-item or total? 
    // Handover doc says: "Taşıma başlangıçta 6 yığın birimiyle sınırlıdır".
    // Let's assume total capacity for simplicity, or just simple quantity check.
    // Let's assume total items across all types for now.
    let totalItems = 0;
    this.inventory.forEach((amount) => totalItems += amount);

    if (totalItems + quantity > this.inventoryCapacity) {
      return false; // Not enough space
    }

    this.inventory.set(itemId, currentQuantity + quantity);
    return true;
  }

  public removeFromInventory(itemId: string, quantity: number): boolean {
    const currentQuantity = this.inventory.get(itemId) || 0;
    if (currentQuantity < quantity) {
      return false; // Not enough items
    }

    if (currentQuantity === quantity) {
      this.inventory.delete(itemId);
    } else {
      this.inventory.set(itemId, currentQuantity - quantity);
    }
    return true;
  }
}
