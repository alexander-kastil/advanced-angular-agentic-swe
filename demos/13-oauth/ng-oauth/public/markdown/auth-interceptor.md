# Functional Auth Interceptor

An `HttpInterceptorFn` sees every request the `HttpClient` sends. Put the bearer header there once,
and decide in the same place which hosts may receive it.

## The interceptor

```typescript
export const PROTECTED_APIS = new InjectionToken<string[]>('PROTECTED_APIS', {
  factory: () => ['https://api.ng-oauth.demo/']
});

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthStore);
  const protectedApis = inject(PROTECTED_APIS);
  const token = auth.token();
  const isProtected = protectedApis.some((api) => req.url.startsWith(api));

  if (!token || !auth.isAuthenticated() || !isProtected) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
```

Requests are immutable, so the interceptor clones with `setHeaders`. `inject()` works because
functional interceptors run in an injection context.

## The allowlist is the security

Match on the full origin with a trailing slash. `req.url.includes('api.ng-oauth.demo')` also matches
`https://api.ng-oauth.demo.attacker.example/`, a host anyone can register. The `InjectionToken`
with a factory keeps the list overridable per environment or per test without a module.

## Register it

Interceptor order is array order, and the last one is closest to the backend:

```typescript
provideHttpClient(withInterceptors([authInterceptor, echoBackendInterceptor]))
```

In a real app this line sits in `app.config.ts` and the echo interceptor is gone. Here it is scoped
to the demo's route so the other demos keep a clean client.

## Run the demo

1. Open **Functional Auth Interceptor** while signed out and call the API. The echo server returns
   401.
2. Click **Sign in as Ada** and call all three URLs.
3. Read the table: only `https://api.ng-oauth.demo/orders` received `Authorization`; the third-party
   CDN and the look-alike attacker host received none.

Expected result: one row with `Bearer eyJ...`, two rows with `(none)`.

## Test it

`auth.interceptor.spec.ts` uses `provideHttpClientTesting()` and asserts the header on the outgoing
request rather than mocking the store's internals:

```typescript
http.get('https://cdn.thirdparty.demo/fonts.json').subscribe();
const req = backend.expectOne('https://cdn.thirdparty.demo/fonts.json');
expect(req.request.headers.has('Authorization')).toBe(false);
```
