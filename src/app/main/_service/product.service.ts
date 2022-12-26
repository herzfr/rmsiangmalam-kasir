import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { environment } from 'src/environments/environment';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};

@Injectable({ providedIn: 'root' })
export class ProductService {
    constructor(private http: HttpClient) { }

    // GET ALL PRODUCT
    get_all_product(branchId: number | null, subBranchId: number | null, search: string): Observable<GeneralResponse> {
        const obj = { branchId: branchId, subBranchId: subBranchId, search: search }
        return this.http.post<GeneralResponse>(URL + 'stock-product/get', obj, httpOptions)
    }





}