import { EntityMetadataMap } from '@ngrx/data';
import { Skill } from './skill.model';

export function sortByName(a: Skill, b: Skill): number {
  let comp = a.name.localeCompare(b.name);
  return comp;
}

export const entityMetadata: EntityMetadataMap = {
  Skill: {
    selectId: (skill: Skill) => skill.id,
    sortComparer: sortByName,
  },
};

export const skillsEntityConfig = {
  entityMetadata,
};
