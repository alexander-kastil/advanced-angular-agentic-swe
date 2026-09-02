import { Component, inject } from '@angular/core';
import { skillsStore } from '../skills.store';

@Component({
  selector: 'app-skills-kpi',
  templateUrl: './skills-kpi.component.html',
  styleUrls: ['./skills-kpi.component.scss'],
})
export class SkillsKpiComponent {
  store = inject(skillsStore);
  ct = this.store.count;
  notCompleted = this.store.notCompleted;
}
