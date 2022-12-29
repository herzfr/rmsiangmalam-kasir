import { LOCALE_ID, NgModule } from '@angular/core';
import { ExpenseComponent } from './expense.component';

// MATERIAL 
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IconMaterialModule } from '../../../_helpers/icon-registry';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TemporarySalesService } from '../cashier/_service/temporarysales.service';
import { TempSalesRepository } from '../cashier/_model/tempsales.repository';
import { TablesRepository } from '../tables/_model/tables.repository';
import { PipeModule } from 'src/app/_pipe/pipe.module';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule, registerLocaleData } from '@angular/common';
import { SharedeModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseService } from './_service/expense.service';
import { ExpenseRepository } from './_model/expense.repository';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';

import { ListExpenseComponent } from './component/list-expense/list-expense.component';
import { EmployeeCreditComponent } from './component/employee-credit/employee-credit.component';
import { OperationalCreditComponent } from './component/operational-credit/operational-credit.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';

import localeId from '@angular/common/locales/id';
registerLocaleData(localeId);

const routes: Routes = [
    { path: '', component: ExpenseComponent },
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
    MatCardModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatRadioModule
]

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), SharedeModule,
        IconMaterialModule, material, FormsModule, ReactiveFormsModule, PipeModule, CurrencyMaskModule],
    exports: [],
    declarations: [ExpenseComponent, ListExpenseComponent, EmployeeCreditComponent, OperationalCreditComponent],
    providers: [{ provide: LOCALE_ID, useValue: 'id-ID' }, ExpenseService, ExpenseRepository],
})
export class ExpenseModule { }
