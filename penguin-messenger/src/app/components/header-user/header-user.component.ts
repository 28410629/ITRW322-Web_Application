import { Component, OnInit } from '@angular/core';
import { User, UserData } from '../../models/user.model';
import {AngularFirestore} from '@angular/fire/firestore';
import {FirebaseService} from '../../services/firebase.service';

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

  constructor(public afs: AngularFirestore, public fireBaseService: FirebaseService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    // this.GetUserData();
    this.getData(this.user.uid);
  }

  getData(UID: string) {
    this.fireBaseService.getUserData(UID)
      .subscribe(
        responseData => {
          this.userData = responseData;
    });
  }

  GetUserData() {
    const followDoc =
      this.afs.collection(`usersdata`).doc(this.user.uid).ref;

    followDoc.get().then((doc) => {
      this.userData = doc.data() as UserData;
    });

  }
}
