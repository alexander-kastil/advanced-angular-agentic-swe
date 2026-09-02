import { Component, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';
import { Skill } from '../../../skills/skill.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-signal-effects',
  imports: [BoxedDirective],
  templateUrl: './signal-effects.component.html',
  styleUrl: './signal-effects.component.scss'
})
export class SignalEffectsComponent {
  options = ['Completed', 'Open'];
  completedFilter = signal<boolean | undefined>(undefined);

  skillsResource = httpResource<Skill[]>(() => {
    const filter = this.completedFilter();
    return filter !== undefined
      ? `${environment.api}skills?completed=${filter}`
      : undefined;
  }, { defaultValue: [] });

  onStatusChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.completedFilter.set(value === '' ? undefined : value === 'true');
  }
}
