import { Location } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { TimeUtil } from 'src/app/_utility/time.util';
import { NumpadComponent } from '../../_dialog/numpad.component';
import { ReservationRepository } from '../../_model/reservation/reservation.repository';

@Component({
    selector: 'reservation',
    templateUrl: 'reservation.component.html',
    styleUrls: ['reservation.component.css'],
    encapsulation: ViewEncapsulation.Emulated
})
export class ReservationComponent implements OnInit, AfterViewInit {
    selected: Date = new Date();
    tabIndex: number | null | undefined;
    isInput: boolean = false;
    fromCashier: boolean = false
    @ViewChild('tabGroup') tabGroup?: MatTabGroup;
    constructor(
        public location: Location,
        public resvRepo: ReservationRepository,
        public time: TimeUtil,
        private _bottomSheet: MatBottomSheet,

    ) { }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.tabGroup!.selectedIndex = 0
            this.tabIndex = this.tabGroup?.selectedIndex
        }, 1)
    }

    ngOnInit() {

    }

    // SATU PAKET CHANGE DATE ==================================
    changeDate(e: any) {
        this.selected = this.time.convertDateTimeLocale(e);
        // console.log(this.selected);

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


    get time_book() {
        return this.time.getJustTime(this.resvRepo.createReservation.bookingTime ?? new Date().getMilliseconds())
    }

    startTime(e: any) {
        this.resvRepo.createReservation.bookingTime = this.time.setTimeInDate((e.value as string), this.selected)
        // console.log(this.resvRepo.createReservation);
    }

    tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        // // console.log('tabChangeEvent => ', tabChangeEvent);
        // // console.log('index => ', tabChangeEvent.index);
        this.tabIndex = tabChangeEvent.index
        switch (this.tabIndex) {
            case 0:
                this.resvRepo.createReservation.paymentMethod = 'CASH'
                this.resvRepo.createReservation.adminFee = 0
                this.resvRepo.calculate()
                break;
            case 3:
                this.resvRepo.createReservation.paymentMethod = null
                this.resvRepo.createReservation.adminFee = 0
                this.resvRepo.calculate()
                break;
            default:
                this.resvRepo.createReservation.paymentMethod = 'CUSTOM'
                this.resvRepo.calculate()
                break;
        }
    }

    opeenKeybordSheet() {
        this.isInput = true
        const configBottom: MatBottomSheetConfig = new MatBottomSheetConfig()
        configBottom.data = [0, 'reservation']
        configBottom.backdropClass = 'backdrop-numpad'
        configBottom.panelClass = 'panel-numpad'
        this._bottomSheet.open(NumpadComponent, configBottom);
    }

    inputDepositChange(e: any) {
        // console.log(e);
        this.resvRepo.createReservation.dpAmount = e
        this.resvRepo.calculate()
    }


    deleteItem(id_booking: number) {
        // console.log(id_booking);
        this.resvRepo.deleteReservation(id_booking)
    }


    ngOnDestroy() {
        this.selected = new Date();
        this.tabGroup!.selectedIndex = 1
        this.tabIndex = this.tabGroup?.selectedIndex
        this.resvRepo.clean()
        this.fromCashier = false
    }

}

