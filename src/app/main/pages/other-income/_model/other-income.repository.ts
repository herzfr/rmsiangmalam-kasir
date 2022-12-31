import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import * as _ from "lodash";
import { ShiftRepository } from "src/app/main/_model/shift/shift.repository";
import { BaseService } from "src/app/main/_service/base.service";
import { DialogService } from "src/app/shared/dialogs/dialog.service";
import { Pageable } from "src/app/_model/general.model";
import { TimeUtil } from "src/app/_utility/time.util";
import { OtherIncomeService } from "../_service/other-income.service";
import { CreateIncome, CreateIncomeCash, CreateIncomeOther, DataOtherIncome, FilterIncome, IncomeUp, OtherIncome } from "./other-income.model";

@Injectable()
export class OtherIncomeRepository {

    public filter: FilterIncome = new FilterIncome()
    public create_income: CreateIncome = new CreateIncome()
    public create_by_cash: CreateIncomeCash = new CreateIncomeCash()
    public create_by_other: CreateIncomeOther = new CreateIncomeOther()
    public data_income?: DataOtherIncome;

    public is_loading: boolean = false;
    public is_loading_submit: boolean = false;

    today = new Date();
    rangeDate = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });


    // SNACKBAR
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    // ================


    constructor(public shiftRepo: ShiftRepository, public _income_service:
        OtherIncomeService, public timeUtil: TimeUtil, private _baseService: BaseService,
        private _dlg: DialogService, private _snackBar: MatSnackBar) {
        this.filter.startDate = new Date().setDate(this.today.getDate() - 1)
        this.filter.endDate = new Date().setHours(23, 59, 59, 999)
        this.init()
    }

    init() {
        this.filter.branchId = this.shiftRepo.onBranch
        this.filter.subBranchId = this.shiftRepo.onSubBranch
        this.fetch_income()
        this.listenerNumberResult()
        this.rangeDate = new FormGroup({
            start: new FormControl<Date | null>(new Date(this.filter.startDate)),
            end: new FormControl<Date | null>(new Date(this.filter.endDate)),
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
        // this.create_income.amount = this.create_income.amount + (this.create_income.amount * (this.create_by_other.adminFee / 100))
    }

    checked() {
        setTimeout(() => {
            this.calculate()
        }, 1)

    }


    //  DIALOG
    //  ================================================================
    openSnackBar(message: string) {
        this._snackBar.open(message, 'Tutup', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }


    //  SUBMTI
    //  ================================================================
    reset_income() {
        this.create_income = new CreateIncome()
        this.create_by_cash = new CreateIncomeCash()
        this.create_by_other = new CreateIncomeOther()
    }

    reset_payment() {
        this.create_by_cash = new CreateIncomeCash()
        this.create_by_other = new CreateIncomeOther()
    }

    submit_income() {
        this.create_income.branchId = this.shiftRepo.onBranch
        this.create_income.subBranchId = this.shiftRepo.onSubBranch
        let merge: any = { ...this.create_by_cash, ...this.create_by_other, ...this.create_income }
        console.log(merge);

        this.go_validation(merge);
    }

    go_validation(merge: any) {
        if (merge.type == 'CASH') {
            if (merge.cash > 0) {

                if (!this.state_invalid_cash(merge).invalid) {
                    this._dlg.showConfirmationDialog("Pemasukan Lainnya", "", "kamu akan memasukan tagihan " + merge.note, "confirm-income", "Ya, Yakin")
                        .subscribe(res => {
                            if (res) {
                                this.goSubmitIncome(merge as IncomeUp)
                            }
                        })
                } else {
                    this.openSnackBar(this.state_invalid_cash(merge).message)
                }

            } else {
                this.openSnackBar('Masukan uang tunai sesai jumlah yang dimasukan')
            }
        }


        if (merge.type == 'CUSTOM') {
            if (!this.state_invalid_other(merge).invalid) {
                this._dlg.showConfirmationDialog("Pemasukan Lainnya", "", "kamu akan memasukan tagihan " + merge.note, "confirm-income", "Ya, Yakin")
                    .subscribe(res => {
                        if (res) {
                            this.goSubmitIncome(merge as IncomeUp)
                        }
                    })
            } else {
                this.openSnackBar(this.state_invalid_other(merge).message)
            }
        }


    }

    state_invalid_cash(merge: any) {
        if (merge.note.length < 5) {
            return { invalid: true, message: 'Keterangan harus diisi lebih dari 5 huruf minimal 1 kata' }
        }
        return { invalid: false, message: '' }
    }

    state_invalid_other(merge: any) {
        if (merge.note.length < 5) {
            return { invalid: true, message: 'Keterangan harus diisi lebih dari 5 huruf minimal 1 kata' }
        }

        if (merge.transactionNo.length < 0) {
            return { invalid: true, message: 'No transaksi harus diisi' }
        }

        if (merge.paymentTypeId === 0) {
            return { invalid: true, message: 'Pilih terlebih dahulu tipe pembayaran' }
        }

        return { invalid: false, message: '' }
    }

    goSubmitIncome(data: IncomeUp) {
        this.is_loading_submit = true
        this._income_service.createIncome(data).subscribe(res => {
            if (_.isEqual(res.statusCode, 0)) {
                this._dlg.showSWEDialog('Berhasil!', `Pemasukan telah ditambahkan`, 'success')
                this.is_loading_submit = false
                this.reset_income()
                this.fetch_income()
            }
            this.is_loading_submit = false
        }, (err: HttpErrorResponse) => {
            this._dlg.showSWEDialog('Opps!', `Pemasukan gagal ditambahkan`, 'error')
            this.is_loading_submit = false
        })
    }
}