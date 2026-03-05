# Angular HTTP & Data Fetching (v21+)

## httpResource() - Preferred

```typescript
import { httpResource } from '@angular/common/http';

export class UserProfile {
  userId = signal('123');

  // Reactive - refetches when userId changes
  userResource = httpResource<User>(() => `/api/users/${this.userId()}`);

  // With options
  userResource = httpResource<User>(() => ({
    url: `/api/users/${this.userId()}`,
    headers: { 'Authorization': `Bearer ${this.token()}` },
    params: { include: 'profile' },
  }));

  // With default value
  usersResource = httpResource<User[]>(() => '/api/users', { defaultValue: [] });

  // Conditional - skip when undefined
  userResource = httpResource<User>(() => {
    const id = this.userId();
    return id ? `/api/users/${id}` : undefined;
  });
}
```

### Resource State

```typescript
userResource.value()      // current value or undefined
userResource.hasValue()   // boolean
userResource.error()      // error or undefined
userResource.isLoading()  // boolean
userResource.status()     // 'idle'|'loading'|'reloading'|'resolved'|'error'|'local'
userResource.reload()     // manual reload
userResource.set(value)   // set local value
```

### Status-Based Template

```html
@switch (dataResource.status()) {
  @case ('idle') { <p>Enter a search term</p> }
  @case ('loading') { <app-spinner /> }
  @case ('reloading') { <app-data [data]="dataResource.value()" /><app-spinner size="small" /> }
  @case ('resolved') { <app-data [data]="dataResource.value()" /> }
  @case ('error') { <app-error [error]="dataResource.error()" (retry)="dataResource.reload()" /> }
}
```

## resource() - Generic Async

```typescript
searchResource = resource({
  params: () => ({ q: this.query() }),
  loader: async ({ params, abortSignal }) => {
    if (!params.q) return [];
    const res = await fetch(`/api/search?q=${params.q}`, { signal: abortSignal });
    return res.json() as Promise<SearchResult[]>;
  },
  defaultValue: [] as SearchResult[],
});
```

## HttpClient Methods

```typescript
private http = inject(HttpClient);
this.http.get<User>(`/api/users/${id}`)
this.http.post<User>('/api/users', user)
this.http.put<User>(`/api/users/${id}`, user)
this.http.patch<User>(`/api/users/${id}`, changes)
this.http.delete<void>(`/api/users/${id}`)
```

## Functional Interceptors

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) inject(Router).navigate(['/login']);
      return throwError(() => err);
    })
  );

// Register in app.config.ts
provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
```
