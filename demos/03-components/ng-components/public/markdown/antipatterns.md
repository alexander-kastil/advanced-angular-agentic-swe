# Antipatterns - What NOT to Do

## Overview

This guide highlights common **outdated patterns** that were necessary before resource() and signals, but **should NOT be used in modern Angular (v20+)**. We compare them with modern alternatives to show why they're problematic.

## ❌ Antipattern 1: Manual Observable + .subscribe()

**Problem:**

```typescript
// ❌ OLD - Manual subscription management
export class PetDetailComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();

  protected pet = signal<Pet | undefined>(undefined);
  protected isLoading = signal(false);
  protected error = signal<string | undefined>(undefined);

  ngOnInit() {
    this.loadPet(1);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected loadPet(id: number) {
    this.isLoading.set(true);
    this.error.set(undefined);

    this.http
      .get<Pet>(`/api/pets/${id}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.pet.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err.message);
          this.isLoading.set(false);
        },
      });
  }
}
```

**Why it's bad:**

- ❌ Must manually unsubscribe to prevent memory leaks
- ❌ 3+ signals to manually coordinate (pet, isLoading, error)
- ❌ Requires lifecycle hooks (OnInit, OnDestroy)
- ❌ Verbose and error-prone boilerplate
- ❌ No automatic reactivity when IDs change

**✅ Modern Alternative:**

```typescript
// ✅ NEW - Signal-based resource
export class PetDetailComponent {
  private http = inject(HttpClient);
  protected petId = signal(1);

  protected petResource = resource({
    request: () => ({ id: this.petId() }),
    loader: async ({ request }) => {
      return await firstValueFrom(this.http.get<Pet>(`/api/pets/${request.id}`));
    },
  });

  protected loadNext() {
    this.petId.update((id) => id + 1); // Auto-refetches!
  }
}
```

**Benefits:**

- ✅ Zero boilerplate - resource handles everything
- ✅ No manual subscription management
- ✅ Automatic reactivity - changing `petId()` triggers refetch
- ✅ Built-in loading & error states
- ✅ No lifecycle hooks needed

---

## ❌ Antipattern 2: BehaviorSubject for Local State

**Problem:**

```typescript
// ❌ OLD - BehaviorSubject for state management
export class DataComponent {
  private store$ = new BehaviorSubject<Data[]>([]);
  data$ = this.store$.asObservable();

  constructor() {
    this.loadData();
  }

  loadData() {
    this.http.get<Data[]>("/api/data").subscribe((data) => this.store$.next(data));
  }
}

// In template: {{ data$ | async }}
```

**Why it's bad:**

- ❌ RxJS learning curve unnecessary for simple state
- ❌ Requires async pipe in templates
- ❌ BehaviorSubject is overly complex for local state
- ❌ Manual subscription management
- ❌ Less performant than signals

**✅ Modern Alternative:**

```typescript
// ✅ NEW - Signals for local state
export class DataComponent {
  private http = inject(HttpClient);
  protected data = signal<Data[]>([]);

  protected dataResource = resource({
    loader: async () => {
      return await firstValueFrom(this.http.get<Data[]>("/api/data"));
    },
  });
}

// In template: @for (item of dataResource.value(); track item.id)
```

---

## ❌ Antipattern 3: Constructor Injection

**Problem:**

```typescript
// ❌ OLD - Constructor parameters
export class MyComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
  ) {}
}
```

**Why it's bad:**

- ❌ Harder to test - requires constructor parameters in tests
- ❌ Less tree-shakeable
- ❌ Less flexible for optional dependencies
- ❌ More boilerplate in subclasses

**✅ Modern Alternative:**

```typescript
// ✅ NEW - inject() function
export class MyComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private userService = inject(UserService);
}
```

---

## ❌ Antipattern 4: @Input() / @Output() Decorators

**Problem:**

```typescript
// ❌ OLD - Class decorators for component I/O
@Component({
  selector: "app-user-card",
  template: "{{ user.name }}",
})
export class UserCardComponent {
  @Input() user: User;
  @Output() selected = new EventEmitter<User>();

  onSelect() {
    this.selected.emit(this.user);
  }
}

// Parent usage: [user]="user" (selected)="onSelect($event)"
```

**Why it's bad:**

- ❌ Type safety issues - can be undefined until set
- ❌ More verbose than signals
- ❌ EventEmitter is overkill for simple outputs
- ❌ No built-in validation
- ❌ Multiple patterns in codebase (some use decorators, some use signals)

**✅ Modern Alternative:**

```typescript
// ✅ NEW - Signal inputs & outputs
@Component({
  selector: "app-user-card",
  template: "{{ user().name }}",
})
export class UserCardComponent {
  readonly user = input.required<User>();
  readonly selected = output<User>();

  protected onSelect() {
    this.selected.emit(this.user());
  }
}

// Parent usage: [user]="user" (selected)="onSelect($event)"
```

---

## ❌ Antipattern 5: *ngIf / *ngFor / \*ngSwitch

**Problem:**

```html
<!-- ❌ OLD - Structural directives -->
<div *ngIf="isVisible">
  <p>Visible</p>
</div>

<div *ngFor="let item of items; trackBy: trackById">{{ item.name }}</div>

<div [ngSwitch]="type">
  <div *ngSwitchCase="'a'">Type A</div>
  <div *ngSwitchDefault>Other</div>
</div>
```

**Why it's bad:**

- ❌ Asterisk syntax confusing for newcomers
- ❌ Less performant than control flow blocks
- ❌ trackBy is optional and often forgotten
- ❌ Requires CommonModule import
- ❌ Angular directive soup - looks like template syntax but isn't

**✅ Modern Alternative:**

```html
<!-- ✅ NEW - Control flow blocks -->
@if (isVisible) {
<p>Visible</p>
} @for (item of items; track item.id) { {{ item.name }} } @switch (type) { @case ('a') {
<div>Type A</div>
} @default {
<div>Other</div>
} }
```

**Benefits:**

- ✅ Cleaner, more readable syntax
- ✅ track is required (prevents bugs)
- ✅ No CommonModule needed
- ✅ Better performance
- ✅ Native Angular syntax

---

## ❌ Antipattern 6: ChangeDetectionStrategy.Default

**Problem:**

```typescript
// ❌ OLD - Default change detection (zone.js)
@Component({
  selector: "app-user-list",
  template: "...",
  // NO changeDetection specified = Default (OnPush not used)
})
export class UserListComponent {
  // Angular checks this component on EVERY event (mouse, keyboard, timer, HTTP, etc.)
  // VERY wasteful!
}
```

**Why it's bad:**

- ❌ Angular runs change detection on every event
- ❌ Massive performance hit in large applications
- ❌ Inefficient for modern, signal-based architecture
- ❌ Incompatible with zoneless applications

**✅ Modern Alternative:**

```typescript
// ✅ NEW - OnPush change detection
@Component({
  selector: "app-user-list",
  template: "...",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  // Change detection ONLY:
  // 1. When @Input changes
  // 2. When @Output fires
  // 3. When event handler runs
  // 4. When signal changes (automatically)
}
```

---

## ❌ Antipattern 7: CommonModule Imports

**Problem:**

```typescript
// ❌ OLD - CommonModule required for directives
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-list",
  imports: [CommonModule], // Must import to use ngIf, ngFor, etc.
  template: `
    <div *ngIf="items">
      <p *ngFor="let item of items">{{ item }}</p>
    </div>
  `,
})
export class ListComponent {
  items = ["a", "b"];
}
```

**Why it's bad:**

- ❌ Extra dependency just for directives
- ❌ Not tree-shakeable
- ❌ CommonModule is massive (~100KB)
- ❌ Unnecessary with modern control flow blocks

**✅ Modern Alternative:**

```typescript
// ✅ NEW - No CommonModule needed
@Component({
  selector: "app-list",
  // imports: [CommonModule] <-- Remove!
  template: `
    @if (items) {
      @for (item of items; track item) {
        <p>{{ item }}</p>
      }
    }
  `,
})
export class ListComponent {
  protected items = signal(["a", "b"]);
}
```

---

## Migration Checklist

- [ ] Replace `.subscribe()` + manual state with `resource()`
- [ ] Replace `BehaviorSubject` + `.asObservable()` with `signal()`
- [ ] Replace `@Input()` / `@Output()` decorators with `input()` / `output()`
- [ ] Replace `*ngIf` / `*ngFor` / `*ngSwitch` with `@if` / `@for` / `@switch`
- [ ] Replace constructor injection with `inject()` function
- [ ] Add `ChangeDetectionStrategy.OnPush` to all components
- [ ] Remove CommonModule imports
- [ ] Remove OnInit/OnDestroy lifecycle hooks where possible

---

## References

- [Angular Best Practices Guide](https://angular.dev)
- [Signals API](https://angular.dev/guide/signals)
- [Resource API](https://angular.dev/guide/signals/resource)
- [Control Flow Blocks](https://angular.dev/guide/control-flow)
