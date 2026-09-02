A Signal Form is built from a writable signal holding the model plus a schema function:

```typescript
model = signal({ name: "", postal: "3544", city: "Idolsberg" });

fields = form(this.model, (s) => {
  required(s.name, { message: "Name is required" });
  minLength(s.name, 3, { message: "Min 3 characters" });
  maxLength(s.city, 15, { message: "Max 15 characters" });
});
```

Bind a field to a control with `[formField]`, read and write it imperatively through its state:

```typescript
this.fields.name().value();
this.fields.name().value.set("Soi");
this.fields.name().markAsTouched();
this.fields().reset();
```

Every piece of field state is a signal, so the template consumes it without a single subscription:

```html
<div>Value: {{ fields.name().value() }}</div>
<div>Valid: {{ fields.name().valid() }}</div>
<div>Invalid: {{ fields.name().invalid() }}</div>
<div>Touched: {{ fields.name().touched() }}</div>
<div>Dirty: {{ fields.name().dirty() }}</div>
<div>Pending: {{ fields.name().pending() }}</div>
```

Calling the form itself (`fields()`) gives the same state signals for the whole form.
