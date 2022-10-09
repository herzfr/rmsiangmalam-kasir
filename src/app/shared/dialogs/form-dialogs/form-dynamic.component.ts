import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface FormDialog {
    title: string;
    subtitle: string | undefined;
    fields: any[];
}

@Component({
    selector: 'form-dialog',
    template: `
    <button class="close" mat-button (click)="onNoClick()">
        <mat-icon>close</mat-icon>
    </button>
    <h1 mat-dialog-title class="text-center">{{ data.title }}</h1>
    <div mat-dialog-content>
        <p class="text-center font-weight-bold">{{ data.subtitle }}</p>
        <div class="container">
            <form-apps (onSubmit)="onSubmitData($event)" [submitName]="'Masuk Shift'" [fields]="fields"></form-apps>
        </div>
    </div>
    <div mat-dialog-actions align="center">
      <button mat-button mat-dialog-close>Close</button>
    </div>
    `
})

export class FormDialogComponent implements OnInit {
    private form?: FormGroup;
    public fields: any[] = [];
    constructor(public dialogRef: MatDialogRef<FormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: FormDialog) {
        this.fields = data.fields
    }

    ngOnInit() { }

    onNoClick() {
        this.dialogRef.close()
    }

    onSubmitData(data: any) {
        console.log(data);
        this.dialogRef.close(data)
    }
}