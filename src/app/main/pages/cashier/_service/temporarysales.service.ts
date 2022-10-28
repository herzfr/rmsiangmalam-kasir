import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { environment } from 'src/environments/environment';
import { CartLine } from '../../order/_model/_cart/cart.model';
import { Merge, Split } from '../../order/_model/_tempsales/tempsales.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};

@Injectable({ providedIn: 'root' })
export class TemporarySalesService {
    constructor(private http: HttpClient) { }

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