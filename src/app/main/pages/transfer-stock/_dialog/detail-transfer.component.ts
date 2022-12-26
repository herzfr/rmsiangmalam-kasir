import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface ProductStatusTransfer {
    id: number
    productId: number
    name: string
    quantity: number
}

@Component({
    selector: 'detail-transfer',
    template: `
        <h2  class="title font-roboto font-bold py-4">Detail Produk</h2>
        <button class="close" mat-button (click)="onNoClick()">
            <mat-icon svgIcon="x"></mat-icon>
        </button>
        <hr class="line-separate">
        <div  class="text-center mt-2 d-flex justify-content-center">
        <div mat-dialog-content class="w-100 p-0">
            <ng-container *ngFor="let item of prodlist">
                <div class="grid grid-flow-row-dense grid-cols-1 grid-rows-1 mb-2">
                    <p class="grid-title">{{ item.name }}</p>
                    <p class="grid-description">Stok: {{ item.quantity }}</p>
                </div>
            </ng-container>
        </div>
        </div>
    `,
    styleUrls: ['style-dialog-transfer.component.css']
})

export class DetailTransferComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<DetailTransferComponent>,
        @Inject(MAT_DIALOG_DATA) public prodlist: ProductStatusTransfer[]) { }

    ngOnInit() { }


    onNoClick() {
        this.dialogRef.close()
    }
}