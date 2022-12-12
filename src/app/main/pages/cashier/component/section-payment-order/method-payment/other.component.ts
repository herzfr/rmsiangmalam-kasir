import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { CustomerListComponent } from 'src/app/main/_dialog/customerlist.component';
import { Customer } from 'src/app/main/_model/customer/customer.model';
import { CheckoutRepository } from '../../../_model/checkout/chekcout.repository';

@Component({
    selector: 'other-payment',
    template: `
    <div class="container">
        <p class="text-left mb-0 title-e">Pilih tipe pembayaran</p>
        <mat-radio-group [(ngModel)]="selected" aria-label="Select an option" class="">
            <mat-radio-button class="input-radio-button" value="EMPL_DEBT">Karyawan</mat-radio-button>
            <mat-radio-button class="input-radio-button" value="CUST_DEBT">Pelanggan</mat-radio-button>
        </mat-radio-group>

        <div class="d-flex w-100">
        <ng-container [ngSwitch]="selected">
            <div *ngSwitchCase="'EMPL_DEBT'" class="w-inherith">
                <p class="text-left mb-0 title-e">Pilih nama pelanggan yang akan ditagih</p>
                <p class="mb-0 text-label">Pelanggan (Opsional)</p>
                    <div [class.box-active]="checkoutRepo.in_customer"
                        class="d-flex justify-content-between align-items-center mb-2 box-x-container">
                        <p [ngClass]="checkoutRepo.in_customer? 'text-inline-a' : 'text-mute'"
                            class="mb-0 text-1-line">{{ checkoutRepo.in_customer ?
                            checkoutRepo.in_customer.name : 'Pilih pelanggan' }}</p>
                        <button (click)="checkoutRepo.in_customer? checkoutRepo.clear_customer() :  openCustomer()"
                            mat-button class="btn-opts" [class.on-text-danger]="checkoutRepo.in_customer">{{
                            checkoutRepo.in_customer? 'Hapus' : 'Pilih' }}</button>
                    </div>
                </div>
                <div *ngSwitchDefault  class="w-inherith">
                    <p class="text-left mb-0 title-e">Pilih nama karyawan yang akan ditagih</p>
                    <p class="mb-0 text-label">Pelanggan (Opsional)</p>
                    <div [class.box-active]="checkoutRepo.in_customer"
                        class="d-flex justify-content-between align-items-center mb-2 box-x-container">
                        <p [ngClass]="checkoutRepo.in_customer? 'text-inline-a' : 'text-mute'"
                            class="mb-0 text-1-line">{{ checkoutRepo.in_customer ?
                            checkoutRepo.in_customer.name : 'Pilih pelanggan' }}</p>
                        <button (click)="checkoutRepo.in_customer? checkoutRepo.clear_customer() :  openCustomer()"
                            mat-button class="btn-opts" [class.on-text-danger]="checkoutRepo.in_customer">{{
                            checkoutRepo.in_customer? 'Hapus' : 'Pilih' }}</button>
                    </div>
                </div>
            </ng-container>
        </div>
    </div>
    `,
    styleUrls: ['./../payment-order.component.css', './../../section-split-order/split.component.css'],
})

export class OtherComponent implements OnInit {
    selected = 'EMPL_DEBT'
    constructor(public checkoutRepo: CheckoutRepository, private _bottomSheet: MatBottomSheet) { }

    ngOnInit() { }

    openCustomer() {
        const configBottomAddt: MatBottomSheetConfig = new MatBottomSheetConfig()
        configBottomAddt.backdropClass = 'backdrop-custom'
        configBottomAddt.panelClass = 'panel-custom'
        this._bottomSheet.open(CustomerListComponent, configBottomAddt)
            .afterDismissed().subscribe((res: Customer) => {
                this.checkoutRepo.in_customer = res
                this.checkoutRepo.checkout.customerId = res.id
                this.checkoutRepo.checkout.customerName = res.name
            })
    }
}