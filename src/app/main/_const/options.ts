export interface IOpt {
    key: string;
    value: string;
}

export const OptTempSales: IOpt[] = [
    { key: 'Berdasarkan ID Pesanan', value: 'salesId' },
    { key: 'Lainnya', value: 'other' },
    { key: 'Berdasarkan Nama', value: 'name' },
    { key: 'Berdasarkan Meja', value: 'table' },
];


export const OptAdditional: IOpt[] = [
    { key: 'Service Cas', value: 'FEE' },
    { key: 'Pajak', value: 'TAX' },
];