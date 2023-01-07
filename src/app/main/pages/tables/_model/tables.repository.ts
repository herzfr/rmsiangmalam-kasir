import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import * as _ from "lodash";
import { Subscription } from "rxjs";
import { ShiftRepository } from "src/app/main/_model/shift/shift.repository";
import { DialogService } from "src/app/shared/dialogs/dialog.service";
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

    constructor(private tablesService: TableService, private shiftRepo: ShiftRepository,
        private _snackBar: MatSnackBar, private _dlg: DialogService) {
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
        // return []
        return this.tableList?.content ?? []
    }

    get tablePagine(): Pageable {
        return this.tableList?.pageable ?? {}
    }

    findTable(id: number): Table | undefined {
        return this.dataTables.find(x => x.id === id)
    }

    createT() {
        this._dlg.showConfirmationDialog("Konfirmasi Tambah Meja", "Konfirmasi Tambah Meja", `Apakah Kamu Yakin Ingin Tambah Meja?`, "confirm-add-table", "Ya, yakin")
            .subscribe(res => {
                if (res) {
                    this.tablesService.createTables(this.createTable).subscribe(res => {
                        if (_.isEqual(res.statusCode, 0)) {
                            // console.log(res);
                            this._dlg.showSWEDialog('Berhasil!', `Meja telah ditambahkan`, 'success')
                            this.getDataTable()
                        }
                    }, (err: HttpErrorResponse) => {
                        // console.log(err);
                        this._dlg.showSWEDialog('Opps!', `Meja gagal ditambahkan`, 'error')
                    })
                }
            })
    }

    updateT() {
        this.tablesService.updateTables(this.updateTable).subscribe(res => {
            if (_.isEqual(res.statusCode, 0)) {
                // console.log(res);
                this._dlg.showSWEDialog('Berhasil!', `Meja telah diperbaharui`, 'success')
                this.getDataTable()
            }
        }, (err: HttpErrorResponse) => {
            // console.log(err);
            this._dlg.showSWEDialog('Opps!', `Meja gagl diperaharui`, 'error')
        })
    }

    deleteT(id: number) {
        this._dlg.showConfirmationDialog("Konfirmasi Hapus Meja", "Konfirmasi Hapus Meja", `Apakah Kamu Yakin Ingin Hapus Meja?`, "confirm-delete-table", "Ya, yakin")
            .subscribe(res => {
                if (res) {
                    this.tablesService.deleteTable(id).subscribe(res => {
                        if (_.isEqual(res.statusCode, 0)) {
                            // console.log(res);
                            this._dlg.showSWEDialog('Berhasil!', `Meja telah dihapus`, 'success')
                            this.getDataTable()
                        }
                    }, (err: HttpErrorResponse) => {
                        // console.log(err);
                        this._dlg.showSWEDialog('Opps!', `Meja gagal dihapus`, 'error')
                    })
                }
            })
    }


    openSnackBar(message: string) {
        this._snackBar.open(message, 'Tutup', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

}