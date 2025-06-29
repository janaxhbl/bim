import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Register } from '../../store/auth.state';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerFormGroup = new FormGroup({
    username: new FormControl("")!,
    email: new FormControl("", Validators.compose([
      Validators.required,
      Validators.email
    ]))!,
    password: new FormControl("", Validators.compose([
      Validators.minLength(8),
      Validators.required,
      Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:,.<>?]).{8,}$")
    ]))!,
    confirmPassword: new FormControl("", Validators.required)!
  },
  {
    validators: this.passwordMatchValidator
  });

  validations = {
    "email": [
      { type: "email", message: "Invalid Email!" }
    ],
    "password": [
      { type: "required", message: "Password is required" },
      { type: "minLength", message: "Password must be at least 8 characters long!" },
      { type: "pattern", message: "Password must include upper, lower case letters, a number, and a special character(!@#$%^&*()_+-=[]{};:,.<>?)!" },
    ],
    "confirmPassword": [
      { type: "passwordMismatch", message: "Passwords do not match!" }
    ]
  }

  constructor(
    private store: Store,
    private router: Router,
    private notification: NotificationService
  ) { }

  passwordMatchValidator(control:AbstractControl) : ValidationErrors | null  {
    const password = control.get("password")?.value;
    const confirmPassword = control.get("confirmPassword")?.value;

    return password === confirmPassword ? null : { passwordMismatch: true }
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.registerFormGroup.value.password != this.registerFormGroup.value.confirmPassword) {
      this.notification.show("Passwords do not match!", 3000, "danger");

      return;
    }

    this.store.dispatch(new Register({
      user_name: this.registerFormGroup.value.username!,
      email: this.registerFormGroup.value.email!,
      password: this.registerFormGroup.value.password!
    })).subscribe({
      next: () => {
        this.notification.show("Registered successfully!", 3000, "success");
        this.router.navigate(["login"]);
      },
      error: (err) => {
        this.notification.show("Register failed: " + err.error.error, 5000, "danger");
      }
    })
  }

}
