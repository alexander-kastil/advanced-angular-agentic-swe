import { ChangeDetectionStrategy, Component } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';
import { Skill } from '../../../skills/skill.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-http-resource',
  imports: [BoxedDirective],
  template: `
    <div boxed>
      @if (skillsResource.isLoading()) {
        <p>Loading...</p>
      }
      @if (skillsResource.error()) {
        <p>Error loading skills</p>
      }
      @for (skill of skillsResource.value(); track skill.id) {
        <div [style.text-decoration]="skill.completed ? 'line-through' : 'none'">
          {{ skill.name }}
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpResourceComponent {
  skillsResource = httpResource<Skill[]>(() => `${environment.api}skills`);
}
