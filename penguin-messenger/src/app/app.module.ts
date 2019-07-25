import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { FirebaseService } from './services/firebase.service';

import {AngularFireAuthModule} from '@angular/fire/auth';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './services/auth.service';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ActiveConversationsComponent } from './components/conversation/active-conversations/active-conversations.component';
import { CurrentChatComponent } from './components/conversation/current-chat/current-chat.component';
import { MessageBubbleComponent } from './components/conversation/current-chat/message-bubble/message-bubble.component';

export function markedOptions(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.blockquote = (text: string) => {
    return '<blockquote class="md-blockquote"><p>' + text + '</p></blockquote>';
  };

  return {
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SignInComponent,
    HomeComponent,
    SettingsComponent,
    ConversationComponent,
    ProfileComponent,
    VerifyEmailComponent,
    ForgotPasswordComponent,
    ActiveConversationsComponent,
    CurrentChatComponent,
    MessageBubbleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptions,
      },
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule
  ],
  providers: [FirebaseService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
