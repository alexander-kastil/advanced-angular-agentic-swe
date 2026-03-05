import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { SkillRowComponent } from '../skill-row/skill-row.component';
import { Skill } from '../skill.model';
import { skillsStore } from '../skills.store';
import { SkillsKpiComponent } from '../skills-kpi/skills-kpi.component';

@Component({
  selector: 'app-skills-container',
  templateUrl: './skills-container.component.html',
  styleUrls: ['./skills-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatButton,
    MatSlideToggle,
    FormsModule,
    SkillRowComponent,
    SkillsKpiComponent,
  ]
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
