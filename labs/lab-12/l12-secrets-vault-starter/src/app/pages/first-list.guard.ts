import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecretsStore } from '../store/secrets-store';

export const firstListGuard: CanActivateFn = async () => {
  const store = inject(SecretsStore);
  const router = inject(Router);

  if (store.listIds().length === 0) {
    await store.loadLists();
  }
  const first = store.listEntities()[0];
  return first ? router.createUrlTree(['/secrets', first.listId]) : true;
};
