import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { combineLatestWith, map, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Skill } from '../skill.model';
import { SkillsEntityService } from '../skills-entity.service';
import { AsyncPipe } from '@angular/common';
import { SkillsKpiComponent } from '../skills-kpi/skills-kpi.component';
import { SkillRowComponent } from '../skill-row/skill-row.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatButton } from '@angular/material/button';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { toSignal } from '@angular/core/rxjs-interop';

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
    SkillsKpiComponent
  ]
})
export class SkillsContainerComponent {
  service = inject(SkillsEntityService);
  fcToggle = new FormControl(true);
  skills = toSignal(this.service.entities$.pipe(
    combineLatestWith(this.fcToggle.valueChanges.pipe(startWith(true))),
    map(([skills, showAll]) => {
      return showAll ? skills : skills.filter((sk: Skill) => sk.completed === showAll);
    })
  ));

  ngOnInit(): void {
    this.service.loaded$.subscribe((loaded) => {
      if (!loaded) {
        this.service.getAll();
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
    this.service.add(newItem);
  }

  deleteItem(item: Skill): void {
    this.service.delete(item);
  }

  toggleItemComplete(item: Skill): void {
    this.service.update({ ...item, completed: !item.completed });
  }
}
