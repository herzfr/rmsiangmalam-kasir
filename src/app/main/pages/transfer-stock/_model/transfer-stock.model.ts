import { Pageable } from "src/app/_model/general.model"

export class FilterStock {
    page: number = 0
    size: number = 10
    search: string = ''
    branchId: number | null = null
    subBranchId: number | null = null
    startDate: number = 1657386000000
    endDate: number = 1659114000000
}

export interface ResultStock {
    content: StatusTransfer[]
    pageable: Pageable
}

export interface StatusTransfer {
    id: number
    frmWarehouseId: number
    destWarehouseId: number
    note: string
    isSenderApproved: boolean
    isReceiverApproved: boolean
    sendBy: string
    receiveBy: string
    sendApprover: string
    receiveApprover: string
    isDelivery: boolean
    isBack: boolean
    isDone: boolean
    createdAt: number
    updatedAt: number
    createdBy: string
    updatedBy: string
    isCanceled: boolean
    products: ProductStatusTransfer[]
}

export interface ProductStatusTransfer {
    id: number
    productId: number
    name: string
    quantity: number
    comparison: number
}


export class Send {
    frmWarehouseId?: number
    destWarehouseId?: number
    note: string = ''
    products?: Product[] = []
    isBack?: boolean
    isSenderApproved?: boolean
    sendBy?: string
    sendApprover?: string
}

export class Receive {
    frmWarehouseId?: number
    destWarehouseId?: number
    note?: string
    products: Product[] = []
    isBack?: boolean
    isSenderApproved?: boolean
    sendBy?: string
    sendApprover?: string
    receiveBy?: string
}

export class UpdateStatus {
    id?: number
    note?: string
    products?: Product[]
    isDelivery?: boolean
    isSenderApproved?: boolean
    isReceiverApproved?: boolean
    sendBy?: string
    sendApprover?: string
    receiveBy?: string
    receiveApprover?: string
}

export class Product {
    id?: number;
    productId: number | null = null
    quantity: number = 0
    name?: string
    unit?: string
}


export class CancelStatus {
    id: number | null = null
    isCanceled: boolean = true
}











