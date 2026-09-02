import { Component, computed, signal } from '@angular/core';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

interface HarnessFile {
  key: string;
  path: string;
  readBy: string;
  scope: string;
  content: string;
}

interface RulesFile {
  environment: string;
  file: string;
}

@Component({
  selector: 'app-harness-files',
  templateUrl: './harness-files.component.html',
  styleUrl: './harness-files.component.scss',
  imports: [CodeBlockComponent]
})
export class HarnessFilesComponent {
  readonly files: HarnessFile[] = [
    {
      key: 'CLAUDE.md',
      path: 'CLAUDE.md',
      readBy: 'Claude Code',
      scope: 'Loaded on every turn. Repo root plus any nested folder that carries its own file.',
      content: `# Angular Advanced

Angular 22.x. Standalone by default, zoneless, Vitest.

## Rules (from get_best_practices)
- Do NOT set standalone: true, it is the default since v20
- Do NOT set changeDetection: ChangeDetectionStrategy.OnPush, it is the default since v22
- Use inject(), never constructor injection
- Use input() / output(), and model() for two-way binding
- Use @if / @for / @switch, never *ngIf / *ngFor / *ngSwitch
- Do NOT use @HostBinding / @HostListener, use the host object
- Do NOT use ngClass / ngStyle, use class and style bindings
- Prefer Signal Forms (@angular/forms/signals), stable in v22
- Prefer the @Service decorator over @Injectable({providedIn: 'root'})
- Use NgOptimizedImage for static images
- Must pass AXE checks and WCAG AA minimums

## Repo rules
- Never commit. Leave changes in the working tree.
- Run apps from their project folder, not the repo root.
- Depth lives in .claude/skills/angular-conventions, not here.`
    },
    {
      key: 'AGENTS.md',
      path: 'AGENTS.md',
      readBy: 'Codex, Cursor, JetBrains IDEs, Gemini CLI',
      scope:
        'The vendor neutral equivalent. Keep it a short pointer so one file stays the source of truth.',
      content: `# Agent Instructions

Angular 22. Follow CLAUDE.md in this repository; it is the source of truth.

Commands (run from the app folder):
  npm start        ng serve
  npm run build    production build
  npm test         Vitest via @angular/build:unit-test

Load the Angular CLI MCP server first:
  list_projects -> get_best_practices -> then write code.`
    },
    {
      key: 'copilot-instructions.md',
      path: '.github/copilot-instructions.md',
      readBy: 'GitHub Copilot',
      scope:
        'Repository wide Copilot context. Pair it with .instructions.md files scoped by an applyTo glob.',
      content: `Generate Angular 22 code.

- Signals for state, computed() for derived state, linkedSignal() when it must stay in sync
- inject() for DI, input()/output()/model() for the component API
- Control flow blocks in templates, never the structural directives
- Never emit standalone: true or ChangeDetectionStrategy.OnPush, both are defaults
- Signal Forms over reactive forms for anything new
- No comments in generated code`
    }
  ];

  readonly rulesFiles: RulesFile[] = [
    { environment: 'Antigravity', file: 'GEMINI.md' },
    { environment: 'Copilot powered IDEs', file: '.github/copilot-instructions.md' },
    { environment: 'Cursor', file: 'cursor.md' },
    { environment: 'JetBrains IDEs', file: 'AGENTS.md' },
    { environment: 'VS Code', file: '.instructions.md' },
    { environment: 'Windsurf', file: 'guidelines.md' }
  ];

  readonly mode = signal<'tabs' | 'side-by-side'>('side-by-side');
  readonly selectedKey = signal(this.files[0].key);

  readonly selected = computed(
    () => this.files.find((file) => file.key === this.selectedKey()) ?? this.files[0]
  );

  readonly shown = computed(() => (this.mode() === 'tabs' ? [this.selected()] : this.files));

  readonly totalChars = computed(() =>
    this.files.reduce((sum, file) => sum + file.content.length, 0)
  );

  setMode(mode: 'tabs' | 'side-by-side'): void {
    this.mode.set(mode);
  }

  select(key: string): void {
    this.selectedKey.set(key);
    this.mode.set('tabs');
  }
}
