import { Component, computed, signal } from '@angular/core';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

interface HookEvent {
  event: string;
  fires: string;
  matcher: string;
  command: string;
  gate: string;
  blocking: boolean;
}

interface BannedApi {
  pattern: RegExp;
  api: string;
  replacement: string;
}

@Component({
  selector: 'app-hooks-and-gates',
  templateUrl: './hooks-and-gates.component.html',
  styleUrl: './hooks-and-gates.component.scss',
  imports: [CodeBlockComponent]
})
export class HooksAndGatesComponent {
  readonly events: HookEvent[] = [
    {
      event: 'PostToolUse',
      fires: 'After a write succeeds. The place for formatters, linters and type checks.',
      matcher: 'Edit|Write',
      command: 'npx prettier --write "$CLAUDE_FILE_PATHS"',
      gate: 'Every generated file lands formatted. Nobody has to ask for it.',
      blocking: false
    },
    {
      event: 'PreToolUse',
      fires: 'Before the tool runs. Exit code 2 blocks the call and the message goes back to the model.',
      matcher: 'Edit|Write',
      command: 'node .claude/hooks/block-banned-api.mjs',
      gate: 'A banned API never reaches disk, whatever the model was about to write.',
      blocking: true
    },
    {
      event: 'PreToolUse',
      fires: 'Before a shell command runs. The only reliable way to forbid one.',
      matcher: 'Bash',
      command: 'node .claude/hooks/deny-git-commit.mjs',
      gate: 'git commit is refused even when the model is convinced it should commit.',
      blocking: true
    },
    {
      event: 'UserPromptSubmit',
      fires: 'Before the model sees the prompt. Injects context or refuses the turn.',
      matcher: '',
      command: 'node .claude/hooks/route-to-expert.mjs',
      gate: 'Names the owning agent so subject-matter work gets delegated instead of improvised.',
      blocking: true
    },
    {
      event: 'Stop',
      fires: 'When the agent wants to finish. Exit code 2 sends it back to work.',
      matcher: '',
      command: 'npm run build --prefix demos/01-agentic-dev/ng-agentic',
      gate: 'The session cannot end on a red build.',
      blocking: true
    }
  ];

  private readonly banned: BannedApi[] = [
    {
      pattern: /standalone:\s*true/,
      api: 'standalone: true',
      replacement: 'Remove it. Standalone is the default since v20.'
    },
    {
      pattern: /changeDetection:\s*ChangeDetectionStrategy\.OnPush/,
      api: 'ChangeDetectionStrategy.OnPush',
      replacement: 'Remove it. OnPush is the default since v22.'
    },
    {
      pattern: /\*ng(If|For|Switch)/,
      api: '*ngIf / *ngFor / *ngSwitch',
      replacement: 'Use the @if / @for / @switch control flow blocks.'
    },
    {
      pattern: /@(Input|Output)\(/,
      api: '@Input() / @Output()',
      replacement: 'Use the input() and output() signal functions.'
    },
    {
      pattern: /@Host(Binding|Listener)\(/,
      api: '@HostBinding / @HostListener',
      replacement: 'Use the host object in the decorator.'
    },
    {
      pattern: /\[ng(Class|Style)\]/,
      api: 'ngClass / ngStyle',
      replacement: 'Use [class.x] and [style.x] bindings.'
    },
    {
      pattern: /withXhr\(/,
      api: 'withXhr()',
      replacement: 'Remove it. Fetch is the v22 default for HttpClient.'
    },
    {
      pattern: /new BehaviorSubject/,
      api: 'BehaviorSubject',
      replacement: 'Use signal() for local state.'
    }
  ];

  readonly selected = signal(this.events[0]);
  readonly enabled = signal(true);

  readonly draft = signal(`@Component({
  selector: 'app-customer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<div *ngIf="open">{{ name }}</div>'
})
export class CustomerComponent {
  @Input() name = '';
}`);

  readonly violations = computed(() =>
    this.banned.filter((entry) => entry.pattern.test(this.draft()))
  );

  readonly exitCode = computed(() => (this.enabled() && this.violations().length ? 2 : 0));

  readonly hookOutput = computed(() => {
    if (!this.enabled()) {
      return 'Hook disabled. The write goes through and the rule now depends on the model remembering it.';
    }
    if (!this.violations().length) {
      return 'exit 0 - nothing banned in this write, the tool call proceeds.';
    }
    const lines = this.violations().map((entry) => `  ${entry.api}: ${entry.replacement}`);
    return [
      'exit 2 - write blocked. stderr is fed back to the model as the reason:',
      ...lines
    ].join('\n');
  });

  readonly settings = computed(() => {
    const hook = this.selected();
    const entry = hook.matcher
      ? { matcher: hook.matcher, hooks: [{ type: 'command', command: hook.command }] }
      : { hooks: [{ type: 'command', command: hook.command }] };
    return JSON.stringify({ hooks: { [hook.event]: [entry] } }, null, 2);
  });

  readonly fullSettings = computed(() => {
    const grouped: Record<string, unknown[]> = {};
    for (const hook of this.events) {
      const entry = hook.matcher
        ? { matcher: hook.matcher, hooks: [{ type: 'command', command: hook.command }] }
        : { hooks: [{ type: 'command', command: hook.command }] };
      grouped[hook.event] = [...(grouped[hook.event] ?? []), entry];
    }
    return JSON.stringify({ hooks: grouped }, null, 2);
  });

  readonly hookScript = `#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const BANNED = [
  [/standalone:\\s*true/, 'standalone: true is the default since v20'],
  [/changeDetection:\\s*ChangeDetectionStrategy\\.OnPush/, 'OnPush is the default since v22'],
  [/\\*ng(If|For|Switch)/, 'use @if / @for / @switch'],
  [/@(Input|Output)\\(/, 'use input() / output()'],
  [/@Host(Binding|Listener)\\(/, 'use the host object'],
  [/\\[ng(Class|Style)\\]/, 'use [class.x] and [style.x] bindings'],
  [/withXhr\\(/, 'fetch is the v22 default'],
  [/new BehaviorSubject/, 'use signal() for local state']
];

const payload = JSON.parse(readFileSync(0, 'utf8'));
const text = payload.tool_input?.content ?? payload.tool_input?.new_string ?? '';

const hits = BANNED.filter(([pattern]) => pattern.test(text));
if (hits.length) {
  console.error('Banned API in this write:');
  for (const [, reason] of hits) console.error('- ' + reason);
  process.exit(2);
}
process.exit(0);`;

  select(event: HookEvent): void {
    this.selected.set(event);
  }

  toggle(): void {
    this.enabled.update((enabled) => !enabled);
  }

  setDraft(value: string): void {
    this.draft.set(value);
  }
}
