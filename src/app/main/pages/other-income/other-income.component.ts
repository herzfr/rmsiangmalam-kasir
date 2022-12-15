import { Component, OnInit } from '@angular/core';
import { OtherIncomeRepository } from './_model/other-income.repository';

@Component({
    selector: 'other-income',
    templateUrl: 'other-income.component.html',
    styleUrls: ['other-income.component.css']
})

export class OtherIncomeComponent implements OnInit {
    constructor(public oIncomeRepo: OtherIncomeRepository) { }

    ngOnInit() { }
}