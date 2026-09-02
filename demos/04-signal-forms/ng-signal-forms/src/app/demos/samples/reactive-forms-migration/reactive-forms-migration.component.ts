import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField, form, minLength, required, submit, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { BoxedDirective, ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';

interface ProfileModel {
  displayName: string;
  password: string;
  confirmation: string;
}

const EMPTY_PROFILE: ProfileModel = { displayName: '', password: '', confirmation: '' };

@Component({
  selector: 'app-reactive-forms-migration',
  templateUrl: './reactive-forms-migration.component.html',
  styleUrls: ['./reactive-forms-migration.component.scss'],
  imports: [
    MarkdownRendererComponent,
    MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions,
    MatFormField, MatLabel, MatInput, MatButton,
    ReactiveFormsModule, FormField,
    BoxedDirective, ColumnDirective, JsonPipe,
  ],
})
export class ReactiveFormsMigrationComponent {
  readonly reactiveResult = signal<ProfileModel | null>(null);
  readonly signalResult = signal<ProfileModel | null>(null);

  readonly reactiveProfile = new FormGroup(
    {
      displayName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
      confirmation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: (group) => (group.value.password === group.value.confirmation ? null : { mismatch: true }) },
  );

  readonly reactiveValue = toSignal(this.reactiveProfile.valueChanges, {
    initialValue: this.reactiveProfile.value,
  });

  readonly reactiveStatus = toSignal(this.reactiveProfile.statusChanges, {
    initialValue: this.reactiveProfile.status,
  });

  readonly model = signal<ProfileModel>({ ...EMPTY_PROFILE });

  readonly signalProfile = form(this.model, (s) => {
    required(s.displayName, { message: 'Display name is required' });
    minLength(s.displayName, 3, { message: 'At least 3 characters' });
    required(s.password, { message: 'Password is required' });
    minLength(s.password, 8, { message: 'At least 8 characters' });
    required(s.confirmation, { message: 'Confirm the password' });
    validate(s.confirmation, ({ value, valueOf }) =>
      value() === valueOf(s.password) ? null : { kind: 'mismatch', message: 'Passwords do not match' },
    );
  });

  submitReactive(): void {
    this.reactiveProfile.markAllAsTouched();
    if (this.reactiveProfile.valid) {
      this.reactiveResult.set(this.reactiveProfile.getRawValue());
    }
  }

  submitSignal(): void {
    submit(this.signalProfile, async () => {
      this.signalResult.set(this.model());
    });
  }

  resetBoth(): void {
    this.reactiveProfile.reset({ ...EMPTY_PROFILE });
    this.reactiveResult.set(null);
    this.model.set({ ...EMPTY_PROFILE });
    this.signalProfile().reset();
    this.signalResult.set(null);
  }
}
