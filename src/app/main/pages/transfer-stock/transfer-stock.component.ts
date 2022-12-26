import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DndDropEvent } from 'ngx-drag-drop';
import { debounceTime, Observable, Subject } from 'rxjs';
import { TimeUtil } from 'src/app/_utility/time.util';
import { ProductRepository } from '../../_model/product/product.repository';
import { ShiftRepository } from '../../_model/shift/shift.repository';
import { Warehouse } from '../../_model/warehouse/warehouse.model';
import { WarehouseRepository } from '../../_model/warehouse/warehouse.repository';
import { DetailTransferComponent } from './_dialog/detail-transfer.component';
import { ProductStatusTransfer, StatusTransfer } from './_model/transfer-stock.model';
import { TransferStockRepository } from './_model/transfer-stock.repository';

@Component({
    selector: 'transfer-stock-app',
    templateUrl: 'transfer-stock.component.html',
    styleUrls: ['transfer-stock.component.css']
})

export class TransferStockComponent implements OnInit {
    selected: Date = new Date();
    tab = 0
    today: Date = new Date();

    draggable: any = {
        // note that data is handled with JSON.stringify/JSON.parse
        // only set simple data or POJO's as methods will be lost 
        data: null,
        effectAllowed: "copy",
        disable: false,
        handle: false
    };
    search_find_list = new Subject<string>();
    search_product = new Subject<string>();
    constructor(public location: Location, public trfsRepo: TransferStockRepository, public wareRepo: WarehouseRepository,
        public time: TimeUtil, private shiftRepo: ShiftRepository, private _mat_dialog: MatDialog, public prodRepo: ProductRepository) { }

    async ngOnInit() {
        setTimeout(() => {
            this.init_send()
        }, 500)
        this.search()
        this.refresh()
    }

    refresh() {
        this.trfsRepo.refresh.subscribe(() => {
            this.tab = 0
        })
    }

    search() {
        this.search_product.pipe(debounceTime(500)
        ).subscribe(x => {
            this.prodRepo.fetch_product(x)
        });
        this.search_find_list.pipe(debounceTime(500)
        ).subscribe(x => {
            this.trfsRepo.fetch_transfer_stock()
        });
    }

    async init_send() {
        let find_from = await this.warehouses.find(x => x.branchId == this.shiftRepo.onBranch && x.subBranchId == this.shiftRepo.onSubBranch)
        let find_dest = await this.warehouses.find(x => x.branchId == this.shiftRepo.onBranch && x.subBranchId == null)
        this.trfsRepo.send.frmWarehouseId = await find_from?.id
        this.trfsRepo.send.destWarehouseId = await find_dest?.id
    }

    get warehouses() {
        return this.wareRepo.warehouse
    }

    get day() {
        return this.today.getMilliseconds()
    }

    get products_send() {
        return this.trfsRepo.send.products
    }

    get_warehouse(id: number) {
        return this.wareRepo.warehouse.find(x => x.id == id)?.name
    }

    changeDate(e: any) {
        this.selected = this.time.convertDateTimeLocale(e);
        this.trfsRepo.filter.startDate = this.time.startTodayTime(this.selected)
        this.trfsRepo.filter.endDate = this.time.endTodayTime(this.selected)
        this.trfsRepo.fetch_transfer_stock()
    }

    applyFilter(e: Event) {
        const filterValue = (e.target as HTMLInputElement).value;
        this.trfsRepo.filter.search = filterValue.trim().toLowerCase();
        this.search_find_list.next('')
    }

    searchFilter(data: any) {
        if (data == '') {
            this.prodRepo.fetch_product('')
        } else {
            this.search_product.next(data.value)
        }
    }

    get_all_transfer() {
        this.trfsRepo.fetch_transfer_stock()
    }

    get_all_prod() {
        this.prodRepo.fetch_product('')
    }

    clear() {
        this.trfsRepo.filter.search = ''
    }

    disabled_onsite(item: Warehouse) {
        return (this.shiftRepo.onBranch == item.branchId) && (this.shiftRepo.onSubBranch == item.subBranchId)
    }

    toggle(event: MatSlideToggleChange) {
        // console.log('Toggle fired', event);
        this.trfsRepo.position = event.checked ? 'receive' : 'send'
        if (this.trfsRepo.position == 'send') {
            this.trfsRepo.filter.branchId = this.shiftRepo.onBranch
            this.trfsRepo.filter.subBranchId = this.shiftRepo.onSubBranch
        }
        this.trfsRepo.fetch_transfer_stock()
    }

    changeDestination(e: any) {
        console.log(e.value);
        this.trfsRepo.fetch_transfer_stock()
    }

    is_waiting_receive(item: StatusTransfer) {
        return (!item.isReceiverApproved && item.isSenderApproved)
    }

    core_status(item: StatusTransfer) {
        if (item.isDone && !item.isCanceled) {
            return 'received'
        } else if (item.isCanceled && item.isDone) {
            return 'rejected'
        } else {
            return ''
        }
    }

    display_status(item: StatusTransfer): any {
        if (item.isDone && !item.isCanceled) {
            return { status: 'Diterima', style: 'd-accepted' }
        } else if (item.isCanceled && item.isDone) {
            return { status: 'Ditolak', style: 'd-rejected' }
        } else {
            return { status: 'Menunggu Persetujuan', style: 'd-waiting' }
        }
    }

    detail_product(data: ProductStatusTransfer[]) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = data
        dialogConfig.backdropClass = 'backdropBackground';
        dialogConfig.disableClose = true;
        dialogConfig.minWidth = '400px';
        dialogConfig.panelClass = 'panel-dialog-x';
        const dialogCustom = this._mat_dialog.open(
            DetailTransferComponent,
            dialogConfig
        );
        return dialogCustom.afterClosed();
    }

    on_receivement(item: StatusTransfer) {
        this.tab = 2
        this.trfsRepo.on_receive_selection(item)
    }

    back_to_list() {
        this.tab = 0
        this.trfsRepo.on_receive = undefined
        console.log(this.trfsRepo.on_receive);
    }

    // DRAG AND DROP
    // ======================================
    onDragStart(event: DragEvent) {
        // console.log("drag started", JSON.stringify(event, null, 2));
    }

    onDragEnd(event: DragEvent) {
        // console.log("drag ended", JSON.stringify(event, null, 2));
    }

    onDraggableCopied(event: DragEvent) {
        // console.log("draggable copied", JSON.stringify(event, null, 2));
    }

    onDraggableLinked(event: DragEvent) {
        // console.log("draggable linked", JSON.stringify(event, null, 2));
    }

    onDraggableMoved(event: DragEvent) {
        // console.log("draggable moved", JSON.stringify(event, null, 2));
    }

    onDragCanceled(event: DragEvent) {
        // console.log("drag cancelled", JSON.stringify(event, null, 2));
    }

    onDragover(event: DragEvent) {
        // console.log("dragover", JSON.stringify(event, null, 2));
    }

    onDrop(event: DndDropEvent) {
        // console.log("dropped", JSON.stringify(event, null, 2)););
        this.trfsRepo.add_send(event.data.product);
    }






}