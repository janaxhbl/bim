import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Login } from '../../store/auth.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginFormGroup = new FormGroup({
    email: new FormControl("", Validators.email)!,
    password: new FormControl("", Validators.compose([
      Validators.required
    ]))!
  })

  constructor(private store: Store, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.loginFormGroup.invalid) return;

    this.store.dispatch(new Login({
      email: this.loginFormGroup.value.email!,
      password: this.loginFormGroup.value.password!
    }))
      .subscribe({
        next: () => {
          alert("Login successful!");
          this.router.navigate(["home"]);// route somewhere
        },
        error: (err) => {
          alert("Login failed: " + err.message)
        }
      })
  }
}
