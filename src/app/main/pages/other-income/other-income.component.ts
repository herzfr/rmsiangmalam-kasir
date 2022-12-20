import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PaymentRepository } from '../../_model/payment/payment.repository';
import { OtherIncomeRepository } from './_model/other-income.repository';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { NumpadComponent } from '../../_dialog/numpad.component';
import { NumberInput } from '@angular/cdk/coercion';

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
@Component({
    selector: 'other-income',
    templateUrl: 'other-income.component.html',
    styleUrls: ['other-income.component.css'],
    providers: [
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})

export class OtherIncomeComponent implements OnInit {
    today: Date = new Date()
    list_status_payment: any[] = [
        { key: 'Batal', style: 'cancel', value: 'CANCEL', },
        { key: 'Pending', style: 'pending', value: 'PENDING' },
        { key: 'Lunas', style: 'paid', value: 'PAID' },
        { key: 'Hutang', style: 'unpaid', value: 'UNPAID' }
    ]
    tabIndex = 0
    @ViewChild(MatTabGroup) tabGroup?: MatTabGroup;
    constructor(
        public oIncomeRepo: OtherIncomeRepository,
        public location: Location,
        private paymentRepo: PaymentRepository,
        private _bottomSheet: MatBottomSheet
    ) { }

    ngOnInit() {
        this.checkTabPosition()
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.tabGroup!.selectedIndex = 0 as NumberInput
            this.tabIndex = this.tabGroup?.selectedIndex ?? 0
        }, 1)
    }

    get day() {
        return this.today.getMilliseconds()
    }

    status_payment(status: string) {
        return this.list_status_payment.find(x => x.value == status).key
    }

    class_status(status: string) {
        return this.list_status_payment.find(x => x.value == status).style
    }

    checkpayment(payment_method?: string, payment_id?: number) {
        // console.log(payment_method);
        if (payment_method === 'CASH') {
            return 'Tunai'
        } else if (payment_method === 'CUSTOM') {
            return this.paymentRepo.dataPayment.find(x => x.id == payment_id)?.name
        } else {
            return ''
        }
    }

    inputDepositChange(e: any) {
        console.log(e);
        this.oIncomeRepo.create_income.amount = e
        this.oIncomeRepo.update_cash()
        this.oIncomeRepo.calculate()
    }

    checkTabPosition() {
        switch (this.tabIndex) {
            case 0:
                this.oIncomeRepo.reset_payment()
                this.oIncomeRepo.create_income.type = 'CASH'
                break;
            default:
                this.oIncomeRepo.reset_payment()
                this.oIncomeRepo.create_income.type = 'CUSTOM'
                break;
        }
    }

    tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.tabIndex = tabChangeEvent.index
        this.checkTabPosition()
    }


    opeenKeybordSheet() {
        // this.isInput = true
        const configBottom: MatBottomSheetConfig = new MatBottomSheetConfig()
        configBottom.data = [this.oIncomeRepo.create_by_cash.cash, 'income']
        configBottom.backdropClass = 'backdrop-numpad'
        configBottom.panelClass = 'panel-numpad'
        this._bottomSheet.open(NumpadComponent, configBottom);
    }

}