- To register an `HttpInterceptor`, modify the providers section from app.config.ts:

```typescript
providers: [
    provideHttpClient(
        withInterceptors([authInterceptor])),
```

- When using HttpInterceptors and withInterceptors you must provide a functional implementation with the following base pattern. You can check `auth.interceptor.ts` for a working example:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('auth interceptor...');
  return next(req);
};
```