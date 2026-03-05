import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Skill } from '../skill.model';
import { SkillsEntityService } from '../skills-entity.service';

@Component({
  selector: 'app-skills-kpi',
  templateUrl: './skills-kpi.component.html',
  styleUrls: ['./skills-kpi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbar, MatToolbarRow]
})
export class SkillsKpiComponent {
  service = inject(SkillsEntityService);
  skills = toSignal(this.service.entities$, { initialValue: [] as Skill[] });
  ct = computed(() => this.skills().length);
  notCompleted = computed(() => this.skills().filter(sk => !sk.completed).length);
}
