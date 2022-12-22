import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { EmployeeCash } from '../_model/employee/employee.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    constructor(private http: HttpClient) { }

    createCashEmployee(empl: EmployeeCash): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/employee/kasbon/apply', empl, httpOptions)
    }


}