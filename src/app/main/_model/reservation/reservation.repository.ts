import { Injectable } from "@angular/core";
import { Pageable } from "src/app/_model/general.model";
import { BaseService } from "../../_service/base.service";
import { ReservationService } from "../../_service/reservation.service";
import { ShiftRepository } from "../shift/shift.repository";
import { CreateReservation, DataReservation, FindReservation, Reservation } from "./reservation.model";

@Injectable({ 'providedIn': 'root' })
export class ReservationRepository {
    public find: FindReservation = new FindReservation()
    private dataReservation: DataReservation | undefined;
    public createReservation: CreateReservation = new CreateReservation()

    constructor(private _reservService: ReservationService, private shiftRepo: ShiftRepository, private _baseservice: BaseService) {
        this.find.branchId = shiftRepo.onBranch
        this.find.subBranchId = shiftRepo.onSubBranch
        this.fetchReservation()
        this.listenChangeCash()
    }

    fetchReservation() {
        this._reservService.getReservation(this.find)
            .subscribe(res => {
                console.log(res);

                this.dataReservation = res.data
            })
    }

    listenChangeCash() {
        this._baseservice.numberResultGeneral$.subscribe(res => {
            // console.log(res);
            this.createReservation.cash = res
            this.calculate()
        })
    }

    get reservation(): Reservation[] {
        return this.dataReservation?.content ?? []
    }

    get reservationPagine(): Pageable | undefined {
        return this.dataReservation?.pageable
    }

    get isSubmit() {
        if (this.createReservation.dpAmount === this.createReservation.cash) {
            return true
        }
        return false
    }

    public calculate() {
        if (this.createReservation.paymentMethod === 'CASH') {
            this.createReservation.change = this.createReservation.dpAmount - this.createReservation.cash
            this.createReservation.adminFee = 0
            this.createReservation.batchNo = null
            this.createReservation.cardNo = null
            this.createReservation.cardName = null
            this.createReservation.image = null
            this.createReservation.transactionNo = null
            this.createReservation.merchantId = null
        } else {
            this.createReservation.change = 0
            this.createReservation.cash = 0
        }
    }


    public clean() {
        this.createReservation.adminFee = 0
        this.createReservation.change = 0
        this.createReservation.cash = 0
        this.createReservation.batchNo = null
        this.createReservation.cardNo = null
        this.createReservation.cardName = null
        this.createReservation.image = null
        this.createReservation.transactionNo = null
        this.createReservation.merchantId = null
    }
}