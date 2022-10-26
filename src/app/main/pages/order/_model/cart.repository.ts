import { Injectable } from "@angular/core";
import { CartLine, ItemCart } from "./cart.model";
import { Package, Product } from "./menu.model";
import { PriceCategory } from "./order.model";

@Injectable()
export class CartRepository {
    public lines: ItemCart[] = [];
    public cart: CartLine = new CartLine();
    public itemCount: number = 0;
    public cartPrice: number = 0;


    addLineProduct(prodpack: Product | Package, quantity: number = 1, typePrice: string, priceCat: PriceCategory | undefined, isPackage: boolean) {
        let line = this.lines.find(line => line.menuId == prodpack.id);
        if (line != undefined) {
            line.amount += quantity;
        } else {
            let price = (prodpack.prices.find(x => x.priceCategory == typePrice)?.price ?? 0)
            let totalPrice = price * quantity
            this.lines.push(new ItemCart(
                prodpack.id,
                prodpack.name,
                quantity,
                isPackage ? null : (prodpack as Product).unit,
                price,
                totalPrice,
                isPackage,
                isPackage ? null : (prodpack as Product).stockId,
                prodpack.pic,
                priceCat!.id,
                priceCat!.name,
                isPackage ? (prodpack as Package).stockIds : [],
            ));
        }
        this.recalculate();
    }

    updateQuantityPlus(item: ItemCart, quantity: number) {
        let line = this.lines.find(line => line.menuId === item.menuId);
        if (line != undefined) {
            line.amount += quantity;
        }
        this.recalculate();
    }

    updateQuantityMinus(item: ItemCart, quantity: number) {
        let line = this.lines.find(line => line.menuId === item.menuId);
        if (line != undefined && line.amount > 1) {
            line.amount -= quantity;
        }
        this.recalculate();
    }

    removeLine(id: string) {
        let index = this.lines.findIndex(line => line.menuId == id);
        this.lines.splice(index, 1);
        this.recalculate();
    }

    clear() {
        this.lines = [];
        this.cart = new CartLine();
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
            this.cart.items = this.lines
            return this.cart
        }
        return;
    }

}