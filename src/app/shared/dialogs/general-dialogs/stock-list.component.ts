import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductPackage } from 'src/app/main/pages/order/_model/menu.model';

@Component({
    selector: 'stock-list',
    template: `
        <button class="close" mat-button (click)="onNoClick()">
        <mat-icon svgIcon="remove"></mat-icon>
        </button>
        <h1 mat-dialog-title class="text-center">Stok Tersisa</h1>
        <div mat-dialog-content>
            <p class="text-center font-weight-bold">Daftar Stok</p>
            <!-- <p *ngIf="data.message !== undefined" class="text-center">{{ data.message }}</p> -->
            <div class="container">
            <ul class="list-group list-group-flush scroll-list">
                <li class="list-group-item d-flex justify-content-between align-items-start text-start" *ngFor="let item of products">{{ item.name }}
                    <span  [ngClass]="{'on-text-danger': item.quantity === 0, 'on-text-warning' : item.quantity > 0 && item.quantity < 10, 'on-text-success' : item.quantity > 10 }">{{ item.quantity }}</span>
                </li>
            </ul>
            </div>
        </div>
        <div mat-dialog-actions align="center">
        <button mat-button mat-dialog-close>Tutup</button>
        </div>
    `
})

export class StockListComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<StockListComponent>,
        @Inject(MAT_DIALOG_DATA) public products: ProductPackage[]) { }

    ngOnInit() { }

    onNoClick() {
        this.dialogRef.close()
    }
}