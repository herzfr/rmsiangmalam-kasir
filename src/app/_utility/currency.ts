export function convertRupiah(value: number): string {
    let val = Math.ceil(value)
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(val);
}