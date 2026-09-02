import { Component, inject } from '@angular/core';
import { SkillsStore } from '../skills.store';

@Component({
  selector: 'app-skills-kpi',
  templateUrl: './skills-kpi.component.html',
  styleUrls: ['./skills-kpi.component.scss'],
})
export class SkillsKpiComponent {
  protected store = inject(SkillsStore);
}
