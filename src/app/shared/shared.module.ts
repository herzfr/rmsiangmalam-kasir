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

@NgModule({
    imports: [
        CommonModule,
        MaterialShared,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        DynamicFormComponent,
        FieldBuilderComponent,
        TextBoxComponent,
        HiLowValidatorDirective,
        ValidationHelper,
        ValidationErrorDirective,

        // DIALOG
        InfoDialogComponent,
        VerifyDialogComponent,

        // COMPONENT
        UserCardComponent,
    ],
    declarations: [
        // FORM
        DynamicFormComponent,
        FieldBuilderComponent,
        TextBoxComponent,
        HiLowValidatorDirective,
        ValidationHelper,
        ValidationErrorDirective,

        // DIALOG
        InfoDialogComponent,
        VerifyDialogComponent,

        // COMPONENT
        UserCardComponent
    ],
    providers: [DialogService],
})
export class SharedeModule { }
