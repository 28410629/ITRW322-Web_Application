import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authorisation/auth.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['', Validators.required]
    });
  }

  download() {
    window.open('https://drive.google.com/file/d/19qVjbT56Z38g-fk_U0PwXJL96CLg1zcl/view');
  }

  tryLogin() {
    this.authService.SignIn(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value);
  }

  ngOnInit() {
  }

  tryForgot() {
    this.router.navigate(['/forgot-password']);
  }

  trySignUp() {
    this.router.navigate(['/sign-up']);
  }
}
