import { Routes } from '@angular/router';
import { SkillsContainerComponent } from './skills-container/skills-container.component';
import { SkillsEditComponent } from './skills-edit/skills-edit.component';

export const skillRoutes: Routes = [
  {
    path: '', component: SkillsContainerComponent,
  },
  {
    path: 'new', component: SkillsEditComponent, data: { id: 'new' }
  },
  {
    path: ':id', component: SkillsEditComponent
  }
];