import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css'],
})
export class BsNavbarComponent implements OnInit {
  appUserBs: string | undefined;
  isMenuCollapsed = true;
  isTokenValid: boolean = false;
  profileUser: KeycloakProfile | null = null;

  constructor(public auth: AuthService, public translate: TranslateService) {
    this.auth
      .isTokenValid()
      .then((isTokenValid) => {
        this.isTokenValid = isTokenValid;
      })
      .catch((x) => console.log('QQQQQQQQQQQQQQQQQQQQ'));
  }

  public async ngOnInit() {}

  logout() {
    this.auth.logout();
  }
  login() {
    this.auth.login();
  }
}
