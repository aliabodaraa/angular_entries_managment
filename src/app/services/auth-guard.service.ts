import { Injectable } from '@angular/core';
// import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    // private auth: AuthService,
    private router: Router
  ) {}
  canActivate(previousFailedUrl: string) {
    // return this.auth.user$?.pipe(
    //   map((user) => {
    //     if (user) return true;
    //     this.router.navigate(['/login'], {
    //       queryParams: { returnUrl: previousFailedUrl },
    //     });
    //     return false;
    //   })
    // );
    return of(false);
  }
}
