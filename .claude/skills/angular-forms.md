# Angular Signal Forms (v21+, experimental)

For production-stable Reactive Forms, use `FormGroup`/`FormControl` from `@angular/forms`.

## Signal Forms Setup

```typescript
import { form, FormField, required, email, min, max, minLength, maxLength, pattern, validate, submit } from '@angular/forms/signals';

interface LoginData { email: string; password: string; }

@Component({
  imports: [FormField],
  template: `
    <form (submit)="onSubmit($event)">
      <input type="email" [formField]="loginForm.email" />
      @if (loginForm.email().touched() && loginForm.email().invalid()) {
        <p>{{ loginForm.email().errors()[0].message }}</p>
      }
      <input type="password" [formField]="loginForm.password" />
      <button type="submit" [disabled]="loginForm().invalid()">Login</button>
    </form>
  `,
})
export class Login {
  loginModel = signal<LoginData>({ email: '', password: '' });

  loginForm = form(this.loginModel, (s) => {
    required(s.email, { message: 'Email is required' });
    email(s.email, { message: 'Invalid email' });
    required(s.password, { message: 'Password is required' });
    minLength(s.password, 8, { message: 'Min 8 characters' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.loginForm, async () => {
      await this.authService.login(this.loginModel());
    });
  }
}
```

## Field State Signals

```typescript
field.valid()      // passes all validation
field.invalid()    // has errors
field.errors()     // array of { kind, message }
field.pending()    // async validation in progress
field.touched()    // after focus+blur
field.dirty()      // after modification
field.disabled()
field.hidden()
field.value()      // current value
```

## Validators

```typescript
required(s.name);
email(s.email);
min(s.age, 18);  max(s.age, 120);
minLength(s.password, 8);  maxLength(s.bio, 500);
pattern(s.phone, /^\d{3}-\d{3}-\d{4}$/);

// Conditional
required(s.promoCode, { when: ({ valueOf }) => valueOf(s.applyDiscount) });

// Custom
validate(s.username, ({ value }) =>
  value().includes(' ') ? { kind: 'noSpaces', message: 'No spaces allowed' } : null
);

// Cross-field
validate(s.confirmPassword, ({ value, valueOf }) =>
  value() !== valueOf(s.password) ? { kind: 'mismatch', message: 'Passwords do not match' } : null
);

// Async HTTP
validateHttp(s.username, {
  request: ({ value }) => `/api/check-username?u=${value()}`,
  onSuccess: (res: { taken: boolean }) =>
    res.taken ? { kind: 'taken', message: 'Username taken' } : null,
});
```

## Conditional Fields

```typescript
hidden(s.publicUrl, ({ valueOf }) => !valueOf(s.isPublic));
disabled(s.couponCode, ({ valueOf }) => valueOf(s.total) < 50);
readonly(s.username); // always readonly
```

## Dynamic Arrays

```typescript
orderForm = form(this.orderModel, (s) => {
  applyEach(s.items, (item) => {
    required(item.product);
    min(item.quantity, 1);
  });
});

addItem() {
  this.orderModel.update(m => ({ ...m, items: [...m.items, { product: '', quantity: 1 }] }));
}
removeItem(i: number) {
  this.orderModel.update(m => ({ ...m, items: m.items.filter((_, idx) => idx !== i) }));
}
```

## Reset

```typescript
this.loginForm().reset();           // clear interaction state
this.loginModel.set({ email: '', password: '' }); // clear values
```
