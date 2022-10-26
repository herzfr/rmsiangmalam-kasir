import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Price, ProductPackage } from 'src/app/main/pages/order/_model/menu.model';

@Component({
    selector: 'package-card',
    template: `
    <div [ngClass]="active? '' : 'disable-product'" class="card-product text-center py-2">
        <img class="img-product" [src]="pictures" [alt]="name">
        <p class="mb-0 mt-2">{{ name }}</p>
        <p class="mb-0"><strong>{{ price | rupiah }}</strong></p>
        <p  class="p-shadow">{{ isStockUnavailable? 'Tersedia' : 'Tidak Tersedia' }}</p>
        <ul class="list-group list-group-flush scroll-list">
            <li class="list-group-item d-flex justify-content-between align-items-start text-start" *ngFor="let item of products">{{ item.name }}
                <span [ngClass]="{'bg-danger': item.quantity === 0, 'bg-warning' : item.quantity > 0 && item.quantity < 10, 'bg-info' : item.quantity > 10 }" class="badge rounded-pill">{{ item.quantity }}</span>
            </li>
        </ul>
    </div>`,
    styleUrls: ['package-card.component.css']
})

export class PackageCardComponent implements OnInit {
    @Input() priceCategory?: string;
    @Input() active?: boolean;
    @Input() pictures?: string;
    @Input() name?: string;
    @Input() desc?: string;
    @Input() prices?: Price[];
    @Input() products: ProductPackage[] = []

    constructor() { }

    ngOnInit() { }

    get price(): number {
        return this.prices?.find(x => x.priceCategory == this.priceCategory)?.price ?? 0
    }

    get isStockUnavailable(): boolean {
        return this.products.some(x => x.quantity > 0)
    }

    getDetailStock(): ProductPackage[] {
        return this.products as ProductPackage[]
    }
}