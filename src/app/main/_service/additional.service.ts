import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { FindDiscount } from '../_model/discount/discount.model';
import { FindAdditional } from '../_model/additional/additional.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};

@Injectable({ providedIn: 'root' })
export class AdditionalService {
    constructor(private http: HttpClient) { }

    getAdditional(body: FindAdditional): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'general/parameter/get', body, httpOptions)
    }


}