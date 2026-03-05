- One of the benefits of declarative reactivity is that it allows us to consume the data stream directly and assign it to props or vars of type Observable<T>.
- This means that we don't have to manually subscribe or unsubscribe to the data stream, which can be error-prone and lead to memory leaks.
- Instead, we can use RxJS operators to manipulate the data stream as needed, such as filtering, mapping, combining, etc.
- The component rendering is then bound to the props or vars that hold the observable values, and often uses the async pipe to handle

```typescript
skills$ = this.service.getSkills().pipe(
  combineLatestWith(this.filter$.valueChanges.pipe(startWith(""))),
  map(([skills, filter]) => {
    return filter == "" ? skills : skills.filter((skill: Skill) => skill.name.includes(filter));
  }),
);
```

---

## 2026 Context

RxJS remains important for library integration and reactive patterns. Use Signals for application state (Module 03), HttpResource for HTTP requests, and SignalStore for complex state (Module 05).
