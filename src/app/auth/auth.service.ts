import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GeneralResponse } from '../_model/general.interface';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};



@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string): Observable<GeneralResponse> {
        const obj = { username: username, password: password }
        return this.http.post<GeneralResponse>(URL + 'auth/login', obj, httpOptions)
    }

    refresh(): Observable<GeneralResponse> {
        let httpOptionsRefresh = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            withCredentials: true,
        };
        return this.http.post<GeneralResponse>(URL + 'auth/refresh', {}, httpOptions);
    }

    logout(): Observable<any> {
        return this.http.post(URL + 'auth/logout', {}, httpOptions);
    }

}