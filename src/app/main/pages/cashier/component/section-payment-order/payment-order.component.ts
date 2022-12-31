import { Location } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { AdditionalComponent } from 'src/app/main/_dialog/additional.component';
import { CustomerListComponent } from 'src/app/main/_dialog/customerlist.component';
import { DiscountComponent } from 'src/app/main/_dialog/discount.component';
import { AdditionalRepository } from 'src/app/main/_model/additional/additional.repository';
import { Customer } from 'src/app/main/_model/customer/customer.model';
import { DiscountRepository } from 'src/app/main/_model/discount/discount.repository';
import { PaymentRepository } from 'src/app/main/_model/payment/payment.repository';
import { UserRepository } from 'src/app/main/_model/users/user.repository';
import { BaseService } from 'src/app/main/_service/base.service';
import { CardReservation } from '../../../reservation/component/card-reservation.component';
import { ReservationComponent } from '../../../reservation/reservation.component';
import { DoialogReservationComponent } from '../../_dialog/reservation/dialog-reservation.component';
import { CheckoutRepository } from '../../_model/checkout/chekcout.repository';
import { CashComponent } from './method-payment/cash.component';

@Component({
    selector: 'payment-app',
    templateUrl: 'payment-order.component.html',
    styleUrls: ['payment-order.component.css', './../section-split-order/split.component.css']
})

export class PaymentComponent implements OnInit {
    color: ThemePalette = 'accent';
    checked = false;
    disabled = false;

    _method_payment: any[] = [
        {
            paymentMethod: 'CASH',
            status: 'PAID',
        },
        {
            paymentMethod: 'CUSTOM',
            status: 'PAID',
        },
        {
            paymentMethod: 'CUST_DEBT',
            status: 'DEBT',
        },
        {
            paymentMethod: 'EMPL_DEBT',
            status: 'DEBT',
        },
    ]

    tabIndex: number | null | undefined;
    @ViewChild('tabGroup') tabGroup?: MatTabGroup;

    // CHILD COMPONENT
    @ViewChild(CashComponent) cashcomponent?: CashComponent;

    constructor(
        public paymentRepo: PaymentRepository,
        public additionalRepo: AdditionalRepository,
        public discountRepo: DiscountRepository,
        public userRepo: UserRepository,
        public checkoutRepo: CheckoutRepository,
        public activeRoute: ActivatedRoute,
        private baseService: BaseService,
        public router: Router,
        public location: Location,
        private _bottomSheet: MatBottomSheet,
        private _dialog: MatDialog,
    ) {
        // setTimeout(() => console.log(paymentRepo.dataPayment), 1000)

        activeRoute.queryParamMap.subscribe(res => {
            // console.log(res.get('id'));
            if (!_.isNull(res.get('id'))) {
                this.checkoutRepo.paymentId = Number(res.get('id'))
                this.checkoutRepo.tempSalesForCheckout
                // console.log(this.checkoutRepo.paymentId);
            } else {
                this.location.back()
                // this.router.navigate(['/cashier'])
            }

        })

    }

    ngAfterViewInit() {
        // this.tabGroup!.selectedIndex = 3
        this.tabIndex = this.tabGroup?.selectedIndex
    }

    ngOnInit() { }

    get checkobjtax() {
        return Object.keys(this.checkoutRepo.tax).length > 0
    }

    openReservationDeposit() {
        const configBottomDisc: MatDialogConfig = new MatDialogConfig()
        configBottomDisc.data = { from_cashier: true }
        configBottomDisc.backdropClass = 'backdrop-reservation'
        configBottomDisc.panelClass = 'panel-dialog-reservation'
        this._dialog.open(DoialogReservationComponent, configBottomDisc).afterClosed().subscribe(res => {
            if (res) {
                if (res.resp) {
                    this.checkoutRepo.update_deposit(res.result)
                }
            }
        })
    }

    openDiscount() {
        const configBottomDisc: MatBottomSheetConfig = new MatBottomSheetConfig()
        configBottomDisc.backdropClass = 'backdrop-numpad'
        configBottomDisc.panelClass = 'panel-numpad'
        this._bottomSheet.open(DiscountComponent, configBottomDisc);
    }

    openAdditional(is: string) {
        const configBottomAddt: MatBottomSheetConfig = new MatBottomSheetConfig()
        configBottomAddt.data = is
        configBottomAddt.backdropClass = 'backdrop-numpad'
        configBottomAddt.panelClass = 'panel-numpad'
        this._bottomSheet.open(AdditionalComponent, configBottomAddt);
    }

    openCustomer() {
        const configBottomAddt: MatBottomSheetConfig = new MatBottomSheetConfig()
        configBottomAddt.backdropClass = 'backdrop-custom'
        configBottomAddt.panelClass = 'panel-custom'
        this._bottomSheet.open(CustomerListComponent, configBottomAddt)
            .afterDismissed().subscribe((res: Customer) => {
                this.checkoutRepo.in_customer = res
                this.checkoutRepo.checkout.customerId = res.id
                this.checkoutRepo.checkout.customerName = res.name
            })
    }



    tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        // console.log('tabChangeEvent => ', tabChangeEvent);
        // console.log('index => ', tabChangeEvent.index);
        this.tabIndex = tabChangeEvent.index
        // this.checkoutRepo.reBuildPayment()
        this.baseService.number_result = 0
        switch (this.tabIndex) {
            case 0:
                this.checkoutRepo.checkout.paymentMethod = this._method_payment.at(0)?.paymentMethod
                this.checkoutRepo.checkout.status = this._method_payment.at(0)?.status
                this.checkoutRepo.checkout.cash = 0
                this.checkoutRepo.checkout.change = 0
                this.checkoutRepo.checkout.adminFee = 0
                this.checkoutRepo.user = undefined
                break;
            case 1:
                this.checkoutRepo.checkout.paymentMethod = this._method_payment.at(1)?.paymentMethod
                this.checkoutRepo.checkout.status = this._method_payment.at(1)?.status
                this.checkoutRepo.checkout.cash = 0
                this.checkoutRepo.checkout.change = 0
                this.checkoutRepo.user = undefined
                break;
            case 2:
                this.checkoutRepo.checkout.paymentMethod = this._method_payment.at(1)?.paymentMethod
                this.checkoutRepo.checkout.status = this._method_payment.at(1)?.status
                this.checkoutRepo.checkout.cash = 0
                this.checkoutRepo.checkout.change = 0
                this.checkoutRepo.user = undefined
                break;
            case 3:
                this.checkoutRepo.checkout.paymentMethod = this._method_payment.at(3)?.paymentMethod
                this.checkoutRepo.checkout.status = this._method_payment.at(3)?.status
                this.checkoutRepo.checkout.cash = 0
                this.checkoutRepo.checkout.change = 0
                this.checkoutRepo.checkout.adminFee = 0
                this.checkoutRepo.user = undefined
                break;
            case 4:
                this.checkoutRepo.checkout.paymentMethod = this._method_payment.at(2)?.paymentMethod
                this.checkoutRepo.checkout.status = this._method_payment.at(2)?.status
                this.checkoutRepo.checkout.cash = 0
                this.checkoutRepo.checkout.change = 0
                this.checkoutRepo.checkout.adminFee = 0
                this.checkoutRepo.user = undefined
                break;

        }
    }

    public toggleIsTax(event: MatSlideToggleChange) {
        this.checkoutRepo.checkout.isTax = event.checked;
    }

    public toggleIsCharge(event: MatSlideToggleChange) {
        this.checkoutRepo.charge_admin = event.checked;
        this.checkoutRepo.calculateTotal()
    }

    clear() {
        this.checkoutRepo.reBuildPayment()
        this.checkoutRepo.check_discount_tax_service()
        this.baseService.number_result = 0
        // switch (this.tabIndex) {
        //     case 0:
        //         this.checkoutRepo.reBuildPayment()
        //         // this.checkoutRepo.clear_cash()
        //         // this.cashcomponent?.checkCash()
        //         // this.checkoutRepo.check_discount_tax_service()
        //         break;
        // }
        // this.checkoutRepo.clear_cash()
    }

    get change() {
        if (this.checkoutRepo.checkout.cash < 1) {
            return 0
        }
        else return this.checkoutRepo.checkout.change
    }

    checkout() {
        this.checkoutRepo.checkoutTest()
        this.checkoutRepo.isLoading = true
        setTimeout(() => this.checkoutRepo.isLoading = false, 500)
    }

}