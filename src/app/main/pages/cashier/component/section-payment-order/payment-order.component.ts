import { Location } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { ThemePalette } from '@angular/material/core';
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
import { CheckoutRepository } from '../../_model/checkout/chekcout.repository';
import { CashComponent } from './method-payment/cash.component';

@Component({
    selector: 'payment-app',
    templateUrl: 'payment-order.component.html',
    styleUrls: ['payment-order.component.css']
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
        public router: Router,
        public location: Location,
        private _bottomSheet: MatBottomSheet
    ) {
        setTimeout(() => console.log(paymentRepo.dataPayment), 1000)

        activeRoute.queryParamMap.subscribe(res => {
            console.log(res.get('id'));
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
        this.tabGroup!.selectedIndex = 2
        this.tabIndex = this.tabGroup?.selectedIndex
    }

    ngOnInit() { }

    get checkobjtax() {
        return Object.keys(this.checkoutRepo.tax).length > 0
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
        switch (this.tabIndex) {
            case 0:
                this.checkoutRepo.checkout.paymentMethod = this._method_payment.at(0)?.paymentMethod
                this.checkoutRepo.checkout.status = this._method_payment.at(0)?.status
                break;
            case 1:
                this.checkoutRepo.checkout.paymentMethod = this._method_payment.at(1)?.paymentMethod
                this.checkoutRepo.checkout.status = this._method_payment.at(1)?.status
                break;
            case 2:
                this.checkoutRepo.checkout.paymentMethod = this._method_payment.at(1)?.paymentMethod
                this.checkoutRepo.checkout.status = this._method_payment.at(1)?.status
                break;
            case 3:
                this.checkoutRepo.checkout.paymentMethod = this._method_payment.at(3)?.paymentMethod
                this.checkoutRepo.checkout.status = this._method_payment.at(3)?.status
                break;
            case 4:
                this.checkoutRepo.checkout.paymentMethod = this._method_payment.at(2)?.paymentMethod
                this.checkoutRepo.checkout.status = this._method_payment.at(2)?.status
                break;

        }
    }

    public toggleIsTax(event: MatSlideToggleChange) {
        this.checkoutRepo.checkout.isTax = event.checked;
    }

    clear() {
        switch (this.tabIndex) {
            case 0:
                this.checkoutRepo.clear_cash()
                this.cashcomponent?.checkCash()
                this.checkoutRepo.check_discount_tax_service()
                break;
        }
        // this.checkoutRepo.clear_cash()
    }

    checkout() {
        this.checkoutRepo.checkoutTest()
    }

}