export interface IOpt {
    key: string;
    value: string;
}

export interface IOpt2 {
    key: string;
    value: string;
    style: string;
}


export const OptTempSales: IOpt[] = [
    { key: 'by ID Pesanan', value: 'salesId' },
    { key: 'Lainnya', value: 'other' },
    { key: 'by Nama', value: 'name' },
    { key: 'by Meja', value: 'table' },
];


export const OptAdditional: IOpt[] = [
    { key: 'Service Cas', value: 'FEE' },
    { key: 'Pajak', value: 'TAX' },
];


export const OptStatusFinance: IOpt[] = [
    { key: 'Semua Tipe', value: 'ALL' },
    { key: 'PO (Pesan Dahulu)', value: 'PO' },
    { key: 'Pengembalian', value: 'REFUND' },
    { key: 'Amal', value: 'CHARITY' },
    { key: 'Penyesuaian Produk', value: 'ADJUSTMENT' },
    { key: 'Lainnya', value: 'OTHER' },
    { key: 'Tabungan', value: 'SAVING' },
];


export const OptStatusPayment: IOpt2[] = [
    { key: 'Semua Status', value: 'ALL', style: 'all' },
    { key: 'Dibatalkan', value: 'CANCEL', style: 'cancel' },
    { key: 'Pending', value: 'PENDING', style: 'pending' },
    { key: 'Lunas', value: 'PAID', style: 'paid' },
    { key: 'Hutang', value: 'UNPAID', style: 'unpaid' },
]

export const OptStatusFinanceForm: IOpt[] = [
    { key: 'PO (Pesan Dahulu)', value: 'PO' },
    { key: 'Pengembalian', value: 'REFUND' },
    { key: 'Amal', value: 'CHARITY' },
    { key: 'Penyesuaian Produk', value: 'ADJUSTMENT' },
    { key: 'Lainnya', value: 'OTHER' },
    { key: 'Tabungan', value: 'SAVING' },
];

export const OptStatusPaymentForm: IOpt[] = [
    { key: 'Dibatalkan', value: 'CANCEL' },
    { key: 'Pending', value: 'PENDING' },
    { key: 'Lunas', value: 'PAID' },
    { key: 'Hutang', value: 'UNPAID' },
]

export const OptReport: IOpt[] = [
    { key: 'Nama', value: 'name' },
    { key: 'Pelanggan', value: 'customer' },
    { key: 'Kasir', value: 'cashier' },
]



