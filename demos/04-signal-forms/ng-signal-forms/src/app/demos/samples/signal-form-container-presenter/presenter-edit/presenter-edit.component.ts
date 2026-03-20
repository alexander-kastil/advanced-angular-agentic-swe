import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';
import { form, FormField, max, min, minLength, required, submit } from '@angular/forms/signals';
import { Person } from '../../person/person.model';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { ColumnDirective } from '../../../../shared/ux-lib/formatting/formatting-directives';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';

@Component({
  selector: 'app-presenter-edit',
  templateUrl: './presenter-edit.component.html',
  styleUrls: ['./presenter-edit.component.scss'],
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions,
    ColumnDirective, FormField, MatFormField, MatLabel, MatInput, MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PresenterEditComponent {
  readonly person = input.required<Person>();
  readonly savePerson = output<Person>();

  personModel = linkedSignal(() => ({ ...this.person() }));

  personForm = form(this.personModel, (s) => {
    required(s.name, { message: 'Name is required' });
    minLength(s.name, 3, { message: 'Min 3 characters' });
    min(s.age, 0, { message: 'Age must be 0 or greater' });
    max(s.age, 120, { message: 'Age must be 120 or less' });
  });

  doSave() {
    submit(this.personForm, async () => {
      this.savePerson.emit(this.personModel());
    });
  }
}
