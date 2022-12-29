export interface Saving {
    id: number
    name: string
    savingAmount: number
    updatedAt: number
}


export class CreateSaving {
    branchId: number | null = null
    subBranchId: number | null = null
    shiftId: number | null = null
    amount: number = 0
}