import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AuthState, Logout } from '../../store/auth.state';
import { Observable } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  @Select(AuthState.isAuthenticated) isAuthenticated$!: Observable<boolean>;

  constructor(
    private store: Store,
    private notification: NotificationService,
    private router: Router
  ) { }

  public logout(): void {
    this.store.dispatch(new Logout()).subscribe({
      next: () => {
        this.notification.show("Logged out successfully!", 3000, "success");
        this.router.navigate(["/login"]);
      },
      error: (err) => {
        this.notification.show("Logout failed: " + err.message, 5000, "danger");
      }
    });
  }

  ngOnInit() {
    // console.log(this.store.selectSnapshot(AuthState));
  }

}
