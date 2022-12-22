export interface User {
    username: string
    branchId: number
    role: string
    firstName: string
    lastName: string
    subBranchId: number[]
}


export interface UserFullData {
    id: string
    username: string
    roleId: number
    subBranchId: number
    branchId: number
    lastLogin: string
    createdAt: string
    updatedAt: string
    createdBy: string
    updatedBy: string
    level: string
    role: string
    branch: string
    subBranch: SubBranch[]
}

export interface SubBranch {
    id: number
    name: string
}