import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLoginSubBranch } from 'src/app/auth/auth.model';
import { Shift, StartShift } from 'src/app/main/_model/shift/shift.model';
import { ShiftRepository } from 'src/app/main/_model/shift/shift.repository';
import { FormUtil } from 'src/app/_utility/form.util';
import { RandomUtil } from 'src/app/_utility/random';
import { DialogService } from '../../dialogs/dialog.service';

@Component({
    selector: 'shift-card-app',
    templateUrl: 'shift-card.component.html',
    styleUrls: ['shift-card.component.css']
})

export class ShiftCardComponent implements OnInit {
    @Input() shift?: Shift;
    listSub?: UserLoginSubBranch[] = [];
    onBranchID: number;
    onSubBranchID: number | null;
    isActive: boolean = false;
    isRefresh: boolean = false;

    constructor(
        private shiftRepo: ShiftRepository,
        private dialog: DialogService,
        private formUtil: FormUtil,
        private randomUtil: RandomUtil,
        private router: Router
    ) {
        this.onBranchID = shiftRepo.onBranch;
        this.onSubBranchID = shiftRepo.onSubBranch;
        this.listSub = shiftRepo.subBranchList;


    }
    async ngOnInit(): Promise<void> {
        await this.shiftRepo.getShiftObs().subscribe(res => {
            this.isActive = res?.status === 'OPEN' ? true : false
        })


    }

    changeIsAcive() {
        console.log(this.isActive);

        if (this.isActive) {
            alert('anda berada dalam status open shift')
            this.isActive = this.shift?.status === 'OPEN' ? true : false
        } else {
            this.dialog.showFormDialog("Mulai untuk Shift?", "Isi form awal terlebih dahulu", this.initFields()).subscribe(res => {
                console.log(res);
                if (res !== undefined) {
                    // this.shiftRepo.start(res:)
                    let resData: StartShift = res as StartShift;
                    let objAssign = Object.assign({ startOperationalCash: 0, subBranchId: this.onSubBranchID, deviceId: this.randomUtil.generateUUID() }, resData);
                    console.log(objAssign);
                    this.shiftRepo.start(objAssign as StartShift).then(res => {
                        if (res) {
                            this.isActive = this.shift?.status === 'OPEN' ? true : false
                            this.shiftRepo.check()
                        }
                    })
                }
            })
        }
    }



    checkSubBranch() {
        if (this.shift === undefined) {
            return this.shiftRepo.user.subBranchId
        }
        return this.shift.subBranchId
    }


    initFields(): any {
        let fields = []
        fields = [
            this.formUtil.generateObjectForm('startCash', 'currency', 'Masukan Jumlah Uang', 'Cth. Rp. 1000', 'money', null, true, true, {}),
            this.formUtil.generateObjectForm('type', 'dropdown', 'Pilih Sesi Pergantian Shift', '', 'change_circle', 'SIANG', true, true, [
                { key: 'SIANG', label: 'Shift Siang' },
                { key: 'MALAM', label: 'Shift Malam' }
            ]),
        ]
        // let form: FormGroup = new FormGroup({
        //     fields: new FormControl(JSON.stringify(fields)),
        // });
        return fields;
    }

    refreshShift() {
        this.isRefresh = true;
        setTimeout(() => {
            this.isRefresh = false
            this.shiftRepo.check()
        }, 1000)
    }

    goToSetting() {
        this.router.navigate(['setting'])
    }
}