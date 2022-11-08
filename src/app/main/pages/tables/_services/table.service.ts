import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { environment } from 'src/environments/environment';
import { CreateTable, FindTable, UpdateOccupation, UpdateTable } from '../_model/table.model';

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

    createTables(body: CreateTable): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/tables/create', body, httpOptions)
    }

    updateTables(body: UpdateTable): Observable<GeneralResponse> {
        return this.http.put<GeneralResponse>(URL + 'pos/tables/update', body, httpOptions)
    }

    updateOccupation(body: UpdateOccupation): Observable<GeneralResponse> {
        return this.http.put<GeneralResponse>(URL + 'pos/tables/occupation', body, httpOptions)
    }

    deleteTable(id: number): Observable<GeneralResponse> {
        return this.http.delete<GeneralResponse>(URL + 'pos/tables/' + id, httpOptions)
    }


}