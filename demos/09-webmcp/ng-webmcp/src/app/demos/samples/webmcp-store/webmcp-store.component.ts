import { Component, declareExperimentalWebMcpTool, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Priority, SupportQueueStore } from './support-queue.store';

@Component({
  selector: 'app-webmcp-store',
  imports: [FormsModule],
  providers: [SupportQueueStore],
  templateUrl: './webmcp-store.component.html',
  styleUrl: './webmcp-store.component.scss',
})
export class WebmcpStoreComponent {
  protected store = inject(SupportQueueStore);
  protected readonly subject = signal('');
  protected readonly agentSurface = signal(false);
  protected readonly tools = ['list_open_tickets', 'add_ticket', 'close_ticket'];

  constructor() {
    const modelContext =
      (document as unknown as { modelContext?: { registerTool?: unknown } }).modelContext ??
      (navigator as unknown as { modelContext?: { registerTool?: unknown } }).modelContext;
    this.agentSurface.set(typeof modelContext?.registerTool === 'function');

    declareExperimentalWebMcpTool({
      name: 'list_open_tickets',
      description: 'Returns the open support tickets held in the SignalStore of this page.',
      inputSchema: { type: 'object', properties: {} },
      execute: () => {
        this.store.logAgentCall('list_open_tickets');
        return JSON.stringify(this.store.openTickets());
      },
    });

    declareExperimentalWebMcpTool({
      name: 'add_ticket',
      description: 'Adds a support ticket to the queue and returns the created ticket.',
      inputSchema: {
        type: 'object',
        properties: {
          subject: { type: 'string', description: 'Short description of the problem.' },
          priority: { type: 'string', enum: ['low', 'normal', 'high'], description: 'Ticket priority.' },
        },
        required: ['subject'],
      },
      execute: ({ subject, priority }) => {
        const ticket = this.store.addTicket(subject, (priority ?? 'normal') as Priority);
        this.store.logAgentCall(`add_ticket ${subject}`);
        return JSON.stringify(ticket);
      },
    });

    declareExperimentalWebMcpTool({
      name: 'close_ticket',
      description: 'Closes the support ticket with the given id.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'Id of the ticket to close.' },
        },
        required: ['id'],
      },
      execute: ({ id }) => {
        const closed = this.store.closeTicket(id);
        this.store.logAgentCall(`close_ticket ${id}`);
        return closed ? `Ticket ${id} closed.` : `No ticket with id ${id}.`;
      },
    });
  }

  protected add() {
    const subject = this.subject().trim();
    if (!subject) {
      return;
    }
    this.store.addTicket(subject, 'normal');
    this.subject.set('');
  }
}
