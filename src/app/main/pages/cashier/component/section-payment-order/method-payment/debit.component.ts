import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { PaymentRepository } from 'src/app/main/_model/payment/payment.repository';
import { CheckoutRepository } from '../../../_model/checkout/chekcout.repository';

@Component({
    selector: 'debit-payment',
    template: `
   <div class="d-flex">
        <div class="col-4">
            <p class="text-left mb-0 title-e">Pilih tipe pembayaran</p>
            <mat-radio-group (ngModelChange)="checkoutRepo.calculateTotal()"
                aria-labelledby="input-radio-group-label"
                class="input-radio-group"
                [(ngModel)]="checkoutRepo.checkout.paymentTypeId" >
                <mat-radio-button class="input-radio-button" *ngFor="let item of paymentRepo.getPaymentType('DEBIT'); let i = index" [value]="item.id"  (change)="radioChange(item)">
                    <div class="grid">
                        <img class="img-payment-logo" src="{{item.name | paymentcode }}">
                        <p class="fw-bold mb-0 text-bank">Bank : {{item.name}}</p>
                    </div>
                </mat-radio-button>
            </mat-radio-group>
        </div>
        <div class="col">
            <p class="text-left mb-0 title-e">Masukan keterangan pembayaran</p>
            <div class="form-payment">
                <div class="grid-left mb-2">
                    <p class="mb-0 text-label">Nomor Kartu</p>
                    <input [(ngModel)]="checkoutRepo.checkout.cardNo" cardmask  (ngModelChange)="changeInputCardNumber($event)"
                    [maxLength]="19" matInput class="input-decorate-payment w-100" type="tel" placeholder="Masukan No. Kartu">
                </div>
                <div class="grid-left mb-2">
                    <p class="mb-0 text-label">Nama Pemegang Kartu</p>
                    <input [(ngModel)]="checkoutRepo.checkout.cardName" matInput class="input-decorate-payment w-100" type="text" placeholder="Masukan Nama Pemagang Kartu">
                </div>
                <div class="grid-left mb-2">
                    <p class="mb-0 text-label">No. Transaksi</p>
                    <input [(ngModel)]="checkoutRepo.checkout.transactionNo" matInput class="input-decorate-payment w-100" type="text" placeholder="Masukan No Transaksi">
                </div>
                <div class="grid-left mb-2">
                    <p class="mb-0 text-label">ID Merchant</p>
                    <input [(ngModel)]="checkoutRepo.checkout.merchantId" matInput class="input-decorate-payment w-100" type="text" placeholder="Masukan ID Merchant">
                </div>
                <div class="grid-left mb-2">
                    <p class="mb-0 text-label">No. Bacth</p>
                    <input [(ngModel)]="checkoutRepo.checkout.batchNo" matInput class="input-decorate-payment w-100" type="text" placeholder="Masukan No.Bacth">
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./../payment-order.component.css', './../../section-split-order/split.component.css'],
    styles: [
        '::ng-deep ::-webkit-scrollbar { display: none !important;}',
        '.owl-category-peyment {background: white; padding: 15px 10px; width: fit-content; border-radius: 10px;}',
        '.bg-active {background-color: #045b62; color: white;}'
    ]
})




export class DebitComponent implements OnInit {

    constructor(public paymentRepo: PaymentRepository, public checkoutRepo: CheckoutRepository) { }

    ngOnInit() { }

    changeInputCardNumber(e: any) {
        // // console.log(e);
        if (e.length > 0) {
            let str_split = e.split('-')
            // // console.log(str_split);
            str_split.forEach((_el: any) => {
                // // console.log(Number(_el));
                if (_.isNaN(Number(_el))) {
                    // console.log('ini nan');
                    this.checkoutRepo.checkout.cardNo = null
                }
            });
        }
    }

    radioChange(payment: any) {
        // // console.log('change', payment);
        this.checkoutRepo.checkout.adminFee = payment.adminFee
        this.checkoutRepo.calculateTotal()
    }
}