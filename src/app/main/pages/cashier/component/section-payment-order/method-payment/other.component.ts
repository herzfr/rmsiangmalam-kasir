import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { CustomerListComponent } from 'src/app/main/_dialog/customerlist.component';
import { Customer } from 'src/app/main/_model/customer/customer.model';
import { CheckoutRepository } from '../../../_model/checkout/chekcout.repository';

@Component({
    selector: 'other-payment',
    template: `
    <div class="container-fluid">
        <div class="row mb-2">
            <label id="input-radio-group-label">Pilih Penagihan pemabayaran?</label>
            <mat-radio-group [(ngModel)]="selected" aria-label="Select an option" class="input-radio-group flex-row flex-nowrap">
                <mat-radio-button class="input-radio-button" value="EMPL_DEBT">Karyawan</mat-radio-button>
                <mat-radio-button class="input-radio-button" value="CUST_DEBT">Pelanggan</mat-radio-button>
            </mat-radio-group>
        </div>
        <div class="row mb-2">
            <ng-container [ngSwitch]="selected">
                <div *ngSwitchCase="'EMPL_DEBT'">
                    <ul class="mx-2 my-0 p-0">
                        <li class="list-group-item d-flex justify-content-between align-items-center py-1">
                            <p class="text-1-line mb-0 col mw-40px">{{ checkoutRepo.in_customer ?
                                checkoutRepo.in_customer.name : 'Karyawan?' }}</p>
                            <button
                                (click)="checkoutRepo.in_customer? checkoutRepo.clear_customer() : openCustomer()"
                                mat-raised-button class="badge col-4">{{
                                checkoutRepo.in_customer? 'Hapus' : 'Karyawan' }}</button>
                        </li>
                        <p class="mb-0">Nama karyawan yang akan ditagih.</p>
                    </ul>
                </div>
                <div *ngSwitchDefault>
                    <ul class="mx-2 my-0 p-0">
                        <li class="list-group-item d-flex justify-content-between align-items-center py-1">
                            <p class="text-1-line mb-0 col mw-40px">{{ checkoutRepo.in_customer ?
                                checkoutRepo.in_customer.name : 'Pelanggan?' }}</p>
                            <button
                                (click)="checkoutRepo.in_customer? checkoutRepo.clear_customer() : openCustomer()"
                                mat-raised-button class="badge col-4">{{
                                checkoutRepo.in_customer? 'Hapus' : 'Pelanggan' }}</button>
                        </li>
                        <p class="mb-0">Nama pelanggan yang akan ditagih.</p>
                    </ul>
                </div>
            </ng-container>
        </div>
    </div>
    `,
    styleUrls: ['./../payment-order.component.css'],
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