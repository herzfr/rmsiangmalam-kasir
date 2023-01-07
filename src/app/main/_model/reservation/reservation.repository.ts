import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import * as _ from "lodash";
import { DialogService } from "src/app/shared/dialogs/dialog.service";
import { Pageable } from "src/app/_model/general.model";
import { TimeUtil } from "src/app/_utility/time.util";
import { BaseService } from "../../_service/base.service";
import { ReservationService } from "../../_service/reservation.service";
import { ShiftRepository } from "../shift/shift.repository";
import { CreateReservation, DataReservation, FindReservation, Reservation } from "./reservation.model";

@Injectable({ 'providedIn': 'root' })
export class ReservationRepository {
    public find: FindReservation = new FindReservation()
    private dataReservation: DataReservation | undefined;
    private dataReservationDone: DataReservation | undefined;
    public createReservation: CreateReservation = new CreateReservation()
    dat: Date = new Date()

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    is_loading: boolean = false

    constructor(
        private _reservService: ReservationService,
        private shiftRepo: ShiftRepository,
        private _baseservice: BaseService,
        private timeUtil: TimeUtil,
        private _snackBar: MatSnackBar,
        private dlg: DialogService
    ) {
        this.find.branchId = shiftRepo.onBranch
        this.find.subBranchId = shiftRepo.onSubBranch
        this.createReservation.branchId = shiftRepo.onBranch
        this.createReservation.subBranchId = shiftRepo.onSubBranch
        this.find.startDate = this.timeUtil.convertDateTimeLocale(this.date_in).setHours(0, 0, 0, 0)
        this.find.endDate = this.timeUtil.convertDateTimeLocale(this.date_in).setHours(23, 59, 59, 999)

        this.fetchReservation()
        this.listenChangeCash()
    }

    fetchReservation() {
        this.is_loading = true
        this._reservService.getReservation(this.find)
            .subscribe(res => {
                // console.log(res);
                this.dataReservation = res.data

                let finds: FindReservation = new FindReservation()
                finds.branchId = this.shiftRepo.onBranch
                finds.subBranchId = this.shiftRepo.onSubBranch
                finds.startDate = this.find.startDate
                finds.endDate = this.find.endDate

                finds.status = true
                this._reservService.getReservation(finds)
                    .subscribe(res => {
                        this.dataReservationDone = res.data
                        this.stopLoading()
                    })
            })
    }

    stopLoading() {
        setTimeout(() => {
            this.is_loading = false
        }, 1)
    }

    listenChangeCash() {
        this._baseservice.numberResultGeneral$.subscribe(res => {
            // // console.log(res);
            this.createReservation.cash = res
            this.calculate()
        })
    }

    get date_in() {
        let date = new Date();
        date.setDate(this.dat.getDate()) - 1;
        return date
    }


    get reservation(): Reservation[] {
        return this.dataReservation?.content ?? []
    }

    get reservation_is_done(): Reservation[] {
        this.stopLoading()
        return this.dataReservationDone?.content ?? []
    }

    get reservationPagine(): Pageable | undefined {
        return this.dataReservation?.pageable
    }

    get isSubmit() {
        if (this.createReservation.dpAmount === this.createReservation.cash) {
            return true
        }
        return false
    }

    set_bookingTime(selected: Date) {
        let get_time = this.timeUtil.getJustTime(this.createReservation.bookingTime)
        // // console.log(this.timeUtil.setTimeInDate2(get_time, selected));
        this.createReservation.bookingTime = this.timeUtil.setTimeInDate2(get_time, selected)
        this.fetchReservation()
    }

    set find_date(date: number) {

        let date_local = this.timeUtil.convertMillisTimeLocale(date)
        this.find.startDate = this.timeUtil.convertDateTimeLocale(date_local).setHours(0, 0, 0, 0)
        this.find.endDate = this.timeUtil.convertDateTimeLocale(date_local).setHours(23, 59, 59, 999)

        this.fetchReservation()
    }


    get disablePrev() {
        return ((this.reservationPagine?.pageNumber ?? 0) === 0)
    }

    get disbaleNext() {
        return (this.reservationPagine?.pageNumber ?? 0) >= (this.reservationPagine?.totalPage ?? 0) - 1
    }


    nextPage() {
        this.find.page = ((this.reservationPagine?.pageNumber ?? 0) + 1)
        this.fetchReservation()
    }

    prevPage() {
        this.find.page = ((this.reservationPagine?.pageNumber ?? 0) - 1)
        this.fetchReservation()
    }


    public calculate() {
        if (this.createReservation.paymentMethod === 'CASH') {
            this.createReservation.change = this.createReservation.dpAmount - this.createReservation.cash
            this.createReservation.adminFee = 0
            this.createReservation.batchNo = null
            this.createReservation.cardNo = null
            this.createReservation.cardName = null
            this.createReservation.image = null
            this.createReservation.transactionNo = null
            this.createReservation.merchantId = null
        } else if (this.createReservation.paymentMethod === 'CUSTOM') {
            this.createReservation.change = 0
            this.createReservation.cash = 0
        } else {
            this.clean()
        }
    }


    public clean() {
        this.createReservation.adminFee = 0
        this.createReservation.change = 0
        this.createReservation.cash = 0
        this.createReservation.batchNo = null
        this.createReservation.cardNo = null
        this.createReservation.cardName = null
        this.createReservation.image = null
        this.createReservation.transactionNo = null
        this.createReservation.merchantId = null
    }

    public submitReservation(custom?: string) {
        // console.log(this.createReservation);
        switch (this.createReservation.paymentMethod) {
            case 'CASH':
                if (this.validationCash()) {
                    this.dlg.showConfirmationDialog('Reservasi', 'Konfirmasi kembali reservasi anda', `Yakin ingin reservasi tanggal  ${this.timeUtil.getDate(this.createReservation?.bookingTime)}`, 'confirm-reservation', 'Ya, Yakin')
                        .subscribe(res => {
                            if (res) {
                                this.do_reservation()
                            }
                        })
                }
                break;
            case 'CUSTOM':
                if (custom === 'debit') {
                    if (this.validationDebit()) {
                        this.dlg.showConfirmationDialog('Reservasi', 'Konfirmasi kembali reservasi anda', `Yakin ingin reservasi tanggal  ${this.timeUtil.getDate(this.createReservation?.bookingTime)}`, 'confirm-reservation', 'Ya, Yakin')
                            .subscribe(res => {
                                if (res) {
                                    this.do_reservation()
                                }
                            })
                    }
                }

                if (custom === 'ewallet') {
                    if (this.validationEwallet()) {
                        this.dlg.showConfirmationDialog('Reservasi', 'Konfirmasi kembali reservasi anda', `Yakin ingin reservasi tanggal  ${this.timeUtil.getDate(this.createReservation?.bookingTime)}`, 'confirm-reservation', 'Ya, Yakin')
                            .subscribe(res => {
                                if (res) {
                                    this.do_reservation()
                                }
                            })
                    }
                }

                break;
            default:

                break;
        }
    }

    validationCash() {
        if (this.createReservation.cash > 0) {
            if (this.createReservation.dpAmount > 0) {
                if (this.createReservation.name != '' && this.createReservation.name != null) {
                    if (this.createReservation.note != '' && this.createReservation.note != null) {
                        return true
                    } else {
                        this.openSnackBar('Catatan tidak boleh kosong')
                        return false
                    }
                } else {
                    this.openSnackBar('Nama tidak boleh kosong')
                    return false
                }
            } else {
                this.openSnackBar('Masukan Deposit terlebih dahulu')
                return false
            }
        } else {
            this.openSnackBar('Masukan pembayaran tunai terlebih dahulu')
            return false
        }
    }


    validationDebit() {
        if (this.createReservation.dpAmount > 0) {
            if (this.createReservation.name != '' && this.createReservation.name != null) {
                if (this.createReservation.note != '' && this.createReservation.note != null) {
                    if (this.createReservation.cardNo != '' && this.createReservation.cardNo != null) {
                        if (this.createReservation.transactionNo != '' && this.createReservation.transactionNo != null) {
                            return true
                        } else {
                            this.openSnackBar('Nomor transaksi tidak boleh kosong')
                            return false
                        }
                    } else {
                        this.openSnackBar('No Kartu tidak boleh kosong')
                        return false
                    }
                } else {
                    this.openSnackBar('Catatan tidak boleh kosong')
                    return false
                }
            } else {
                this.openSnackBar('Nama tidak boleh kosong')
                return false
            }
        } else {
            this.openSnackBar('Masukan Deposit terlebih dahulu')
            return false
        }
    }

    validationEwallet() {
        if (this.createReservation.dpAmount > 0) {
            if (this.createReservation.name != '' && this.createReservation.name != null) {
                if (this.createReservation.note != '' && this.createReservation.note != null) {
                    return true
                } else {
                    this.openSnackBar('Catatan tidak boleh kosong')
                    return false
                }
            } else {
                this.openSnackBar('Nama tidak boleh kosong')
                return false
            }
        } else {
            this.openSnackBar('Masukan Deposit terlebih dahulu')
            return false
        }
    }

    deleteReservation(id: number) {
        this.dlg.showConfirmationDialog('Reservasi', 'Konfirmasi kembali reservasi anda', `Yakin ingin membatalkan reservasi ini`, 'confirm-reservation', 'Ya, Yakin')
            .subscribe(res => {
                if (res) {
                    this._reservService.updateReservation(id, true).subscribe(res => {
                        if (_.isEqual(res.statusCode, 0)) {
                            this.dlg.showSWEDialog('Berhasil!', `Reservasi berhasil dibatalkan`, 'success')
                            this.fetchReservation()
                        }
                    }, (err: HttpErrorResponse) => {
                        switch (err.error.statusCode) {
                            case 1804:
                                this.dlg.showSWEDialog('Oopss!', `Reservasi tidak bisa dibatalkan`, 'error')
                                break;
                            default:
                                this.dlg.showSWEDialog('Oopss!', err.error.message, 'error')
                                break;
                        }
                    })
                }
            })

    }

    openSnackBar(message: string) {
        this._snackBar.open(message, 'Tutup', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }


    do_reservation() {
        this._reservService.createReservation(this.createReservation).subscribe(res => {
            if (_.isEqual(res.statusCode, 0)) {
                this.dlg.showSWEDialog('Berhasil!', `Reservasi berhasil ditambahkan`, 'success')
                this.fetchReservation()
                this.clean()
                this.createReservation = new CreateReservation()
            }
        }, (err: HttpErrorResponse) => {
            switch (err.error.statusCode) {
                case 1804:
                    this.dlg.showSWEDialog('Oopss!', `Reservasi tidak bisa dibatalkan`, 'error')
                    break;
                default:
                    this.dlg.showSWEDialog('Oopss!', err.error.message, 'error')
                    break;
            }
        })
    }
}