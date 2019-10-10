// import { Injectable } from '@angular/core';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class MessagingService {
//
//   constructor() { }
// }

import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { BehaviorSubject } from 'rxjs';
import {Token} from './models/user.model';
import {mergeMapTo} from 'rxjs/operators';
import {AngularFireMessaging} from '@angular/fire/messaging';

@Injectable()
export class MessagingService {

  // messaging = firebase.messaging();
  messaging = null;
  currentMessage = new BehaviorSubject(null);

  constructor(private db: AngularFirestore,
              private afAuth: AngularFireAuth,
              private afMessaging: AngularFireMessaging) {
                if (firebase.messaging.isSupported()) {
                  this.messaging = firebase.messaging();
                }
              }

  updateToken(newtoken) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log();
        const userRef: AngularFirestoreDocument<any> = this.db.doc(`tokens/${user.uid}`);
        const data: Token = {
          uid: user.uid.toString(),
          token: newtoken.toString()
        };
        userRef.set(data, {
          merge: true
        }).catch(err => {
          console.log('Error on update token: ', err);
        });
      }
    });
  }

  getPermission() {
    if (this.messaging != null) {
      this.afMessaging.requestPermission
        .pipe(mergeMapTo(this.afMessaging.tokenChanges))
        .subscribe(
          (token) => {
            this.updateToken(token);
            console.log('Updated token.');
          },
          (error) => {
            console.error(error);
          },
        );
    }
  }

  receiveMessage() {
    if (this.messaging != null) {
      this.messaging.onMessage((payload) => {
        this.currentMessage.next(payload);
      });
    }
  }
}
