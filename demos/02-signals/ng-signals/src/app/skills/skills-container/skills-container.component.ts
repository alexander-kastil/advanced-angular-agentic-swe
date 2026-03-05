import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { combineLatestWith, map, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SkillRowComponent } from '../skill-row/skill-row.component';
import { Skill } from '../skill.model';
import { SkillsEntityService } from '../skills-entity.service';
import { SkillsKpiComponent } from '../skills-kpi/skills-kpi.component';

@Component({
  selector: 'app-skills-container',
  templateUrl: './skills-container.component.html',
  styleUrls: ['./skills-container.component.scss'],
  imports: [
    MatToolbar,
    MatToolbarRow,
    MatButton,
    MatSlideToggle,
    FormsModule,
    ReactiveFormsModule,
    SkillRowComponent,
    SkillsKpiComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsContainerComponent {
  skillsEntityService = inject(SkillsEntityService);
  fcToggle = new FormControl(true);
  showAll$ = this.fcToggle.valueChanges.pipe(startWith(true));

  skills = toSignal(
    this.skillsEntityService.entities$.pipe(
      combineLatestWith(this.showAll$),
      map(([skills, showAll]) => {
        return showAll ? skills : skills.filter((sk: Skill) => sk.completed === showAll);
      })
    ));

  ngOnInit(): void {
    this.skillsEntityService.loaded$.subscribe((loaded) => {
      if (!loaded) {
        this.skillsEntityService.getAll();
      }
    });
  }

  ngDoCheck(): void {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    if (environment.logChangeDetection) {
      console.log('SkillsContainerComponent - ngDoCheck');
    }
  }

  addItem(): void {
    const newItem: Skill = {
      id: 0,
      name: 'Configuration Mgmt',
      completed: false,
    };
    this.skillsEntityService.add(newItem);
  }

  deleteItem(item: Skill): void {
    this.skillsEntityService.delete(item);
  }

  toggleItemComplete(item: Skill): void {
    this.skillsEntityService.update({ ...item, completed: !item.completed });
  }
}
