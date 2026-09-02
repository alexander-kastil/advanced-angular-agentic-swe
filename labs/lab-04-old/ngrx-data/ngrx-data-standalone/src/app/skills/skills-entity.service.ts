import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { Skill } from './skills.model';

@Injectable({
  providedIn: 'root',
})
export class SkillsEntityService extends EntityCollectionServiceBase<Skill> {
  constructor(factory: EntityCollectionServiceElementsFactory) {
    super('Skill', factory);
  }
}
