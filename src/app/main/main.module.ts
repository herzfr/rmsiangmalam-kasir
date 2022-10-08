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

const routes: Routes = [
    { path: '', component: MainComponent }
];

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


const material = [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
]


@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), material, IconMaterialModule, SharedeModule
    ],
    exports: [],
    declarations: [MainComponent],
    providers: [MatIconRegistry, FormUtil, TimeUtil, UserRespository]
})
export class MainModule { }
