import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Skill } from '../../../skills/skill.model';

@Component({
  selector: 'app-component-class',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ title }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @for (sk of skills(); track sk.id) {
            <div>{{ sk.name }}</div>
          }
        </mat-card-content>
      </mat-card>
      <button mat-raised-button (click)="addSkill({ id: 10, name: 'NgRx', completed: false })" color="primary">Add Skill</button>
      `,
  imports: [MatCardModule, MatButtonModule],
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
