import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { patchState, signalStoreFeature, type, withMethods } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { Category } from '../secrets/category';

export function withCategories() {
  return signalStoreFeature(
    { state: type<{ selectedListId: string | null }>() },
    withEntities({ entity: type<Category>(), collection: 'category' }),
    withMethods((store, http = inject(HttpClient)) => ({
      async loadCategories(): Promise<void> {
        const listId = store.selectedListId();
        if (!listId) return;

        const categories = await firstValueFrom(
          http.get<Category[]>(`/api/categories?listId=${listId}`),
        );
        patchState(
          store,
          setAllEntities(categories, { collection: 'category', selectId: (c) => c.categoryId }),
        );
      },
    })),
  );
}
