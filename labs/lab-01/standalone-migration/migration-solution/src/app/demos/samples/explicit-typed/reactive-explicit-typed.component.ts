import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Person, wealthOptsValues } from '../person/person.model';
import { PersonService } from '../person/person.service';
import { MatButton } from '@angular/material/button';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-reactive-explicit-typed',
    templateUrl: './reactive-explicit-typed.component.html',
    styleUrls: ['./reactive-explicit-typed.component.scss'],
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        FormsModule,
        ColumnDirective,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        MatSelect,
        MatOption,
        MatRadioGroup,
        MatRadioButton,
        MatButton,
    ],
})
export class ReactiveExplicitTypedComponent implements OnInit {
  ps: PersonService = inject(PersonService);
  person: Person = new Person();
  wealthOpts = wealthOptsValues;

  personForm: FormGroup<{
    name: FormControl<string | null>;
    age: FormControl<number | null>;
    email: FormControl<string | null>;
    gender: FormControl<'male' | 'female' | 'not set' | null>;
    wealth: FormControl<string | null>;
  }>;

  constructor() {
    this.personForm = new FormGroup({
      name: new FormControl(this.person.name, Validators.required),
      age: new FormControl(this.person.age),
      email: new FormControl(this.person.email),
      gender: new FormControl(this.person.gender),
      wealth: new FormControl(this.person.wealth),
    });
  }

  ngOnInit() {
    this.ps.getPerson().subscribe((p) => {
      // Could be setValue if model is implemented with all props in form
      // Oherwise use patchValue
      this.personForm.patchValue(p);
    });
  }

  savePerson(): void {
    console.log('Person name:', this.personForm.value.name);
    this.ps.save(this.personForm as unknown as NgForm);
  }
}
