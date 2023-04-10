import { Location } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import * as _ from "lodash";
import { delay, forkJoin, interval, of, Subscription, take } from "rxjs";
import { Additional } from "src/app/main/_model/additional/additional.model";
import { Customer } from "src/app/main/_model/customer/customer.model";
import { Discount } from "src/app/main/_model/discount/discount.model";
import { PaymentMehod } from "src/app/main/_model/payment/payment.model";
import { PaymentRepository } from "src/app/main/_model/payment/payment.repository";
import { Reservation } from "src/app/main/_model/reservation/reservation.model";
import { ReservationRepository } from "src/app/main/_model/reservation/reservation.repository";
import { ShiftRepository } from "src/app/main/_model/shift/shift.repository";
import { UserFullData } from "src/app/main/_model/users/user.model";
import { BaseService } from "src/app/main/_service/base.service";
import { ReservationService } from "src/app/main/_service/reservation.service";
import { UsersService } from "src/app/main/_service/user.service";
import { DialogService } from "src/app/shared/dialogs/dialog.service";
import { CheckoutService } from "../../_service/checkout.service";
import { TemporarySalesService } from "../../_service/temporarysales.service";
import { ItemTempSales, TempSales } from "../tempsales.model";
import { TempSalesRepository } from "../tempsales.repository";
import { Checkout, ResponCheckout } from "./checkout.model";
import { ReportSales } from "../../../report/_model/report.model";
import { ReportService } from "../../../report/_service/report.service";

@Injectable()
export class CheckoutRepository {

    checkout: Checkout = new Checkout()
    paymentId: number = 0
    lines: ItemTempSales[] = [];
    itemCount: number = 0;
    cartPrice: number = 0;
    reservation: Reservation | undefined;
    user?: UserFullData;
    _grandtotal_actual: number = 0

    disc: any;
    fee: any;
    tax: any;

    public charge_admin: boolean = false
    in_customer: Customer | undefined
    isLoading: boolean = false
    find_user: string = ''

    // SNACKBAR
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    // ================

    subs: Subscription[] = []
    constructor(
        private tempSalesService: TemporarySalesService,
        private shiftRepo: ShiftRepository,
        private paymentRepo: PaymentRepository,
        private tempRepo: TempSalesRepository,
        private baseService: BaseService,
        private _checkout_service: CheckoutService,
        private _snackBar: MatSnackBar,
        private location: Location,
        private _dlg: DialogService,
        private _user_service: UsersService,
        private _reservService: ReservationService,
        private _rsvpRepo: ReservationRepository,
        private _reportService: ReportService
    ) {
        this.listenerNumberResult()
        this.listenTriggerFromDialog()
        this.check_discount_tax_service()
    }

    listenerNumberResult() {
        const nums = this.baseService.numberResult$.subscribe(res => {
            this.checkout.cash = res
            // // console.log(this.checkout);
        })
        this.subs.push(nums)
    }

    listenTriggerFromDialog() {
        const nums = this.baseService.triggerFn$.subscribe(res => {
            if (_.isEqual(res, 'trigger')) {
                this.check_discount_tax_service()
            }
        })
        this.subs.push(nums)
    }

    findUser() {
        const usr = this._user_service.getUserById(this.find_user).subscribe(res => {
            this.user = res.data
            this.checkout.employeeUserName = this.user?.username ?? null
        }, (err: HttpErrorResponse) => {
            if (err.status == 404) {
                this.openSnackBar('Karyawan tidak ditemukan')
            }
        })
        this.subs.push(usr)
    }

    tempSalesForCheckout() {
        this.tempSalesService.getTempSalesById(this.paymentId).subscribe(res => {
            // // console.log(res);
            this.lines = (res.data as TempSales).items
            this.firstTempSalesToCheckout = res.data
            // console.log(this.checkout);
        })
    }

    set firstTempSalesToCheckout(temp: TempSales) {
        this.checkout.tempSalesId = temp.id
        this.checkout.name = temp.name
        this.checkout.tableIds = temp.tableIds
        // console.log(temp.tableIds);

        this.checkout.note = temp.note
        this.checkout.waiterName = temp.waiter
        this.checkout.waiterUserName = temp.waiter
        this.checkout.cashierName = `${this.shiftRepo.user.firstName} ${this.shiftRepo.user.lastName}`
        this.checkout.cashierUserName = this.shiftRepo.user.username ?? null
        this.checkout.subTotal = this.subTotal
        this.checkout.paymentMethod = this.paymentRepo.findPayment.type
        this.checkout.isDineIn = temp.tableIds.length > 0 ? false : true
        this.checkout.shiftId = this.shiftRepo.shift?.id ?? null
        this.calculateTotal()
        this.check_discount_tax_service()
    }

    get subTotal() {
        return this.lines.reduce((a, b) => +a + +b.totalPrice, 0);
    }

    get cash() {
        return this.checkout.cash
    }


    set inputNumber(val: number) {
        this.checkout.cash += val;
    }

    set_clear_cash() {
        this.checkout.cash = 0
        this.checkout.change = 0
    }

    check_discount_tax_service() {
        this.disc = !_.isNull(localStorage.getItem('DISCOUNT')) ? JSON.parse(localStorage.getItem('DISCOUNT')!) : {}
        this.fee = !_.isNull(localStorage.getItem('FEE')) ? JSON.parse(localStorage.getItem('FEE')!) : {}
        this.tax = !_.isNull(localStorage.getItem('TAX')) ? JSON.parse(localStorage.getItem('TAX')!) : {}

        // SET DISCOUNT
        if (Object.keys(this.disc).length > 0) {
            // CHECK PERCENT OR RUPIAH
            // // console.log((this.disc as Discount).type);

            if ((this.disc as Discount).type === 'PERCENT') {
                // // console.log('in percent');
                this.checkout.discount = ((this.disc as Discount).value / 100) * this.checkout.subTotal
            } else {
                this.checkout.discount = (this.disc as Discount).value
            }
        } else {
            this.checkout.discount = 0
        }

        // // console.log('after disc => ', this.checkout);


        // SET SERVICE
        if (Object.keys(this.fee).length > 0) {
            this.checkout.service = Math.ceil((Number((this.fee as Additional).value) / 100) * (this.checkout.subTotal - this.checkout.discount))
        } else {
            this.checkout.service = 0
        }

        // SET TAX
        if (Object.keys(this.tax).length > 0) {
            this.checkout.tax = Math.ceil((Number((this.tax as Additional).value) / 100) * ((this.checkout.subTotal - this.checkout.discount) + this.checkout.service))
        } else {
            this.checkout.tax = 0
        }
        this.calculateTotal()
    }

    get discount(): Discount | undefined {
        return Object.keys(this.disc).length > 0 ? (this.disc as Discount) : undefined
    }

    get service(): Additional | undefined {
        return Object.keys(this.fee).length > 0 ? (this.fee as Additional) : undefined
    }

    get taxes(): Additional | undefined {
        return Object.keys(this.tax).length > 0 ? (this.tax as Additional) : undefined
    }

    get isTax() {
        return this.checkout.isTax
    }

    clear_cash() {
        this.checkout.cash = 0
        this.checkout.change = 0
    }

    clear_discount_tax_service(is: string) {
        localStorage.removeItem(is)
        this.check_discount_tax_service()
    }

    public calculateTotal() {
        if (this.charge_admin) {
            // console.log('on charge');
            let main_calculate = ((((this.checkout.subTotal - this.checkout.deposit) - this.checkout.discount) + this.checkout.service) + this.checkout.tax)
            if (this.checkout.adminFee > 0) {
                this.checkout.total = main_calculate + (main_calculate * (this.checkout.adminFee / 100))
            }
            else { this.checkout.total = main_calculate }
        } else {
            // console.log('nope charge');
            let main_calculate = ((((this.checkout.subTotal - this.checkout.deposit) - this.checkout.discount) + this.checkout.service) + this.checkout.tax)
            this.checkout.total = main_calculate
        }
    }

    public calculateChange() {
        // this.checkout.change = ((this.checkout.total - this.checkout.cash) < 0) ? 0 : (this.checkout.total - this.checkout.cash)
        this.checkout.change = Math.abs(this.checkout.total - this.checkout.cash)
    }

    public clear_customer() {
        this.in_customer = undefined
        this.checkout.customerId = null
        this.checkout.customerName = null
        this.reservation = undefined
    }

    update_deposit(item: Reservation) {
        this.reservation = item
        this.checkout.deposit = this.reservation.dpAmount
        this.check_discount_tax_service()
        this.calculateTotal()
    }

    clear_reservation() {
        this.reservation = undefined
        this.checkout.deposit = 0
        this.calculateTotal()
    }


    updatePaymentId(usePayment: PaymentMehod | null) {
        this.checkout.paymentTypeId = usePayment ? usePayment.id : null
    }


    public checkoutTest() {
        // console.log(this.checkout);
        this.checkout_core()
    }

    public checkout_core() {
        switch (this.checkout.paymentMethod) {
            case 'CASH':
                if (!this.validation_checkout_cash()?.invalid) {
                    this._dlg.showConfirmationDialog("Checkout?", "Checkout Tagihan", `Konfirmasi checkout pesanan ID# ${this.checkout.tempSalesId}`, "confirm-checkout", "Ya")
                        .subscribe(res => {
                            if (res) {
                                this.doCheckout('PAID')
                            }
                        })
                } else {
                    this.openSnackBar(this.validation_checkout_cash()?.message ?? '')
                }
                break;
            case 'CUSTOM':
                if (!this.validation_checkout_custom()?.invalid) {
                    this._dlg.showConfirmationDialog("Checkout?", "Checkout Tagihan", `Konfirmasi checkout pesanan ID# ${this.checkout.tempSalesId}`, "confirm-checkout", "Ya")
                        .subscribe(res => {
                            if (res) {
                                this.doCheckout('PAID')
                            }
                        })
                } else {
                    this.openSnackBar(this.validation_checkout_custom()?.message ?? '')
                }
                break;
            case 'EMPL_DEBT':
                if (!this.validation_checkout_empl()?.invalid) {
                    this._dlg.showConfirmationDialog("Checkout?", "Checkout Tagihan", `Konfirmasi checkout pesanan ID# ${this.checkout.tempSalesId}`, "confirm-checkout", "Ya")
                        .subscribe(res => {
                            if (res) {
                                this.doCheckout('DEBT')
                            }
                        })
                } else {
                    this.openSnackBar(this.validation_checkout_empl()?.message ?? '')
                }
                break;
            case 'CUST_DEBT':
                if (!this.validation_checkout_cust()?.invalid) {
                    this._dlg.showConfirmationDialog("Checkout?", "Checkout Tagihan", `Konfirmasi checkout pesanan ID# ${this.checkout.tempSalesId}`, "confirm-checkout", "Ya")
                        .subscribe(res => {
                            if (res) {
                                this.doCheckout('DEBT')
                            }
                        })
                } else {
                    this.openSnackBar(this.validation_checkout_cust()?.message ?? '')
                }
                break;
            default:
                // this.validation_checkout_custom()
                break;
        }
    }

    validation_checkout_cash() {
        let validation: ValidationIn[] = [
            { invalid: (this.checkout.cash < 1), message: 'Anda belum memasuki jumlah pembayaran tunai' },
            { invalid: (this.checkout.cash < this.checkout.total), message: 'Jumlah pembayaran tunai belum cukup' },
        ]
        // // console.log(validation);
        let filter = validation.filter(x => x.invalid)
        if (filter.length > 0) {
            return filter[0]
        }
        return
    }

    validation_checkout_custom() {
        let validation: ValidationIn[] = [
            { invalid: (this.checkout.paymentTypeId == null), message: 'Anda belum memilih tipe pembayaran' },
            { invalid: (this.checkout.transactionNo == null || this.checkout.transactionNo == ''), message: 'Nomor transaksi belum terisi' },
        ]
        // // console.log(validation);
        let filter = validation.filter(x => x.invalid)
        if (filter.length > 0) {
            return filter[0]
        }
        return
    }

    validation_checkout_empl() {
        let validation: ValidationIn[] = [
            { invalid: (this.checkout.employeeUserName == null || this.checkout.employeeUserName == ''), message: 'Anda belum memasukan nama karyawan' },
        ]
        // // console.log(validation);
        let filter = validation.filter(x => x.invalid)
        if (filter.length > 0) {
            return filter[0]
        }
        return
    }

    validation_checkout_cust() {
        let validation: ValidationIn[] = [
            { invalid: (this.checkout.customerId == null), message: 'Anda belum memilih pelanggan' },
        ]
        // // console.log(validation);
        let filter = validation.filter(x => x.invalid)
        if (filter.length > 0) {
            return filter[0]
        }
        return
    }


    doCheckout(status: 'PAID' | 'DEBT') {
        this.checkout.status = status
        this._checkout_service.checkout(this.checkout).subscribe(res => {
            if (_.isEqual(res.statusCode, 0)) {
                // JIKA PAKAI DEPOSIT
                console.log(`res data =`, res.data);
                console.log(`as report =`, res.data as ResponCheckout);
                let response = res.data as ResponCheckout
                if (this.reservation !== undefined && this.checkout.deposit > 0) {
                    // this.tempRepo.find_report_data.next(res.data as ReportSales)
                    this._reservService.updateReservation(this.reservation?.id, true).subscribe(res => {
                        if (_.isEqual(res.statusCode, 0)) {
                            this._reportService.getReportById(response.id).subscribe(res => {
                                console.log('ini response report ', res.data as ReportSales);
                                this._dlg.showViewReceipt(res.data as ReportSales)
                                .subscribe(() => {
                                        this._dlg.showSWEDialog('Berhasil!', `Checkout tagihan berhasil`, 'success')
                                        this.reservation = undefined
                                        this.reBuildPayment()
                                        this.tempRepo.getTempSales()
                                        this.shiftRepo.check()
                                        this.location.back()
                                        this._rsvpRepo.fetchReservation()
                                        this.tempRepo.clearTempsalesActive()
                                })
                            })
                        }
                    })
                }
                // JIKA TIDAK PAKAI DEPOSIT
                else {
                    this._reportService.getReportById(response.id).subscribe(res => {
                        console.log('ini response report ', res.data as ReportSales);
                        this._dlg.showViewReceipt(res.data as ReportSales)
                        .subscribe(() => {
                            this._dlg.showSWEDialog('Berhasil!', `Checkout tagihan berhasil`, 'success')
                            this.reservation = undefined
                            this.reBuildPayment()
                            this.tempRepo.getTempSales()
                            this.shiftRepo.check()
                            this.location.back()
                            this._rsvpRepo.fetchReservation()
                            this.tempRepo.clearTempsalesActive()
                        })
                    })
                }
            }
        }, (err: HttpErrorResponse) => {
            this._dlg.showSWEDialog('Oopps!', `Checkout tagihan gagal`, 'error')
        })
    }

    reBuildPayment() {
        this.checkout.cash = 0
        this.checkout.change = 0
        this.checkout.adminFee = 0
        this.checkout.cardName = null
        this.checkout.cardNo = null
        this.checkout.merchantId = null
        this.checkout.transactionNo = null
        this.checkout.batchNo = null
        this.checkout.image = null
        this.checkout.employeeUserName = null
        this.checkout.paymentTypeId = null
        this.calculateTotal()
        this.reservation = undefined
    }



    //  DIALOG
    //  ================================================================
    openSnackBar(message: string) {
        this._snackBar.open(message, 'Tutup', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    ngOnDestroy() {
        this.reservation = undefined
        // console.log('destroy');
        this.subs.forEach(x => {
            x.unsubscribe()
        })
    }


}

export interface ValidationIn {
    invalid?: boolean
    message?: string
}