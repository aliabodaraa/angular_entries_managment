import { Component, OnInit, ElementRef } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  host: {
    '(document:click)': 'onClick($event)',
  },
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
  onClick(event: MouseEvent) {
    // console.log(
    //   'onClick',
    //   event.target == this._eref.nativeElement,
    //   'contains',
    //   this._eref.nativeElement.contains(event.target),
    //   'event.target',
    //   event.target,
    //   'this._eref.nativeElement',
    //   this._eref.nativeElement
    // );
    // if (
    //   event.target == this._eref.nativeElement ||
    //   this._eref.nativeElement.contains(event.target)
    // )
    //   return;
    // this.isUserMenuOpen = false;
    // this.isTranslationMenuOpen = false;
  }
  logout() {
    this.auth.logout();
  }
  isUserMenuOpen = false;
  isTranslationMenuOpen = false;
  public closeOpeningMenues() {
    this.isUserMenuOpen = false;
    this.isTranslationMenuOpen = false;
  }
  toggleUserMenu(event: MouseEvent) {
    console.log('Click UserMenu');
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  toggleTranslationMenu(event: MouseEvent) {
    console.log('Click TranslationMenu');
    this.isTranslationMenuOpen = !this.isTranslationMenuOpen;
  }
  clickOutside(type_param: string) {
    console.log('CBBBBBBBBBBB', type_param);
    if (type_param == 'languages_dropdown') this.isTranslationMenuOpen = false;
    else if (type_param == 'profile_dropdown') this.isUserMenuOpen = false;
  }
  ngOnInit(): void {}
}
