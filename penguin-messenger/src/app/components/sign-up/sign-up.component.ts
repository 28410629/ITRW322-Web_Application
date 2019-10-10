import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authorisation/auth.service';
import {User} from '../../models/user.model';
import { FirebaseService } from '../../services/firebase.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  users: Array<User>;
  loginForm: FormGroup;

  constructor(
    public fireBaseService: FirebaseService,
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
    this.getUsers();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      displayname: ['', Validators.required]
    });
  }

  displayNameUniqueCheck(newDiysplayName) {
    for (const user of this.users) {
      if (user.displayName === newDiysplayName) {
        return false;
      }
    }
    return true;
  }

  tryRegister() {
    const newDiysplayName = this.loginForm.controls['displayname'].value.toString().trim();
    if (!this.displayNameUniqueCheck(newDiysplayName)) {
      window.alert('Display Name already exists. Please use a different one.');
    } else if (this.loginForm.controls['password'].value !== this.loginForm.controls['password2'].value)  {
      window.alert('Passwords does not match.');
    } else {
      this.authService.SignUp(
        this.loginForm.controls['email'].value.toString().trim(),
        this.loginForm.controls['password'].value.toString().trim(),
        newDiysplayName
      );
    }
  }

  ngOnInit() {
  }

  trySignIn() {
    this.router.navigate(['/']);
  }

  getUsers() {
    this.fireBaseService.getUsers().subscribe(responseData => {
      this.users = responseData;
    });
  }

}
