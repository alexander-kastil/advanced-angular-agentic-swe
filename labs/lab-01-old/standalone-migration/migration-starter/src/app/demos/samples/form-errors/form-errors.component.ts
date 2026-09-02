import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss'],
})
export class FormErrorsComponent {
  fb: FormBuilder = inject(FormBuilder);
  skillForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(15)],
    ],
    age: [0, [Validators.required, Validators.min(18)]],
    skillsGrp: this.fb.array([]),
  });

  validationErrors = this.skillForm.valueChanges.pipe(
    map(() => {
      const errors: ValidationErrors[] = [];
      Object.keys(this.skillForm.controls).forEach((key) => {
        let err = this.skillForm.get(key)?.errors;
        if (err) errors.push(err);
      });
      return errors;
    })
  );

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

  getElementsInFormArray() {
    return (this.skillForm.controls.skillsGrp as FormArray).controls;
  }

  //Sample for custom Validator - name
  validateName(control: FormControl): { [s: string]: boolean } | null {
    if (control.value === 'Hugo') {
      return { nameError: true };
    }
    return null;
  }
}
