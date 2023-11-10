import { Component, OnInit } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-slide-nav',
  templateUrl: './slide-nav.component.html',
  styleUrls: ['./slide-nav.component.css'],
})
export class SlideNavComponent implements OnInit {
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

  ngOnInit(): void {}
  logout() {
    this.auth.logout();
  }
}
