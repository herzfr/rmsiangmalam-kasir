import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { environment } from 'src/environments/environment';
import { AddCash, QueryShift, QueryShiftDetail, StartShift } from '../_model/shift/shift.model';


const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};


@Injectable({ providedIn: 'root' })
export class ShiftService {
    constructor(private http: HttpClient) { }

    checkShift(branchId: number | null, subBranchId: number | null): Observable<GeneralResponse> {
        const obj = { branchId: branchId, subBranchId: subBranchId }
        return this.http.post<GeneralResponse>(URL + 'pos/shift/check', obj, httpOptions)
    }

    startShift(shift: StartShift): Observable<GeneralResponse> {
        const obj = JSON.stringify(shift)
        return this.http.post<GeneralResponse>(URL + 'pos/shift/start', obj, httpOptions)
    }

    stopShift(id: number): Observable<GeneralResponse> {
        const obj = JSON.stringify({ id: id })
        return this.http.post<GeneralResponse>(URL + 'pos/shift/stop', obj, httpOptions)
    }

    getAllShift(query: QueryShift): Observable<GeneralResponse> {
        const obj = JSON.stringify(query)
        return this.http.post<GeneralResponse>(URL + 'pos/shift/get', obj, httpOptions)
    }

    getShiftDetail(query: QueryShiftDetail): Observable<GeneralResponse> {
        const obj = JSON.stringify(query)
        return this.http.post<GeneralResponse>(URL + 'pos/shift/get/detail', obj, httpOptions)
    }

    addCash(data: AddCash): Observable<GeneralResponse> {
        const obj = JSON.stringify(data)
        return this.http.post<GeneralResponse>(URL + 'pos/shift/addcash', obj, httpOptions)
    }


}