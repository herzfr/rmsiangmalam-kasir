export class FindTempSales {
    size?: number = 20
    page?: number = 0
    search?: string = ''
    branchId?: number | null = null
    subBranchId?: number | null = null
    option?: string = 'salesId'
    startDate?: number = new Date().setUTCHours(0, 0, 0, 0);
    endDate?: number = new Date().setUTCHours(23, 59, 59, 999);
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
    constructor(
        name: string,
        note: string,
        waiter: string,
        bills: number[]
    ) { }
}

