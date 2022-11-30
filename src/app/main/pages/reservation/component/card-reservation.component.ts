import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PaymentRepository } from 'src/app/main/_model/payment/payment.repository';
import { Reservation } from 'src/app/main/_model/reservation/reservation.model';
import { ReservationRepository } from 'src/app/main/_model/reservation/reservation.repository';

@Component({
    selector: 'card-reservation',
    template: `
        <div class="bossWrapp">
            <div class="cardTitle">RESERVASI</div>
            <div class="container-fluid list-reservation">
                <ng-container *ngFor="let item of data_reservation">
                <div class="single">
                    <div class="icon"><img class="icon-img" src="assets/images/sm_logo.png" alt=""></div>
                        <div class="text">

                        <div class="header">
                            <div class="d-flex justify-content-between align-items-between w-100">
                                <h3 class="mb-0">{{ item?.note }}</h3>
                                <button *ngIf="!fromCashier" mat-button (click)="delete(item.id)">Batal</button>
                            </div>

                            <div class="desc">
                                <!-- Deposit : {{ (reservation?.dpAmount?? 0) | rupiah}}. -->
                                <h5 class="mb-0">Deposit : {{ (item?.dpAmount?? 0) | rupiah}}</h5>
                                <p class="mb-0">Tipe pembayaran: {{ checkpayment(item?.paymentMethod, item.paymentTypeId) }}</p>
                            </div>

                        </div>

                        <div class="functions">
                            <span class="soon">{{ (item?.bookingTime?? today) | milistodate: 'full'  }}</span>
                            <span *ngIf="fromCashier" (click)="claim(item)">Claim Reservasi<svg xmlns="http://www.w3.org/2000/svg" width="7" height="10" viewBox="0 0 7 10">
                                <polyline fill="none" stroke="#3899EC" stroke-width="1.5" points="105.077 13.154 101 9.077 105.077 5" transform="rotate(-180 53.038 7.077)" />
                                </svg>
                            </span>
                        </div>

                        </div>
                    </div>
                </ng-container>
                <div *ngIf="reservation_is_done.length > 0" class="devider">Tidak Aktif / Terpakai</div>
                <ng-container *ngFor="let item of reservationDone">
                <div class="single noBd">

                <div class="icon"><img class="icon-img" src="assets/images/sm_logo_bw.png" alt=""></div>
                    <div class="text">
                        <div class="header">
                            <h3>{{ item.note }}</h3>
                            <div class="desc">
                                <h5 class="mb-0">Deposit : {{ (item?.dpAmount?? 0) | rupiah}}</h5>
                                <p class="mb-0">Tipe pembayaran: {{ checkpayment(item?.paymentMethod, item.paymentTypeId) }}</p>
                            </div>
                        </div>
                        <div class="">
                            <span>{{ (item?.bookingTime?? today) | milistodate: 'full' }}</span>
                        </div>
                    </div>
                </div>
                </ng-container>
            </div>
        </div>
    `,
    styleUrls: ['./../reservation-style/reservation.style.css']
})

export class CardReservation implements OnInit {
    @Input() reservation?: Reservation[]
    @Input() reservationDone?: Reservation[] = []
    @Output() deleteItem = new EventEmitter<number>();

    today: number = new Date().getMilliseconds()
    fromCashier: boolean = false
    // list_reservation: Reservation[] = []
    constructor(
        private paymentRepo: PaymentRepository,
        private resvRepo: ReservationRepository,
        private _bottomSheetRef: MatBottomSheetRef<CardReservation>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public cashier: boolean,
    ) {
        this.fromCashier = cashier
    }

    ngOnInit() {

    }

    get reservation_is_done(): Reservation[] {
        return this.reservationDone ?? []
    }

    checkpayment(payment_method?: string, payment_id?: number) {
        // console.log(payment_method);
        if (payment_method === 'CASH') {
            return 'Tunai'
        } else if (payment_method === 'CUSTOM') {
            return this.paymentRepo.dataPayment.find(x => x.id == payment_id)?.name
        } else {
            return ''
        }

    }

    get data_reservation() {
        if (this.fromCashier) {
            return this.resvRepo.reservation
        }
        return this.reservation
    }

    openLink(event: MouseEvent): void {
        this._bottomSheetRef.dismiss({ resp: false, result: undefined });
        event.preventDefault();
    }

    claim(item: Reservation) {
        this._bottomSheetRef.dismiss({ resp: true, result: item })
    }

    delete(id_booking: number) {
        this.deleteItem.emit(id_booking);
    }
}