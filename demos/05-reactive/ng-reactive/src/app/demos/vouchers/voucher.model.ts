import { VoucherDetail } from './voucher-details.model';

export class Voucher {
  ID = 0;
  Text = '';
  Date = '';
  Amount = 0;
  Paid = false;
  Expense = false;
  Remark?: boolean;
  Readonly?: boolean;
  Details?: VoucherDetail[];
}
