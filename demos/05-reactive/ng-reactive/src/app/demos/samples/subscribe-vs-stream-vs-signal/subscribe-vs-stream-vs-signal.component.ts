import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { BoxedDirective } from "../../../shared/formatting/formatting-directives";
import { Skill } from '../../skills/skills';
import { SkillsService } from '../../skills/skills.service';

@Component({
  selector: 'app-imperative',
  templateUrl: './imperative.component.html',
  styleUrls: ['./imperative.component.scss'],
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
    BoxedDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImperativeComponent implements OnInit {
  title = input('ImperativeProgramming');
  showMD = input(true);
  destroy = inject(DestroyRef)

  filter$ = new FormControl('', { nonNullable: true });
  service = inject(SkillsService);
  skills: Skill[] = [];
  view = signal<Skill[]>([]);

  ngOnInit(): void {
    this.service
      .getSkills()
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((skills) => {
        this.skills = skills;
        this.view.set(skills);
      });

    this.filter$.valueChanges
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe((val) => {
        this.view.set(
          val == ''
            ? this.skills
            : this.skills.filter((skill) => skill.name.includes(val))
        );
      });
  }

}
