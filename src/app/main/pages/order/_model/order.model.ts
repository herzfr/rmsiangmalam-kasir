import { Pageable } from "src/app/_model/general.model"

export interface PriceCategory {
    id: number
    name: string
    description: string
}

export interface Customer {
    id: number
    name: string
    address1: string
    address2: string
    address3: string
    phone: string
    email: string
    pic: any
}


export class FindMenu {
    size: number = 50;
    page: number = 0;
    search: string = "";
    option: string = "";
}

export class FillShortcut {
    id?: number;
    menuId?: string;
    branchId?: number;
    subBranchId?: number | null;
    position?: number;
    constructor(

    ) { }
}
