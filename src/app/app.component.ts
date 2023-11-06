import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthService } from './services/auth.service';
import { tap } from 'rxjs/operators';
// import { UserService } from './services/user.service';
import { KeycloakService } from 'keycloak-angular';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TOASTR_TOKEN, Toastr } from './services/toastr.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ActivitiesApp';
  active = 'top';

  constructor(
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
    // private toastr1: ToastrService,

    // private userService: UserService,
    private auth: AuthService,
    private router: Router // private keycloakService: KeycloakService
  ) {
    this.auth.getToken().then((x) => console.log(x));
    // console.log(this.auth.isLoggedIn().then((x) => console.log(x)));
    // this.auth.isTokenValid().then((isTokenValid) => {
    //   if (isTokenValid) this.auth.loadUserProfile().then((p) => console.log(p));
    // });
    // this.auth.user$.subscribe((user) => {
    //   if (!user) return;
    //   this.userService.save(user);
    //   let getReturnUrlParam = localStorage.getItem('returnUrl');
    //   if (!getReturnUrlParam) return; //to avoid redirection to home each time we reload the page so we want this functionality to be applied once after the user logged successfully
    //   localStorage.removeItem('returnUrl');
    //   this.router.navigate([`${getReturnUrlParam}`]);
    // });
  }

  success(message: string): void {
    this.toastr.success(message, 'Success');
  }

  info(message: string): void {
    this.toastr.info(message, 'Info');
  }

  warning(message: string): void {
    this.toastr.warning(message, 'Warning');
  }

  error(message: string): void {
    this.toastr.error(message, 'Error');
  }
}
