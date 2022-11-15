import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { Additional } from '../_model/additional/additional.model';
import { AdditionalRepository } from '../_model/additional/additional.repository';
import { BaseService } from "../_service/base.service";

@Component({
    selector: 'additional-app',
    template: `
         <mat-nav-list>
            <ng-container *ngIf="filterdata.length > 0; else isEmpty">
                <a  mat-list-item (click)="chooseAdditional(item)"  *ngFor="let item of filterdata">
                    <span *ngIf="item.type === 'TAX'" mat-line>{{ item.key }} {{ item.value }}%</span>
                    <span *ngIf="item.type === 'FEE'" mat-line>{{ item.key }} {{ item.value }}</span>
                    <span *ngIf="item.type !== 'FEE' && item.type !== 'TAX'" mat-line>{{ item.key }} {{ item.value }}%</span>
                </a>
            </ng-container>
            <ng-template #isEmpty>
                <a  mat-list-item>
                    <span *ngIf="type == 'TAX'" mat-line>Daftar Pilihan Pajak Kosong</span>
                    <span *ngIf="type == 'FEE'" mat-line>Daftar Pilihan Biaya Pelayanan Kosong</span>
                    <span *ngIf="type !== 'FEE' && type !== 'TAX'" mat-line>Daftar Pilihan Kosong</span>
                </a>
            </ng-template>
        </mat-nav-list>
    `
})

export class AdditionalComponent implements OnInit {
    type = ''
    constructor(
        private _bottomSheetRef: MatBottomSheetRef<AdditionalComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: string,
        private _baseservice: BaseService,
        public _additionalRepo: AdditionalRepository
    ) {
        this.type = data
    }

    openLink(event: MouseEvent): void {
        this._bottomSheetRef.dismiss();
        event.preventDefault();
    }

    ngOnInit() { }

    get filterdata() {
        return this._additionalRepo.additional.filter(x => x.type == this.type)
    }

    chooseAdditional(addt: Additional) {
        localStorage.setItem(addt.type, JSON.stringify(addt))
        this._baseservice.setTrigger()
        this._bottomSheetRef.dismiss();
    }
}