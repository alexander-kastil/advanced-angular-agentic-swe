import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

export type Priority = 'low' | 'normal' | 'high';

export type Ticket = {
  id: number;
  subject: string;
  priority: Priority;
  open: boolean;
};

type SupportQueueState = {
  tickets: Ticket[];
  agentCalls: string[];
};

const seed: Ticket[] = [
  { id: 1, subject: 'Signal input not updating', priority: 'high', open: true },
  { id: 2, subject: 'Store devtools missing', priority: 'low', open: true },
  { id: 3, subject: 'Zoneless build warning', priority: 'normal', open: false },
];

export const SupportQueueStore = signalStore(
  withState<SupportQueueState>({ tickets: seed, agentCalls: [] }),
  withComputed(({ tickets }) => ({
    openTickets: computed(() => tickets().filter((t) => t.open)),
    openCount: computed(() => tickets().filter((t) => t.open).length),
  })),
  withMethods((store) => ({
    addTicket(subject: string, priority: Priority): Ticket {
      const id = Math.max(0, ...store.tickets().map((t) => t.id)) + 1;
      const ticket: Ticket = { id, subject, priority, open: true };
      patchState(store, { tickets: [...store.tickets(), ticket] });
      return ticket;
    },
    closeTicket(id: number): boolean {
      const known = store.tickets().some((t) => t.id === id);
      patchState(store, {
        tickets: store.tickets().map((t) => (t.id === id ? { ...t, open: false } : t)),
      });
      return known;
    },
    logAgentCall(entry: string) {
      patchState(store, { agentCalls: [entry, ...store.agentCalls()].slice(0, 10) });
    },
    reset() {
      patchState(store, { tickets: seed, agentCalls: [] });
    },
  }))
);
