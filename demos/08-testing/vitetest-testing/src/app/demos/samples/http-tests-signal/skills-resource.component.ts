import { Component, ChangeDetectionStrategy } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Skill } from '../../../skills/skill.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-skills-resource',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (skills.isLoading()) {
      <p data-testid="loading">Loading...</p>
    } @else {
      @for (skill of skills.value(); track skill.id) {
        <div data-testid="skill-row">{{ skill.name }}</div>
      }
    }
  `,
})
export class SkillsResourceComponent {
  skills = httpResource<Skill[]>(() => `${environment.api}skills`);
}
