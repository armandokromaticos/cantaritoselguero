export class Money {
  private constructor(
    private readonly _amount: number,
    private readonly _currency: string,
  ) {
    if (!Number.isFinite(_amount) || _amount < 0) {
      throw new Error("Money amount must be a finite non-negative number");
    }
  }

  static create(amount: number, currency: string = "MXN"): Money {
    const normalized = Money.normalizeCurrency(currency);
    return new Money(amount, normalized);
  }

  static zero(currency: string = "MXN"): Money {
    const normalized = Money.normalizeCurrency(currency);
    return new Money(0, normalized);
  }

  private static normalizeCurrency(currency: string): string {
    const normalized = currency.toUpperCase().trim();
    if (!/^[A-Z]{3}$/.test(normalized)) {
      throw new Error("Currency must be a valid 3-letter ISO-4217 code");
    }
    return normalized;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    const result = this._amount - other._amount;
    if (result < 0) {
      throw new Error("Money subtraction would result in negative amount");
    }
    return new Money(result, this._currency);
  }

  multiply(factor: number): Money {
    if (!Number.isFinite(factor) || factor < 0) {
      throw new Error("Factor must be a finite non-negative number");
    }
    return new Money(this._amount * factor, this._currency);
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._amount > other._amount;
  }

  isLessThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._amount < other._amount;
  }

  isZero(): boolean {
    return this._amount === 0;
  }

  toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }

  private assertSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new Error(
        `Currency mismatch: ${this._currency} vs ${other._currency}`,
      );
    }
  }
}
