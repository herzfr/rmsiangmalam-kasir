import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ExpenseRepository } from './_model/expense.repository';


@Component({
    selector: 'expense-app',
    templateUrl: 'expense.component.html',
    styleUrls: ['expense.component.css'],
})

export class ExpenseComponent implements OnInit {
    tab = 0
    constructor(public location: Location, public exRepo: ExpenseRepository) { }

    ngOnInit() { }
}