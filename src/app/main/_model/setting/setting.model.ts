import { Pageable } from "src/app/_model/general.model"

export interface DataSetting {
    content: Setting[]
    pageable: Pageable
}

export interface Setting {
    id: number
    branchId: number
    subBranchId: number
    description: string
    headerTitle: string
    headerAddress1: string
    headerAddress2: string
    phone: string
    paperSize: string
    widthSize: string
    fontSize: string
    other: any
    image: string
    createdAt: number
    createdBy: any
    updatedAt: number
    updatedBy: any
}

export class UpserSetting {
    id: number | null = null
    branchId: number | null = null
    subBranchId: number | null = null
    description: string = ''
    headerTitle: string = ''
    headerAddress1: string = ''
    headerAddress2: string = ''
    other: string = ''
    phone: string = ''
    paperSize: string = '77'
    widthSize: string = '70'
    fontSize: string = '5'
    image: string = ''
}

