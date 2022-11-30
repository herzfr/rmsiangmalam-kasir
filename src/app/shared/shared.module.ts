import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from './form/form-builder.component';
import { FieldBuilderComponent } from './form/field-builder/field-builder.component';
import { TextBoxComponent } from './form/atoms/textbox';
import { HiLowValidatorDirective } from './form/validator/hilow';
import { ValidationHelper } from './form/validator/validation_helper';
import { ValidationErrorDirective } from './form/validator/validationError.directive';
import { DialogService } from './dialogs/dialog.service';
import { InfoDialogComponent } from './dialogs/general-dialogs/info-dialog.component';
import { MaterialShared } from './material.module';
import { UserRespository } from '../auth/auth.repository';
import { VerifyDialogComponent } from './dialogs/general-dialogs/verification-dialog.component';
import { UserCardComponent } from './component/user-card/user-card.component';
import { ShiftCardComponent } from './component/shift-card/shift-card.component';
import { FormDialogComponent } from './dialogs/form-dialogs/form-dynamic.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { DropDownComponent } from './form/atoms/dropdown';
import { ProductCardComponent } from './component/product-card/product-card.component';
import { CurrencyRupiahPipe } from './directives/currency.pipe';
import { PackageCardComponent } from './component/package-card/package-card.component';
import { InputDialogComponent } from './dialogs/general-dialogs/input-dialog.component';
import { WebcamModule } from 'ngx-webcam';
import { WebCamComponent } from '../shared/dialogs/general-dialogs/webcam.component';

@NgModule({
    imports: [
        CommonModule,
        MaterialShared,
        FormsModule,
        ReactiveFormsModule,
        CurrencyMaskModule,
        WebcamModule
    ],
    exports: [
        DynamicFormComponent,
        FieldBuilderComponent,
        TextBoxComponent,
        DropDownComponent,
        HiLowValidatorDirective,
        ValidationHelper,
        ValidationErrorDirective,

        // PIPE
        CurrencyRupiahPipe,

        // DIALOG
        InfoDialogComponent,
        VerifyDialogComponent,
        FormDialogComponent,
        InputDialogComponent,
        WebCamComponent,

        // COMPONENT
        UserCardComponent,
        ShiftCardComponent,
        ProductCardComponent,
        PackageCardComponent,

    ],
    declarations: [
        // FORM
        DynamicFormComponent,
        FieldBuilderComponent,
        TextBoxComponent,
        DropDownComponent,
        HiLowValidatorDirective,
        ValidationHelper,
        ValidationErrorDirective,

        // PIPE
        CurrencyRupiahPipe,

        // DIALOG
        InfoDialogComponent,
        VerifyDialogComponent,
        FormDialogComponent,
        InputDialogComponent,
        WebCamComponent,

        // COMPONENT
        UserCardComponent,
        ShiftCardComponent,
        ProductCardComponent,
        PackageCardComponent
    ],
    providers: [DialogService],
})
export class SharedeModule { }
