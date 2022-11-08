import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface InputDialog {
    title: string;
    icon: string;
    message: string;
    confirm: string;
}

@Component({
    selector: 'verify-dialog',
    template: `
    <button class="close" mat-button (click)="onConfirm(false)">
        <mat-icon>close</mat-icon>
    </button>
    <h1 mat-dialog-title class="text-center">{{ data.title }}</h1>
    <div mat-dialog-content>
        <p class="text-center">{{ data.message }}</p>
        <div class="container">
            <mat-icon class="illustration-dialog" svgIcon="{{ data.icon }}"></mat-icon>
        </div>
        <div class="d-flex align-items-center search-input px-2">
            <input placeholder="Keterangan / Pesan" class="col" type="text" [(ngModel)]="input_message" mat-input>
            <mat-icon (click)="remove()" class="col-2 mx-3 cursor-pointer" svgIcon="remove"></mat-icon>
        </div>
    </div>
    <div mat-dialog-actions align="center">
      <button mat-button class="btn-cancel" (click)="onConfirm(false)">Batal</button>
      <button [disabled]="input_message == ''" mat-button class="btn-confirm" (click)="onConfirm(true)">{{ data.confirm }}</button>
    </div>`,
    styles: [
        'input {display: flex; flex-direction: row; align-items: center; width: 100%; height: 40px; background: transparent; border: none;}',
        'input:focus-visible { outline: none;}'
    ]
})

export class InputDialogComponent implements OnInit {
    public input_message: string = '';
    constructor(public dialogRef: MatDialogRef<InputDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: InputDialog) { }

    ngOnInit() { }

    onConfirm(res: boolean) {
        this.dialogRef.close({ result: res, data: this.input_message })
    }

    remove() {
        this.input_message = ''
    }
}