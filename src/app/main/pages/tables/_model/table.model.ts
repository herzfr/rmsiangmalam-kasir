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
