import { Component, signal } from '@angular/core';
import { form, FormField, minLength, required, submit, validate } from '@angular/forms/signals';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { DirtyOnlyStateMatcher, EagerStateMatcher } from './custom-state-matcher';

@Component({
  selector: 'app-err-state-matcher',
  templateUrl: './err-state-matcher.component.html',
  styleUrls: ['./err-state-matcher.component.scss'],
  imports: [
    FormField,
    ColumnDirective,
  ]
})
export class ErrStateMatcherComponent {
  dirtyOnly = new DirtyOnlyStateMatcher();
  eager = new EagerStateMatcher();

  registerModel = signal({ email: '', password: '', passwordRepeat: '' });

  registerForm = form(this.registerModel, (s) => {
    required(s.email, { message: 'Email is required' });
    required(s.password, { message: 'Password is required' });
    minLength(s.password, 4, { message: 'Min 4 characters' });
    required(s.passwordRepeat, { message: 'Please repeat the password' });
    validate(s.passwordRepeat, ({ value, valueOf }) =>
      value() !== valueOf(s.password)
        ? { kind: 'mismatch', message: 'Passwords do not match' }
        : null
    );
  });

  registerUser() {
    submit(this.registerForm, async () =>
      console.log('registering', this.registerModel().email)
    );
  }
}
