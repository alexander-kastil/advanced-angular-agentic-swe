# Signal Queries

`viewChild`, `viewChildren`, `contentChild` and `contentChildren` return signals. There is no `AfterViewInit` or `AfterContentInit` hook to wait for, and no `QueryList` to subscribe to: read the signal when you need the result.

## View queries

A view query looks into the component's own template.

```typescript
export class SignalQueriesComponent {
  readonly liters = viewChild.required<ElementRef<HTMLInputElement>>('liters');
  readonly fields = viewChildren<ElementRef<HTMLInputElement>>('field');
  readonly badge = viewChild.required(StatusBadgeComponent);

  readonly fieldCount = computed(() => this.fields().length);
}
```

```html
<input #liters #field type="number" />
<input #cost #field type="number" readonly />
<app-status-badge />
```

- `viewChild(locator)` returns `Signal<T | undefined>`.
- `viewChild.required(locator)` returns `Signal<T>` and throws if nothing matches.
- `viewChildren(locator)` returns `Signal<T[]>`, so `computed()` over it just works.
- A component or directive type as the locator gives you the instance; a template reference variable gives you the `ElementRef` unless you pass `{ read: ... }`.

## Content queries

A content query looks into what the parent projected through `ng-content`.

```typescript
export class QueryPanelComponent {
  readonly headline = contentChild<ElementRef<HTMLElement>>('headline');
  readonly entries = contentChildren<ElementRef<HTMLElement>>('entry');

  readonly entryCount = computed(() => this.entries().length);
}
```

```html
<app-query-panel>
  <h3 #headline>Projected headline</h3>
  <p #entry>Entry one</p>
  <p #entry>Entry two</p>
</app-query-panel>
```

Content queries are shallow by default. Pass `{ descendants: true }` to reach nested nodes.

## Reading a different token

```typescript
readonly host = viewChild.required('host', { read: ViewContainerRef });
```

## What this replaces

| Old | New |
| --- | --- |
| `@ViewChild('x') x!: ElementRef;` | `readonly x = viewChild.required<ElementRef>('x');` |
| `@ViewChildren(Item) items!: QueryList<Item>;` | `readonly items = viewChildren(Item);` |
| `@ContentChild('x') x!: ElementRef;` | `readonly x = contentChild<ElementRef>('x');` |
| `ngAfterViewInit()` to read the query | read the signal wherever you need it |
| `items.changes.subscribe(...)` | `computed(() => items())` |
