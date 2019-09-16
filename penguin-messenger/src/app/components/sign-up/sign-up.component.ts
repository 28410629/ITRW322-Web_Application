import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authorisation/auth.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

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
      password: ['', Validators.required],
      password2: ['', Validators.required],
      displayname: ['', Validators.required]
    });
  }

  tryRegister() {
    if (this.loginForm.controls['password'].value === this.loginForm.controls['password2'].value) {
        this.authService.SignUp(
          this.loginForm.controls['email'].value.toString().trim(),
          this.loginForm.controls['password'].value.toString().trim(),
          this.loginForm.controls['displayname'].value.toString().trim()
      );
    } else {

    }
  }

  ngOnInit() {
  }

}
