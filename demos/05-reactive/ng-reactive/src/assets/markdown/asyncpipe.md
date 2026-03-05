- Async pipe is a convenient way to handle Observables in Angular templates. 
- It automatically subscribes and unsubscribes to the Observable source, avoiding memory leaks and boilerplate code. 
- Async pipe can be applied to any Observable, including Arrays, Objects and individual properties. 
- For example, you can use async pipe to display the latest value emitted by an Observable in a template, or to iterate over an Observable array and use an alias.

## Code Example

```html
<mat-card-content>
    <div>Person: {{ (person$ | async)?.name }}</div>
</mat-card-content>
```

## 🆕 Modern Alternative: toSignal() (2026+)

In modern Angular (v20+), prefer converting Observables to signals:

```typescript
import { toSignal } from '@angular/core/rxjs-interop';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-detail',
  template: 
    <div>Name: {{ user().name }}</div>
    <div>Email: {{ user().email }}</div>
  
})
export class UserDetailComponent {
  private http = inject(HttpClient);
  protected user = toSignal(this.http.get('/api/user'));
}
```

**Advantages of toSignal():**
- ✅ Synchronous access - no async pipe needed
- ✅ Simpler template syntax
- ✅ Type-safe (no optional chaining needed)
- ✅ Easier to test and reason about

## When to Use

✅ **Use async pipe when:**
- Working with Observable-based libraries (Material, legacy code)
- Integrating third-party Observable APIs
- Mixing older and newer Angular patterns temporarily

❌ **Use toSignal() instead when:**
- Building new components from scratch
- You have multiple Observable properties to display
- You need cleaner, more readable templates
- You want better TypeScript type inference
