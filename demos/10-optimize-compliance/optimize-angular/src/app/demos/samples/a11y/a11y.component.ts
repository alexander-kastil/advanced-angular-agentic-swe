import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { Listbox, Option } from '@angular/aria/listbox';

interface Violation {
  id: string;
  impact: string;
  help: string;
  nodes: number;
}

@Component({
  selector: 'app-a11y',
  templateUrl: './a11y.component.html',
  styleUrls: ['./a11y.component.scss'],
  imports: [Tabs, TabList, Tab, TabPanel, TabContent, Listbox, Option]
})
export class A11yComponent {
  private readonly scope = viewChild.required<ElementRef<HTMLElement>>('scope');

  readonly selectedTab = signal<string | undefined>('criteria');
  readonly contrastMode = signal<string[]>(['aa']);

  readonly criteria = [
    { id: '2.4.11', level: 'AA', title: 'Focus Not Obscured (Minimum)', detail: 'A focused element must not be entirely hidden by sticky headers or overlays.' },
    { id: '2.5.7', level: 'AA', title: 'Dragging Movements', detail: 'Every drag interaction needs a single-pointer alternative such as a menu or buttons.' },
    { id: '2.5.8', level: 'AA', title: 'Target Size (Minimum)', detail: 'Pointer targets are at least 24 by 24 CSS pixels, or spaced far enough apart.' },
    { id: '3.2.6', level: 'A', title: 'Consistent Help', detail: 'Help mechanisms appear in the same relative order on every page.' },
    { id: '3.3.7', level: 'A', title: 'Redundant Entry', detail: 'Information already entered in a process is auto-filled or offered for selection.' },
    { id: '3.3.8', level: 'AA', title: 'Accessible Authentication (Minimum)', detail: 'No cognitive function test unless an alternative or a mechanism to assist exists.' }
  ];

  readonly lintRules = [
    '@angular-eslint/template/alt-text',
    '@angular-eslint/template/elements-content',
    '@angular-eslint/template/label-has-associated-control',
    '@angular-eslint/template/table-scope',
    '@angular-eslint/template/valid-aria',
    '@angular-eslint/template/click-events-have-key-events',
    '@angular-eslint/template/interactive-supports-focus',
    '@angular-eslint/template/no-autofocus',
    '@angular-eslint/template/button-has-type'
  ];

  readonly violations = signal<Violation[] | null>(null);
  readonly scanning = signal(false);
  readonly scanError = signal('');

  async runAxe() {
    this.scanning.set(true);
    this.scanError.set('');
    try {
      const axe = await import('axe-core');
      const result = await axe.default.run(this.scope().nativeElement, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] }
      });
      this.violations.set(
        result.violations.map(violation => ({
          id: violation.id,
          impact: violation.impact ?? 'unknown',
          help: violation.help,
          nodes: violation.nodes.length
        }))
      );
    } catch (error) {
      this.scanError.set(error instanceof Error ? error.message : 'axe-core could not run in this context.');
    } finally {
      this.scanning.set(false);
    }
  }
}
