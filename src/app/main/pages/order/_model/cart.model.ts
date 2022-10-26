

export class ItemCart {
    constructor(
        public menuId: string,
        public name: string,
        public amount: number,
        public unit: string | null,
        public unitPrice: number,
        public totalPrice: number,
        public isPackage: boolean,
        public stockId: number | null,
        public pic: string,
        public priceCatId: number,
        public priceCat: string,
        public stockIds?: number[],
    ) { }
}

export class CartLine {
    constructor(
        public id?: number,
        public name?: string,
        public tableIds: number[] = [],
        public note?: string,
        public branchId?: number,
        public subBranchId?: number | null,
        public shiftId?: number,
        public items?: ItemCart[]
    ) { }
}

