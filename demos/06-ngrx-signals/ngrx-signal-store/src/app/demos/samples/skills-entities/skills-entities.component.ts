import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Skill } from '../../../skills/skill.model';
import { SkillsStore } from '../../../skills/skills.store';

@Component({
  selector: 'app-skills-entities',
  imports: [
    FormsModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatIconButton,
    MatIcon,
    MatSlideToggle,
    MatProgressBar,
  ],
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
