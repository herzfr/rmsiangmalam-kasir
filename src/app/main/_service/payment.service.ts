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
export class PaymentService {
    constructor(private http: HttpClient) { }

    // GET ALL PAYMENT METHOD
    getPaymentMethod(find: FindPayment): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'general/paymenttype/get', find, httpOptions)
    }

}