import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';

import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';

import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';

import { AuthService } from './services/authorisation/auth.service';
import { FirebaseService } from './services/firebase.service';

import { AppComponent } from './components/application/app/app.component';
import { HeaderComponent } from './components/application/header/header.component';
import { FooterComponent } from './components/application/footer/footer.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ToolsComponent } from './components/tools/tools.component';
import { ChatsComponent } from './components/chats/chats.component';
import { ActiveConversationsComponent } from './components/chats/active-conversations/active-conversations.component';
import { CurrentChatComponent } from './components/chats/current-chat/current-chat.component';
import { MessageBubbleComponent } from './components/chats/current-chat/message-bubble/message-bubble.component';
import { ChatItemComponent } from './components/chats/active-conversations/chat-item/chat-item.component';
import { HeaderUserComponent } from './components/application/header-user/header-user.component';

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
    ProfileComponent,
    ActiveConversationsComponent,
    CurrentChatComponent,
    MessageBubbleComponent,
    ChatItemComponent,
    HeaderUserComponent,
    ToolsComponent,
    ChatsComponent
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
    AngularFireStorageModule,
    ReactiveFormsModule
  ],
  providers: [FirebaseService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
