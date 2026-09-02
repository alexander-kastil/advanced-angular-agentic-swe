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
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Signup, SignupService } from './signup.service';

@Component({
  selector: 'app-signal-forms-testing',
  imports: [FormField, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-card appearance="outlined">
      <mat-card-header>
        <mat-card-title>Signal Form under test</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="fields">
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput data-testid="email" [formField]="signupForm.email" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Password</mat-label>
            <input matInput type="password" data-testid="password" [formField]="signupForm.password" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Repeat password</mat-label>
            <input matInput type="password" data-testid="confirm" [formField]="signupForm.confirm" />
          </mat-form-field>

          <mat-form-field>
            <mat-label>Age</mat-label>
            <input matInput type="number" data-testid="age" [formField]="signupForm.age" />
          </mat-form-field>
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
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" data-testid="register" (click)="register()">
          Register
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .fields { display: flex; flex-direction: column; max-width: 22rem; }
    .error { color: #ef5350; }
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
