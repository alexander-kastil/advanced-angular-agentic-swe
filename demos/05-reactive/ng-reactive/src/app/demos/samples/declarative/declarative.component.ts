import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { combineLatestWith, startWith, map } from 'rxjs';
import { Skill } from '../../skills/skills';
import { SkillsService } from '../../skills/skills.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';

@Component({
  selector: 'app-declarative',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    JsonPipe,
    BoxedDirective
  ],
  templateUrl: './declarative.component.html',
  styleUrl: './declarative.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeclarativeComponent {
  service = inject(SkillsService);
  filter$ = new FormControl('', { nonNullable: true });

  skills$ = this.service.getSkills().pipe(
    // initialization: startWith('') will emit an empty string to the stream
    combineLatestWith(this.filter$.valueChanges.pipe(startWith(''))),
    map(([skills, filter]) => {
      return filter == ''
        ? skills
        : skills.filter((skill: Skill) => skill.name.includes(filter));
    })
  );
}
