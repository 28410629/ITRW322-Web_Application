import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SecureInnerPagesGuard } from './services/authorisation/secure-inner-pages.guard';
import { AuthGuard } from './services/authorisation/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { ChatsComponent } from './components/chats/chats.component';

const routes: Routes = [
  { path: '', component: SignInComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'chats', component: ChatsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
