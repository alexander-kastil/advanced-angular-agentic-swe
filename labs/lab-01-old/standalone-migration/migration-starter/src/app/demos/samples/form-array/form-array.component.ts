import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { PersonService } from '../person/person.service';

@Component({
  selector: 'app-form-array',
  templateUrl: './form-array.component.html',
  styleUrls: ['./form-array.component.scss'],
})
export class FormArrayComponent {
  fb: FormBuilder = inject(FormBuilder);
  ps: PersonService = inject(PersonService);
  skillForm = this.fb.group({
    name: '',
    skillsGrp: this.fb.array([]),
  });

  addSkill() {
    const skillsGrp = this.skillForm.controls.skillsGrp as FormArray;
    skillsGrp.push(
      this.fb.group({
        skillname: '',
        years: '',
      })
    );
  }

  saveForm() {
    console.log('form saved', this.skillForm);
  }
}
