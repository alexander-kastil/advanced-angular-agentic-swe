import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { AngularMcpServerComponent } from './angular-mcp-server.component';

describe('AngularMcpServerComponent', () => {
  it('registers every tool as stable by default', () => {
    const component = TestBed.createComponent(AngularMcpServerComponent).componentInstance;

    expect(component.visibleTools().length).toBe(component.tools.length);
    expect(component.experimentalCount()).toBe(0);
  });

  it('drops the mutating tools under --read-only', () => {
    const component = TestBed.createComponent(AngularMcpServerComponent).componentInstance;

    component.toggleReadOnly();

    expect(component.visibleTools().map((tool) => tool.name)).not.toContain('run_target');
    expect(component.visibleTools().map((tool) => tool.name)).toContain('list_projects');
  });

  it('drops the only networked tool under --local-only', () => {
    const component = TestBed.createComponent(AngularMcpServerComponent).componentInstance;

    component.toggleLocal();

    expect(component.visibleTools().map((tool) => tool.name)).not.toContain('search_documentation');
    expect(component.droppedCount()).toBe(1);
  });
});
