import { Component, OnInit, inject } from '@angular/core';
import { Validators, FormBuilder, NgForm } from '@angular/forms';
import { Person, wealthOptsValues } from '../person/person.model';
import { PersonService } from '../person/person.service';

@Component({
  selector: 'app-get-raw-value',
  templateUrl: './get-raw-value.component.html',
  styleUrls: ['./get-raw-value.component.scss'],
})
export class GetRawValueComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  ps: PersonService = inject(PersonService);
  person: Person = new Person();
  wealthOpts = wealthOptsValues;
  genderPattern = '^(male|female)';

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

  toggleId() {
    this.personForm.controls.id.disable();
  }

  savePerson(): void {
    this.ps.save(this.personForm as unknown as NgForm);
  }

  getRawValue(): void {
    console.log('Getting raw value the whole form:', this.personForm.getRawValue());
  }
}
