- Signals track **identity**, not value — mutating an object in-place won't trigger change detection. Always use `update()` with a new reference:

```typescript
person.update(p => ({ ...p, age: p.age + 1 }));          // object
items.update(arr => arr.filter(i => i.id !== id));         // array remove
items.update(arr => arr.map(i => i.id === id ? { ...i, done: true } : i)); // array update
```

- `linkedSignal` creates a **writable** signal whose value resets whenever the source signal changes — use it for default selections, pre-populated form values, or pagination cursors that should reset on filter changes:

```typescript
selected = linkedSignal(() => this.items()[0]);
```

- Provide a custom `equal` function to prevent downstream `computed()` and `effect()` from re-running when the new value is logically the same:

```typescript
count = signal(0, { equal: (a, b) => Math.abs(a - b) < 5 });
```

- Expose signals from services as read-only with `asReadonly()` to prevent consumers from writing to internal state
