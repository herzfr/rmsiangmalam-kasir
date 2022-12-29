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
        <mat-radio-group (change)="selectedType()" [(ngModel)]="selected" aria-label="Select an option" class="">
            <mat-radio-button class="input-radio-button" value="EMPL_DEBT">Karyawan</mat-radio-button>
            <mat-radio-button class="input-radio-button" value="CUST_DEBT">Pelanggan</mat-radio-button>
        </mat-radio-group>

        <div class="d-flex w-100">
        <ng-container [ngSwitch]="selected">
            <div *ngSwitchCase="'EMPL_DEBT'" class="w-inherith">
            <div class="d-flex my-2">
                    <div class="col form-group">
                        <label class="label text-primary" for="fnote">Cari ID Karyawan</label>
                        <div class="box-input">
                            <mat-icon class="icon-input" svgIcon="search"></mat-icon>
                            <input [(ngModel)]="checkoutRepo.find_user" id="fnote" class="form-control" type="text"
                                placeholder="Masukan ID Karyawan">
                            <mat-icon (click)="checkoutRepo.find_user = ''" class="col-2 mx-3 cursor-pointer"
                                svgIcon="remove"></mat-icon>
                        </div>
                        <div class="d-flex justify-content-end my-1">
                            <button (click)="checkoutRepo.findUser()" class="btn-submit-expense" mat-button>Cari</button>
                        </div>
                    </div>
                </div>
                <div class="d-flex">
                    <div [class.empl-available]="checkoutRepo.user" class="card-info-empl">
                        <ul class="list-group">
                            <li class="list-group-item text-title-case"> <mat-icon class="icon-info mrx-8"
                                    svgIcon="user"></mat-icon>ID Karyawan & Username :
                                <span class="fw-normal ml-5">{{ checkoutRepo.user?.id?? '-' }} - {{ checkoutRepo.user?.username?? '-'
                                    }}</span>
                            </li>
                        </ul>
                        <ul class="list-group">
                            <li class="list-group-item text-title-case"> <mat-icon class="icon-info mrx-8"
                                    svgIcon="receipt"></mat-icon>Cabang Induk :
                                <span class="fw-normal ml-5">{{ checkoutRepo.user?.branch?? '-' }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="d-flex justify-content-end">
                    <p *ngIf="checkoutRepo.checkout.employeeUserName != null" class="mb-0 text-empl info-empl">Karyawan telah disematkan</p>
                    <p *ngIf="checkoutRepo.checkout.employeeUserName == null" class="mb-0 text-empl danger-empl">Karyawan belum disematkan</p>
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
    styleUrls: [
        './../payment-order.component.css',
        './../../section-split-order/split.component.css',
        '../method-payment/_style/method-payment.component.css'
    ],
})

export class OtherComponent implements OnInit {
    selected = 'EMPL_DEBT'
    constructor(public checkoutRepo: CheckoutRepository, private _bottomSheet: MatBottomSheet) {
        this.checkoutRepo.checkout.paymentMethod = this.selected
    }

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

    selectedType() {
        this.checkoutRepo.checkout.paymentMethod = this.selected
        this.checkoutRepo.checkout.employeeUserName = null
        this.checkoutRepo.user = undefined
    }
}