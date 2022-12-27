import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { FilterShift } from '../_model/shift.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};


@Injectable({ providedIn: 'root' })
export class ShiftServiceL {
    constructor(private http: HttpClient) { }

    getShiftList(filter: FilterShift): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/shift/get/detail', filter, httpOptions)
    }



}