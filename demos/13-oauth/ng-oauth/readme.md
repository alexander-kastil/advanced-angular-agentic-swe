# OAuth for Angular Demo Module

Angular 22 shell for the optional module 13. The demo list is served from `db.json` by
`json-server` on port 3000, and protected API calls are answered by an in-page echo backend.

```bash
npm install
npm run api   # json-server on http://localhost:3000
npm start     # http://localhost:4200
npm run build
npm test
```

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
