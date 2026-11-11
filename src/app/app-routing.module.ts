import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, SessionRedirectGuard } from './auth/auth.guard';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { fumateListComponent } from './items/item-list.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    pathMatch: 'full',
    component: AppComponent,
    canActivate: [SessionRedirectGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'censimento',
    component: AppComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'censimento/:id',
    component: AppComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'consultazione',
    component: fumateListComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
