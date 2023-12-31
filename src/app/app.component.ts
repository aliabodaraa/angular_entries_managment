import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    // private toastr1: ToastrService,

    // private userService: UserService,
    private auth: AuthService,
    private router: Router // private keycloakService: KeycloakService
  ) {
    this.auth.getToken().then((token) => {
      let is_token_exist_in_storage = !!localStorage.getItem('token');
      this.auth.isTokenValid().then((isTokenValid) => {
        if (!isTokenValid || !is_token_exist_in_storage) {
          localStorage.setItem('token', token);
          console.log('token', token, 'isTokenValid', isTokenValid);
        }
      });
    });
  }
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
