# Error Handling

Two layers catch failures in this app: interceptors handle everything that travels over HTTP, and the `ErrorHandler` token catches everything else.

## Retrying and mapping HTTP failures

`retryInterceptor` is a factory that takes an rxjs `RetryConfig` and returns an `HttpInterceptorFn`:

```typescript
export const retryInterceptor = (config: RetryConfig): HttpInterceptorFn => {
  return (req, next) => next(req).pipe(retry(config));
};
```

`httpErrorInterceptor` runs after it and turns whatever is left into a plain `Error`:

```typescript
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      console.log('handling http error', error);
      throw new Error(error.message);
    })
  );
};
```

Order matters: interceptors run in the order they are listed.

```typescript
provideHttpClient(
  withInterceptors([
    authInterceptor,
    retryInterceptor({ count: 3, delay: 1000 }),
    httpErrorInterceptor,
  ])
),
```

## The global ErrorHandler

Anything an interceptor does not catch, including errors thrown in a template or a lifecycle hook, reaches the `ErrorHandler` token. Here it logs and routes to `/error`:

```typescript
export function globalErrorHandler(error: Error | HttpErrorResponse) {
  const router = inject(Router);
  console.warn('An error occurred:', error);
  router.navigate(['/error'], { state: { data: (error as Error).message } });
}
```

```typescript
{
  provide: ErrorHandler,
  useValue: globalErrorHandler,
},
```

Press the two buttons below to see each path: the first fails an HTTP call, the second throws an unhandled error.
