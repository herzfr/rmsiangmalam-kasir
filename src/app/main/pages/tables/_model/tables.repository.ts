import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import * as _ from "lodash";
import { Subscription } from "rxjs";
import { ShiftRepository } from "src/app/main/_model/shift/shift.repository";
import { Pageable } from "src/app/_model/general.model";
import { TableService } from "../_services/table.service";
import { CreateTable, DataTable, FindTable, Table, UpdateTable } from "./table.model";

@Injectable()
export class TablesRepository {

    public tableList?: DataTable;
    public searchTable: FindTable = new FindTable();
    public createTable: CreateTable = new CreateTable();
    public updateTable: UpdateTable = new UpdateTable();

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    private sub?: Subscription;

    constructor(private tablesService: TableService, private shiftRepo: ShiftRepository, private _snackBar: MatSnackBar) {
        this.getDataTable()
    }

    ngOnDestroy() {
        this.sub?.unsubscribe()
    }

    getDataTable() {
        this.searchTable.branchId = this.shiftRepo.onBranch;
        this.searchTable.subBranchId = this.shiftRepo.onSubBranch;
        this.sub = this.tablesService.getTables(this.searchTable).subscribe(res => {
            this.tableList = res.data
        })
    }

    get dataTables(): Table[] {
        return this.tableList?.content ?? []
    }

    get tablePagine(): Pageable {
        return this.tableList?.pageable ?? {}
    }

    createT() {
        this.tablesService.createTables(this.createTable).subscribe(res => {
            if (_.isEqual(res.statusCode, 0)) {
                console.log(res);
                this.openSnackBar('Meja telah ditambahkan')
                this.getDataTable()
            }
        }, (err: HttpErrorResponse) => {
            console.log(err);
            this.openSnackBar('Meja gagal ditambahkan')
        })
    }

    updateT() {
        this.tablesService.updateTables(this.updateTable).subscribe(res => {
            if (_.isEqual(res.statusCode, 0)) {
                console.log(res);
                this.openSnackBar('Meja telah diperbaharui')
                this.getDataTable()
            }
        }, (err: HttpErrorResponse) => {
            console.log(err);
            this.openSnackBar('Meja gagal diperbaharui')
        })
    }

    deleteT(id: number) {
        this.tablesService.deleteTable(id).subscribe(res => {
            if (_.isEqual(res.statusCode, 0)) {
                console.log(res);
                this.openSnackBar('Meja telah dihapus')
                this.getDataTable()
            }
        }, (err: HttpErrorResponse) => {
            console.log(err);
            this.openSnackBar('Meja gagal dihapus')
        })
    }


    openSnackBar(message: string) {
        this._snackBar.open(message, 'Tutup', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

}