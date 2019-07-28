import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User, UserData} from '../../models/user.model';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;
  photoURL = '';
  angForm: FormGroup;

  constructor(
    public fireBaseService: FirebaseService,
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
    this.getData();
    this.getAccountData();
  }

  submitChanges() {
    this.fireBaseService.updateUserData(
      this.user.uid,
      this.angForm.controls['DisplayName'].value,
      this.photoURL);
  }

  getAccountData() {
    this.angForm.controls['Email'].setValue(this.user.email);
    this.angForm.controls['UID'].setValue(this.user.uid);
  }

  getData() {
    this.fireBaseService.getUserData(this.user.uid)
      .subscribe(
        responseData => {
          this.angForm.controls['DisplayName'].setValue(responseData.displayName);
          this.photoURL = responseData.photoURL;
        });
  }
}
