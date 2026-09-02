import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Skill } from '../skill.model';

@Component({
  selector: 'app-skill-row',
  templateUrl: './skill-row.component.html',
  styleUrls: ['./skill-row.component.scss'],
  imports: [RouterLink],
})
export class SkillRowComponent {
  readonly skill = input.required<Skill>();
  readonly itemDeleted = output<Skill>();
  readonly itemCompleted = output<Skill>();
}
