import { Pageable } from "src/app/_model/general.model"

export class FilterShift {
    size: number = 10
    page: number = 0
    branchId: number | null = null
    subBranchId: number | null = null
    status: 'OPEN' | 'CLOSE' | 'ALL' = 'ALL'
    startDate: string = ''
    endDate: string = ''
}

export interface DataShift {
    content: ShiftL[]
    pageable: Pageable
}

export interface ShiftL {
    id: number
    username: string
    name: string
    startCash: number
    endCash: number
    subBranchId: number
    status: string
    startTime: string
    endTime: string
    sales: Sale[]
}

export interface Sale {
    id: number
    name?: string
    note?: string
    customerId?: number
    customerName?: string
    waiterName?: string
    waiterUserName?: string
    cashierName?: string
    cashierUserName: string
    subTotal: number
    discount: number
    tax: number
    service: number
    refund: number
    total: number
    isDineIn: boolean
    status: string
    paymentMethod: string
    paymentTypeId?: number
    cash?: number
    change?: number
    createdAt: number
    updatedAt: number
    createdBy: string
    updatedBy: any
    imageProof?: string
    cardNo?: string
    merchantId?: string
    transactionNo?: string
    cardName?: string
    batchNo?: string
    adminFee: number
}