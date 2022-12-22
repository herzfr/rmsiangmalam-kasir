import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { CreateExpense, FilterExpense, UploadReceiptImage } from '../_model/expense.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};


@Injectable({ providedIn: 'root' })
export class ExpenseService {
    constructor(private http: HttpClient) { }

    getExpense(filter: FilterExpense): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'expenses/cashier/get', filter, httpOptions)
    }

    createExpense(create: CreateExpense): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'expenses/cashier/input', create, httpOptions)
    }

    uploadReceipt(upload: UploadReceiptImage) {
        let httpOptions = { withCredentials: true };

        let form = new FormData();
        form.append('file', upload.file as any);
        form.append('id', upload.id as any);

        return this.http.post<GeneralResponse>(URL + 'expenses/cashier/uploadreceipt', form, httpOptions)
    }

}