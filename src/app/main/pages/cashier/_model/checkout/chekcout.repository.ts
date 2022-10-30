import { Injectable } from "@angular/core";
import { Checkout } from "./checkout.model";

@Injectable()
export class CheckoutRepository {
    checkout: Checkout = new Checkout()
    constructor() { }
}