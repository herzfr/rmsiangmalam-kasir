import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserRespository } from '../auth/auth.repository';
import { UserLogin } from '../auth/auth.model';
import { DialogService } from '../shared/dialogs/dialog.service';
import { map } from 'lodash';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private userRepo: UserRespository, private authService: AuthService, private dlg: DialogService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });
    // return next.handle(req)
    // return next.handle(req)
    return next.handle(req).pipe(catchError(error => {
      // if (error instanceof HttpErrorResponse && !req.url.includes('auth/signin') && error.status === 401) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(req, next);
      }
      return throwError(error);
    }));
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    // console.log('test run 401');
    if (typeof this.userRepo.getUserLogin() == 'boolean' && !(this.userRepo.getUserLogin())) {
      // console.log('belum login');
      this.dlg.showSWEDialog("Oops!!!", "Username tidak terdaftar atau Password Salah", "error")
      return throwError('error Username tidak terdaftar atau Password');
    } else {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      if (!this.isRefreshing) {
        return this.authService.refresh().pipe(
          switchMap((resMap: any) => {
            this.isRefreshing = false;

            this.userRepo.setUserLogin(resMap.data);
            this.refreshTokenSubject.next(resMap.data);

            return next.handle(this.addTokenHeader(request));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.userRepo.signOut();
            return throwError(err);
          })
        );
      }

      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(() => next.handle(this.addTokenHeader(request)))
      );
    }

    // if (!this.isRefreshing) {
    //   console.log('masuk ke !this.isRefreshing');

    //   this.isRefreshing = true;
    //   this.refreshTokenSubject.next(null);

    //   let user: UserLogin | undefined;
    //   // this.authService.refresh().subscribe(res => {
    //   //   user = res.data
    //   //   this.userRepo.setUserLogin(res.data)
    //   // });

    //   if (typeof this.userRepo.getUserLogin() == 'boolean' && !(this.userRepo.getUserLogin())) {
    //     console.log('belum login');

    //   } else {
    //     if (this.userRepo.getUserLogin())
    //       return this.authService.refresh().pipe(
    //         switchMap((resMap: any) => {
    //           this.isRefreshing = false;

    //           this.userRepo.setUserLogin(resMap.data);
    //           this.refreshTokenSubject.next(resMap.data);

    //           return next.handle(this.addTokenHeader(request));
    //         }),
    //         catchError((err) => {
    //           this.isRefreshing = false;
    //           this.userRepo.signOut();
    //           return throwError(err);
    //         })
    //       );
    //   }
    // }
    // console.log('diluar dari !this.isRefreshing');
    // return this.refreshTokenSubject.pipe(
    //   filter(token => token !== null),
    //   take(1),
    //   switchMap(() => next.handle(this.addTokenHeader(request)))
    // );
  }

  private addTokenHeader(request: HttpRequest<any>) {
    return request.clone({ withCredentials: true });
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];

