import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentRepository } from 'src/app/main/_model/payment/payment.repository';
import { Reservation } from 'src/app/main/_model/reservation/reservation.model';
import { ReservationRepository } from 'src/app/main/_model/reservation/reservation.repository';
import { TimeUtil } from 'src/app/_utility/time.util';

@Component({
    selector: 'dialog-reservation',
    templateUrl: 'dialog-reservation.component.html',
    styleUrls: ['dialog-reservation.component.css']
})

export class DoialogReservationComponent implements OnInit {
    selected: Date = this.time.convertDateTimeLocale(new Date())
    reservation: Reservation[] = []
    today: number = new Date().getMilliseconds()

    constructor(
        private dialogRef: MatDialogRef<DoialogReservationComponent>,
        @Inject(MAT_DIALOG_DATA) public cashier: any, public resvRepo: ReservationRepository,
        private paymentRepo: PaymentRepository, private time: TimeUtil
    ) {
        this.reservation = this.resvRepo.reservation
        // this.selected = this.time.convertDateTimeLocale(new Date())
    }

    ngOnInit() { }



    get data_reservation() {
        return this.resvRepo.reservation
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

    // SATU PAKET CHANGE DATE ==================================
    changeDate(e: any) {
        this.selected = this.time.convertDateTimeLocale(e);
        console.log(this.selected);

        let num_start = this.time.startTodayTime(this.selected)
        let num_end = this.time.endTodayTime(this.selected)

        let conv_num_start = this.get_date_1(num_start)
        let conv_num_end = this.get_date_1(num_end)

        this.resvRepo.find.startDate = conv_num_start.setUTCHours(0, 0, 0, 0)
        this.resvRepo.find.endDate = conv_num_end.setUTCHours(23, 59, 59, 999)

        this.resvRepo.set_bookingTime(this.selected)
    }

    get_date_1(d: number) {
        let date = new Date(d);
        date.setDate(date.getDate() + 1);
        return date
    }
    // SATU PAKET CHANGE DATE ==================================


    claim(item: Reservation) {
        this.dialogRef.close({ resp: true, result: item })
    }

    close() {
        this.dialogRef.close({ resp: false, result: undefined })
    }

}