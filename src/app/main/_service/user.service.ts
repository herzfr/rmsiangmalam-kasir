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
export class UsersService {
    constructor(private http: HttpClient) { }

    // GET ALL USER BY BRANCH
    getUserByBranch(id: number): Observable<GeneralResponse> {
        const obj = JSON.stringify({ branchId: id })
        return this.http.post<GeneralResponse>(URL + 'users/userdata', obj, httpOptions)
    }

    // GET USER BY ID
    getUserById(id: string): Observable<GeneralResponse> {
        return this.http.get<GeneralResponse>(URL + 'users/byid/' + id, httpOptions)
    }



}