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
import { Role } from "../_constant/role";

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
        public dialog: DialogService) {
        this.checkLogin()

    }

    checkLogin() {
        let isLogin = localStorage.getItem('isLogin') || false
        if (Boolean(isLogin)) {
            this.authorizationTimer()
        }

    }

    async signIn(username: string, password: string): Promise<boolean> {
        let login: boolean = false;
        this.authService.login(username, password).subscribe((res: GeneralResponse) => {
            // console.log(res);

            if (res.statusCode == 0) {
                let usr = res.data as UserLogin
                if (_.isEqual(usr.role, Role.KASIR)) {
                    this.setUserLogin(usr)
                    this.setTimeSession()
                    this.authorizationTimer()
                    login = true
                    this.router.navigateByUrl('/')
                } else {
                    this.dialog.showSWEDialog("Oops!!!", "Anda bukan user Kasir", "error")
                }
            }

        }, (err: HttpErrorResponse) => {
            // console.log(err);

            if (err.status == 401) {
                this.dialog.showSWEDialog("Oops!!!", "Username tidak terdaftar atau Password Salah", "error")
            }

        })
        return await login;
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
        localStorage.clear()
    }

    authorizationTimer() {
        this.timerSubcriber = this.authTimer.subscribe(() => {
            this.runInterval();
        });
    }

    refreshToken() {
        this.authService.refresh().subscribe((res) => {
            // console.log(res);
            if (res['statusCode'] == 0) {
                //set dahulu session timenya
                let sessionTime = this.timeUtil.addMinutes(new Date(), environment.minuteSum);
                localStorage.setItem('TIME', sessionTime.toISOString());
                //end set time session
            }
        })
    }

    runInterval() {
        //ambil data dari session
        let sessionTime = localStorage.getItem(environment.sessionName);
        //jika session data empty
        if (_.isNil(sessionTime)) {
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
                console.log('refresh dong ');
                this.authService.refresh().subscribe((res) => {
                    //jika response refresh success
                    if (res['statusCode'] == 0) {
                        //set dahulu session timenya
                        let sessionTime = this.timeUtil.addMinutes(new Date(), environment.minuteSum);
                        localStorage.setItem('TIME', sessionTime.toISOString());
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
        localStorage.setItem(environment.sessionName, sessionTime.toISOString());
    }

    async setUserLogin(user: UserLogin) {
        await this.clean();
        await localStorage.setItem('M', CryptoJS.AES.encrypt(JSON.stringify(user), this.secretKey).toString());
        await localStorage.setItem('isLogin', (true).toString())
    }

    public getUserLogin(): UserLogin | boolean {
        let usr: any = localStorage.getItem('M')
            ? localStorage.getItem('M')
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
        return Boolean(localStorage.getItem('isLogin') ? localStorage.getItem('isLogin') : false)
    }

    isCashier(): any {
        let user = this.getUserLogin() as UserLogin
        return (user.role === Role.KASIR)

    }




}