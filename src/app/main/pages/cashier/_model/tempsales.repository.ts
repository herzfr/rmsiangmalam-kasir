import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import * as _ from "lodash";
import { Subscription } from "rxjs";
import { Additional } from "src/app/main/_model/additional/additional.model";
import { Discount } from "src/app/main/_model/discount/discount.model";
import { ShiftRepository } from "src/app/main/_model/shift/shift.repository";
import { BaseService } from "src/app/main/_service/base.service";
import { DialogService } from "src/app/shared/dialogs/dialog.service";
import { TimeUtil } from "src/app/_utility/time.util";
import { CartLine, ItemCart } from "../../order/_model/_cart/cart.model";
import { TablesRepository } from "../../tables/_model/tables.repository";
import { TemporarySalesService } from "../_service/temporarysales.service";
import { DataTempSales, FindTempSales, ItemTempSales, Merge, TempSales } from "./tempsales.model";

@Injectable()
export class TempSalesRepository {

    // SEARCH
    public findTempSales: FindTempSales = new FindTempSales()
    // ==============

    // TEMP SALES DATA
    public tempSalesData?: DataTempSales;
    // ==============


    // CHOOSEE ACTIVE
    public tempSalesActive: TempSales | undefined;
    public merge: Merge = new Merge()
    // ==============

    // DISCOUNT / TAX / SERVICE
    public discount: Discount | undefined;
    public tax: Additional | undefined;
    public service: Additional | undefined;
    // ================

    // PAYMENT

    // ================

    // BOOLEAN OPERATOR
    public isLoading = false
    public isMergeBill = false;
    public isLoadingMerge = false;
    // ================

    // SNACKBAR
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    // ================



    allsubs: Subscription[] = []
    constructor(private tempSalesService: TemporarySalesService,
        private shiftRepo: ShiftRepository, public timeUtil: TimeUtil,
        private _snackBar: MatSnackBar, private dlg: DialogService,
        private tableRepo: TablesRepository,
        private _baseService: BaseService, private router: Router) {
        this.findTempSales.branchId = shiftRepo.onBranch;
        this.findTempSales.subBranchId = shiftRepo.onSubBranch;
        this.getTempSales()
    }

    // =======================================================
    // TEMPORARY SALES
    getTempSales() {
        this.isLoading = true
        setTimeout(() => {
            let subsTempSalesAll = this.tempSalesService.getTempSales(this.findTempSales).subscribe(res => {
                this.tempSalesData = res.data
                this.isLoading = false
            })
            this.allsubs.push(subsTempSalesAll)
        }, 500)
    }

    findTempSalesByOpt(search: string, page: number, size: number, start: number, end: number, opt: string) {
        this.findTempSales.branchId = this.shiftRepo.onBranch;
        this.findTempSales.subBranchId = this.shiftRepo.onSubBranch;
        this.findTempSales.search = search;
        this.findTempSales.page = page;
        this.findTempSales.size = size;
        this.findTempSales.startDate = start;
        this.findTempSales.endDate = end;
        this.findTempSales.option = opt;
        this.getTempSales()
    }

    get tempSales() {
        return this.tempSalesData?.content ?? []
    }

    get tempSalesPagine() {
        return this.tempSalesData?.pageable
    }

    set setStartDate(date: Date) {
        let get_time = this.timeUtil.getJustTime(this.findTempSales.startDate)
        let get_milis_time = this.timeUtil.setTimeInDate(get_time, date)
        this.findTempSales.startDate = get_milis_time
    }

    set setEndDate(date: Date) {
        let get_time = this.timeUtil.getJustTime(this.findTempSales.endDate)
        let get_milis_time = this.timeUtil.setTimeInDate(get_time, date)
        this.findTempSales.endDate = get_milis_time
    }

    get disablePrevList() {
        return ((this.tempSalesPagine?.pageNumber ?? 0) === 0)
    }

    get disbaleNextList() {
        return (this.tempSalesPagine?.pageNumber ?? 0) > ((this.tempSalesPagine?.totalPage ?? 0) - 1)
    }

    nextList() {
        this.findTempSales.page = ((this.tempSalesPagine?.pageNumber ?? 0) + 1)
        this.getTempSales()
    }

    prevList() {
        this.findTempSales.page = ((this.tempSalesPagine?.pageNumber ?? 0) - 1)
        this.getTempSales()
    }


    async findTempSalesById(id: number): Promise<any> {
        // let tempSalesDatas: DataTempSales;
        await this.tempSalesService.getTempSalesById(id).subscribe(async (res) => {
            return await res.data
        })
    }

    seeDetail(i: number) {
        this.tempSalesActive = this.tempSales.find((x, idx) => idx === i)
    }
    // TEMPORARY SALES
    // =======================================================


    // =======================================================
    // MERGE BILL
    setMergeBill(id: number, waiter: string) {
        this.merge.bills.push(id)
        this.merge.waiter = waiter
        this.isMergeBill = true
    }

    isExistMerge(id: number): boolean {
        let d = this.merge.bills.find(x => x === id)
        return d !== undefined ? true : false
    }

    set checkList(id: number) {
        let d = this.merge.bills.find(x => x === id)
        if (!d) {
            this.merge.bills.push(id)
        } else {
            this.removeIdBills(id)
        }
    }

    clearMerge() {
        this.merge.bills = []
        this.merge = new Merge()
        this.isMergeBill = false
    }

    removeIdBills(id: number) {
        let index = this.merge.bills.findIndex(line => line == id);
        this.merge.bills.splice(index, 1);
    }

    get mergeList(): number[] {
        return this.merge?.bills ?? [];
    }

    get listBillInbound(): TempSales[] {
        let tempS: TempSales[] = [];
        this.mergeList.forEach(y => {
            let t = this.tempSales.find(x => x.id === y) ?? undefined
            if (t) {
                tempS.push(t)
            }
        })
        return tempS;
    }

    getTotalPrice(tempItems: ItemTempSales[]) {
        return tempItems.reduce((a, b) => +a + b.totalPrice, 0)
    }

    getGrandTotal(totalPrice: number[]) {
        return totalPrice.reduce((a, b) => +a + +b, 0);
    }

    get grand_total() {
        let totalPrice: number[] = []
        for (const key in this.listBillInbound) {
            if (Object.prototype.hasOwnProperty.call(this.listBillInbound, key)) {
                const el = this.listBillInbound[key];
                totalPrice.push(this.getTotalPrice(el.items))
            }
        }
        return this.getGrandTotal(totalPrice)
    }

    submitMerge() {
        this.isLoadingMerge = true
        this.tempSalesService.mergeTempSales(this.merge).subscribe(res => {
            if (_.isEqual(res.statusCode, 0)) {
                this.openSnackBar('Penggabungan tagihan berhasil')
                this.clearMerge()
                this.getTempSales()
                this.isLoadingMerge = false
            }
        }, (err: HttpErrorResponse) => {
            this.openSnackBar('Penggabungan tagihan gagal')
            this.isLoadingMerge = false
        })

    }
    // MERGE BILL
    // =======================================================


    // =======================================================
    // SPLIT BILL

    // SPLIT BILL
    // =======================================================

    // =======================================================
    // UBAH BILL
    updateBill(tempItems: CartLine) {
        setTimeout(() => this.router.navigate(['v2/order'], { queryParams: { nav: 'shortcut' } }), 1)
        this._baseService.setTempSales(tempItems)

    }

    checkKey(obj: any, keyname: string) {
        let keyExist = Object.keys(obj).some(key => key === keyname);
        return keyExist
    }

    async updateTempSales() {
        // UBAH TEMPSALES KE CARTLINE
        let cart: CartLine = (this.tempSalesActive as CartLine)

        // PERIKSA TIAP ITEM DI CARTLINE
        for (let index = 0; index < cart.items!.length; index++) {
            const it: ItemCart = cart.items![index];
            // LIHAT STOCKIDS APAKAH ADA ATAU TIDAK
            let keyExist = Object.keys(it).some(key => key === 'stockIds');

            // JIKA STOCKIDS TIDAK ADA
            if (!keyExist) {
                // APABILA PAKET
                if (it.isPackage) {
                    // UBAH BENTUK DARI CONTOH "[1, 4, 6]" <= ID STOK MENJADI => [1, 4, 6] DAN UBAH STOKID PRODUK JADI NULL
                    it.stockIds = (JSON.parse(it.stockId?.toString() ?? '') as number[]) ?? []
                    it.stockId = null
                }
                // APABILA PRODUK
                if (!it.isPackage) {
                    // PERIKSA DAHULU APAKAH DIA BENTUK NUMBER ATAU STRING
                    // JIKA BUKAN NUMBER TAPI STRING BENTUK => "[1]"
                    if (!_.isEqual((typeof it.stockId), 'number')) {
                        // CONVERT DARI CONTOH "[1]" <= MENJADI => 1, DAN HAPUS STOKIDS PAKET
                        it.stockId = Number((JSON.parse(it.stockId?.toString() ?? '') as number[]))
                        delete it.stockIds
                    }
                    delete it.stockIds
                }
            }
        }
        // NAVIGASI KE HALAMAN CART DAN BYPASS DATA CART DARI SINI
        this.router.navigate(['v2/order'], { queryParams: { nav: 'shortcut' } })
        setTimeout(() => this._baseService.setTempSales(cart), 100)
    }

    // validationUpdatePackageOrProduct(tempItem: ItemTempSales[]) {
    //     console.log(tempItem);

    //     let items: ItemCart[] = []
    //     for (const it of tempItem) {
    //         let stock_package_id = it.isPackage ? JSON.parse(it.stockId) as number[] : []
    //         let stock_product_id = it.isPackage ? null : (JSON.parse(it.stockId) as number[])
    //         console.log(it);
    //         console.log(stock_package_id);
    //         console.log(stock_product_id);


    //     }
    // console.log(tempItem);
    // tempItem.forEach((x, i) => {
    //     // console.log('index ke ' + i);
    //     // console.log(x);
    //     // console.log(typeof x.stockId);
    //     // if ((typeof x.stockId) === 'number') {
    //     //     let numStock: number[] = []
    //     //     numStock.push(Number(x.stockId))
    //     //     console.log('"' + JSON.stringify(numStock) + '"');
    //     //     x.stockId = JSON.stringify(numStock)
    //     // }
    //     console.log("ini paket apa nggk ", x.isPackage);

    //     let stockId$: number | null = null;
    //     let stockIds$: number[] = []
    //     if (x.isPackage) {
    //         if (typeof x.stockId == 'string') {
    //             stockId$ = (JSON.parse(x.stockId) as number[])[0]
    //             stockIds$ = (JSON.parse(x.stockId) as number[])
    //         } else if (typeof x.stockId == 'object') {
    //             stockId$ = 0
    //         }
    //     }

    //     console.log((JSON.parse(x.stockId) as number[]));
    //     console.log((JSON.parse(x.stockId) as number[])[0]);

    //     let ic: ItemCart = new ItemCart(
    //         x.id,
    //         x.menuId,
    //         x.name,
    //         x.amount,
    //         x.unit,
    //         x.unitPrice,
    //         x.totalPrice,
    //         x.isPackage,
    //         stockId$, // STOCK ID
    //         x.pic,
    //         x.priceCatId,
    //         x.priceCat,
    //         stockIds$// STOCKIDS
    //     );
    //     console.log(ic);
    //     items.push(ic)
    // })
    //     return items;
    // }
    // UBAH BILL
    // =======================================================

    // =======================================================
    // CANCEL BILL
    confirmationCancelDialog(id: number) {
        let idTemp = id;
        this.dlg.showInputDialog("Batalkan Pesanan?", "Pembatalan pesanan", `apakah anda akan membatalkan pesanan ID# ${idTemp}`, "cancel", "Batalkan")
            .subscribe(resp => {
                if (resp.result) {
                    this.tempSalesService.cancelTempSales(idTemp, resp.data)
                        .subscribe(response => {
                            if (_.isEqual(response.statusCode, 0)) {
                                this.openSnackBar('Pembatalan tagihan berhasil')
                                this.clearMerge()
                                this.getTempSales()
                            }
                        }, (err: HttpErrorResponse) => {
                            this.openSnackBar('Pembatalan tagihan gagal')
                        })
                }
            })
    }
    // CANCEL BILL
    // =======================================================

    // =======================================================
    // DIALOG INFO

    openSnackBar(message: string) {
        this._snackBar.open(message, 'Tutup', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }



    // DIALOG INFO
    // =======================================================


    ngOnDestroy() {
        this.allsubs.forEach(subs => {
            subs.unsubscribe()
        })
        this.allsubs = []
    }
}


