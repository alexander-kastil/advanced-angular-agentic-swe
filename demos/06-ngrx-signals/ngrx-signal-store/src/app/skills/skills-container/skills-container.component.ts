import { Component, inject } from '@angular/core';
import { SlideToggleComponent } from '../../shared/slide-toggle/slide-toggle.component';
import { Router, RouterOutlet } from '@angular/router';
import { SkillRowComponent } from '../skill-row/skill-row.component';
import { Skill } from '../skill.model';
import { SkillsKpiComponent } from '../skills-kpi/skills-kpi.component';
import { SkillsStore } from '../skills.store';

@Component({
  selector: 'app-skills-container',
  templateUrl: './skills-container.component.html',
  styleUrls: ['./skills-container.component.scss'],
  imports: [RouterOutlet, SlideToggleComponent, SkillRowComponent, SkillsKpiComponent]
})
export class SkillsContainerComponent {
  protected store = inject(SkillsStore);
  private router = inject(Router);

  addItem(): void {
    this.router.navigate(['/skills', 'new']);
  }

  deleteItem(item: Skill): void {
    this.store.remove(item);
  }

  toggleItemComplete(item: Skill): void {
    this.store.update({ ...item, completed: !item.completed });
  }
}
