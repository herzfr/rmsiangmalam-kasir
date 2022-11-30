import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { PaymentRepository } from 'src/app/main/_model/payment/payment.repository';
import { ReservationRepository } from 'src/app/main/_model/reservation/reservation.repository';

@Component({
    selector: 'reservasi-debit',
    template: `
          <div class="container-fluid">
            <div class="row mb-2">
                <!-- <div class="col-4 payment-type" *ngFor="let item of paymentRepo.getPaymentType('DEBIT')">
                    {{ item.name }}
                </div> -->
                <label id="example-radio-group-label">Pilih tipe pembayaran?</label>
                <mat-radio-group (ngModelChange)="resvRepo.calculate()"
                aria-labelledby="input-radio-group-label"
                class="input-radio-group flex-row flex-nowrap"
                [(ngModel)]="resvRepo.createReservation.paymentTypeId" >
                <mat-radio-button class="input-radio-button" *ngFor="let item of paymentRepo.getPaymentType('DEBIT')" [value]="item.id"  (change)="radioChange(item)">
                    {{item.name}}
                </mat-radio-button>
                </mat-radio-group>
            </div>
            <div class="row mb-2">
                <div class="col-6">
                    <input [(ngModel)]="resvRepo.createReservation.cardNo" cardmask  (ngModelChange)="changeInputCardNumber($event)"
                    [maxLength]="19" matInput class="input-decorate w-100" type="tel" placeholder="Masukan No. Kartu">
                </div>
                <div class="col-6">
                    <input [(ngModel)]="resvRepo.createReservation.cardName" matInput class="input-decorate w-100" type="text" placeholder="Masukan Nama Pemagang Kartu">
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-6">
                    <input [(ngModel)]="resvRepo.createReservation.transactionNo" matInput class="input-decorate w-100" type="text" placeholder="Masukan No.Transaksi">
                </div>
                <div class="col-6">
                    <input [(ngModel)]="resvRepo.createReservation.merchantId" matInput class="input-decorate w-100" type="text" placeholder="Masukan ID. Merchant">
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-6">
                    <input [(ngModel)]="resvRepo.createReservation.batchNo" matInput class="input-decorate w-100" type="text" placeholder="Masukan No.Bacth">
                </div>
            </div>
            <div class="d-flex justify-content-center box-input p-4">
                <button (click)="resvRepo.submitReservation('debit')" class="reservation" mat-raised-button>Reservasi</button>
            </div>
        </div>
    `,
    styleUrls: ['./../reservation.component.css'],
    styles: [
        '::ng-deep ::-webkit-scrollbar { display: none !important;}',
        '.owl-category-peyment {background: white; padding: 15px 10px; width: fit-content; border-radius: 10px;}',
        '.bg-active {background-color: #045b62; color: white;}'
    ]
})

export class ReservasiDebitComponent implements OnInit {
    constructor(public paymentRepo: PaymentRepository, public resvRepo: ReservationRepository) { }

    ngOnInit() { }

    changeInputCardNumber(e: any) {
        console.log(e);
        if (e.length > 0) {
            let str_split = e.split('-')
            console.log(str_split);
            str_split.forEach((_el: any) => {
                console.log(Number(_el));
                if (_.isNaN(Number(_el))) {
                    console.log('ini nan');
                    this.resvRepo.createReservation.cardNo = null
                }
            });
        }
    }


    radioChange(payment: any) {
        // console.log('change', payment);
        this.resvRepo.createReservation.adminFee = payment.adminFee
    }
}