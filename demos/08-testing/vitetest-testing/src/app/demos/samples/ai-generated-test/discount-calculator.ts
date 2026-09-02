export type Tier = 'bronze' | 'silver' | 'gold';

export class DiscountCalculator {
  private static readonly rates: Record<Tier, number> = {
    bronze: 0,
    silver: 0.05,
    gold: 0.1,
  };

  static rateFor(tier: Tier, amount: number): number {
    if (amount < 0) {
      throw new Error('Amount must not be negative');
    }
    const base = DiscountCalculator.rates[tier];
    if (base === undefined) {
      throw new Error('Unknown tier');
    }
    return amount >= 1000 ? base + 0.05 : base;
  }

  static apply(tier: Tier, amount: number): number {
    const rate = DiscountCalculator.rateFor(tier, amount);
    return Math.round(amount * (1 - rate) * 100) / 100;
  }
}
