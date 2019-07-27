import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../../services/authorisation/auth.service';
import {User, UserData} from '../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;
  userData: UserData;

  angForm: FormGroup;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.angForm = this.fb.group({
      DisplayName: ['', Validators.required],
      Email: ['', Validators.required],
      UID: ['', Validators.required]
    });
    this.user = JSON.parse(localStorage.getItem('user'));
    // this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log('This is the user data from Firebase Authorisation:');
    console.log(this.user);
    console.log('This is the user data from Firebase Database:');
    console.log(this.userData);
  }

  ngOnInit() {
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
    // this.angForm.controls['DisplayName'].setValue(this.userData.displayName);
    // this.angForm.controls['ProfileURL'].setValue(this.userData.photoURL);
  }
}
