## HTTP + RxJS Integration

Combining `HttpClient` with RxJS operators produces efficient, cancellable HTTP streams.

## Key Operators

### switchMap() — cancel stale requests

```typescript
searchTerm$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap((term) => this.http.get<Skill[]>(`/api/skills?q=${term}`)),
);
// New keystroke cancels the previous in-flight request
```

### shareReplay(1) — avoid duplicate HTTP calls

```typescript
private allSkills$ = this.http.get<Skill[]>('/api/skills').pipe(
  shareReplay(1)
);
// Multiple subscribers share one HTTP call — result is cached
```

### catchError() — graceful error recovery

```typescript
this.http.get<Skill[]>("/api/skills").pipe(
  catchError((err) => {
    console.error(err);
    return of([]); // return empty array on error
  }),
);
```

## Full Pattern

```typescript
private cache$ = this.skillsService.getSkills().pipe(shareReplay(1));

filteredSkills$ = this.filterControl.valueChanges.pipe(
  startWith(''),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term =>
    this.cache$.pipe(
      map(skills => skills.filter(s => s.name.includes(term))),
      catchError(() => of([]))
    )
  )
);
```
