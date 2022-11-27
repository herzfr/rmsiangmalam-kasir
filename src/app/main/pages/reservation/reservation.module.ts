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
    MatTabsModule
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
        CurrencyMaskModule
    ],
    exports: [],
    declarations: [ReservationComponent],
    providers: [],
})
export class ReservationModule { }
