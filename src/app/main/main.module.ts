import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { UserRespository } from '../auth/auth.repository';
import { SharedeModule } from '../shared/shared.module';
import { FormUtil } from '../_utility/form.util';
import { TimeUtil } from '../_utility/time.util';
import { MainComponent } from './main.component';


// MATERIAL 
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { IconMaterialModule } from '../_helpers/icon-registry';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { ShiftService } from './_service/shift.service';
import { ShiftRepository } from './_model/shift/shift.repository';
import { RandomUtil } from '../_utility/random';
import { ButtonCardComponent } from './button-card/button-card.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthGuard } from '../_guard/auth.guard';
import { TableModule } from './pages/tables/tables.module';
import { DiscountService } from './_service/discount.service';
import { DiscountRepository } from './_model/discount/discount.repository';
import { AdditionalService } from './_service/additional.service';
import { AdditionalRepository } from './_model/additional/additional.repository';
import { CustomerService } from './_service/customer.service';
import { CustomerRepository } from './_model/customer/customer.repository';


const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'order', loadChildren: () => import('./pages/order/order.module').then((m) => m.OrderModule) },
    { path: 'cashier', loadChildren: () => import('./pages/cashier/cashier.module').then((m) => m.CashierModule) },
    { path: 'tables', loadChildren: () => import('./pages/tables/tables.module').then((m) => m.TableModule) }
];


const material = [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSidenavModule
]


@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), material, IconMaterialModule, SharedeModule,
    ],
    exports: [],
    declarations: [MainComponent, ButtonCardComponent],
    providers: [
        MatIconRegistry,
        FormUtil,
        TimeUtil,
        UserRespository,
        ShiftService,
        ShiftRepository,
        RandomUtil,
        DiscountService,
        DiscountRepository,
        AdditionalService,
        AdditionalRepository,
        CustomerService,
        CustomerRepository
    ]
})
export class MainModule { }
