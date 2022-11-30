import { Location } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { TimeUtil } from 'src/app/_utility/time.util';
import { NumpadComponent } from '../../_dialog/numpad.component';
import { ReservationRepository } from '../../_model/reservation/reservation.repository';

@Component({
    selector: 'reservation',
    templateUrl: 'reservation.component.html',
    styleUrls: ['reservation.component.css']
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

    changeDate(e: any) {
        this.selected = this.time.convertDateTimeLocale(e);
        this.resvRepo.find.startDate = this.time.startTodayTime(this.selected)
        this.resvRepo.find.endDate = this.time.endTodayTime(this.selected)
        this.resvRepo.set_bookingTime(this.selected)
    }

    get time_book() {
        return this.time.getJustTime(this.resvRepo.createReservation.bookingTime ?? new Date().getMilliseconds())
    }

    startTime(e: any) {
        this.resvRepo.createReservation.bookingTime = this.time.setTimeInDate((e.value as string), this.selected)
        console.log(this.resvRepo.createReservation);
    }

    tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        // console.log('tabChangeEvent => ', tabChangeEvent);
        // console.log('index => ', tabChangeEvent.index);
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
        configBottom.data = [0, false]
        configBottom.backdropClass = 'backdrop-numpad'
        configBottom.panelClass = 'panel-numpad'
        this._bottomSheet.open(NumpadComponent, configBottom);
    }

    inputDepositChange(e: any) {
        console.log(e);
        this.resvRepo.createReservation.dpAmount = e
        this.resvRepo.calculate()
    }


    deleteItem(id_booking: number) {
        console.log(id_booking);
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
