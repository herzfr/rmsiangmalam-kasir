import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface InfoDialog {
    title: string;
    icon: string;
    subtitle: string | undefined;
    message: string;
}

@Component({
    selector: 'info-dialog',
    template: `
    <button class="close" mat-button (click)="onNoClick()">
        <mat-icon svgIcon="remove"></mat-icon>
    </button>
    <h1 mat-dialog-title class="text-center">{{ data.title }}</h1>
    <div mat-dialog-content>
        <p class="text-center font-weight-bold">{{ data.subtitle }}</p>
        <p *ngIf="data.message !== undefined" class="text-center">{{ data.message }}</p>
        <div class="container">
            <mat-icon class="illustration-dialog" svgIcon="{{ data.icon }}"></mat-icon>
        </div>
    </div>
    <div mat-dialog-actions align="center">
      <button mat-button mat-dialog-close>Close</button>
    </div>`
})

export class InfoDialogComponent implements OnInit {
    constructor(public dialogRef: MatDialogRef<InfoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: InfoDialog) { }

    ngOnInit() { }

    onNoClick() {
        this.dialogRef.close()
    }
}