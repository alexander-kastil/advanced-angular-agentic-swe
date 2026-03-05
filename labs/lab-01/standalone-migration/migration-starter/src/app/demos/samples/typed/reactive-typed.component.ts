import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Person, wealthOptsValues } from '../person/person.model';
import { PersonService } from '../person/person.service';

@Component({
  selector: 'app-reactive-typed',
  templateUrl: './reactive-typed.component.html',
  styleUrls: ['./reactive-typed.component.scss'],
})
export class ReactiveTypedComponent implements OnInit {
  ps: PersonService = inject(PersonService);
  person: Person = new Person();
  wealthOpts = wealthOptsValues;

  //typing is done be providing a default value or by using FormControl<T>
  personForm = new FormGroup({
    name: new FormControl(this.person.name, Validators.required),
    age: new FormControl(this.person.age),
    email: new FormControl<string>(this.person.email),
    gender: new FormControl<'male' | 'female' | 'not set' | null>(
      this.person.gender
    ),
    wealth: new FormControl(this.person.wealth),
  });

  constructor() {
    this.personForm.controls.age.valueChanges.subscribe((value) => {
      console.log('Age changed:', value);
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
