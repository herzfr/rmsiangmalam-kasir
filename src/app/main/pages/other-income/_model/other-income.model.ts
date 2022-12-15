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
    startDate: number = (new Date(moment(new Date()).locale('id').utc().toString())).getUTCMilliseconds();
    endDate: number = (new Date(moment(new Date()).locale('id').utc().toString())).getUTCMilliseconds();
    branchId: number | null = null
    subBranchId: number | null = null
    search: string = ''
    size: number = 50
    page: number = 0
}


export class CreateIncomeCash {
    note?: string
    branchId?: number
    subBranchId?: number
    amount?: number
    type?: string
    cash?: number
    change?: number
}

export class CreateIncomeOther {
    note?: string
    branchId?: number
    subBranchId?: number
    amount?: number
    type?: string
    transactionNo?: string
    merchantId?: string
    cardNo?: string
    cardName?: string
    batchNo?: string
    adminFee?: number
    isTax?: boolean
    paymentTypeId?: number
    image?: string
}

