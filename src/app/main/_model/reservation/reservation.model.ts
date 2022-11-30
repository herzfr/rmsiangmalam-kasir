import { Pageable } from "src/app/_model/general.model"


export class CreateReservation {
    note: string | null = null
    bookingTime: number = new Date().setHours(0, 0, 0, 0);
    name: string | null = null
    dpAmount: number = 0
    branchId: number | null = null
    subBranchId: number | null = null
    cash: number = 0
    change: number = 0
    paymentMethod: string | null = 'CASH'
    paymentTypeId: number | null = null
    adminFee?: number = 0
    batchNo?: string | null = null
    transactionNo?: string | null = null
    merchantId?: string | null = null
    cardNo?: string | null = null
    cardName?: string | null = null
    image?: string | null = null
    constructor() { }
}

export class FindReservation {
    branchId: number | null = null
    subBranchId: number | null = null
    search: string = ''
    page: number = 0
    size: number = 10
    startDate: number = new Date().setHours(0, 0, 0, 0)
    endDate: number = new Date().setHours(23, 59, 59, 999)
    status: boolean = false
    constructor() { }
}

export interface DataReservation {
    content: Reservation[]
    pageable: Pageable
}

export interface Reservation {
    id: number
    note: string
    bookingTime: number
    branchId: number
    subBranchId: number
    dpAmount: number
    createdAt: number
    updatedAt: number
    createdBy: string
    updatedBy?: string
    isDone: boolean
    paymentMethod: string
    paymentTypeId?: number
    cash: number
    change: number
    batchNo?: string
    transactionNo?: string
    merchantId?: string
    adminFee: number
    cardNo: any
    cardName: any
    image?: string
}