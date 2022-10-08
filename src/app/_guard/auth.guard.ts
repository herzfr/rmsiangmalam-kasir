import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserRespository } from '../auth/auth.repository';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private userRepo: UserRespository) { }

    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (_route.url[0].path == 'login') {
            if (!this.userRepo.isLogin && !this.userRepo.getUserLogin()) {
                return true;
            } else {
                this.router.navigate(['/v2']);
                return false;
            }
        } else {
            if (!this.userRepo.isLogin && !this.userRepo.getUserLogin()) {
                this.router.navigate(['/login'], {
                    queryParams: { returnUrl: state.url },
                });
                return false
            } else {
                return true;
            }
        }
    }

}