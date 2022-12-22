import { Component, OnInit } from '@angular/core';
import { ExpenseRepository } from '../../_model/expense.repository';

@Component({
    selector: 'employee-credit',
    templateUrl: 'employee-credit.component.html',
    styleUrls: ['employee-credit.component.css', '../../expense.component.css']
})

export class EmployeeCreditComponent implements OnInit {
    constructor(public exRepo: ExpenseRepository) { }

    ngOnInit() { }
}