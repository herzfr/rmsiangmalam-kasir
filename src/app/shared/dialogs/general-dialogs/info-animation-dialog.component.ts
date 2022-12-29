import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnimationOptions } from 'ngx-lottie';


export interface InfoAnimatedDialog {
    title: string;
    type: 'success' | 'warning' | 'error';
    message: string;
}

@Component({
    selector: 'info-animation-dialog',
    template: `
    <button class="close" mat-button (click)="onNoClick()">
        <mat-icon svgIcon="x"></mat-icon>
    </button>
    <div mat-dialog-content>
        <p class="text-center text-title">{{ data.title }}</p>
        <p *ngIf="data.message !== undefined" class="text-center">{{ data.message }}</p>
        <div class="container illustration-dialog">
            <main class="w-70" *ngIf="data.type == 'success'" lottie [options]="success"></main>
            <main class="w-70 error" *ngIf="data.type == 'error'" lottie [options]="error"></main>
            <main class="w-70" *ngIf="data.type == 'warning'" lottie [options]="warning"></main>
        </div>
    </div>
    <div mat-dialog-actions align="center">
      <button class="btn-ok" mat-button mat-dialog-close>Ok</button>
    </div>`,
    styles: [
        '.text-title { font-style: normal; font-weight: 800; font-size: 24px; line-height: 33px; color: #1E1E1E; margin-bottom: 0px }',
        '.illustration-dialog { width: 100px }',
        '.message { font-style: normal; font-weight: 400; font-size: 16px; line-height: 22px; }',
        '.btn-ok {min-width: 120px; background: #045b62; color: #FFF;}',
        '.w-70 {width: 330px}',
        '.error {display: flex; align-items: center; justify-content: center; width: 100%; height: 250px;}',
    ]
})

export class InfoAnimatedDialogComponent implements OnInit {
    success: AnimationOptions = { path: 'assets/lottie/success.json' };
    error: AnimationOptions = { path: 'assets/lottie/error.json' };
    warning: AnimationOptions = { path: 'assets/lottie/warning.json' };

    list_animation: any[] = [
        { key: 'success', path: 'assets/lottie/success.json' },
        { key: 'error', path: 'assets/lottie/error.json' },
        { key: 'warning', path: 'assets/lottie/warning.json' },
    ]

    constructor(public dialogRef: MatDialogRef<InfoAnimatedDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: InfoAnimatedDialog) {
        console.log(data.type);

    }

    ngOnInit() {
        // setTimeout(() => {
        //     this.onNoClick()
        // })
    }

    // get option() {
    //     switch (this.data.type) {
    //         case 'success':
    //             return { path: 'assets/lottie/success.json' } as AnimationOptions
    //         case 'error':
    //             return { path: 'assets/lottie/error.json' } as AnimationOptions
    //         default:
    //             return { path: 'assets/lottie/warning.json' } as AnimationOptions
    //     }
    // }


    onNoClick() {
        this.dialogRef.close()
    }
}