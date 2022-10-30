import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { environment } from 'src/environments/environment';
import { CartLine } from '../../order/_model/_cart/cart.model';
import { FindTempSales, Merge, Split } from '../_model/tempsales.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};

@Injectable({ providedIn: 'root' })
export class TemporarySalesService {
    constructor(private http: HttpClient) { }

    // GET ALL
    getTempSales(find: FindTempSales): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/tempsales/get', find, httpOptions)
    }

    // GET BY ID 
    getTempSalesById(id: number): Observable<GeneralResponse> {
        return this.http.get<GeneralResponse>(URL + 'pos/tempsales/get/' + id, httpOptions)
    }

    // CREATE
    createTempSales(cart: CartLine): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/tempsales/create', cart, httpOptions)
    }

    // UPDATE
    updateTempSales(cart: CartLine): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/tempsales/update', cart, httpOptions)
    }

    // CANCEL
    cancelTempSales(salesId: number, note: string): Observable<GeneralResponse> {
        const payload = JSON.stringify({ salesId: salesId, note: note })
        return this.http.post<GeneralResponse>(URL + 'pos/tempsales/cancel', payload, httpOptions)
    }

    // SPLIT
    splitTempSales(split: Split): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/tempsales/bill/split', split, httpOptions)
    }

    // MERGE
    mergeTempSales(merge: Merge): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/tempsales/bill/merge', merge, httpOptions)
    }



}