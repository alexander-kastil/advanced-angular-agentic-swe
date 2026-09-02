import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { SkillsService } from '../../skills/skills.service';

@Component({
  selector: 'app-observable-to-signal',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatChipSet, MatChip],
  templateUrl: './observable-to-signal.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservableToSignalComponent {
  private service = inject(SkillsService);
  protected skills = toSignal(this.service.getSkills(), { initialValue: [] });
}
