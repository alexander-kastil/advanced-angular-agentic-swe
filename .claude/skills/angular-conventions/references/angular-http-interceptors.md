# HTTP Interceptors

## Interceptors

### Functional Interceptor (Recommended)

```typescript
// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, InjectionToken } from '@angular/core';

export const PROTECTED_APIS = new InjectionToken<string[]>('PROTECTED_APIS', {
  factory: () => [environment.api],
});

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(Auth).token();
  const isProtected = inject(PROTECTED_APIS).some((api) => req.url.startsWith(api));

  if (!token || !isProtected) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};

// error.interceptor.ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        inject(Router).navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

// logging.interceptor.ts
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();
  return next(req).pipe(
    tap({
      next: () => console.log(`${req.method} ${req.url} - ${Date.now() - started}ms`),
      error: (err) => console.error(`${req.method} ${req.url} failed`, err),
    })
  );
};
```

### Register Interceptors

```typescript
// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor,
        loggingInterceptor,
      ])
    ),
  ],
};
```

### Allowlist where the bearer token may go

An auth interceptor that attaches the token whenever one exists sends it to every host the app
calls: a CDN, an analytics endpoint, a third-party API. Gate it on an allowlist of API base URLs.

- Match with `req.url.startsWith(base)` where `base` is a full origin plus path ending in `/`
  (`https://api.example.com/`). `req.url.includes('api.example.com')` also matches
  `https://api.example.com.attacker.example/`, a host anyone can register.
- Hold the list in an `InjectionToken` with a `factory`, so an environment or a spec overrides it
  without a module.
- MSAL's `protectedResourceMap` is the same allowlist with scopes per entry; an unmatched URL goes
  out without a token.

**Verify:** a spec with `provideHttpClientTesting()` that requests one allowlisted and one
look-alike URL and asserts `req.request.headers.has('Authorization')` is `true`, then `false`.

### Echo backend for demos and route-scoped clients

A route can carry its own `HttpClient`: `providers: [provideHttpClient(withInterceptors([...]))]`
on the route creates a client for that route's injector, and the app-wide interceptors do not run
for it unless `withRequestsMadeViaParent()` is added. Put an interceptor last that never calls
`next()` and answers itself, and a demo or a manual test needs no server:

```typescript
export const echoBackendInterceptor: HttpInterceptorFn = (req) => {
  const headers = Object.fromEntries(req.headers.keys().map((k) => [k, req.headers.get(k) ?? '']));
  const body = { method: req.method, url: req.url, headers };
  if (req.url.startsWith('https://api.demo/') && !req.headers.has('Authorization')) {
    return throwError(() => new HttpErrorResponse({
      status: 401, url: req.url, headers: new HttpHeaders({ 'WWW-Authenticate': 'Bearer' }), error: body,
    }));
  }
  return of(new HttpResponse({ status: 200, url: req.url, body }));
};

// route
{ path: 'auth-demo', providers: [provideHttpClient(withInterceptors([authInterceptor, echoBackendInterceptor]))], loadComponent: ... }
```

Order matters: interceptors run in array order, so the echo must be last to see what the auth
interceptor added. Response headers are a fresh `HttpHeaders`, never `req.headers` copied over.

Back to the index: [angular-http](angular-http.md)
