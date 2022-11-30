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

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

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
        this.fetchReservation()
        this.listenChangeCash()
    }

    fetchReservation() {
        this._reservService.getReservation(this.find)
            .subscribe(res => {
                console.log(res);
                this.dataReservation = res.data
            })

        let finds: FindReservation = new FindReservation()
        finds.branchId = this.shiftRepo.onBranch
        finds.subBranchId = this.shiftRepo.onSubBranch
        finds.startDate = this.find.startDate
        finds.endDate = this.find.endDate
        finds.status = true
        this._reservService.getReservation(finds)
            .subscribe(res => {
                this.dataReservationDone = res.data
            })
    }

    listenChangeCash() {
        this._baseservice.numberResultGeneral$.subscribe(res => {
            // console.log(res);
            this.createReservation.cash = res
            this.calculate()
        })
    }

    get reservation(): Reservation[] {
        return this.dataReservation?.content ?? []
    }

    get reservation_is_done(): Reservation[] {
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
        // console.log(this.timeUtil.setTimeInDate2(get_time, selected));
        this.createReservation.bookingTime = this.timeUtil.setTimeInDate2(get_time, selected)
        this.fetchReservation()
    }

    set find_date(date: number) {
        this.find.startDate = new Date(date).setHours(0, 0, 0, 0)
        this.find.endDate = new Date(date).setHours(23, 59, 59, 999)
        this.fetchReservation()
    }


    get disablePrev() {
        return ((this.reservationPagine?.pageNumber ?? 0) === 0)
    }

    get disbaleNext() {
        return (this.reservationPagine?.pageNumber ?? 0) === (this.reservationPagine?.totalPage ?? 0)
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
        console.log(this.createReservation);
        switch (this.createReservation.paymentMethod) {
            case 'CASH':
                if (this.validationCash()) {
                    this.dlg.showConfirmationDialog('Reservasi', 'Konfirmasi kembali reservasi anda', `Yakin ingin reservasi tanggal  ${this.timeUtil.getDate(this.createReservation?.bookingTime)}`, 'split-image', 'Ya, Yakin')
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
                        this.dlg.showConfirmationDialog('Reservasi', 'Konfirmasi kembali reservasi anda', `Yakin ingin reservasi tanggal  ${this.timeUtil.getDate(this.createReservation?.bookingTime)}`, 'split-image', 'Ya, Yakin')
                            .subscribe(res => {
                                if (res) {
                                    this.do_reservation()
                                }
                            })
                    }
                }

                if (custom === 'ewallet') {
                    if (this.validationEwallet()) {
                        this.dlg.showConfirmationDialog('Reservasi', 'Konfirmasi kembali reservasi anda', `Yakin ingin reservasi tanggal  ${this.timeUtil.getDate(this.createReservation?.bookingTime)}`, 'split-image', 'Ya, Yakin')
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
        this.dlg.showConfirmationDialog('Reservasi', 'Konfirmasi kembali reservasi anda', `Yakin ingin membatalkan reservasi ini`, 'split-image', 'Ya, Yakin')
            .subscribe(res => {
                if (res) {
                    this._reservService.updateReservation(id, true).subscribe(res => {
                        if (_.isEqual(res.statusCode, 0)) {
                            this.openSnackBar('Reservasi berhasil dibatalkan')
                            this.fetchReservation()
                        }
                    }, (err: HttpErrorResponse) => {
                        switch (err.error.statusCode) {
                            case 1804:
                                this.openSnackBar('Reservasi tidak bisa dibatalkan')
                                break;
                            default:
                                this.openSnackBar(err.error.message)
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
                this.openSnackBar('Reservasi berhasil ditambahkan')
                this.fetchReservation()
            }
        }, (err: HttpErrorResponse) => {
            switch (err.error.statusCode) {
                case 1804:
                    this.openSnackBar('Reservasi gagal dimuat')
                    break;
                default:
                    this.openSnackBar(err.error.message)
                    break;
            }
        })
    }
}