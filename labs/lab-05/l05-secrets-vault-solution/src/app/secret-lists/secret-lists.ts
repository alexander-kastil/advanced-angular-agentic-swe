import { Component, computed, input, model } from '@angular/core';
import { SecretList, SecretListType } from './secret-list';

@Component({
  selector: 'app-secret-lists',
  templateUrl: './secret-lists.html',
  styleUrl: './secret-lists.css',
})
export class SecretLists {
  readonly lists = input.required<SecretList[]>();
  readonly selectedListId = model<string | null>(null);

  readonly secretsLists = computed(() => this.lists().filter((list) => list.type === SecretListType.Secrets));
  readonly vaultLists = computed(() => this.lists().filter((list) => list.type === SecretListType.Vault));
}
