# OAuth for Angular

Optional module. Every protected Angular app ends up with the same three jobs: get a token from an
identity provider, attach it to the right requests, and keep signed-out users away from screens
they cannot use. This module builds each job by hand first, so you can read what a library does,
then hands the work to Firebase Authentication, MSAL Angular with Microsoft Entra ID, and the Easy
Auth sidecar of Azure Container Apps.

You start with the protocols: OAuth 2.0 for access tokens, OpenID Connect for identity, the
authorization code flow with PKCE that every SPA uses, and the anatomy of a JWT. The middle demos
build the plumbing on Angular 22 primitives: `HttpHeaders` and `observe: 'response'`, a functional
`HttpInterceptorFn` with an allowlist, an NgRx SignalStore whose `isAuthenticated` is a `computed()`
over the token's `exp`, a `CanMatchFn` that redirects with a `UrlTree`, and the login round trip.
The last three demos swap the hand-built pieces for real identity providers.

## Demo app

`ng-oauth` is an Angular 22 app on the same demo host as module 01. The demo shell reads its
catalog from `json-server` on `http://localhost:3000`. Every protected API call in the demos is
answered by an in-page echo backend, so no identity provider tenant is needed to run them.

```bash
cd ng-oauth
npm install
npm run api
npm start
npm test
```

Run `npm run api` and `npm start` in separate terminals.

## Demos

| # | Route | Title | Teaches | Topic |
| --- | --- | --- | --- | --- |
| 1 | `oauth-oidc` | OAuth 2.0 and OpenID Connect | Separate authentication from authorization: OAuth 2.0 grants an access token, OpenID Connect adds the ID token. Generate a real PKCE verifier and S256 challenge in the browser and build the /authorize and /token requests an SPA sends to Microsoft Entra ID. | Fundamentals |
| 2 | `jwt-anatomy` | Reading a JWT | Decode the header, payload and signature segments of a JSON Web Token, read iss, aud, exp, scp and roles, and see why the browser may read claims but never trusts them for authorization. | Fundamentals |
| 3 | `bearer-requests` | Bearer Tokens on HttpClient | Send a bearer token by hand with HttpHeaders, read the full HttpResponse with observe: 'response', and watch an echo API answer 401 without the header and 200 with it. | Token Plumbing |
| 4 | `auth-interceptor` | Functional Auth Interceptor | Move the header into an HttpInterceptorFn backed by an allowlist of protected APIs, scoped to the route with provideHttpClient(withInterceptors()), and prove the token never reaches a third-party host. | Token Plumbing |
| 5 | `auth-store` | Auth State in a SignalStore | Hold the token in an NgRx SignalStore and derive claims, userName and isAuthenticated with withComputed(), so the session ends on its own the second exp passes. | App Flow |
| 6 | `auth-guard` | Guarding Routes with canMatch | Protect a lazy route with a CanMatchFn that returns a UrlTree to the login page and remembers the attempted URL, so the protected chunk never downloads for a signed-out user. | App Flow |
| 7 | `app-auth-flow` | The Sign-In Round Trip | Build the login page the guard redirects to: navigation only for signed-in users, a return to the attempted URL after sign-in, and a clear message when the session expires. | App Flow |
| 8 | `firebase-auth` | Firebase Authentication | Sign users in with the modular firebase/auth SDK behind a signal-based service, attach the Firebase ID token in an interceptor, validate it in ASP.NET Core against securetoken.google.com, and publish with firebase deploy. | Identity Providers |
| 9 | `entra-msal` | Microsoft Entra ID with MSAL Angular | Register an API and a SPA in Microsoft Entra ID, wire MSAL Angular 6 into a standalone app with provideAppInitializer, MsalGuard and MsalInterceptor, and test which scopes the protectedResourceMap attaches per URL. | Identity Providers |
| 10 | `msal-vs-easy-auth` | MSAL vs Easy Auth | Compare MSAL in the browser with the Easy Auth sidecar of Azure Container Apps: /.auth/login, /.auth/me, the session cookie, and decoding the X-MS-CLIENT-PRINCIPAL header your API receives. | Identity Providers |

## Shared auth code

Demos 4 to 7 share one implementation under `ng-oauth/src/app/auth/`:

| File | Role |
| --- | --- |
| `jwt.ts` | base64url helpers, `decodeJwt()`, `mintUnsignedJwt()` for the demo identity provider |
| `pkce.ts` | `randomBase64Url()` and the S256 `createChallenge()` |
| `auth.store.ts` | `AuthStore`: token, claims, `isAuthenticated`, return URL |
| `auth.interceptor.ts` | `authInterceptor` and the `PROTECTED_APIS` allowlist |
| `auth.guard.ts` | `authGuard`, a `CanMatchFn` |
| `echo-backend.interceptor.ts` | The in-page API for `https://api.ng-oauth.demo/` |

## Links

- [Microsoft identity platform and the OAuth 2.0 authorization code flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)
- [Angular: HTTP interceptors](https://angular.dev/guide/http/interceptors)
- [Angular: route guards](https://angular.dev/guide/routing/route-guards)
- [MSAL Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular)
- [Firebase Authentication for the web](https://firebase.google.com/docs/auth/web/start)
- [Authentication and authorization in Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/authentication)
