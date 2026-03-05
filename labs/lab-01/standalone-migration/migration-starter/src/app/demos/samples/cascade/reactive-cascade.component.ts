import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-reactive-cascade',
  templateUrl: './reactive-cascade.component.html',
  styleUrls: ['./reactive-cascade.component.scss'],
})
export class ReactiveCascadeComponent {
  fb: FormBuilder = inject(FormBuilder);
  readonly selectValues = [
    { type: 'Frameworks', values: ['Angular', 'React', '.NET Core', 'Spring'] },
    {
      type: 'Languages',
      values: ['TypeScript', 'JavaScript', 'C#', 'Java', 'Python'],
    },
    { type: 'Cloud', values: ['Azure', 'AWS', 'Google'] },
  ];
  selects: string[];

  // Type the form using type inference
  skillsGrp = this.fb.nonNullable.group({
    selectInput: [''],
    whereInput: [''],
  });

  profileForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    skills: this.fb.array([this.skillsGrp]),
  });

  constructor() {
    this.selects = [];
  }

  ngOnInit(): void { }

  saveProfileForm() {
    console.log(this.profileForm.value);
  }

  getCriteria(type: any) {
    const select = this.selectValues.find((_) => _.type == type);
    return select ? select.values : select;
  }

  saveForm() {
    console.log('form saves:', this.profileForm);
  }
}
