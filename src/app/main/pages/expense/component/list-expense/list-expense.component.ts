import { Component, OnInit } from '@angular/core';
import { ExpenseRepository } from '../../_model/expense.repository';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { IOpt, IOpt2, OptStatusFinance, OptStatusPayment } from 'src/app/main/_const/options';
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
    selector: 'list-expense',
    templateUrl: 'list-expense.component.html',
    styleUrls: ['list-expense.component.css', '../../expense.component.css'],
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

export class ListExpenseComponent implements OnInit {
    optionType: IOpt[] = OptStatusFinance
    optionPayment: IOpt2[] = OptStatusPayment

    today: Date = new Date()
    constructor(public exRepo: ExpenseRepository) { }

    ngOnInit() { }

    get day() {
        return this.today.getMilliseconds()
    }

    clear() {
        this.exRepo.filter.search = ''
    }

    applyFilter(e: Event) {
        const filterValue = (e.target as HTMLInputElement).value;
        this.exRepo.filter.search = filterValue.trim().toLowerCase();
    }

    checkType(type: string) {
        return this.optionType.find(x => x.value == type)?.key
    }

    class_status(status: string) {
        return this.optionPayment.find(x => x.value == status)?.style
    }

    status_payment(status: string) {
        return this.optionPayment.find(x => x.value == status)?.key
    }
}