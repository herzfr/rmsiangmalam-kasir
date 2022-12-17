import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ShiftRepository } from "src/app/main/_model/shift/shift.repository";
import { BaseService } from "src/app/main/_service/base.service";
import { Pageable } from "src/app/_model/general.model";
import { TimeUtil } from "src/app/_utility/time.util";
import { OtherIncomeService } from "../_service/other-income.service";
import { CreateIncome, CreateIncomeCash, CreateIncomeOther, DataOtherIncome, FilterIncome, OtherIncome } from "./other-income.model";

@Injectable()
export class OtherIncomeRepository {

    public filter: FilterIncome = new FilterIncome()
    public create_income: CreateIncome = new CreateIncome()
    public create_by_cash: CreateIncomeCash = new CreateIncomeCash()
    public create_by_other: CreateIncomeOther = new CreateIncomeOther()
    public data_income?: DataOtherIncome;

    public is_loading: boolean = false;

    rangeDate = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });


    constructor(public shiftRepo: ShiftRepository, public _income_service:
        OtherIncomeService, public timeUtil: TimeUtil, private _baseService: BaseService) {
        this.init()
    }

    init() {
        this.filter.branchId = this.shiftRepo.onBranch
        this.filter.subBranchId = this.shiftRepo.onSubBranch
        this.fetch_income()
        this.listenerNumberResult()
        this.rangeDate = new FormGroup({
            start: new FormControl<Date | null>(new Date()),
            end: new FormControl<Date | null>(new Date()),
        });

    }

    fetch_income() {
        this.is_loading = true
        this._income_service.getIncome(this.filter).subscribe(res => {
            console.log(res);
            this.data_income = res.data
            setTimeout(() => this.is_loading = false, 200)
        })
    }

    listenerNumberResult() {
        this._baseService.numberResultIncome$.subscribe((res) => {
            console.log(res);
            this.create_by_cash.cash = res
            this.update_cash()
        })
    }


    get _incomes(): OtherIncome[] {
        return this.data_income?.content ?? []
    }

    get pagine(): Pageable | undefined {
        return this.data_income?.pageable
    }

    next() {
        this.filter.page += 1
        this.fetch_income()
    }

    prev() {
        this.filter.page -= 1
        this.fetch_income()
    }

    get is_disabled_next() {
        return (this.pagine?.pageNumber ?? 0 >= (this.pagine?.totalPage ?? 0))
    }

    get is_disabled_prev() {
        return (this.pagine?.pageNumber == 0)
    }


    //  FILTER
    //  ================================================================
    findByDate() {
        this.setStartDate = this.startFormDate
        this.setEndDate = this.endFormDate
        this.fetch_income()
    }

    get startFormDate(): Date {
        return this.rangeDate.get('start')?.value ?? new Date()
    }

    get endFormDate(): Date {
        return this.rangeDate.get('end')?.value ?? new Date()
    }

    set setStartDate(date: Date) {
        let get_time = this.timeUtil.getJustTime(this.filter.startDate)
        let get_milis_time = this.timeUtil.setTimeInDate(get_time, date)
        this.filter.startDate = get_milis_time
    }

    set setEndDate(date: Date) {
        let get_time = this.timeUtil.getJustTime(this.filter.endDate)
        let get_milis_time = this.timeUtil.setTimeInDate(get_time, date)
        this.filter.endDate = get_milis_time
    }

    //  PAYMENT
    //  ================================================================
    update_cash() {
        this.create_by_cash.change = this.create_income.amount - this.create_by_cash.cash
    }

    calculate() {

    }




    //  SUBMTI
    //  ================================================================
    reset_income() {
        this.create_income = new CreateIncome()
        this.create_by_cash = new CreateIncomeCash()
        this.create_by_other = new CreateIncomeOther()
    }
    submit_income() {

    }
}