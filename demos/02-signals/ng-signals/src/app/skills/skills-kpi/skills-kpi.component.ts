import { Component, inject } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { SkillsService } from '../skills.service';

@Component({
  selector: 'app-skills-kpi',
  templateUrl: './skills-kpi.component.html',
  styleUrls: ['./skills-kpi.component.scss'],
  imports: [MatToolbar, MatToolbarRow],
})
export class SkillsKpiComponent {
  private service = inject(SkillsService);

  readonly total = this.service.total;
  readonly open = this.service.openCount;
}
