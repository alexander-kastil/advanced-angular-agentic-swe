import { Component, computed, signal } from '@angular/core';
import { createChallenge, randomBase64Url } from '../../../auth/pkce';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

@Component({
  selector: 'app-oauth-oidc',
  templateUrl: './oauth-oidc.component.html',
  styleUrl: './oauth-oidc.component.scss',
  imports: [CodeBlockComponent]
})
export class OauthOidcComponent {
  readonly tenant = signal('organizations');
  readonly clientId = signal('00001111-aaaa-2222-bbbb-3333cccc4444');
  readonly redirectUri = signal('http://localhost:4200/');
  readonly scopes = signal('openid profile offline_access api://ng-oauth/access_as_user');

  readonly verifier = signal('');
  readonly challenge = signal('');
  readonly state = signal('');
  readonly nonce = signal('');

  readonly authority = computed(
    () => `https://login.microsoftonline.com/${this.tenant()}/oauth2/v2.0`
  );

  readonly authorizeUrl = computed(() => {
    const params = new URLSearchParams({
      client_id: this.clientId(),
      response_type: 'code',
      redirect_uri: this.redirectUri(),
      response_mode: 'query',
      scope: this.scopes(),
      state: this.state(),
      nonce: this.nonce(),
      code_challenge: this.challenge(),
      code_challenge_method: 'S256'
    });
    return `${this.authority()}/authorize?${params.toString().replaceAll('&', '\n&')}`;
  });

  readonly tokenRequest = computed(
    () => `POST ${this.authority()}/token
Origin: http://localhost:4200
Content-Type: application/x-www-form-urlencoded

client_id=${this.clientId()}
&grant_type=authorization_code
&code=<code from the redirect>
&redirect_uri=${encodeURIComponent(this.redirectUri())}
&code_verifier=${this.verifier()}
&scope=${encodeURIComponent(this.scopes())}`
  );

  constructor() {
    this.generate();
  }

  async generate(): Promise<void> {
    const verifier = randomBase64Url(32);
    this.verifier.set(verifier);
    this.challenge.set(await createChallenge(verifier));
    this.state.set(randomBase64Url(16));
    this.nonce.set(randomBase64Url(16));
  }

  set(field: 'tenant' | 'clientId' | 'redirectUri' | 'scopes', value: string): void {
    this[field].set(value);
  }
}
