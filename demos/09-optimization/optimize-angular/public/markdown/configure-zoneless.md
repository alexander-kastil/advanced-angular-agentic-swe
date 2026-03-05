# Configure Zoneless Change Detection

## Overview

**Zoneless change detection** removes ZoneJS overhead from Angular applications. Instead of using browser event interception, Angular manually schedules change detection through signals and event handlers.

- **Default in Angular v21+**: New projects use zoneless by default
- **Opt-in for existing apps**: Migration available for v20.2+
- **Performance gain**: Reduces change detection cycles and removes ZoneJS microtask queue overhead

## Key Concepts

### ZoneJS vs Zoneless

| Aspect               | ZoneJS                        | Zoneless                           |
| -------------------- | ----------------------------- | ---------------------------------- |
| **Mechanism**        | Monkey-patches browser events | Uses Angular's explicit APIs       |
| **Overhead**         | Higher (microtask tracking)   | Lower (signal-driven only)         |
| **Change Detection** | Event-triggered + manual      | Signal + event listeners           |
| **Setup**            | Automatic (bootstrapModule)   | `provideZonelessChangeDetection()` |
| **Compatibility**    | Legacy code friendly          | Requires OnPush + signals          |

### Zoneless Requirements

Components must use:

1. **OnPush change detection** – Skip unchanged subtrees
2. **Signals for state** – signal(), computed(), effect()
3. **Event handlers** – Direct template bindings
4. **Reactive forms** – Signal-based FormGroup updates

## Enable Zoneless

### Step 1: Provide Zoneless in main.ts

```typescript
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZonelessChangeDetection } from "@angular/core";

import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection()],
});
```

### Step 2: Ensure OnPush on All Components

```typescript
@Component({
  selector: "app-my-component",
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class MyComponent {}
```

### Step 3: Use Signals for State

```typescript
export class MyComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);

  increment() {
    this.count.update((v) => v + 1);
  }
}
```

### Step 4: Template Bindings Trigger Change Detection

```html
<!-- Event handler automatically schedules change detection -->
<button (click)="increment()">Increment</button>
<p>{{ count() }} (doubled: {{ doubled() }})</p>

<!-- Signal reads in templates are tracked -->
@if (count() > 5) {
<p>Count is high!</p>
}
```

## GitHub Copilot Prompt for Migration

Use this prompt to guide your application migration to zoneless:

```markdown
I am migrating an Angular v20+ application to use zoneless change detection.
Please help me with the following:

1. **Audit Components**: Scan all components and identify those NOT using:
   - ChangeDetectionStrategy.OnPush (required for zoneless)
   - signal() / computed() for state management
   - Standalone: true

2. **migration Plan**: For each non-compliant component, provide:
   - Required imports (ChangeDetectionStrategy, signal, computed, inject)
   - Suggested refactoring from @Input/@Output to input()/output()
   - Conversion of BehaviorSubject/Observable to signal()
   - Migration of constructor injection to inject()

3. **Template Modernization**: Convert:
   - \*ngIf → @if
   - \*ngFor → @for
   - \*ngSwitch → @switch
   - ngClass → [class]
   - ngStyle → [style]
   - async pipe to direct signal calls

4. **Enable Zoneless**:
   - Verify provideZonelessChangeDetection() is in main.ts
   - Ensure no NgZone.run() calls (not compatible with zoneless)
   - Check for third-party library compatibility

5. **Testing**: Add TestBed provider for zoneless:
   - TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })

6. **Validation Checklist**:
   - [ ] All components use OnPush change detection
   - [ ] All components are standalone
   - [ ] State is signal-based, not Observable-based
   - [ ] No @Input/@Output decorators; using input()/output()
   - [ ] No constructor parameter injection; using inject()
   - [ ] No NgZone.run() or zone-specific code
   - [ ] Templates use @if/@for/@switch
   - [ ] HTTP calls use httpResource() or resource()
   - [ ] provideZonelessChangeDetection() in main.ts

Please analyze [component path] and provide step-by-step refactoring instructions.
```

## Step-by-Step Example

### Before (Zone-based)

```typescript
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-user-list",
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngFor="let user of users$ | async">{{ user.name }} - <button (click)="selectUser(user)">Select</button></div>
  `,
})
export class UserListComponent implements OnInit {
  @Input() title: string = "";
  @Output() selected = new EventEmitter<any>();

  users$ = new BehaviorSubject([]);
  loading = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.http.get("/api/users").subscribe((users) => {
      this.users$.next(users);
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  selectUser(user: any) {
    this.selected.emit(user);
  }
}
```

### After (Zoneless)

```typescript
import { Component, ChangeDetectionStrategy, inject, input, output, resource } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-user-list",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    @if (users.isLoading()) {
      <div>Loading...</div>
    } @else {
      @for (user of users.value(); track user.id) {
        <div>{{ user.name }} - <button (click)="selectUser(user)">Select</button></div>
      }
    }
  `,
})
export class UserListComponent {
  private http = inject(HttpClient);

  title = input("");
  selected = output<any>();

  users = resource({
    request: () => ({ url: "/api/users" }),
    loader: ({ request }) => this.http.get<any[]>(request.url),
  });

  selectUser(user: any) {
    this.selected.emit(user);
  }
}
```

## Common Pitfalls

### ❌ Using NgZone

```typescript
// NOT compatible with zoneless!
constructor(private ngZone: NgZone) {
  this.ngZone.run(() => { /* ... */ });
}
```

### ✅ Use Signals Instead

```typescript
// Signals automatically trigger change detection
increment() {
  this.count.update(v => v + 1);
}
```

### ❌ Subscribe in Component

```typescript
ngOnInit() {
  this.service.data$.subscribe(data => this.data = data);
}
```

### ✅ Use Resource or ToSignal

```typescript
data = resource(() => this.service.getData());
// or
data = toSignal(this.service.data$);
```

### ❌ Default Change Detection

```typescript
@Component({
  selector: 'app-test',
  // Missing OnPush!
})
```

### ✅ Always Use OnPush

```typescript
@Component({
  selector: 'app-test',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

## Testing with Zoneless

```typescript
import { TestBed } from "@angular/core/testing";
import { provideZonelessChangeDetection } from "@angular/core";

describe("MyComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  });

  it("updates when signal changes", () => {
    const fixture = TestBed.createComponent(MyComponent);
    const component = fixture.componentInstance;

    component.count.set(5);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain("5");
  });
});
```

## References

- [Angular Zoneless Guide](https://angular.dev/guide/zoneless)
- [provideZonelessChangeDetection API](https://angular.dev/api/core/provideZonelessChangeDetection)
- [Signals Documentation](https://angular.dev/guide/signals)
- [OnPush Change Detection](https://angular.dev/guide/angular-compiler-options#onpush)
- [Angular Performance Guide](https://angular.dev/best-practices/performance)
