import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { GetReportSales } from '../_model/report.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};


@Injectable({ providedIn: 'root' })
export class ReportService {
    constructor(private http: HttpClient) { }

    getReportByShift(shiftId: number): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/salesreport', { shiftId: shiftId }, httpOptions)
    }

    getReport(filter: GetReportSales): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/sales/get/bystatus', filter, httpOptions)
    }

    getReportById(idSales: number): Observable<GeneralResponse> {
        return this.http.get<GeneralResponse>(URL + 'pos/sales/get/' + idSales, httpOptions)
    }


}