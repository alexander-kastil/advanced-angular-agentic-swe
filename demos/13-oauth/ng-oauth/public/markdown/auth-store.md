# Auth State in a SignalStore

The interceptor, the guard and the shell all ask the same questions: is someone signed in, who,
and with which token. Answer them from one NgRx SignalStore whose only real state is the token.

## Store the token, derive the rest

```typescript
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState({ token: null as string | null, returnUrl: null as string | null, now: Date.now() }),
  withComputed(({ token, now }) => {
    const claims = computed(() => (token() ? decodeJwt(token()!).payload : null));
    const expiresAt = computed(() => Number(claims()?.['exp'] ?? 0) * 1000);
    return {
      claims,
      userName: computed(() => String(claims()?.['name'] ?? '')),
      secondsLeft: computed(() => Math.max(0, Math.round((expiresAt() - now()) / 1000))),
      isAuthenticated: computed(() => expiresAt() > now())
    };
  }),
  withMethods((store) => ({
    login(name: string, lifetimeSeconds = 300) { /* mint and patchState */ },
    logout() { patchState(store, { token: null }); },
    tick() { patchState(store, { now: Date.now() }); }
  })),
  withHooks({
    onInit(store) {
      const timer = setInterval(() => store.tick(), 1000);
      return () => clearInterval(timer);
    }
  })
);
```

A stored `isAuthenticated: boolean` drifts: nobody flips it when `exp` passes. As a `computed()` over
the token and a clock signal it cannot be wrong, and every consumer re-evaluates on its own.

## From facade to store

The previous version of this module used NgRx actions, a reducer, selectors and an `AuthFacade`
service in front of them. The SignalStore collapses that into one file: `withState` is the reducer's
state, `withComputed` the selectors, `withMethods` the facade. Components inject `AuthStore` and
read signals; no `async` pipe, no `subscribe()`.

## Run the demo

1. Open **Auth State in a SignalStore**, keep the lifetime at 30 seconds and click **Sign in**.
2. Watch `secondsLeft()` count down and `claims()` show the minted payload.
3. Wait until it reaches 0. `isAuthenticated()` turns `false` without any code calling
   `logout()`.

Expected result: the status line turns from blue to red at zero and the token stays in state, so
the next demo can tell "expired" apart from "never signed in".

## Where the token should live

This store keeps the token in memory, so a reload signs the user out. MSAL caches in
`sessionStorage` by default and in `localStorage` when configured, which survives reloads but is
readable by any script that runs on your origin. A strict Content Security Policy is what protects
browser storage, not the choice between the two.
