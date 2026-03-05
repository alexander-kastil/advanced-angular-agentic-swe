Examine the signal form control events in `signal-form-control-events.component.ts`:

```typescript
model = signal({ name: "" });

fields = form(this.model, (s) => {
  required(s.name, { message: "Name is required" });
  minLength(s.name, 3, { message: "Min 3 characters" });
});
```

And in the template, you can access the state directly via signals:

```html
<div>Value: {{ fields.name().value() }}</div>
<div>Valid: {{ fields.name().valid() }}</div>
<div>Invalid: {{ fields.name().invalid() }}</div>
<div>Touched: {{ fields.name().touched() }}</div>
<div>Dirty: {{ fields.name().dirty() }}</div>
<div>Pending: {{ fields.name().pending() }}</div>
```
