## Overview

This demo drives the `customers` REST collection through `customersStore`. It is the standard SignalStore data shape: `withState` for the payload plus loading flag, `withMethods` for the operations, `rxMethod` for the async plumbing, and `withHooks` to kick off the initial load.

Examine `customers.store.ts` and `customers.service.ts`.

## rxMethod for Async Work

`rxMethod` turns an RxJS pipeline into a callable store method. It accepts a value, a signal, or an observable:

```typescript
addCustomer: rxMethod<Customer>(
  pipe(
    switchMap((customer) => {
      patchState(store, { loading: true });
      return service.addCustomer(customer).pipe(
        tapResponse({
          next: (created) => patchState(store, { customers: [...store.customers(), created] }),
          error: logError,
          finalize: () => patchState(store, { loading: false }),
        })
      );
    })
  )
),
```

`tapResponse` from `@ngrx/operators` splits the success, error and completion branches so a failing request can never tear down the subscription.

## Update and Delete

Both mutate the array immutably and let the computed members recalculate:

```typescript
next: (saved) => patchState(store, {
  customers: store.customers().map((c) => (c.id === saved.id ? saved : c)),
}),
```

```typescript
next: () => patchState(store, {
  customers: store.customers().filter((c) => c.id !== customer.id),
}),
```

## Derived Views

```typescript
withComputed((store) => ({
  count: computed(() => store.customers().length),
  nextId: computed(() => store.customers().reduce((max, c) => (c.id > max ? c.id : max), 0) + 1),
  filtered: computed(() => {
    const term = store.filter().toLowerCase();
    return term ? store.customers().filter((c) => c.name.toLowerCase().includes(term)) : store.customers();
  }),
}))
```

The search box writes `filter` through `setFilter()`; the list renders `filtered()` and never filters in the template.

## Initial Load

```typescript
withHooks({
  onInit({ fetchCustomers }) {
    fetchCustomers();
  },
})
```

> The demo talks to `http://localhost:3000/customers`. Run `json-server` against the app's `db.json` to see live data.
