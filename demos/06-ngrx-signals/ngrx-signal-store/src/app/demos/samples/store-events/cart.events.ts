import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export const cartEvents = eventGroup({
  source: 'Cart',
  events: {
    added: type<string>(),
    removed: type<string>(),
    cleared: type<void>(),
    checkoutStarted: type<void>(),
    checkoutFinished: type<number>(),
  },
});
