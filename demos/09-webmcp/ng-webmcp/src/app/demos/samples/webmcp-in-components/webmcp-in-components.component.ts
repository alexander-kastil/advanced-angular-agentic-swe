import { Component, computed, declareExperimentalWebMcpTool, signal } from '@angular/core';
import { BoxedDirective } from '../../../shared/formatting/formatting-directives';

interface Task {
  id: number;
  title: string;
  done: boolean;
}

@Component({
  selector: 'app-webmcp-in-components',
  templateUrl: './webmcp-in-components.component.html',
  styleUrl: './webmcp-in-components.component.scss',
  imports: [BoxedDirective],
})
export class WebmcpInComponentsComponent {
  private nextId = 4;

  readonly tasks = signal<Task[]>([
    { id: 1, title: 'Walk Soi', done: true },
    { id: 2, title: 'Brush Cleo', done: false },
    { id: 3, title: 'Vet appointment for Giro', done: false },
  ]);

  readonly open = computed(() => this.tasks().filter((task) => !task.done));

  readonly log = signal<string[]>([]);

  readonly agentSurface = signal(this.detectSurface());

  constructor() {
    declareExperimentalWebMcpTool({
      name: 'list_open_tasks',
      description: 'Lists the tasks that are still open in this component.',
      inputSchema: { type: 'object', properties: {} },
      execute: () => {
        this.record('list_open_tasks');
        return JSON.stringify(this.open().map((task) => task.title));
      },
    });

    declareExperimentalWebMcpTool({
      name: 'add_task',
      description: 'Adds a task to this component task list.',
      inputSchema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'The title of the task to add.' },
        },
        required: ['title'],
      },
      execute: ({ title }) => {
        this.addTask(title);
        this.record(`add_task("${title}")`);
        return `Added "${title}"`;
      },
    });

    declareExperimentalWebMcpTool({
      name: 'complete_task',
      description: 'Marks the task with the given id as done.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'The id of the task to complete.' },
        },
        required: ['id'],
      },
      execute: ({ id }) => {
        this.toggle(id);
        this.record(`complete_task(${id})`);
        return `Task ${id} toggled`;
      },
    });
  }

  addTask(title: string) {
    this.tasks.update((list) => [...list, { id: this.nextId++, title, done: false }]);
  }

  toggle(id: number) {
    this.tasks.update((list) =>
      list.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }

  private record(call: string) {
    this.log.update((entries) => [`${new Date().toLocaleTimeString()} ${call}`, ...entries]);
  }

  private detectSurface(): boolean {
    const context =
      (document as unknown as { modelContext?: unknown }).modelContext ??
      (navigator as unknown as { modelContext?: unknown }).modelContext;
    return !!context;
  }
}
