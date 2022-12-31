import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { GeneralResponse } from 'src/app/_model/general.interface';
import { CreateReservation, FindReservation } from '../_model/reservation/reservation.model';

const URL = environment.url
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
};

@Injectable({ providedIn: 'root' })
export class ReservationService {
    constructor(private http: HttpClient) { }

    // CREATE RESERVATION METHOD
    createReservation(create: CreateReservation): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/booking/create', create, httpOptions)
    }

    // UPDATE STATUS RESERVATION METHOD
    updateReservation(id?: number, status?: boolean): Observable<GeneralResponse> {
        const obj = JSON.stringify({ id: id, isDone: status })
        return this.http.put<GeneralResponse>(URL + 'pos/booking/update/status', obj, httpOptions)
    }

    // GET ALL RESERVATION METHOD
    getReservation(find: FindReservation): Observable<GeneralResponse> {
        return this.http.post<GeneralResponse>(URL + 'pos/booking/', find, httpOptions)
    }
}
