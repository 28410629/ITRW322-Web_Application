import { Injectable, NgZone } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {User, UserData} from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user: User; // Save logged in user data
  userData: UserData;

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.UserData();
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Our authorisation methods:

  LoginWithFacebook() {
    return this.AuthProvider(new auth.FacebookAuthProvider());
  }

  LoginWithGithub() {
    return this.AuthProvider(new auth.GithubAuthProvider());
  }

  LoginWithGoogle() {
    return this.AuthProvider(new auth.GoogleAuthProvider());
  }

  LoginWithTwitter() {
    return this.AuthProvider(new auth.TwitterAuthProvider());
  }

  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('userData');
      this.router.navigate(['']);
    });
  }

  AuthProvider(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['application']);
        })
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error);
      });
  }

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    this.user = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(this.user, {
      merge: true
    });
  }

  UserData() {
    const followDoc =
      this.afs.collection(`usersdata`).doc(this.user.uid).ref;

    return followDoc.get().then((doc) => {
      if (!doc.exists) {
        this.afs.collection('usersdata').doc(this.user.uid).set({
          displayName: this.user.displayName,
          photoURL: this.user.photoURL,
          uid: this.user.uid
        });
        const x: UserData =  {
          displayName: this.user.displayName,
          photoURL: this.user.photoURL,
          uid: this.user.uid
        };
        localStorage.setItem('usersData', JSON.stringify(x));
      } else {
        const y =  doc.data() as UserData;
        localStorage.setItem('usersData', JSON.stringify(y));
      }
    });

  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }
}
