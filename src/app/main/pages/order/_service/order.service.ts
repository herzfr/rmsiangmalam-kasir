import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { Observable } from 'rxjs';
import { FillShortcut, FindMenu } from '../_model/order.model';
import * as _ from 'lodash';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};


@Injectable({ providedIn: 'root' })
export class OrderService {
    constructor(private http: HttpClient) { }

    getPriceCategory(): Observable<GeneralResponse> {
        return this.http.get<GeneralResponse>(URL + 'price-category', httpOptions)
    }

    getCustomer(): Observable<GeneralResponse> {
        return this.http.get<GeneralResponse>(URL + 'customer', httpOptions)
    }

    getProductCategory(): Observable<GeneralResponse> {
        return this.http.get<GeneralResponse>(URL + 'product-category', httpOptions)
    }

    // ==================================================================================================================
    // MENU

    getMenuProduct(search: FindMenu, subbranchId: number | null): Observable<GeneralResponse> {
        if (!_.isNull(subbranchId)) {
            return this.http.post<GeneralResponse>(URL + 'pos/menu/subbranch/single/' + subbranchId, search, httpOptions)
        } else {
            return this.http.post<GeneralResponse>(URL + 'pos/menu/branch/single', search, httpOptions)
        }

    }

    getMenuPackage(search: FindMenu, subbranchId: number | null): Observable<GeneralResponse> {
        if (!_.isNull(subbranchId)) {
            return this.http.post<GeneralResponse>(URL + 'pos/menu/subbranch/package/' + subbranchId, search, httpOptions)
        } else {
            return this.http.post<GeneralResponse>(URL + 'pos/menu/branch/package', search, httpOptions)
        }
    }

    // MENU
    // ==================================================================================================================

    // ==================================================================================================================
    // SHORTCUT

    getMenuShortcut(subbranchId: number | null): Observable<GeneralResponse> {
        if (!_.isNull(subbranchId)) {
            return this.http.get<GeneralResponse>(URL + 'pos/menu/subbranch/shortcut/get/' + subbranchId, httpOptions)
        } else {
            return this.http.get<GeneralResponse>(URL + 'pos/menu/branch/shortcut/get', httpOptions)
        }
    }

    addMenuShortcut(fillShorcut: FillShortcut): Observable<GeneralResponse> {
        if (!_.isNull(fillShorcut.subBranchId)) {
            return this.http.post<GeneralResponse>(URL + 'pos/menu/subbranch/shortcut/add', fillShorcut, httpOptions)
        } else {
            return this.http.post<GeneralResponse>(URL + 'pos/menu/branch/shortcut/add', fillShorcut, httpOptions)
        }
    }

    updateMenuShortcut(fillShorcut: FillShortcut): Observable<GeneralResponse> {
        if (!_.isNull(fillShorcut.subBranchId)) {
            return this.http.post<GeneralResponse>(URL + 'pos/menu/subbranch/shortcut/edit' + fillShorcut, httpOptions)
        } else {
            return this.http.post<GeneralResponse>(URL + 'pos/menu/branch/shortcut/edit' + fillShorcut, httpOptions)
        }
    }

    deleteMenuShortcut(id: number): Observable<GeneralResponse> {
        return this.http.delete<GeneralResponse>(URL + 'pos/menu/branch/shortcut/' + id, httpOptions)
    }

    // SHORTCUT
    // ==================================================================================================================





}