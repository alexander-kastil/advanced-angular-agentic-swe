import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { email, form, FormField, minLength, required, submit } from '@angular/forms/signals';
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
  selector: 'app-reactive-forms',
  templateUrl: './signal-form-base.component.html',
  styleUrls: ['./signal-form-base.component.scss'],
  imports: [
    MarkdownRendererComponent,
    MatCard, MatCardHeader, MatCardTitle, MatCardContent, ColumnDirective,
    FormField, MatInput, MatFormField, MatLabel, MatSelect, MatOption,
    MatRadioGroup, MatRadioButton, MatButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactiveFormsComponent {
  private ps = inject(PersonService);
  wealthOpts = wealthOptsValues;

  personModel = signal({
    name: '', lastName: '', age: 0, email: '',
    gender: 'not set' as 'male' | 'female' | 'not set', wealth: '',
  });

  personForm = form(this.personModel, (s) => {
    required(s.name, { message: 'Name is required' });
    minLength(s.name, 3, { message: 'Min 3 characters' });
    required(s.lastName, { message: 'Last name is required' });
    required(s.email, { message: 'Email is required' });
    email(s.email, { message: 'Invalid email' });
  });

  constructor() {
    effect(() => {
      this.ps.getPerson().subscribe(p => this.personModel.update(m => ({ ...m, ...p })));
    });
  }

  savePerson() {
    submit(this.personForm, async () => console.log('Saving person:', this.personModel()));
  }

  saveForLater() {
    console.log('Saving for later:', this.personModel());
  }
}

