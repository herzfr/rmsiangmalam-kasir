import { Pageable } from "src/app/_model/general.model"

export class FindDiscount {
    constructor(
        search: string = '',
        size: number = 1000,
        page: number = 0,
        sortBy: string = 'desc',
    ) { }
}

export interface DataDiscount {
    content: Discount[]
    pageable: Pageable
}

export interface Discount {
    id: number
    name: string
    description: string
    type: string
    value: number
    createdAt: string
    updatedAt?: string
    createdby: string
    updatedBy?: string
    branchId: number
    subBranchId?: number
}