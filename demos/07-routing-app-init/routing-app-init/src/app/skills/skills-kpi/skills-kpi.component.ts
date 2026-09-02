import { Component, inject } from '@angular/core';
import { SkillsService } from '../skills.service';

@Component({
  selector: 'app-skills-kpi',
  templateUrl: './skills-kpi.component.html',
  styleUrls: ['./skills-kpi.component.scss'],
})
export class SkillsKpiComponent {
  private service = inject(SkillsService);
  readonly total = this.service.total;
  readonly openCount = this.service.openCount;
}
