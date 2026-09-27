// Orbit Market - Fixed Precision Economy Ledger
// Reference: OYUN_GELISTIRME_DEVIR_DOSYASI.md §17, §60.3, KARARLAR.md D-021, AGENTS.md §5

import { ATOMS_PER_CREDIT } from '../constants';
import type { LedgerEntry, TransactionReason, TransactionType } from '../types';

export class InsufficientBalanceError extends Error {
  readonly requiredAtoms: number;
  readonly currentBalanceAtoms: number;

  constructor(requiredAtoms: number, currentBalanceAtoms: number) {
    super(
      `Insufficient balance: required ${requiredAtoms} atoms, but only ${currentBalanceAtoms} atoms available`
    );
    this.name = 'InsufficientBalanceError';
    this.requiredAtoms = requiredAtoms;
    this.currentBalanceAtoms = currentBalanceAtoms;
  }
}

export class DuplicateTransactionError extends Error {
  readonly transactionId: string;

  constructor(transactionId: string) {
    super(`Transaction with ID "${transactionId}" has already been processed.`);
    this.name = 'DuplicateTransactionError';
    this.transactionId = transactionId;
  }
}

export class InvalidTransactionAmountError extends Error {
  readonly amountAtoms: number;

  constructor(amountAtoms: number) {
    super(`Transaction amount must be a positive integer, received: ${amountAtoms}`);
    this.name = 'InvalidTransactionAmountError';
    this.amountAtoms = amountAtoms;
  }
}

export interface TransactionParams {
  transactionId: string;
  timestampTick: number;
  type: TransactionType;
  amountAtoms: number;
  reason: TransactionReason;
  metadata?: Record<string, string | number>;
}

export class EconomyLedger {
  private balanceAtoms: number;
  private sequenceCounter: number;
  private entries: LedgerEntry[];
  private processedIds: Set<string>;

  constructor(initialBalanceAtoms: number = 0, initialEntries: LedgerEntry[] = []) {
    if (initialBalanceAtoms < 0 || !Number.isInteger(initialBalanceAtoms)) {
      throw new Error(`Initial balance must be a non-negative integer: ${initialBalanceAtoms}`);
    }
    this.balanceAtoms = initialBalanceAtoms;
    this.entries = [...initialEntries];
    this.processedIds = new Set(initialEntries.map((e) => e.transactionId));
    this.sequenceCounter = initialEntries.length > 0
      ? Math.max(...initialEntries.map((e) => e.sequence))
      : 0;
  }

  public getBalanceAtoms(): number {
    return this.balanceAtoms;
  }

  public getBalanceCredits(): number {
    return this.balanceAtoms / ATOMS_PER_CREDIT;
  }

  public hasProcessed(transactionId: string): boolean {
    return this.processedIds.has(transactionId);
  }

  public getEntries(): ReadonlyArray<LedgerEntry> {
    return this.entries;
  }

  public getEntry(transactionId: string): LedgerEntry | undefined {
    return this.entries.find((e) => e.transactionId === transactionId);
  }

  /**
   * Bir işlemi idempotent olarak ledger'a uygular.
   * Aynı transactionId tekrar çağrılırsa ikinci etki yaratmaz; DuplicateTransactionError fırlatır.
   * Yetersiz bakiye durumunda Math.max(0, ...) ile açık gizlenmez; InsufficientBalanceError fırlatılır.
   */
  public commitTransaction(params: TransactionParams): LedgerEntry {
    const { transactionId, timestampTick, type, amountAtoms, reason, metadata } = params;

    if (this.processedIds.has(transactionId)) {
      throw new DuplicateTransactionError(transactionId);
    }

    if (!Number.isInteger(amountAtoms) || amountAtoms <= 0) {
      throw new InvalidTransactionAmountError(amountAtoms);
    }

    let newBalance: number;
    if (type === 'CREDIT') {
      newBalance = this.balanceAtoms + amountAtoms;
    } else {
      if (this.balanceAtoms < amountAtoms) {
        throw new InsufficientBalanceError(amountAtoms, this.balanceAtoms);
      }
      newBalance = this.balanceAtoms - amountAtoms;
    }

    this.sequenceCounter += 1;
    const entry: LedgerEntry = {
      sequence: this.sequenceCounter,
      transactionId,
      timestampTick,
      type,
      amountAtoms,
      balanceAfterAtoms: newBalance,
      reason,
      metadata,
    };

    this.balanceAtoms = newBalance;
    this.processedIds.add(transactionId);
    this.entries.push(entry);

    return entry;
  }

  /**
   * Kredi miktarını atom birimine dönüştürür.
   */
  public static creditsToAtoms(credits: number): number {
    return Math.round(credits * ATOMS_PER_CREDIT);
  }

  /**
   * Atom miktarını kredi birimine dönüştürür.
   */
  public static atomsToCredits(atoms: number): number {
    return atoms / ATOMS_PER_CREDIT;
  }
}
