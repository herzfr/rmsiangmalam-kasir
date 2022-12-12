import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaymentRepository } from 'src/app/main/_model/payment/payment.repository';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';
import { CheckoutRepository } from '../../../_model/checkout/chekcout.repository';

@Component({
    selector: 'e-wallet-payment',
    template: `
    <div class="d-flex">
        <div class="col-4">
        <p class="text-left mb-0 title-e">Pilih tipe pembayaran</p>
            <mat-radio-group (ngModelChange)="checkoutRepo.calculateTotal()"
                aria-labelledby="input-radio-group-label"
                class="input-radio-group"
                [(ngModel)]="checkoutRepo.checkout.paymentTypeId" >
                <mat-radio-button class="input-radio-button" *ngFor="let item of paymentRepo.getPaymentType('EWALLET'); let i = index" [value]="item.id"  (change)="radioChange(item)">
                    <div class="grid">
                        <img class="img-payment-logo" src="{{item.name | paymentcode }}">
                        <p class="mb-0">{{item.name}}</p>
                    </div>
                </mat-radio-button>
            </mat-radio-group>
        </div>
        <div class="col">
            <p class="text-left mb-0 title-e">Masukan keterangan pembayaran</p>
            <div class="form-payment">
                <div class="grid-left mb-2">
                    <p class="mb-0 text-label">No. Transaksi</p>
                    <input [(ngModel)]="checkoutRepo.checkout.transactionNo" matInput class="input-decorate-payment w-100" type="text" placeholder="Masukan No Transaksi">
                </div>

                <mat-card class="card-upload d-flex align-items-center">
               <div class="d-flex w-100">
                <ng-container *ngIf="checkoutRepo.checkout.image === null; else taked">
                   <div class="grid" style="width: inherit;">
                        <p (click)="openDialog()" class="text-center cursor-pointer col-12"><mat-icon svgIcon="photo-camera"></mat-icon></p>
                        <p class="text-center col-12 text-small-title mb-0"> Ambil bukti pembayaran </p>
                        <p class="text-center col-12 text-mute-small">Ambil gambar melalui webcam sebagai bukti pembayaran E-Wallet.</p>
                   </div>
                </ng-container>
                <ng-template #taked>
                    <div class="col-6 p-2">
                        <img uiImageLoader class="img-product" onErrorSrc="assets/images/no_pic_square.png" loader="assets/images/no_pic_square.png" [alt]="'Bukti Pembayaran'" class="img-proof" [src]="'data:image/jpeg;base64,' + checkoutRepo.checkout.image" alt="bukti-pembayaran">
                    </div>
                    <div class="col-6 d-flex align-items-center justify-content-center">
                        <div class="grid">
                            <button mat-button (click)="openDialog()" class="text-center cursor-pointer col-12"><mat-icon class="icon-take" svgIcon="photo-camera"></mat-icon>Ambil Ulang</button>
                            <button mat-button (click)="removeImage()" class="text-center cursor-pointer col-12"><mat-icon class="icon-take" svgIcon="trash"></mat-icon>Hapus Bukti</button>
                        </div>
                    </div>
                </ng-template>
               </div>
            </mat-card>
            </div>
        </div>
    </div>
    `,
    styleUrls: ['./../payment-order.component.css', './../../section-split-order/split.component.css'],
})

export class EWalletComponent implements OnInit {
    constructor(public paymentRepo: PaymentRepository, public checkoutRepo: CheckoutRepository, private dialogService: DialogService) { }

    ngOnInit() { }

    radioChange(payment: any) {
        // console.log('change', payment);
        this.checkoutRepo.checkout.adminFee = payment.adminFee
    }

    openDialog() {
        this.dialogService.showWebcam("Bukti pembayaran E-Wallet", "Ambil bukti pembayaran E-Wallet dari pelanggan", "photo_camera", "Ambil Gambar")
            .subscribe(res => {
                if (res.response) {
                    this.checkoutRepo.checkout.image = res.image
                }
            })
    }

    removeImage() {
        this.checkoutRepo.checkout.image = null
    }
}