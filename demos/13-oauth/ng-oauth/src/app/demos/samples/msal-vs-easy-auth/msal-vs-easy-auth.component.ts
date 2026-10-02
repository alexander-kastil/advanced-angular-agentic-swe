import { Component, computed, signal } from '@angular/core';
import { base64UrlDecode } from '../../../auth/jwt';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

interface PrincipalClaim {
  typ: string;
  val: string;
}

interface ClientPrincipal {
  auth_typ: string;
  name_typ: string;
  role_typ: string;
  claims: PrincipalClaim[];
}

interface Approach {
  aspect: string;
  msal: string;
  easyAuth: string;
}

const SAMPLE_PRINCIPAL: ClientPrincipal = {
  auth_typ: 'aad',
  name_typ: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  role_typ: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  claims: [
    { typ: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name', val: 'Ada Lovelace' },
    { typ: 'preferred_username', val: 'ada@contoso.com' },
    { typ: 'http://schemas.microsoft.com/identity/claims/objectidentifier', val: '11112222-bbbb-3333-cccc-4444dddd5555' },
    { typ: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role', val: 'Orders.Read' }
  ]
};

export function decodePrincipal(header: string): ClientPrincipal {
  return JSON.parse(base64UrlDecode(header.trim())) as ClientPrincipal;
}

@Component({
  selector: 'app-msal-vs-easy-auth',
  templateUrl: './msal-vs-easy-auth.component.html',
  styleUrl: './msal-vs-easy-auth.component.scss',
  imports: [CodeBlockComponent]
})
export class MsalVsEasyAuthComponent {
  readonly approaches: Approach[] = [
    { aspect: 'Runs the flow', msal: 'The SPA, in the browser', easyAuth: 'The platform sidecar' },
    { aspect: 'Token lives in', msal: 'Browser storage', easyAuth: 'Token store in blob storage' },
    { aspect: 'Browser holds', msal: 'Access token', easyAuth: 'Session cookie' },
    { aspect: 'Sign in', msal: 'loginRedirect()', easyAuth: 'Link to /.auth/login/aad' },
    { aspect: 'Who am I', msal: 'getAllAccounts()', easyAuth: 'GET /.auth/me' },
    { aspect: 'API sees', msal: 'Authorization: Bearer', easyAuth: 'X-MS-CLIENT-PRINCIPAL headers' },
    { aspect: 'Angular code', msal: 'Guard, interceptor, providers', easyAuth: 'One resource, plain links' },
    { aspect: 'Runs locally', msal: 'Yes', easyAuth: 'Only behind App Service or Container Apps' }
  ];

  readonly header = signal(btoa(JSON.stringify(SAMPLE_PRINCIPAL)));

  readonly principal = computed<{ value: ClientPrincipal | null; error: string }>(() => {
    try {
      return { value: decodePrincipal(this.header()), error: '' };
    } catch (error) {
      return { value: null, error: error instanceof Error ? error.message : String(error) };
    }
  });

  readonly userName = computed(() => {
    const principal = this.principal().value;
    return principal?.claims.find((claim) => claim.typ === principal.name_typ)?.val ?? '';
  });

  readonly roles = computed(() => {
    const principal = this.principal().value;
    return principal?.claims.filter((claim) => claim.typ === principal.role_typ).map((claim) => claim.val) ?? [];
  });

  readonly meSnippet = `interface AuthMe {
  provider_name: string;
  user_id: string;
  user_claims: { typ: string; val: string }[];
  access_token?: string;
  expires_on?: string;
}

@Service()
export class EasyAuthService {
  private readonly me = httpResource<AuthMe[]>(() => '/.auth/me');

  readonly user = computed(() => (this.me.hasValue() ? this.me.value()[0] ?? null : null));
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly userName = computed(
    () => this.user()?.user_claims.find((claim) => claim.typ === 'name')?.val ?? ''
  );
}`;

  readonly linksSnippet = `<a href="/.auth/login/aad?post_login_redirect_uri=/orders">Sign in</a>
<a href="/.auth/logout?post_logout_redirect_uri=/">Sign out</a>`;

  readonly cliSnippet = `az containerapp auth microsoft update \\
  --name food-shop --resource-group rg-food \\
  --client-id <app-id> --client-secret <secret> \\
  --tenant-id <tenant-id> --yes

az containerapp auth update \\
  --name food-shop --resource-group rg-food \\
  --unauthenticated-client-action AllowAnonymous \\
  --token-store true --sas-url-secret-name token-store-sas`;

  setHeader(value: string): void {
    this.header.set(value);
  }
}
