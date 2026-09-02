import {
  Component,
  DOCUMENT,
  computed,
  declareExperimentalWebMcpTool,
  inject,
  provideExperimentalWebMcpTools,
  signal,
} from '@angular/core';
import { BorderDirective } from '../../../shared/formatting/formatting-directives';

export const webMcpSignalProviders = [
  provideExperimentalWebMcpTools([
    {
      name: 'describe_signals_demo',
      description: 'Describes what the signals demo page exposes to an agent.',
      inputSchema: { type: 'object', properties: {} },
      execute: () =>
        'This page exposes read_counter and set_counter, backed by a single Angular signal.',
    },
  ]),
];

@Component({
  selector: 'app-webmcp-signal',
  imports: [BorderDirective],
  template: `
    <div border class="state">
      <div>counter signal: {{ counter() }}</div>
      <div>doubled (computed): {{ doubled() }}</div>
      <div>WebMCP host detected: {{ hostAvailable() ? 'yes' : 'no' }}</div>
    </div>

    <div class="actions">
      <button type="button" class="btn btn-primary" (click)="increment()">Increment</button>
      <button type="button" class="btn btn-primary" (click)="reset()">Reset</button>
    </div>

    <div border class="log">
      <div class="log-label">Agent calls</div>
      @for (entry of log(); track $index) {
        <div><code>{{ entry }}</code></div>
      } @empty {
        <div>No tool has been invoked yet.</div>
      }
    </div>
  `,
  styles: `
    .state,
    .log {
      display: flex;
      flex-direction: column;
      gap: var(--gap-small);
    }

    .log-label {
      font-weight: bold;
    }

    .actions {
      display: flex;
      flex-direction: row;
      gap: var(--gap-small);
      margin: var(--gap-medium) 0;
    }
  `,
})
export class WebmcpSignalComponent {
  private readonly document = inject(DOCUMENT);

  readonly counter = signal(0, { debugName: 'mcpCounter' });
  readonly doubled = computed(() => this.counter() * 2);
  readonly log = signal<string[]>([]);
  readonly hostAvailable = signal(this.detectHost());

  constructor() {
    declareExperimentalWebMcpTool({
      name: 'read_counter',
      description: 'Reads the current value of the counter signal on this page.',
      inputSchema: { type: 'object', properties: {} },
      execute: () => {
        const value = this.counter();
        this.append(`read_counter -> ${value}`);
        return `${value}`;
      },
    });

    declareExperimentalWebMcpTool({
      name: 'set_counter',
      description: 'Sets the counter signal on this page to a new value.',
      inputSchema: {
        type: 'object',
        properties: {
          value: { type: 'number', description: 'The new counter value.' },
        },
        required: ['value'],
      },
      execute: ({ value }) => {
        this.counter.set(value);
        this.append(`set_counter(${value})`);
        return `counter is now ${value}`;
      },
    });
  }

  increment() {
    this.counter.update((c) => c + 1);
  }

  reset() {
    this.counter.set(0);
  }

  private append(entry: string) {
    this.log.update((entries) => [...entries, entry]);
  }

  private detectHost() {
    const doc = this.document as Document & { modelContext?: unknown };
    const nav = this.document.defaultView?.navigator as (Navigator & { modelContext?: unknown }) | undefined;
    return !!doc.modelContext || !!nav?.modelContext;
  }
}
