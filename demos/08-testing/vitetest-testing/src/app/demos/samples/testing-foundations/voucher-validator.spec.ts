import { describe, it, expect } from 'vitest';
import { VoucherValidator } from './voucher-validator';
import { goodVoucher, badVoucher, nullVoucher } from './voucher-validator.data';

describe('Class - VoucherValidator', () => {
  // Test data is now imported from voucher-validator.data.ts

  it('returns true when correct data is passed', () =>
    expect(VoucherValidator.validate(goodVoucher)).toEqual(true));

  it('returns false when bad data is passed', () =>
    expect(VoucherValidator.validate(badVoucher)).toEqual(false));

  it('throws error when null is passed as Details', () => {
    expect(() => VoucherValidator.validate(nullVoucher)).toThrowError('Voucher details are missing');
  });
});
