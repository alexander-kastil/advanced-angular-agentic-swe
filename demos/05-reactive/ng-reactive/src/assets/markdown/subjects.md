- Compare the different outputs in the console of the following code block when using the different Subject types:

  ```javascript
  this.sub$.next(0);
  this.sub$.next(5);
  this.sub$.subscribe((val) => console.log("Subscriber A: ", val));
  this.sub$.subscribe((val) => console.log("Subscriber B: ", val));
  this.sub$.next(10);
  ```

- Add late subscriber and emit new value:

  ```javascript
  this.sub$.subscribe((val) => console.log("Subsciber Late", val));
  this.sub$.next(20);
  ```

- Explain the use of the `BehaviorSubject` in `menu.service.ts`.

---

## 2026 Context

RxJS remains important for library integration and reactive patterns. Use Signals for application state (Module 03), HttpResource for HTTP requests, and SignalStore for complex state (Module 05).
