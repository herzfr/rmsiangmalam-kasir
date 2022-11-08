import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TempSales } from '../pages/cashier/_model/tempsales.model';
import { CartLine } from '../pages/order/_model/_cart/cart.model';

@Injectable({ providedIn: 'root' })
export class BaseService {

    temp_sales = new Subject<CartLine>();

    constructor() { }

    setTempSales(tempsales: CartLine) {
        this.temp_sales.next(tempsales)
    }

    get tempSale$() {
        return this.temp_sales.asObservable()
    }
}