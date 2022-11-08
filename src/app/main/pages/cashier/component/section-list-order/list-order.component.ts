import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IOpt, OptTempSales } from 'src/app/main/_const/options';
import { ShiftRepository } from 'src/app/main/_model/shift/shift.repository';
import { generateArray } from 'src/app/_utility/arraygenerator';
import { TimeUtil } from 'src/app/_utility/time.util';
import { CartLine, ItemCart } from '../../../order/_model/_cart/cart.model';
import { TablesRepository } from '../../../tables/_model/tables.repository';
import { ItemTempSales, TempSales } from '../../_model/tempsales.model';
import { TempSalesRepository } from '../../_model/tempsales.repository';

@Component({
    selector: 'list-order-app',
    templateUrl: 'list-order.component.html',
    styleUrls: ['list-order.component.css'],
})

export class ListOrderComponent implements OnInit {
    type = 'salesId';
    searchTable!: number;
    optionType: IOpt[] = OptTempSales

    rangeDate = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });

    // EMIT
    // @Output() filterSearch = new EventEmitter<Event>();
    constructor(
        public tableRepo: TablesRepository,
        public tempRepo: TempSalesRepository,
        public shiftRepo: ShiftRepository,
        public timeUtil: TimeUtil,
        public cdr: ChangeDetectorRef
    ) {
        this.rangeDate = new FormGroup({
            start: new FormControl<Date | null>(new Date(tempRepo.findTempSales.startDate)),
            end: new FormControl<Date | null>(new Date(tempRepo.findTempSales.endDate)),
        });
    }

    ngOnInit() { }

    getActive(id: number) {
        return (this.tempRepo.tempSalesActive?.id === id)
    }

    get startFormDate(): Date {
        return this.rangeDate.get('start')?.value ?? new Date()
    }

    get endFormDate(): Date {
        return this.rangeDate.get('end')?.value ?? new Date()
    }

    get firstTime() {
        return this.timeUtil.getJustTime(this.startFormDate.getTime())
    }

    get lastTime() {
        return this.timeUtil.getJustTime(new Date().getMilliseconds())
    }


    findByDate() {
        this.tempRepo.setStartDate = this.startFormDate
        this.tempRepo.setEndDate = this.endFormDate
        this.tempRepo.getTempSales()
    }

    applyFilter(e: Event) {
        const filterValue = (e.target as HTMLInputElement).value;
        this.tempRepo.findTempSales.search = filterValue.trim().toLowerCase();
    }


    startTime(e: any) {
        this.tempRepo.findTempSales.startDate = this.timeUtil.setTimeInDate((e.value as string), this.startFormDate)
        this.tempRepo.findTempSales.option = this.type
        this.tempRepo.getTempSales()
    }

    endTime(e: any) {
        console.log(e.value);
        this.tempRepo.findTempSales.endDate = this.timeUtil.setTimeInDate((e.value as string), this.endFormDate)
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

    // async updateBill(tmp_sales: TempSales) {
    //     let item_cart: ItemCart[] = await this.validationUpdatePackageOrProduct(tmp_sales.items)
    //     await this.tempRepo.updateBill(this.validationCartLine(tmp_sales, item_cart))
    // }

    // validationCartLine(tmp_sales: any, item: ItemCart[]) {
    //     let cart: CartLine = (tmp_sales as CartLine)
    //     cart.items = item
    //     return cart
    // }

    // validationUpdatePackageOrProduct(tempItem: ItemTempSales[]) {
    //     let items: ItemCart[] = []
    //     tempItem.forEach((x) => {
    //         console.log('hasil temp sales');
    //         console.log(x);
    //         console.log('hasil temp sales');

    //         let ic: ItemCart = new ItemCart(
    //             x.id,
    //             x.menuId,
    //             x.name,
    //             x.amount,
    //             x.unit,
    //             x.unitPrice,
    //             x.totalPrice,
    //             x.isPackage,
    //             x.isPackage ? null : (JSON.parse(x.stockId) as number[])[0], // STOCK ID
    //             x.pic,
    //             x.priceCatId,
    //             x.priceCat,
    //             x.isPackage ? (JSON.parse(x.stockId) as number[]) : [] // STOCKIDS
    //         );
    //         console.log(ic);

    //         items.push(ic)
    //     })
    //     return items;
    // }

    seeOrder() {

    }
}