import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    if (!this.authenticated) {
      console.log('state.url', window.location.origin + state.url);
      let redirectAfterAuthentication =
        state.url != '/organizers' ? '/organizers' : state.url; //always redirect to organizers page after authentication
      await this.keycloak.login({
        redirectUri: window.location.origin + redirectAfterAuthentication,
      });
    }
    if (state.url === '/') this.router.navigate(['/organizers']); //avoid the error when when go to root route "/"
    return this.authenticated;
  }
}
