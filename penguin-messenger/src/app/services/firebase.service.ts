import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Post, Posts } from '../models/message.model';
import { UserData } from '../models/user.model';
import { AngularFireStorage } from '@angular/fire/storage';
import {PublicChannel, PublicChannels} from '../models/publicChannel.model';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(private db: AngularFirestore,
              private afStorage: AngularFireStorage) {}

  public getPublicChannel(): Observable<PublicChannel[]> {
    return this.db.collection<PublicChannels>('PublicChannel', ref => ref.orderBy('Date', 'asc')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as PublicChannel;
          return { ...data };
        });
      })
    );
  }

  getUserData(UID) {
    return this.db.doc<UserData>('usersdata/' + UID).valueChanges();
  }

  updateUserData(UID, DisplayName, PhotoURL) {
    this.db.doc('usersdata/' + UID).update({
      displayName: DisplayName,
      photoURL: PhotoURL
    });
  }

  uploadUserPhoto(UID, event) {
    this.afStorage.upload('/users/' + UID + '/photo', event.target.files[0]);
  }

  deleteUser(DocumentId) {
    return this.db.collection('Posts').doc(DocumentId).delete();
  }

  searchUsers(searchValue) {
    return this.db.collection('conversations', ref => ref.where('nameToSearch', '>=', searchValue)
      .where('nameToSearch', '<=', searchValue + '\uf8ff'))
      .snapshotChanges();
  }

  searchUsersByAge(value) {
    return this.db.collection('users', ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  }

  searchConversationsForUser(UID) {
    return this.db.collectionGroup('participants', ref => ref.where('uid', '==', UID)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const id = a.payload.doc.id;
          return { id };
        });
      })
    );
  }


  public createMessage(newmessage: string, newuid: string) {
    return this.db.collection('PublicChannel').add({
      Date: new Date(),
      Message: newmessage,
      UID: newuid
    });
  }
}


