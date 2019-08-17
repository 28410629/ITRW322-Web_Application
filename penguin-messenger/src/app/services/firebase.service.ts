import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
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

}


