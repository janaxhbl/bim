import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AuthState, Login } from '../../store/auth.state';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { GetIdUser, UserState } from '../../store/user.state';

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

  constructor(
    private store: Store,
    private router: Router,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    if (this.store.selectSnapshot(AuthState.isAuthenticated)) {
      this.router.navigate(["home"]);
    }
  }

  onSubmit() {
    if (this.loginFormGroup.invalid) return;

    this.store.dispatch(new Login({
      email: this.loginFormGroup.value.email!,
      password: this.loginFormGroup.value.password!
    }))
      .subscribe({
        next: () => {
          const userID = this.store.selectSnapshot(AuthState.id);
          this.store.dispatch(new GetIdUser(userID!)).subscribe({
            next: () => {
              console.log(this.store.selectSnapshot(UserState.currentUser));
            }
          })
          this.notification.show("Login successful!", 3000, "success");
          this.router.navigate(["home"]);// route somewhere
        },
        error: (err) => {
          this.notification.show("Login failed: " + err.error.error, 5000, "danger");
        }
      })
  }
}
