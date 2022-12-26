import { Injectable } from "@angular/core";
import { ProductService } from "../../_service/product.service";
import { ShiftRepository } from "../shift/shift.repository";
import { ProductStockInfo } from "./product.model";

@Injectable()
export class ProductRepository {
    product_list: ProductStockInfo[] = []
    is_loading_product: boolean = false
    constructor(private _productService: ProductService, private _shiftRepo: ShiftRepository) {
        this.fetch_product('')
    }

    fetch_product(search: string) {
        this.is_loading_product = true
        this._productService.get_all_product(this._shiftRepo.onBranch, this._shiftRepo.onSubBranch, search).subscribe(res => {
            this.product_list = res.data
            setTimeout(() => {
                this.is_loading_product = false
            }, 200)
        })
    }


}