# Query Parameters with Signals

## Overview

Query parameters drive reactive state via signals. Changes to signals automatically sync to URL search params, and URL updates flow back to signals—creating bidirectional reactivity without manual subscription.

## Basic Pattern

```typescript
import { signal, computed } from "@angular/core";
import { Router } from "@angular/router";
import { inject } from "@angular/core";

@Component({
  selector: "app-search",
  template: `
    <input [value]="searchTerm()" (change)="onSearch($event)" />
    <p>Current: {{ searchTerm() }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SearchComponent {
  private router = inject(Router);

  readonly searchTerm = signal("");

  onSearch(event: any) {
    this.searchTerm.set(event.target.value);
    this.syncToUrl();
  }

  private syncToUrl() {
    this.router.navigate([], {
      queryParams: { q: this.searchTerm() || undefined },
      queryParamsHandling: "merge",
    });
  }
}
```

## Reading Initial Query State

Initialize signals from route query parameters:

```typescript
@Component({...})
export class FilterComponent {
  private route = inject(ActivatedRoute);

  readonly filterType = signal('all');
  readonly sortBy = signal('date');

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.filterType.set(params['type'] || 'all');
      this.sortBy.set(params['sort'] || 'date');
    });
  }
}
```

## Computed Filter State

Derive filter state from signals:

```typescript
readonly filters = computed(() => ({
  type: this.type(),
  sort: this.sortBy(),
  limit: this.pageSize(),
}));

readonly filterUrl = computed(() => {
  const f = this.filters();
  return `/items?type=${f.type}&sort=${f.sort}&limit=${f.limit}`;
});
```

## Multi-Parameter Sync

Update multiple query params reactively:

```typescript
readonly page = signal(1);
readonly pageSize = signal(10);

updateParams() {
  this.router.navigate([], {
    queryParams: {
      page: this.page(),
      pageSize: this.pageSize(),
      search: this.searchTerm() || undefined
    },
    queryParamsHandling: 'merge'
  });
}
```

## Resetting State

Clear query parameters and reset signals:

```typescript
resetFilters() {
  this.searchTerm.set('');
  this.filterType.set('all');
  this.page.set(1);

  this.router.navigate([], {
    queryParams: {}, // Clears all query params
  });
}
```

## Key Benefits

- **Bidirectional sync** — Signals ↔ URL search params
- **Browser history** — Back/forward buttons work naturally
- **Shareable URLs** — State persisted in URL
- **Bookmarkable** — Users can share filtered views
- **No RxJS** — Pure signal-based reactivity

## Common Patterns

### Pattern 1: Initialize from Route

```typescript
effect(() => {
  // Subscribe to query changes
  this.route.queryParamMap.subscribe((params) => {
    this.searchTerm.set(params.get("q") || "");
  });
});
```

### Pattern 2: Debounce URL Updates

```typescript
private updateParams$ = debounceTime(300);

onSearch(term: string) {
  this.searchTerm.set(term);
  // Defer URL sync to avoid too many navigations
  this.syncToUrl();
}
```
