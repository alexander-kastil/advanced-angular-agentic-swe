import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { email, form, FormField, max, min, required, validateAsync, validateHttp } from '@angular/forms/signals';
import { environment } from 'src/environments/environment';
import { BoxedDirective, ColumnDirective } from 'src/app/shared/ux-lib/formatting/formatting-directives';
import { Person } from '../person/person.model';
import { PersonService } from '../person/person.service';

interface PersonFormModel {
  name: string;
  age: number;
  email: string;
}

@Component({
  selector: 'app-reactive-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss'],
  imports: [
    ColumnDirective,
    BoxedDirective,
    FormField
  ]
})
export class ReactiveValidationComponent {
  private ps = inject(PersonService);

  personModel = signal<PersonFormModel>({ name: '', age: 18, email: '' });

  personForm = form(this.personModel, (s) => {
    required(s.name, { message: 'Name is required' });
    min(s.age, 18, { message: 'Person must be at least 18' });
    max(s.age, 99, { message: 'Person must be at most 99' });
    required(s.email, { message: 'Email is required' });
    email(s.email, { message: 'Invalid email address' });

    validateHttp<string, Person[]>(s.email, {
      request: ({ value }) =>
        value() ? `${environment.api}persons?email=${encodeURIComponent(value())}` : undefined,
      debounce: 400,
      onSuccess: (persons) =>
        persons.length > 0
          ? { kind: 'mailExists', message: 'This mail is already registered' }
          : null,
      onError: () => ({ kind: 'serverError', message: 'Could not verify the email' }),
    });

    validateAsync(s.name, {
      params: ({ value }) => value() || undefined,
      debounce: 400,
      factory: (name) =>
        rxResource({
          params: () => name(),
          stream: ({ params }) => this.ps.checkNameTaken(params),
        }),
      onSuccess: (taken) =>
        taken ? { kind: 'nameTaken', message: 'This name is already taken' } : null,
      onError: () => ({ kind: 'serverError', message: 'Could not verify the name' }),
    });
  });

  savePerson(): void {
    console.log('valid person:', this.personModel());
  }
}
