import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { combineLatestWith, map, startWith } from 'rxjs/operators';
import { SkillRowComponent } from '../skill-row/skill-row.component';
import { Skill } from '../skill.model';
import { SkillsEntityService } from '../skills-entity.service';
import { SkillsKpiComponent } from '../skills-kpi/skills-kpi.component';

@Component({
  selector: 'app-skills-container',
  templateUrl: './skills-container.component.html',
  styleUrls: ['./skills-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatButton,
    MatSlideToggle,
    FormsModule,
    ReactiveFormsModule,
    SkillRowComponent,
    SkillsKpiComponent,
  ]
})
export class SkillsContainerComponent {
  service = inject(SkillsEntityService);
  router = inject(Router);
  fcToggle = new FormControl(true);

  skills = toSignal(this.service.entities$.pipe(
    combineLatestWith(this.fcToggle.valueChanges.pipe(startWith(true))),
    map(([skills, showAll]) => {
      const filtered = showAll ? skills : skills.filter((sk: Skill) => sk.completed === showAll);
      return filtered.sort((a, b) => a.id - b.id);
    })
  ), { initialValue: [] as Skill[] });

  constructor() {
    this.service.loaded$.pipe(takeUntilDestroyed()).subscribe((loaded) => {
      if (!loaded) this.service.getAll();
    });
  }

  addItem(): void {
    this.router.navigate(['/skills', 'new']);
  }

  deleteItem(item: Skill): void {
    this.service.delete(item);
  }

  toggleItemComplete(item: Skill): void {
    this.service.update({ ...item, completed: !item.completed });
  }
}
