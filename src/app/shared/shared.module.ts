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
import { UiImageLoaderDirective } from './directives/image.directive';
import { StockListComponent } from './dialogs/general-dialogs/stock-list.component';
import { ShortcutCardComponent } from './component/shortcut-card/shortcut-card.component';
import { OrderCardComponent } from './component/order-card/order-card.component';
import { PipeModule } from '../_pipe/pipe.module';
import { CropImageComponent } from './dialogs/general-dialogs/crop-image-dialog.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxImageCompressService } from 'ngx-image-compress';
import { IconMaterialModule } from '../_helpers/icon-registry';
import { LottieModule } from 'ngx-lottie';
import { InfoAnimatedDialogComponent } from './dialogs/general-dialogs/info-animation-dialog.component';
import { StopShiftComponent } from './dialogs/general-dialogs/stop-shift-form.component';
import { ViewPrintReportComponent } from './dialogs/general-dialogs/view-print-report.component';

export function playerFactory() {
    return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}

@NgModule({
    imports: [
        CommonModule,
        MaterialShared,
        IconMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CurrencyMaskModule,
        WebcamModule,
        PipeModule,
        ImageCropperModule,
        LottieModule.forRoot({ player: playerFactory })
    ],
    exports: [
        DynamicFormComponent,
        FieldBuilderComponent,
        TextBoxComponent,
        DropDownComponent,
        HiLowValidatorDirective,
        ValidationHelper,
        ValidationErrorDirective,

        // DIRECTIVE
        UiImageLoaderDirective,

        // PIPE
        CurrencyRupiahPipe,

        // DIALOG
        InfoDialogComponent,
        VerifyDialogComponent,
        FormDialogComponent,
        InputDialogComponent,
        WebCamComponent,
        StockListComponent,
        InfoAnimatedDialogComponent,
        StopShiftComponent,
        ViewPrintReportComponent,

        // COMPONENT
        UserCardComponent,
        ShiftCardComponent,
        ProductCardComponent,
        PackageCardComponent,
        ShortcutCardComponent,
        OrderCardComponent,
        CropImageComponent

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

        // DIRECTIVE
        UiImageLoaderDirective,

        // PIPE
        CurrencyRupiahPipe,

        // DIALOG
        InfoDialogComponent,
        VerifyDialogComponent,
        FormDialogComponent,
        InputDialogComponent,
        WebCamComponent,
        StockListComponent,
        InfoAnimatedDialogComponent,
        StopShiftComponent,
        ViewPrintReportComponent,

        // COMPONENT
        UserCardComponent,
        ShiftCardComponent,
        ProductCardComponent,
        PackageCardComponent,
        ShortcutCardComponent,
        OrderCardComponent,
        CropImageComponent
    ],
    providers: [DialogService, NgxImageCompressService],
})
export class SharedeModule { }
