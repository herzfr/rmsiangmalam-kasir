import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { CancelStatus, FilterStock, Receive, Send, UpdateStatus } from '../_model/transfer-stock.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};


@Injectable({ providedIn: 'root' })
export class TransferStockService {
    constructor(private http: HttpClient) { }

    getListTransferProduct(endpoint: 'send' | 'receive', filter: FilterStock): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + `pos/prodtransfer/${endpoint}`, filter, httpOptions)
    }

    createTransferStock(create: Send | Receive): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/prodtransfer/create', create, httpOptions)
    }

    upateTransferStock(update: UpdateStatus): Observable<GeneralResponse> {
        return this.http.put<GeneralResponse>(URL + 'pos/prodtransfer/updatestat', update, httpOptions)
    }

    cancelTransferStock(cancel: CancelStatus): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/prodtransfer/cancel', cancel, httpOptions)
    }

}