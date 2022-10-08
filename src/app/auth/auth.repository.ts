import { Injectable } from "@angular/core";
import { interval, ReplaySubject } from "rxjs";
import { UserLogin } from "./auth.model";
import { AuthService } from "./auth.service";
import * as CryptoJS from 'crypto-js';
import * as _ from 'lodash';
import { GeneralResponse } from "../_model/general.interface";
import { Router } from "@angular/router";
import { TimeUtil } from "../_utility/time.util";
import { environment } from "src/environments/environment";
import { Static } from "../_constant/static";
import { HttpErrorResponse } from "@angular/common/http";
import { DialogService } from "../shared/dialogs/dialog.service";

@Injectable()
export class UserRespository {
    // private locator = (p: UserLogin, id?: number) => p.id == id;
    private secretKey = Static.secret_key;
    public encryptedMessage: any;
    public decryptedMessage: any;

    timeout_time = 13 * 60;
    time_remaining = 0;

    authTimer: any = interval(environment.checkinterval);
    timerSubcriber: any;

    constructor(private authService: AuthService, private router: Router, private timeUtil: TimeUtil,
        public dialog: DialogService) { }

    async signIn(username: string, password: string): Promise<boolean> {
        let login: boolean = false;
        await this.authService.login(username, password).subscribe((res: GeneralResponse) => {
            if (res.statusCode == 0) {
                this.setUserLogin(res.data as UserLogin)
                this.setTimeSession()
                this.authorizationTimer()
                login = true
            }
        }, (err: HttpErrorResponse) => {
            if (err.status == 401) {
                this.dialog.showInfoDialog("Oops!!!", "Terjadi kesalahan", "Username tidak terdaftar atau Password Salah", "access-danied")
            }

        })
        return login;
    }

    signOut() {
        this.authService.logout().subscribe((res: GeneralResponse) => {
            if (res.statusCode == 0) {
                this.clean()
                window.location.reload()
            }
        }, (err) => {
            alert(err)
        })
    }

    clean() {
        sessionStorage.clear()
    }

    authorizationTimer() {
        this.timerSubcriber = this.authTimer.subscribe(() => {
            this.runInterval();
        });
    }

    runInterval() {
        //ambil data dari session
        let sessionTime = sessionStorage.getItem(environment.sessionName);

        //jika session data empty
        if (_.isNil(sessionTime)) {
            // console.log('sesion data empty');
            this.timerSubcriber.unsubscribe();
        } else {
            //ambil tengat waktu dari sessionTime
            let timeExp = new Date(sessionTime);
            //ambil waktu sekarang
            let timeNow = new Date();
            //ambil selisih waktunya dalam detik
            let seconds = (timeExp.getTime() - timeNow.getTime()) / 1000;

            //jika selisih nya kurang dari 0 atau yang lainnya (yang sudah di tentukan di threshold env)
            if (seconds < 0 || seconds < environment.thresholdTime) {
                // console.log('refresh dong ');
                this.authService.refresh().subscribe((res) => {
                    //jika response refresh success
                    if (res['statusCode'] == 0) {
                        //set dahulu session timenya
                        let sessionTime = this.timeUtil.addMinutes(new Date(), environment.minuteSum);
                        sessionStorage.setItem('TIME', sessionTime.toISOString());
                        //end set time session
                    }
                });
            }
        }
    }

    stopInterval() {
        this.timerSubcriber.unsubscribe();
    }

    async setTimeSession() {
        let sessionTime = this.timeUtil.addMinutes(new Date(), environment.minuteSum);
        sessionStorage.setItem(environment.sessionName, sessionTime.toISOString());
    }

    async setUserLogin(user: UserLogin) {
        await this.clean();
        await sessionStorage.setItem('M', CryptoJS.AES.encrypt(JSON.stringify(user), this.secretKey).toString());
        await sessionStorage.setItem('isLogin', (true).toString())
    }

    public getUserLogin(): UserLogin | boolean {
        let usr: any = sessionStorage.getItem('M')
            ? sessionStorage.getItem('M')
            : null;
        if (usr != null) {
            return JSON.parse(
                CryptoJS.AES.decrypt(usr, this.secretKey).toString(
                    CryptoJS.enc.Utf8
                )
            );
        } else {
            return false;
        }
    }

    get isLogin(): boolean {
        return Boolean(sessionStorage.getItem('isLogin') ? sessionStorage.getItem('isLogin') : false)
    }




}