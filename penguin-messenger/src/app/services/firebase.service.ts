import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Conversation, Message, Messages} from '../models/message.model';
import { UserData } from '../models/user.model';
import { AngularFireStorage } from '@angular/fire/storage';
import { PublicChannel, PublicChannels } from '../models/publicChannel.model';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(private db: AngularFirestore,
              private afStorage: AngularFireStorage) {}

  public getPublicChannel(): Observable<PublicChannel[]> {
    return this.db.collection<PublicChannels>('PublicChannel', ref => ref.orderBy('Date', 'asc'))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as PublicChannel;
            return { ...data };
          });
        })
      );
  }

  public getMessages(conversationid): Observable<Message[]> {
    console.log('Within servive: ' + conversationid);
    return this.db.collection<Messages>('conversations/' + conversationid + '/messages', ref => ref.orderBy('datetime', 'asc'))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Message;
            return { ...data };
        });
      })
    );
  }

  public getUsers(): Observable<UserData[]> {
    return this.db.collection('usersdata').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as UserData;
          return { ...data };
        });
      })
    );
  }

  public getConversations(userid): Observable<Conversation[]> {
    return this.db.collection('conversations', ref => ref.where('participants', 'array-contains', userid))
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Conversation;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getUserData(userid) {
    return this.db.doc<UserData>('usersdata/' + userid).valueChanges();
  }

  updateUserData(UID, DisplayName, PhotoURL) {
    this.db.doc('usersdata/' + UID).update({
      displayName: DisplayName,
      photoURL: PhotoURL
    });
  }

  public createMessage(newmessage: string, newuid: string) {
    return this.db.collection('PublicChannel').add({
      Date: new Date(),
      Message: newmessage,
      UID: newuid
    });
  }
}


