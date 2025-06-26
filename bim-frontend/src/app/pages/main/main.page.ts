import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthState } from '../../store/auth.state';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  constructor(private store: Store) { }

  ngOnInit() {
    console.log(this.store.selectSnapshot(AuthState));
  }

}
