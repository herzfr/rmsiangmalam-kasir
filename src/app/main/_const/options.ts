export interface IOpt {
    key: string;
    value: string;
}

export const OptTempSales: IOpt[] = [
    { key: 'Berdasarkan ID Pesanan', value: 'salesId' },
    { key: 'Semua', value: 'option' },
    { key: 'Berdasarkan Nama', value: 'name' },
    { key: 'Berdasarkan Meja', value: 'table' },
];