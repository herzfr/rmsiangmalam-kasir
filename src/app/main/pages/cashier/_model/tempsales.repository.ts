import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { Additional } from "src/app/main/_model/additional/additional.model";
import { Discount } from "src/app/main/_model/discount/discount.model";
import { ShiftRepository } from "src/app/main/_model/shift/shift.repository";
import { TimeUtil } from "src/app/_utility/time.util";
import { TemporarySalesService } from "../_service/temporarysales.service";
import { DataTempSales, FindTempSales, TempSales } from "./tempsales.model";

@Injectable()
export class TempSalesRepository {

    // SEARCH
    public findTempSales: FindTempSales = new FindTempSales()
    // ==============

    // TEMP SALES DATA
    public tempSalesData?: DataTempSales;
    // ==============


    // CHOOSEE ACTIVE
    public tempSalesActive: TempSales | undefined;
    // ==============

    // DISCOUNT / TAX / SERVICE
    public discount: Discount | undefined;
    public tax: Additional | undefined;
    public service: Additional | undefined;
    // ================

    // PAYMENT

    // ================

    // BOOLEAN OPERATOR
    public isLoading = false
    // ================



    allsubs: Subscription[] = []
    constructor(private tempSalesService: TemporarySalesService, private shiftRepo: ShiftRepository, public timeUtil: TimeUtil) {
        this.findTempSales.branchId = shiftRepo.onBranch;
        this.findTempSales.subBranchId = shiftRepo.onSubBranch;
        this.getTempSales()
    }

    getTempSales() {
        this.isLoading = true
        setTimeout(() => {
            let subsTempSalesAll = this.tempSalesService.getTempSales(this.findTempSales).subscribe(res => {
                this.tempSalesData = res.data
                this.isLoading = false
            })
            this.allsubs.push(subsTempSalesAll)
        }, 500)
    }

    findTempSalesByOpt(search: string, page: number, size: number, start: number, end: number, opt: string) {
        this.findTempSales.branchId = this.shiftRepo.onBranch;
        this.findTempSales.subBranchId = this.shiftRepo.onSubBranch;
        this.findTempSales.search = search;
        this.findTempSales.page = page;
        this.findTempSales.size = size;
        this.findTempSales.startDate = start;
        this.findTempSales.endDate = end;
        this.findTempSales.option = opt;
        this.getTempSales()
    }

    get tempSales() {
        return this.tempSalesData?.content ?? []
    }

    get tempSalesPagine() {
        return this.tempSalesData?.pageable
    }

    set setStartDate(date: Date) {
        let get_time = this.timeUtil.getJustTime(this.findTempSales.startDate)
        let get_milis_time = this.timeUtil.setTimeInDate(get_time, date)
        this.findTempSales.startDate = get_milis_time
    }

    set setEndDate(date: Date) {
        let get_time = this.timeUtil.getJustTime(this.findTempSales.endDate)
        let get_milis_time = this.timeUtil.setTimeInDate(get_time, date)
        this.findTempSales.endDate = get_milis_time
    }




    get disablePrevList() {
        return ((this.tempSalesPagine?.pageNumber ?? 0) === 0)
    }

    get disbaleNextList() {
        return (this.tempSalesPagine?.pageNumber ?? 0) > ((this.tempSalesPagine?.totalPage ?? 0) - 1)
    }

    nextList() {
        this.findTempSales.page = ((this.tempSalesPagine?.pageNumber ?? 0) + 1)
        this.getTempSales()
    }

    prevList() {
        this.findTempSales.page = ((this.tempSalesPagine?.pageNumber ?? 0) - 1)
        this.getTempSales()
    }


    async findTempSalesById(id: number): Promise<any> {
        // let tempSalesDatas: DataTempSales;
        await this.tempSalesService.getTempSalesById(id).subscribe(async (res) => {
            return await res.data
        })
    }



    ngOnDestroy() {
        this.allsubs.forEach(subs => {
            subs.unsubscribe()
        })
        this.allsubs = []
    }
}