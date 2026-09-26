import { GameState } from '../../domain/GameState';
import { Machine, Shelf, Customer } from '../../domain/Entities';

export class GameEngine {
  public state: GameState;
  private machines: Map<string, Machine>;
  private shelves: Map<string, Shelf>;
  private customers: Customer[];

  constructor() {
    this.state = new GameState();
    this.machines = new Map();
    this.shelves = new Map();
    this.customers = [];

    // Initialize with level 1 entities as per game spec vertical slice
    this.machines.set('machine_1', new Machine('machine_1', 'raw_material', 2, 'product_a', 1, 1000, 2));
    this.shelves.set('shelf_1', new Shelf('shelf_1', 'product_a', 10, 15));
  }

  public getMachine(id: string): Machine | undefined {
    return this.machines.get(id);
  }

  public getShelf(id: string): Shelf | undefined {
    return this.shelves.get(id);
  }

  // Basic player interaction (deposit/collect depending on context)
  public playerInteract(targetId: string): void {
    const machine = this.machines.get(targetId);
    if (machine) {
      // If machine has output ready, collect it
      if (machine.outputCount > 0) {
        const collected = machine.collectOutput(machine.outputCount);
        this.state.addToInventory(machine.outputType, collected);
        return;
      }
      
      // Else try to deposit input
      const inventoryAmount = this.state.inventory.get(machine.inputType) || 0;
      if (inventoryAmount > 0) {
        // Just deposit as much as we can up to our capacity and machine's needs
        // In a real game, this might be 1 by 1 or chunked, ponytail mode just dumps everything possible.
        // For the test, we need exactly 2 to make it process.
        const depositAmount = Math.min(inventoryAmount, machine.maxInputCapacity - machine.inputCount);
        if (depositAmount > 0) {
          if (machine.addInput(depositAmount)) {
            this.state.removeFromInventory(machine.inputType, depositAmount);
          }
        }
      }
      return;
    }

    const shelf = this.shelves.get(targetId);
    if (shelf) {
      // Deposit products from inventory to shelf
      const inventoryAmount = this.state.inventory.get(shelf.productType) || 0;
      if (inventoryAmount > 0) {
        const depositAmount = Math.min(inventoryAmount, shelf.capacity - shelf.productCount);
        if (depositAmount > 0) {
          if (shelf.addProduct(depositAmount)) {
            this.state.removeFromInventory(shelf.productType, depositAmount);
          }
        }
      }
      return;
    }
  }

  public spawnCustomer(desiredProduct: string, quantity: number): void {
    this.customers.push(new Customer(desiredProduct, quantity));
  }

  public tick(deltaMs: number): void {
    // Tick all machines
    this.machines.forEach((machine) => machine.tick(deltaMs));

    // Process customers (simple queue style processing for ponytail mode)
    const nextCustomers: Customer[] = [];
    for (const customer of this.customers) {
      let satisfied = false;
      // Try to satisfy customer with any matching shelf
      for (const shelf of this.shelves.values()) {
        if (customer.tryBuy(shelf, this.state)) {
          satisfied = true;
          break;
        }
      }
      if (!satisfied) {
        // Keep in queue or let them leave? Let's just keep them waiting for simplicity in this slice.
        nextCustomers.push(customer);
      }
    }
    this.customers = nextCustomers;
  }
}
