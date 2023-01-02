import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ShiftRepository } from "src/app/main/_model/shift/shift.repository";
import { DialogService } from "src/app/shared/dialogs/dialog.service";
import { Pageable } from "src/app/_model/general.model";
import { TimeUtil } from "src/app/_utility/time.util";
import { ReportService } from "../_service/report.service";
import { GetReportSales, ReportSales, RespReportSales } from "./report.model";

@Injectable()
export class ReportRepository {

    filter: GetReportSales = new GetReportSales()
    report?: RespReportSales;

    is_loading: boolean = false

    today = new Date();
    rangeDate = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });

    constructor(private _reportservice: ReportService, private shiftRepo: ShiftRepository, public timeUtil: TimeUtil,
        private _dlg: DialogService) {
        this.init()
    }

    init() {
        this.filter.branchId = this.shiftRepo.onBranch
        this.filter.subBranchId = this.shiftRepo.onSubBranch
        this.filter.startDate = this.timeUtil.startTodayTime(this.today)
        this.filter.endDate = this.timeUtil.endTodayTime(this.today)

        this.fetch_report()
        this.rangeDate = new FormGroup({
            start: new FormControl<Date | null>(new Date()),
            end: new FormControl<Date | null>(new Date()),
        });
    }

    fetch_report() {
        this.is_loading = true
        this._reportservice.getReport(this.filter)
            .subscribe(res => {
                this.report = res.data
                this.is_loading = false
            })
    }

    get reports(): ReportSales[] {
        return this.report?.content ?? []
    }

    get pagine(): Pageable | undefined {
        return this.report?.pageable
    }

    next() {
        this.filter.page += 1
        this.fetch_report()
    }

    prev() {
        this.filter.page -= 1
        this.fetch_report()
    }

    get is_disabled_next() {
        return ((this.pagine?.pageNumber ?? 0) >= (this.pagine?.totalPage ?? 0))
    }

    get is_disabled_prev() {
        return (this.pagine?.pageNumber == 0)
    }

    //  FILTER
    //  ================================================================
    findByDate() {
        this.setStartDate = this.startFormDate
        this.setEndDate = this.endFormDate
        this.fetch_report()
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



}