import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { FindDiscount } from '../_model/discount/discount.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};

@Injectable({ providedIn: 'root' })
export class DiscountService {
    constructor(private http: HttpClient) { }

    getDiscount(body: FindDiscount): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'discount', body, httpOptions)
    }


}