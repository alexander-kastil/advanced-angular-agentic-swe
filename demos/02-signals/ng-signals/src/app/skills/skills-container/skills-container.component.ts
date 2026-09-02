import { Component, computed, inject, signal } from '@angular/core';
import { SlideToggleComponent } from '../../shared/slide-toggle/slide-toggle.component';
import { SkillRowComponent } from '../skill-row/skill-row.component';
import { Skill } from '../skill.model';
import { SkillsService } from '../skills.service';
import { SkillsKpiComponent } from '../skills-kpi/skills-kpi.component';

@Component({
  selector: 'app-skills-container',
  templateUrl: './skills-container.component.html',
  styleUrls: ['./skills-container.component.scss'],
  imports: [
    SlideToggleComponent,
    SkillRowComponent,
    SkillsKpiComponent,
  ],
})
export class SkillsContainerComponent {
  private service = inject(SkillsService);

  readonly showAll = signal(true);
  readonly skills = computed(() => {
    const all = this.service.skills.value();
    return this.showAll() ? all : all.filter((sk) => sk.completed);
  });

  addItem() {
    this.service.add({ id: 0, name: 'Configuration Mgmt', completed: false });
  }

  deleteItem(item: Skill) {
    this.service.remove(item);
  }

  toggleItemComplete(item: Skill) {
    this.service.update({ ...item, completed: !item.completed });
  }
}
