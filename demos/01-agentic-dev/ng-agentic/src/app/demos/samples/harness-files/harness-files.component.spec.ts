import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { HarnessFilesComponent } from './harness-files.component';

describe('HarnessFilesComponent', () => {
  it('shows all three files side by side by default', () => {
    const component = TestBed.createComponent(HarnessFilesComponent).componentInstance;

    expect(component.mode()).toBe('side-by-side');
    expect(component.shown().length).toBe(3);
  });

  it('narrows to one file when a tab is picked', () => {
    const component = TestBed.createComponent(HarnessFilesComponent).componentInstance;

    component.select('AGENTS.md');

    expect(component.mode()).toBe('tabs');
    expect(component.shown().map((file) => file.key)).toEqual(['AGENTS.md']);
  });

  it('carries the v22 defaults rule from the best practices guide', () => {
    const component = TestBed.createComponent(HarnessFilesComponent).componentInstance;
    const claude = component.files.find((file) => file.key === 'CLAUDE.md');

    expect(claude?.content).toContain('ChangeDetectionStrategy.OnPush');
    expect(claude?.content).toContain('default since v22');
  });
});
