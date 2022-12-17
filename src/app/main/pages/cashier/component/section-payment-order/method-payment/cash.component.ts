import { AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { MatKeyboardDirective } from 'angular-onscreen-material-keyboard';
import { DiscountComponent } from 'src/app/main/_dialog/discount.component';
import { NumpadComponent } from 'src/app/main/_dialog/numpad.component';
import { BaseService } from 'src/app/main/_service/base.service';
import { CheckoutRepository } from '../../../_model/checkout/chekcout.repository';


@Component({
    selector: 'cash-payment',
    template: `
        <div class="container-fluid">
            <div class="row bg-white">
               <!-- <p class="text-center text-muted p-2 mb-0">Masukan Pembayaran</p> -->
               <p class="text-center mb-0 title-e pt-3">Masukan Pembayaran</p>
               <div class="d-flex align-items-center">
                    <button (click)="opeenKeybordSheet()" mat-icon-button class="m-1" color="accent" aria-label="Example icon button with a menu icon">
                        <mat-icon svgIcon="keypad"></mat-icon>
                    </button>
                    <input currencyMask [options]="{ prefix: 'Rp ', thousands: '.', decimal: ',',  precision: 0 }" readonly class="input-cash display-1 col text-center p-2 mb-0" matInput [matKeyboard]="'de-CH'"  [formControl]="cash_control" />
                    <p (click)="clearCash()" class="text-center mb-0 on-text-danger mx-1 cursor-pointer">Hapus</p>
               </div>
               <!-- <p class="text-center text-muted p-2 mb-0">Pembayaran Tunai Cepat</p> -->
               <p class="text-center mb-0 title-e pt-3">Pilih Nominal</p>
               <div class="d-flex py-2 pb-0">
                    <div (click)="setNumber(100000)" class="col p-2 mb-1 text-center btn-shortcut-cash cursor-pointer">
                        <mat-icon class="icon-temp" svgIcon="coin"></mat-icon> <span>100.000</span>
                    </div>
                    <div (click)="setNumber(75000)" class="col p-2 mb-1 text-center btn-shortcut-cash cursor-pointer">
                        <mat-icon class="icon-temp" svgIcon="coin"></mat-icon> <span>75.000</span>
                    </div>
                    <div (click)="setNumber(50000)" class="col p-2 mb-1 text-center btn-shortcut-cash cursor-pointer">
                        <mat-icon class="icon-temp" svgIcon="coin"></mat-icon> <span>50.000</span>
                    </div>
                    <div (click)="setNumber(20000)" class="col p-2 mb-1 text-center btn-shortcut-cash cursor-pointer">
                        <mat-icon class="icon-temp" svgIcon="coin"></mat-icon> <span>20.000</span>
                    </div>
                    <div (click)="setNumber(10000)" class="col p-2 mb-1 text-center btn-shortcut-cash cursor-pointer">
                        <mat-icon class="icon-temp" svgIcon="coin"></mat-icon> <span>10.000</span>
                    </div>
               </div>
               <div  class="d-flex py-2 pt-0">
                    <div (click)="setNumber(5000)" class="col p-2 mb-1 text-center btn-shortcut-cash cursor-pointer">
                        <mat-icon class="icon-temp" svgIcon="coin"></mat-icon> <span>5.000</span>
                    </div>
                    <div (click)="setNumber(2000)" class="col p-2 mb-1 text-center btn-shortcut-cash cursor-pointer">
                        <mat-icon class="icon-temp" svgIcon="coin"></mat-icon> <span>2.000</span>
                    </div>
                    <div (click)="setNumber(1000)" class="col p-2 mb-1 text-center btn-shortcut-cash cursor-pointer">
                        <mat-icon class="icon-temp" svgIcon="coin"></mat-icon> <span>1.000</span>
                    </div>
                    <div (click)="setNumber(500)" class="col p-2 mb-1 text-center btn-shortcut-cash cursor-pointer">
                        <mat-icon class="icon-temp" svgIcon="coin"></mat-icon> <span>500</span>
                    </div>
                    <div (click)="setNumber(100)" class="col p-2 mb-1 text-center btn-shortcut-cash cursor-pointer">
                        <mat-icon class="icon-temp" svgIcon="coin"></mat-icon> <span>100</span>
                    </div>
               </div>
               <div  class="d-flex py-2 pt-0 section-btn-shortcut">
                <div (click)="setNumber(checkoutRepo.checkout.total)" class="col-6 p-2 mb-1 text-center btn-shortcut-cash cursor-pointer">
                    <mat-icon class="icon-temp" svgIcon="coin"></mat-icon>{{ checkoutRepo.checkout.total | rupiah }}
                </div>
               </div>
            </div>
        </div>
       
    `,
    styleUrls: ['./../payment-order.component.css', './../../section-split-order/split.component.css']
})

export class CashComponent implements OnInit, AfterViewInit {

    cash_control = new FormControl({ value: this.checkoutRepo.checkout.cash, disabled: true });

    @ViewChild(MatKeyboardDirective, { static: false }) keyboard?: MatKeyboardDirective;

    constructor(public checkoutRepo: CheckoutRepository, private _bottomSheet: MatBottomSheet, private baseService: BaseService) {
        this.listenerNumberResult()
    }
    ngAfterViewInit(): void {
        console.log(this.keyboard);

    }


    ngOnInit() { }

    listenerNumberResult() {
        this.baseService.numberResult$.subscribe(() => {
            this.update_cash()
        })
    }

    openKeyboard() {
        console.log('work');
        this.keyboard?.showKeyboard()
    }

    opeenKeybordSheet() {
        const configBottom: MatBottomSheetConfig = new MatBottomSheetConfig()
        configBottom.data = [this.checkoutRepo.cash, 'cashier']
        configBottom.backdropClass = 'backdrop-numpad'
        configBottom.panelClass = 'panel-numpad'
        this._bottomSheet.open(NumpadComponent, configBottom);
    }


    setNumber(num: number) {
        this.checkoutRepo.inputNumber = num
        this.update_cash()
    }

    checkCash() {
        this.update_cash()
    }

    clearCash() {
        this.checkoutRepo.set_clear_cash()
        this.update_cash()
    }

    update_cash() {
        this.cash_control.patchValue(this.checkoutRepo.cash)
        this.checkoutRepo.calculateChange()
    }
}