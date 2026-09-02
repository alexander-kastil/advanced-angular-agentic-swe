Examine the conditional fields in `signal-form-conditional.component.ts`:

```typescript
fields = form(this.model, (s) => {
  // email is hidden when subscribe is false
  hidden(s.email, ({ valueOf }) => !valueOf(s.subscribe));
  // promoCode is disabled when subscribe is false
  disabled(s.promoCode, ({ valueOf }) => !valueOf(s.subscribe));
  // username is always readonly
  readonly(s.username);
});
```

Use `hidden()`, `disabled()`, `readonly()` with `valueOf()` for reactive field state.
