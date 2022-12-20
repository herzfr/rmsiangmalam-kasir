import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { CreateIncomeCash, CreateIncomeOther, FilterIncome, IncomeUp } from '../_model/other-income.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};


@Injectable({ providedIn: 'root' })
export class OtherIncomeService {
    constructor(private http: HttpClient) { }

    getIncome(filter: FilterIncome): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/income/get', filter, httpOptions)
    }

    createIncome(create: IncomeUp): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/income/input', create, httpOptions)
    }

}