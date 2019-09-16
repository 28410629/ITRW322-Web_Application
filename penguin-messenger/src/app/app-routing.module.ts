import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SecureInnerPagesGuard } from './services/authorisation/secure-inner-pages.guard';
import { AuthGuard } from './services/authorisation/auth.guard';
import { ChatsComponent } from './components/chats/chats.component';
import { LoadscreenComponent } from './components/loadscreen/loadscreen.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', component: SignInComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'verify-email', component: VerifyEmailComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'sign-up', component: SignUpComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'application', component: ChatsComponent, canActivate: [AuthGuard] },
  { path: 'loading', component: LoadscreenComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/application'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
