import { Component, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { SecretList, SecretListType } from './secret-list';

@Component({
  selector: 'app-secret-lists',
  templateUrl: './secret-lists.html',
  styleUrl: './secret-lists.css',
})
export class SecretLists {
  private readonly lists = httpResource<SecretList[]>(() => '/api/lists');

  readonly secretsLists = computed(() =>
    (this.lists.value() ?? []).filter((list) => list.type === SecretListType.Secrets),
  );

  readonly vaultLists = computed(() =>
    (this.lists.value() ?? []).filter((list) => list.type === SecretListType.Vault),
  );

  readonly isLoading = this.lists.isLoading;
  readonly error = this.lists.error;
}
