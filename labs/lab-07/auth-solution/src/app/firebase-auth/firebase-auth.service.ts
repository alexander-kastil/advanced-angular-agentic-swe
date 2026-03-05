import { inject, Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map, Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthService {
  fireAuth = inject(Auth);
  authState$ = authState(this.fireAuth);
  router = inject(Router);
  user$ = this.authState$.pipe(
    tap((state) => console.log('authState changed: ', state))
  );

  private token = this.authState$.pipe(
    switchMap((user) => {
      if (user) {
        return user.getIdToken();
      } else {
        return '';
      }
    }),
    tap((token) => {
      // redirect to entry page if auth is enabled and user is not logged in
      // stay on the same route if auth is not enabled
      if (token == '' && environment.authEnabled) {
        this.router.navigate(['/']);
      }
    })
  );

  getUser() {
    return this.user$;
  }

  getToken() {
    return this.token;
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      map((user) => {
        let authEnabled = environment.authEnabled;
        return authEnabled == false || user != null ? true : false;
      })
    );
  }

  createUser(email: string, password: string) {
    createUserWithEmailAndPassword(this.fireAuth, email, password).then((userCredential) => {
      // you could take the user from here
      const user = userCredential.user;
    });
  }

  logIn(
    email: string,
    password: string
  ) {
    signInWithEmailAndPassword(this.fireAuth, email, password).then((userCredential) => {
      // you could take the user from here
      const user = userCredential.user;
    });
  }

  logOut() {
    this.fireAuth
      .signOut()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((err: any) => console.log('Error in signOut', err));
  }
}
