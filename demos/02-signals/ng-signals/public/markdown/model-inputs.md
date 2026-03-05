- `model()` implements two-way binding between parent and child — it replaces `@Input()` + `@Output() <name>Change` pairs with a single declaration:

```typescript
// child
expanded = model(false);

toggle() {
  this.expanded.set(!this.expanded());
}
```

```html
<!-- parent -->
<app-detail-card-model [(expanded)]="expandedState" />
```

- The parent reads and writes `expandedState` as a plain `signal(false)` — no `EventEmitter`, no `$event` wiring needed

- Click the circle to toggle the expand state and observe both sides updating
