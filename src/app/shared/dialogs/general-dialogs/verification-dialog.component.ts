import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface VerifyDialog {
    title: string;
    icon: string;
    message: string;
    confirm: string;
}

@Component({
    selector: 'verify-dialog',
    template: `
    <button class="close" mat-button (click)="onConfirm(false)">
        <mat-icon svgIcon="remove"></mat-icon>
    </button>
    <h1 mat-dialog-title class="text-center">{{ data.title }}</h1>
    <div mat-dialog-content>
        <p class="text-center">{{ data.message }}</p>
        <div class="container">
            <mat-icon class="illustration-dialog" svgIcon="{{ data.icon }}"></mat-icon>
        </div>
    </div>
    <div mat-dialog-actions align="center">
      <button mat-button class="btn-cancel" (click)="onConfirm(false)">Batal</button>
      <button mat-button class="btn-confirm" (click)="onConfirm(true)">{{ data.confirm }}</button>
    </div>`
})

export class VerifyDialogComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<VerifyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: VerifyDialog) { }

    ngOnInit() { }

    onConfirm(res: boolean) {
        this.dialogRef.close(res)
    }
}