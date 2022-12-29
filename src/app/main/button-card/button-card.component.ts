import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface ButtonRoute {
    icon: string,
    title: string,
    route: string,
    params: any | null
}

@Component({
    selector: 'button-card',
    template: `
        <div class="card-primary">
            <p class="text-title-general">Menu</p>
            <div class="container">
                <div class="row row-cols-3">
                    <div (click)="navigateTo(btn.route, btn.params)" class="col cursor-pointer" *ngFor="let btn of buttons">
                        <div class="text-center button-box-menu">
                            <mat-icon [svgIcon]="btn.icon"></mat-icon>
                            <div class="text-wrap">
                            {{ btn.title }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="row justify-content-around">
                <div (click)="navigateTo(btn.route, btn.params)" class="col-3 button-display-card text-center p-3 m-2" *ngFor="let btn of buttons">
                    <mat-icon>{{ btn.icon }}</mat-icon>
                    <div class="text-wrap" style="width: 6rem;">
                    {{ btn.title }}
                    </div>
                </div>
            </div> -->
        </div>
    `,
    styleUrls: ['button-card.component.css']
})
export class ButtonCardComponent implements OnInit {

    buttons: ButtonRoute[] = [
        { icon: 'cashier-menu', title: 'Sistem Kasir', route: 'v2/cashier', params: { nav: 'list' } },
        { icon: 'order-menu', title: 'Pesan Menu', route: 'v2/order', params: { nav: 'shortcut' } },
        { icon: 'shift-menu', title: 'Daftar Shift', route: 'v2/shift', params: null },
        { icon: 'reservation-menu', title: 'Reservasi', route: 'v2/reservation', params: null },
        { icon: 'table-menu', title: 'Meja', route: 'v2/tables', params: null },
        { icon: 'other-expanse-menu', title: 'Pengeluaran Kas', route: 'v2/expense', params: null },
        { icon: 'other-income-menu', title: 'Pemasukan Lain', route: 'v2/other-income', params: null },
        { icon: 'stock-menu', title: 'Transfer Produk', route: 'v2/transfer-stock', params: null },
    ]

    //  { queryParams: { param: 'shortcut' } }
    // this.router.navigate(['/v2/order'], { queryParams: { param: 'shortcut' } });


    constructor(private route: Router) { }

    ngOnInit() { }

    get data() {
        return Array.from({ length: 10 }, (_, i) => i + 1)
    }

    navigateTo(route: string, params: any) {
        this.route.navigate([route], { queryParams: params })
    }
}