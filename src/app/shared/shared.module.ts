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

@NgModule({
    imports: [
        CommonModule,
        MaterialShared,
        FormsModule,
        ReactiveFormsModule,
        CurrencyMaskModule
    ],
    exports: [
        DynamicFormComponent,
        FieldBuilderComponent,
        TextBoxComponent,
        DropDownComponent,
        HiLowValidatorDirective,
        ValidationHelper,
        ValidationErrorDirective,

        // DIALOG
        InfoDialogComponent,
        VerifyDialogComponent,
        FormDialogComponent,

        // COMPONENT
        UserCardComponent,
        ShiftCardComponent,
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

        // DIALOG
        InfoDialogComponent,
        VerifyDialogComponent,
        FormDialogComponent,

        // COMPONENT
        UserCardComponent,
        ShiftCardComponent
    ],
    providers: [DialogService],
})
export class SharedeModule { }
