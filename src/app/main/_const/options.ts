export interface IOpt {
    key: string;
    value: string;
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