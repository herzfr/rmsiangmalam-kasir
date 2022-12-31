import { Component, Inject } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { BaseService } from "../_service/base.service";

@Component({
    selector: 'numpad-app',
    template: `
        <div class="container-fluid">
            <ul class="list-group list-group-horizontal">
                <li (click)="input(1)" class="list-group-item m-1 col">
                    <button class="w-100 fw-bold" mat-button>1</button>
                </li>
               <li (click)="input(2)" class="list-group-item m-1 col">
                    <button class="w-100 fw-bold" mat-button>2</button>
                </li>
               <li (click)="input(3)" class="list-group-item m-1 col">
                    <button class="w-100 fw-bold" mat-button>3</button>
                </li>
            </ul>
            <ul class="list-group list-group-horizontal-sm">
               <li (click)="input(4)" class="list-group-item m-1 col">
                    <button class="w-100 fw-bold" mat-button>4</button>
                </li>
               <li (click)="input(5)" class="list-group-item m-1 col">
                    <button class="w-100 fw-bold" mat-button>5</button>
                </li>
               <li (click)="input(6)" class="list-group-item m-1 col">
                    <button class="w-100 fw-bold" mat-button>6</button>
                </li>
            </ul>
            <ul class="list-group list-group-horizontal-md">
               <li (click)="input(7)" class="list-group-item m-1 col">
                    <button class="w-100 fw-bold" mat-button>7</button>
                </li>
               <li (click)="input(8)" class="list-group-item m-1 col">
                    <button class="w-100 fw-bold" mat-button>8</button>
                </li>
               <li (click)="input(9)" class="list-group-item m-1 col">
                    <button class="w-100 fw-bold" mat-button>9</button>
                </li>
            </ul>
            <ul class="list-group list-group-horizontal-lg">
               <li (click)="input(0)" class="list-group-item m-1 col">
                    <button class="w-100 fw-bold" mat-button>0</button>
                </li>
               <li (click)="inputString('00')" class="list-group-item m-1 col">
                    <button class="w-100 fw-bold" mat-button>00</button>
                </li>
               <li (click)="inputString('000')" class="list-group-item m-1 col">
                    <button class="w-100 fw-bold" mat-button>000</button>
                </li>
            </ul>
            <li (click)="deleteNumber()" class="list-group-item m-1 col text-center">
                    <button class="w-100 fw-bold" class="btn-backspace" mat-button>Menghapus<mat-icon svgIcon="back" class="icon-back"></mat-icon></button>
                </li>
        </div>
    `,
    styles: [
        '.list-group-item { border: 1px solid #c6b5b5 !important; border-radius: 5px !important; }',
        '.icon-back {margin-left: 10px; padding: 3px; line-height: 10px;}',
        '.btn-backspace { width: 100%; }'
    ]
})
export class NumpadComponent {
    inputResult: number = 0
    is_from: 'cashier' | 'reservation' | 'income' | 'expense' | 'cash-employee';
    constructor(
        private _bottomSheetRef: MatBottomSheetRef<NumpadComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any[],
        private _baseservice: BaseService
    ) {
        console.log(data);

        this.inputResult = data[0]
        this.is_from = data[1]
    }

    openLink(event: MouseEvent): void {
        this._bottomSheetRef.dismiss();
        event.preventDefault();
    }

    input(val: number) {
        if (this.inputResult === 0) {
            this.inputResult = val;
            this.updateChange();
        } else {
            let sVal: string = this.inputResult.toString();
            let iVal: string = sVal + val;
            this.inputResult = Number(iVal);
            this.updateChange();
        }
    }

    inputString(val: string) {
        let sVal: string = this.inputResult.toString();
        let iVal: string = sVal + val;
        this.inputResult = Number(iVal);
        this.updateChange();
    }

    inputNumberAuto(val: number) {
        this.inputResult += val;
        this.updateChange();
    }

    inputDefaulNominal(val: number) {
        this.inputResult = val;
        this.updateChange();
    }

    clearNumber() {
        this.inputResult = 0;
        this.updateChange();
    }

    deleteNumber() {
        let sVal: string = this.inputResult.toString();
        let iVal: string = sVal.slice(0, -1);
        this.inputResult = Number(iVal);
        this.updateChange();
    }

    updateChange() {
        switch (this.is_from) {
            case 'cashier':
                this._baseservice.number_result = this.inputResult
                break;
            case 'income':
                this._baseservice.number_result_income = this.inputResult
                break;
            case 'expense':
                this._baseservice.number_result_expense = this.inputResult
                break;
            case 'cash-employee':
                this._baseservice.number_result_cash_empl = this.inputResult
                break;
            default:
                this._baseservice.number_result_general = this.inputResult
                break;
        }
        // if (this.is_from) {
        //     this._baseservice.number_result = this.inputResult
        // } else {
        //     this._baseservice.number_result_general = this.inputResult
        // }
        // this.change = this.inputResult - this.total;
    }


}