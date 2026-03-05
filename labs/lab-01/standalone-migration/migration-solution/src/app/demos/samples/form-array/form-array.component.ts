import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonService } from '../person/person.service';
import { MatButton } from '@angular/material/button';
import { GapDirective } from '../../../shared/ux-lib/formatting/formatting-directives';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';

@Component({
    selector: 'app-form-array',
    templateUrl: './form-array.component.html',
    styleUrls: ['./form-array.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatFormField,
        MatLabel,
        MatInput,
        GapDirective,
        MatCardActions,
        MatButton,
    ],
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
