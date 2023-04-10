import { Location } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import * as _ from "lodash";
import { isNil } from "lodash";
import { BehaviorSubject, Subscription } from "rxjs";
import { Additional } from "src/app/main/_model/additional/additional.model";
import { Discount } from "src/app/main/_model/discount/discount.model";
import { Reservation } from "src/app/main/_model/reservation/reservation.model";
import { ShiftRepository } from "src/app/main/_model/shift/shift.repository";
import { BaseService } from "src/app/main/_service/base.service";
import { SocketService } from "src/app/main/_service/socket.service";
import { DialogService } from "src/app/shared/dialogs/dialog.service";
import { TimeUtil } from "src/app/_utility/time.util";
import { CartLine, ItemCart } from "../../order/_model/_cart/cart.model";
import { TablesRepository } from "../../tables/_model/tables.repository";
import { TemporarySalesService } from "../_service/temporarysales.service";
import { DataTempSales, FindTempSales, ItemTempSales, Merge, Split, TempSales } from "./tempsales.model";
import { ReportSales } from "../../report/_model/report.model";

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
    public isLoadingSplit = false;
    // ================

    // SNACKBAR
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    // ================

    // SOCKET
    /* Subscription Properties */
    socketSub = new Subscription();
    errorSub = new Subscription();
    socketStatusSub = new Subscription();
    /* Subscription Properties */
    //   =====================

    find_report_data: BehaviorSubject<ReportSales> = new BehaviorSubject<ReportSales>({} as ReportSales)


    allsubs: Subscription[] = []
    constructor(private tempSalesService: TemporarySalesService,
        private shiftRepo: ShiftRepository, public timeUtil: TimeUtil,
        private _snackBar: MatSnackBar, private _dlg: DialogService,
        private tableRepo: TablesRepository,
        private _baseService: BaseService, private router: Router,
        private location: Location,
        private _socket: SocketService
    ) {
        this.findTempSales.branchId = shiftRepo.onBranch;
        this.findTempSales.subBranchId = shiftRepo.onSubBranch;
        this.getTempSales()
        this.listen_report_initialize()
        // this.initSocket()
    }

    listen_report_initialize() {
        this.find_report_data.subscribe(res => {
            console.log('find_report_data => ', res);
            console.log('length => ', Object.keys(res).length);
            
            if (Object.keys(res).length > 0) {
                this._dlg.showViewReceipt(res).subscribe(res => {
                    console.log('res ', res);
                    
                })
            }
        })
    }

    refreshTempsales() {
        this.findTempSales.branchId = this.shiftRepo.onBranch;
        this.findTempSales.subBranchId = this.shiftRepo.onSubBranch;
        this.getTempSales()
    }

    clearTempsalesActive() {
        this.tempSalesActive = undefined
    }

    // initSocket() {
    //     this.connectSocketServer();
    //     this.listenError();
    //     this.checkConnectionStatus();
    //     this.getSocketStatusValue();
    // }

    // =======================================================
    // AUDIO4
    playAudio() {
        let audio = new Audio();
        audio.src = 'assets/sounds/message-order.mp3';
        audio.load();
        audio.play();
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

    get_tempSalesById(id: number): TempSales | undefined {
        return this.tempSales.find(x => x.id === id)
    }

    set setStartDate(date: Date) {
        let get_time = this.timeUtil.getJustTimeLocalMillis(this.findTempSales.startDate)
        let get_milis_time = this.timeUtil.setTimeInDate(get_time, date)
        this.findTempSales.startDate = get_milis_time
    }

    set setEndDate(date: Date) {
        let get_time = this.timeUtil.getJustTimeLocalMillis(this.findTempSales.endDate)
        let get_milis_time = this.timeUtil.setTimeInDate(get_time, date)
        this.findTempSales.endDate = get_milis_time
    }

    get disablePrevList() {
        return ((this.tempSalesPagine?.pageNumber ?? 0) === 0)
    }

    get disbaleNextList() {
        // // console.log(this.tempSalesPagine);

        return ((this.tempSalesPagine?.pageNumber ?? 0) >= (this.tempSalesPagine?.totalPage ?? 0))
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
        if (this.merge.bills.length > 1) {
            this._dlg.showConfirmationDialog("Gabung tagihan", "", "apakah anda ingin memnggabungkan tagihan ini ?", "merge-bill", "Ya")
                .subscribe(res => {
                    if (res) {
                        this.isLoadingMerge = true
                        this.tempSalesService.mergeTempSales(this.merge).subscribe(res => {
                            if (_.isEqual(res.statusCode, 0)) {
                                this._dlg.showSWEDialog('Berhasil!', `Penggabungan tagihan berhasil`, 'success')
                                this.clearMerge()
                                this.getTempSales()
                                this.isLoadingMerge = false
                            }
                        }, (err: HttpErrorResponse) => {
                            this._dlg.showSWEDialog('Oopps!', `Penggabungan tagihan gagal`, 'error')
                            this.isLoadingMerge = false
                        })
                    }
                })
        } else {
            this.openSnackBar('Anda masih memilih 1 tagihan untuk digabungkan')
        }
    }
    // MERGE BILL
    // =======================================================


    // =======================================================
    // SPLIT BILL
    submit_split(split: Split) {
        this.isLoadingSplit = true
        setTimeout(() => {
            this.tempSalesService.splitTempSales(split).subscribe(async res => {
                this.isLoadingSplit = false
                if (_.isEqual(res.statusCode, 0)) {
                    this._dlg.showSWEDialog('Berhasil!', `Pemisahan tagihan berhasil`, 'success')
                    this.getTempSales()
                    this.location.back()
                }
            }, (err: HttpErrorResponse) => {
                this.isLoadingSplit = false
                this._dlg.showSWEDialog('Oopps!', `Pemisahan tagihan gagal`, 'error')
            })
        }, 1000)
    }

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

    updateTempSales() {
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

    // UBAH BILL
    // =======================================================

    // =======================================================
    // CANCEL BILL
    confirmationCancelDialog(id: number) {
        let idTemp = id;
        this._dlg.showInputDialog("Batalkan Pesanan?", "Pembatalan pesanan", `apakah anda akan membatalkan pesanan ID# ${idTemp}`, "cancel", "Batalkan")
            .subscribe(resp => {
                if (resp.result) {
                    this.tempSalesService.cancelTempSales(idTemp, resp.data)
                        .subscribe(response => {
                            if (_.isEqual(response.statusCode, 0)) {
                                this._dlg.showSWEDialog('Berhasil!', `Pembatalan tagihan berhasil`, 'success')
                                this.clearMerge()
                                this.getTempSales()
                            }
                        }, (err: HttpErrorResponse) => {
                            this.openSnackBar('Pembatalan tagihan gagal')
                            this._dlg.showSWEDialog('Oopps!', `Pembatalan tagihan gagal`, 'error')
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

    // DESTROY
    // =======================================================
    ngOnDestroy() {
        this.allsubs.forEach(subs => {
            subs.unsubscribe()
        })
        this.allsubs = []
    }

    // SOCKET
    // ========================================================
    /* Connect to Socket Server Function */
    /* Panggil Koneksi ke socket melalui fungsi socketService */
    connectSocketServer() {
        this._socket.connect();
    }

    /* Listen to Error From Server Function */
    /* Fungsi standby jika ada error pada koneksi socket */
    listenError() {
        this.errorSub = this._socket.listenError().subscribe((response: any) => {
            alert('Socket Connection Error');
        });
    }

    /* Send Trigger Data Emit Function */
    /* Kirim Data Trigger Ke Socket Server */
    sendTriggerEmit() {
        const triggerData: any = {
            branchId: this.shiftRepo.onBranch,
            subBranchId: this.shiftRepo.onSubBranch,
        };
        this._socket.sendTrigger(triggerData);
    }

    /* Check Connection Status Function */
    checkConnectionStatus() {
        this._socket.checkConnectionStatus();
    }

    /* Get SocketStatus Value Function */
    /* Fungsi untuk mendapatkan status koneksi socket */
    getSocketStatusValue() {
        this.socketStatusSub = this._socket.getSocketStatus().subscribe((response: boolean) => {
            // // console.log('Socket Status:', response);
            if (response) this.listenIncomingTrigger();
        });
    }

    /* Listen Incoming Data Function */
    /* Fungsi standby mendapatkan data yang masuk dari socket */
    listenIncomingTrigger() {
        this.socketSub = this._socket.listenTriggerData().subscribe((response: any) => {
            // // console.log('Trigger Response:', response);
            // Jika statusCode dari response tidak null/undefined
            if (!isNil(response.statusCode)) {
                // this.responseData.push(response.data);
                if (
                    _.isEqual(response.data.branchId, this.shiftRepo.onBranch) &&
                    _.isEqual(response.data.subBranchId, this.shiftRepo.onSubBranch)
                ) {
                    // // console.log('trigger');
                    this.playAudio();
                    this.openSnackBar('Ada Pesanan baru!!!');
                    this.getTempSales();
                }
            }
        });
    }
}


