import { Component, OnInit } from '@angular/core';
import { PaymentRepository } from 'src/app/main/_model/payment/payment.repository';
import { CheckoutRepository } from '../../../_model/checkout/chekcout.repository';

@Component({
    selector: 'e-wallet-payment',
    template: `
        <div class="container-fluid">
            <div class="row mb-2">
                <label id="example-radio-group-label">Pilih tipe pembayaran?</label>
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
                <p class="text-center col-12"> Ambil bukti pembayaran </p>
                <p class="text-center cursor-pointer col-12"><mat-icon>photo_camera</mat-icon></p>
                <p class="text-center col-12">Ambil gambar melalui webcam sebagai bukti pembayaran E-Wallet.</p>
               </div>
            </mat-card>
        </div>
    `,
    styleUrls: ['./../payment-order.component.css'],
})

export class EWalletComponent implements OnInit {
    constructor(public paymentRepo: PaymentRepository, public checkoutRepo: CheckoutRepository) { }

    ngOnInit() { }

    radioChange(payment: any) {
        // console.log('change', payment);
        this.checkoutRepo.checkout.adminFee = payment.adminFee
    }
}