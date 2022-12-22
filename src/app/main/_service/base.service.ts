import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TempSales } from '../pages/cashier/_model/tempsales.model';
import { CartLine } from '../pages/order/_model/_cart/cart.model';

@Injectable({ providedIn: 'root' })
export class BaseService {

    temp_sales = new Subject<CartLine>();
    send_number_result = new Subject<number>();
    send_number_result_general = new Subject<number>();
    send_number_result_income = new Subject<number>();
    send_number_result_expense = new Subject<number>();
    send_number_result_cash_employee = new Subject<number>();

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

    set number_result_general(result: number) {
        this.send_number_result_general.next(result)
    }

    set number_result_income(result: number) {
        this.send_number_result_income.next(result)
    }

    set number_result_expense(result: number) {
        this.send_number_result_expense.next(result)
    }

    set number_result_cash_empl(result: number) {
        this.send_number_result_cash_employee.next(result)
    }

    get tempSale$() {
        return this.temp_sales.asObservable()
    }

    get numberResult$() {
        return this.send_number_result.asObservable()
    }

    get numberResultGeneral$() {
        return this.send_number_result_general.asObservable()
    }

    get numberResultIncome$() {
        return this.send_number_result_income.asObservable()
    }

    get numberResultExpense$() {
        return this.send_number_result_expense.asObservable()
    }

    get numberResultEmplCash$() {
        return this.send_number_result_cash_employee.asObservable()
    }

    get triggerFn$() {
        return this.trigger_function.asObservable()
    }
}