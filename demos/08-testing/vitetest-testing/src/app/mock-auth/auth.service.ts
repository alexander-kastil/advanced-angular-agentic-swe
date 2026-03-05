import { Injectable, inject } from '@angular/core';
import { authStore } from './auth.store';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  store = inject(authStore);
  router = inject(Router);

  isAuthenticated() {
    return this.store.isAuthenticated();
  }

  createUser(email: string, _password: string) {
    this.store.setFakeUserAndToken(email);
  }

  logIn(email: string, _password: string) {
    this.store.setFakeUserAndToken(email);
  }

  logOut() {
    this.store.signOut();
    this.router.navigate(['/']);
  }
}
