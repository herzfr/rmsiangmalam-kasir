import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './_guard/auth.guard';
import { httpInterceptorProviders } from './_helpers/http.interceptor';

const routes: Routes = [
  { path: '', pathMatch: 'prefix', redirectTo: 'v2' },
  // { path: '**', redirectTo: 'v2', pathMatch: 'prefix' },
  { path: 'login', canActivate: [AuthGuard], loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule) },
  { path: 'v2', canActivate: [AuthGuard], loadChildren: () => import('./main/main.module').then((m) => m.MainModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [httpInterceptorProviders]
})
export class AppRoutingModule { }
