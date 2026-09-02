import { Component, computed, declareExperimentalWebMcpTool, signal } from '@angular/core';
import { CodeBlockComponent } from '../../../shared/code-block/code-block.component';

interface BacklogItem {
  title: string;
  source: 'agent' | 'user';
}

const ADD_ITEM_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'The backlog item to add.' }
  },
  required: ['title']
} as const;

const LIST_ITEMS_SCHEMA = {
  type: 'object',
  properties: {
    source: {
      type: 'string',
      enum: ['all', 'agent', 'user'],
      description: 'Which items to return.'
    }
  }
} as const;

const ADD_ITEM_DESCRIPTION = 'Adds an item to the backlog shown on this page.';
const LIST_ITEMS_DESCRIPTION = 'Reads the backlog currently rendered on this page.';

@Component({
  selector: 'app-webmcp-counterpart',
  templateUrl: './webmcp-counterpart.component.html',
  styleUrl: './webmcp-counterpart.component.scss',
  imports: [CodeBlockComponent]
})
export class WebmcpCounterpartComponent {
  private readonly items = signal<BacklogItem[]>([{ title: 'Port the demo shell', source: 'user' }]);

  readonly backlog = this.items.asReadonly();
  readonly agentAdded = computed(
    () => this.backlog().filter((item) => item.source === 'agent').length
  );

  readonly draft = signal('');
  readonly lastToolResult = signal('');
  readonly registration = signal('Registering...');

  readonly hasModelContext = signal(this.detectModelContext());

  readonly status = computed(() =>
    this.hasModelContext()
      ? 'This browser exposes a model context with a registerTool function. The tools are live and a connected agent can call them.'
      : 'This browser exposes no model context, so declareExperimentalWebMcpTool returns early and registration is a no-op. The same code is unchanged in a browser that has one.'
  );

  readonly agentView = computed(() =>
    JSON.stringify(
      {
        tools: [
          {
            name: 'add_backlog_item',
            description: ADD_ITEM_DESCRIPTION,
            inputSchema: ADD_ITEM_SCHEMA
          },
          {
            name: 'list_backlog_items',
            description: LIST_ITEMS_DESCRIPTION,
            inputSchema: LIST_ITEMS_SCHEMA
          }
        ]
      },
      null,
      2
    )
  );

  readonly declareSnippet = `declareExperimentalWebMcpTool({
  name: 'add_backlog_item',
  description: '${ADD_ITEM_DESCRIPTION}',
  inputSchema: {
    type: 'object',
    properties: { title: { type: 'string', description: 'The backlog item to add.' } },
    required: ['title']
  },
  execute: ({ title }, client) => {
    if (client.signal.aborted) return 'Aborted by the agent.';
    return this.addItem(title, 'agent');
  }
});`;

  readonly provideSnippet = `import { provideExperimentalWebMcpTools } from '@angular/core';
import { provideExperimentalWebMcpForms } from '@angular/forms/signals';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalWebMcpTools([addBacklogItemTool, listBacklogItemsTool]),
    provideExperimentalWebMcpForms()
  ]
};`;

  constructor() {
    const registrations = [
      declareExperimentalWebMcpTool({
        name: 'add_backlog_item',
        description: ADD_ITEM_DESCRIPTION,
        inputSchema: ADD_ITEM_SCHEMA,
        execute: ({ title }, client) => {
          if (client.signal.aborted) {
            return 'Aborted by the agent.';
          }
          return this.addItem(title, 'agent');
        }
      }),
      declareExperimentalWebMcpTool({
        name: 'list_backlog_items',
        description: LIST_ITEMS_DESCRIPTION,
        inputSchema: LIST_ITEMS_SCHEMA,
        execute: ({ source }) => this.listItems(source)
      })
    ];

    Promise.all(registrations).then(
      () =>
        this.registration.set(
          this.hasModelContext()
            ? 'declareExperimentalWebMcpTool resolved. Both tools are registered with the browser.'
            : 'declareExperimentalWebMcpTool resolved without registering. It returned early because no model context was found.'
        ),
      (error: unknown) => this.registration.set(`Registration rejected: ${String(error)}`)
    );
  }

  addItem(title: string, source: BacklogItem['source']): string {
    const trimmed = title.trim();
    if (!trimmed) {
      return 'Rejected: title was empty.';
    }
    this.items.update((items) => [...items, { title: trimmed, source }]);
    const result = `Added "${trimmed}" as item ${this.items().length}.`;
    this.lastToolResult.set(result);
    return result;
  }

  listItems(source?: 'all' | 'agent' | 'user'): string {
    const wanted = source ?? 'all';
    const items =
      wanted === 'all' ? this.backlog() : this.backlog().filter((item) => item.source === wanted);
    const result = items.length
      ? items.map((item, index) => `${index + 1}. ${item.title} (${item.source})`).join('\n')
      : 'The backlog is empty.';
    this.lastToolResult.set(result);
    return result;
  }

  invokeAdd(): void {
    this.addItem(this.draft() || 'Item requested by the agent', 'agent');
    this.draft.set('');
  }

  invokeList(): void {
    this.listItems('all');
  }

  setDraft(value: string): void {
    this.draft.set(value);
  }

  private detectModelContext(): boolean {
    const scope = globalThis as {
      navigator?: { modelContext?: { registerTool?: unknown } };
      document?: { modelContext?: { registerTool?: unknown } };
    };
    const modelContext = scope.document?.modelContext ?? scope.navigator?.modelContext;
    return typeof modelContext?.registerTool === 'function';
  }
}
