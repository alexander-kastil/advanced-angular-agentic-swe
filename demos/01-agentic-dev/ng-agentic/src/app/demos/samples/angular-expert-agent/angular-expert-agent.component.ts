import { Component, computed, signal } from '@angular/core';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

type Home = 'agent' | 'skill';

interface RoutingCase {
  prompt: string;
  agent: string;
  why: string;
}

interface Placement {
  item: string;
  home: Home;
  why: string;
}

@Component({
  selector: 'app-angular-expert-agent',
  templateUrl: './angular-expert-agent.component.html',
  styleUrl: './angular-expert-agent.component.scss',
  imports: [CodeBlockComponent]
})
export class AngularExpertAgentComponent {
  readonly allTools = ['Read', 'Edit', 'Write', 'Glob', 'Grep', 'Bash', 'WebFetch', 'Task'];
  readonly models = ['inherit', 'haiku', 'sonnet', 'opus'];

  readonly tools = signal(['Read', 'Edit', 'Write', 'Glob', 'Grep', 'Bash']);
  readonly model = signal('inherit');

  readonly placements: Placement[] = [
    {
      item: 'Never run dotnet ef migrations in this repo',
      home: 'agent',
      why: 'A hard prohibition. It has to sit in the system prompt so it loads whenever the agent runs, not only when a skill description happens to match.'
    },
    {
      item: 'The signature of httpResource() and when to use it',
      home: 'skill',
      why: 'Reference material. It belongs in a file the agent opens on demand, not in a prompt that loads every time.'
    },
    {
      item: 'Report the command you ran and its output, never just "verified"',
      home: 'agent',
      why: 'A behavioural contract for this agent. It shapes every reply, so it lives in the prompt.'
    },
    {
      item: 'How to wire MSAL login and what interaction_in_progress means',
      home: 'skill',
      why: 'Deep, occasional and long. Exactly what a reference file is for.'
    },
    {
      item: 'Tool allowlist: no Bash for a review-only agent',
      home: 'agent',
      why: 'Frontmatter. A skill cannot restrict capability, only the agent definition can.'
    },
    {
      item: 'The house anti-pattern table with its modern replacements',
      home: 'skill',
      why: 'It grows. Put it where it can grow without taxing every turn and point the agent at it.'
    }
  ];

  readonly guesses = signal<Record<string, Home>>({});

  readonly answered = computed(() => Object.keys(this.guesses()).length);

  readonly correct = computed(
    () =>
      this.placements.filter((placement) => this.guesses()[placement.item] === placement.home).length
  );

  readonly routingCases: RoutingCase[] = [
    {
      prompt: 'Migrate the customer list to httpResource()',
      agent: 'angular-expert',
      why: 'Angular surface, the expert owns the conventions and the anti-pattern table.'
    },
    {
      prompt: 'Why does the API return 500 on POST /customers?',
      agent: 'dotnet-expert',
      why: 'Server side, a different expert owns it.'
    },
    {
      prompt: 'Rename this variable',
      agent: 'main thread',
      why: 'A trivial one liner. Routing costs more than the edit.'
    },
    {
      prompt: 'Deploy the built app to the server',
      agent: 'main thread',
      why: 'A subagent cannot escalate permissions, so every mutation of a live system stays here.'
    }
  ];

  readonly selectedCase = signal(this.routingCases[0]);

  readonly agentFile = computed(
    () => `---
name: angular-expert
description: Angular 22 work: components, signals, routing, forms, testing. Use for any Angular change before writing code.
tools: ${this.tools().join(', ')}
model: ${this.model()}
---

You are the Angular owner for this repository.

Load the angular-conventions skill before writing code and read the ONE matching reference.

HARD RULES
- Never write standalone: true or ChangeDetectionStrategy.OnPush, both are defaults in 22.
- Never commit, stage or push. Leave changes in the working tree.
- Never edit a folder outside the module you were given.

REPORTING
Name the command you ran and paste its output. "Verified" is not a result.`
  );

  readonly toolCount = computed(() => this.tools().length);

  readonly canWrite = computed(() =>
    this.tools().some((tool) => tool === 'Edit' || tool === 'Write')
  );

  toggleTool(tool: string): void {
    this.tools.update((tools) =>
      tools.includes(tool) ? tools.filter((entry) => entry !== tool) : [...tools, tool]
    );
  }

  setModel(model: string): void {
    this.model.set(model);
  }

  guess(item: string, home: Home): void {
    this.guesses.update((guesses) => ({ ...guesses, [item]: home }));
  }

  guessFor(item: string): Home | undefined {
    return this.guesses()[item];
  }

  verdict(placement: Placement): string {
    const answer = this.guessFor(placement.item);
    if (!answer) {
      return '';
    }
    const lead =
      answer === placement.home ? 'Correct.' : `It belongs in the ${placement.home} instead.`;
    return `${lead} ${placement.why}`;
  }

  isWrong(placement: Placement): boolean {
    const answer = this.guessFor(placement.item);
    return answer !== undefined && answer !== placement.home;
  }

  reset(): void {
    this.guesses.set({});
  }

  selectCase(routingCase: RoutingCase): void {
    this.selectedCase.set(routingCase);
  }
}
