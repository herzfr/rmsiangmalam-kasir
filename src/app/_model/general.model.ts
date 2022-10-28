export class Pageable {
    totalElements?: number;
    totalPage?: number;
    pageNumber?: number;
    pageSize?: number;
    constructor(
    ) { }
}


export class FindGeneral {
    constructor(
        search: string = "",
        size: number = 50,
        page: number = 0,
        branchId: number | null = null,
        subBranchId: number | null = null,
    ) { }
}