import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Skill } from '../skill.model';

@Component({
  selector: 'app-skill-row',
  templateUrl: './skill-row.component.html',
  styleUrls: ['./skill-row.component.scss'],
  imports: [RouterLink]
})
export class SkillRowComponent {
  skill = input.required<Skill>();
  itemDeleted = output<Skill>();
  itemCompleted = output<Skill>();

  deleteItem(item: Skill): void {
    this.itemDeleted.emit(item);
  }

  toggleItemCompleted(item: Skill): void {
    this.itemCompleted.emit(item);
  }
}
