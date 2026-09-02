import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SlideToggleComponent } from '../../shared/slide-toggle/slide-toggle.component';
import { SkillRowComponent } from '../skill-row/skill-row.component';
import { Skill } from '../skill.model';
import { skillsStore } from '../skills.store';
import { SkillsKpiComponent } from '../skills-kpi/skills-kpi.component';

@Component({
  selector: 'app-skills-container',
  templateUrl: './skills-container.component.html',
  styleUrls: ['./skills-container.component.scss'],
  imports: [SlideToggleComponent, SkillRowComponent, SkillsKpiComponent]
})
export class SkillsContainerComponent {
  store = inject(skillsStore);
  router = inject(Router);
  showAll = signal(true);

  skills = computed(() => {
    const all = this.store.skills();
    return this.showAll() ? all : all.filter((sk: Skill) => sk.completed);
  });

  addItem(): void {
    this.router.navigate(['/skills', 'new']);
  }

  deleteItem(item: Skill): void {
    this.store.deleteSkill(item);
  }

  toggleItemComplete(item: Skill): void {
    this.store.updateSkill({ ...item, completed: !item.completed });
  }
}
