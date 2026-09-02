import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { email, form, FormField, max, min, minLength, required, submit, validate, validateStandardSchema } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { MicrochipModel, microchipSchema } from './microchip-schema';

interface AdoptionModel {
  petName: string;
  age: number;
  wantsInsurance: boolean;
  wantsTraining: boolean;
  contactEmail: string;
  contactPhone: string;
}

@Component({
  selector: 'app-reactive-typed-validation',
  templateUrl: './validation-typed.component.html',
  styleUrls: ['./validation-typed.component.scss'],
  imports: [
    MarkdownRendererComponent, FormField, MatCheckbox,
    MatCard, MatCardHeader, MatCardTitle, MatCardContent, ColumnDirective,
    MatFormField, MatLabel, MatInput, MatCardActions, MatButton, JsonPipe,
  ]
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

  adoptionModel = signal<AdoptionModel>({
    petName: '',
    age: 0,
    wantsInsurance: false,
    wantsTraining: false,
    contactEmail: '',
    contactPhone: '',
  });

  adoptionForm = form(this.adoptionModel, (s) => {
    required(s.petName, { message: 'Pet name is required' });
    min(s.age, 0, { message: 'Age cannot be negative' });
    max(s.age, 30, { message: 'Age must be 30 or less' });

    validate(s.wantsInsurance, ({ value, valueOf }) =>
      value() || valueOf(s.wantsTraining)
        ? null
        : { kind: 'serviceMissing', message: 'Pick insurance or training' }
    );

    validate(s.contactEmail, ({ value, valueOf }) =>
      value() || valueOf(s.contactPhone)
        ? null
        : { kind: 'contactMissing', message: 'Provide either email or phone' }
    );
  });

  microchipModel = signal<MicrochipModel>({ chipId: '', species: '' });

  microchipForm = form(this.microchipModel, (s) => {
    validateStandardSchema(s, microchipSchema);
  });

  registerMicrochip() {
    submit(this.microchipForm, async () => console.log('Registering chip:', this.microchipModel()));
  }

  registerUser() {
    submit(this.registerForm, async () =>
      console.log('Registering user:', { email: this.registerModel().email })
    );
  }

  adopt() {
    submit(this.adoptionForm, async () => console.log('Adopting:', this.adoptionModel()));
  }
}
