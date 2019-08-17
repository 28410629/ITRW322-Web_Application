import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SecureInnerPagesGuard } from './services/authorisation/secure-inner-pages.guard';
import { AuthGuard } from './services/authorisation/auth.guard';
import { ChatsComponent } from './components/chats/chats.component';

const routes: Routes = [
  { path: '', component: SignInComponent, canActivate: [SecureInnerPagesGuard] },
  { path: 'application', component: ChatsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
