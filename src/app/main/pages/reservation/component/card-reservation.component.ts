import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PaymentRepository } from 'src/app/main/_model/payment/payment.repository';
import { Reservation } from 'src/app/main/_model/reservation/reservation.model';
import { ReservationRepository } from 'src/app/main/_model/reservation/reservation.repository';

@Component({
    selector: 'card-reservation',
    templateUrl: 'card-reservation.component.html',
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
        @Inject(MAT_BOTTOM_SHEET_DATA) public cashier: any,
    ) {
        this.fromCashier = Object.keys(cashier).length !== 0 ? cashier.from_cashier : false
    }

    ngOnInit() {

    }

    get is_have_reservation() {
        return this.reservation_is_done.length > 0 && this.data_reservation!.length > 0
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

    cancel(id_booking: number) {
        this.deleteItem.emit(id_booking);
    }
}