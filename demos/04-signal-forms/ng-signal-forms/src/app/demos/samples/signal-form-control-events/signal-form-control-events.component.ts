import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required, minLength } from '@angular/forms/signals';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MarkdownRendererComponent } from 'src/app/shared/markdown-renderer/markdown-renderer.component';
import { BoxedDirective, ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-control-events',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormField,
    MarkdownRendererComponent,
    BoxedDirective,
    ColumnDirective,
    MatCard, MatCardHeader, MatCardTitle, MatCardContent
  ],
  templateUrl: './signal-form-control-events.component.html',
  styleUrl: './signal-form-control-events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlEventsComponent {
  model = signal({ name: '' });

  fields = form(this.model, (s) => {
    required(s.name, { message: 'Name is required' });
    minLength(s.name, 3, { message: 'Min 3 characters' });
  });
}

