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
        <div class="container">
            <div class="row justify-content-around">
                <div (click)="navigateTo(btn.route, btn.params)" class="col-3 button-display-card text-center p-3 m-2" *ngFor="let btn of buttons">
                    <mat-icon>{{ btn.icon }}</mat-icon>
                    <div class="text-wrap" style="width: 6rem;">
                    {{ btn.title }}
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['button-card.component.css']
})
export class ButtonCardComponent implements OnInit {

    buttons: ButtonRoute[] = [
        { icon: 'point_of_sale', title: 'Sistem Kasir', route: 'v2/cashier', params: null },
        { icon: 'brunch_dining', title: 'Pesan Menu', route: 'v2/order', params: { nav: 'shortcut' } },
        { icon: 'edit_calendar', title: 'Reservasi', route: 'v2/order', params: null },
        { icon: 'table_restaurant', title: 'Meja', route: 'v2/tables', params: null },
        { icon: 'money_off', title: 'Pengeluaran Kas', route: 'v2/order', params: null },
        { icon: 'payments', title: 'Pemasukan Lain', route: 'v2/order', params: null },
        { icon: 'local_shipping', title: 'Stok In/Out Produk', route: 'v2/order', params: null },
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