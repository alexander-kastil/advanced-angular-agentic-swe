import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Person, wealthOptsValues } from '../person/person.model';
import { PersonService } from '../person/person.service';

@Component({
  selector: 'app-forms-builder',
  templateUrl: './forms-builder.component.html',
  styleUrls: ['./forms-builder.component.scss'],
})
export class FormBuilderComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  ps: PersonService = inject(PersonService);
  person: Person = new Person();
  wealthOpts = wealthOptsValues;
  genderPattern = '^(male|female|diverse)';

  personForm = this.fb.group({
    id: [0],
    name: ['', { validators: [Validators.required] }],
    age: [0, { validators: [Validators.min(1)] }],
    email: ['', { validators: [Validators.email] }],
    gender: ['', { validators: [Validators.pattern(this.genderPattern)] }],
    wealth: [''],
  });

  ngOnInit() {
    this.ps.getPerson().subscribe((p) => {
      //Reminder: setValue vs patchValue
      this.personForm.patchValue(p);
      console.log('Data loaded from service', p);
    });

    setTimeout(() => {
      //Use this to update form incrementally
      this.personForm.patchValue({ name: 'Soi' });
      console.log('Cleo changed to Soi');
    }, 3000);
  }

  savePerson(): void {
    this.ps.save(this.personForm as unknown as NgForm);
    console.log('Getting raw value of id:', this.personForm.getRawValue().id);
  }
}
