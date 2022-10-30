import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { CustomerService } from "../../_service/customer.service";
import { DataCustomer } from "./customer.model";

@Injectable()
export class CustomerRepository {

    public dataCustomer: DataCustomer | undefined;

    subsDisc?: Subscription;
    constructor(private customerService: CustomerService) {
        this.getCustomer()
    }

    getCustomer() {
        this.subsDisc = this.customerService.getCustomer().subscribe(res => {
            this.dataCustomer = res.data
        })
    }

    get discounts() {
        return this.dataCustomer?.content ?? []
    }

    get discountPagine() {
        return this.dataCustomer?.pageable
    }
}