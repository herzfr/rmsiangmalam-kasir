import { Pageable } from "src/app/_model/general.model"

export interface DataTempSales {
    content: TempSales[]
    pageable: Pageable
}

export interface TempSales {
    id: number
    branchId: number
    subBranchId: number
    name: string
    waiter: string
    isDone: string
    note: string
    createdAt: number
    tableIds: number[]
    items: ItemTempSales[]
}

export interface ItemTempSales {
    id: number
    amount: number
    isPackage: boolean
    menuId: string
    name: string
    tempSalesId: number
    totalPrice: number
    unit: string
    unitPrice: number
    stockId: string
    pic: string
    priceCat: string
    priceCatId: number
}

export class FindTempSales {
    size?: number = 20
    page?: number = 0
    search?: string = ''
    branchId?: number | null = null
    subBranchId?: number | null = null
    option?: string = 'salesId'
    startDate: number = new Date().setHours(0, 0, 0, 0);
    endDate: number = new Date().setHours(23, 59, 59, 999);
}


export class Split {
    constructor(
        tempSalesId: number,
        waiter: string,
        bills: Bill[],
    ) { }
}

export class Bill {
    constructor(
        name: string,
        note: string,
        items: ItemSplit[]
    ) { }
}

export class ItemSplit {
    constructor(
        id: number,
        amount: number,
        name: string,
        menuId: string
    ) { }
}

export class Merge {
    name: string = "";
    note: string = "";
    waiter: string = "";
    bills: number[] = []
    constructor(
    ) { }
}




