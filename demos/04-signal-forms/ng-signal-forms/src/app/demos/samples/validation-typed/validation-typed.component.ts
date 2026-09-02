import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, FormField, minLength, required, submit, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';

@Component({
  selector: 'app-reactive-typed-validation',
  templateUrl: './signal-form-validation-intro.component.html',
  styleUrls: ['./signal-form-validation-intro.component.scss'],
  imports: [
    MarkdownRendererComponent, FormField,
    MatCard, MatCardHeader, MatCardTitle, MatCardContent, ColumnDirective,
    MatFormField, MatLabel, MatInput, MatCardActions, MatButton, JsonPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactiveTypedValidationComponent {
  registerModel = signal({ email: '', password: '', passwordRepeat: '' });

  registerForm = form(this.registerModel, (s) => {
    required(s.email, { message: 'Email is required' });
    email(s.email, { message: 'Invalid email' });
    required(s.password, { message: 'Password is required' });
    minLength(s.password, 4, { message: 'Min 4 characters' });
    required(s.passwordRepeat, { message: 'Please repeat password' });
    validate(s.passwordRepeat, ({ value, valueOf }) =>
      value() !== valueOf(s.password)
        ? { kind: 'mismatch', message: 'Passwords do not match' }
        : null
    );
  });

  registerUser() {
    submit(this.registerForm, async () =>
      console.log('Registering user:', { email: this.registerModel().email })
    );
  }
}

