- Effects run whenever their signal dependencies change. To run an effect **only once**, use conditional logic:

```typescript
constructor() {
  effect(() => {
    if (this.data() === undefined) {
      this.loadData(); // Only runs when data is undefined
    }
  });
}
```

- Or manually destroy the effect after it runs:

```typescript
const eff = effect(() => {
  console.log("Initialize once");
  eff.destroy(); // Stop it permanently
});
```

- Common one-shot scenarios:
  - Component initialization (fetch initial data)
  - Setup (configure analytics, third-party libraries)
  - One-time migrations or data transformations

- **Careful:** Cannot destroy an effect from within itself. Store the effect reference first:

```typescript
initEffect: any;

constructor() {
  this.initEffect = effect(() => {
    this.initializeComponent();
    this.initEffect.destroy();
  });
}
```

- **Alternative:** Use a flag to ensure code runs once:

```typescript
initialized = signal(false);

effect(() => {
  if (!this.initialized()) {
    this.loadData();
    this.initialized.set(true);
  }
});
```

- **Takeaway:** Effects are re-run on dependency changes — use conditionals or manual destroy() for one-shot behavior
