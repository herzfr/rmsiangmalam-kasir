import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

export interface WebcamDialog {
    title: string;
    icon: string;
    message: string;
    confirm: string;
}

@Component({
    selector: 'webcam-app',
    template: `
        <button class="close" mat-button (click)="onNoClick()">
            <mat-icon>close</mat-icon>
        </button>
        <div class="container">
            <h4 class="text-center mb-0">{{ data.title }}</h4>
            <p class="text-center mb-0">{{ data.message }}</p>

            <div class="row">
            <webcam  [height]="400" [width]="400" 
                [trigger]="triggerObservable" [allowCameraSwitch]="false"
                (imageCapture)="handleImage($event)"></webcam>
            <button class="btn btn-success" (click)="triggerSnapshot();">{{ data.confirm }}</button>
            </div>
        </div>
    `,
    styles: [
        'webcam { display: flex;   justify-content: center; padding: 10px;}'
    ]
})
export class WebCamComponent implements OnInit {
    private trigger: Subject<any> = new Subject();
    public webcamImage!: WebcamImage;
    private nextWebcam: Subject<any> = new Subject();

    captureImage = '';

    constructor(
        private dialogRef: MatDialogRef<WebCamComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() { }

    confirmDialog() {
        this.dialogRef.afterClosed()
    }

    /*------------------------------------------
    --------------------------------------------
    triggerSnapshot()
    --------------------------------------------
    --------------------------------------------*/
    public triggerSnapshot(): void {
        this.trigger.next('');
    }

    /*------------------------------------------
    --------------------------------------------
    handleImage()
    --------------------------------------------
    --------------------------------------------*/
    public handleImage(webcamImage: WebcamImage): void {
        this.webcamImage = webcamImage;
        this.captureImage = webcamImage!.imageAsDataUrl;
        console.info('received webcam image', this.captureImage);
        var strImage = this.captureImage.replace(/^data:image\/[a-z]+;base64,/, "");
        // console.info('received webcam image => ', strImage);
        this.dialogRef.close({ response: true, image: strImage })
    }

    /*------------------------------------------
    --------------------------------------------
    triggerObservable()
    --------------------------------------------
    --------------------------------------------*/
    public get triggerObservable(): Observable<any> {
        return this.trigger.asObservable();
    }

    /*------------------------------------------
    --------------------------------------------
    nextWebcamObservable()
    --------------------------------------------
    --------------------------------------------*/
    public get nextWebcamObservable(): Observable<any> {
        return this.nextWebcam.asObservable();
    }

    onNoClick() {
        this.dialogRef.close({ response: false, image: null })
    }
}