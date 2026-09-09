import { Component, computed, DOCUMENT, effect, inject, viewChild } from '@angular/core';
import { SecretLists } from './secret-lists/secret-lists';
import { SecretDetail } from './secrets/secret-detail';
import { SecretsList } from './secrets/secrets-list';
import { Splitter } from './shared/splitter';
import { VaultUpload } from './vault/vault-upload';
import { SecretsStore } from './store/secrets-store';

@Component({
  imports: [SecretDetail, SecretLists, SecretsList, Splitter, VaultUpload],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly document = inject(DOCUMENT);
  readonly store = inject(SecretsStore);

  private readonly splitter = viewChild.required(Splitter);
  readonly paneWidth = computed(() => `${this.splitter().width()}px`);

  constructor() {
    effect(() => {
      const list = this.store.selectedList();
      this.document.title = list ? `${list.name} - Secrets and Document Vault` : 'Secrets and Document Vault';
    });
  }

  onSaved(): void {
    void this.store.loadSecrets();
  }
}
