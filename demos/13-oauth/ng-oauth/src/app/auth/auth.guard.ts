import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';

export const authGuard: CanMatchFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  const attempted = router.currentNavigation()?.extractedUrl.toString() ?? '/';
  auth.rememberReturnUrl(attempted);
  return router.createUrlTree(['/demos/app-auth-flow']);
};
