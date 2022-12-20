import { Component, OnInit } from '@angular/core';
import { PaymentRepository } from 'src/app/main/_model/payment/payment.repository';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';
import { OtherIncomeRepository } from '../_model/other-income.repository';

@Component({
    selector: 'income-ewallet',
    template: `
     <div class="d-flex">
        <div class="col-3">
        <p class="text-left mb-0 title-e">Pilih tipe pembayaran</p>
            <mat-radio-group (ngModelChange)="oIncomeRepo.calculate()"
                aria-labelledby="input-radio-group-label"
                class="input-radio-group"
                [(ngModel)]="oIncomeRepo.create_by_other.paymentTypeId" >
                <mat-radio-button class="input-radio-button" *ngFor="let item of paymentRepo.getPaymentType('EWALLET'); let i = index" [value]="item.id"  (change)="radioChange(item)">
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
                    <p class="mb-0 text-label">No. Transaksi</p>
                    <input [(ngModel)]="oIncomeRepo.create_by_other.transactionNo" matInput class="input-decorate-payment w-100" type="text" placeholder="Masukan No Transaksi">
                </div>

              <mat-card class="card-upload d-flex align-items-center">
               <div class="d-flex w-100">
                <ng-container *ngIf="oIncomeRepo.create_by_other.image === null; else taked">
                   <div class="" style="width: inherit;">
                        <p (click)="openDialog()" class="text-center cursor-pointer col-12"><mat-icon svgIcon="photo-camera"></mat-icon></p>
                        <p class="text-center col-12 text-small-title mb-0 t-primary"> Ambil bukti pembayaran </p>
                        <!-- <p class="text-center col-12 text-mute-small">Ambil gambar melalui webcam sebagai bukti pembayaran E-Wallet.</p> -->
                   </div>
                </ng-container>
                <ng-template #taked>
                    <div class="col-6 p-2">
                        <img uiImageLoader class="img-product" onErrorSrc="assets/images/no_pic_square.png" loader="assets/images/no_pic_square.png" [alt]="'Bukti Pembayaran'" class="img-proof" [src]="'data:image/jpeg;base64,' + oIncomeRepo.create_by_other.image" alt="bukti-pembayaran">
                    </div>
                    <div class="col-6 d-flex align-items-center justify-content-center">
                        <div class="" style="display: grid;">
                            <button mat-button (click)="openDialog()" class="text-center cursor-pointer col-12"><mat-icon class="icon-take" svgIcon="photo-camera"></mat-icon>Ambil Ulang</button>
                            <button mat-button (click)="removeImage()" class="text-center cursor-pointer col-12"><mat-icon class="icon-take" svgIcon="trash"></mat-icon>Hapus Bukti</button>
                        </div>
                    </div>
                </ng-template>
               </div>
            </mat-card>

            <p class="my-2 text-label">Biaya admin : <strong>{{ oIncomeRepo.create_by_other.adminFee }}%</strong></p>
            <div class="d-flex justify-content-center">
                <button (click)="oIncomeRepo.submit_income()" class="income-reset" mat-raised-button>Reset Pemasukan</button>
                <button [disabled]="oIncomeRepo.create_by_other.transactionNo == '' && oIncomeRepo.create_by_other.paymentTypeId == null && (oIncomeRepo.create_income.note?? '') == ''" (click)="oIncomeRepo.submit_income()" class="income" mat-raised-button>Simpan Pemasukan</button>
            </div>
            </div>
        </div>
    </div>
    `,
    styleUrls: ['./../other-income.component.css'],
})

export class IncomeEWalletComponent implements OnInit {
    constructor(public paymentRepo: PaymentRepository, public oIncomeRepo: OtherIncomeRepository, private dialogService: DialogService) { }

    ngOnInit() { }

    radioChange(payment: any) {
        // console.log('change', payment);
        this.oIncomeRepo.create_by_other.adminFee = payment.adminFee
    }

    openDialog() {
        this.dialogService.showWebcam("Bukti pembayaran E-Wallet", "Ambil bukti pembayaran E-Wallet dari pelanggan", "photo_camera", "Ambil Gambar")
            .subscribe(res => {
                if (res.response) {
                    this.oIncomeRepo.create_by_other.image = res.image
                }
            })
    }

    removeImage() {
        this.oIncomeRepo.create_by_other.image = null
    }
}