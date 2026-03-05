import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, minLength, maxLength } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'app-form-control',
  templateUrl: './signal-form-control.component.html',
  styleUrls: ['./signal-form-control.component.scss'],
  imports: [
    MatCard, MatCardHeader, MatCardTitle, MatCardContent,
    ColumnDirective, MatFormField, MatLabel, MatInput,
    MatCardActions, MatButton, FormField, MarkdownRendererComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
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
}
