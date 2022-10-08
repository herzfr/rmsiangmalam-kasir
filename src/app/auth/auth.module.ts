import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common'
import { SharedeModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// UTIL | SERVICE | MODEL | REPO
import { FormUtil } from '../_utility/form.util';
import { UserRespository } from './auth.repository';
import { AuthService } from './auth.service';
import { TimeUtil } from '../_utility/time.util';
import { DialogService } from '../shared/dialogs/dialog.service';


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


const routes: Routes = [
    { path: '', component: AuthComponent }
];


const material = [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule
]


@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), material, IconMaterialModule, SharedeModule],
    exports: [],
    declarations: [AuthComponent],
    providers: [MatIconRegistry, FormUtil, TimeUtil, UserRespository, AuthService]
})
export class AuthModule { }
