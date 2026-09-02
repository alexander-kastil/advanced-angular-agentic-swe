import { Component, computed, signal } from '@angular/core';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

type Owner = 'official' | 'house';

interface SkillSource {
  id: Owner;
  name: string;
  origin: string;
  install: string;
  maintainer: string;
  contains: string;
  staleWhen: string;
}

interface Question {
  prompt: string;
  winner: Owner;
  why: string;
}

@Component({
  selector: 'app-agent-skills',
  templateUrl: './agent-skills.component.html',
  styleUrl: './agent-skills.component.scss',
  imports: [CodeBlockComponent]
})
export class AgentSkillsComponent {
  readonly sources: SkillSource[] = [
    {
      id: 'official',
      name: 'Angular Agent Skills',
      origin: 'github.com/angular/skills',
      install: 'npx skills add https://github.com/angular/skills',
      maintainer: 'The Angular team, updated with the framework.',
      contains:
        'angular-developer generates idiomatic code and gives architectural guidance on signals, forms, DI, routing, SSR, accessibility and testing. angular-new-app scaffolds a new app through the CLI.',
      staleWhen: 'Never on framework truth. It ships with the framework release cadence.'
    },
    {
      id: 'house',
      name: 'angular-conventions (this repo)',
      origin: '.claude/skills/angular-conventions/',
      install: 'Committed to the repo. Reconciled with ~/.claude/skills/ in both directions.',
      maintainer: 'You. It encodes decisions nobody outside this codebase can know.',
      contains:
        'The house anti-pattern table, the NgRx Signal Store choice, the Vitest setup, MSAL wiring, the CSS and data-table fixes this codebase already paid for once.',
      staleWhen: 'The moment a decision changes and nobody updates the reference file.'
    }
  ];

  readonly questions: Question[] = [
    {
      prompt: 'What is the signature of httpResource() in v22?',
      winner: 'official',
      why: 'Framework truth. The official skill tracks the release, your notes drift.'
    },
    {
      prompt: 'Scaffold a new Angular app for module 09.',
      winner: 'official',
      why: 'angular-new-app knows the current CLI flags and the modern project shape.'
    },
    {
      prompt: 'Which state library do we use for a feature store here?',
      winner: 'house',
      why: 'A repo decision. No framework skill can know that this class chose NgRx Signal Store.'
    },
    {
      prompt: 'The data table shifts every time a column is sorted.',
      winner: 'house',
      why: 'A bug this codebase already solved. The fix is written down in a reference file.'
    },
    {
      prompt: 'Never emit ChangeDetectionStrategy.OnPush in this repo.',
      winner: 'house',
      why: 'An owner decision. The framework merely says it is the default; the ban is yours.'
    }
  ];

  readonly selectedQuestion = signal(this.questions[0]);

  readonly name = signal('angular-conventions');
  readonly summary = signal('Angular 22 conventions for components, signals, DI and testing.');
  readonly triggers = signal('standalone component, inject(), httpResource(), signal forms');
  readonly references = signal(['components.md', 'signals.md', 'testing.md']);

  readonly triggerList = computed(() =>
    this.triggers()
      .split(',')
      .map((trigger) => trigger.trim())
      .filter(Boolean)
  );

  readonly description = computed(() => {
    const triggers = this.triggerList().join(', ');
    return triggers ? `${this.summary()} Triggers on ${triggers}.` : this.summary();
  });

  readonly descriptionLength = computed(() => this.description().length);
  readonly descriptionOk = computed(() => this.descriptionLength() <= 220);

  readonly skillFile = computed(
    () => `---
name: ${this.name()}
description: ${this.description()}
---

# ${this.name()}

Routing only. Read the ONE matching reference, never all of them.

${this.references()
  .map((reference) => `- ${reference}: references/${reference}`)
  .join('\n')}`
  );

  readonly tree = computed(
    () => `.claude/skills/${this.name()}/
  SKILL.md
${this.references()
  .map((reference) => `  references/${reference}`)
  .join('\n')}`
  );

  selectQuestion(question: Question): void {
    this.selectedQuestion.set(question);
  }

  winner(id: Owner): SkillSource {
    return this.sources.find((source) => source.id === id) ?? this.sources[0];
  }

  setName(value: string): void {
    this.name.set(value);
  }

  setSummary(value: string): void {
    this.summary.set(value);
  }

  setTriggers(value: string): void {
    this.triggers.set(value);
  }
}
