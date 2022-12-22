import { Component, OnInit } from '@angular/core';
import { IOpt, OptStatusFinance, OptStatusFinanceForm, OptStatusPayment, OptStatusPaymentForm } from 'src/app/main/_const/options';
import { ExpenseRepository } from '../../_model/expense.repository';

@Component({
    selector: 'operational-credit',
    templateUrl: 'operational-credit.component.html',
    styleUrls: ['operational-credit.component.css', '../../expense.component.css']
})

export class OperationalCreditComponent implements OnInit {
    optionType: IOpt[] = OptStatusFinanceForm
    optionPayment: IOpt[] = OptStatusPaymentForm
    constructor(public exRepo: ExpenseRepository) { }

    ngOnInit() { }


    inputDepositChange(e: any) {
        this.exRepo.create.cost = e
    }

}