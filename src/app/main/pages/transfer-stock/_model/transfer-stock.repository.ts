import { HttpErrorResponse } from "@angular/common/http";
import { Injectable, ViewChild } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import * as _ from "lodash";
import { Subject } from "rxjs";
import { ProductRepository } from "src/app/main/_model/product/product.repository";
import { ShiftRepository } from "src/app/main/_model/shift/shift.repository";
import { Warehouse } from "src/app/main/_model/warehouse/warehouse.model";
import { WarehouseRepository } from "src/app/main/_model/warehouse/warehouse.repository";
import { BaseService } from "src/app/main/_service/base.service";
import { DialogService } from "src/app/shared/dialogs/dialog.service";
import { Pageable } from "src/app/_model/general.model";
import { TimeUtil } from "src/app/_utility/time.util";
import { TransferStockComponent } from "../transfer-stock.component";
import { TransferStockService } from "../_service/transfer-stock.service";
import { CancelStatus, FilterStock, Product, Receive, ResultStock, Send, StatusTransfer, UpdateStatus } from "./transfer-stock.model";

@Injectable()
export class TransferStockRepository {

    position: 'send' | 'receive' = 'receive'

    filter: FilterStock = new FilterStock()
    result_stock?: ResultStock;
    send: Send = new Send()
    product_send: Product[] = []
    receive: Receive = new Receive()

    on_receive?: StatusTransfer;

    public is_loading: boolean = false;
    public is_loading_submit: boolean = false;
    today = new Date();

    public warehouses: Warehouse[] = []

    refresh = new Subject<string>();


    // SNACKBAR
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    // ================
    @ViewChild(TransferStockComponent) transfer?: TransferStockComponent

    constructor(private _transferstockService: TransferStockService, private shiftRepo: ShiftRepository,
        public timeUtil: TimeUtil, private _baseService: BaseService, public whRepo: WarehouseRepository,
        private _dlg: DialogService, private _snackBar: MatSnackBar, private _bottomSheet: MatBottomSheet,
        public prodRepo: ProductRepository) {
        this.init()
    }

    async init() {
        this.filter.branchId = await this.shiftRepo.onBranch
        this.filter.subBranchId = await this.shiftRepo.onSubBranch
        this.filter.startDate = await this.timeUtil.startTodayTime(this.today)
        this.filter.endDate = await this.timeUtil.endTodayTime(this.today)
        // this.filter.startDate = 1670864400000
        // this.filter.endDate = 1670950799000
        this.warehouses = await this.whRepo.warehouse
        this.fetch_transfer_stock()


    }




    fetch_transfer_stock() {
        this.is_loading = true
        this._transferstockService.getListTransferProduct(this.position, this.filter)
            .subscribe((res: any) => {
                this.result_stock = res['resultData']
                this.is_loading = false
            })
    }

    get _expense_list(): StatusTransfer[] {
        return this.result_stock?.content ?? []
    }

    get pagine(): Pageable | undefined {
        return this.result_stock?.pageable
    }


    next() {
        this.filter.page += 1
        this.fetch_transfer_stock()
    }

    prev() {
        this.filter.page -= 1
        this.fetch_transfer_stock()
    }

    get is_disabled_next() {
        return ((this.pagine?.pageNumber ?? 0) >= (this.pagine?.totalPage ?? 0))
    }

    get is_disabled_prev() {
        return (this.pagine?.pageNumber == 0)
    }


    on_receive_selection(item: StatusTransfer) {
        this.on_receive = item
    }

    plus(id: number) {
        let product = this.on_receive?.products.find(x => x.id == id)
        if (product && product.quantity >= 1) {
            if (!product.comparison) {
                product.comparison = (0 + 1)
            } else {
                product.comparison += 1
            }

            product.quantity += 1
        }
    }

    minus(id: number) {
        let product = this.on_receive?.products.find(x => x.id == id)
        if (product && product.quantity > 1) {
            if (!product.comparison) {
                product.comparison = (0 - 1)
            } else {
                product.comparison -= 1
            }
            product.quantity -= 1

        }
    }

    get_comparison_product(id: number) {
        let product_set = this.on_receive?.products.find(x => x.id == id)
        let result = product_set?.comparison
        if (result && result > 0) {
            return { status: 'Kelebihan: ', value: result }
        } else if (result && result < 0) {
            return { status: 'Kekurangan: ', value: result }
        }
        return { status: '', value: result }

    }




    // DRAG AND DROP SEND
    // ==========================================================================

    comparison_quantity(data: any) {
        let find = this.send.products?.find(x => x.productId == data.productId)
        if (find) {
            return data.quantity - find.quantity
        }
        return data.quantity
    }

    add_send(data: any) {
        let find = this.send.products?.find(x => x.productId == data.id)
        if (find) {
            find.quantity += 1;
        } else {
            let item_add: Product = new Product()
            item_add.productId = data.id
            item_add.quantity = 1
            item_add.name = data.name
            item_add.unit = data.unit
            this.send.products?.push(item_add)
        }
    }


    minus_send(id: number | null) {
        let find = this.send.products?.find(x => x.productId == id)
        if (find) {
            if (find.quantity > 1) {
                find.quantity -= 1;
            }
        }
    }

    plus_send(id: number | null) {
        let find = this.send.products?.find(x => x.productId == id)
        if (find) {
            find.quantity += 1;
        }
    }

    is_disabled_minus_send(id: number | null) {
        let find = this.send.products?.find(x => x.productId == id)
        if (find) {
            if (find.quantity > 1) {
                return false
            }
        }
        return true
    }

    is_disabled_plus_send(id: number | null) {
        let find = this.prodRepo.product_list?.find(x => x.productId == id)
        if (find) {
            let comp = this.comparison_quantity(find)
            if (comp >= 1) {
                return false
            } else {
                return true
            }
        }
        return true
    }

    remove_send(i: number) {
        this.send.products?.splice(i, 1)
    }


    //  DIALOG
    //  ================================================================
    openSnackBar(message: string) {
        this._snackBar.open(message, 'Tutup', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    // RECEIVED TRANSFER
    // ==========================================================================
    receivedTransfer() {
        this._dlg.showConfirmationDialog(
            'Konfirmasi Penerimaan Produk', // TITLE
            'Apakah kamu yakin ingin menerima product ' + this.on_receive?.note, // SUBTITLE
            'Apakah kamu yakin ingin menerima product ' + this.on_receive?.note, // MESSAGE
            'confirm-transfer', // ICON
            'Ya, Yakin', // CONFIRM
        ).subscribe(async (res) => {
            if (res) {
                if (this.on_receive) {
                    this.on_receive.isReceiverApproved = true
                    this.on_receive.receiveBy = this.shiftRepo.shift?.username ?? ''
                    this.on_receive.receiveApprover = this.shiftRepo.shift?.username ?? ''
                    this.receive = this.on_receive
                    this.doReceived()


                }

            }
        })
    }

    doReceived() {
        if (this.on_receive) {
            this.is_loading_submit = true
            this._transferstockService.upateTransferStock(this.receive).subscribe(res => {
                if (_.isEqual(res.statusCode, 0)) {
                    this.openSnackBar('Penerimaan transfer produk berhasil')
                    this.fetch_transfer_stock()
                    this.refresh.next('refresh')
                }
                this.is_loading_submit = false
            }, (err: HttpErrorResponse) => {
                this.openSnackBar('Penerimaan transfer produk gagal')
                this.is_loading_submit = false
            })
        }
    }

    destroyReceive() {
        this.receive = new Receive()
        this.on_receive = undefined
    }


    // CANCELED TRANSFER
    // ==========================================================================

    canceledTransfer(item: StatusTransfer) {
        this._dlg.showConfirmationDialog(
            'Konfirmasi Penolakan', // TITLE
            'Apakah kamu yakin ingin menolak transfer ' + item.note, // SUBTITLE
            'Apakah kamu yakin ingin menolak transfer ' + item.note, // MESSAGE
            'confirm-transfer', // ICON
            'Ya, Yakin', // CONFIRM
        ).subscribe(async (res) => {
            if (res) {
                this.is_loading_submit = true
                let cancel: CancelStatus = new CancelStatus()
                cancel.id = item.id
                cancel.isCanceled = true
                this._transferstockService.cancelTransferStock(cancel).subscribe(res => {
                    if (_.isEqual(res.statusCode, 0)) {
                        this.openSnackBar('Penolakan transfer produk berhasil')
                        this.fetch_transfer_stock()
                        this.destroyReceive()
                        this.refresh.next('refresh')
                    }
                    this.is_loading_submit = false
                }, (err: HttpErrorResponse) => {
                    this.openSnackBar('Penolakan transfer produk gagal')
                    this.is_loading_submit = false
                })
            }
        })
    }

    // DO TRANSFER
    // ==========================================================================
    sendTransfer() {
        if (this.send.note != '') {
            this._dlg.showConfirmationDialog(
                'Konfirmasi Pengiriman Produk', // TITLE
                'Apakah kamu yakin ingin mengirim transferan ini', // SUBTITLE
                'Apakah kamu yakin ingin mengirim transferan ini', // MESSAGE
                'confirm-transfer', // ICON
                'Ya, Yakin', // CONFIRM
            ).subscribe(async (res) => {
                if (res) {
                    this.prepare_transfer()
                }
            })
        } else {
            this.openSnackBar('Catatan tidak boleh kosong')
        }


    }

    prepare_transfer() {
        let wh = this.whRepo.warehouse.find(x => x.id == this.send.destWarehouseId)
        if (wh) {
            this.send.isBack = wh.subBranchId == null ? true : false
        }
        this.send.isSenderApproved = true
        this.send.sendBy = this.shiftRepo.shift?.username
        this.send.sendApprover = this.shiftRepo.shift?.username
        this.doTransferSend()
    }

    doTransferSend() {
        this.is_loading_submit = true
        this._transferstockService.createTransferStock(this.send)
            .subscribe(res => {
                if (_.isEqual(res.statusCode, 0)) {
                    this.openSnackBar('Produk sedang dikirim')
                    this.fetch_transfer_stock()
                    this.clear_send()
                    this.refresh.next('refresh')
                }
                this.is_loading_submit = false
            }, (err: HttpErrorResponse) => {
                this.openSnackBar('Produk gagal dikirim')
                this.is_loading_submit = false
            })
    }

    clear_send() {
        this.send = new Send()
    }
}