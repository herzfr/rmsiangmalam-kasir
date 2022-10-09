import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { UserLogin, UserLoginSubBranch } from 'src/app/auth/auth.model';
import { UserRespository } from 'src/app/auth/auth.repository';
import { Level } from 'src/app/_constant/role';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { ShiftService } from '../../_service/shift.service';
import { Shift, StartShift } from './shift.model';

@Injectable({ providedIn: 'root' })
export class ShiftRepository {
    public user: UserLogin;
    public onBranch: number;
    public onSubBranch: number | null;
    public subBranchList: UserLoginSubBranch[] = [];

    private locator = (s: Shift, id?: number) => s.id == id;
    private replaySubjectShift = new ReplaySubject<Shift>();

    constructor(private shiftService: ShiftService, private userRepo: UserRespository) {
        this.user = typeof (userRepo.getUserLogin() !== 'boolean') ? userRepo.getUserLogin() as UserLogin : new UserLogin();
        this.onBranch = this.user.branchId ?? 0
        this.onSubBranch = null
        let subBranchList: UserLoginSubBranch[] = (this.user.subBranch?.length ?? 0) ? (this.user.subBranch ?? []) : []
        if (this.user.level === Level.BRANCH) {
            this.subBranchList?.push({ id: null, name: this.user.branch })
        }
        subBranchList.forEach((el: UserLoginSubBranch) => {
            this.subBranchList?.push(el)
        });
        this.onSubBranch = this.subBranchList[0].id ?? null
        this.replaySubjectShift = new ReplaySubject<Shift>(1);
        this.check()

    }

    async start(start: StartShift): Promise<boolean> {
        let isSuccess: boolean = false;
        let res: GeneralResponse | undefined = await this.shiftService.startShift(start).toPromise()
        if (res?.statusCode === 0) {
            return isSuccess = true;
        }
        return isSuccess;
    }

    async stop(stop: number): Promise<any> {
        let isSuccess: boolean = false;
        let res: GeneralResponse | undefined = await this.shiftService.stopShift(stop).toPromise()
        if (res?.statusCode === 0) {
            return isSuccess = true;
        }
        return isSuccess;
    }

    check() {
        this.shiftService.checkShift(this.onBranch, this.onSubBranch).subscribe(res => {
            if (res.statusCode === 0) {
                this.replaySubjectShift.next(res.data)
            }
        })
    }

    getShiftObs(): Observable<Shift> {
        return this.replaySubjectShift;
    }


    addCash() {

    }

    shiftAll() {

    }

    detailShift() {

    }

}