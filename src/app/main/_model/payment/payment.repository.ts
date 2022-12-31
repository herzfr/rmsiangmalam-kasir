import { Injectable } from "@angular/core";
import { PaymentService } from "../../_service/payment.service";
import { FindPayment, PaymentMehod } from "./payment.model";

@Injectable()
export class PaymentRepository {
    public findPayment: FindPayment = new FindPayment()
    public dataPayment: PaymentMehod[] = []
    constructor(private _paymentService: PaymentService) {
        _paymentService.getPaymentMethod(this.findPayment).subscribe(res => {
            this.dataPayment = res.data['content']
        })
    }

    get paymentMethod(): PaymentMehod[] {
        return this.paymentMethod
    }

    getPaymentType(type: string): PaymentMehod[] {
        return this.dataPayment.filter(x => x.type == type)
    }

    getPaymentTypeById(id?: number): string | undefined {
        return this.dataPayment.find(x => x.id == id)?.name
    }


}