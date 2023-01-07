import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IOpt, OptTempSales } from 'src/app/main/_const/options';
import { ShiftRepository } from 'src/app/main/_model/shift/shift.repository';
import { generateArray } from 'src/app/_utility/arraygenerator';
import { TimeUtil } from 'src/app/_utility/time.util';
import { CartLine, ItemCart } from '../../../order/_model/_cart/cart.model';
import { TablesRepository } from '../../../tables/_model/tables.repository';
import { ItemTempSales, TempSales } from '../../_model/tempsales.model';
import { TempSalesRepository } from '../../_model/tempsales.repository';

import * as _moment from 'moment';
import { Moment } from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
const moment = _moment;

export const MY_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'D/M/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'list-order-app',
    templateUrl: 'list-order.component.html',
    styleUrls: ['list-order.component.css'],
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

export class ListOrderComponent implements OnInit {
    type = 'salesId';
    searchTable!: number;
    optionType: IOpt[] = OptTempSales

    rangeDate = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });
    today: Date = new Date()

    // EMIT
    // @Output() filterSearch = new EventEmitter<Event>();
    constructor(
        public tableRepo: TablesRepository,
        public tempRepo: TempSalesRepository,
        public shiftRepo: ShiftRepository,
        public timeUtil: TimeUtil,
        public router: Router,
        public cdr: ChangeDetectorRef
    ) {

        tempRepo.findTempSales.startDate = this.timeUtil.convertDateTimeLocale(this.date_in).setHours(0, 0, 0, 0)
        tempRepo.findTempSales.endDate = this.timeUtil.convertDateTimeLocale(this.date_in).setHours(23, 59, 59, 999)

        this.rangeDate = new FormGroup({
            start: new FormControl<Date | null>(new Date(tempRepo.findTempSales.startDate)),
            end: new FormControl<Date | null>(new Date(tempRepo.findTempSales.endDate)),
        });
    }

    ngOnInit() { }

    getActive(id: number) {
        return (this.tempRepo.tempSalesActive?.id === id)
    }

    get date_in() {
        let date = new Date();
        date.setDate(this.today.getDate()) - 1;
        return date
    }


    get startFormDate(): Date {
        return this.rangeDate.get('start')?.value ?? new Date()
    }

    get endFormDate(): Date {
        return this.rangeDate.get('end')?.value ?? new Date()
    }

    get firstTime() {
        return this.timeUtil.getJustTimeLocal(this.startFormDate)
    }

    get lastTime() {
        return this.timeUtil.getJustTimeLocal(this.endFormDate)
    }


    findByDate() {
        this.tempRepo.setStartDate = this.timeUtil.convertDateTimeLocale(this.startFormDate)
        this.tempRepo.setEndDate = this.timeUtil.convertDateTimeLocale(this.endFormDate)
        this.tempRepo.getTempSales()
    }

    applyFilter(e: Event) {
        const filterValue = (e.target as HTMLInputElement).value;
        this.tempRepo.findTempSales.search = filterValue.trim().toLowerCase();
    }


    startTime(e: any) {
        this.tempRepo.findTempSales.startDate = this.timeUtil.setTimeInDateLocal((e.value as string), this.startFormDate)
        this.tempRepo.findTempSales.option = this.type
        this.tempRepo.getTempSales()
    }

    endTime(e: any) {
        // console.log(e.value);
        this.tempRepo.findTempSales.endDate = this.timeUtil.setTimeInDateLocal((e.value as string), this.endFormDate)
        this.tempRepo.findTempSales.option = this.type
        this.tempRepo.getTempSales()
    }

    selectTableFindTempSales() {
        this.tempRepo.findTempSales.search = [this.searchTable].toString();
        this.tempRepo.findTempSales.option = this.type;
        this.tempRepo.getTempSales()
    }

    clear() {
        this.tempRepo.findTempSales.search = ''
    }

    generateArray(id: number) {
        return generateArray(id)
    }

    getTable(id: number) {
        return this.tableRepo.findTable(id)?.name
    }

    merge(resp: any) {
        this.tempRepo.setMergeBill(resp.id, resp.waiter)
    }

    inmerge(event: any) {
        this.tempRepo.checkList = event
    }

    seeOrder() {

    }

    goToSplitPage(id: number) {
        this.router.navigate(['/cashier/split'], { queryParams: { id: id } })
    }
}