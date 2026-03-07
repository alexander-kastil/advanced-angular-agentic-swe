import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SkillsComponent } from './skills.component';

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds a skill when the entered name is not empty', () => {
    component.updateSkillName({ target: { value: 'Angular' } } as unknown as Event);

    component.addSkill();

    expect(component.skills()).toEqual([
      {
        id: 1,
        name: 'Angular',
        hours: 4,
        completed: false,
      },
    ]);
    expect(component.skillName()).toBe('');
  });

  it('removes a skill from the local editable list', () => {
    fixture.componentRef.setInput('skills', [
      { id: 1, name: 'Angular', hours: 4, completed: false },
      { id: 2, name: 'RxJS', hours: 3, completed: true },
    ]);
    fixture.detectChanges();

    component.removeSkill({ id: 1, name: 'Angular', hours: 4, completed: false });

    expect(component.skills()).toEqual([
      { id: 2, name: 'RxJS', hours: 3, completed: true },
    ]);
  });

  it('emits the current skills when save is triggered', () => {
    fixture.componentRef.setInput('skills', [
      { id: 1, name: 'Angular', hours: 4, completed: false },
    ]);
    fixture.detectChanges();
    const emitSpy = vi.fn();
    const subscription = component.skillsSaved.subscribe(emitSpy);

    component.saveSkills();

    expect(emitSpy).toHaveBeenCalledWith([
      { id: 1, name: 'Angular', hours: 4, completed: false },
    ]);
    subscription.unsubscribe();
  });
});
