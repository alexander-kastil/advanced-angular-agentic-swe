import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { authStore } from './auth.store';

export const authGuard = () => {
  const store = inject(authStore);
  const router = inject(Router);
  if (!store.isAuthenticated()) {
    router.navigate(['/auth/sign-in']);
    return false;
  }
  return true;
};