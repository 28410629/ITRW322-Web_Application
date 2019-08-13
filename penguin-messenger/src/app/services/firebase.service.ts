import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Conversation, Message, Messages } from '../models/message.model';
import { UserData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(private db: AngularFirestore) {}


  public getUsers(): Observable<UserData[]> {
    return this.db.collection('usersdata', ref => ref.orderBy('displayName', 'asc')).snapshotChanges().pipe(
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
      photoURL: PhotoURL,
      uid: UID
    });
  }

  public createMessage(newmessage: string, newuid: string) {
    return this.db.collection('channels/public/messages').add({
      datetime: new Date(),
      message: newmessage,
      uid: newuid
    });
  }


  public CreateChat(newDescription: string, isGroupChat: boolean, newName: string, newParticipants: string[], newGroupPhotoUrl: string) {
    return this.db.collection('conversations').add({
      description: newDescription,
      isgroupchat: isGroupChat,
      name: newName,
      participants: newParticipants,
      groupPhotoURL: newGroupPhotoUrl
    });
  }
}


