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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Routes } from '@angular/router';
import { SharedeModule } from 'src/app/shared/shared.module';
import { IconMaterialModule } from 'src/app/_helpers/icon-registry';
import { MilisToDatePipe } from 'src/app/_pipe/datepipe-custom.pipe';
import { TablesRepository } from '../tables/_model/tables.repository';


import { CashierComponent } from './cashier.component';
import { ListOrderComponent } from './component/section-list-order/list-order.component';
import { TempSalesRepository } from './_model/tempsales.repository';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { CheckoutRepository } from './_model/checkout/chekcout.repository';




const routes: Routes = [
    { path: '', component: CashierComponent },
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
    MatNativeDateModule
]

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), SharedeModule, IconMaterialModule, material, FormsModule, ReactiveFormsModule],
    exports: [],
    declarations: [
        CashierComponent,
        ListOrderComponent,
        MilisToDatePipe
    ],
    providers: [TempSalesRepository, TablesRepository, CheckoutRepository],
})
export class CashierModule { }
