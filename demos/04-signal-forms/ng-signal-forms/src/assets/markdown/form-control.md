Examine the signal form control in `signal-form-control.component.ts`:

```typescript
model = signal({ name: "", postal: "3544", city: "Idolsberg" });

fields = form(this.model, (s) => {
  required(s.name, { message: "Name is required" });
  minLength(s.name, 3, { message: "Min 3 characters" });
  maxLength(s.city, 15, { message: "Max 15 characters" });
});
```
