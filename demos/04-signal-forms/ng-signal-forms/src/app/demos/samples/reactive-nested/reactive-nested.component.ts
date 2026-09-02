import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { wealthOptsValues } from '../person/person.model';
import { ColumnDirective, BorderDirective } from '../../../shared/ux-lib/formatting/formatting-directives';

interface NestedModel {
  name: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  wealth: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
}

const emptyModel: NestedModel = {
  name: '',
  lastName: '',
  age: 0,
  gender: 'not set',
  email: '',
  wealth: '',
  address: { street: '', city: '', postalCode: '' },
};

const samplePerson: NestedModel = {
  name: 'Cletschi',
  lastName: 'Whippet',
  age: 15,
  gender: 'female',
  email: 'cleothewhippet@integrations.at',
  wealth: 'rich',
  address: { street: 'Stairway to heaven', city: 'Better place', postalCode: '1000' },
};

@Component({
  selector: 'app-reactive-nested',
  templateUrl: './reactive-nested.component.html',
  styleUrls: ['./reactive-nested.component.scss'],
  imports: [
    ColumnDirective,
    FormField,
    BorderDirective,
  ]
})
export class ReactiveNestedComponent {
  wealthOpts = wealthOptsValues;

  personModel = signal<NestedModel>(emptyModel);

  personForm = form(this.personModel, (s) => {
    required(s.name, { message: 'Name is required' });
    required(s.lastName, { message: 'Last name is required' });
    required(s.address.street, { message: 'Street is required' });
    required(s.address.city, { message: 'City is required' });
  });

  loadPerson(): void {
    this.personModel.set(samplePerson);
  }

  clearPerson(): void {
    this.personForm().reset(emptyModel);
  }

  savePerson(): void {
    console.log('person saved:', this.personModel());
  }
}
