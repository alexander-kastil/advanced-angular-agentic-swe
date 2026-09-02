import { inject } from '@angular/core';
import { computed } from '@angular/core';
import { signalStore, withComputed, withState } from '@ngrx/signals';
import { Events, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { delay, map } from 'rxjs/operators';
import { cartEvents } from './cart.events';

type CartState = {
  lines: string[];
  log: string[];
  checkingOut: boolean;
  orderNumber: number | null;
};

export const CartStore = signalStore(
  withState<CartState>({ lines: [], log: [], checkingOut: false, orderNumber: null }),
  withComputed(({ lines }) => ({
    lineCount: computed(() => lines().length),
  })),
  withReducer(
    on(cartEvents.added, ({ payload }, state) => ({
      lines: [...state.lines, payload],
      log: [`added ${payload}`, ...state.log],
    })),
    on(cartEvents.removed, ({ payload }, state) => ({
      lines: state.lines.filter((l) => l !== payload),
      log: [`removed ${payload}`, ...state.log],
    })),
    on(cartEvents.cleared, (_, state) => ({ lines: [], log: ['cleared', ...state.log] })),
    on(cartEvents.checkoutStarted, (_, state) => ({
      checkingOut: true,
      log: ['checkout started', ...state.log],
    })),
    on(cartEvents.checkoutFinished, ({ payload }, state) => ({
      checkingOut: false,
      orderNumber: payload,
      lines: [],
      log: [`order ${payload} placed`, ...state.log],
    }))
  ),
  withEventHandlers((_, events = inject(Events)) => ({
    checkout$: events.on(cartEvents.checkoutStarted).pipe(
      delay(900),
      map(() => cartEvents.checkoutFinished(Math.floor(Math.random() * 9000) + 1000))
    ),
  }))
);
