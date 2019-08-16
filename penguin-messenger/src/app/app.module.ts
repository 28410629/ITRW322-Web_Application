import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';

import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';

import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { ModalModule, BsModalRef } from 'ngx-bootstrap';

import { AuthService } from './services/authorisation/auth.service';
import { FirebaseService } from './services/firebase.service';
import { ChatService } from './services/chat.service';
import { CryptoService } from './services/crypto.service';

import { AppComponent } from './components/application/app/app.component';
import { HeaderComponent } from './components/application/header/header.component';
import { FooterComponent } from './components/application/footer/footer.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ChatsComponent } from './components/chats/chats.component';
import { HeaderUserComponent } from './components/application/header-user/header-user.component';

import { ImageCropperModule } from 'ngx-image-cropper';

export function markedOptions(): MarkedOptions {
  const renderer = new MarkedRenderer();

  renderer.blockquote = (text: string) => {
    return '<blockquote class="md-blockquote"><p>' + text + '</p></blockquote>';
  };

  return {
    renderer,
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
    HeaderUserComponent,
    ChatsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ImageCropperModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptions,
      },
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence({synchronizeTabs: true}),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    FormsModule,
    ModalModule.forRoot(),
  ],
  providers: [FirebaseService, AuthService, ChatService, CryptoService, BsModalRef],
  bootstrap: [AppComponent]
})
export class AppModule { }
