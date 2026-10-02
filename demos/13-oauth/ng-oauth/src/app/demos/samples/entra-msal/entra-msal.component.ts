import { Component, computed, signal } from '@angular/core';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

interface Snippet {
  key: string;
  label: string;
  code: string;
}

export const PROTECTED_RESOURCES: [string, string[]][] = [
  ['https://graph.microsoft.com/v1.0/me', ['user.read']],
  ['https://localhost:5001/api/*', ['api://<api-client-id>/access_as_user']]
];

const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function matchResource(url: string, map = PROTECTED_RESOURCES): [string, string[]] | null {
  return (
    map.find(([pattern]) =>
      new RegExp(`^${pattern.split('*').map(escapeRegex).join('.*')}$`).test(url)
    ) ?? null
  );
}

@Component({
  selector: 'app-entra-msal',
  templateUrl: './entra-msal.component.html',
  styleUrl: './entra-msal.component.scss',
  imports: [CodeBlockComponent]
})
export class EntraMsalComponent {
  readonly resources = PROTECTED_RESOURCES;
  readonly url = signal('https://localhost:5001/api/food');
  readonly match = computed(() => matchResource(this.url()));

  readonly snippets: Snippet[] = [
    {
      key: 'appreg',
      label: 'App registrations',
      code: `az ad app create --display-name food-api --sign-in-audience AzureADMyOrg
az ad app update --id <api-client-id> --identifier-uris api://<api-client-id>
# Expose an API: add the delegated scope access_as_user

az ad app create --display-name food-ui --sign-in-audience AzureADMyOrg
az rest --method PATCH \\
  --uri https://graph.microsoft.com/v1.0/applications/<ui-object-id> \\
  --headers Content-Type=application/json \\
  --body '{"spa":{"redirectUris":["http://localhost:4200/"]}}'
# API permissions: add food-api / access_as_user and grant admin consent`
    },
    {
      key: 'env',
      label: 'environment.ts',
      code: `export const environment = {
  authEnabled: true,
  api: 'https://localhost:5001/api/',
  entra: {
    clientId: '<ui-client-id>',
    authority: 'https://login.microsoftonline.com/<tenant-id>/',
    redirectUri: '/',
    apiScopes: ['api://<api-client-id>/access_as_user']
  }
};`
    },
    {
      key: 'providers',
      label: 'msal.providers.ts',
      code: `export function provideMsal(): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: MSAL_INSTANCE,
      useFactory: () =>
        new PublicClientApplication({
          auth: {
            clientId: environment.entra.clientId,
            authority: environment.entra.authority,
            redirectUri: environment.entra.redirectUri,
            postLogoutRedirectUri: environment.entra.redirectUri
          },
          cache: { cacheLocation: BrowserCacheLocation.LocalStorage }
        })
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
        authRequest: { scopes: environment.entra.apiScopes }
      } satisfies MsalGuardConfiguration
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          ['https://graph.microsoft.com/v1.0/me', ['user.read']],
          [\`\${environment.api}*\`, environment.entra.apiScopes]
        ])
      } satisfies MsalInterceptorConfiguration
    },
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    provideAppInitializer(() =>
      firstValueFrom(inject(MsalService).handleRedirectObservable(), { defaultValue: null })
    )
  ];
}`
    },
    {
      key: 'config',
      label: 'app.config.ts',
      code: `export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    ...(environment.authEnabled ? provideMsal() : [])
  ]
};`
    },
    {
      key: 'routes',
      label: 'app.routes.ts',
      code: `export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'food',
    canActivate: [MsalGuard],
    loadChildren: () => import('./food/food.routes').then((m) => m.foodRoutes)
  }
];`
    },
    {
      key: 'user',
      label: 'auth-state.service.ts',
      code: `@Service()
export class AuthStateService {
  private readonly msal = inject(MsalService);
  private readonly broadcast = inject(MsalBroadcastService);

  private readonly status = toSignal(this.broadcast.inProgress$, {
    initialValue: InteractionStatus.Startup
  });

  readonly ready = computed(() => this.status() === InteractionStatus.None);
  readonly account = computed(() =>
    this.ready() ? this.msal.instance.getAllAccounts()[0] ?? null : null
  );
  readonly userName = computed(() => this.account()?.name ?? '');

  login(): void {
    this.msal.loginRedirect({ scopes: environment.entra.apiScopes });
  }

  logout(): void {
    this.msal.logoutRedirect();
  }
}`
    },
    {
      key: 'api',
      label: 'Program.cs',
      code: `builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

builder.Services.AddAuthorization();
builder.Services.AddControllers(options =>
    options.Filters.Add(new AuthorizeFilter(
        new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build())));

// appsettings.json
// "AzureAd": {
//   "Instance": "https://login.microsoftonline.com/",
//   "TenantId": "<tenant-id>",
//   "ClientId": "<api-client-id>",
//   "Audience": "api://<api-client-id>"
// }`
    }
  ];

  readonly selectedKey = signal(this.snippets[0].key);
  readonly selected = computed(
    () => this.snippets.find((snippet) => snippet.key === this.selectedKey()) ?? this.snippets[0]
  );

  select(key: string): void {
    this.selectedKey.set(key);
  }

  setUrl(value: string): void {
    this.url.set(value);
  }
}
