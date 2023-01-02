import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface InputDialog {
    title: string;
    icon: string;
    message: string;
    confirm: string;
}


@Component({
    selector: 'stop-shift',
    template: `
        <button class="close" mat-button (click)="onConfirm(false)">
         <mat-icon svgIcon="x"></mat-icon>
        </button>
        <h1 mat-dialog-title class="text-center text-title">{{ data.title }}</h1>
        <div mat-dialog-content>
            <p class="text-center">{{ data.message }}</p>
            <div class="container">
                <mat-icon class="illustration-dialog" svgIcon="{{ data.icon }}"></mat-icon>
            </div>
            <div class="d-flex align-items-center search-input px-2">
                <input currencyMask [options]="{ prefix: 'Rp ', thousands: '.', decimal: ',',  precision: 0 }"  placeholder="Masukan kas aktual anda" class="col" type="text" [(ngModel)]="input_cash_actual" mat-input>
                <mat-icon (click)="remove()" class="col-2 mx-3 cursor-pointer" svgIcon="remove"></mat-icon>
            </div>
        </div>
        <div mat-dialog-actions align="center">
        <button mat-button class="btn-cancel" (click)="onConfirm(false)">Batal</button>
        <button [disabled]="input_cash_actual == 0" mat-button class="btn-confirm" (click)="onConfirm(true)">{{ data.confirm }}</button>
        </div>
    `,
    styles: [
        'input {display: flex; flex-direction: row; align-items: center; width: 100%; height: 40px; background: transparent; border: none;}',
        'input:focus-visible { outline: none;}',
        '.text-title {font-style: normal;font-weight: 800;font-size: 24px;line-height: 33px;color: #1E1E1E; margin-bottom: 0px;}'
    ]
})

export class StopShiftComponent implements OnInit {
    public input_cash_actual: number = 0;
    constructor(public dialogRef: MatDialogRef<StopShiftComponent>,
        @Inject(MAT_DIALOG_DATA) public data: InputDialog) { }

    ngOnInit() { }

    onConfirm(res: boolean) {
        this.dialogRef.close({ response: res, result: this.input_cash_actual })
    }

    remove() {
        this.input_cash_actual = 0
    }
}