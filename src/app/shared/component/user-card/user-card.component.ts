import { Component, Input, OnInit } from '@angular/core';
import { UserLogin } from 'src/app/auth/auth.model';

@Component({
    selector: 'user-apps',
    templateUrl: 'user-card.component.html',
    styleUrls: ['user-card.component.css']
})

export class UserCardComponent implements OnInit {
    @Input() user?: UserLogin;
    constructor() { }

    ngOnInit() { }
}