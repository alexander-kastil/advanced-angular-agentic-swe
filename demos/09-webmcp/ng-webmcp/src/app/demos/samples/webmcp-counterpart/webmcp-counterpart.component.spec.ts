import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { WebmcpCounterpartComponent } from './webmcp-counterpart.component';

describe('WebmcpCounterpartComponent', () => {
  it('adds an item through the tool execute path', () => {
    const component = TestBed.createComponent(WebmcpCounterpartComponent).componentInstance;

    const result = component.addItem('Register the tool', 'agent');

    expect(result).toContain('Register the tool');
    expect(component.agentAdded()).toBe(1);
    expect(component.backlog().at(-1)?.title).toBe('Register the tool');
  });

  it('rejects an empty title', () => {
    const component = TestBed.createComponent(WebmcpCounterpartComponent).componentInstance;

    expect(component.addItem('   ', 'agent')).toBe('Rejected: title was empty.');
    expect(component.agentAdded()).toBe(0);
  });

  it('filters the listing by source', () => {
    const component = TestBed.createComponent(WebmcpCounterpartComponent).componentInstance;

    component.addItem('Added by the agent', 'agent');

    expect(component.listItems('agent')).toBe('1. Added by the agent (agent)');
    expect(component.listItems('user')).toContain('Port the demo shell');
  });

  it('advertises both tools with a schema the agent can read', () => {
    const component = TestBed.createComponent(WebmcpCounterpartComponent).componentInstance;
    const advertised = JSON.parse(component.agentView()) as {
      tools: { name: string; inputSchema: { required?: string[] } }[];
    };

    expect(advertised.tools.map((tool) => tool.name)).toEqual([
      'add_backlog_item',
      'list_backlog_items'
    ]);
    expect(advertised.tools[0].inputSchema.required).toEqual(['title']);
  });

  it('reports that jsdom exposes no model context', () => {
    const component = TestBed.createComponent(WebmcpCounterpartComponent).componentInstance;

    expect(component.hasModelContext()).toBe(false);
    expect(component.status()).toContain('no model context');
  });
});
