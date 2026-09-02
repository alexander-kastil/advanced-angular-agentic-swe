import { Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { wealthOptsValues } from '../person/person.model';
import { MatButton } from '@angular/material/button';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ColumnDirective, BorderDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

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
    MarkdownRendererComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    ColumnDirective,
    FormField,
    MatInput,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatRadioGroup,
    BorderDirective,
    MatRadioButton,
    MatButton,
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
