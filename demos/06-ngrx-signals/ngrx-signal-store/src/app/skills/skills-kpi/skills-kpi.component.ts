import { Component, inject } from '@angular/core';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { SkillsStore } from '../skills.store';

@Component({
  selector: 'app-skills-kpi',
  templateUrl: './skills-kpi.component.html',
  styleUrls: ['./skills-kpi.component.scss'],
  imports: [MatToolbar, MatToolbarRow]
})
export class SkillsKpiComponent {
  protected store = inject(SkillsStore);
}
