import { Component, OnInit } from '@angular/core';
import { PaymentRepository } from 'src/app/main/_model/payment/payment.repository';
import { ReservationRepository } from 'src/app/main/_model/reservation/reservation.repository';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';

@Component({
    selector: 'reservasi-ewallet',
    template: `
        <div class="container-fluid">
            <div class="row mb-2">
                <label id="input-radio-group-label">Pilih tipe pembayaran?</label>
                <mat-radio-group
                aria-labelledby="input-radio-group-label"
                class="input-radio-group flex-row flex-nowrap"
                [(ngModel)]="resvRepo.createReservation.paymentTypeId" >
                <mat-radio-button class="input-radio-button" *ngFor="let item of paymentRepo.getPaymentType('EWALLET')" [value]="item.id"  (change)="radioChange(item)">
                    {{item.name}}
                </mat-radio-button>
                </mat-radio-group>
            </div>
            <div class="row mb-2">
                <input [(ngModel)]="resvRepo.createReservation.transactionNo" matInput class="input-decorate w-100" type="text" placeholder="Masukan No.Transaksi">
            </div>

            <mat-card class="card-upload d-flex align-items-center">
               <div class="row">
                    <ng-container *ngIf="resvRepo.createReservation.image === null; else taked">
                        <p class="text-center col-12"> Ambil bukti pembayaran </p>
                        <p (click)="openDialog()" class="text-center cursor-pointer col-12"><mat-icon>photo_camera</mat-icon></p>
                        <p class="text-center col-12">Ambil gambar melalui webcam sebagai bukti pembayaran E-Wallet.</p>
                    </ng-container>
                    <ng-template #taked>
                        <div class="col-6">
                            <img class="img-proof" [src]="'data:image/jpeg;base64,' + resvRepo.createReservation.image" alt="bukti-pembayaran">
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

                <div class="d-flex justify-content-center box-input p-4">
                    <button (click)="resvRepo.submitReservation('ewallet')" class="reservation" mat-raised-button>Reservasi</button>
                </div>
            </mat-card>
        </div>
    `,
    styleUrls: ['./../reservation.component.css'],
})

export class ReservasiEWalletComponent implements OnInit {
    constructor(public paymentRepo: PaymentRepository, public resvRepo: ReservationRepository, private dialogService: DialogService) { }

    ngOnInit() { }

    radioChange(payment: any) {
        // console.log('change', payment);
        this.resvRepo.createReservation.adminFee = payment.adminFee
    }

    openDialog() {
        this.dialogService.showWebcam("Bukti pembayaran E-Wallet", "Ambil bukti pembayaran E-Wallet dari pelanggan", "photo_camera", "Ambil Gambar")
            .subscribe(res => {
                if (res.response) {
                    this.resvRepo.createReservation.image = res.image
                }
            })
    }

    removeImage() {
        this.resvRepo.createReservation.image = null
    }
}