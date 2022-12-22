import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatBottomSheet, MatBottomSheetConfig } from "@angular/material/bottom-sheet";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import * as _ from "lodash";
import { NumpadComponent } from "src/app/main/_dialog/numpad.component";
import { EmployeeCash } from "src/app/main/_model/employee/employee.model";
import { ShiftRepository } from "src/app/main/_model/shift/shift.repository";
import { User, UserFullData } from "src/app/main/_model/users/user.model";
import { BaseService } from "src/app/main/_service/base.service";
import { EmployeeService } from "src/app/main/_service/employee.service";
import { UsersService } from "src/app/main/_service/user.service";
import { DialogService } from "src/app/shared/dialogs/dialog.service";
import { Pageable } from "src/app/_model/general.model";
import { base64ToFile } from "src/app/_utility/images";
import { TimeUtil } from "src/app/_utility/time.util";
import { ExpenseService } from "../_service/expense.service";
import { CreateExpense, DataExpensee, Expense, FilterExpense, UploadReceiptImage } from "./expense.model";

@Injectable()
export class ExpenseRepository {

    expanses?: DataExpensee;
    filter: FilterExpense = new FilterExpense()
    create: CreateExpense = new CreateExpense()
    employee_cash: EmployeeCash = new EmployeeCash()
    upload_receipt: UploadReceiptImage = new UploadReceiptImage()

    public is_loading: boolean = false;
    public is_loading_submit: boolean = false;

    today = new Date();
    rangeDate = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });

    key_find_user: string = ''
    data_user?: UserFullData;

    // SNACKBAR
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    // ================

    constructor(private _expanseservice: ExpenseService, private shiftRepo: ShiftRepository,
        public timeUtil: TimeUtil, private _baseService: BaseService,
        private _dlg: DialogService, private _snackBar: MatSnackBar,
        private _user_service: UsersService, private _empl_service: EmployeeService,
        private _bottomSheet: MatBottomSheet) {
        this.init()
        this.listenAmount()
    }

    init() {
        this.filter.branchId = this.shiftRepo.onBranch
        this.filter.subBranchId = this.shiftRepo.onSubBranch
        this.filter.startDate = this.timeUtil.startTodayTime(this.today)
        this.filter.endDate = this.timeUtil.endTodayTime(this.today)

        this.fetch_expense()
        this.rangeDate = new FormGroup({
            start: new FormControl<Date | null>(new Date()),
            end: new FormControl<Date | null>(new Date()),
        });
    }

    listenAmount() {
        this._baseService.numberResultExpense$.subscribe(res => {
            this.create.cost = res
        })

        this._baseService.numberResultEmplCash$.subscribe(res => {
            this.employee_cash.amount = res
        })
    }


    fetch_expense() {
        this.is_loading = true
        this._expanseservice.getExpense(this.filter)
            .subscribe(res => {
                this.expanses = res.data
                this.is_loading = false
            })
    }

    get _expense_list(): Expense[] {
        return this.expanses?.content ?? []
    }

    get pagine(): Pageable | undefined {
        return this.expanses?.pageable
    }

    next() {
        this.filter.page += 1
        this.fetch_expense()
    }

    prev() {
        this.filter.page -= 1
        this.fetch_expense()
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
        this.fetch_expense()
    }

    findUser() {
        this._user_service.getUserById(this.key_find_user).subscribe(res => {
            this.data_user = res.data
        }, (err: HttpErrorResponse) => {
            if (err.status == 404) {
                this.openSnackBar('Karyawan tidak ditemukan')
            }
        })
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

    reset_expense() {
        this.create = new CreateExpense()
    }

    reset_empl_cash() {
        this.employee_cash = new EmployeeCash()
        this.data_user = undefined
        this.key_find_user = ''
    }


    //  DIALOG
    //  ================================================================
    openSnackBar(message: string) {
        this._snackBar.open(message, 'Tutup', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    openKeybordSheet(typeNumpad: string) {

        if (typeNumpad === 'expense') {
            const configBottom: MatBottomSheetConfig = new MatBottomSheetConfig()
            configBottom.data = [this.create.cost, typeNumpad]
            configBottom.backdropClass = 'backdrop-numpad'
            configBottom.panelClass = 'panel-numpad'
            this._bottomSheet.open(NumpadComponent, configBottom);
        } else {
            const configBottom: MatBottomSheetConfig = new MatBottomSheetConfig()
            configBottom.data = [this.employee_cash.amount, typeNumpad]
            configBottom.backdropClass = 'backdrop-numpad'
            configBottom.panelClass = 'panel-numpad'
            this._bottomSheet.open(NumpadComponent, configBottom);
        }
    }

    fileChangeEvent(event: any, id: number): void {
        let id_expense = id
        this._dlg.showCropImage(event).subscribe(res => {
            if (res.response) {
                let strImage = res.result.replace(/^data:image\/[a-z]+;base64,/, "");
                this.upload_receipt.file = base64ToFile(strImage, new Date().toDateString())
                this.upload_receipt.id = id_expense
                this.doUploadReceipt()
            }

        })
    }

    openPhoto(id: number) {
        let id_expense = id
        this._dlg.showWebcam("Foto bukti", "Foto bukti Struk/Barang/dll", "photo_camera", "Ambil Gambar")
            .subscribe(res => {
                if (res.response) {
                    this.upload_receipt.file = base64ToFile(res.image, new Date().toDateString())
                    this.upload_receipt.id = id_expense
                    this.doUploadReceipt()
                }
            })
    }


    //  SUBMIT
    //  ================================================================

    state_invalid_expense() {
        if (this.create.note.length < 5) {
            return { invalid: true, message: 'Keterangan harus diisi lebih dari 5 huruf minimal 1 kata' }
        }
        if (this.create.cost < 10000) {
            return { invalid: true, message: 'Minimal Pengeluaran Rp 10.000' }
        }
        return { invalid: false, message: '' }
    }

    state_invalid_empl_cash() {
        if (this.employee_cash.amount < 10000) {
            return { invalid: true, message: 'Minimal Pengeluaran Rp 10.000' }
        }
        return { invalid: false, message: '' }
    }

    submit_expense() {
        if (!this.state_invalid_expense().invalid) {
            this._dlg.showConfirmationDialog(
                'Konfirmasi Pengeluaran Kas', // TITLE
                'Apakah Kamu Yakin Ingin Mengeluarkan Kas?', // SUBTITLE
                'Apakah Kamu Yakin Ingin Mengeluarkan Kas?', // MESSAGE
                'confirm-expense', // ICON
                'Ya, Yakin', // CONFIRM
            ).subscribe(async (res) => {
                if (res) {
                    await this.preparePayloadExpense()
                    this.doSubmitExpense()
                }
            })
        } else {
            this.openSnackBar(this.state_invalid_expense().message)
        }
    }

    submit_empl_cash() {
        if (!this.state_invalid_empl_cash().invalid) {
            this._dlg.showConfirmationDialog(
                'Konfirmasi Pengeluaran Kas', // TITLE
                'Apakah Kamu Yakin Ingin Mengeluarkan Kas?', // SUBTITLE
                'Apakah Kamu Yakin Ingin Mengeluarkan Kas?', // MESSAGE
                'confirm-expense', // ICON
                'Ya, Yakin', // CONFIRM
            ).subscribe(async (res) => {
                if (res) {
                    await this.preparePayloadEmployeeCash()
                    this.doSubmitEmplCash()
                }
            })
        } else {
            this.openSnackBar(this.state_invalid_empl_cash().message)
        }
    }

    async preparePayloadExpense() {
        this.create.branchId = this.shiftRepo.onBranch
        this.create.subBranchId = this.shiftRepo.onSubBranch
    }
    async preparePayloadEmployeeCash() {
        this.employee_cash.branchId = this.shiftRepo.onBranch
        this.employee_cash.subBranchId = this.shiftRepo.onSubBranch
        this.employee_cash.shiftId = this.shiftRepo.shift?.id ?? null
        this.employee_cash.username = this.data_user?.username ?? ''
    }

    doSubmitExpense() {
        this.is_loading_submit = true
        this._expanseservice.createExpense(this.create)
            .subscribe(res => {
                if (_.isEqual(res.statusCode, 0)) {
                    this.openSnackBar('Kas Operasional telah dicatat')
                    this.fetch_expense()
                    this.reset_expense()
                }
                this.is_loading_submit = false
            }, (err: HttpErrorResponse) => {
                this.openSnackBar('Operasional gagal dicatat')
                this.is_loading_submit = false
            })
    }

    doSubmitEmplCash() {
        this.is_loading_submit = true
        this._empl_service.createCashEmployee(this.employee_cash)
            .subscribe(res => {
                if (_.isEqual(res.statusCode, 0)) {
                    this.openSnackBar('Kas Karyawan telah dicatat')
                    this.fetch_expense()
                    this.reset_empl_cash()
                }
                this.is_loading_submit = false
            }, (err: HttpErrorResponse) => {
                this.openSnackBar('Operasional gagal dicatat')
                this.is_loading_submit = false
            })
    }

    doUploadReceipt() {
        this.is_loading_submit = true
        this._expanseservice.uploadReceipt(this.upload_receipt)
            .subscribe(res => {
                if (_.isEqual(res.statusCode, 0)) {
                    this.openSnackBar('Upload bukti berhasil')
                    this.fetch_expense()
                }
                this.is_loading_submit = false
            }, (err: HttpErrorResponse) => {
                this.openSnackBar('Upload bukti gagal')
                this.is_loading_submit = false
            })
    }

}