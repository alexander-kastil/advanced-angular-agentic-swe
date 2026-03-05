import { Injectable, inject } from '@angular/core';
import { AuthFacade } from './state/auth.facade';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authFacade = inject(AuthFacade);
  router = inject(Router);

  isAuthenticated() {
    return this.authFacade.isAuthenticated();
  }

  createUser(email: string, password: string) {
    this.authFacade.setFakeUserAndToken(email);
    return this.authFacade.getAuthResult()
  };

  logIn(
    email: string,
    password: string
  ) {
    this.authFacade.setFakeUserAndToken(email);
    return this.authFacade.getAuthResult()
  };


  logOut() {
    this.authFacade.signOut();
    this.router.navigate(['/']);
  }
}
