import { Component, signal } from '@angular/core';
import { applyEach, form, FormField, required } from '@angular/forms/signals';
import { ColumnDirective } from '../../../shared/ux-lib/formatting/formatting-directives';

interface SkillsModel {
  name: string;
  skills: Array<{ skill: string; years: string }>;
}

@Component({
  selector: 'app-form-array',
  templateUrl: './form-array.component.html',
  styleUrls: ['./form-array.component.scss'],
  imports: [
    FormField,
    ColumnDirective,
  ]
})
export class FormArrayComponent {
  skillModel = signal<SkillsModel>({
    name: 'Giro',
    skills: [{ skill: 'Hunting', years: '9' }],
  });

  skillForm = form(this.skillModel, (s) => {
    required(s.name, { message: 'Name is required' });
    applyEach(s.skills, (item) => {
      required(item.skill, { message: 'Skill name required' });
      required(item.years, { message: 'Years required' });
    });
  });

  addSkill() {
    this.skillModel.update(m => ({
      ...m,
      skills: [...m.skills, { skill: '', years: '' }],
    }));
  }

  removeSkill(index: number) {
    this.skillModel.update(m => ({
      ...m,
      skills: m.skills.filter((_, i) => i !== index),
    }));
  }

  checkArrayValid() {
    const lastSkill = this.skillModel().skills.at(-1);
    return !lastSkill?.skill || !lastSkill?.years;
  }

  saveForm() {
    console.log('saving ...', this.skillModel());
  }
}
