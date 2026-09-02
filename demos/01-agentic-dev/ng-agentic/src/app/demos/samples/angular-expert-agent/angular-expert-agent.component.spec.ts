import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { AngularExpertAgentComponent } from './angular-expert-agent.component';

describe('AngularExpertAgentComponent', () => {
  it('writes the granted tools into the frontmatter', () => {
    const component = TestBed.createComponent(AngularExpertAgentComponent).componentInstance;

    component.toggleTool('Write');
    component.toggleTool('Edit');
    component.setModel('opus');

    expect(component.canWrite()).toBe(false);
    expect(component.agentFile()).toContain('tools: Read, Glob, Grep, Bash');
    expect(component.agentFile()).toContain('model: opus');
  });

  it('scores a placement against its real home', () => {
    const component = TestBed.createComponent(AngularExpertAgentComponent).componentInstance;
    const [first] = component.placements;

    component.guess(first.item, first.home === 'agent' ? 'skill' : 'agent');

    expect(component.isWrong(first)).toBe(true);
    expect(component.correct()).toBe(0);

    component.guess(first.item, first.home);

    expect(component.correct()).toBe(1);
    expect(component.verdict(first)).toContain('Correct.');
  });
});
