import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { skillsStore } from '../skills.store';

@Component({
  selector: 'app-skills-kpi',
  templateUrl: './skills-kpi.component.html',
  styleUrls: ['./skills-kpi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbar, MatToolbarRow]
})
export class SkillsKpiComponent {
  store = inject(skillsStore);
  ct = this.store.count;
  notCompleted = this.store.notCompleted;
}
