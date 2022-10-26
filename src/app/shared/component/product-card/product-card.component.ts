import { Component, Input, OnInit } from '@angular/core';
import { Price } from 'src/app/main/pages/order/_model/menu.model';

@Component({
    selector: 'product-card',
    template: `
    <div [ngClass]="active? '' : 'disable-product'" class="card-product text-center py-2">
        <img class="img-product" [src]="pictures" [alt]="name">
        <p class="mb-0 mt-2">{{ name }}</p>
        <p class="mb-0"><strong>{{ price | rupiah }}</strong>/{{ unit }}</p>
        <p class="fst-italic">{{ size }}</p>
        <p [ngClass]="{'text-danger': quantity === 0, 'text-warning' : quantity > 0 && quantity < 10, 'text-info' : quantity > 10 }" >{{ quantity }}</p>
    </div>`,
    styleUrls: ['product-card.component.css']
})

export class ProductCardComponent implements OnInit {
    @Input() priceCategory?: string;
    @Input() active?: boolean;
    @Input() pictures?: string;
    @Input() name?: string;
    @Input() desc?: string;
    @Input() size?: string;
    @Input() unit?: string;
    @Input() quantity: number = 0;
    @Input() prices?: Price[];

    constructor() { }

    ngOnInit() { }

    get price(): number {
        return this.prices?.find(x => x.priceCategory == this.priceCategory)?.price ?? 0
    }
}