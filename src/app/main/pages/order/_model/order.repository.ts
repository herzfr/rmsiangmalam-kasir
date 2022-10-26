import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, SimpleChanges } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import * as _ from 'lodash';
import { BehaviorSubject, forkJoin, Observable, ReplaySubject, Subscription } from 'rxjs';
import { ShiftRepository } from 'src/app/main/_model/shift/shift.repository';
import { FindTable, Table } from '../../tables/_model/table.model';
import { TableService } from '../../tables/_services/table.service';
import { OrderService } from '../_service/order.service';
import { DataPackage, DataProduct, DataShortcut, Product, ProductCategory, Shortcut } from './menu.model';
import { Customer, FillShortcut, FindMenu, PriceCategory } from './order.model';

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

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    subs: Subscription[] = [];
    constructor(private orderService: OrderService, private shiftRepo: ShiftRepository,
        private tableService: TableService, private _snackBar: MatSnackBar) {
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
        forkJoin([
            this.orderService.getMenuProduct(this.searchProduct, this.shiftRepo.onSubBranch),
            this.orderService.getMenuPackage(this.searchPackage, this.shiftRepo.onSubBranch),
            this.orderService.getMenuShortcut(this.shiftRepo.onSubBranch)
        ]).subscribe(value => {
            this.productList = value[0].data
            this.packageList = value[1].data
            this.shortcutList = value[2].data
            console.log(this.shortcutList);

        })
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log("single change = > ", changes);
    }

    generatePosition(total: number): number[] {
        let ttl = new Array<number>();
        for (let index = 0; index < total; index++) {
            ttl.push(index + 1)
        }
        return ttl;
    }

    reCheckProduct(find: FindMenu) {
        this.orderService.getMenuProduct(find, this.shiftRepo.onSubBranch).subscribe(res => {
            this.productList = res.data
        })
    }

    reCheckPackage(find: FindMenu) {
        this.orderService.getMenuPackage(find, this.shiftRepo.onSubBranch).subscribe(res => {
            this.packageList = res.data
        })
    }

    reCheckShortcut() {
        this.orderService.getMenuShortcut(this.shiftRepo.onSubBranch).subscribe(res => {
            this.shortcutList = res.data
        })
    }


    getPriceCat(): Observable<PriceCategory[]> {
        return this.priceCategory
    }

    getCustomer(): Observable<Customer[]> {
        return this.customerData
    }

    updateProduct(idcat: number) {
        this.searchProduct.option = idcat.toString()
        this.orderService.getMenuProduct(this.searchProduct, this.shiftRepo.onSubBranch).subscribe(res => {
            this.productList = res.data
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
                this.openSnackBar('Terpasang di menu utama posisi ke ' + fillShorcut.position)
                this.reCheckShortcut()
            }
        }, (err: HttpErrorResponse) => {
            switch (err.error.statusCode) {
                case 1804:
                    this.openSnackBar('Menu sudah teregistrasi')
                    break;
                default:
                    this.openSnackBar(err.error.message)
                    break;
            }

        })
        // console.log(fillShorcut);
    }

    findEmptyPosition() {
        var result = 0;
        var stop = false;
        this.position.some((x: number) => {
            if (!stop) {
                let d = this.shortcutList.some(y => y.position === x)
                // console.log(d);
                if (!d) {
                    stop = true;
                    result = x
                }
            }
            // console.log(this.shortcutList.find(y => y.position === x));
        });
        // console.log(result);
        return result;
    }

    deleteShortcut(menuId: string) {
        let sc: Shortcut | undefined = this.shortcutList.find(x => x.id === menuId)
        if (sc) {
            this.orderService.deleteMenuShortcut(sc.position).subscribe(res => {
                if (_.isEqual(res.statusCode, 0)) {
                    this.openSnackBar('Berhasil menghapus menu, posisi ke ' + sc?.position)
                    this.reCheckShortcut()
                }
            }, (err: HttpErrorResponse) => {
                this.openSnackBar('Gagal menghapus menu pada posisi ke ' + sc?.position)
            })
        }
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, 'Tutup', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }


}