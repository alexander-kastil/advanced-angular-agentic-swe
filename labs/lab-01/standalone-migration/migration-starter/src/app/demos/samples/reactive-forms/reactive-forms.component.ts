import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Person, wealthOptsValues } from '../person/person.model';
import { PersonService } from '../person/person.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-reactive-forms',
  templateUrl: './reactive-forms.component.html',
  styleUrls: ['./reactive-forms.component.scss'],
})
export class ReactiveFormsComponent implements OnInit {
  ps: PersonService = inject(PersonService);
  person: Person = new Person();
  wealthOpts = wealthOptsValues;

  personForm = new FormGroup({
    //include the id even if you do not want to render it to support updated
    // with name params are supplied using comma as seperator
    // with emal we are using an object to supply the validators
    id: new FormControl(this.person.id),
    name: new FormControl(this.person.name, [Validators.required, Validators.minLength(3)], []),
    lastname: new FormControl(this.person.lastname, Validators.required),
    age: new FormControl(this.person.age),
    email: new FormControl(this.person.email, { updateOn: 'change', validators: [], asyncValidators: [] }),
    gender: new FormControl(this.person.gender),
    wealth: new FormControl(this.person.wealth),
  });

  ngOnInit() {
    this.initForm();
    this.subscribeFormChanges();
  }

  initForm() {
    this.ps.getPerson().subscribe((p) => {
      // Use when you want to set the complete model to the form
      // this.personForm.setValue(p);
      // Use when you want to partially update the form
      // In this case some model props are missing in the form
      this.personForm.patchValue(p);
    });
  }

  subscribeFormChanges() {
    this.personForm.valueChanges.subscribe((data) =>
      console.log('Form values changed', data)
    );
    this.personForm.statusChanges.subscribe((data) =>
      console.log('Form status changed', data)
    );
  }

  savePerson(personForm: UntypedFormGroup): void {
    this.ps.save(personForm as unknown as NgForm);
  }
}
