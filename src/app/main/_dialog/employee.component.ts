import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerRepository } from '../_model/customer/customer.repository';
import { User } from '../_model/users/user.model';
import { UserRepository } from '../_model/users/user.repository';

@Component({
    selector: 'employee-list',
    template: `
        <mat-form-field appearance="outline">
        <mat-label>Pencarian Karyawan</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Ex. Budi Santoso" #input>
        </mat-form-field>
         <mat-nav-list>
            <ng-container *ngIf="emplRepo.employeeData.length > 0; else isEmpty">
                <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
                <!-- <ng-container *ngFor="let item of dataSource.data"> -->
                <ng-container matColumnDef="employee">
                    <th mat-header-cell *matHeaderCellDef> Karyawan. </th>
                    <td mat-cell *matCellDef="let element"> 
                        <a  mat-list-item (click)="chooseEmployee(element)">
                            <span  mat-line>{{ element.name }}</span>
                        </a>
                    </td>
                </ng-container>
              
                <tr mat-header-row *matHeaderRowDef="isplayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: isplayedColumns;"></tr>

                <!-- Row shown when there is no matching data. -->
                <tr class="mat-row" *matNoDataRow>
                    <td class="mat-cell" colspan="4">Tidak ada data karyawan yang cocok dengan yang kamu cari "{{input.value}}"</td>
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

export class EmployeeListComponent implements OnInit {
    isplayedColumns: string[] = ['employee'];
    dataSource = new MatTableDataSource<User>([]);

    constructor(
        private _bottomSheetRef: MatBottomSheetRef<EmployeeListComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public datas: any,
        public emplRepo: UserRepository,
    ) {
    }

    ngOnInit() {

    }

    ngDoCheck() {

    }

    get data() {
        console.log(this.dataSource.data);
        return this.dataSource.data
    }

    chooseEmployee(employee: User) {
        this._bottomSheetRef.dismiss(employee);
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}