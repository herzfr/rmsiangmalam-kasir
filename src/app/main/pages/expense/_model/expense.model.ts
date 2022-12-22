import { Pageable } from "src/app/_model/general.model"

export interface DataExpensee {
    content: Expense[]
    pageable: Pageable
}

export interface Expense {
    id: number
    note: string
    pic: any
    picPath: any
    branchId: number
    subBranchId: number
    cost: number
    status: string
    createdAt: number
    updatedAt: any
    createdBy: string
    updatedBy: any
    type: string
    shiftId?: number
}

export class FilterExpense {
    page: number = 0
    size: number = 10
    search: string = ''
    startDate: number = 0;
    endDate: number = 0;
    status: 'ALL' | 'PAID' | 'UNPAID' | 'PENDING' | 'CANCEL' = 'ALL'
    type: 'ALL' | 'PO' | 'REFUND' | 'CHARITY' | 'ADJUSTMENT' | 'OTHER' | 'SAVING' = 'ALL';
    branchId: number | null = null
    subBranchId: number | null = null
}


export class CreateExpense {
    note: string = ''
    branchId: number | null = null
    subBranchId: number | null = null
    cost: number = 0
    status: 'PAID' | 'UNPAID' | 'PENDING' | 'CANCEL' = 'PENDING'
    type: 'PO' | 'REFUND' | 'CHARITY' | 'ADJUSTMENT' | 'OTHER' | 'SAVING' = 'OTHER';
}


export class UploadReceiptImage {
    file?: File;
    id?: number;
}

