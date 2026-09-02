import { Component, effect, inject, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Skill } from '../skill.model';
import { SkillsService } from '../skills.service';

@Component({
  selector: 'app-skills-edit',
  templateUrl: './skills-edit.component.html',
  styleUrls: ['./skills-edit.component.scss'],
  imports: [
    MatCardModule,
    MatFormField,
    MatInput,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggle,
    MatCardActions,
    MatButton,
  ],
})
export class SkillsEditComponent {
  readonly id = input.required<number, string>({ transform: (v) => Number(v) });

  private router = inject(Router);
  private service = inject(SkillsService);
  private fb = inject(NonNullableFormBuilder);

  readonly skill = httpResource<Skill>(() =>
    this.id() ? `${environment.api}skills/${this.id()}` : undefined,
  );

  readonly skillForm = this.fb.group({
    id: [0, { validators: [Validators.required] }],
    name: '',
    completed: false,
  });

  constructor() {
    effect(() => {
      const loaded = this.skill.value();
      if (loaded) {
        this.skillForm.patchValue(loaded);
      }
    });
  }

  saveSkill() {
    this.service.update(this.skillForm.getRawValue());
    this.router.navigate(['/skills']);
  }

  doCancel() {
    this.router.navigate(['/skills']);
  }
}
