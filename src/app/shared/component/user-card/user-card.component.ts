import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserLogin } from 'src/app/auth/auth.model';

@Component({
    selector: 'user-apps',
    templateUrl: 'user-card.component.html',
    styleUrls: ['user-card.component.css']
})

export class UserCardComponent implements OnInit {
    @Input() user?: UserLogin;
    @Output() logoutEmit = new EventEmitter<any>();
    constructor() { }

    ngOnInit() { }

    logout_confirmation() {
        this.logoutEmit.emit();
    }
}