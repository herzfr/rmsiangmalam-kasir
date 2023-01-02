import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ShiftRepositoryA } from './_model/shift.repository';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Sale } from './_model/shift.model';
import { PaymentRepository } from '../../_model/payment/payment.repository';
import { CustomerRepository } from '../../_model/customer/customer.repository';
import { ReportService } from '../report/_service/report.service';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';
import { ReportShiftSales } from '../report/_model/report.model';
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
    selector: 'shift-app',
    templateUrl: 'shift.component.html',
    styleUrls: ['shift.component.css'],
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

export class ShiftComponent implements OnInit {
    id_active: number | null = null;
    sales: Sale[] = []
    index_loading?: number;
    loading_shft: boolean = false
    constructor(public _shiftRepoL: ShiftRepositoryA, public location: Location,
        public paymRepo: PaymentRepository, public custRepo: CustomerRepository,
        private report_service: ReportService, private _dlg: DialogService) { }

    ngOnInit() { }

    set_detail(id: number, sale: Sale[]) {

        if (this.id_active != id) {
            this.id_active = id
            this.sales = sale
        } else {
            this.id_active = null
            this.sales = []
        }
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

    print(id: number, idx: number) {
        this.index_loading = idx
        this.loading_shft = true
        this.report_service.getReportByShift(id).subscribe(res => {
            this.index_loading = undefined
            this.loading_shft = false
            let report: ReportShiftSales = res as any
            this._dlg.showViewPrint(report)
        })
    }

}