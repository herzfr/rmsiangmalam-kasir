import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { environment } from 'src/environments/environment';
import { FindPayment } from '../_model/payment/payment.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};

@Injectable({ providedIn: 'root' })
export class WarehouseService {
    constructor(private http: HttpClient) { }

    // GET ALL WAREHOUSE
    getAllWarehouse(): Observable<GeneralResponse> {
        return this.http.get<GeneralResponse>(URL + 'warehouse', httpOptions)
    }

    getAllWarehousev2(search: string): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'warehouse/get', search, httpOptions)
    }





}