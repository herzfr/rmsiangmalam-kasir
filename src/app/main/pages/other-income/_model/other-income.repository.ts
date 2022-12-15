import { Injectable } from "@angular/core";
import { ShiftRepository } from "src/app/main/_model/shift/shift.repository";
import { OtherIncomeService } from "../_service/other-income.service";
import { CreateIncomeCash, CreateIncomeOther, DataOtherIncome, FilterIncome } from "./other-income.model";

@Injectable()
export class OtherIncomeRepository {

    public filter: FilterIncome = new FilterIncome()
    public create_by_cash: CreateIncomeCash = new CreateIncomeCash()
    public create_by_other: CreateIncomeOther = new CreateIncomeOther()
    public data_income?: DataOtherIncome;

    constructor(public shiftRepo: ShiftRepository, public _income_service: OtherIncomeService) {
        this.init()
    }

    init() {
        this.filter.branchId = this.shiftRepo.onBranch
        this.filter.subBranchId = this.shiftRepo.onSubBranch
        this.fetch_income()
    }

    fetch_income() {
        this._income_service.getIncome(this.filter).subscribe(res => {
            console.log(res);
            this.data_income = res.data
        })
    }
}