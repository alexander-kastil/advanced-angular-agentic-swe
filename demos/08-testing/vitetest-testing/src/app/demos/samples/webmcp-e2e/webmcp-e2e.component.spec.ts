import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebmcpE2eComponent } from './webmcp-e2e.component';

interface RegisteredTool {
  name: string;
  description: string;
  inputSchema: { type: string; properties: Record<string, unknown>; required?: string[] };
  execute: (args: Record<string, string>, client?: { signal: AbortSignal }) => unknown;
}

describe('WebMCP E2E - WebmcpE2eComponent', () => {
  let fixture: ComponentFixture<WebmcpE2eComponent>;
  let component: WebmcpE2eComponent;
  let tools: RegisteredTool[];
  let signals: AbortSignal[];
  const registerTool = vi.fn();

  function tool(name: string): RegisteredTool {
    const found = tools.find((t) => t.name === name);
    if (!found) {
      throw new Error(`tool ${name} was never registered`);
    }
    return found;
  }

  beforeEach(async () => {
    tools = [];
    signals = [];
    registerTool.mockReset();
    registerTool.mockImplementation((registered: RegisteredTool, options: { signal: AbortSignal }) => {
      tools.push(registered);
      signals.push(options.signal);
      return Promise.resolve();
    });

    Object.defineProperty(navigator, 'modelContext', {
      value: { registerTool },
      configurable: true,
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [WebmcpE2eComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(WebmcpE2eComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    delete (navigator as unknown as { modelContext?: unknown }).modelContext;
  });

  it('registers all three tools with the browser bridge', () => {
    expect(registerTool).toHaveBeenCalledTimes(3);
    expect(tools.map((t) => t.name)).toEqual(['list_reading_list', 'add_book', 'mark_read']);
  });

  it('describes every tool for the agent', () => {
    for (const registered of tools) {
      expect(registered.description.length).toBeGreaterThan(10);
      expect(registered.inputSchema.type).toBe('object');
    }
  });

  it('declares the arguments add_book needs', () => {
    expect(tool('add_book').inputSchema.required).toEqual(['title', 'author']);
    expect(Object.keys(tool('add_book').inputSchema.properties)).toEqual(['title', 'author']);
  });

  it('lists the seeded books through list_reading_list', () => {
    const result = tool('list_reading_list').execute({}) as string;

    expect(result).toContain('[read] Refactoring by Martin Fowler');
    expect(result).toContain('[open] Working Effectively with Legacy Code by Michael Feathers');
  });

  it('adds a book through the tool and renders it', () => {
    const result = tool('add_book').execute({ title: 'Test Driven Development', author: 'Kent Beck' });

    expect(result).toBe('Added Test Driven Development by Kent Beck.');
    TestBed.tick();

    const rows = fixture.nativeElement.querySelectorAll('[data-testid="book-row"]');
    expect(rows.length).toBe(3);
    expect(rows[2].textContent).toContain('Test Driven Development');
  });

  it('refuses to add the same title twice', () => {
    tool('add_book').execute({ title: 'Refactoring', author: 'Martin Fowler' });

    expect(component.books().length).toBe(2);
  });

  it('marks a book as read and updates the open count', () => {
    const result = tool('mark_read').execute({ title: 'Working Effectively with Legacy Code' });

    expect(result).toBe('Marked Working Effectively with Legacy Code as read.');
    expect(component.openCount()).toBe(0);

    TestBed.tick();
    expect(fixture.nativeElement.querySelector('[data-testid="open-count"]').textContent).toContain(
      '0 still open'
    );
  });

  it('answers with a message instead of throwing for an unknown title', () => {
    const result = tool('mark_read').execute({ title: 'Nothing Here' });

    expect(result).toBe('Nothing Here is not on the reading list.');
    expect(component.openCount()).toBe(1);
  });

  it('reports the bridge in the template', () => {
    expect(fixture.nativeElement.querySelector('[data-testid="bridge"]').textContent).toContain(
      'WebMCP bridge detected'
    );
  });

  it('aborts the registration signal when the component is destroyed', () => {
    expect(signals.every((s) => !s.aborted)).toBe(true);

    fixture.destroy();

    expect(signals.every((s) => s.aborted)).toBe(true);
  });
});

describe('WebMCP E2E - without a browser bridge', () => {
  beforeEach(() => {
    delete (navigator as unknown as { modelContext?: unknown }).modelContext;
  });

  it('renders without a bridge and says so', async () => {
    await TestBed.configureTestingModule({
      imports: [WebmcpE2eComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(WebmcpE2eComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="bridge"]').textContent).toContain(
      'No WebMCP bridge in this browser'
    );
    expect(fixture.nativeElement.querySelectorAll('[data-testid="book-row"]').length).toBe(2);
  });
});
