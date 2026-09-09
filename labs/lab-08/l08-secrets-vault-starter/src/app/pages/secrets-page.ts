import { Component, inject, input, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SecretLists } from '../secret-lists/secret-lists';
import { SecretDetail } from '../secrets/secret-detail';
import { SecretsList } from '../secrets/secrets-list';
import { Splitter } from '../shared/splitter';
import { VaultUpload } from '../vault/vault-upload';
import { SecretsStore } from '../store/secrets-store';
import { AuthStore } from '../auth/auth-store';

@Component({
  selector: 'app-secrets-page',
  imports: [RouterLink, SecretDetail, SecretLists, SecretsList, Splitter, VaultUpload],
  templateUrl: './secrets-page.html',
  styleUrl: './secrets-page.css',
})
export class SecretsPage {
  readonly store = inject(SecretsStore);
  readonly auth = inject(AuthStore);

  readonly listId = input.required<string>();
  readonly secretId = input<string>();

  constructor() {
    effect(() => this.store.selectList(this.listId()));
    effect(() => this.store.openSecretById(this.secretId() ?? null));
  }
}
