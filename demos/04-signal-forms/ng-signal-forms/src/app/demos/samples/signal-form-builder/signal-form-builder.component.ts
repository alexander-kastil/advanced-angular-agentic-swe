import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { email, form, FormField, min, required, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatSelect } from '@angular/material/select';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { wealthOptsValues } from '../person/person.model';
import { PersonService } from '../person/person.service';

@Component({
  selector: 'app-forms-builder',
  templateUrl: './signal-form-builder.component.html',
  styleUrls: ['./signal-form-builder.component.scss'],
  imports: [
    MarkdownRendererComponent, MatCard, MatCardHeader, MatCardTitle, MatCardContent,
    ColumnDirective, FormField, MatInput, MatFormField, MatLabel,
    MatSelect, MatOption, MatRadioGroup, MatRadioButton, MatButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormBuilderComponent {
  private ps = inject(PersonService);
  wealthOpts = wealthOptsValues;
  genderPattern = /^(male|female|diverse)$/;

  personModel = signal({
    id: 0, name: '', age: 0, email: '',
    gender: 'not set' as 'male' | 'female' | 'not set', wealth: '',
  });

  personForm = form(this.personModel, (s) => {
    required(s.name, { message: 'Name is required' });
    min(s.age, 1, { message: 'Age must be at least 1' });
    email(s.email, { message: 'Invalid email' });
    validate(s.gender, ({ value }) =>
      this.genderPattern.test(value()) ? null : { kind: 'pattern', message: 'Invalid gender' }
    );
  });

  constructor() {
    effect(() => {
      this.ps.getPerson().subscribe(p => this.personModel.update(m => ({ ...m, ...p })));
    });
    setTimeout(() => this.personModel.update(m => ({ ...m, name: 'Soi' })), 3000);
  }

  savePerson() {
    console.log('Saving:', this.personModel());
  }
}

