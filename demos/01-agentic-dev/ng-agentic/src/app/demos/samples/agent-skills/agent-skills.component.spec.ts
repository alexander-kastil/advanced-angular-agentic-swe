import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { AgentSkillsComponent } from './agent-skills.component';

describe('AgentSkillsComponent', () => {
  it('builds the frontmatter description from summary and triggers', () => {
    const component = TestBed.createComponent(AgentSkillsComponent).componentInstance;

    component.setSummary('Angular conventions.');
    component.setTriggers('inject(), signal forms');

    expect(component.triggerList()).toEqual(['inject()', 'signal forms']);
    expect(component.description()).toBe('Angular conventions. Triggers on inject(), signal forms.');
    expect(component.skillFile()).toContain('description: Angular conventions.');
  });

  it('routes framework questions to the official skill and repo decisions to the house one', () => {
    const component = TestBed.createComponent(AgentSkillsComponent).componentInstance;
    const framework = component.questions.find((question) => question.prompt.includes('httpResource'));
    const house = component.questions.find((question) => question.prompt.includes('state library'));

    expect(framework?.winner).toBe('official');
    expect(house?.winner).toBe('house');
    expect(component.winner('official').origin).toBe('github.com/angular/skills');
  });
});
