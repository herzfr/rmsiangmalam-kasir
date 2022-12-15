import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
    selector: 'crop-image',
    template: `
        <button class="close" mat-button (click)="onNoClick()">
            <mat-icon svgIcon="remove"></mat-icon>
        </button>
        <h1 mat-dialog-title class="text-center">Sesuaikan Ukuran Gambar</h1>
        <div mat-dialog-content>
            <image-cropper
                [imageChangedEvent]="imageChangedEvent"
                [maintainAspectRatio]="true"
                [aspectRatio]="1 / 1"
                format="png"
                (imageCropped)="imageCropped($event)"
                (imageLoaded)="imageLoaded($event)"
                (cropperReady)="cropperReady()"
                (loadImageFailed)="loadImageFailed()"
            ></image-cropper>
        </div>
        <div mat-dialog-actions align="center">
            <button (click)="onConfirm()" mat-button mat-dialog-close>Upload</button>
        </div>
    `,
})

export class CropImageComponent implements OnInit {
    imageChangedEvent: any = '';
    croppedImage: any = '';
    contentType: string = '';
    file: File;
    constructor(public dialogRef: MatDialogRef<CropImageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: File, private imageCompress: NgxImageCompressService) {
        this.file = data
        this.imageChangedEvent = data
    }

    ngOnInit() { }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }
    imageLoaded(image: LoadedImage) {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

    imageCompressing() {
        this.imageCompress
            .compressFile(this.croppedImage, 1, 50, 50) // 50% ratio, 50% quality
            .then((compressedImage) => {
                this.contentType = 'image/jpeg';
                this.croppedImage = compressedImage.replace('data:image/jpeg;base64,', '');
                this.imageChangedEvent = this.base64ToFile(compressedImage, new Date().getTime().toString());
                this.dialogRef.close({ response: true, result: this.croppedImage })
            });
    }

    base64ToFile(data: any, filename: string) {
        const arr = data.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    onConfirm() {
        this.imageCompressing()
    }

    onNoClick() {
        this.dialogRef.close({ response: false, result: undefined })
    }
}