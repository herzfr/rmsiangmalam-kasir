import { ShiftRepository } from "src/app/main/_model/shift/shift.repository"
import { Pageable } from "src/app/_model/general.model"

export interface DataTable {
    content: Table[]
    pageable: Pageable
}

export interface Table {
    id: number
    branchId: number
    subBranchId: number
    name: string
    description: string
    createdAt: string
    updatedAt: string
    createdBy: string
    updatedBy: string
    salesId: number
    isOccupied: boolean
    capacity: any
}

export class FindTable {
    search?: string = ''
    size?: number = 200
    page?: number = 0
    branchId?: number = 0
    subBranchId?: number | null
}

export class CreateTable {
    constructor(
        name?: string,
        description?: string,
        branchId?: number,
        subBranchId?: number | null
    ) { }
}


export class UpdateTable {
    id?: number | null = null;
    name: string = "";
    description: string = "";
    branchId?: number;
    subBranchId?: number | null;
    isOccupied: boolean = false
    constructor() {
    }
}

export class UpdateOccupation {
    id?: number;
    isOccupied: boolean = true;
    salesId?: number | null;
    capacity?: number
    constructor(
    ) { }
}


