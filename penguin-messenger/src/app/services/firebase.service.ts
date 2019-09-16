import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  constructor(private db: AngularFirestore) {}


  public getUsers(): Observable<User[]> {
    return this.db.collection('users', ref => ref.orderBy('displayName', 'asc')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as User;
          return { ...data };
        });
      })
    );
  }

  getUserData(userid) {
    return this.db.doc<User>('users/' + userid).valueChanges();
  }

  updateUserData(UID, DisplayName, PhotoURL) {
    this.db.doc('users/' + UID).update({
      displayName: DisplayName,
      photoURL: PhotoURL,
      uid: UID
    });
  }

}


