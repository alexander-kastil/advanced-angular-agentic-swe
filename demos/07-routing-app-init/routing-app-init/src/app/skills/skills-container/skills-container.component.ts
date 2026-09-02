import { Component, computed, inject, signal } from '@angular/core';
import { SlideToggleComponent } from '../../shared/slide-toggle/slide-toggle.component';
import { Skill } from '../skill.model';
import { SkillsKpiComponent } from '../skills-kpi/skills-kpi.component';
import { SkillRowComponent } from '../skill-row/skill-row.component';
import { SkillsService } from '../skills.service';

@Component({
  selector: 'app-skills-container',
  templateUrl: './skills-container.component.html',
  styleUrls: ['./skills-container.component.scss'],
  imports: [SlideToggleComponent, SkillRowComponent, SkillsKpiComponent],
})
export class SkillsContainerComponent {
  private service = inject(SkillsService);

  readonly showAll = signal(true);
  readonly skills = computed(() =>
    this.showAll()
      ? this.service.skills()
      : this.service.skills().filter((skill) => skill.completed)
  );

  addItem() {
    this.service.addSkill({
      id: 0,
      name: 'Configuration Mgmt',
      completed: false,
    });
  }

  deleteItem(item: Skill) {
    this.service.deleteSkill(item);
  }

  toggleItemComplete(item: Skill) {
    this.service.updateSkill({ ...item, completed: !item.completed });
  }
}
