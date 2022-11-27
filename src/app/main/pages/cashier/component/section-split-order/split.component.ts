import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { DndDropEvent, EffectAllowed } from 'ngx-drag-drop';
import { DialogService } from 'src/app/shared/dialogs/dialog.service';
import { CheckoutRepository } from '../../_model/checkout/chekcout.repository';
import { Bill, ItemSplit, ItemTempSales, Split, TempSales } from '../../_model/tempsales.model';
import { TempSalesRepository } from '../../_model/tempsales.repository';

@Component({
    selector: 'split-app',
    templateUrl: 'split.component.html',
    styleUrls: ['split.component.css']
})

export class SplitComponent implements OnInit {
    tempSales: TempSales | undefined;
    draggable: any = {
        // note that data is handled with JSON.stringify/JSON.parse
        // only set simple data or POJO's as methods will be lost 
        data: null,
        effectAllowed: "copy",
        disable: false,
        handle: false
    };

    split_bill: Split = new Split()
    bills: Bill[] = []
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(
        public activeRoute: ActivatedRoute,
        public checkoutRepo: CheckoutRepository,
        public tempRepo: TempSalesRepository,
        public location: Location,
        private _snackBar: MatSnackBar,
        private dialogService: DialogService
    ) {

        activeRoute.queryParamMap.subscribe(res => {
            if (!_.isNull(res.get('id'))) {
                this.checkoutRepo.paymentId = Number(res.get('id'))
                this.checkoutRepo.tempSalesForCheckout
                this.tempSales = this.tempRepo.get_tempSalesById(this.checkoutRepo.paymentId)
                // console.log(this.tempSales);
                if (this.tempSales) {
                    this.draggable.data = this.tempSales.items
                } else {
                    this.location.back()
                }
            } else {
                this.location.back()
            }
        })

    }

    ngOnInit() {
        this.generateFirstSplit()
    }

    generateFirstSplit() {
        for (let index = 0; index < 2; index++) {
            let bill: Bill = new Bill()
            bill.name = ''
            bill.note = ''
            bill.items = []
            this.bills.push(bill)
        }
    }



    onDragStart(event: DragEvent) {
        console.log("drag started", JSON.stringify(event, null, 2));
    }

    onDragEnd(event: DragEvent) {

        console.log("drag ended", JSON.stringify(event, null, 2));
    }

    onDraggableCopied(event: DragEvent) {

        console.log("draggable copied", JSON.stringify(event, null, 2));
    }

    onDraggableLinked(event: DragEvent) {

        console.log("draggable linked", JSON.stringify(event, null, 2));
    }

    onDraggableMoved(event: DragEvent) {

        console.log("draggable moved", JSON.stringify(event, null, 2));
    }

    onDragCanceled(event: DragEvent) {

        console.log("drag cancelled", JSON.stringify(event, null, 2));
    }

    onDragover(event: DragEvent, idx: number) {
        console.log("dragover", JSON.stringify(event, null, 2));
    }

    onDrop(event: DndDropEvent, idx: number) {
        // console.log("dropped", JSON.stringify(event, null, 2));
        console.log(event.data, idx);
        let inData: ItemTempSales = event.data
        let line = this.bills.at(idx)?.items.find(x => (x.menuId == inData.menuId && x.id == inData.id))
        if (line != undefined) {
            line.amount += 1;
            this.updateDropMainStock(inData.menuId, inData.id)
        } else {
            let item_split: ItemSplit = new ItemSplit()
            item_split.id = inData.id
            item_split.name = inData.name
            item_split.menuId = inData.menuId
            item_split.amount = 1
            this.bills.at(idx)?.items.push(item_split)
            this.updateDropMainStock(inData.menuId, inData.id)
        }

        console.log(this.bills);
    }

    updateDropMainStock(menuId: string, id: number) {
        const obj = this.tempSales?.items.find(x => (x.menuId == menuId && x.id == id))
        if (obj) {
            obj.amount -= 1
        }
    }

    plus(idx: number, menuId: string, id: number) {
        const obj = this.tempSales?.items.find(x => (x.menuId == menuId && x.id == id))
        if (obj && obj.amount > 0) {
            obj.amount -= 1
            let line = this.bills.at(idx)?.items.find(x => (x.menuId == menuId && x.id == id))
            if (line != undefined) {
                line.amount += 1;
            }
        }
    }

    get_disablePlus(menuId: string, id: number) {
        const obj = this.tempSales?.items.find(x => (x.menuId == menuId && x.id == id))
        if (obj && obj.amount > 0) {
            return false
        }
        return true
    }



    minus(idx: number, menuId: string, id: number) {
        const obj = this.tempSales?.items.find(x => x.menuId == menuId && x.id == id)
        if (obj) {
            obj.amount += 1
            let line = this.bills.at(idx)?.items.find(x => x.menuId == menuId && x.id == id)
            if (line && line.amount > 1) {
                line.amount -= 1;
            }
        }
    }

    removeItemAt(idx: number, menuId: string, id: number) {
        let line = this.bills.at(idx)?.items.find(x => x.menuId == menuId && x.id == id)
        if (line) {
            const obj = this.tempSales?.items.find(x => x.menuId == line?.menuId && x.id == line?.id)
            if (obj) {
                let index = this.bills.at(idx)?.items.findIndex(o => o.menuId == obj.menuId && o.id == obj.id)
                if (typeof index === 'number') {
                    obj.amount += line.amount
                    this.bills.at(idx)?.items.splice(index, 1);
                }
            }
        }
    }

    addBill() {
        let bill: Bill = new Bill()
        bill.name = ''
        bill.note = ''
        bill.items = []
        this.bills.push(bill)
    }

    remove_bill(idx: number) {
        // this.bills.splice(idx, 1)
        if (this.bills.at(idx)?.items.length === 0) {
            this.bills.splice(idx, 1)
        }

        this.bills.at(idx)?.items.filter(x => {
            const obj = this.tempSales?.items.find(y => (y.menuId == x.menuId && y.id == x.id))
            if (obj) {
                console.log(obj);
                let index = this.bills.at(idx)?.items.findIndex(o => o.menuId == obj.menuId && o.id == obj.id)
                let bill = this.bills.at(idx)?.items.find(o => o.menuId == obj.menuId && o.id == obj.id)
                console.log(bill, index);
                if (typeof index === 'number' && bill) {
                    console.log('asd');

                    obj.amount += bill.amount
                    this.bills.at(idx)?.items.splice(index, 1);
                }
                this.bills.splice(idx, 1)
            }
        })
    }

    get_desc_price(id: number | null) {
        return this.tempSales?.items.find(x => x.id === id)?.priceCat
    }

    async doSplit() {
        if (this.checkValidateSplit()) {
            this.split_bill.tempSalesId = this.tempSales?.id
            this.split_bill.waiter = this.tempSales?.waiter ?? ''
            this.split_bill.bills = this.bills
            // console.log(this.split_bill);
            await this.dialogService.showConfirmationDialog('Pisah Tagihan', 'Konfirmasi kembali pisah tagihan', `Yakin ingin memisahkan tagihan dengan id  ${this.tempSales?.id}`, 'split-image', 'Ya, Yakin')
                .subscribe(res => {
                    if (res) {
                        this.tempRepo.submit_split(this.split_bill)
                    }
                })

        }
    }

    checkValidateSplit(): boolean {
        let reduce = this.tempSales?.items.reduce((a, b) => +a + b.amount, 0)
        if (reduce === 0) {
            let data = this.bills.find(x => x.items.length === 0)
            if (data) {
                this.openSnackBar('setiap form tagihan harus diisi minimal 1 produk/paket')
                return false
            }
            return true
        } else {
            this.openSnackBar('Beberapa produk masih ada yang belum dipindahkan')
            return false
        }
    }

    // checkTempSalesIsExistInSplit(id: number){
    //     this.bills.find(x => x.items)
    // }



    // ===============================
    // DIALOG
    openSnackBar(message: string) {
        this._snackBar.open(message, 'Tutup', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
}