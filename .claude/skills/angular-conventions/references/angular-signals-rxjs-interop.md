# Signal and Observable Interop

## RxJS Interop

### toSignal() - Observable to Signal

```typescript
import { toSignal } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({...})
export class Timer {
  private http = inject(HttpClient);
  
  // From observable - requires initial value or allowUndefined
  counter = toSignal(interval(1000), { initialValue: 0 });
  
  // From HTTP - undefined until loaded
  users = toSignal(this.http.get<User[]>('/api/users'));
  
  // With requireSync for synchronous observables (BehaviorSubject)
  private user$ = new BehaviorSubject<User | null>(null);
  currentUser = toSignal(this.user$, { requireSync: true });
}
```

### toObservable() - Signal to Observable

```typescript
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap, debounceTime } from 'rxjs';

@Component({...})
export class Search {
  query = signal('');
  
  private http = inject(HttpClient);
  
  // Convert signal to observable for RxJS operators
  results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      switchMap(q => this.http.get<Result[]>(`/api/search?q=${q}`))
    ),
    { initialValue: [] }
  );
}
```


## `toObservable()` inside an `rxMethod` projection throws NG0602 for whoever calls the method

`toObservable` creates an `effect()` at the moment it runs. When it is written inside a `switchMap`
projection of an NgRx `rxMethod`, that moment is the caller's synchronous stack, because `rxMethod`
emits synchronously. Any call from a reactive context (a constructor `effect()`, a `computed`, a spec
that calls the method inside a TestBed effect) then creates an effect inside that context and Angular
throws `NG0602: effect() cannot be called from within a reactive context`. In Vitest it surfaces as
an unhandled error on whatever spec mounts the calling component, with a stack ending in the store
feature, so it reads as a spec bug when it is a feature bug.

```typescript
loadMarketData: rxMethod<void>(pipe(
  switchMap(() => untracked(() => toObservable(s.appConfig, { injector })).pipe(
    filter(Boolean),
    take(1),
    switchMap(cfg => api.load(cfg)),
  )),
)),
```

`untracked` detaches the effect creation from the caller's context; behaviour is identical because
the store signal was never meant to be tracked by the caller. Building the observable once outside
the projection works too. Prove the fix with a spec that calls the method from inside `effect()`
under `TestBed.runInInjectionContext` and passes with zero unhandled errors.

Back to the index: [angular-signals](angular-signals.md)
