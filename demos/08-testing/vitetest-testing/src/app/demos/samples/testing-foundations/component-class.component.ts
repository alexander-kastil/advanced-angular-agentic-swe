import { Component, signal } from '@angular/core';
import { Skill } from '../../../skills/skill.model';

@Component({
  selector: 'app-component-class',
  template: `<div class="card mt-0">
        <div class="card-header">
          <h2 class="card-title">{{ title }}</h2>
        </div>
        <div class="card-content">
          @for (sk of skills(); track sk.id) {
            <div>{{ sk.name }}</div>
          }
        </div>
        <div class="card-actions">
          <button
            type="button"
            class="btn btn-primary"
            (click)="addSkill({ id: 10, name: 'NgRx', completed: false })">
            Add Skill
          </button>
        </div>
      </div>
      `,
})
export class ComponentClassComponent {
  readonly title = 'Skills';
  readonly skills = signal<Skill[]>([
    { id: 1, name: 'Angular', completed: true },
    { id: 2, name: 'TypeScript', completed: false },
  ]);

  addSkill(item: Skill) {
    this.skills.update(items => [...items, item]);
  }
}
