import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { PaymentRepository } from 'src/app/main/_model/payment/payment.repository';
import { OtherIncomeRepository } from '../_model/other-income.repository';

@Component({
    selector: 'income-debit',
    template: `
    <div class="d-flex">
        <div class="col-4">
            <p class="text-left mb-0 title-e">Pilih tipe pembayaran</p>
            <mat-radio-group  (ngModelChange)="oIncomeRepo.calculate()"
                aria-labelledby="input-radio-group-label"
                class="input-radio-group"
                [(ngModel)]="oIncomeRepo.create_by_other.paymentTypeId" >
                <mat-radio-button (change)="oIncomeRepo.checked()" class="input-radio-button" *ngFor="let item of paymentRepo.getPaymentType('DEBIT'); let i = index" [value]="item.id"  (change)="radioChange(item)">
                    <div class="">
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
                    <p class="mb-0 text-label">Nomor Kartu</p>
                    <input [(ngModel)]="oIncomeRepo.create_by_other.cardNo" cardmask  (ngModelChange)="changeInputCardNumber($event)"
                    [maxLength]="19" matInput class="input-decorate-payment w-100" type="tel" placeholder="Masukan No. Kartu">
                </div>
                <div class="grid-left mb-2">
                    <p class="mb-0 text-label">Nama Pemegang Kartu</p>
                    <input [(ngModel)]="oIncomeRepo.create_by_other.cardName" matInput class="input-decorate-payment w-100" type="text" placeholder="Masukan Nama Pemagang Kartu">
                </div>
                <div class="grid-left mb-2">
                    <p class="mb-0 text-label">No. Transaksi</p>
                    <input [(ngModel)]="oIncomeRepo.create_by_other.transactionNo" matInput class="input-decorate-payment w-100" type="text" placeholder="Masukan No Transaksi">
                </div>
                <div class="grid-left mb-2">
                    <p class="mb-0 text-label">ID Merchant</p>
                    <input [(ngModel)]="oIncomeRepo.create_by_other.merchantId" matInput class="input-decorate-payment w-100" type="text" placeholder="Masukan ID Merchant">
                </div>
                <div class="grid-left mb-2">
                    <p class="mb-0 text-label">No. Bacth</p>
                    <input [(ngModel)]="oIncomeRepo.create_by_other.batchNo" matInput class="input-decorate-payment w-100" type="text" placeholder="Masukan No.Bacth">
                </div>

                <p class="my-2 text-label">Biaya admin : <strong>{{ oIncomeRepo.create_by_other.adminFee }}%</strong></p>
            </div>
            <div class="d-flex justify-content-center p-2">
                <button (click)="oIncomeRepo.submit_income()" class="income-reset" mat-raised-button>Reset Pemasukan</button>
                <button [disabled]="oIncomeRepo.create_by_other.transactionNo == '' && oIncomeRepo.create_by_other.paymentTypeId == null && (oIncomeRepo.create_income.note?? '') == ''" (click)="oIncomeRepo.submit_income()" class="income" mat-raised-button>Simpan Pemasukan</button>
            </div>
        </div>
    </div>
    `
    ,
    styleUrls: ['./../other-income.component.css'],
    styles: [
        '::ng-deep ::-webkit-scrollbar { display: none !important;}',
        '.owl-category-peyment {background: white; padding: 15px 10px; width: fit-content; border-radius: 10px;}',
        '.bg-active {background-color: #045b62; color: white;}'
    ]
})

export class IncomeDebitComponent implements OnInit {
    constructor(public paymentRepo: PaymentRepository, public oIncomeRepo: OtherIncomeRepository) { }

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
                    this.oIncomeRepo.create_by_other.cardNo = null
                }
            });
        }
    }


    radioChange(payment: any) {
        // console.log('change', payment);
        this.oIncomeRepo.create_by_other.adminFee = payment.adminFee
    }
}