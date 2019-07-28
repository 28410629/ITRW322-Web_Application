import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/application/home/home.component';
import { SecureInnerPagesGuard } from './services/authorisation/secure-inner-pages.guard';
import { AuthGuard } from './services/authorisation/auth.guard';

const routes: Routes = [
  { path: '', component: SignInComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'application', component: HomeComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
