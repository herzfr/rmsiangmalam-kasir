import { Component, OnInit } from '@angular/core';
import { UserLogin } from '../auth/auth.model';
import { UserRespository } from '../auth/auth.repository';
import { DialogService } from '../shared/dialogs/dialog.service';

@Component({
    selector: 'main-app',
    templateUrl: 'main.component.html',
    styleUrls: ['main.component.css']
})

export class MainComponent implements OnInit {
    user: UserLogin;
    constructor(private userRepo: UserRespository, private dialog: DialogService) {
        this.user = typeof (userRepo.getUserLogin() !== 'boolean') ? userRepo.getUserLogin() as UserLogin : new UserLogin();
        console.log(this.user);
    }

    ngOnInit() { }

    logout() {
        this.dialog.showConfirmationDialog("Keluar?", "", "Apakah anda ingin keluar dari Halaman ini?", "logout", "Ya")
            .subscribe(confirm => {
                if (confirm) {
                    this.userRepo.signOut();
                }
            })
    }
}