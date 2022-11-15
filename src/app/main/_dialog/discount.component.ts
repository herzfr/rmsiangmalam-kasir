import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { convertRupiah } from 'src/app/_utility/currency';
import { Discount } from '../_model/discount/discount.model';
import { BaseService } from "../_service/base.service";
import { DiscountRepository } from './../_model/discount/discount.repository'

@Component({
    selector: 'discount-app',
    template: `
        <mat-nav-list>
            <a  mat-list-item (click)="chooseDiscount(item)" *ngFor="let item of _discountRepo.discounts">
                <span mat-line>{{ item.name }}</span>
                <span mat-line>{{ getDescDiscount(item.type, item.value) }}</span>
            </a>
        </mat-nav-list>
    `
})

export class DiscountComponent implements OnInit {
    constructor(
        private _bottomSheetRef: MatBottomSheetRef<DiscountComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: number,
        private _baseservice: BaseService,
        public _discountRepo: DiscountRepository
    ) { }

    openLink(event: MouseEvent): void {
        this._bottomSheetRef.dismiss();
        event.preventDefault();
    }

    ngOnInit() { }

    getDescDiscount(type: string, value: number) {
        switch (type) {
            case 'PERCENT':
                return value + '%'
            case 'RUPIAH':
                return convertRupiah(value)
            default:
                return;
        }
    }

    chooseDiscount(disc: Discount) {
        localStorage.setItem('DISCOUNT', JSON.stringify(disc))
        this._baseservice.setTrigger()
        this._bottomSheetRef.dismiss();
    }
}