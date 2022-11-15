import { Pageable } from "src/app/_model/general.model"

export class FindDiscount {
    search: string = '';
    size: number = 1000;
    page: number = 0;
    sortBy: string = 'desc';
    constructor() { }
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