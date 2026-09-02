import { Voucher } from './voucher.model';

export class VoucherValidator {
  static validate(voucher: Voucher) {
    if (!voucher.Details) {
      throw new Error('Voucher details are missing');
    }
    let sumD = 0;
    for (const vd of voucher.Details) {
      sumD += vd.Amount;
    }
    return sumD == voucher.Amount;
  }
}
