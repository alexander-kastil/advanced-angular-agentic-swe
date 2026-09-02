- Examine `httpError.interceptor.ts` 

```typescript
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({ count: 3, delay: 1000 }),
    catchError((error) => {
      console.log('handling http error', error)
      throw new Error(error.message);
    })
  );
};
```

- Examine its registration in `app.config.ts`:

```typescript
provideHttpClient(withInterceptors([
    authInterceptor,
    httpErrorInterceptor
])),
```