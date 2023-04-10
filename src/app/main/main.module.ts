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
import { DiscountService } from './_service/discount.service';
import { DiscountRepository } from './_model/discount/discount.repository';
import { AdditionalService } from './_service/additional.service';
import { AdditionalRepository } from './_model/additional/additional.repository';
import { CustomerService } from './_service/customer.service';
import { CustomerRepository } from './_model/customer/customer.repository';
import { PaymentRepository } from './_model/payment/payment.repository';
import { UsersService } from './_service/user.service';
import { PaymentService } from './_service/payment.service';
import { UserRepository } from './_model/users/user.repository';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { NumpadComponent } from './_dialog/numpad.component';
import { DiscountComponent } from './_dialog/discount.component';
import { AdditionalComponent } from './_dialog/additional.component';
import { MatListModule } from '@angular/material/list';
import { CustomerListComponent } from './_dialog/customerlist.component';
import { MatTableModule } from '@angular/material/table';
import { EmployeeListComponent } from './_dialog/employee.component';
import { ReservationService } from './_service/reservation.service';
import { ReservationRepository } from './_model/reservation/reservation.repository';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SettingComponent } from './pages/settings/setting.component';
import { SettingService } from './_service/settings.service';
import { SettingRepository } from './_model/setting/setting.repository';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrintViewComponent } from './pages/settings/component/print-view.component';
import { EmployeeService } from './_service/employee.service';
import { WarehouseService } from './_service/warehouse.service';
import { WarehouseRepository } from './_model/warehouse/warehouse.repository';
import { ProductService } from './_service/product.service';
import { ProductRepository } from './_model/product/product.repository';
import { SavingService } from './_service/saving.service';
import { SavingRepository } from './_model/saving/saving.repository';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReportService } from './pages/report/_service/report.service';
import { SocketIoModule } from 'ngx-socket-io';
import { SocketIoConfig } from 'ngx-socket-io/src/config/socket-io.config';
import { SocketService } from './_service/socket.service';
import { OrderRepository } from './pages/order/_model/order.repository';
import { CartRepository } from './pages/order/_model/_cart/cart.repository';

const config: SocketIoConfig = { url: 'http://localhost:30000', options: {} };

const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'setting', component: SettingComponent },
    { path: 'order', loadChildren: () => import('./pages/order/order.module').then((m) => m.OrderModule) },
    { path: 'cashier', loadChildren: () => import('./pages/cashier/cashier.module').then((m) => m.CashierModule) },
    { path: 'tables', loadChildren: () => import('./pages/tables/tables.module').then((m) => m.TableModule) },
    { path: 'reservation', loadChildren: () => import('./pages/reservation/reservation.module').then((m) => m.ReservationModule) },
    { path: 'shift', loadChildren: () => import('./pages/shift/shift.module').then((m) => m.ShiftModule) },
    { path: 'other-income', loadChildren: () => import('./pages/other-income/other-income.module').then((m) => m.OtherIncomeModule) },
    { path: 'expense', loadChildren: () => import('./pages/expense/expense.module').then((m) => m.ExpenseModule) },
    { path: 'transfer-stock', loadChildren: () => import('./pages/transfer-stock/transfer-stock.module').then((m) => m.TransferStockModule) },
    { path: 'report', loadChildren: () => import('./pages/report/report.module').then((m) => m.ReportModule) },

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
    MatSidenavModule,
    MatBottomSheetModule,
    MatListModule,
    MatTableModule,
    MatSnackBarModule
]

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), material, IconMaterialModule,
        SharedeModule, FormsModule, ReactiveFormsModule, MatNativeDateModule, MatMomentDateModule,
        SocketIoModule.forRoot(config)
    ],
    exports: [],
    declarations: [
        MainComponent,
        ButtonCardComponent,
        NumpadComponent,
        DiscountComponent,
        AdditionalComponent,
        CustomerListComponent,
        EmployeeListComponent,
        SettingComponent,
        PrintViewComponent,
    ],
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
        CustomerRepository,
        PaymentRepository,
        UsersService,
        PaymentService,
        UserRepository,
        ReservationService,
        ReservationRepository,
        SettingService,
        SettingRepository,
        EmployeeService,
        WarehouseService,
        WarehouseRepository,
        ProductService,
        ProductRepository,
        SavingService,
        SavingRepository,
        ReportService,
        SocketService,
    ]
})
export class MainModule { }
