import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaymentRepository } from 'src/app/main/_model/payment/payment.repository';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';
import { CheckoutRepository } from '../../../_model/checkout/chekcout.repository';

@Component({
    selector: 'e-wallet-payment',
    template: `
        <div class="container-fluid">
            <div class="row mb-2">
                <label id="input-radio-group-label">Pilih tipe pembayaran?</label>
                <mat-radio-group
                aria-labelledby="input-radio-group-label"
                class="input-radio-group flex-row flex-nowrap"
                [(ngModel)]="checkoutRepo.checkout.paymentTypeId" >
                <mat-radio-button class="input-radio-button" *ngFor="let item of paymentRepo.getPaymentType('EWALLET')" [value]="item.id"  (change)="radioChange(item)">
                    {{item.name}}
                </mat-radio-button>
                </mat-radio-group>
            </div>
            <div class="row mb-2">
                <input [(ngModel)]="checkoutRepo.checkout.transactionNo" matInput class="input-decorate w-100" type="text" placeholder="Masukan No.Transaksi">
            </div>

            <mat-card class="card-upload d-flex align-items-center">
               <div class="row">
                <ng-container *ngIf="checkoutRepo.checkout.image === null; else taked">
                    <p class="text-center col-12"> Ambil bukti pembayaran </p>
                    <p (click)="openDialog()" class="text-center cursor-pointer col-12"><mat-icon>photo_camera</mat-icon></p>
                    <p class="text-center col-12">Ambil gambar melalui webcam sebagai bukti pembayaran E-Wallet.</p>
                </ng-container>
                <ng-template #taked>
                    <div class="col-6">
                        <img class="img-proof" [src]="'data:image/jpeg;base64,' + checkoutRepo.checkout.image" alt="bukti-pembayaran">
                    </div>
                    <div class="col-6 d-flex align-items-center">
                        <div class="row">
                            <div class="flex-column bd-highlight mb-3 ">
                                <button mat-button (click)="openDialog()" class="text-center cursor-pointer col-12"><mat-icon>photo_camera</mat-icon>Ambil Ulang</button>
                                <button mat-button (click)="removeImage()" class="text-center cursor-pointer col-12"><mat-icon>image_not_supported</mat-icon>Hapus Bukti</button>
                            </div>
                        </div>
                    </div>
                </ng-template>
               </div>
            </mat-card>
        </div>
    `,
    styleUrls: ['./../payment-order.component.css'],
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