# Angular Signals (v21+)

## Core APIs

```typescript
// Writable state
const count = signal(0);
count();              // read
count.set(5);         // set
count.update(c => c + 1); // update
const user = signal<User | null>(null);

// Derived state (auto-updates when deps change)
const fullName = computed(() => `${firstName()} ${lastName()}`);
const filteredItems = computed(() =>
  items().filter(i => i.name.toLowerCase().includes(filter().toLowerCase()))
);

// Linked state (resets when source changes)
const options = signal(['A', 'B', 'C']);
const selected = linkedSignal(() => options()[0]);
// With previous value preservation:
const selectedItem = linkedSignal<Item[], Item | null>({
  source: () => items(),
  computation: (newItems, previous) => {
    const prev = previous?.value;
    return prev && newItems.some(i => i.id === prev.id) ? prev : newItems[0] ?? null;
  },
});

// Side effects
effect(() => { console.log('changed:', this.query()); });
effect((onCleanup) => {
  const timer = setInterval(() => {}, 1000);
  onCleanup(() => clearInterval(timer));
});

// Untracked reads
const result = computed(() => a() + untracked(() => b()));

// Custom equality
const user = signal<User>({ id: 1, name: 'Alice' }, { equal: (a, b) => a.id === b.id });
```

## Service Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  private _loading = signal(false);
  readonly user = this._user.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  private http = inject(HttpClient);

  async login(credentials: Credentials) {
    this._loading.set(true);
    try {
      const user = await firstValueFrom(this.http.post<User>('/api/login', credentials));
      this._user.set(user);
    } finally {
      this._loading.set(false);
    }
  }
  logout() { this._user.set(null); }
}
```

## RxJS Interop

```typescript
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

// Observable → Signal
counter = toSignal(interval(1000), { initialValue: 0 });
users = toSignal(this.http.get<User[]>('/api/users')); // undefined until loaded
currentUser = toSignal(this.user$, { requireSync: true }); // BehaviorSubject

// Signal → Observable (for RxJS operators)
results = toSignal(
  toObservable(this.query).pipe(
    debounceTime(300),
    switchMap(q => this.http.get<Result[]>(`/api/search?q=${q}`))
  ),
  { initialValue: [] }
);
```
