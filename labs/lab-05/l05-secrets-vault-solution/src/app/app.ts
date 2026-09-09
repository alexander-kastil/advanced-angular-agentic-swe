import { Component, computed, DOCUMENT, effect, inject, linkedSignal, signal, viewChild } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { SecretLists } from './secret-lists/secret-lists';
import { SecretList } from './secret-lists/secret-list';
import { SecretDetail } from './secrets/secret-detail';
import { SecretsList } from './secrets/secrets-list';
import { Secret } from './secrets/secret';
import { Category } from './secrets/category';
import { Splitter } from './shared/splitter';
import { VaultUpload } from './vault/vault-upload';

@Component({
  imports: [SecretDetail, SecretLists, SecretsList, Splitter, VaultUpload],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly document = inject(DOCUMENT);

  private readonly lists = httpResource<SecretList[]>(() => '/api/lists');

  readonly all = computed(() => this.lists.value() ?? []);
  readonly isLoading = this.lists.isLoading;
  readonly error = this.lists.error;

  readonly selectedListId = linkedSignal<SecretList[], string | null>({
    source: this.all,
    computation: (lists, previous) =>
      lists.some((list) => list.listId === previous?.value) ? previous!.value : (lists[0]?.listId ?? null),
  });

  readonly selectedList = computed(
    () => this.all().find((list) => list.listId === this.selectedListId()) ?? null,
  );

  readonly openSecret = signal<Secret | null>(null);

  private readonly categoriesResource = httpResource<Category[]>(() => {
    const listId = this.selectedListId();
    return listId ? `/api/categories?listId=${listId}` : undefined;
  });

  readonly categories = computed(() => this.categoriesResource.value() ?? []);

  readonly reloadToken = signal(0);

  onSaved(secret: Secret): void {
    this.openSecret.set(secret);
    this.reloadToken.update((token) => token + 1);
  }

  private readonly splitter = viewChild.required(Splitter);
  readonly paneWidth = computed(() => `${this.splitter().width()}px`);

  constructor() {
    effect(() => {
      const list = this.selectedList();
      this.document.title = list ? `${list.name} - Secrets and Document Vault` : 'Secrets and Document Vault';
    });

    effect(() => {
      this.selectedListId();
      this.openSecret.set(null);
    });
  }
}
