import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private keycloakService: KeycloakService) {}

  async login() {
    await this.keycloakService.login();
    let token = await this.getToken();
    this.setTokenStorage(token);
  }

  async isLoggedIn() {
    let isLogged = await this.keycloakService.isLoggedIn();
    return isLogged;
  }
  async loadUserProfile() {
    return await this.keycloakService.loadUserProfile();
  }
  async logout() {
    if (await this.isLoggedIn()) {
      this.keycloakService.clearToken();
      this.removeTokenStorage();
      this.keycloakService.logout();
    }
  }

  async isTokenValid() {
    //you can't invoke isTokenExpired without verifing that the user loggingIn
    if (await this.isLoggedIn()) return !this.keycloakService.isTokenExpired();
    return false;
  }

  private getToken() {
    return this.keycloakService.getToken();
  }

  private setTokenStorage(token: string) {
    localStorage.setItem('token', token);
  }

  private removeTokenStorage() {
    localStorage.removeItem('token');
  }
}
