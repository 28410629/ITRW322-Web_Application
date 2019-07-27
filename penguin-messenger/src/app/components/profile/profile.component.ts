import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/authorisation/auth.service';
import {User, UserData} from '../../models/user.model';
import {AngularFirestore} from "@angular/fire/firestore";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;
  userData: UserData = {
    displayName: 'Loading...',
    photoURL: ''
  };


  angForm: FormGroup;

  constructor(
    public afs: AngularFirestore,
    private fb: FormBuilder
  ) {
    this.angForm = this.fb.group({
      DisplayName: ['', Validators.required],
      Email: ['', Validators.required],
      UID: ['', Validators.required]
    });
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.GetUserData();
    this.loadUser();
  }

  submitChanges() {
    // const userData: User = {
    //   uid: this.oldUserData.uid,
    //   email: this.angForm.controls['Email'].value,
    //   displayName: this.angForm.controls['DisplayName'].value,
    //   photoURL: this.oldUserData.photoURL,
    //   emailVerified: this.oldUserData.emailVerified
    // }
  }

  loadUser() {
    this.angForm.controls['Email'].setValue(this.user.email);
    this.angForm.controls['UID'].setValue(this.user.uid);
    this.angForm.controls['DisplayName'].setValue(this.userData.displayName);
    // this.angForm.controls['ProfileURL'].setValue(this.userData.photoURL);
  }

  GetUserData() {
    const followDoc =
      this.afs.collection(`usersdata`).doc(this.user.uid).ref;

    followDoc.get().then((doc) => {
      this.userData = doc.data() as UserData;
    });

  }
}
