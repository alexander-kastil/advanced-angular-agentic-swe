import { Voucher } from './voucher.model';

export const goodVoucher: Voucher = {
    ID: 2,
    Text: 'BP Tankstelle',
    Date: '2016-11-15T00:00:00',
    Amount: 40,
    Paid: false,
    Expense: false,
    Remark: true,
    Details: [
        {
            ID: 2,
            VoucherID: 3,
            AccountID: 1,
            Text: 'USB Stick',
            Amount: 11,
            Comment: '',
        },
        {
            ID: 7,
            VoucherID: 3,
            AccountID: 6,
            Text: 'Game of Thrones, Season 6',
            Amount: 29,
            Comment: '',
        },
    ],
};

export const badVoucher: Voucher = {
    ID: 2,
    Text: 'BP Tankstelle',
    Date: '2016-11-15T00:00:00',
    Amount: 650,
    Paid: false,
    Expense: false,
    Remark: true,
    Details: [
        {
            ID: 2,
            VoucherID: 3,
            AccountID: 1,
            Text: 'USB Stick',
            Amount: 11,
            Comment: '',
        },
        {
            ID: 7,
            VoucherID: 3,
            AccountID: 6,
            Text: 'Game of Thrones, Season 6',
            Amount: 55,
            Comment: '',
        },
    ],
};

export const nullVoucher: Voucher = {
    ID: 2,
    Text: 'BP Tankstelle',
    Date: '2016-11-15T00:00:00',
    Amount: 650,
    Paid: false,
    Expense: false,
    Remark: true,
};
