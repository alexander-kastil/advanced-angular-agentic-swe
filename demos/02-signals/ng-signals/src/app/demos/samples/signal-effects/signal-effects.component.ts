import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';
import { Skill } from '../../../skills/skill.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-signal-effects',
  imports: [MatFormField, MatLabel, MatSelectModule, BoxedDirective],
  templateUrl: './signal-effects.component.html',
  styleUrl: './signal-effects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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

  onStatusChange(parm: MatSelectChange) {
    this.completedFilter.set(parm.value);
  }
}
