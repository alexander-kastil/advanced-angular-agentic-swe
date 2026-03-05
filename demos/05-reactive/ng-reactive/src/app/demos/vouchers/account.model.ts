import { VoucherDetail } from './voucher-details.model';

export class BalanceAccount {
  ID: number = 0;
  Name: string = '';
  Expense: boolean = false;
  VoucherDetails: VoucherDetail[] = new Array();
}
