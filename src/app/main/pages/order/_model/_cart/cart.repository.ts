import { Injectable } from "@angular/core";
import { CartLine, ItemCart } from "./cart.model";
import { Package, Product, Shortcut } from ".././menu.model";
import { PriceCategory } from ".././order.model";
import { BaseService } from "src/app/main/_service/base.service";
import { ItemTempSales, TempSales } from "../../../cashier/_model/tempsales.model";
import * as _ from "lodash";

@Injectable()
export class CartRepository {
    public lines: ItemCart[] = [];
    public cart: CartLine = new CartLine();
    public itemCount: number = 0;
    public cartPrice: number = 0;

    constructor(private _baseService: BaseService) {
        this.cart.tableIds.push(0)
        _baseService.tempSale$.subscribe(res => {
            // console.log(res);
            this.clear()
            this.cart = res
            this.lines = this.cart.items ?? []
        })
    }

    doSomething(event: any) {
        // console.log(event);
        // console.log(this.cart.tableIds);

    }


    addLineProduct(prodpack: Product | Package, quantity: number = 1, typePrice: string, priceCat: PriceCategory | undefined, isPackage: boolean) {
        let line = this.lines.find(line => line.menuId == prodpack.id && line.priceCatId === (priceCat?.id ?? null));

        if (line != undefined) {
            line.amount += quantity;
        } else {
            let price = (prodpack.prices.find(x => x.priceCategory == typePrice)?.price ?? 0)
            let totalPrice = price * quantity
            let newItem = new ItemCart(
                0,
                prodpack.id,
                prodpack.name,
                quantity,
                isPackage ? 'package' : (prodpack as Product).unit,
                price,
                totalPrice,
                isPackage,
                isPackage ? null : (prodpack as Product).stockId,
                prodpack.pic,
                priceCat!.id,
                priceCat!.name,
                isPackage ? (prodpack as Package).stockIds : [],
            );
            this.lines.push(newItem);
        }
        this.recalculate();
    }

    addLineShortcut(shortcut: Shortcut, quantity: number = 1, typePrice: string, priceCat: PriceCategory | undefined) {
        let line = this.lines.find(line => line.menuId == shortcut.id && line.priceCatId === (priceCat?.id ?? null));
        if (line != undefined) {
            line.amount += quantity;
        } else {
            let price = (shortcut.prices.find(x => x.priceCategory == typePrice)?.price ?? 0)
            let totalPrice = price * quantity
            let newItem = new ItemCart(
                0,
                shortcut.id,
                shortcut.name,
                quantity,
                _.isUndefined(shortcut.packageId) ? 'package' : (shortcut.unit ?? ''),
                price,
                totalPrice,
                _.isUndefined(shortcut.packageId),
                _.isUndefined(shortcut.packageId) ? null : (shortcut.stockId ?? null),
                shortcut!.pic ?? '',
                priceCat!.id,
                priceCat!.name,
                [],
            );
            this.lines.push(newItem);
        }
    }



    updateQuantityPlus(item: ItemCart, quantity: number, priceCatId: number) {
        let line = this.lines.find(line => line.menuId == item.menuId && line.priceCatId === priceCatId);
        if (line != undefined) {
            line.amount += quantity;
        }
        this.recalculate();
    }

    updateQuantityMinus(item: ItemCart, quantity: number, priceCatId: number) {
        let line = this.lines.find(line => line.menuId === item.menuId && line.priceCatId === priceCatId);
        if (line != undefined && line.amount > 1) {
            line.amount -= quantity;
        }
        this.recalculate();
    }

    removeLine(id: string, priceCatId: number) {
        let index = this.lines.findIndex(line => line.menuId == id && line.priceCatId === priceCatId);
        this.lines.splice(index, 1);
        this.recalculate();
    }

    clear() {
        this.lines = [];
        this.cart = new CartLine();
        this.cart.tableIds.push()
        this.itemCount = 0;
        this.cartPrice = 0;
    }

    private recalculate() {
        this.itemCount = 0;
        this.cartPrice = 0;
        this.lines.forEach((l, i) => {
            this.itemCount += l.amount;
            this.cartPrice += l.unitPrice;
            this.lines[i].totalPrice = l.unitPrice * this.lines[i].amount
        })
    }

    get grandTotal() {
        return this.lines.reduce((a, b) => +a + +b.totalPrice, 0);
    }

    get cartComplete() {
        if (this.cart) {
            this.cart.items = undefined
            let data: any[] = this.lines
            data.forEach(el => {
                // console.log(el);

                if (el.isPackage) {
                    delete el.stockId
                } else {
                    delete el.stockIds
                }
            })
            this.cart.items = data
            return this.cart
        }
        return;
    }

    insertCartLineFromTemp(temp: TempSales) {
        let tmp_sales: any = temp
        this.cart = tmp_sales as CartLine
        this.cart.items = []
        this.lines = this.validationUpdatePackageOrProduct(temp.items) ?? []
        // // console.log(this.cart);
        // // console.log(this.lines);
    }

    validationUpdatePackageOrProduct(tempItem: ItemTempSales[]) {
        let items: ItemCart[] = []
        tempItem.forEach((x) => {
            let ic: ItemCart = new ItemCart(
                x.id,
                x.menuId,
                x.name,
                x.amount,
                x.unit,
                x.unitPrice,
                x.totalPrice,
                x.isPackage,
                x.isPackage ? 0 : (JSON.parse(x.stockId) as number[])[0], // STOCK ID
                x.pic,
                x.priceCatId,
                x.priceCat,
                x.isPackage ? (JSON.parse(x.stockId) as number[]) : [] // STOCKIDS
            );

            items.push(ic)
        })
        return items;
    }

}