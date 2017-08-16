import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from './user.model';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent {
  myForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.myForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ]),
      password: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    const user = new User(this.myForm.value.email, this.myForm.value.password);
    this.authService.signin(user).subscribe(
      data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userID', data.userID);
        this.router.navigateByUrl('/');
      },
      error => console.error(error)
    );
    this.myForm.reset();
  }
}
