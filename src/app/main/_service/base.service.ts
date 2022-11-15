import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TempSales } from '../pages/cashier/_model/tempsales.model';
import { CartLine } from '../pages/order/_model/_cart/cart.model';

@Injectable({ providedIn: 'root' })
export class BaseService {

    temp_sales = new Subject<CartLine>();
    send_number_result = new Subject<number>();
    trigger_function = new Subject<any>();

    constructor() { }

    setTempSales(tempsales: CartLine) {
        this.temp_sales.next(tempsales)
    }

    setTrigger() {
        this.trigger_function.next('trigger')
    }

    set number_result(result: number) {
        this.send_number_result.next(result)
    }

    get tempSale$() {
        return this.temp_sales.asObservable()
    }

    get numberResult$() {
        return this.send_number_result.asObservable()
    }

    get triggerFn$() {
        return this.trigger_function.asObservable()
    }
}