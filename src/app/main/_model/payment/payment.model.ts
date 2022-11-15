export class FindPayment {
    size: number = 100
    page: number = 0
    search: string = ''
    type: 'CASH' | 'DEBIT' | 'EWALLET' | 'OTHER' | 'TRANSFER' = 'CASH'
    option: 'accountNo' | 'name' = 'accountNo';
}

export interface PaymentMehod {
    id: number
    name: string
    description: string
    createdAt: string
    accountNo: string
    updatedAt: string
    createdBy: string
    updatedBy?: string
    type: string
    adminFee: number
}
