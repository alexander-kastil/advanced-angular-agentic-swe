import { JsonPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { applyEach, form, FormField, maxLength, min, minLength, required, validate } from '@angular/forms/signals';
import { RowDirective } from '../../../shared/ux-lib/formatting/formatting-directives';

interface SkillsForm {
  name: string;
  age: number;
  skills: Array<{ skillName: string; years: string }>;
}

@Component({
  selector: 'app-form-errors',
  templateUrl: './form-errors.component.html',
  styleUrls: ['./form-errors.component.scss'],
  imports: [
    FormField,
    RowDirective, JsonPipe,
  ]
})
export class FormErrorsComponent {
  skillModel = signal<SkillsForm>({ name: '', age: 0, skills: [] });

  skillForm = form(this.skillModel, (s) => {
    required(s.name, { message: 'Name is required' });
    minLength(s.name, 4, { message: 'Min 4 characters' });
    maxLength(s.name, 15, { message: 'Max 15 characters' });
    validate(s.name, ({ value }) =>
      value() === 'Hugo' ? { kind: 'invalidName', message: 'Hugo is not allowed' } : null
    );
    required(s.age, { message: 'Age is required' });
    min(s.age, 18, { message: 'Must be 18+' });
    applyEach(s.skills, (item) => {
      required(item.skillName, { message: 'Skill name required' });
      required(item.years, { message: 'Years required' });
    });
  });

  allErrors = computed(() => [
    ...this.skillForm.name().errors(),
    ...this.skillForm.age().errors(),
  ]);

  addSkill() {
    this.skillModel.update(m => ({
      ...m,
      skills: [...m.skills, { skillName: '', years: '' }],
    }));
  }

  saveForm() {
    console.log('form saved', this.skillModel());
  }
}
