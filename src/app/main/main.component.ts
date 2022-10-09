import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserLogin, UserLoginSubBranch } from '../auth/auth.model';
import { UserRespository } from '../auth/auth.repository';
import { DialogService } from '../shared/dialogs/dialog.service';
import { Level } from '../_constant/role';
import { Shift } from './_model/shift/shift.model';
import { ShiftRepository } from './_model/shift/shift.repository';

@Component({
    selector: 'main-app',
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.css']
})

export class MainComponent implements OnInit {
    user: UserLogin;
    shift: Shift | undefined;
    subsShift?: Subscription;
    constructor(private userRepo: UserRespository, private dialog: DialogService, public shiftRepo: ShiftRepository) {
        this.user = typeof (userRepo.getUserLogin() !== 'boolean') ? userRepo.getUserLogin() as UserLogin : new UserLogin();
        console.log(this.user);
    }

    ngOnInit() {
        this.subsShift = this.shiftRepo.getShiftObs().subscribe((newData) => {
            this.shift = newData;
            console.log(newData);
        });
    }

    ngOnDestroy() {
        this.subsShift?.unsubscribe()
    }

    logout() {
        this.dialog.showConfirmationDialog("Keluar?", "", "Apakah anda ingin keluar dari Halaman ini?", "logout", "Ya")
            .subscribe(confirm => {
                if (confirm) {
                    this.userRepo.signOut();
                }
            })
    }

    get isSubBranch() {
        return (this.user.level == Level.SUBBRANCH)
    }



}