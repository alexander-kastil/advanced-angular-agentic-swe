import { computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { patchState, signalStoreFeature, type, withComputed, withMethods, withState } from '@ngrx/signals';
import { setAllEntities, updateEntity, withEntities } from '@ngrx/signals/entities';
import { Secret } from '../secrets/secret';
import { UpdateSecret } from '../secrets/update-secret';

type SecretsState = {
  search: string;
  selectedCategoryIds: string[];
  openSecretId: string | null;
  secretsLoading: boolean;
};

export function withSecrets() {
  return signalStoreFeature(
    { state: type<{ selectedListId: string | null }>() },
    withEntities({ entity: type<Secret>(), collection: 'secret' }),
    withState<SecretsState>({
      search: '',
      selectedCategoryIds: [],
      openSecretId: null,
      secretsLoading: false,
    }),
    withComputed(({ secretEntities, selectedCategoryIds, openSecretId }) => ({
      visibleSecrets: computed(() => {
        const wanted = selectedCategoryIds();
        const all = secretEntities();
        return wanted.length === 0
          ? all
          : all.filter((secret) => secret.categoryIds.some((id) => wanted.includes(id)));
      }),
      openSecret: computed(
        () => secretEntities().find((secret) => secret.secretId === openSecretId()) ?? null,
      ),
    })),
    withMethods((store, http = inject(HttpClient)) => ({
      setSearch(search: string): void {
        patchState(store, { search });
      },
      setCategoryFilter(selectedCategoryIds: string[]): void {
        patchState(store, { selectedCategoryIds });
      },
      openSecretById(secretId: string | null): void {
        patchState(store, { openSecretId: secretId });
      },
      async loadSecrets(): Promise<void> {
        const listId = store.selectedListId();
        if (!listId) return;

        patchState(store, { secretsLoading: true });
        const params = new URLSearchParams({ listId });
        const term = store.search().trim();
        if (term) params.set('search', term);

        const secrets = await firstValueFrom(http.get<Secret[]>(`/api/secrets?${params}`));
        patchState(
          store,
          setAllEntities(secrets, { collection: 'secret', selectId: (s) => s.secretId }),
          { secretsLoading: false },
        );
      },
      async saveSecret(current: Secret, value: UpdateSecret): Promise<Secret> {
        const updated = await firstValueFrom(
          http.put<Secret>(
            `/api/secrets/${encodeURIComponent(current.name)}?listId=${current.listId}`,
            value,
          ),
        );
        patchState(
          store,
          updateEntity(
            { id: current.secretId, changes: () => updated },
            { collection: 'secret', selectId: (s: Secret) => s.secretId },
          ),
        );
        return updated;
      },
    })),
  );
}
