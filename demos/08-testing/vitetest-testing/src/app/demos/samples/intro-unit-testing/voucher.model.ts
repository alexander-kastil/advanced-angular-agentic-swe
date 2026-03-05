export class VoucherDetail {
  ID: number = 0;
  VoucherID: number = 0;
  AccountID: number = 0;
  Account?: BalanceAccount | null = null;
  Text: string = '';
  Amount: number = 0;
  Comment: string = '';
}

export class BalanceAccount {
  ID: number = 0;
  Name: string = '';
  Expense: boolean = false;
  VoucherDetails: VoucherDetail[] = new Array();
}

export class Voucher {
  ID: number = 0;
  Text: string = '';
  Date: string = '';
  Amount: number = 0;
  Paid: boolean = false;
  Expense: boolean = false;
  Remark?: boolean;
  Readonly?: boolean;
  Details?: VoucherDetail[];
}
