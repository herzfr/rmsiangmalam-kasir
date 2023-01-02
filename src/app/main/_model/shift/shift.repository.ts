import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Observable, ReplaySubject } from 'rxjs';
import { UserLogin, UserLoginSubBranch } from 'src/app/auth/auth.model';
import { UserRespository } from 'src/app/auth/auth.repository';
import { Level } from 'src/app/_constant/role';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { TimeUtil } from 'src/app/_utility/time.util';
import { SavingService } from '../../_service/saving.service';
import { ShiftService } from '../../_service/shift.service';
import { CreateSaving, Saving } from '../saving/saving.model';
import { SavingRepository } from '../saving/saving.repository';
import { Shift, StartShift } from './shift.model';

@Injectable({ providedIn: 'root' })
export class ShiftRepository {
    public user: UserLogin;
    public onBranch: number;
    public onSubBranch: number | null;
    public subBranchList: UserLoginSubBranch[] = [];
    public name: string = '';
    public username: string = '';
    public shift?: Shift;
    // shift?.type === 'SIANG'? 'Siang' : 'Malam' 
    public on_shift: 'SIANG' | 'MALAM' = 'SIANG'

    public saving?: Saving;
    private today: Date = new Date()

    private locator = (s: Shift, id?: number) => s.id == id;
    private replaySubjectShift = new ReplaySubject<Shift>();



    constructor(private shiftService: ShiftService, private userRepo: UserRespository, private _snackBar: MatSnackBar,
        private _savingService: SavingService, private time: TimeUtil) {
        this.user = typeof userRepo.getUserLogin() !== 'boolean' ? userRepo.getUserLogin() as UserLogin : new UserLogin();
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

    async stop(stop: number, endCash: number): Promise<any> {
        let isSuccess: boolean = false;
        let res: GeneralResponse | undefined = await this.shiftService.stopShift(stop, endCash).toPromise()
        console.log(res);

        if (res?.statusCode === 0) {
            return isSuccess = true;
        }
        return isSuccess;
    }

    check() {
        this.shiftService.checkShift(this.onBranch, this.onSubBranch).subscribe(res => {
            if (res.statusCode === 0) {
                this.shift = res.data
                this.replaySubjectShift.next(res.data)
                this.check_saving().then(result => {
                    if (result) {
                        let create: CreateSaving = new CreateSaving()
                        create.amount = this.saving?.savingAmount ?? 0
                        create.branchId = this.onBranch
                        create.subBranchId = this.onSubBranch
                        create.shiftId = this.shift?.id ?? null
                        this._savingService.saving(create).subscribe(res => {
                            if (res.statusCode === 0) {
                                this.openSnackBar('Tabungan sudah di debit')
                                this.check()
                            }
                        })
                    }
                })
            }
        })
    }

    async check_saving() {
        const save_prom = new Promise<boolean>((resolve, reject) => {
            this._savingService.getSaving(this.onBranch, this.onSubBranch)
                .subscribe(async res => {
                    this.saving = await res.data
                    resolve(this.is_saving)
                })
        })
        return save_prom
    }

    get is_saving() {
        let convert = new Date(this.saving?.updatedAt ?? this.today.getMilliseconds())
        let range = this.time.getDatesInRange(convert, new Date())
        if (range > 0) {
            return true
        }
        return false
    }



    getShiftObs(): Observable<Shift> {
        return this.replaySubjectShift;
    }

    addCash(data: any) {
        this.shiftService.addCash(data).subscribe(res => {
            if (res.statusCode === 0) {
                this.openSnackBar('Penambahan kas kasir berhasil')
                this.check()
            }
        }, (err: HttpErrorResponse) => {
            this.openSnackBar('Penambahan kas kasir gagal')
        })
    }

    shiftAll() { }

    detailShift() { }

    //  DIALOG
    //  ================================================================
    openSnackBar(message: string) {
        let horizontalPosition: MatSnackBarHorizontalPosition = 'center';
        let verticalPosition: MatSnackBarVerticalPosition = 'top';
        this._snackBar.open(message, 'Tutup', {
            horizontalPosition: horizontalPosition,
            verticalPosition: verticalPosition,
        });
    }

}