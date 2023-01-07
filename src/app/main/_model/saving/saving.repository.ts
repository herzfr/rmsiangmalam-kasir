import { Injectable } from "@angular/core";
import { TimeUtil } from "src/app/_utility/time.util";
import { SavingService } from "../../_service/saving.service";
import { ShiftRepository } from "../shift/shift.repository";
import { Saving } from "./saving.model";

@Injectable()
export class SavingRepository {
    public saving?: Saving;
    private today: Date = new Date()
    constructor(private _savingService: SavingService, private shiftRepo: ShiftRepository, private time: TimeUtil) {
        _savingService.getSaving(shiftRepo.onBranch, shiftRepo.onSubBranch)
            .subscribe(res => {
                this.saving = res.data
            })
    }

    get is_saving() {
        let d = this.time.getJustDateLocale(this.today)
        let a = this.time.getDate(this.saving?.updatedAt ?? this.today.getMilliseconds())
        // console.log('local today', d);
        // console.log('local updatedAt', a);
        return false
    }
}