NgRx provides a selectSignal-method to allow fetching NgRx State as Signals which is available for classic NgRx as well as NgRx Component Store

```typescript
store = inject(Store) as Store<CustomersState>;
customers = this.store.selectSignal(getCustomers);
```

>Note: Make sure you have loaded Customers in advance by visiting the Customers-Route