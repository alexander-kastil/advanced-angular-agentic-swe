import { effect, untracked } from '@angular/core';
import { signalStore, withHooks } from '@ngrx/signals';
import { withCategories } from './with-categories';
import { withLists } from './with-lists';
import { withSecrets } from './with-secrets';

export const SecretsStore = signalStore(
  { providedIn: 'root' },
  withLists(),
  withSecrets(),
  withCategories(),
  withHooks({
    onInit(store) {
      effect(() => {
        store.selectedListId();
        store.search();
        untracked(() => {
          void store.loadSecrets();
          void store.loadCategories();
        });
      });
    },
  }),
);
