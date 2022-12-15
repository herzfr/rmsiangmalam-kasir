import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};


@Injectable({ providedIn: 'root' })
export class ExpenseService {
    constructor(private http: HttpClient) { }

    getIncome(filter: any): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/income/get', filter, httpOptions)
    }

    createIncome(create: any): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/income/input', create, httpOptions)
    }

}