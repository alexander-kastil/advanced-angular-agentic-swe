import { computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { patchState, signalStoreFeature, type, withComputed, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { SecretList } from '../secret-lists/secret-list';

type ListsState = {
  selectedListId: string | null;
  listsLoading: boolean;
};

export function withLists() {
  return signalStoreFeature(
    withEntities({ entity: type<SecretList>(), collection: 'list' }),
    withState<ListsState>({ selectedListId: null, listsLoading: false }),
    withComputed(({ listEntities, selectedListId }) => ({
      secretsLists: computed(() => listEntities().filter((list) => list.type === 1)),
      vaultLists: computed(() => listEntities().filter((list) => list.type === 2)),
      selectedList: computed(
        () => listEntities().find((list) => list.listId === selectedListId()) ?? null,
      ),
    })),
    withMethods((store, http = inject(HttpClient)) => ({
      selectList(listId: string): void {
        patchState(store, { selectedListId: listId });
      },
      async loadLists(): Promise<void> {
        patchState(store, { listsLoading: true });
        const lists = await firstValueFrom(http.get<SecretList[]>('/api/lists'));
        patchState(
          store,
          setAllEntities(lists, { collection: 'list', selectId: (list) => list.listId }),
          { listsLoading: false },
        );
      },
    })),
  );
}
