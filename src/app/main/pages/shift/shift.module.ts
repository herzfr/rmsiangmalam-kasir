import { NgModule } from '@angular/core';
import { ShiftComponent } from './shift.component';

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
import { CommonModule } from '@angular/common';
import { SharedeModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ShiftServiceL } from './_service/shift.service';
import { ShiftRepositoryA } from './_model/shift.repository';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';


const routes: Routes = [
    { path: '', component: ShiftComponent },
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
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
]

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), SharedeModule, IconMaterialModule, material,
        FormsModule, ReactiveFormsModule, PipeModule],
    exports: [],
    declarations: [ShiftComponent],
    providers: [ShiftServiceL, ShiftRepositoryA],
})
export class ShiftModule { }
