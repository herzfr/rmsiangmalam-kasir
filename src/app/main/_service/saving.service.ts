import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { CreateSaving } from '../_model/saving/saving.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};

@Injectable({ providedIn: 'root' })
export class SavingService {
    constructor(private http: HttpClient) { }

    // SAVING MONEY
    getSaving(branchId: number | null, subBranchId: number | null): Observable<GeneralResponse> {
        if (subBranchId != null) {
            return this.http.get<GeneralResponse>(URL + 'pos/saving/subbranch/' + subBranchId, httpOptions)
        } else {
            return this.http.get<GeneralResponse>(URL + 'pos/saving/subbranch/' + branchId, httpOptions)
        }
    }

    saving(create: CreateSaving): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/saving/add', create, httpOptions)
    }

}
