import { NgModule } from '@angular/core';
import { MilisToDatePipe } from './datepipe-custom.pipe';



@NgModule({
    exports: [MilisToDatePipe],
    declarations: [MilisToDatePipe],
})
export class PipeModule { }
