import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ValidationErrors, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RowDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MarkdownRendererComponent } from '../../../shared/markdown-renderer/markdown-renderer.component';

@Component({
    selector: 'app-form-errors',
    templateUrl: './form-errors.component.html',
    styleUrls: ['./form-errors.component.scss'],
    standalone: true,
    imports: [
        MarkdownRendererComponent,
        FormsModule,
        ReactiveFormsModule,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatFormField,
        MatLabel,
        MatInput,
        MatError,
        RowDirective,
        MatCardActions,
        MatButton,
        AsyncPipe,
        JsonPipe,
    ],
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
