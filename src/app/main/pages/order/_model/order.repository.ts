import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, SimpleChanges } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import * as _ from 'lodash';
import { BehaviorSubject, forkJoin, Observable, ReplaySubject, Subscription } from 'rxjs';
import { ShiftRepository } from 'src/app/main/_model/shift/shift.repository';
import { FindTable, Table, UpdateOccupation, UpdateTable } from '../../tables/_model/table.model';
import { TableService } from '../../tables/_services/table.service';
import { OrderService } from '../_service/order.service';
import { TemporarySalesService } from '../../cashier/_service/temporarysales.service';
import { DataPackage, DataProduct, DataShortcut, Product, ProductCategory, Shortcut } from './menu.model';
import { Customer, FillShortcut, FindMenu, PriceCategory } from './order.model';
import { CartLine, ItemCart } from './_cart/cart.model';
import { CartRepository } from './_cart/cart.repository';
import { TempSalesRepository } from '../../cashier/_model/tempsales.repository';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';

@Injectable({ providedIn: 'root' })
export class OrderRepository {

    private priceCategory = new ReplaySubject<PriceCategory[]>()
    private customerData = new ReplaySubject<Customer[]>()

    public searchProduct: FindMenu = new FindMenu();
    public searchPackage: FindMenu = new FindMenu();
    public findTable: FindTable = new FindTable();
    public productList: DataProduct | undefined;
    public packageList: DataPackage | undefined;
    public shortcutList: Shortcut[] = [];
    public productCategory: ProductCategory[] = [];
    public tables: Table[] = []
    public position: number[] = []
    public capacityTemporary = 0;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    subs: Subscription[] = [];

    isLoading: boolean = false
    constructor(private orderService: OrderService, private shiftRepo: ShiftRepository,
        private tableService: TableService, private _snackBar: MatSnackBar,
        private tempSalesService: TemporarySalesService, private cartRepo: CartRepository,
        private tempRepo: TempSalesRepository, private _dlg: DialogService) {
        this.initFindTable()
        forkJoin([
            this.orderService.getPriceCategory(),
            this.orderService.getCustomer(),
            this.orderService.getProductCategory(),
            this.tableService.getTables(this.findTable)
        ]).subscribe(value => {
            this.priceCategory.next(value[0].data.content)
            this.customerData.next(value[1].data.content)
            this.productCategory = value[2].data.content
            this.searchProduct.option = this.productCategory.at(0)?.id.toString() ?? ""
            this.tables = value[3].data.content
            this.position = this.generatePosition(100)
            this.initProductAndPackage()
        });

    }

    initFindTable() {
        this.findTable.branchId = this.shiftRepo.onBranch;
        this.findTable.subBranchId = this.shiftRepo.onSubBranch;
    }


    initProductAndPackage() {
        this.isLoading = true
        forkJoin([
            this.orderService.getMenuProduct(this.searchProduct, this.shiftRepo.onSubBranch),
            this.orderService.getMenuPackage(this.searchPackage, this.shiftRepo.onSubBranch),
            this.orderService.getMenuShortcut(this.shiftRepo.onSubBranch)
        ]).subscribe(value => {
            this.productList = value[0].data
            this.packageList = value[1].data
            this.shortcutList = value[2].data
            setTimeout(() => this.isLoading = false, 200)
            // // console.log(this.shortcutList);

        })
    }

    ngOnChanges(changes: SimpleChanges): void {
        // console.log("single change = > ", changes);
    }

    generatePosition(total: number): number[] {
        let ttl = new Array<number>();
        for (let index = 0; index < total; index++) {
            ttl.push(index + 1)
        }
        return ttl;
    }

    reCheckProduct(find: FindMenu) {
        this.isLoading = true
        this.orderService.getMenuProduct(find, this.shiftRepo.onSubBranch).subscribe(res => {
            this.productList = res.data
            setTimeout(() => this.isLoading = false, 200)
        })
    }

    reCheckPackage(find: FindMenu) {
        this.isLoading = true
        this.orderService.getMenuPackage(find, this.shiftRepo.onSubBranch).subscribe(res => {
            this.packageList = res.data
            setTimeout(() => this.isLoading = false, 200)
        })
    }

    reCheckShortcut() {
        this.isLoading = true
        this.orderService.getMenuShortcut(this.shiftRepo.onSubBranch).subscribe(res => {
            this.shortcutList = res.data
            setTimeout(() => this.isLoading = false, 200)
        })
    }

    reCheckTable() {
        this.isLoading = true
        this.tableService.getTables(this.findTable).subscribe(res => {
            this.tables = res.data.content
        })
    }


    getPriceCat(): Observable<PriceCategory[]> {
        return this.priceCategory
    }

    getCustomer(): Observable<Customer[]> {
        return this.customerData
    }

    updateProduct(idcat: number) {
        this.isLoading = true
        this.searchProduct.option = idcat.toString()
        this.orderService.getMenuProduct(this.searchProduct, this.shiftRepo.onSubBranch).subscribe(res => {
            this.productList = res.data
            setTimeout(() => this.isLoading = false, 200)
        })
    }

    addShortcut(menuId: string) {
        let fillShorcut: FillShortcut = new FillShortcut()
        fillShorcut.branchId = this.shiftRepo.onBranch;
        fillShorcut.subBranchId = this.shiftRepo.onSubBranch
        fillShorcut.position = this.findEmptyPosition()
        fillShorcut.menuId = menuId;
        this.orderService.addMenuShortcut(fillShorcut).subscribe(res => {
            if (_.isEqual(res.statusCode, 0)) {
                this._dlg.showSWEDialog('Berhasil!', `Terpasang di menu utama posisi ke ${fillShorcut.position}`, 'success')
                this.reCheckShortcut()
            }
        }, (err: HttpErrorResponse) => {
            switch (err.error.statusCode) {
                case 1804:
                    this.openSnackBar('Menu sudah teregistrasi')
                    this._dlg.showSWEDialog('Oopps!', `Menu sudah teregistrasi`, 'error')
                    break;
                default:
                    this.openSnackBar(err.error.message)
                    break;
            }

        })
        // // console.log(fillShorcut);
    }

    findEmptyPosition() {
        var result = 0;
        var stop = false;
        this.position.some((x: number) => {
            if (!stop) {
                let d = this.shortcutList.some(y => y.position === x)
                // // console.log(d);
                if (!d) {
                    stop = true;
                    result = x
                }
            }
            // // console.log(this.shortcutList.find(y => y.position === x));
        });
        // // console.log(result);
        return result;
    }

    deleteShortcut(id: number) {
        this.isLoading = true
        let sc: Shortcut | undefined = this.shortcutList.find(x => x.shorcutId === id)
        if (sc) {
            this.orderService.deleteMenuShortcut(sc.shorcutId ?? 0).subscribe(res => {
                if (_.isEqual(res.statusCode, 0)) {
                    this._dlg.showSWEDialog('Berhasil!', `Berhasil menghapus menu, posisi ke ${sc?.position}`, 'success')
                    this.reCheckShortcut()
                }
                setTimeout(() => this.isLoading = false, 200)
            }, (err: HttpErrorResponse) => {
                this.openSnackBar('Gagal menghapus menu pada posisi ke ' + sc?.position)
                setTimeout(() => this.isLoading = false, 200)
            })
        }
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, 'Tutup', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    saveOrder(cart: CartLine) {
        this.isLoading = true
        this.tempSalesService.createTempSales(cart).subscribe(res => {
            if (_.isEqual(res.statusCode, 0)) {
                // // console.log(res.data);
                if (cart.tableIds.length > 0 && cart.tableIds[0] !== 0) {
                    let tblUpd: UpdateOccupation = new UpdateOccupation()
                    tblUpd.id = cart.tableIds[0]
                    tblUpd.salesId = (res.data as CartLine).id
                    tblUpd.capacity = this.capacityTemporary

                    this.tableService.updateOccupation(tblUpd).subscribe(res => {
                        // console.log(res.data);
                        if (_.isEqual(res.statusCode, 0)) {
                            this._dlg.showSWEDialog('Berhasil!', 'Hai, Pesanan anda berhasil diperbaharui', 'success')
                            this.initProductAndPackage()
                            this.tempRepo.getTempSales()
                            this.reCheckTable()
                            this.tempRepo.tempSalesActive = undefined
                        }
                        setTimeout(() => this.isLoading = false, 200)
                    })
                } else {
                    this._dlg.showSWEDialog('Berhasil!', 'Hai, Pesanan anda berhasil diperbaharui', 'success')
                    this.initProductAndPackage()
                    this.tempRepo.getTempSales()
                    this.tempRepo.tempSalesActive = undefined
                    setTimeout(() => this.isLoading = false, 200)
                }
            }
        }, (err: HttpErrorResponse) => {
            // console.log(err.error);
            this._dlg.showSWEDialog('Oopps!', err.error.message, 'error')
            setTimeout(() => this.isLoading = false, 200)
            // switch (err.error.statusCode) {
            //     case 1804:
            //         this.openSnackBar('Menu sudah teregistrasi')
            //         break;
            //     default:
            //         this.openSnackBar(err.error.message)
            //         break;
            // }
        })
    }

    updateOrder(cart: CartLine) {
        this.isLoading = true
        this.tempSalesService.updateTempSales(cart).subscribe(resp => {
            if (cart.tableIds.length > 0 && cart.tableIds[0] !== 0) {
                let tblUpd: UpdateOccupation = new UpdateOccupation()
                tblUpd.id = cart.tableIds[0]
                tblUpd.salesId = (resp.data as CartLine).id
                tblUpd.capacity = this.capacityTemporary

                this.tableService.updateOccupation(tblUpd).subscribe(res => {
                    // console.log(res.data);
                    if (_.isEqual(res.statusCode, 0)) {
                        this._dlg.showSWEDialog('Berhasil!', 'Hai, Pesanan anda berhasil diperbaharui', 'success')
                        this.initProductAndPackage()
                        this.tempRepo.getTempSales()
                        this.reCheckTable()
                        this.tempRepo.tempSalesActive = undefined
                    }
                    setTimeout(() => this.isLoading = false, 200)
                })
            } else {
                this._dlg.showSWEDialog('Berhasil!', 'Hai, Pesanan anda berhasil diperbaharui', 'success')
                this.initProductAndPackage()
                this.tempRepo.getTempSales()
                this.tempRepo.tempSalesActive = undefined
                setTimeout(() => this.isLoading = false, 200)
            }
        }, (err: HttpErrorResponse) => {
            // // console.log(err.error);
            setTimeout(() => this.isLoading = false, 200)
            switch (err.error.statusCode) {
                case 2215:
                    this._dlg.showSWEDialog('Oopps!', `Orderan dengan ID tertera tidak ada, mohon memuat ulang orderan baru`, 'error')
                    break;
                default:
                    this._dlg.showSWEDialog('Oopps!', err.error.message, 'error')
                    break;
            }
        })
    }


}