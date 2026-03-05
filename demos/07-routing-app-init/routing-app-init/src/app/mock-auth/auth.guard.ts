import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthFacade } from './state/auth.facade';

export const authGuard = () => {
  const authService = inject(AuthFacade);
  const router = inject(Router);
  return authService.isAuthenticated().pipe(
    tap((authenticated) => {
      if (!authenticated) {
        router.navigate(['/auth/sign-in']);
      }
    })
  );
};