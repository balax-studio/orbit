import { GameState } from './GameState';

// ponytail: basic machine logic, no complex queueing, just takes N inputs, waits T ms, produces 1 output.
export class Machine {
  public inputCount: number = 0;
  public outputCount: number = 0;
  private currentProgress: number = 0;

  public id: string;
  public inputType: string;
  public inputsRequired: number;
  public outputType: string;
  public outputsProduced: number;
  public processingTimeMs: number;
  public maxInputCapacity: number;

  constructor(
    id: string,
    inputType: string,
    inputsRequired: number,
    outputType: string,
    outputsProduced: number,
    processingTimeMs: number,
    maxInputCapacity: number = inputsRequired * 2
  ) {
    this.id = id;
    this.inputType = inputType;
    this.inputsRequired = inputsRequired;
    this.outputType = outputType;
    this.outputsProduced = outputsProduced;
    this.processingTimeMs = processingTimeMs;
    this.maxInputCapacity = maxInputCapacity;
  }

  public addInput(quantity: number): boolean {
    if (this.inputCount + quantity > this.maxInputCapacity) {
      return false;
    }
    this.inputCount += quantity;
    return true;
  }

  public tick(deltaMs: number): void {
    if (this.inputCount >= this.inputsRequired) {
      this.currentProgress += deltaMs;
      if (this.currentProgress >= this.processingTimeMs) {
        this.inputCount -= this.inputsRequired;
        this.outputCount += this.outputsProduced;
        this.currentProgress = 0;
      }
    }
  }

  public collectOutput(maxQuantity: number): number {
    const toCollect = Math.min(this.outputCount, maxQuantity);
    this.outputCount -= toCollect;
    return toCollect;
  }
}

// ponytail: basic shelf, holds a specific product and processes purchases directly modifying state.money
export class Shelf {
  public productCount: number = 0;

  public id: string;
  public productType: string;
  public capacity: number;
  public price: number;

  constructor(
    id: string,
    productType: string,
    capacity: number,
    price: number
  ) {
    this.id = id;
    this.productType = productType;
    this.capacity = capacity;
    this.price = price;
  }

  public addProduct(quantity: number): boolean {
    if (this.productCount + quantity > this.capacity) {
      return false;
    }
    this.productCount += quantity;
    return true;
  }

  public buyProduct(quantity: number, state: GameState): boolean {
    if (this.productCount >= quantity) {
      this.productCount -= quantity;
      state.addMoney(this.price * quantity);
      return true;
    }
    return false;
  }
}

// ponytail: basic customer behavior, tries to buy exact quantity of desired product
export class Customer {
  public desiredProduct: string;
  public desiredQuantity: number;

  constructor(
    desiredProduct: string,
    desiredQuantity: number
  ) {
    this.desiredProduct = desiredProduct;
    this.desiredQuantity = desiredQuantity;
  }

  public tryBuy(shelf: Shelf, state: GameState): boolean {
    if (shelf.productType === this.desiredProduct) {
      return shelf.buyProduct(this.desiredQuantity, state);
    }
    return false;
  }
}
