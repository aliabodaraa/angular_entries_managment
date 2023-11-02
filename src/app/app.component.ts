import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthService } from './services/auth.service';
import { tap } from 'rxjs/operators';
// import { UserService } from './services/user.service';
import { KeycloakService } from 'keycloak-angular';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ActivitiesApp';
  active = 'top';
  constructor(
    // private userService: UserService,
    private auth: AuthService,
    private router: Router // private keycloakService: KeycloakService
  ) {
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
}
