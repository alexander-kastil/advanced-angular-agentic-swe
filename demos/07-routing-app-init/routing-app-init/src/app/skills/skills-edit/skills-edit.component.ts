import { Component, effect, inject, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { Skill } from '../skill.model';
import { SkillsService } from '../skills.service';

@Component({
  selector: 'app-skills-edit',
  templateUrl: './skills-edit.component.html',
  styleUrls: ['./skills-edit.component.scss'],
  imports: [ReactiveFormsModule],
})
export class SkillsEditComponent {
  readonly id = input.required({ transform: (value: string | number) => Number(value) });

  private router = inject(Router);
  private service = inject(SkillsService);
  private sns = inject(SnackbarService);
  private fb = inject(NonNullableFormBuilder);

  readonly skillForm = this.fb.group({
    id: [0, { validators: [Validators.required] }],
    name: '',
    completed: false,
  });

  constructor() {
    effect(() => {
      const skillId = this.id();
      if (skillId) {
        this.service.getSkill(skillId).subscribe((skill) => this.skillForm.patchValue(skill));
      }
    });
  }

  async saveSkill() {
    await this.service.updateSkill(this.skillForm.getRawValue() as Skill);
    this.sns.displayAlert('Skills', 'Skill saved');
    this.router.navigate(['/skills']);
  }

  doCancel() {
    this.router.navigate(['/skills']);
  }
}
