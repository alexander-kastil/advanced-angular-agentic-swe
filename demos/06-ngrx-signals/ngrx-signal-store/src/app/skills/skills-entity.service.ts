import { Injectable, inject } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
  EntityDataService,
} from '@ngrx/data';
import { Skill } from './skill.model';
import { SkillsService } from './skills.service';
import { SkillsDataService } from './skills-data.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SkillsEntityService extends EntityCollectionServiceBase<Skill> {
  service = inject(SkillsService);

  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    dataService: SkillsDataService,
    entityDataService: EntityDataService
  ) {
    super('Skill', serviceElementsFactory);
    console.log('[SkillsEntityService] Registering SkillsDataService');
    // Immediately register the custom data service
    entityDataService.registerService('Skill', dataService);
    console.log('[SkillsEntityService] Registered SkillsDataService');
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
