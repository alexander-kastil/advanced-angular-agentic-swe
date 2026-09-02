import { Component, input, linkedSignal, output } from '@angular/core';
import { form, FormField, max, min, minLength, required, submit } from '@angular/forms/signals';
import { Person } from '../../person/person.model';
import { ColumnDirective } from '../../../../shared/ux-lib/formatting/formatting-directives';

@Component({
  selector: 'app-presenter-edit',
  templateUrl: './presenter-edit.component.html',
  styleUrls: ['./presenter-edit.component.scss'],
  imports: [ColumnDirective, FormField]
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
