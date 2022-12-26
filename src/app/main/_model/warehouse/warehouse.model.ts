import { Pageable } from "src/app/_model/general.model"

export interface DataWarehouse {
    content: Warehouse[]
    pageable: Pageable
}

export interface Warehouse {
    id: number
    name: string
    description: string
    branchId: number
    subBranchId?: number
    createdAt: string
    updatedAt?: string
    createdBy?: string
    updatedBy?: string
}