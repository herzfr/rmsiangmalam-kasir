import { Pageable } from "src/app/_model/general.model"

export class FindAdditional {
    size: number = 100;
    page: number = 0;
    search: string = '';
    type: string = 'FEE';
    constructor(

    ) { }
}

export interface DataAdditional {
    content: Additional[]
    pageable: Pageable
}

export interface Additional {
    id: number
    key: string
    value: string
    description: string
    createdAt: string
    updatedAt: string
    createdBy: string
    updatedBy: string
    type: string
}