import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TempSales } from 'src/app/main/pages/cashier/_model/tempsales.model';

@Component({
    selector: 'order-card',
    template: `
        <div class="box-temp">
            <!-- HEADER -->
            <div class="d-flex header-temp" [class.active]="onselect">
                <div class="col d-flex">
                        <!-- MERGE CHECK -->
                        <mat-checkbox *ngIf="isMerge" [checked]="isChecked"
                            class="merge-check" (change)="inputIdMerge(temp?.id)"></mat-checkbox>
                        <!-- MERGE CHECK -->
                        <mat-icon [class.active]="onselect" class="icon-temp" svgIcon="bell"></mat-icon>
                        <p [class.active]="onselect" class="text-temp mb-0">ID Order : <span class="code-id">#{{ temp?.id }}</span></p>
                </div>
                <div class="col d-flex justify-content-end">
                    <mat-icon  [class.active]="onselect" class="icon-temp" svgIcon="calendar"></mat-icon>
                    <p  [class.active]="onselect" class="text-temp mb-0">{{ (temp?.createdAt?? today) | milistodate: "full" }}</p>
                    <mat-icon [class.active]="onselect" yPosition="below" xPosition="before" [matMenuTriggerFor]="optproduct" class="utama"color="dark" svgIcon="three-dot"></mat-icon>
                    <mat-menu #optproduct="matMenu">
                        <button (click)="onMerge(temp?.id)" mat-menu-item>Gabung Tagihan</button>
                        <button (click)="onSplit(temp?.id)" mat-menu-item>Pisah Tagihan</button>
                        <button (click)="onDelete(temp?.id)" mat-menu-item>Batalkan</button>
                    </mat-menu>
                </div>
            </div>
            <!-- HEADER -->
            <!-- BODY -->
            <div class="d-flex body-temp">
                <div class="col display-grid">
                    <div class="col d-flex">
                        <mat-icon  [class.active]="onselect" class="icon-temp" svgIcon="table"></mat-icon>
                        <p  [class.active]="onselect" class="text-temp mb-0"> {{ temp?.name == "" ? "" : temp?.name }}
                            <span *ngIf="temp?.tableIds!.length > 0" style="padding-left: 10px">T.</span>
                            {{temp?.tableIds!.length > 0? tableIs : "Take Away" }}
                        </p>
                    </div>
                    <div class="col d-flex">
                        <mat-icon  [class.active]="onselect" class="icon-temp" svgIcon="cart"></mat-icon>
                        <p  [class.active]="onselect" class="text-temp mb-0">Jumlah : <strong>{{ temp?.items!.length }}</strong></p>
                    </div>
                    <div class="col d-flex">
                        <mat-icon  [class.active]="onselect" class="icon-temp" svgIcon="note"></mat-icon>
                        <p  [class.active]="onselect" class="text-temp mb-0">Catatan : <strong>{{ temp?.note != ""? temp?.note : "-" }}</strong></p>
                    </div>
                </div>
                <div class="col-5 display-grid opt-temp">
                    <div class="col display-grid">
                        <p [class.active]="onselect" class="pay-temp mb-0 text-end">Total Pembayaran</p>
                        <p [class.active]="onselect" class="total-temp mb-0 text-end">{{ (get_total?? 0) | rupiah }}</p>
                    </div>
                    <div class="col d-flex justify-content-end">
                        <button *ngIf="!onselect" (click)="onActive(temp?.id)" mat-button class="btn-see">Lihat</button>
                    </div>
                </div>
            </div>
            <!-- BODY -->
        </div>
    `,
    styleUrls: ['order-card.component.css']
})

export class OrderCardComponent implements OnInit {
    public day: Date = new Date()

    @Input() idx?: number;
    @Input() temp?: TempSales;
    @Input() isMerge: boolean = false;
    @Input() isChecked: boolean = false;
    @Input() onselect: boolean = false;
    @Input() checkList?: number;
    @Input() tableIs?: string;

    @Output() on_merge = new EventEmitter<any>();
    @Output() on_split = new EventEmitter<number>();
    @Output() on_delete = new EventEmitter<number>();
    @Output() on_active = new EventEmitter<number>();
    @Output() on_input_id_merge = new EventEmitter<number>();
    constructor() { }

    ngOnInit() {
        // // console.log(this.temp);

    }

    get today() {
        return this.day.getMilliseconds()
    }

    get get_total() {
        return this.temp?.items.reduce((a, b) => +a + b.totalPrice, 0)
    }

    onActive(id?: number) {
        this.on_active.emit(id)
    }

    onMerge(id?: number) {
        this.on_merge.emit({ id: id, waiter: this.temp?.waiter ?? '' })
    }

    onSplit(id?: number) {
        this.on_split.emit(id)
    }

    onDelete(id?: number) {
        this.on_delete.emit(id)
    }

    inputIdMerge(id?: number) {
        this.on_input_id_merge.emit(id)
    }

}