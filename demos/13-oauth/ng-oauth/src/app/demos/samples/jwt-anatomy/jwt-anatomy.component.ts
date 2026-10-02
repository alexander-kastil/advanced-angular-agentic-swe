import { Component, computed, signal } from '@angular/core';
import { decodeJwt, DecodedJwt, mintUnsignedJwt } from '../../../auth/jwt';

interface ClaimRow {
  name: string;
  value: string;
  meaning: string;
}

const CLAIM_MEANINGS: Record<string, string> = {
  iss: 'Issuer: the authority that signed the token',
  aud: 'Audience: the API this token is meant for',
  sub: 'Subject: stable user id, unique per app',
  exp: 'Expires at (seconds since epoch)',
  nbf: 'Not valid before',
  iat: 'Issued at',
  name: 'Display name',
  preferred_username: 'Sign-in name, not a stable identifier',
  oid: 'Object id of the user in the tenant',
  tid: 'Tenant id',
  azp: 'Authorized party: the client that requested the token',
  scp: 'Delegated scopes granted to the client',
  roles: 'App roles assigned to the user or app',
  nonce: 'Echo of the nonce sent to /authorize, replay protection',
  ver: 'Token format version'
};

const TIME_CLAIMS = ['exp', 'nbf', 'iat'];

function entraShapedToken(): string {
  const now = Math.floor(Date.now() / 1000);
  return mintUnsignedJwt({
    aud: 'api://ng-oauth',
    iss: 'https://login.microsoftonline.com/aaaabbbb-0000-cccc-1111-dddd2222eeee/v2.0',
    iat: now - 60,
    nbf: now - 60,
    exp: now + 3540,
    azp: '00001111-aaaa-2222-bbbb-3333cccc4444',
    name: 'Ada Lovelace',
    oid: '11112222-bbbb-3333-cccc-4444dddd5555',
    preferred_username: 'ada@contoso.com',
    roles: ['Orders.Read'],
    scp: 'access_as_user',
    sub: 'AAAAAAAAAAAAAAAAAAAAAIkzqFVrSaSaFHy782bbtaQ',
    tid: 'aaaabbbb-0000-cccc-1111-dddd2222eeee',
    ver: '2.0'
  });
}

function expiredToken(): string {
  const now = Math.floor(Date.now() / 1000);
  return mintUnsignedJwt({
    iss: 'https://idp.ng-oauth.demo',
    sub: 'ada',
    iat: now - 7200,
    exp: now - 3600
  });
}

@Component({
  selector: 'app-jwt-anatomy',
  templateUrl: './jwt-anatomy.component.html',
  styleUrl: './jwt-anatomy.component.scss'
})
export class JwtAnatomyComponent {
  readonly token = signal(entraShapedToken());
  readonly now = signal(Date.now());

  readonly decoded = computed<{ jwt: DecodedJwt | null; error: string }>(() => {
    try {
      return { jwt: decodeJwt(this.token()), error: '' };
    } catch (error) {
      return { jwt: null, error: error instanceof Error ? error.message : String(error) };
    }
  });

  readonly segments = computed(() => this.token().trim().split('.'));

  readonly header = computed(() => JSON.stringify(this.decoded().jwt?.header ?? {}, null, 2));
  readonly payload = computed(() => JSON.stringify(this.decoded().jwt?.payload ?? {}, null, 2));

  readonly claims = computed<ClaimRow[]>(() => {
    const payload = this.decoded().jwt?.payload ?? {};
    return Object.entries(payload).map(([name, value]) => ({
      name,
      value:
        TIME_CLAIMS.includes(name) && typeof value === 'number'
          ? `${value} (${new Date(value * 1000).toLocaleString()})`
          : Array.isArray(value)
            ? value.join(', ')
            : String(value),
      meaning: CLAIM_MEANINGS[name] ?? ''
    }));
  });

  readonly algorithm = computed(() => String(this.decoded().jwt?.header['alg'] ?? ''));

  readonly expiry = computed(() => {
    const exp = this.decoded().jwt?.payload['exp'];
    if (typeof exp !== 'number') {
      return 'No exp claim. An API must reject a token without one.';
    }
    const seconds = Math.round(exp - this.now() / 1000);
    return seconds > 0 ? `Valid for another ${seconds} seconds.` : `Expired ${-seconds} seconds ago.`;
  });

  readonly valid = computed(() => this.expiry().startsWith('Valid'));

  setToken(value: string): void {
    this.now.set(Date.now());
    this.token.set(value);
  }

  useSample(): void {
    this.setToken(entraShapedToken());
  }

  useExpired(): void {
    this.setToken(expiredToken());
  }
}
