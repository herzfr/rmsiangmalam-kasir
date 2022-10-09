import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserRespository } from '../auth/auth.repository';
import { UserLogin } from '../auth/auth.model';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private userRepo: UserRespository, private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });
    // return next.handle(req);
    return next.handle(req).pipe(catchError(error => {
      // if (error instanceof HttpErrorResponse && !req.url.includes('auth/signin') && error.status === 401) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(req, next);
      }
      return throwError(error);
    }));
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    console.log('test run 401');
    console.log(!this.isRefreshing);


    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      let user: UserLogin | undefined;
      this.authService.refresh().subscribe(res => {
        user = res.data
        this.userRepo.setUserLogin(res.data)
      });

      if (user !== undefined)
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

  private addTokenHeader(request: HttpRequest<any>) {
    return request.clone({ withCredentials: true });
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];

