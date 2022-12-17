import * as moment from "moment"
import { Pageable } from "src/app/_model/general.model"


export interface DataOtherIncome {
    content: OtherIncome[]
    pageable: Pageable
}

export interface OtherIncome {
    id: number
    note: string
    salesId: number
    branchId: number
    subBranchId: number
    amount: number
    status: string
    createdAt: number
    updatedAt: number
    createdBy: string
    updatedBy: any
    type: string
    incomeType: string
    dateVal: number
    image?: string
    paymentTypeId?: number
    cardNo?: string
    batchNo: any
    adminFee: number
    merchantId?: string
    transactionNo?: string
    isTax: boolean
    paymentName?: string
    sales_proof: any
}


export class FilterIncome {
    startDate: number = 1656608400000;
    endDate: number = 1659200400000;
    branchId: number | null = null
    subBranchId: number | null = null
    search: string = ''
    size: number = 50
    page: number = 0
}

export class CreateIncome {
    note?: string
    amount: number = 0
    type?: string
    branchId?: number
    subBranchId?: number
}


export class CreateIncomeCash {
    cash: number = 0
    change: number = 0
}

export class CreateIncomeOther {
    transactionNo?: string
    merchantId?: string
    cardNo: string | null = null
    cardName?: string
    batchNo?: string
    adminFee: number = 0
    isTax?: boolean
    paymentTypeId?: number
    image: string | null = null
}

