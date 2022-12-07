import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Price, Product } from 'src/app/main/pages/order/_model/menu.model';

@Component({
    selector: 'product-card',
    template: `
    <div [ngClass]="active? '' : 'disable-product'" class="card-product text-center py-2">
        <div (click)="chooseItem()">
            <div class="relative">
                <div *ngIf="position > 0" class="box-badge">{{ position }}</div>
                <img uiImageLoader class="img-product" onErrorSrc="assets/images/no_pic_square.png" loader="assets/images/no_pic_square.png"[src]="pictures" [alt]="name">
            </div>
        </div>
        <div (click)="chooseItem()">
            <div *ngIf="category" class="my-2 mx-10">
                <p class="price-category mb-0">{{ category }}</p>
            </div>
            <p class="product-name mx-10 text-start">{{ name }}</p>
            <p class="product-price mb-0 mx-10 text-start"><strong class="mr-2px">{{ price | rupiah }}</strong><span class="unit-price">/{{ unit }}</span></p>
        </div>
        <!-- <p class="fst-italic">{{ size }}</p> -->
        <div class="d-flex justify-content-between mx-10">
            <p class="text-start mb-0 f-11px">Stok : <span  [ngClass]="{'on-text-danger': quantity === 0, 'on-text-warning' : quantity > 0 && quantity < 10, 'on-text-success' : quantity > 10 }">{{ quantity }}</span></p>
            <mat-icon yPosition="below" xPosition="after" [matMenuTriggerFor]="optproduct" class="utama"color="dark" svgIcon="three-dot"></mat-icon>
            <mat-menu #optproduct="matMenu">
                <button *ngIf="position > 0" mat-menu-item>Hapus dari menu utama</button>
                <button  (click)="shortcutThis()" *ngIf="position < 1" mat-menu-item>Daftarkan ke menu utama</button>
            </mat-menu>
        </div>
    </div>
    `,
    styleUrls: ['product-card.component.css']
})

export class ProductCardComponent implements OnInit {
    @Input() item?: Product;
    @Input() id: string = '';
    @Input() priceCategory?: string;
    @Input() active?: boolean;
    @Input() pictures?: string;
    @Input() name?: string;
    @Input() desc?: string;
    @Input() size?: string;
    @Input() unit?: string;
    @Input() quantity: number = 0;
    @Input() prices?: Price[];
    @Input() position: number = 0;

    @Output() on_shortcut = new EventEmitter<string>();
    @Output() on_item = new EventEmitter<Product>();
    constructor() { }

    ngOnInit() { }

    get price(): number {
        return this.prices?.find(x => x.priceCategory == this.priceCategory)?.price ?? 0
    }

    get category(): string | undefined {
        return this.prices?.find(x => x.priceCategory == this.priceCategory)?.priceCategory
    }

    shortcutThis() {
        this.on_shortcut.emit(this.id);
    }

    chooseItem() {
        this.on_item.emit(this.item)
    }
}