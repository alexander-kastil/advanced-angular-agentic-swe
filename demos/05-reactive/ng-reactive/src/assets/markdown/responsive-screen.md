- BreakpointObserver provides a responsive API that allows calling code to determine if it is matching a specific media query.
- This is used in `sidenav.service.ts` to change the sidenav mode

  ```typescript
  this.breakpointObserver.observe(["(min-width: 600px)"]).subscribe((state: BreakpointState) => {
    this.matches = state.matches ? false : true;
  });
  ```

---

## 2026 Context

RxJS remains important for library integration and reactive patterns. Use Signals for application state (Module 03), HttpResource for HTTP requests, and SignalStore for complex state (Module 05).
