import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from './auth.facade';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authFacade = inject(AuthFacade);
  private router = inject(Router);

  isAuthenticated() {
    return this.authFacade.isAuthenticated();
  }

  createUser(email: string) {
    this.authFacade.setFakeUserAndToken(email);
    return this.authFacade.authResult();
  }

  logIn(email: string) {
    this.authFacade.setFakeUserAndToken(email);
    return this.authFacade.authResult();
  }

  logOut() {
    this.authFacade.signOut();
    this.router.navigate(['/']);
  }
}
