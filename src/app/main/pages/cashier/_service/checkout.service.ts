import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { environment } from 'src/environments/environment';
import { Checkout } from '../_model/checkout/checkout.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};

@Injectable({ providedIn: 'root' })
export class CheckoutService {
    constructor(private http: HttpClient) { }

    // GET ALL
    checkout(checkout: Checkout): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/sales/checkout', checkout, httpOptions)
    }

}