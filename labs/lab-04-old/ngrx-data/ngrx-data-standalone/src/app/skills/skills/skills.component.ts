import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { EntityCollectionService } from '@ngrx/data';
import { Observable } from 'rxjs';
import { SkillsEntityService } from '../skills-entity.service';
import { Skill } from '../skills.model';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent {
  entityService = inject(SkillsEntityService);
  skills$: Observable<Skill[]>;
  skillsService: EntityCollectionService<Skill>;

  constructor() {
    this.skillsService = this.entityService;
    this.skills$ = this.skillsService.entities$;
  }

  ngOnInit(): void {
    this.skillsService.getAll();
  }

  addSkill() {
    this.skillsService.add({ id: 0, name: '@ngrx/data', completed: false });
  }

  deleteSkill(item: Skill) {
    this.skillsService.delete(item);
  }
}
