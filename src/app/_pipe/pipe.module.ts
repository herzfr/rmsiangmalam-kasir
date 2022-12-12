import { NgModule } from '@angular/core';
import { MilisToDatePipe } from './datepipe-custom.pipe';
import { PaymentCode } from './iconpipe-payment.pipe';
import { ReversePipe } from './reverse-list.pipe';



@NgModule({
    exports: [MilisToDatePipe, ReversePipe, PaymentCode],
    declarations: [MilisToDatePipe, ReversePipe, PaymentCode],
})
export class PipeModule { }
