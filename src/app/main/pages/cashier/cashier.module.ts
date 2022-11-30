import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { RouterModule, Routes } from '@angular/router';
import { SharedeModule } from 'src/app/shared/shared.module';
import { IconMaterialModule } from 'src/app/_helpers/icon-registry';
import { TablesRepository } from '../tables/_model/tables.repository';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';



import { CashierComponent } from './cashier.component';
import { ListOrderComponent } from './component/section-list-order/list-order.component';
import { TempSalesRepository } from './_model/tempsales.repository';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { CheckoutRepository } from './_model/checkout/chekcout.repository';
import { PaymentComponent } from './component/section-payment-order/payment-order.component';
import { CashComponent } from './component/section-payment-order/method-payment/cash.component';
import { IKeyboardLayouts, keyboardLayouts, MatKeyboardModule, MAT_KEYBOARD_LAYOUTS } from 'angular-onscreen-material-keyboard';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { DebitComponent } from './component/section-payment-order/method-payment/debit.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CardMaskDirective } from './_directives/cardmask.directive';
import { EWalletComponent } from './component/section-payment-order/method-payment/e-wallet.component';
import { OtherComponent } from './component/section-payment-order/method-payment/other.component';
import { TransferComponent } from './component/section-payment-order/method-payment/transfer.component';
import { SplitComponent } from './component/section-split-order/split.component';
import { DndDraggableDirective, DndModule } from 'ngx-drag-drop';
import { PipeModule } from 'src/app/_pipe/pipe.module';

const customLayouts: IKeyboardLayouts = {
    ...keyboardLayouts,
    'Tölles Läyout': {
        'name': 'Awesome layout',
        'keys': [
            [
                ['1', '!'],
                ['2', '@'],
                ['3', '#'],
            ],
            [
                ['4', '$'],
                ['5', '%'],
                ['6', '^'],
            ],
            [
                ['7', '&'],
                ['8', '*'],
                ['9', '('],
            ],
            [
                ['0', ')'],
                ['00', '00'],
                ['000', '000'],
            ],
        ],
        'lang': ['de-CH']
    }
};


const routes: Routes = [
    { path: '', component: CashierComponent },
    { path: 'payment', component: PaymentComponent },
    { path: 'split', component: SplitComponent },
]

const material = [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSidenavModule,
    MatSelectModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatDividerModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatKeyboardModule,
    MatTooltipModule,
    MatRadioModule,
]

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), SharedeModule,
        IconMaterialModule, material, FormsModule, ReactiveFormsModule,
        CurrencyMaskModule, CarouselModule, DndModule, PipeModule],
    exports: [],
    declarations: [
        CashierComponent,
        ListOrderComponent,
        PaymentComponent,
        SplitComponent,

        // CHILD COMPONENT
        CashComponent,
        DebitComponent,
        EWalletComponent,
        OtherComponent,
        TransferComponent,

        // DIRECTIVE
        CardMaskDirective,

        // PIPE

    ],
    providers: [TempSalesRepository, TablesRepository, CheckoutRepository, DndDraggableDirective,
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
        { provide: MAT_KEYBOARD_LAYOUTS, useValue: customLayouts }
    ],
})
export class CashierModule { }
