import { describe, it, expect } from 'vitest';
import { DiscountCalculator } from './discount-calculator';

describe('AI Generated - DiscountCalculator', () => {
  it('applies no discount for bronze below the bulk threshold', () => {
    expect(DiscountCalculator.apply('bronze', 100)).toBe(100);
  });

  it('applies five percent for silver below the bulk threshold', () => {
    expect(DiscountCalculator.apply('silver', 100)).toBe(95);
  });

  it('applies ten percent for gold below the bulk threshold', () => {
    expect(DiscountCalculator.apply('gold', 100)).toBe(90);
  });

  it('adds the bulk bonus once the amount reaches 1000', () => {
    expect(DiscountCalculator.rateFor('bronze', 1000)).toBe(0.05);
    expect(DiscountCalculator.rateFor('gold', 1000)).toBeCloseTo(0.15);
  });

  it('treats 1000 as inside the bulk band and 999 as outside', () => {
    expect(DiscountCalculator.rateFor('silver', 999)).toBe(0.05);
    expect(DiscountCalculator.rateFor('silver', 1000)).toBeCloseTo(0.1);
  });

  it('rounds the result to two decimals', () => {
    expect(DiscountCalculator.apply('silver', 33.33)).toBe(31.66);
  });

  it('returns zero for a zero amount', () => {
    expect(DiscountCalculator.apply('gold', 0)).toBe(0);
  });

  it('throws when the amount is negative', () => {
    expect(() => DiscountCalculator.apply('gold', -1)).toThrowError('Amount must not be negative');
  });

  it('throws when the tier is unknown', () => {
    expect(() => DiscountCalculator.rateFor('platinum' as never, 100)).toThrowError('Unknown tier');
  });
});
