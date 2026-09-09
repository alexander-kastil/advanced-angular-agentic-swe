import { Component, computed, effect, inject, linkedSignal } from '@angular/core';
import { DOCUMENT } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { SecretLists } from './secret-lists/secret-lists';
import { SecretList } from './secret-lists/secret-list';
import { SecretsList } from './secrets/secrets-list';

@Component({
  imports: [SecretLists, SecretsList],
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

  readonly selectedList = computed(() =>
    this.all().find((list) => list.listId === this.selectedListId()) ?? null,
  );

  constructor() {
    effect(() => {
      const list = this.selectedList();
      this.document.title = list ? `${list.name} - Secrets and Document Vault` : 'Secrets and Document Vault';
    });
  }
}
