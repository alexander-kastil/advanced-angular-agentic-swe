import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from '../../../shared/progress-bar/progress-bar.component';
import { SlideToggleComponent } from '../../../shared/slide-toggle/slide-toggle.component';
import { Skill } from '../../../skills/skill.model';
import { SkillsStore } from '../../../skills/skills.store';

@Component({
  selector: 'app-skills-entities',
  imports: [FormsModule, ProgressBarComponent, SlideToggleComponent],
  templateUrl: './skills-entities.component.html',
  styleUrl: './skills-entities.component.scss',
})
export class SkillsEntitiesComponent {
  protected store = inject(SkillsStore);
  protected name = signal('');
  protected statusLabel = computed(() => {
    const status = this.store.requestStatus();
    return typeof status === 'object' ? `error: ${status.error}` : status;
  });

  add() {
    const name = this.name().trim();
    if (!name) return;
    this.store.add({ id: 0, name, completed: false });
    this.name.set('');
  }

  toggle(skill: Skill) {
    this.store.update({ ...skill, completed: !skill.completed });
  }

  remove(skill: Skill) {
    this.store.remove(skill);
  }
}
