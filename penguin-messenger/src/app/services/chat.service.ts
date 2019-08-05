import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Conversation, Message, Messages } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  constructor(private db: AngularFirestore) {}

  public getPublicChannel(): Observable<Message[]> {
    return this.db.collection<Messages>('channels/public/messages', ref => ref.orderBy('datetime', 'asc'))
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

  public getMessages(conversationid): Observable<Message[]> {
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

  public createMessage(newmessage: string, newuid: string) {
    return this.db.collection('channels/public/messages').add({
      datetime: new Date(),
      message: newmessage,
      uid: newuid
    });
  }

  public NewMessage(path: string, newmessage: string, newuid: string) {
    return this.db.collection(path).add({
      datetime: new Date(),
      message: newmessage,
      uid: newuid
    });
  }
}


