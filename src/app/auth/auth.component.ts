import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormUtil } from '../_utility/form.util';
import { UserRespository } from './auth.repository';

@Component({
    selector: 'auth-app',
    templateUrl: 'auth.component.html',
    styleUrls: ['auth.component.css'],
    encapsulation: ViewEncapsulation.None,
})

export class AuthComponent implements OnInit {
    isLoading = false;
    // ============================
    // FORM
    // 
    public form: FormGroup;
    public unsubcribe: any;

    public fields: any[] = [];
    constructor(public formUtil: FormUtil, public userRepository: UserRespository, private router: Router) {
        this.fields = [
            formUtil.generateObjectForm('username', 'text', 'Masukan username', 'Cth. budisetiawan', 'user', null, true, true, {}),
            formUtil.generateObjectForm('password', 'password', 'Masukan password', '', undefined, null, true, false, {}),
        ]

        this.form = new FormGroup({
            fields: new FormControl(JSON.stringify(this.fields)),
        });
        // console.log(this.form);
        this.unsubcribe = this.form.valueChanges.subscribe((update) => {
            this.fields = JSON.parse(update.fields);
        });
    }

    ngOnInit() {

    }

    onSubmitData(data: any) {
        this.isLoading = true;
        this.userRepository.signIn(data.username, data.password).then(() => setTimeout(() => { this.isLoading = false; this.goToMain() }, 1000));
    }

    getFields() {
        // // console.log(this.fields);
        return this.fields;
    }

    goToMain() {
        this.router.navigateByUrl('/')
    }

    ngDistroy() {
        this.unsubcribe();
    }






}