An agent writes a form spec in seconds. The work that is left to you is deciding whether the spec is worth keeping. This demo pairs a small order form with the spec an agent produced for it, the checklist to review that spec, and a switch that breaks the schema so you can watch the spec catch it.

## The form under test

```typescript
readonly orderForm = form(this.model, (s) => {
  required(s.sku, { message: 'SKU is required' });
  pattern(s.sku, SKU_PATTERN, { message: 'SKU looks like ABC-1234' });
  min(s.quantity, () => (this.mutated() ? 0 : 1), { message: 'Order at least one item' });
  max(s.quantity, 99, { message: 'At most 99 items per order' });
  validate(s.voucher, ({ value }) =>
    value() !== '' && value().length < 5 ? { kind: 'voucher', message: 'Vouchers have 5 characters' } : null,
  );
});
```

The `mutated()` signal inside `min()` exists only so the page can break its own schema on demand. Production code would not carry it.

## What a good Signal Forms spec looks like

Signal Forms needs no `fixture.detectChanges()` to observe validity: setting a value updates the computed field state synchronously. That makes a spec unusually direct.

```typescript
it('rejects quantity 0 and accepts quantity 1', () => {
  component.orderForm.quantity().value.set(0);
  expect(component.orderForm.quantity().valid()).toBe(false);

  component.orderForm.quantity().value.set(1);
  expect(component.orderForm.quantity().valid()).toBe(true);
});

it('rejects a lowercase SKU with the pattern error', () => {
  component.orderForm.sku().value.set('abc-1234');
  expect(component.orderForm.sku().getError('pattern')).toBeDefined();
});
```

Note what is *not* there: no DOM queries, no `detectChanges`, no snapshot. The unit under test is the schema, and the schema is reachable through field state.

## The review checklist

Apply it to the spec file, not to the summary the agent wrote about the spec file.

1. Every validator in the schema has at least one *failing* case, not only a passing one.
2. Boundaries are asserted on both sides: 0 and 1, 99 and 100.
3. Assertions read field state (`valid()`, `errors()`, `getError()`), never rendered text.
4. Error identity is asserted by `kind` or message, not just "is invalid".
5. Cross-field rules assert both directions of the dependency.
6. No test asserts a rule the schema does not state. An invented assertion passes today and blocks a legitimate change tomorrow.
7. The count of tests is not the metric. Six assertions over six validators beat twenty over one.

The failure mode this list is aimed at: an agent that asserts only the happy path. Such a spec is green, fast, and worthless, and it reads convincingly.

## Prove it with a mutation

Tick **Apply the mutation** to swap `min(quantity, 1)` for `min(quantity, 0)`, then press **Run the Spec Assertions**. The assertion "quantity 0 is rejected" turns red. If a mutation of a real rule leaves every test green, the spec does not test that rule.

The same check exists in the committed spec, so the mutation is verified by `npm test` and not only in the page:

```typescript
it('catches the mutation that lowers the quantity floor to zero', () => {
  component.mutated.set(true);
  component.orderForm.quantity().value.set(0);
  expect(component.orderForm.quantity().valid()).toBe(true);

  component.mutated.set(false);
  expect(component.orderForm.quantity().valid()).toBe(false);
});
```

Run it with `npm test`.
