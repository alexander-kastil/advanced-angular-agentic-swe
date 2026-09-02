- Examine how route bindings work in Angular 16 using the new option used in the router module:

```typescript
@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
```

- Examine `customer-edit.component.ts`:

```typescript
export class CustomerEditComponent {
  @Input() id?: number;
  @Input() readonly?: boolean;
  store = inject(Store<CustomersState>) as Store<CustomersState>;
  customer = this.store.select(getCustomers).pipe(
    mergeMap(
      (customers) => customers.filter(c => c.id == this.id)
    ));
}
```
