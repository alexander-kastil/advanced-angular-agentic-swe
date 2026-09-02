## Combining Observables

Combining operators merge multiple streams into one, each with different timing semantics.

## Operators

| Operator          | Emits when...                             | Use case                     |
| ----------------- | ----------------------------------------- | ---------------------------- |
| `merge()`         | Any source emits                          | Parallel event streams       |
| `concat()`        | Previous source completes                 | Sequential HTTP calls        |
| `zip()`           | All sources emit once                     | Pair-up parallel results     |
| `forkJoin()`      | All sources complete                      | Wait for multiple HTTP calls |
| `combineLatest()` | Any source emits (after all emitted once) | Form field combinations      |

## Real-World Examples

### forkJoin() — load page data in parallel

```typescript
forkJoin({
  user: this.userService.getUser(id),
  roles: this.roleService.getRoles(),
  prefs: this.prefService.getPreferences(),
}).subscribe(({ user, roles, prefs }) => {
  // All 3 HTTP calls made in parallel; arrives here when all complete
});
```

### combineLatest() — reactive filter

```typescript
combineLatest([this.items$, this.filter$]).pipe(map(([items, filter]) => items.filter((i) => i.name.includes(filter))));
```

### concat() — sequential operations

```typescript
concat(this.http.post("/api/validate", data), this.http.post("/api/save", data));
// validate completes first, then save starts
```
