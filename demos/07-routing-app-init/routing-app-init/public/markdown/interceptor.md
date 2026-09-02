# HTTP Interceptors

## Registering the chain

Functional interceptors are registered once, in order, on `provideHttpClient`. Each one wraps the next.

```typescript
provideHttpClient(
  withInterceptors([
    authInterceptor,
    retryInterceptor({ count: 3, delay: 1000 }),
    httpErrorInterceptor,
  ])
),
```

Angular 22 uses the Fetch backend by default: there is no `withFetch()` to add and no `withXhr()` to keep.

## The base pattern

```typescript
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('outgoing', req.url);
  return next(req);
};
```

## Reading state inside an interceptor

An interceptor runs in an injection context, so it can `inject()` a service. Because `AuthFacade` exposes signals, the check is an ordinary boolean, and the header gets the token rather than an object.

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthFacade);
  const token = auth.token();

  if (!auth.isAuthenticated() || !token || req.url.includes(environment.api)) {
    return next(req);
  }

  return next(req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) }));
};
```

The local json-server does not check authentication, so requests to it are left untouched.

## Parameterising an interceptor

An interceptor is a function, so a factory that closes over configuration is enough. No class, no DI token.

```typescript
export const retryInterceptor = (config: RetryConfig): HttpInterceptorFn => {
  return (req, next) => next(req).pipe(retry(config));
};
```

Use the buttons below to send a JSON request, an XML request and a 404 and watch each interceptor in the console.
