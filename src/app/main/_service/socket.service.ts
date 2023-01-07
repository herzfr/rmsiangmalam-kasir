import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketService {


    private socket: any;
    public socketId = '';
    private socketStatus = new BehaviorSubject<boolean>(false);;

    constructor() { }

    connect() {
        this.socket = io(environment.socketHost, {
            path: '/ws/'
        });
    }

    listenError(): Observable<any> {
        return Observable.create((observer: any) => {
            this.socket.on('error', (message: any) => {
                observer.next(JSON.stringify(message.response));
            });
        });
    }

    checkConnectionStatus() {
        this.socket.on("connect", () => {
            // console.log("Socket Server connected!");
            // console.log("Socket ID: ", this.socket.id)
            this.setSocketStatus(true);
            this.socketId = this.socket.id;
        });
        this.socket.on("disconnect", () => {
            this.setSocketStatus(false);
            alert("Koneksi Socket Gagal")
        });
    }

    sendTrigger(data: any) {
        this.socket.emit('salesEmit', data)
    }

    disconnect() {
        this.socket.disconnect();
    }

    /* Set Socket Status Variable Value Function */
    setSocketStatus(value: boolean) {
        this.socketStatus.next(value);
    }

    /* get Socket Status Variable Value Function */
    getSocketStatus(): Observable<boolean> {
        return this.socketStatus.asObservable();
    }

    // Handle socket receive event
    listenTriggerData() {
        return new Observable((observer: Observer<string>) => {
            observer.next(
                //Get Emit Data From "salesTrigger"
                this.socket.on('salesTrigger', (data: string) => {
                    // console.log("listen trigger:", data);
                    observer.next(data);
                })
            );
        });
    }

}

