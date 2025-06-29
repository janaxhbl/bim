import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UserState } from '../../store/user.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @Select(UserState.currentUser) currentUser$!: Observable<User>;

  constructor() { }

  ngOnInit() {
  }

}
