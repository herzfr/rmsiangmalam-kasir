import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { ShiftRepository } from '../../_model/shift/shift.repository';
import { ReportRepository } from './_model/report.repository';

import { Moment } from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { IOpt, IOpt2, OptReport, OptStatusFinance, OptStatusPayment } from 'src/app/main/_const/options';
import * as _moment from 'moment';
import { PaymentRepository } from '../../_model/payment/payment.repository';
import { CustomerRepository } from '../../_model/customer/customer.repository';
import { ReportSales } from './_model/report.model';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';
// tslint:disable-next-line:no-duplicate-imports
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
    selector: 'report-app',
    templateUrl: 'report.component.html',
    styleUrls: ['report.component.css'],
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

export class ReportComponent implements OnInit {
    today: Date = new Date()
    optionType: IOpt[] = OptReport

    report_detail?: ReportSales;
    constructor(public location: Location, public reportRepo: ReportRepository, private shiftRepo: ShiftRepository,
        private paymRepo: PaymentRepository, private custRepo: CustomerRepository, private _dlg: DialogService) { }

    ngOnInit() { }


    get day() {
        return this.today.getMilliseconds()
    }

    clear() {
        this.reportRepo.filter.search = ''
    }

    applyFilter(e: Event) {
        const filterValue = (e.target as HTMLInputElement).value;
        this.reportRepo.filter.search = filterValue.trim().toLowerCase();
    }

    toggle(event: MatRadioChange) {
        this.reportRepo.filter.status = event.value
        if (this.reportRepo.filter.status == 'PAID') {
            this.reportRepo.filter.branchId = this.shiftRepo.onBranch
            this.reportRepo.filter.subBranchId = this.shiftRepo.onSubBranch
        }
        this.reportRepo.fetch_report()
    }


    getPayment(id?: number, method?: string, customerId?: number) {
        let payment = this.paymRepo.getPaymentTypeById(id)
        let cstmr = this.custRepo.customer.find(x => x.id == (customerId ?? 0))?.name

        switch (method) {
            case 'CASH':
                return 'Tunai'
            case 'CUST_DEBT':
                if (cstmr) {
                    return 'INVOICE ' + cstmr
                }
                return 'Invoice'
            case 'EMPL_DEBT':
                return 'Kasbon Karyawan'
            case 'CUSTOM':
                return payment

        }
        return payment
    }


    getPaymentIcon(id?: number, method?: string, customerId?: number) {
        let payment = this.paymRepo.getPaymentTypeByIdObj(id)
        let cstmr = this.custRepo.customer.find(x => x.id == (customerId ?? 0))?.name
        // console.log(payment);

        switch (method) {
            case 'CASH':
                return 'coin'
            case 'CUST_DEBT':
                return 'receipt'
            case 'EMPL_DEBT':
                return 'Kasbon Karyawan'
            case 'CUSTOM':
                if (payment?.type == 'EWALLET') {
                    return 'wallet-cash'
                } else if (payment?.type == 'DEBIT')
                    return 'debit'

        }
        return 'wallet-cash'
    }

    seeDetail(report_detail?: ReportSales) {
        this.report_detail = report_detail
    }

    printView() {
        if (this.report_detail)
            this._dlg.showViewReceipt(this.report_detail)
    }


}