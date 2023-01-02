import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ShiftRepository } from "src/app/main/_model/shift/shift.repository";
import { TimeUtil } from "src/app/_utility/time.util";
import { ShiftServiceL } from "../_service/shift.service";
import { DataShift, FilterShift } from "./shift.model";

@Injectable()
export class ShiftRepositoryA {

    filter: FilterShift = new FilterShift()
    shift_data?: DataShift;
    today: Date = this.timeUtil.convertDateTimeLocale(new Date())

    is_loading: boolean = false

    rangeDate = new FormGroup({
        start: new FormControl<Date | null>(new Date()),
        end: new FormControl<Date | null>(this.date_30),
    });


    constructor(private _shift_service: ShiftServiceL, public shiftRepo: ShiftRepository, private timeUtil: TimeUtil) {
        this.filter.branchId = this.shiftRepo.onBranch
        this.filter.subBranchId = this.shiftRepo.onSubBranch
        this.filter.startDate = this.timeUtil.getJustDateLocale(this.date_30)
        this.filter.endDate = this.timeUtil.getJustDateLocale(new Date())
        this.fetch_shift()
    }

    get day() {
        return this.today.getUTCMilliseconds()
    }

    get date_30() {
        let date = new Date();
        date.setDate(this.today.getDate() - 120);
        return date
    }

    fetch_shift() {
        this.is_loading = true
        this._shift_service.getShiftList(this.filter).subscribe(res => {
            this.shift_data = res.data
            setTimeout(() => {
                this.is_loading = false
            }, 200)
        })
    }


    get shifts() {
        return this.shift_data?.content ?? []
    }

    get shift_pagine() {
        return this.shift_data?.pageable
    }

    get shift_close() {
        return this.shifts.filter(x => x.status == 'CLOSE')
    }

    next() {
        this.filter.page += 1
        this.fetch_shift()
    }

    prev() {
        this.filter.page -= 1
        this.fetch_shift()
    }

    get is_disabled_next() {
        return ((this.shift_pagine?.pageNumber ?? 0) >= (this.shift_pagine?.totalPage ?? 0))
    }

    get is_disabled_prev() {
        return (this.shift_pagine?.pageNumber == 0)
    }

    //  FILTER
    //  ================================================================
    findByDate() {
        this.setStartDate = this.startFormDate
        this.setEndDate = this.endFormDate
        this.fetch_shift()
    }

    get startFormDate(): Date {
        return this.rangeDate.get('start')?.value ?? new Date()
    }

    get endFormDate(): Date {
        return this.rangeDate.get('end')?.value ?? new Date()
    }

    set setStartDate(date: Date) {
        let get_date = this.timeUtil.getJustDateLocale(date)
        this.filter.startDate = get_date
    }

    set setEndDate(date: Date) {
        let get_date = this.timeUtil.getJustDateLocale(date)
        this.filter.endDate = get_date

    }




}