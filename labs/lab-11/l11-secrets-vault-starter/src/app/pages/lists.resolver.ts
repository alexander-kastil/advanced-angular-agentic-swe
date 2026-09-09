import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { SecretsStore } from '../store/secrets-store';

export const listsResolver: ResolveFn<boolean> = async () => {
  const store = inject(SecretsStore);
  if (store.listIds().length === 0) {
    await store.loadLists();
  }
  return true;
};
