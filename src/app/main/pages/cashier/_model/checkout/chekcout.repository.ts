import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { Additional } from "src/app/main/_model/additional/additional.model";
import { Customer } from "src/app/main/_model/customer/customer.model";
import { Discount } from "src/app/main/_model/discount/discount.model";
import { PaymentMehod } from "src/app/main/_model/payment/payment.model";
import { PaymentRepository } from "src/app/main/_model/payment/payment.repository";
import { Reservation } from "src/app/main/_model/reservation/reservation.model";
import { ShiftRepository } from "src/app/main/_model/shift/shift.repository";
import { BaseService } from "src/app/main/_service/base.service";
import { TemporarySalesService } from "../../_service/temporarysales.service";
import { ItemTempSales, TempSales } from "../tempsales.model";
import { Checkout } from "./checkout.model";

@Injectable()
export class CheckoutRepository {

    checkout: Checkout = new Checkout()
    paymentId: number = 0
    lines: ItemTempSales[] = [];
    itemCount: number = 0;
    cartPrice: number = 0;
    reservation: Reservation | undefined;

    disc: any;
    fee: any;
    tax: any;

    in_customer: Customer | undefined;

    constructor(
        private tempSalesService: TemporarySalesService,
        private shiftRepo: ShiftRepository,
        private paymentRepo: PaymentRepository,
        private baseService: BaseService
    ) {
        this.listenerNumberResult()
        this.listenTriggerFromDialog()
        this.check_discount_tax_service()
    }

    listenerNumberResult() {
        this.baseService.numberResult$.subscribe(res => {
            this.checkout.cash = res
            // console.log(this.checkout);
        })
    }

    listenTriggerFromDialog() {
        this.baseService.triggerFn$.subscribe(res => {
            if (_.isEqual(res, 'trigger')) {
                this.check_discount_tax_service()
            }
        })
    }

    get tempSalesForCheckout() {
        this.tempSalesService.getTempSalesById(this.paymentId).subscribe(res => {
            // console.log(res);
            this.lines = (res.data as TempSales).items
            this.firstTempSalesToCheckout = res.data
            // console.log(this.checkout);
        })
        return
    }

    set firstTempSalesToCheckout(temp: TempSales) {
        this.checkout.tempSalesId = temp.id
        this.checkout.name = temp.name
        this.checkout.tableIds = temp.tableIds
        console.log(temp.tableIds);

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
    }

    check_discount_tax_service() {
        this.disc = !_.isNull(localStorage.getItem('DISCOUNT')) ? JSON.parse(localStorage.getItem('DISCOUNT')!) : {}
        this.fee = !_.isNull(localStorage.getItem('FEE')) ? JSON.parse(localStorage.getItem('FEE')!) : {}
        this.tax = !_.isNull(localStorage.getItem('TAX')) ? JSON.parse(localStorage.getItem('TAX')!) : {}

        // SET DISCOUNT
        if (Object.keys(this.disc).length > 0) {
            // CHECK PERCENT OR RUPIAH
            // console.log((this.disc as Discount).type);

            if ((this.disc as Discount).type === 'PERCENT') {
                // console.log('in percent');
                this.checkout.discount = ((this.disc as Discount).value / 100) * this.checkout.subTotal
            } else {
                this.checkout.discount = (this.disc as Discount).value
            }
        } else {
            this.checkout.discount = 0
        }

        // console.log('after disc => ', this.checkout);


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
        let main_calculate = ((((this.checkout.subTotal - this.checkout.deposit) - this.checkout.discount) + this.checkout.service) + this.checkout.tax) - this.checkout.deposit
        if (this.checkout.adminFee > 0) { this.checkout.total = main_calculate + (main_calculate * (this.checkout.adminFee / 100)) }
        else { this.checkout.total = main_calculate }
    }

    public calculateChange() {
        // this.checkout.change = ((this.checkout.total - this.checkout.cash) < 0) ? 0 : (this.checkout.total - this.checkout.cash)
        this.checkout.change = (this.checkout.total - this.checkout.cash)
    }

    public clear_customer() {
        this.in_customer = undefined
        this.checkout.customerId = null
        this.checkout.customerName = null
    }

    update_deposit(item: Reservation) {
        this.reservation = item
        this.checkout.deposit = this.reservation.dpAmount
        this.calculateTotal()
    }

    clear_reservation() {
        this.reservation = undefined
        this.checkout.deposit = 0
        this.calculateTotal()
    }


    // private recalculate() {
    //     this.itemCount = 0;
    //     this.cartPrice = 0;
    //     this.lines.forEach((l, i) => {
    //         this.itemCount += l.amount;
    //         this.cartPrice += l.unitPrice;
    //         this.lines[i].totalPrice = l.unitPrice * this.lines[i].amount
    //     })
    // }

    updatePaymentId(usePayment: PaymentMehod | null) {
        this.checkout.paymentTypeId = usePayment ? usePayment.id : null
    }


    public checkoutTest() {
        console.log(this.checkout);
    }

    validation_checkout() {
        let val: any[] = [
            (this.checkout.total < 0),
        ]

        let cash: any[] = [
            (this.checkout.cash < 0),
        ]

        var general = (val.indexOf(true) > -1);
        var general = (val.indexOf(true) > -1);
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



}