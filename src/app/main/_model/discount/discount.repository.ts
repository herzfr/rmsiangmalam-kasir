import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { DiscountService } from "../../_service/discount.service";
import { DataDiscount, FindDiscount } from "./discount.model";

@Injectable()
export class DiscountRepository {

    public findDisc: FindDiscount = new FindDiscount()
    public dataDiscount: DataDiscount | undefined;

    subsDisc?: Subscription;
    constructor(private discountService: DiscountService) {
        this.getDiscount()
    }

    getDiscount() {
        this.subsDisc = this.discountService.getDiscount(this.findDisc).subscribe(res => {
            this.dataDiscount = res.data
        })
    }

    get discounts() {
        return this.dataDiscount?.content ?? []
    }

    get discountPagine() {
        return this.dataDiscount?.pageable
    }
}