import { Injectable, inject } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Skill } from './skill.model';
import { SkillsService } from './skills.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SkillsEntityService extends EntityCollectionServiceBase<Skill> {
  service = inject(SkillsService);
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Skill', serviceElementsFactory);
  }

  getSkillById(id: number) {
    if (id !== 0) {
      return this.service.getSkill(id);
    }
    else {
      return of(undefined)
    }
  }
}
