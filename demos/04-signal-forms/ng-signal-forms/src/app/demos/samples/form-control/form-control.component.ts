import { Component, signal } from '@angular/core';
import { form, FormField, required, minLength, maxLength } from '@angular/forms/signals';
import { BoxedDirective, ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';

@Component({
  selector: 'app-form-control',
  templateUrl: './form-control.component.html',
  styleUrls: ['./form-control.component.scss'],
  imports: [
    BoxedDirective, ColumnDirective, FormField
  ]
})
export class FormControlComponent {
  model = signal({ name: '', postal: '3544', city: 'Idolsberg' });

  fields = form(this.model, (s) => {
    required(s.name, { message: 'Name is required' });
    minLength(s.name, 3, { message: 'Min 3 characters' });
    maxLength(s.city, 15, { message: 'Max 15 characters' });
  });

  logName() {
    console.log('current name:', this.fields.name().value());
  }

  updateName() {
    this.fields.name().value.set('Soi');
  }

  markTouched() {
    this.fields.name().markAsTouched();
  }

  resetForm() {
    this.fields().reset();
  }
}
