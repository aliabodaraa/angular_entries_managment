import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  active = 'top';
  isTokenValid: boolean = false;
  constructor(public auth: AuthService) {
    this.auth
      .isTokenValid()
      .then((isTokenValid) => (this.isTokenValid = isTokenValid));
  }
  login() {
    this.auth.login();
  }

  ngOnInit(): void {}
}
