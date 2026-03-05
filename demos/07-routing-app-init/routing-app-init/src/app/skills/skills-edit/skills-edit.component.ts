import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, effect } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';
import { Skill } from '../skill.model';
import { SkillsEntityService } from '../skills-entity.service';

@Component({
  selector: 'app-skills-edit',
  templateUrl: './skills-edit.component.html',
  styleUrls: ['./skills-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCardModule,
    MatFormField,
    MatInput,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggle,
    MatCardActions,
    MatButton
  ]
})
export class SkillsEditComponent {
  id = input.required<number>();
  router = inject(Router);
  service = inject(SkillsEntityService);
  sns = inject(SnackbarService);
  fb = inject(NonNullableFormBuilder);
  skill: Skill = new Skill();

  skillForm = this.fb.group({
    id: [0, { validators: [Validators.required] }],
    name: '',
    completed: false,
  });

  constructor() {
    effect(() => {
      const skillId = this.id();
      if (skillId && skillId !== 0) {
        this.service.getSkillById(skillId).subscribe((data) => {
          if (data) {
            this.skillForm.patchValue(data);
          }
        });
      }
    });
  }

  saveSkill() {
    this.service.upsert(this.skillForm.value as Skill).subscribe((data) => {
    })
  }

  doCancel() {
    this.router.navigate(['/skills']);
  }
}
