import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { wealthOptsValues } from '../person/person.model';
import { PersonService } from '../person/person.service';
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

@Component({
  selector: 'app-reactive-nested',
  templateUrl: './signal-form-nested-objects.component.html',
  styleUrls: ['./signal-form-nested-objects.component.scss'],
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactiveNestedComponent {
  private ps = inject(PersonService);
  wealthOpts = wealthOptsValues;

  personModel = signal<NestedModel>({
    name: '',
    lastName: '',
    age: 0,
    gender: 'not set',
    email: '',
    wealth: '',
    address: { street: '', city: '', postalCode: '' },
  });

  // Signal Forms supports nested objects via dot notation
  personForm = form(this.personModel, (s) => {
    required(s.name, { message: 'Name is required' });
    required(s.lastName, { message: 'Last name is required' });
    required(s.address.street, { message: 'Street is required' });
  });

  constructor() {
    effect(() => {
      this.ps.getPerson().subscribe((p) => {
        this.personModel.update((m) => ({
          ...m,
          name: p.name,
          lastName: p.lastName ?? '',
          age: p.age,
          gender: p.gender,
          email: p.email,
          wealth: p.wealth,
          address: p.address ?? m.address,
        }));
      });
    });

    setTimeout(() => {
      this.personModel.update((m) => ({ ...m, name: 'Soi' }));
    }, 3000);
  }

  savePerson(): void {
    this.ps.save(this.personModel() as any);
  }
}

