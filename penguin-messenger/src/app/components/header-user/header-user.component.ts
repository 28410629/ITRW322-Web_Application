import { Component, OnInit } from '@angular/core';
import { User, UserData } from '../../models/user.model';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.scss']
})
export class HeaderUserComponent implements OnInit {

  user: User;
  userData: UserData = {
    displayName: 'Loading...',
    photoURL: ''
  };

  constructor(public afs: AngularFirestore) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.GetUserData();
  }

  GetUserData() {
    const followDoc =
      this.afs.collection(`usersdata`).doc(this.user.uid).ref;

    followDoc.get().then((doc) => {
      this.userData = doc.data() as UserData;
    });

  }
}
