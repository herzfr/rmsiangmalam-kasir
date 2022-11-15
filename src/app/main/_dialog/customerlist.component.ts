import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatTableDataSource } from '@angular/material/table';
import { Customer } from '../_model/customer/customer.model';
import { CustomerRepository } from '../_model/customer/customer.repository';

@Component({
    selector: 'customer-list',
    template: `
        <mat-form-field appearance="outline">
        <mat-label>Pencarian Pelanggan</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Ex. PT. XYZ" #input>
        </mat-form-field>
         <mat-nav-list>
            <ng-container *ngIf="customerRepo.customer.length > 0; else isEmpty">
                <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
                <!-- <ng-container *ngFor="let item of dataSource.data"> -->
                <ng-container matColumnDef="customer">
                    <th mat-header-cell *matHeaderCellDef> Pelanggan. </th>
                    <td mat-cell *matCellDef="let element"> 
                        <a  mat-list-item (click)="chooseCustomer(element)">
                            <span  mat-line>{{ element.name }}</span>
                        </a>
                    </td>
                </ng-container>
              
                <tr mat-header-row *matHeaderRowDef="isplayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: isplayedColumns;"></tr>

                <!-- Row shown when there is no matching data. -->
                <tr class="mat-row" *matNoDataRow>
                    <td class="mat-cell" colspan="4">Tidak ada data pelanggan yang cocok dengan yang kamu cari "{{input.value}}"</td>
                </tr>
                <!-- </ng-container> -->
            </table>
            </ng-container>
            <ng-template #isEmpty>
               Data Pelanggan Kosong
            </ng-template>
        </mat-nav-list>
    `,
    styles: ['table {width: 100%;}']
})

export class CustomerListComponent implements OnInit {
    isplayedColumns: string[] = ['customer'];
    dataSource = new MatTableDataSource<Customer>([]);

    constructor(
        private _bottomSheetRef: MatBottomSheetRef<CustomerListComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public datas: any,
        public customerRepo: CustomerRepository,
    ) {
    }

    ngOnInit() {
        this.customerRepo.dataCustomerObservable.subscribe(res => {
            this.dataSource = new MatTableDataSource<Customer>(res.data['content']);
        })
    }

    ngDoCheck() {

    }

    get data() {
        console.log(this.dataSource.data);
        return this.dataSource.data
    }

    chooseCustomer(customer: Customer) {
        this._bottomSheetRef.dismiss(customer);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}