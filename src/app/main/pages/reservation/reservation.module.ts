import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationComponent } from './reservation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedeModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';

// MATERIAL
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { IconMaterialModule } from 'src/app/_helpers/icon-registry';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ReservasiEWalletComponent } from './component/r-e-wallet.payment';
import { ReservasiDebitComponent } from './component/r-debit.payment';
import { MatRadioModule } from '@angular/material/radio';
import { PipeModule } from 'src/app/_pipe/pipe.module';
import { CardReservation } from './component/card-reservation.component';
import { MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';


const routes: Routes = [
    { path: '', component: ReservationComponent },
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
    MatSelectModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatTabsModule,
    MatBottomSheetModule
]

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        material,
        SharedeModule,
        IconMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        MatNativeDateModule,
        CurrencyMaskModule,
        PipeModule,
    ],
    exports: [],
    declarations: [ReservationComponent, ReservasiEWalletComponent, ReservasiDebitComponent, CardReservation],
    providers: [
        { provide: MatBottomSheetRef, useValue: {} },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} }
    ],
})
export class ReservationModule { }
