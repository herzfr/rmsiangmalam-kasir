import { TimeUtil } from "src/app/_utility/time.util";

export class StartShift {
    constructor(
        startCash?: number,
        startOperationalCash?: number,
        subBranchId?: number | null,
        deviceId?: string,
        type?: string) { }
}

export class AddCash {
    constructor(
        id?: number,
        amount?: number,
        deviceId?: string
    ) { }
}

export class QueryShift {
    constructor(
        size?: number,
        page?: number,
        branchId?: number,
        subBranchId?: number | null,
        status: string = 'ALL',
        startDate: number = new Date().setUTCHours(0, 0, 0, 0),
        endDate: number = new Date().setUTCHours(23, 59, 59, 999)
    ) { }
}

export class QueryShiftDetail {
    constructor(
        size?: number,
        page?: number,
        branchId?: number,
        subBranchId?: number | null,
        status: string = 'ALL',
        startDate: string = new TimeUtil().convertDateFormat(new Date(), 'dd/mm/YYYY'),
        endDate: string = new TimeUtil().convertDateFormat(new Date(), 'dd/mm/YYYY')
    ) { }
}

export interface Shift {
    id?: number,
    username?: string,
    name?: string,
    startCash?: number,
    salesCash?: number,
    startOperationalCash?: number,
    startTime?: string,
    endTime?: string,
    status?: string,
    totalOrder?: number,
    branchid?: number,
    subBranchId?: number,
    deviceId?: string,
    endCash?: number,
    endOperationalCash?: number,
    type?: string,
    date?: number,
    month?: number,
    year?: number,
    dateVal?: string,
}