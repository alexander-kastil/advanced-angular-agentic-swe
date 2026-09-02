import { httpResource } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { environment } from 'src/environments/environment';
import { Skill } from '../../skills/skills';

interface MigrationRule {
  antiPattern: string;
  replacement: string;
  section: string;
}

interface AgentTool {
  tool: string;
  server: string;
  usedFor: string;
}

@Component({
  selector: 'app-rxjs-to-signals-migration',
  templateUrl: './rxjs-to-signals-migration.component.html',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatChipSet,
    MatChip,
    MatProgressBar,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    FormsModule,
  ],
  styles: `
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    pre { font-size: 0.78rem; overflow: auto; white-space: pre-wrap; }
    table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid rgba(128, 128, 128, 0.3); }
    .prompt { font-family: monospace; font-size: 0.8rem; white-space: pre-wrap; background: rgba(128, 128, 128, 0.12); padding: 12px; border-radius: 6px; }
    .copied { font-size: 0.8rem; margin-left: 12px; color: #2e7d32; }
    .step { display: flex; gap: 10px; padding: 4px 0; font-size: 0.86rem; }
    .step strong { min-width: 1.4rem; }
  `,
})
export class RxjsToSignalsMigrationComponent {
  protected readonly source = `@Injectable({ providedIn: 'root' })
export class SkillsStore {
  private state$ = new BehaviorSubject<State>({ status: 'idle', data: [] });

  status$ = this.state$.pipe(map(s => s.status));
  data$ = this.state$.pipe(map(s => s.data));

  load() {
    this.state$.next({ ...this.state$.value, status: 'loading' });
    this.http.get<Skill[]>(url).subscribe({
      next: data => this.state$.next({ status: 'success', data }),
      error: () => this.state$.next({ status: 'error', data: [] }),
    });
  }
}`;

  protected readonly migrated = `export class SkillsComponent {
  protected filter = signal('');
  protected skills = httpResource<Skill[]>(() => \`\${environment.api}skills\`);

  protected visible = computed(() =>
    (this.skills.value() ?? []).filter(s =>
      s.name.toLowerCase().includes(this.filter().toLowerCase())));
}`;

  protected readonly prompt = `Migrate migration-exercise/skills.store.ts from BehaviorSubject to signals.

Before you write anything, call the angular-cli MCP server:
  1. list_projects        - confirm the workspace and project name
  2. get_best_practices   - load the rules for the installed Angular version
  3. search_documentation - look up httpResource and rxResource before choosing between them

Then apply the repository rule set in
.claude/skills/angular-conventions/references/angular-antipatterns.md,
sections "State Management" and "Data Loading".

Constraints:
- Keep the public method names: load(), reload(), setFilter().
- Delete the hand-rolled status machine rather than translating it.
- Derived state is computed(), never an effect() that writes a signal.

Report back as a table: changed line -> the antipatterns row it satisfies.
Finish by running the build with run_target (target "build").`;

  protected readonly tools: AgentTool[] = [
    {
      tool: 'list_projects',
      server: 'angular-cli',
      usedFor: 'find the workspace path and project name before editing',
    },
    {
      tool: 'get_best_practices',
      server: 'angular-cli',
      usedFor: 'load the coding standards for the installed Angular version',
    },
    {
      tool: 'search_documentation',
      server: 'angular-cli',
      usedFor: 'check httpResource and rxResource semantics against angular.dev',
    },
    {
      tool: 'run_target',
      server: 'angular-cli',
      usedFor: 'run build and test without leaving the agent loop',
    },
    {
      tool: 'onpush_zoneless_migration',
      server: 'angular-cli',
      usedFor: 'the related change-detection migration, not needed here',
    },
  ];

  protected readonly steps = [
    'Point the agent at one file, not at the folder.',
    'Name the rule set in the prompt so the review has a fixed reference.',
    'Fence the blast radius: method names, template, public API.',
    'Demand the mapping table so every change is justified by a row.',
    'Verify with run_target, then read the diff yourself.',
  ];

  protected readonly rules: MigrationRule[] = [
    {
      antiPattern: 'BehaviorSubject for local state',
      replacement: 'signal()',
      section: 'State Management',
    },
    {
      antiPattern: 'subscribe() in component body',
      replacement: 'toSignal(), async pipe, or resource()',
      section: 'State Management',
    },
    {
      antiPattern: 'Observable-only state without signals',
      replacement: 'Combine with toSignal() or use resource()',
      section: 'State Management',
    },
    {
      antiPattern: 'Manual http.get() + BehaviorSubject wiring',
      replacement: 'httpResource() or resource()',
      section: 'Data Loading',
    },
    {
      antiPattern: 'subscribe() in ngOnInit for HTTP',
      replacement: 'resource() with declarative loader',
      section: 'Data Loading',
    },
  ];

  protected copied = signal(false);

  protected filter = signal('');
  protected skills = httpResource<Skill[]>(() => `${environment.api}skills`);

  protected visible = computed(() =>
    (this.skills.value() ?? []).filter((skill) =>
      skill.name.toLowerCase().includes(this.filter().toLowerCase()),
    ),
  );

  protected async copyPrompt() {
    await navigator.clipboard.writeText(this.prompt);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
