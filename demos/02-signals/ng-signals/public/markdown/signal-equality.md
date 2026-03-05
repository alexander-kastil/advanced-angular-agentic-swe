- By default, signals use `Object.is()` to compare values. For primitives this is strict equality; for objects it's reference equality

- Use the `equal` option to define custom comparison logic:

```typescript
user = signal<User>(
  { id: 1, name: "Alice" },
  {
    equal: (a, b) => a.id === b.id && a.name === b.name,
  },
);
```

- Without custom equality, mutating nested object properties creates a new object reference, which **prevents** computed() from re-running:

```typescript
const user = { id: 1, name: "Alice", age: 30 };
user.age = 31; // Mutation: reference unchanged
signal.set(user); // Not detected as change!
```

- Solution: Either immutably spread or use custom `equal()` to detect property changes:

```typescript
// Immutable update (reference changes)
signal.set({ ...user, age: user.age + 1 });

// Or custom equality (detects property changes)
signal = signal(user, {
  equal: (a, b) => JSON.stringify(a) === JSON.stringify(b),
});
```

- **Avoid:** Mutating signal values directly — always `.set()` or `.update()` with new values
