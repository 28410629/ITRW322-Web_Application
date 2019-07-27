import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/authorisation/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;

  constructor(public authService: AuthService,
              private router: Router,
              private fb: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
  }

  createForm() {
    this.forgotForm = this.fb.group({
      email: ['', Validators.required ],
    });
  }


  goToSignIn() {
    this.router.navigate(['']);
  }

  tryForgotPassword() {
    this.authService.ForgotPassword(this.forgotForm.controls['email'].value);
  }
}
