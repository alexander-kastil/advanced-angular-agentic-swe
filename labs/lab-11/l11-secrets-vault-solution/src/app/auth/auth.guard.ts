import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth-store';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  return auth.isSignedIn()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { next: state.url } });
};
