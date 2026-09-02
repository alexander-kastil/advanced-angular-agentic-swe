import { Component, inject, signal } from '@angular/core';
import {
  email as emailRule,
  form,
  FormField,
  min,
  minLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { Signup, SignupService } from './signup.service';

@Component({
  selector: 'app-signal-forms-testing',
  imports: [FormField],
  template: `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Signal Form under test</h2>
      </div>
      <div class="card-content">
        <div class="fields">
          <div class="field">
            <label class="label" for="signup-email">Email</label>
            <input id="signup-email" class="input" data-testid="email" [formField]="signupForm.email" />
          </div>

          <div class="field">
            <label class="label" for="signup-password">Password</label>
            <input
              id="signup-password"
              class="input"
              type="password"
              data-testid="password"
              [formField]="signupForm.password"
            />
          </div>

          <div class="field">
            <label class="label" for="signup-confirm">Repeat password</label>
            <input
              id="signup-confirm"
              class="input"
              type="password"
              data-testid="confirm"
              [formField]="signupForm.confirm"
            />
          </div>

          <div class="field">
            <label class="label" for="signup-age">Age</label>
            <input
              id="signup-age"
              class="input"
              type="number"
              data-testid="age"
              [formField]="signupForm.age"
            />
          </div>
        </div>

        @for (err of signupForm().errorSummary(); track err.kind + err.message) {
          <div class="error" data-testid="error">{{ err.message }}</div>
        }

        <div class="state" data-testid="state">
          valid: {{ signupForm().valid() }} | touched: {{ signupForm().touched() }} |
          submitting: {{ signupForm().submitting() }} | attempts: {{ attempts() }}
        </div>

        @if (accepted(); as value) {
          <div data-testid="accepted">Registered {{ value.email }}</div>
        }
      </div>
      <div class="card-actions">
        <button type="button" class="btn btn-primary" data-testid="register" (click)="register()">
          Register
        </button>
      </div>
    </div>
  `,
  styles: [`
    .fields { display: flex; flex-direction: column; gap: .75rem; max-width: 22rem; }
    .error { color: #e53935; }
    .state { margin-top: 1rem; font-family: monospace; }
  `],
})
export class SignalFormsTestingComponent {
  private readonly signups = inject(SignupService);

  readonly model = signal<Signup>({ email: '', password: '', confirm: '', age: 0 });
  readonly attempts = signal(0);
  readonly invalidAttempts = signal(0);
  readonly accepted = signal<Signup | null>(null);

  readonly signupForm = form(this.model, (path) => {
    required(path.email, { message: 'Email is required' });
    emailRule(path.email, { message: 'Enter a valid email' });
    required(path.password, { message: 'Password is required' });
    minLength(path.password, 8, { message: 'Password needs 8 characters' });
    validate(path.confirm, ({ value, valueOf }) =>
      value() === valueOf(path.password) ? null : { kind: 'mismatch', message: 'Passwords do not match' }
    );
    min(path.age, 18, { message: 'You must be 18 or older' });
  });

  register(): Promise<boolean> {
    this.attempts.update((n) => n + 1);
    return submit(this.signupForm, {
      action: async () => {
        const result = await this.signups.register(this.model());
        if (result === 'email-taken') {
          return [{ fieldTree: this.signupForm.email, kind: 'server', message: 'Email already registered' }];
        }
        this.accepted.set(this.model());
        return undefined;
      },
      onInvalid: () => this.invalidAttempts.update((n) => n + 1),
    });
  }
}
