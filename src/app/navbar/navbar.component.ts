import { Component, OnInit, ElementRef } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  appUserBs: string | undefined;
  isMenuCollapsed = true;
  isTokenValid: boolean = false;
  profileUser: KeycloakProfile | null = null;
  constructor(
    public auth: AuthService,
    public translate: TranslateService,
    private _eref: ElementRef
  ) {
    translate.addLangs(['en', 'ar']);

    this.auth
      .isTokenValid()
      .then((isTokenValid) => {
        this.isTokenValid = isTokenValid;
      })
      .catch((x) => console.log('QQQQQQQQQQQQQQQQQQQQ'));
  }

  logout() {
    this.auth.logout();
  }
  isUserMenuOpen = false;
  isTranslationMenuOpen = false;
  public closeOpeningMenues(event: MouseEvent) {
    // this.isUserMenuOpen = false;
    // this.isTranslationMenuOpen = false;
    console.log('Click Parent', event);
    // if (!this._eref.nativeElement.contains(event.target))
    //   console.log('CCCCCCCCCCCCCCCCCCCCCCCCCCC');
  }
  toggleUserMenu(event: MouseEvent) {
    console.log('Click UserMenu');
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  toggleTranslationMenu(event: MouseEvent) {
    console.log('Click TranslationMenu');
    this.isTranslationMenuOpen = !this.isTranslationMenuOpen;
  }
  ngOnInit(): void {}
}
