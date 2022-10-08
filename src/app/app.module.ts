import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { SharedeModule } from './shared/shared.module';
import { UserRespository } from './auth/auth.repository';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TimeUtil } from './_utility/time.util';
import { CookieConsent } from './_helpers/http.cookie';
import { DialogService } from './shared/dialogs/dialog.service';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedeModule,
  ],
  providers: [httpInterceptorProviders, UserRespository, TimeUtil, CookieConsent],
  bootstrap: [AppComponent]
})
export class AppModule { }
