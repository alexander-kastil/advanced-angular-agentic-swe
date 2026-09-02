import { ComponentClassComponent } from './component-class.component';
import { Skill } from '../../../skills/skill.model';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Component - Class Only Test - ComponentClassComponent', () => {
  let component: ComponentClassComponent;

  beforeEach(() => {
    component = new ComponentClassComponent();
  });

  it('should create with initial skills', () => {
    expect(component).toBeTruthy();
    expect(component.skills()).toHaveLength(2);
  });

  it('should have correct title', () => {
    expect(component.title).toBe('Skills');
  });

  it('should add a skill to the list', () => {
    const item: Skill = { id: 10, name: 'NgRx', completed: false };
    component.addSkill(item);

    expect(component.skills()).toHaveLength(3);
    expect(component.skills()[2]).toEqual(item);
  });

  it('should add multiple skills', () => {
    const items: Skill[] = [
      { id: 5, name: 'RxJs', completed: false },
      { id: 6, name: 'Vitest', completed: true },
    ];

    items.forEach(item => component.addSkill(item));

    expect(component.skills()).toHaveLength(4);
  });
});
