import { BalanceAccount } from './account.model';

export class VoucherDetail {
  ID: number = 0;
  VoucherID: number = 0;
  AccountID: number = 0;
  Account: BalanceAccount | null = null;
  Text: string = '';
  Amount: number = 0;
  Comment: string = '';
}
