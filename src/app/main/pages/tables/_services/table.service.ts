import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { environment } from 'src/environments/environment';
import { FindTable } from '../_model/table.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};


@Injectable({ providedIn: 'root' })
export class TableService {
    constructor(private http: HttpClient) { }

    getTables(body: FindTable): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/tables/get', body, httpOptions)
    }

}