import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../services/auth.service';
import { AppUser } from '../models/app-user';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';

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

  constructor(
    public auth: AuthService,
    private router: Router,
    public translate: TranslateService
  ) {
    this.auth
      .isTokenValid()
      .then((isTokenValid) => {
        this.isTokenValid = isTokenValid;
        // if (isTokenValid)
        //   this.auth.loadUserProfile().then((p) => (this.profileUser = p));
      })
      .catch((x) => console.log('QQQQQQQQQQQQQQQQQQQQ'));
  }
  // async ngOnInit(): Promise<void> {
  //   this.appUserBs = await this.auth.appUser();
  // }

  public async ngOnInit() {}

  logout() {
    this.auth.logout();
  }
  login() {
    this.auth.login();
  }
}
