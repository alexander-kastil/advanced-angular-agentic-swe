import { Component, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SecretLists } from '../secret-lists/secret-lists';
import { SecretDetail } from '../secrets/secret-detail';
import { SecretsList } from '../secrets/secrets-list';
import { Splitter } from '../shared/splitter';
import { VaultUpload } from '../vault/vault-upload';
import { Secret } from '../secrets/secret';
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

  private readonly router = inject(Router);

  async onSaved(secret: Secret): Promise<void> {
    // A PUT writes a new version row, so the saved secret carries a new id.
    await this.router.navigate(['/secrets', secret.listId, secret.secretId]);
    await this.store.loadSecrets();
  }

  constructor() {
    effect(() => this.store.selectList(this.listId()));
    effect(() => this.store.openSecretById(this.secretId() ?? null));
  }
}
