import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// COMPONENT
import { ReportComponent } from './report.component';
import localeId from '@angular/common/locales/id';
import { ReportService } from './_service/report.service';
import { ReportRepository } from './_model/report.repository';
import { SharedeModule } from 'src/app/shared/shared.module';
import { IconMaterialModule } from 'src/app/_helpers/icon-registry';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/_pipe/pipe.module';


// MATERIAL
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';

registerLocaleData(localeId);

const routes: Routes = [
    { path: '', component: ReportComponent },
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
        IconMaterialModule, material, FormsModule, ReactiveFormsModule, PipeModule],
    exports: [],
    declarations: [ReportComponent],
    providers: [{ provide: LOCALE_ID, useValue: 'id-ID' }, ReportService, ReportRepository],
})
export class ReportModule { }
