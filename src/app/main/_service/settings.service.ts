import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { UpserSetting } from '../_model/setting/setting.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};

@Injectable({ providedIn: 'root' })
export class SettingService {
    constructor(private http: HttpClient) { }

    // CREATE SETTING
    createSetting(create: UpserSetting): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'general/setting/create', create, httpOptions)
    }

    // UPDATE SETTING
    updateSetting(update: UpserSetting): Observable<GeneralResponse> {
        return this.http.put<GeneralResponse>(URL + 'general/setting/edit', update, httpOptions)
    }

    // GET SETTING BY BRANCH
    getSetting(branchId: number, subBranchId: number | null): Observable<GeneralResponse> {
        const obj = { branchId: branchId, subBranchId: subBranchId }
        return this.http.post<GeneralResponse>(URL + 'general/setting/get', obj, httpOptions)
    }

    // GET ALL SETTING BY BRANCH
    getAllSetting(branchId: number, subBranchId: number | null, size: number, page: number): Observable<GeneralResponse> {
        const obj = { branchId: branchId, subBranchId: subBranchId, size: size, page: page }
        return this.http.post<GeneralResponse>(URL + 'general/setting/getAll', obj, httpOptions)
    }

}
